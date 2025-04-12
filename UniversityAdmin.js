import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Animated,
} from "react-native";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db, createUserWithEmailAndPassword } from "./src/firebase";

export default function UniversityAdminRegistration({ navigation }) {
    // Added navigation prop here
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [universityName, setUniversityName] = useState("");
    const [universityId, setUniversityId] = useState("");

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bubblePositions = [
        useRef(new Animated.ValueXY({ x: -50, y: 0 })).current,
        useRef(new Animated.ValueXY({ x: 200, y: 0 })).current,
        useRef(new Animated.ValueXY({ x: 500, y: 0 })).current,
        useRef(new Animated.ValueXY({ x: 300, y: 0 })).current,
        useRef(new Animated.ValueXY({ x: -200, y: 100 })).current, // Additional bubble
        useRef(new Animated.ValueXY({ x: 150, y: -50 })).current, // Additional bubble
        useRef(new Animated.ValueXY({ x: 400, y: 200 })).current, // Additional bubble
    ];

    const bubbleColors = [
        "#62B1F6", // Light blue
        "#4682B4", // Steel blue
        "#1E90FF", // Dodger blue
        "#5F9EA0", // Cadet blue
        "#87CEFA", // Light sky blue
        "#00BFFF", // Deep sky blue
        "#4169E1", // Royal blue
    ];

    // Utility function for basic email validation
    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleRegistration = async () => {
        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            !contactNumber ||
            !universityName ||
            !universityId
        ) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Create university document with user-provided universityId
            const data = await setDoc(doc(db, "university", universityId), {
                name: universityName,
                adminName: name,
            });

            Alert.alert("Success", "Registration completed successfully.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("UniversityDashboard", {
                        screen: "Dashboard",
                        params: {
                            universityId: universityId
                        }
                    }),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    useEffect(() => {
        // Start fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Start bubble animations continuously
        Animated.loop(
            Animated.stagger(
                1000,
                bubblePositions.map((position, index) =>
                    Animated.timing(position, {
                        toValue: {
                            x: Math.random() * 400, // Random x position within 400px width
                            y: Math.random() * 400, // Random y position within 400px height
                        },
                        duration: 5000 + Math.random() * 3000, // Randomize duration
                        useNativeDriver: true,
                    })
                )
            )
        ).start();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Moving Bubbles */}
            {bubblePositions.map((position, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bubble,
                        {
                            backgroundColor:
                                bubbleColors[index % bubbleColors.length],
                            transform: [
                                { translateX: position.x },
                                { translateY: position.y },
                            ],
                        },
                    ]}
                />
            ))}

            {/* Title with Fade-in Animation */}
            <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                University Admin Registration
            </Animated.Text>

            {/* Name */}
            <View style={styles.card}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* Email */}
            <View style={styles.card}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#888"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
            </View>

            {/* Password */}
            <View style={styles.card}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />
            </View>

            {/* Confirm Password */}
            <View style={styles.card}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                />
            </View>

            {/* Contact Number */}
            <View style={styles.card}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your contact number"
                    placeholderTextColor="#888"
                    value={contactNumber}
                    keyboardType="phone-pad"
                    onChangeText={setContactNumber}
                />
            </View>

            {/* University Name */}
            <View style={styles.card}>
                <Text style={styles.label}>University Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your university name"
                    placeholderTextColor="#888"
                    value={universityName}
                    onChangeText={setUniversityName}
                />
            </View>

            {/* Role Verification Admin ID */}
            <View style={styles.card}>
                <Text style={styles.label}>Role Verification Admin ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the verification ID provided by the university"
                    placeholderTextColor="#888"
                    value={universityId}
                    onChangeText={setUniversityId}
                />
            </View>

            {/* Submit Button */}
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
        backgroundColor: "#121212", // Dark background
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1E90FF", // Blue color for title
        textAlign: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#1E1E1E", // Dark card background
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#2196F3", // Blue label color
    },
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#333", // Dark background for input
        borderWidth: 1,
        borderColor: "#444",
        marginBottom: 10,
        color: "#FFF", // White text color
    },
    button: {
        marginTop: 20,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#1E90FF", // Blue button
        alignItems: "center",
        elevation: 3, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        color: "#FFF", // White text
        fontWeight: "bold",
    },
    bubble: {
        width: 150, // Bigger bubbles
        height: 150, // Bigger bubbles
        borderRadius: 75, // Make it round
        position: "absolute",
        opacity: 0.6,
    },
});
