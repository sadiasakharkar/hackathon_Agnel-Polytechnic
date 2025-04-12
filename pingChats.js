import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    Modal,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { db } from "./src/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const pingChats = ({ route, navigation }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showCoordinatorList, setShowCoordinatorList] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    const { managerId } = route.params;

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsRef = collection(db, "events");
            const q = query(
                eventsRef,
                where("managerId", "==", managerId),
                where("status", "in", ["upcoming", "ongoing"])
            );

            const querySnapshot = await getDocs(q);
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            setEvents(eventsData);
        };

        fetchEvents();
    }, [managerId]);

    const handleEventPress = (event) => {
        setSelectedEvent(event);
        setShowCoordinatorList(true);
    };

    const handleCoordinatorPress = (coordinator) => {
        setSelectedCoordinator(coordinator);
        setShowCoordinatorList(false);
        setShowMessageModal(true);
    };

    // const handleSendMessage = async () => {
    //     if (!message.trim()) return;

    //     const chatId = "7337758949";
    //     const token = "7493494950:AAFJYlKs4yw--Pv_gC-CJXVYR7FfprWKbsA";

    //     try {
    //         // Add message to Firestore
    //         await addDoc(collection(db, "chats"), {
    //             eventId: selectedEvent.id,
    //             managerId: managerId,
    //             coordinatorId: selectedCoordinator,
    //             message: message,
    //             timestamp: new Date(),
    //         });

    //         // Send message to Telegram
    //         const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    //         const telegramPayload = {
    //             chat_id: chatId,
    //             text: message,
    //         };

    //         const response = await fetch(telegramUrl, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(telegramPayload),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to send message to Telegram");
    //         }

    //         setMessage("");
    //         setShowMessageModal(false);
    //         setSelectedCoordinator(null);
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //     }
    // };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
    
        const webhookUrl = "https://discord.com/api/webhooks/1329988750515900426/XVr7yRR97kBFHVYpBSUilDZsz4szJq_9lbe5pCidjM1AWqhLBP--Nf6N2WjNkdhgvgS-";
    
        try {
            // Add message to Firestore
            await addDoc(collection(db, "chats"), {
                eventId: selectedEvent.id,
                managerId: managerId,
                coordinatorId: selectedCoordinator,
                message: message,
                timestamp: new Date(),
            });
    
            // Send message to Discord webhook
            const discordPayload = {
                content: message
            };
    
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordPayload),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send message to Discord webhook');
            }
    
            setMessage("");
            setShowMessageModal(false);
            setSelectedCoordinator(null);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.eventCard}
                        onPress={() => handleEventPress(item)}
                    >
                        <Text style={styles.eventName}>{item.eventName}</Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Status:</Text>{" "}
                            {item.status}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Date:</Text> {item.date}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Coordinator List Modal */}
            <Modal
                visible={showCoordinatorList}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Select Coordinator
                        </Text>
                        <FlatList
                            data={
                                selectedEvent?.coordinatorList
                                    ? [selectedEvent.coordinatorList]
                                    : []
                            }
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.coordinatorItem}
                                    onPress={() => handleCoordinatorPress(item)}
                                >
                                    <Text style={styles.coordinatorText}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowCoordinatorList(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Message Modal */}
            <Modal
                visible={showMessageModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Send Message</Text>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Type your message..."
                            placeholderTextColor="#666"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowMessageModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSendMessage}
                            >
                                <Text style={styles.buttonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 20,
    },
    eventCard: {
        backgroundColor: "#1E1E1E",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    eventName: {
        fontSize: 18,
        color: "#9c89b8",
        fontWeight: "bold",
        marginBottom: 8,
    },
    eventDetails: {
        color: "#BBB",
        marginBottom: 4,
    },
    pingButton: {
        backgroundColor: "#00FF00",
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        alignItems: "center",
    },
    pingButtonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#1E1E1E",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
        marginBottom: 16,
    },
    messageInput: {
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 12,
        color: "#FFF",
        minHeight: 100,
        textAlignVertical: "top",
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    cancelButton: {
        backgroundColor: "#444",
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        minWidth: 100,
        alignItems: "center",
    },
    sendButton: {
        backgroundColor: "#00FF00",
        padding: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: "center",
    },
    buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
    coordinatorItem: {
        backgroundColor: "#333",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    coordinatorText: {
        color: "#FFF",
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: "#444",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    closeButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontWeight: "bold",
        color: "#FFF",
    },
});

export default pingChats;
