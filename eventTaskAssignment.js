import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ScrollView,
    Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import {
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { db } from "./src/firebase";
import QRCode from "react-native-qrcode-svg";

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get("window");

const TaskManager = ({ route }) => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [coordinatorId, setCoordinatorId] = useState("");
    // const [universityId, setUniversityId] = useState("");
    // const [eventId, setEventId] = useState("");
    const [priority, setPriority] = useState("Normal");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [qrData, setQrData] = useState("");
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const svgRef = useRef();

    const { eventId, universityId, managerId, eventName } = route.params;
    console.log("University ID:", universityId); // Debug log
    console.log("Manager ID:", managerId);
    console.log("Manager ID:", eventId);

    useEffect(() => {
        if (eventId) {
            fetchTasks(eventId);
        }
    }, [eventId]);

    // const saveTasks = async (tasksToSave) => {
    //     try {
    //         await AsyncStorage.setItem("tasks", JSON.stringify(tasksToSave));
    //     } catch (error) {
    //         Alert.alert("Error", "Failed to save tasks.");
    //     }
    // };

    const generateQRCode = (event) => {
        const qrData = {
            eventId: eventId,
            eventName: eventName,
            timestamp: new Date().toISOString(),
            type: "coordinator",
        };

        setQrData(JSON.stringify(qrData));
        setSelectedEvent(event);
        setQrModalVisible(true);
    };

    const fetchTasks = async (eventId) => {
        try {
            const eventRef = doc(db, "events", eventId);
            const tasksCollectionRef = collection(eventRef, "tasks");
            const querySnapshot = await getDocs(tasksCollectionRef);

            const tasksData = [];
            querySnapshot.forEach((doc) => {
                tasksData.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            setTasks(tasksData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const createTask = async () => {
        if (
            taskName &&
            coordinatorId &&
            eventId &&
            universityId &&
            priority &&
            dueDate &&
            description
        ) {
            try {
                // First check if coordinator exists in coordinatorList
                const eventRef = doc(db, "events", eventId);
                const eventDoc = await getDoc(eventRef);

                if (!eventDoc.exists()) {
                    Alert.alert("Error", "Event not found");
                    return;
                }

                const eventData = eventDoc.data();
                const coordinatorList = eventData.coordinatorList || [];

                // Check if coordinatorId exists in the coordinatorList
                if (!coordinatorList.includes(coordinatorId)) {
                    Alert.alert(
                        "Error",
                        "Coordinator is not assigned to this event"
                    );
                    return;
                }

                const taskData = {
                    taskName,
                    coordinatorId,
                    eventId,
                    universityId,
                    priority,
                    dueDate,
                    description,
                    status: "Assigned",
                    completed: false,
                    timestamp: new Date().toISOString(),
                };

                // Add task to the tasks subcollection
                const tasksCollectionRef = collection(eventRef, "tasks");
                await addDoc(tasksCollectionRef, taskData);

                // Clear fields
                setTaskName("");
                setCoordinatorId("");
                setPriority("Normal");
                setDueDate("");
                setDescription("");
                setIsModalVisible(false);

                Alert.alert("Success", "Task created successfully!");
            } catch (error) {
                console.error("Error creating task:", error);
                Alert.alert("Error", "Failed to create task");
            }
        } else {
            Alert.alert("Error", "Please fill all fields.");
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const eventRef = doc(db, "events", eventId);
            const taskRef = doc(collection(eventRef, "tasks"), taskId);
            await deleteDoc(taskRef);

            // Update local state
            setTasks(tasks.filter((task) => task.id !== taskId));
            Alert.alert("Success", "Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Failed to delete task");
        }
    };

    // const filteredTasks = tasks.filter(
    //   (task) =>
    //     task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     task.coordinatorId.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const viewTaskDetails = (task) => {
        setSelectedTask(task);
        setIsModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Task Manager</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Text style={styles.subHeading}>Task List</Text>
            {tasks.length === 0 ? (
                <Text style={styles.noTasks}>No tasks available</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.taskCard}>
                            <Text style={styles.taskText}>
                                <Text style={styles.boldText}>
                                    {item.taskName}
                                </Text>
                                Priority: {item.priority} | Due: {item.dueDate}
                            </Text>
                            <Text style={styles.descriptionText}>
                                Description: {item.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteTask(item.id)}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.addButtonBlue}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible && selectedTask === null}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Add New Task</Text>
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="Task Name"
                            placeholderTextColor="#aaa"
                            value={taskName}
                            onChangeText={setTaskName}
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="Coordinator ID"
                            placeholderTextColor="#aaa"
                            value={coordinatorId}
                            onChangeText={setCoordinatorId}
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="Event ID"
                            placeholderTextColor="#aaa"
                            value={eventId}
                            // onChangeText={setEventId}
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="University ID"
                            placeholderTextColor="#aaa"
                            value={universityId}
                            // onChangeText={setUniversityId}
                        />
                        <Text style={styles.label}>Priority</Text>
                        <Picker
                            selectedValue={priority}
                            onValueChange={(itemValue) =>
                                setPriority(itemValue)
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Normal" value="Normal" />
                            <Picker.Item label="High" value="High" />
                        </Picker>
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="Due Date"
                            placeholderTextColor="#aaa"
                            value={dueDate}
                            onChangeText={setDueDate}
                        />
                        <TextInput
                            style={[styles.input, styles.largeInput]}
                            placeholder="Task Description"
                            placeholderTextColor="#aaa"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TouchableOpacity
                            style={styles.addButtonBlue}
                            onPress={createTask}
                        >
                            <Text style={styles.addButtonText}>Save Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={styles.qrButton}
                onPress={() => generateQRCode()}
            >
                <Text style={styles.qrButtonText}>Generate Attendance QR</Text>
            </TouchableOpacity>
            // Add this Modal component
            <Modal
                visible={qrModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setQrModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Attendance QR Code
                        </Text>

                        <QRCode value={qrData} size={200} getRef={svgRef} />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                if (svgRef.current) {
                                    svgRef.current.toDataURL((data) => {
                                        const fileUri =
                                            FileSystem.documentDirectory +
                                            `${selectedEvent.eventName}_QR.png`;
                                        FileSystem.writeAsStringAsync(
                                            fileUri,
                                            data,
                                            {
                                                encoding:
                                                    FileSystem.EncodingType
                                                        .Base64,
                                            }
                                        ).then(() => {
                                            Sharing.shareAsync(fileUri);
                                        });
                                    });
                                }
                            }}
                        >
                        <Text style={styles.buttonText}>Save QR Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setQrModalVisible(false)}
                        >
                            <Text style={styles.saveButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedTask !== null}
                onRequestClose={() => setSelectedTask(null)}
            >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.inputContainer}>
                        {selectedTask && (
                            <>
                                <Text style={styles.label}>
                                    Task Name: {selectedTask.taskName}
                                </Text>
                                <Text style={styles.label}>
                                    Coordinator ID: {selectedTask.coordinatorId}
                                </Text>
                                <Text style={styles.label}>
                                    Event ID: {selectedTask.eventId}
                                </Text>
                                <Text style={styles.label}>
                                    University ID: {selectedTask.universityId}
                                </Text>
                                <Text style={styles.label}>
                                    Priority: {selectedTask.priority}
                                </Text>
                                <Text style={styles.label}>
                                    Due Date: {selectedTask.dueDate}
                                </Text>
                                <Text style={styles.label}>
                                    Description: {selectedTask.description}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setSelectedTask(null)}
                        >
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    qrButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    qrButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    saveButton: {
        backgroundColor: "#1E90FF",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#121212",
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#bb86fc",
        textAlign: "center",
        marginVertical: 10,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginVertical: 10,
    },
    inputContainer: {
        backgroundColor: "#1e1e1e",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: width * 0.85, // More compact for mobile
    },
    input: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#222",
        color: "#ffffff",
    },
    largeInput: {
        height: 50,
    },
    picker: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        marginVertical: 8,
        backgroundColor: "#222",
        color: "#ffffff",
    },
    label: {
        fontSize: 16,
        color: "#ffffff",
        marginVertical: 5,
    },
    addButtonBlue: {
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    addButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "#cf6679",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#222",
        color: "#ffffff",
    },
    taskCard: {
        backgroundColor: "#1e1e1e",
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    taskText: {
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "bold",
        color: "#bb86fc",
    },
    deleteButton: {
        backgroundColor: "#cf6679",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    deleteText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    noTasks: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
        fontSize: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: "#bbb",
        marginTop: 5,
    },
    detailsButton: {
        backgroundColor: "#4caf50",
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
    },
    detailsText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    deleteButton: {
        backgroundColor: "#cf6679",
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
    },
    deleteText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 14,
    },
});

export default TaskManager;
