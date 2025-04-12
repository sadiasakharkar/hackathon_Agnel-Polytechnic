import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "./src/firebase";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    Alert,
} from "react-native";
import AttendanceScanner from "./AttendanceScanner"; // Add this import at the top

// Sidebar menu content
const SidebarMenu = ({ navigation }) => {
    return (
        <View style={styles.sidebarContainer}>
            <Text style={styles.sidebarHeader}>Menu</Text>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Dashboard")}
            >
                <Ionicons name="home" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Registrationscoordinator")}
            >
                <Ionicons name="person-add" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Registrations</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                    navigation.navigate("AttendanceTrackingcoordinator")
                }
            >
                <Ionicons name="checkmark-done" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                    navigation.navigate("coordinatorCommunicationTool")
                }
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Certificates")}
            >
                <Ionicons name="document-text" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>E-Certificates</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Analytics")}
            >
                <Ionicons name="analytics" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="log-out" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

// Dashboard screen
const Dashboard = ({ navigation, route }) => {
    const { coordinatorId, universityId } = route.params;
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [activeTasks, setActiveTasks] = useState(0);

    console.log(coordinatorId, universityId);

    // Fetch tasks function
    const fetchCoordinatorTasks = async (coordinatorId, universityId) => {
        try {
            // First get all events for this university
            const eventsRef = collection(db, "events");
            const eventsQuery = query(
                eventsRef,
                where("universityId", "==", universityId)
            );
            const eventsSnapshot = await getDocs(eventsQuery);

            let allTasks = [];

            // Then check each event's tasks for the coordinator
            for (const eventDoc of eventsSnapshot.docs) {
                const tasksRef = collection(eventDoc.ref, "tasks");
                const tasksQuery = query(
                    tasksRef,
                    where("coordinatorId", "==", coordinatorId)
                );
                const tasksSnapshot = await getDocs(tasksQuery);

                tasksSnapshot.forEach((taskDoc) => {
                    allTasks.push({
                        id: taskDoc.id,
                        eventId: eventDoc.id,
                        ...taskDoc.data(),
                    });
                });
            }

            setTasks(allTasks);
            setFilteredTasks(allTasks);
        } catch (error) {
            console.error("Error fetching coordinator tasks:", error);
        }
    };

    const toggleTaskCompletion = async (taskId, eventId) => {
        try {
            const eventRef = doc(db, "events", eventId);
            const taskRef = doc(collection(eventRef, "tasks"), taskId);
            const taskDoc = await getDoc(taskRef);

            if (!taskDoc.exists()) {
                Alert.alert("Error", "Task not found");
                return;
            }

            const newStatus = !taskDoc.data().isCompleted;
            await updateDoc(taskRef, {
                isCompleted: newStatus,
            });

            // Update local state
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, isCompleted: newStatus }
                        : task
                )
            );
            setFilteredTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, isCompleted: newStatus }
                        : task
                )
            );
        } catch (error) {
            console.error("Error updating task status:", error);
            Alert.alert("Error", "Failed to update task status");
        }
    };

    const removeTask = async (taskId, eventId) => {
        try {
            const eventRef = doc(db, "events", eventId);
            const taskRef = doc(collection(eventRef, "tasks"), taskId);

            await deleteDoc(taskRef);

            // Update local state
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
            setFilteredTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );

            Alert.alert("Success", "Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Failed to delete task");
        }
    };

    const fetchTotalRegistrations = async (coordinatorId, universityId) => {
        try {
            // First get all events for this coordinator
            const eventsRef = collection(db, "events");
            const eventsQuery = query(
                eventsRef,
                where("universityId", "==", universityId),
                where("coordinatorList", "array-contains", coordinatorId)
            );
            const eventsSnapshot = await getDocs(eventsQuery);

            // Get all event IDs that this coordinator manages
            const coordinatorEventIds = eventsSnapshot.docs.map(
                (doc) => doc.id
            );

            // Check if there are any events before querying registrations
            if (coordinatorEventIds.length === 0) {
                setTotalRegistrations(0);
                return;
            }

            // Query eventRegistrations collection
            const registrationsRef = collection(db, "eventRegistrations");
            const registrationsQuery = query(
                registrationsRef,
                where("eventId", "in", coordinatorEventIds)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);

            setTotalRegistrations(registrationsSnapshot.size);
        } catch (error) {
            console.error("Error fetching total registrations:", error);
        }
    };

    const fetchActiveTasks = async (coordinatorId, universityId) => {
        try {
            // First get events assigned to this coordinator
            const eventsRef = collection(db, "events");
            const eventsQuery = query(
                eventsRef,
                where("universityId", "==", universityId)
            );
            const eventsSnapshot = await getDocs(eventsQuery);

            let activeTaskCount = 0;

            // For each event, get tasks and count incomplete ones
            for (const eventDoc of eventsSnapshot.docs) {
                const eventData = eventDoc.data();
                if (
                    eventData.coordinatorList &&
                    eventData.coordinatorList.includes(coordinatorId)
                ) {
                    const tasksRef = collection(eventDoc.ref, "tasks");
                    const tasksQuery = query(
                        tasksRef,
                        where("coordinatorId", "==", coordinatorId),
                        where("isCompleted", "==", false)
                    );
                    const tasksSnapshot = await getDocs(tasksQuery);
                    activeTaskCount += tasksSnapshot.size;
                }
            }

            setActiveTasks(activeTaskCount);
        } catch (error) {
            console.error("Error fetching active tasks:", error);
        }
    };

    // Call this in useEffect
    useEffect(() => {
        if (coordinatorId && universityId) {
            fetchActiveTasks(coordinatorId, universityId);
        }
    }, [coordinatorId, universityId]);

    // Add useEffect to fetch tasks when component mounts
    useEffect(() => {
        if ((coordinatorId, universityId)) {
            fetchCoordinatorTasks(coordinatorId, universityId);
            fetchTotalRegistrations(coordinatorId, universityId);
        }
    }, [coordinatorId, universityId]);

    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState([
        "New registration approved.",
        "Reminder: Event starts tomorrow.",
        "Speaker update received.",
        "Attendee feedback requested.",
    ]);

    const handleNotificationPress = () => {
        Alert.alert("Notifications", notifications.join("\n"));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>Dashboard</Text>

            {/* Notification Button */}
            <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleNotificationPress}
            >
                <Ionicons name="notifications" size={24} color="#FFF" />
                <Text style={styles.notificationCount}>
                    {notifications.length}
                </Text>
            </TouchableOpacity>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tasks..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* To-Do List Section */}
            <View style={styles.toDoListContainer}>
                <Text style={styles.sectionTitle}>Assigned Tasks</Text>

                <FlatList
                    data={filteredTasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.toDoItem}>
                            <Text
                                style={[
                                    styles.toDoText,
                                    item.isCompleted &&
                                        styles.toDoCompletedText,
                                ]}
                            >
                                {item.taskName} -{" "}
                                <Text style={styles.priorityText}>
                                    {item.priority}
                                </Text>
                            </Text>

                            <View style={styles.toDoActions}>
                                <TouchableOpacity
                                    onPress={() =>
                                        toggleTaskCompletion(
                                            item.id,
                                            item.eventId
                                        )
                                    }
                                >
                                    <Ionicons
                                        name={
                                            item.isCompleted
                                                ? "checkmark-circle"
                                                : "ellipse-outline"
                                        }
                                        size={24}
                                        color={
                                            item.isCompleted
                                                ? "#4CAF50"
                                                : "#B0B0B0"
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() =>
                                        removeTask(item.id, item.eventId)
                                    }
                                >
                                    <Ionicons
                                        name="trash-bin"
                                        size={20}
                                        color="#FF4C4C"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Event Status Cards */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Registration Status</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {totalRegistrations}
                            </Text>
                            <Text style={styles.statLabel}>
                                Total Registrations
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Active Tasks</Text>
                    <Text style={styles.taskCount}>{activeTasks}</Text>
                    <Text style={styles.taskLabel}>Pending Tasks</Text>
                </View>

                {/*<View style={styles.card}>
                    <Text style={styles.cardTitle}>Attendance Tracking</Text>
                    <Text style={styles.cardContent}>
                        80% Attendees Present
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Notifications</Text>
                    <Text style={styles.cardContent}>
                        You have 5 unread notifications
                    </Text>
                </View> */}
            </View>
            <TouchableOpacity
                style={styles.scanButton}
                onPress={() =>
                    navigation.navigate("AttendanceScanner", {
                        screen: "AttendanceScanner",
                        params: {
                            coordinatorId: coordinatorId,
                            universityId: universityId,
                        },
                    })
                }
            >
                <Text style={styles.buttonText}>Scan Attendance QR</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Dummy screens
