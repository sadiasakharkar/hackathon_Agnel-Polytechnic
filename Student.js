// import React, { useState, useRef, useEffect } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     Alert,
//     Animated,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native"; // Import useNavigation

// export default function StudentRegistration() {
//     const navigation = useNavigation(); // Get navigation object

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [contactNumber, setContactNumber] = useState("");
//     const [department, setDepartment] = useState("");
//     const [collegeName, setCollegeName] = useState("");
//     const [studentId, setStudentId] = useState("");

//     // Animations
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     const bubblePositions = [
//         useRef(new Animated.ValueXY({ x: -50, y: 0 })).current,
//         useRef(new Animated.ValueXY({ x: 200, y: 0 })).current,
//         useRef(new Animated.ValueXY({ x: 500, y: 0 })).current,
//         useRef(new Animated.ValueXY({ x: 300, y: 0 })).current,
//         useRef(new Animated.ValueXY({ x: -200, y: 100 })).current, // Additional bubble
//         useRef(new Animated.ValueXY({ x: 150, y: -50 })).current, // Additional bubble
//         useRef(new Animated.ValueXY({ x: 400, y: 200 })).current, // Additional bubble
//     ];

//     const bubbleColors = [
//         "#62B1F6", // Light blue
//         "#4682B4", // Steel blue
//         "#1E90FF", // Dodger blue
//         "#5F9EA0", // Cadet blue
//         "#87CEFA", // Light sky blue
//         "#00BFFF", // Deep sky blue
//         "#4169E1", // Royal blue
//     ];

//     // Utility function for basic email validation
//     const isValidEmail = (email) => {
//         const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return re.test(email);
//     };

//     const handleRegistration = () => {
//         if (
//             !name ||
//             !email ||
//             !password ||
//             !confirmPassword ||
//             !contactNumber ||
//             !department ||
//             !collegeName ||
//             !studentId
//         ) {
//             Alert.alert("Error", "Please fill all fields.");
//             return;
//         }
//         if (!isValidEmail(email)) {
//             Alert.alert("Error", "Please enter a valid email address.");
//             return;
//         }
//         if (password !== confirmPassword) {
//             Alert.alert("Error", "Passwords do not match.");
//             return;
//         }

//         Alert.alert("Success", "Registration completed successfully.", [
//             {
//                 text: "OK",
//                 onPress: () => navigation.navigate("StudentDashboardApp"), // Navigate to StudentDashboardApp after registration
//             },
//         ]);
//     };

//     useEffect(() => {
//         // Start fade-in animation
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//         }).start();

//         // Start bubble animations continuously
//         Animated.loop(
//             Animated.stagger(
//                 1000,
//                 bubblePositions.map((position, index) =>
//                     Animated.timing(position, {
//                         toValue: {
//                             x: Math.random() * 400, // Random x position within 400px width
//                             y: Math.random() * 400, // Random y position within 400px height
//                         },
//                         duration: 5000 + Math.random() * 3000, // Randomize duration
//                         useNativeDriver: true,
//                     })
//                 )
//             )
//         ).start();
//     }, []);

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             {/* Moving Bubbles */}
//             {bubblePositions.map((position, index) => (
//                 <Animated.View
//                     key={index}
//                     style={[
//                         styles.bubble,
//                         {
//                             backgroundColor:
//                                 bubbleColors[index % bubbleColors.length],
//                             transform: [
//                                 { translateX: position.x },
//                                 { translateY: position.y },
//                             ],
//                         },
//                     ]}
//                 />
//             ))}

//             {/* Title with Fade-in Animation */}
//             <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
//                 Student Registration
//             </Animated.Text>

//             {/* Form Fields */}
//             <View style={styles.card}>
//                 <Text style={styles.label}>Full Name</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#888"
//                     value={name}
//                     onChangeText={setName}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Email Address</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your email address"
//                     placeholderTextColor="#888"
//                     value={email}
//                     keyboardType="email-address"
//                     onChangeText={setEmail}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your password"
//                     placeholderTextColor="#888"
//                     value={password}
//                     secureTextEntry
//                     onChangeText={setPassword}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Confirm Password</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Confirm your password"
//                     placeholderTextColor="#888"
//                     value={confirmPassword}
//                     secureTextEntry
//                     onChangeText={setConfirmPassword}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Contact Number</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your contact number"
//                     placeholderTextColor="#888"
//                     value={contactNumber}
//                     keyboardType="phone-pad"
//                     onChangeText={setContactNumber}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Department</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your department"
//                     placeholderTextColor="#888"
//                     value={department}
//                     onChangeText={setDepartment}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>College/University Name</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your college/university name"
//                     placeholderTextColor="#888"
//                     value={collegeName}
//                     onChangeText={setCollegeName}
//                 />
//             </View>

//             <View style={styles.card}>
//                 <Text style={styles.label}>Student ID</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter your student ID"
//                     placeholderTextColor="#888"
//                     value={studentId}
//                     onChangeText={setStudentId}
//                 />
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={handleRegistration}
//                 activeOpacity={0.8}
//             >
//                 <Text style={styles.buttonText}>REGISTER</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 20,
//         backgroundColor: "#121212", // Dark background
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//         color: "#1E90FF", // Blue color for title
//         textAlign: "center",
//     },
//     card: {
//         width: "100%",
//         backgroundColor: "#1E1E1E", // Dark card background
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 15,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3, // For Android shadow
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: "bold",
//         marginBottom: 5,
//         color: "#2196F3", // Blue label color
//     },
//     input: {
//         width: "100%",
//         padding: 12,
//         borderRadius: 8,
//         backgroundColor: "#333", // Dark background for input
//         borderWidth: 1,
//         borderColor: "#444",
//         marginBottom: 10,
//         color: "#FFF", // White text color
//     },
//     button: {
//         marginTop: 20,
//         width: "100%",
//         padding: 15,
//         borderRadius: 10,
//         backgroundColor: "#1E90FF", // Blue button
//         alignItems: "center",
//         elevation: 3, // Android shadow
//         shadowColor: "#000", // iOS shadow
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//     },
//     buttonText: {
//         fontSize: 18,
//         color: "#FFF", // White text
//         fontWeight: "bold",
//     },
//     bubble: {
//         width: 150, // Bigger bubbles
//         height: 150, // Bigger bubbles
//         borderRadius: 75, // Make it round
//         position: "absolute",
//         opacity: 0.6,
//     },
// });

import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, createUserWithEmailAndPassword } from "./src/firebase";

export default function StudentRegistration() {
    const navigation = useNavigation();

    const [studentName, setStudentName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [universityId, setUniversityId] = useState("");
    const [studentId, setStudentId] = useState("");

    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleRegistration = async () => {
        if (
            !studentName ||
            !email ||
            !password ||
            !universityId ||
            !studentId
        ) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Error", "Invalid email address.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await setDoc(doc(db, "students", studentId), {
                name: studentName,
                email: email,
                universityId: universityId,
            });

            Alert.alert("Success", "Registration completed successfully.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("StudentDashboardApp"),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Student Registration</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Student Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={studentName}
                    onChangeText={setStudentName}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Student ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter student ID"
                    value={studentId}
                    onChangeText={setStudentId}
                />

                <Text style={styles.label}>University ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter university ID"
                    value={universityId}
                    onChangeText={setUniversityId}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegistration}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#121212",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1E90FF",
        textAlign: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#2196F3",
    },
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#333",
        borderWidth: 1,
        borderColor: "#444",
        marginBottom: 10,
        color: "#FFF",
    },
    button: {
        marginTop: 20,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#1E90FF",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
    },
});
