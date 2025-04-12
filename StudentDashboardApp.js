// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     FlatList,
//     TextInput,
//     ScrollView,
//     Image,
//     Modal,
//     Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { db } from "./src/firebase";
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

// // Event Management App Screens
// import EventDescription from "./EventDescription";
// import ProfilePageStudent from "./ProfilePageStudent";
// import MyEventsPageStudent from "./MyEventsPageStudent";
// import PaymentsPageStudent from "./PaymentsPageStudent";
// import FeedbackPageStudent from "./FeedbackPageStudent";
// import CertificateStudent from "./CertificateStudent";
// import SettingStudent from "./SettingStudent";

// // Sidebar Menu Content
// const SidebarMenu = ({ navigation, route }) => {
//     const { universityId, studentId } = route?.params || {};
//     console.log(universityId, studentId);

//     return (
//         <View style={styles.sidebarContainer}>
//             <Image
//                 source={require("./StudentImage.png")}
//                 style={styles.stdImage}
//             />
//             <View style={styles.stdContainer}>
//                 <Text style={styles.stdTag}>Student</Text>
//             </View>

//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("Dashboard")}
//             >
//                 <Ionicons name="home" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Dashboard</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("MyEventsPageStudent")}
//             >
//                 <Ionicons name="calendar" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>My Events</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("ProfilePageStudent")}
//             >
//                 <Ionicons name="person" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Profile</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("PaymentsPageStudent")}
//             >
//                 <Ionicons name="cash" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Payments</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() =>
//                     navigation.navigate("FeedbackPageStudent", {
//                         universityId: universityId,
//                         studentId: studentId,
//                     })
//                 }
//             >
//                 <Ionicons name="chatbubble" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Feedback</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("CertificateStudent")}
//             >
//                 <Ionicons name="document" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Certificate</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => navigation.navigate("SettingStudent")}
//             >
//                 <Ionicons name="settings" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Settings</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//                 <Ionicons name="log-out" size={24} color="#FFF" />
//                 <Text style={styles.menuItemText}>Logout</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const Dashboard = ({ route, navigation }) => {
//     // const [events, setEvents] = useState([]);
//     // const [allEvents, setAllEvents] = useState([]);
//     const [registeredEvents, setRegisteredEvents] = useState([]);
//     const [availableEvents, setAvailableEvents] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);

//     const { universityId, studentId } = route?.params || {};

//     useEffect(() => {
//         if (universityId && studentId) {
//             fetchRegisteredEvents();
//             fetchAvailableEvents();
//         }
//     }, [universityId, studentId]);

//     // Fetch registered events
//     const fetchRegisteredEvents = async () => {
//         try {
//             const registrationsRef = collection(db, "eventRegistrations");
//             const q = query(
//                 registrationsRef,
//                 where("studentId", "==", studentId)
//             );
//             const querySnapshot = await getDocs(q);

//             const registeredEventIds = [];
//             querySnapshot.forEach((doc) => {
//                 registeredEventIds.push(doc.data().eventId);
//             });

//             if (registeredEventIds.length > 0) {
//                 const eventsRef = collection(db, "events");
//                 const q2 = query(
//                     eventsRef,
//                     where("__name__", "in", registeredEventIds)
//                 );
//                 const eventSnapshot = await getDocs(q2);

//                 const eventsData = [];
//                 eventSnapshot.forEach((doc) => {
//                     eventsData.push({ id: doc.id, ...doc.data() });
//                 });
//                 setRegisteredEvents(eventsData);
//             } else {
//                 setRegisteredEvents([]);
//             }
//         } catch (error) {
//             console.error("Error fetching registered events:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     // Fetch available events
//     const fetchAvailableEvents = async () => {
//         try {
//             // Get all registered event IDs for the student
//             const registrationsRef = collection(db, "eventRegistrations");
//             const q = query(
//                 registrationsRef,
//                 where("studentId", "==", studentId)
//             );
//             const querySnapshot = await getDocs(q);

//             const registeredEventIds = [];
//             querySnapshot.forEach((doc) => {
//                 registeredEventIds.push(doc.data().eventId);
//             });

//             // Fetch all events excluding registered ones
//             const eventsRef = collection(db, "events");
//             let q2;
//             if (registeredEventIds.length > 0) {
//                 q2 = query(
//                     eventsRef,
//                     where("universityId", "==", universityId),
//                     where("__name__", "not-in", registeredEventIds)
//                 );
//             } else {
//                 q2 = query(
//                     eventsRef,
//                     where("universityId", "==", universityId)
//                 );
//             }

