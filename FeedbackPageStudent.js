import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    addDoc,
} from "firebase/firestore";
import { db } from "./src/firebase";

const FeedbackPageStudent = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [events, setEvents] = useState([]);
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
    const { universityId, studentId } = route?.params ?? {};

    console.log(universityId, studentId);

    const fetchEvents = async () => {
        try {
            const eventRegistrationsRef = collection(db, "eventRegistrations");
            const registrationsQuery = query(
                eventRegistrationsRef,
                where("studentId", "==", studentId)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);

            const eventsData = [];
            for (const regDoc of registrationsSnapshot.docs) {
                const eventId = regDoc.data().eventId;
                const eventDoc = await getDoc(doc(db, "events", eventId));

                if (
                    eventDoc.exists() &&
                    eventDoc.data().status === "completed"
                ) {
                    eventsData.push({
                        id: eventId,
                        ...eventDoc.data(),
                        requiresFeedback: true,
                    });
                }
            }
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchSubmittedFeedbacks = async () => {
        try {
            const feedbackRef = collection(db, "feedback");
            const feedbackQuery = query(
                feedbackRef,
                where("studentId", "==", studentId)
            );
            const feedbackSnapshot = await getDocs(feedbackQuery);

            const feedbacks = [];
            feedbackSnapshot.forEach((doc) => {
                feedbacks.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setSubmittedFeedbacks(feedbacks);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    useEffect(() => {
        if (studentId) {
            fetchEvents();
            fetchSubmittedFeedbacks();
        }
    }, [studentId]);

    const submitFeedback = async () => {
        if (!feedback.trim()) {
            Alert.alert("Error", "Please enter feedback");
            return;
        }

        try {
            await addDoc(collection(db, "feedback"), {
                eventId: selectedEvent.id,
                studentId: studentId,
                feedback: feedback,
                timestamp: new Date().toISOString(),
            });

            Alert.alert("Success", "Feedback submitted successfully!");
            setModalVisible(false);
            setFeedback("");
            fetchSubmittedFeedbacks();
        } catch (error) {
            Alert.alert("Error", "Failed to submit feedback");
        }
    };

    const renderEvent = ({ item }) => {
        const hasSubmittedFeedback = submittedFeedbacks.some(
            (feedback) => feedback.eventId === item.id
        );

        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.eventName}</Text>
                <Text style={styles.cardStatus}>
                    Status:{" "}
                    {hasSubmittedFeedback
                        ? "Feedback Submitted"
                        : "Feedback Required"}
                </Text>
                {!hasSubmittedFeedback && (
                    <TouchableOpacity
                        style={styles.submitFeedbackButton}
                        onPress={() => {
                            setSelectedEvent(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.submitFeedbackButtonText}>
                            Submit Feedback
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Event Feedback</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderEvent}
                ListHeaderComponent={
                    <Text style={styles.subHeader}>
                        Events Requiring Feedback
                    </Text>
                }
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Enter your feedback..."
                            placeholderTextColor="#666"
                            multiline
                            value={feedback}
                            onChangeText={setFeedback}
                        />
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={submitFeedback}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#ccc",
    },
    card: {
        backgroundColor: "#1F3558",
        padding: 20,
        marginBottom: 20,
        borderRadius: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    cardStatus: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    submitFeedbackButton: {
        backgroundColor: "#1E90FF",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    submitFeedbackButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1E1E1E",
        padding: 20,
        borderRadius: 10,
        width: "90%",
    },
    feedbackInput: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 8,
        color: "#FFF",
        height: 150,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#1E90FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: "#FF4C4C",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default FeedbackPageStudent;