const CreateEvent = () => (
    <View>
        <Text>Create Event Screen</Text>
    </View>
);
const Registrations = () => (
    <View>
        <Text>Registrations Screen</Text>
    </View>
);
const Attendance = () => (
    <View>
        <Text>Attendance Screen</Text>
    </View>
);
const Messages = () => (
    <View>
        <Text>Messages Screen</Text>
    </View>
);
const Certificates = () => (
    <View>
        <Text>E-Certificates Screen</Text>
    </View>
);
const Analytics = () => (
    <View>
        <Text>Analytics Screen</Text>
    </View>
);

const Drawer = createDrawerNavigator();

function CoordinatorsDashboard() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <SidebarMenu {...props} />}
            screenOptions={{
                unmountOnBlur: true,
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    unmountOnBlur: true,
                }}
                initialParams={{
                    coordinatorId: "",
                    universityId: "",
                }}
            />
            <Drawer.Screen
                name="AttendanceScanner"
                component={AttendanceScanner}
                options={{
                    headerShown: false,
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen name="Certificates" component={Certificates} />
            <Drawer.Screen name="Analytics" component={Analytics} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: "white",
    },
    sidebarContainer: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 20,
    },
    sidebarHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    menuItemText: {
        color: "#FFF",
        fontSize: 18,
        marginLeft: 10,
    },
    container: {
        padding: 15,
        backgroundColor: "#121212",
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25,
        textAlign: "center",
        color: "#FFFFFF",
    },
    notificationButton: {
        position: "absolute",
        top: 10,
        right: 15,
        backgroundColor: "#FF5722",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    notificationCount: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#FF4C4C",
        width: 20,
        height: 20,
        borderRadius: 10,
        color: "#FFF",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 20,
    },
    searchContainer: {
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: "#FFF",
        color: "#000",
        padding: 10,
        borderRadius: 5,
    },
    toDoListContainer: {
        marginBottom: 30,
    },
    toDoItem: {
        padding: 15,
        backgroundColor: "#1E1E1E",
        marginBottom: 15,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Ensure space between text and actions
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    toDoActions: {
        flexDirection: "row", // Align icons horizontally
        alignItems: "center", // Vertically center the icons
    },
    toDoText: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    toDoCompletedText: {
        textDecorationLine: "line-through",
        color: "#B0B0B0",
    },
    priorityText: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#FF9800", // Orange for priority
    },
    removeButton: {
        marginLeft: 10,
    },
    cardContainer: {
        marginBottom: 30,
    },
    card: {
        backgroundColor: "#333",
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    cardContent: {
        fontSize: 16,
        color: "#FFF",
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 10,
    },
    upcomingEventItem: {
        backgroundColor: "#222",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    upcomingEventTitle: {
        fontSize: 18,
        color: "#FFF",
    },
    upcomingEventDate: {
        fontSize: 14,
        color: "#AAA",
    },
    activityFeedContainer: {
        marginBottom: 30,
    },
    activityItem: {
        backgroundColor: "#333",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    activityText: {
        fontSize: 14,
        color: "#FFF",
    },
    moreContentContainer: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 8,
    },
    contentText: {
        fontSize: 14,
        color: "#FFF",
    },
    card: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E90FF",
    },
    statLabel: {
        fontSize: 14,
        color: "#888",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E90FF",
        marginBottom: 10,
    },
    taskCount: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFF",
        marginVertical: 5,
    },
    taskLabel: {
        fontSize: 14,
        color: "#888",
        marginTop: 5,
    },
});

export default CoordinatorsDashboard;