//             const eventSnapshot = await getDocs(q2);
//             const eventsData = [];
//             eventSnapshot.forEach((doc) => {
//                 eventsData.push({ id: doc.id, ...doc.data() });
//             });
//             setAvailableEvents(eventsData);
//         } catch (error) {
//             console.error("Error fetching available events:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRegister = async (eventId) => {
//         try {
//             await addDoc(collection(db, "eventRegistrations"), {
//                 eventId: eventId,
//                 studentId: studentId,
//                 universityId: universityId,
//             });
//             Alert.alert("Success", "Successfully registered for the event!");
//             fetchRegisteredEvents();
//             fetchAvailableEvents();
//             setModalVisible(false);
//         } catch (error) {
//             Alert.alert("Error", "Failed to register for the event");
//         }
//     };

//     const RegistrationForm = ({ event }) => {
//         const [formData, setFormData] = useState({
//             studentId: "",
//             name: "",
//             email: "",
//             contactNumber: "",
//             department: "",
//             collegeName: "",
//         });

//         const handleInputChange = (key, value) => {
//             setFormData({ ...formData, [key]: value });
//         };

//         const handleSubmit = async () => {
//             if (
//                 !formData.studentId ||
//                 !formData.name ||
//                 !formData.email ||
//                 !formData.contactNumber ||
//                 !formData.department ||
//                 !formData.collegeName
//             ) {
//                 Alert.alert("Error", "Please fill out all fields.");
//                 return;
//             }

//             try {
//                 await addDoc(collection(db, "eventRegistrations"), {
//                     eventId: event.id,
//                     studentId: formData.studentId,
//                     name: formData.name,
//                     email: formData.email,
//                     contactNumber: formData.contactNumber,
//                     department: formData.department,
//                     collegeName: formData.collegeName,
//                 });
//                 Alert.alert(
//                     "Success",
//                     "Successfully registered for the event!"
//                 );
//                 setModalVisible(false);
//             } catch (error) {
//                 Alert.alert("Error", "Failed to register for the event");
//             }
//         };

//         return (
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>
//                             Event Registration
//                         </Text>
//                         <Text style={styles.modalEventName}>{event?.name}</Text>
//                         <Text style={styles.modalDescription}>
//                             {event?.description}
//                         </Text>

//                         {/* Input Fields */}
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Student ID"
//                             placeholderTextColor="#aaa"
//                             value={formData.studentId}
//                             onChangeText={(text) =>
//                                 handleInputChange("studentId", text)
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Your Name"
//                             placeholderTextColor="#aaa"
//                             value={formData.name}
//                             onChangeText={(text) =>
//                                 handleInputChange("name", text)
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Email"
//                             placeholderTextColor="#aaa"
//                             keyboardType="email-address"
//                             value={formData.email}
//                             onChangeText={(text) =>
//                                 handleInputChange("email", text)
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Contact Number"
//                             placeholderTextColor="#aaa"
//                             keyboardType="phone-pad"
//                             value={formData.contactNumber}
//                             onChangeText={(text) =>
//                                 handleInputChange("contactNumber", text)
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Department"
//                             placeholderTextColor="#aaa"
//                             value={formData.department}
//                             onChangeText={(text) =>
//                                 handleInputChange("department", text)
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="College Name"
//                             placeholderTextColor="#aaa"
//                             value={formData.collegeName}
//                             onChangeText={(text) =>
//                                 handleInputChange("collegeName", text)
//                             }
//                         />

//                         {/* Submit and Cancel Buttons */}
//                         <TouchableOpacity
//                             style={styles.confirmButton}
//                             onPress={handleSubmit}
//                         >
//                             <Text style={styles.buttonText}>Submit</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.cancelButton}
//                             onPress={() => setModalVisible(false)}
//                         >
//                             <Text style={styles.buttonText}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         );
//     };

//     // console.log(universityId, studentId);

//     return (
//         <ScrollView style={styles.container}>
//             <Text style={styles.headerText}>My Events</Text>

//             {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search events..."
//                     placeholderTextColor="#888"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.searchButton}>
//                     <Ionicons name="search" size={20} color="#FFF" />
//                 </TouchableOpacity>
//             </View>

//             {/* Available Events */}
//             <View style={styles.cardContainer}>
//                 <Text style={styles.cardTitle}>Available Events</Text>
//                 {loading ? (
//                     <Text style={styles.eventStatus}>Loading events...</Text>
//                 ) : availableEvents.length === 0 ? (
//                     <Text style={styles.eventStatus}>No available events</Text>
//                 ) : (
//                     availableEvents.map((event) => (
//                         <View key={event.id} style={styles.eventCard}>
//                             <Text style={styles.eventName}>
//                                 {event.eventName}
//                             </Text>
//                             <Text style={styles.eventDetails}>
//                                 {event.description}
//                             </Text>
//                             {/* <Text style={styles.eventStatus}>{event.date}</Text> */}
//                             <TouchableOpacity
//                                 style={styles.button}
//                                 onPress={() => {
//                                     setSelectedEvent(event);
//                                     setModalVisible(true);
//                                     handleRegister();
//                                 }}
//                             >
//                                 <Text style={styles.buttonText}>Register</Text>
//                             </TouchableOpacity>
//                         </View>
//                     ))
//                 )}
//             </View>

//             {/* Registered Events */}
//             <View style={styles.cardContainer}>
//                 <Text style={styles.cardTitle}>Registered Events</Text>
//                 {loading ? (
//                     <Text style={styles.eventStatus}>Loading events...</Text>
//                 ) : registeredEvents.length === 0 ? (
//                     <Text style={styles.eventStatus}>No registered events</Text>
//                 ) : (
//                     registeredEvents.map((event) => (
//                         <View key={event.id} style={styles.eventCard}>
//                             <Text style={styles.eventName}>
//                                 {event.eventName}
//                             </Text>
//                             <Text style={styles.eventDetails}>
//                                 {event.description}
//                             </Text>
//                             {/* <Text style={styles.eventStatus}>{event.date.toDate()}</Text> */}
//                         </View>
//                     ))
//                 )}
//             </View>

//             {selectedEvent && <RegistrationForm event={selectedEvent} />}
//         </ScrollView>
//     );
// };

// const Drawer = createDrawerNavigator();

// function StudentDashboardApp() {
//     return (
//         <Drawer.Navigator
//             drawerContent={(props) => <SidebarMenu {...props} />}
//             screenOptions={{
//                 unmountOnBlur: true,
//             }}
//             initialParams={{universityId: ""}}
//         >
//             <Drawer.Screen
//                 name="Dashboard"
//                 component={Dashboard}
//                 options={{
//                     unmountOnBlur: true,
//                 }}
//                 initialParams={{ universityId: "" }}
//             />
//             {/* <Drawer.Screen
//                 name="FeedbackPageStudent"
//                 component={FeedbackPageStudent}
//                 initialParams={{ universityId: "", studentId: "" }}
//             /> */}

//             <Drawer.Screen
//                 name="EventDescription"
//                 component={EventDescription}
//             />
//             <Drawer.Screen
//                 name="ProfilePageStudent"
//                 component={ProfilePageStudent}
//             />
//             <Drawer.Screen
//                 name="MyEventsPageStudent"
//                 component={MyEventsPageStudent}
//             />
//             <Drawer.Screen
//                 name="PaymentsPageStudent"
//                 component={PaymentsPageStudent}
//             />
//             <Drawer.Screen
//                 name="FeedbackPageStudent"
//                 component={FeedbackPageStudent}
//             />
//             <Drawer.Screen
//                 name="CertificateStudent"
//                 component={CertificateStudent}
//             />
//             <Drawer.Screen name="SettingStudent" component={SettingStudent} />
//         </Drawer.Navigator>
//     );
// }

// // Styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#121212",
//     },
//     sidebarContainer: {
//         flex: 1,
//         backgroundColor: "#333",
//         padding: 15,
//     },
//     stdContainer: {
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     stdImage: {
//         width: "100%",
//         height: 120,
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     stdTag: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#FFF",
//     },
//     menuItem: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 20,
//         padding: 10,
//         borderRadius: 10,
//         backgroundColor: "#444",
//     },
//     menuItemText: {
//         fontSize: 16,
//         marginLeft: 15,
//         color: "#FFF",
//     },
//     headerText: {
//         fontSize: 24,
//         color: "#FFF",
//         fontWeight: "bold",
//         marginBottom: 10,
//     },
//     searchContainer: {
//         flexDirection: "row",
//         marginBottom: 20,
//     },
//     searchInput: {
//         flex: 1,
//         padding: 10,
//         borderRadius: 5,
//         backgroundColor: "#444",
//         color: "#FFF",
//         fontSize: 16,
//     },
//     searchButton: {
//         backgroundColor: "#555",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 10,
//         borderRadius: 5,
//         marginLeft: 10,
//     },
//     cardContainer: {
//         marginBottom: 30,
//         backgroundColor: "#222",
//         borderRadius: 10,
//         padding: 15,
//     },
//     cardTitle: {
//         fontSize: 20,
//         color: "#FFF",
//         fontWeight: "bold",
//         marginBottom: 10,
//     },
//     eventCard: {
//         marginBottom: 15,
//         padding: 10,
//         backgroundColor: "#333",
//         borderRadius: 10,
//     },
//     eventName: {
//         fontSize: 18,
//         color: "#FFF",
//         fontWeight: "bold",
//     },
//     eventDetails: {
//         color: "#AAA",
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     eventStatus: {
//         color: "#FFF",
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     progressTracker: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//     },
//     progressStep: {
//         color: "#888",
//         fontSize: 12,
//         marginRight: 10,
//     },
//     actionButtons: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 10,
//     },
//     button: {
//         backgroundColor: "#1E90FF",
//         padding: 10,
//         borderRadius: 5,
//         marginRight: 10,
//     },
//     buttonText: {
//         color: "#FFF",
//         fontSize: 14,
//         fontWeight: "bold",
//     },
//     notificationText: {
//         color: "#FFF",
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     profileText: {
//         color: "#FFF",
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//     modalContent: {
//         width: "80%",
//         backgroundColor: "#333",
//         borderRadius: 10,
//         padding: 20,
//         alignItems: "center",
//     },
//     modalTitle: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#FFF",
//         marginBottom: 15,
//     },
//     modalEventName: {
//         fontSize: 18,
//         color: "#FFF",
//         marginBottom: 10,
//     },
//     modalDescription: {
//         color: "#AAA",
//         marginBottom: 20,
//         textAlign: "center",
//     },
//     confirmButton: {
//         backgroundColor: "#1E90FF",
//         padding: 10,
//         borderRadius: 5,
//         width: "100%",
//         marginBottom: 10,
//     },
//     cancelButton: {
//         backgroundColor: "#555",
//         padding: 10,
//         borderRadius: 5,
//         width: "100%",
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#1E90FF",
//         borderRadius: 10,
//         padding: 12,
//         marginBottom: 15,
//         fontSize: 16,
//         backgroundColor: "#222",
//         color: "#fff",
//     },
// });

// export default StudentDashboardApp;



import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    ScrollView,
    Image,
    Modal,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { db } from "./src/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Event Management App Screens
import EventDescription from "./EventDescription";
import ProfilePageStudent from "./ProfilePageStudent";
import MyEventsPageStudent from "./MyEventsPageStudent";
import PaymentsPageStudent from "./PaymentsPageStudent";
import FeedbackPageStudent from "./FeedbackPageStudent";
import CertificateStudent from "./CertificateStudent";
// import StudentAttendance from "./StudentAttendance"; // Ensure this is imported
import SettingStudent from "./SettingStudent";

// Sidebar Menu Content
const SidebarMenu = ({ navigation }) => {
    return (
        <View style={styles.sidebarContainer}>
            <Image
                source={require("./StudentImage.png")}
                style={styles.stdImage}
            />
            <View style={styles.stdContainer}>
                <Text style={styles.stdTag}>Student</Text>
            </View>

            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Dashboard")}
            >
                <Ionicons name="home" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("MyEventsPageStudent")}
            >
                <Ionicons name="calendar" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>My Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("ProfilePageStudent")}
            >
                <Ionicons name="person" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("StudentAttendance")} // Added Attendance
      >
        <Ionicons name="calendar" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Attendance</Text>
      </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PaymentsPageStudent")}
            >
                <Ionicons name="cash" size={24} color="#FFF" />
                <Text style={styles.menuItemText}>Payments</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("SettingStudent")}
            >
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

const Dashboard = ({ route, navigation }) => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { universityId, studentId } = route?.params || {};

    useEffect(() => {
        if (universityId && studentId) {
            fetchRegisteredEvents();
            fetchAvailableEvents();
        }
    }, [universityId, studentId]);

    // Fetch registered events
    const fetchRegisteredEvents = async () => {
        try {
            const registrationsRef = collection(db, "eventRegistrations");
            const q = query(
                registrationsRef,
                where("studentId", "==", studentId)
            );
            const querySnapshot = await getDocs(q);

            const registeredEventIds = [];
            querySnapshot.forEach((doc) => {
                registeredEventIds.push(doc.data().eventId);
            });

            if (registeredEventIds.length > 0) {
                const eventsRef = collection(db, "events");
                const q2 = query(
                    eventsRef,
                    where("name", "in", registeredEventIds)
                );
                const eventSnapshot = await getDocs(q2);

                const eventsData = [];
                eventSnapshot.forEach((doc) => {
                    eventsData.push({ id: doc.id, ...doc.data() });
                });
                setRegisteredEvents(eventsData);
            } else {
                setRegisteredEvents([]);
            }
        } catch (error) {
            console.error("Error fetching registered events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available events
    const fetchAvailableEvents = async () => {
        try {
            const registrationsRef = collection(db, "eventRegistrations");
            const q = query(
                registrationsRef,
                where("studentId", "==", studentId)
            );
            const querySnapshot = await getDocs(q);

            const registeredEventIds = [];
            querySnapshot.forEach((doc) => {
                registeredEventIds.push(doc.data().eventId);
            });

            const eventsRef = collection(db, "events");
            let q2;
            if (registeredEventIds.length > 0) {
                q2 = query(
                    eventsRef,
                    where("universityId", "==", universityId),
                    where("name", "not-in", registeredEventIds)
                );
            } else {
                q2 = query(
                    eventsRef,
                    where("universityId", "==", universityId)
                );
            }

            const eventSnapshot = await getDocs(q2);
            const eventsData = [];
            eventSnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            setAvailableEvents(eventsData);
        } catch (error) {
            console.error("Error fetching available events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await addDoc(collection(db, "eventRegistrations"), {
                eventId: eventId,
                studentId: studentId,
                universityId: universityId,
            });
            Alert.alert("Success", "Successfully registered for the event!");
            fetchRegisteredEvents();
            fetchAvailableEvents();
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error", "Failed to register for the event");
        }
    };

    const RegistrationForm = ({ event }) => {
        const [formData, setFormData] = useState({
            studentId: "",
            name: "",
            email: "",
            contactNumber: "",
            department: "",
            collegeName: "",
        });

        const handleInputChange = (key, value) => {
            setFormData({ ...formData, [key]: value });
        };

        const handleSubmit = async () => {
            if (
                !formData.studentId ||
                !formData.name ||
                !formData.email ||
                !formData.contactNumber ||
                !formData.department ||
                !formData.collegeName
            ) {
                Alert.alert("Error", "Please fill out all fields.");
                return;
            }
 
            try {
                await addDoc(collection(db, "eventRegistrations"), {
                    eventId: event.id,
                    studentId: formData.studentId,
                    name: formData.name,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                    department: formData.department,
                    collegeName: formData.collegeName,
                });
                Alert.alert(
                    "Success",
                    "Successfully registered for the event!"
                );
                fetchRegisteredEvents();
                fetchAvailableEvents();
                // setModalVisible(false);
                setModalVisible(false);
            } catch (error) {
                Alert.alert("Error", "Failed to register for the event");
            }
        };

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Event Registration
                        </Text>
                        <Text style={styles.modalEventName}>{event?.name}</Text>
                        <Text style={styles.modalDescription}>
                            {event?.description}
                        </Text>

                        {/* Input Fields */}
                        <TextInput
                            style={styles.input}
                            placeholder="Student ID"
                            placeholderTextColor="#aaa"
                            value={formData.studentId}
                            onChangeText={(text) =>
                                handleInputChange("studentId", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name"
                            placeholderTextColor="#aaa"
                            value={formData.name}
                            onChangeText={(text) =>
                                handleInputChange("name", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#aaa"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) =>
                                handleInputChange("email", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contact Number"
                            placeholderTextColor="#aaa"
                            keyboardType="phone-pad"
                            value={formData.contactNumber}
                            onChangeText={(text) =>
                                handleInputChange("contactNumber", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Department"
                            placeholderTextColor="#aaa"
                            value={formData.department}
                            onChangeText={(text) =>
                                handleInputChange("department", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="College Name"
                            placeholderTextColor="#aaa"
                            value={formData.collegeName}
                            onChangeText={(text) =>
                                handleInputChange("collegeName", text)
                            }
                        />

                        {/* Submit and Cancel Buttons */}
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>My Events</Text>

            {/* Feedback and Certificate Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("FeedbackPageStudent")}
                >
                    <Text style={styles.actionButtonText}>Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("CertificateStudent")}
                >
                    <Text style={styles.actionButtonText}>Certificate</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Available Events */}
            <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Available Events</Text>
                {loading ? (
                    <Text style={styles.eventStatus}>Loading events...</Text>
                ) : availableEvents.length === 0 ? (
                    <Text style={styles.eventStatus}>No available events</Text>
                ) : (
                    availableEvents.map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                            <Text style={styles.eventName}>
                                {event.eventName}
                            </Text>
                            <Text style={styles.eventDetails}>
                                {event.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setSelectedEvent(event);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            {/* Registered Events */}
            <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Registered Events</Text>
                {loading ? (
                    <Text style={styles.eventStatus}>Loading events...</Text>
                ) : registeredEvents.length === 0 ? (
                    <Text style={styles.eventStatus}>No registered events</Text>
                ) : (
                    registeredEvents.map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                            <Text style={styles.eventName}>
                                {event.eventName}
                            </Text>
                            <Text style={styles.eventDetails}>
                                {event.description}
                            </Text>
                        </View>
                    ))
                )}
            </View>

            {selectedEvent && <RegistrationForm event={selectedEvent} />}
        </ScrollView>
    );
};

const Drawer = createDrawerNavigator();

function StudentDashboardApp() {
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
                initialParams={{ universityId: "" }}
            />
            <Drawer.Screen
                name="EventDescription"
                component={EventDescription}
            />
            <Drawer.Screen
                name="ProfilePageStudent"
                component={ProfilePageStudent}
            />
            <Drawer.Screen
                name="MyEventsPageStudent"
                component={MyEventsPageStudent}
            />
            <Drawer.Screen
                name="PaymentsPageStudent"
                component={PaymentsPageStudent}
            />
            <Drawer.Screen
                name="FeedbackPageStudent"
                component={FeedbackPageStudent}
            />
            <Drawer.Screen
                name="CertificateStudent"
                component={CertificateStudent}
            />
            {/* <Drawer.Screen name="StudentAttendance" component={StudentAttendance} /> */}
            <Drawer.Screen name="SettingStudent" component={SettingStudent} />
        </Drawer.Navigator>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    sidebarContainer: {
        flex: 1,
        backgroundColor: "#333",
        padding: 15,
    },
    stdContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    stdImage: {
        width: "100%",
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    stdTag: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#444",
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 15,
        color: "#FFF",
    },
    headerText: {
        fontSize: 24,
        color: "#FFF",
        fontWeight: "bold",
        marginBottom: 10,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: "#1E90FF",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
    },
    actionButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#444",
        color: "#FFF",
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#555",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    cardContainer: {
        marginBottom: 30,
        backgroundColor: "#222",
        borderRadius: 10,
        padding: 15,
    },
    cardTitle: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
        marginBottom: 10,
    },
    eventCard: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 10,
    },
    eventName: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
    },
    eventDetails: {
        color: "#AAA",
        fontSize: 14,
        marginBottom: 5,
    },
    eventStatus: {
        color: "#FFF",
        fontSize: 14,
        marginBottom: 5,
    },
    progressTracker: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    progressStep: {
        color: "#888",
        fontSize: 12,
        marginRight: 10,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#1E90FF",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    notificationText: {
        color: "#FFF",
        fontSize: 14,
        marginBottom: 5,
    },
    profileText: {
        color: "#FFF",
        fontSize: 16,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#333",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 15,
    },
    modalEventName: {
        fontSize: 18,
        color: "#FFF",
        marginBottom: 10,
    },
    modalDescription: {
        color: "#AAA",
        marginBottom: 20,
        textAlign: "center",
    },
    confirmButton: {
        backgroundColor: "#1E90FF",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: "#555",
        padding: 10,
        borderRadius: 5,
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: "#1E90FF",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#222",
        color: "#fff",
    },
});

export default StudentDashboardApp;
