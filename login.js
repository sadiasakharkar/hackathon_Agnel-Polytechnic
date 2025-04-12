import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    StyleSheet,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { commonStyles } from "./commonStyles";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, signInWithEmailAndPassword } from "./src/firebase";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import EventManagerDashboard from "./EventAttendance";

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [role, setRole] = useState("student");
    const [id, setId] = useState("");
    const [universityId, setUniversityId] = useState("");

    // Animated values for bubbles
    const bubble1Position = useRef(
        new Animated.ValueXY({ x: 0, y: 0 })
    ).current;
    const bubble2Position = useRef(
        new Animated.ValueXY({ x: 150, y: 100 })
    ).current;
    const bubble3Position = useRef(
        new Animated.ValueXY({ x: 200, y: 200 })
    ).current;
    const bubble4Position = useRef(
        new Animated.ValueXY({ x: -100, y: -50 })
    ).current;

    // Fade animation for the title
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start fade animation for the title
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Start bubble animations
        Animated.loop(
            Animated.stagger(500, [
                Animated.sequence([
                    Animated.timing(bubble1Position, {
                        toValue: { x: 100, y: 150 },
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubble1Position, {
                        toValue: { x: 0, y: 0 },
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(bubble2Position, {
                        toValue: { x: -50, y: 100 },
                        duration: 2500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubble2Position, {
                        toValue: { x: 150, y: 100 },
                        duration: 2500,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(bubble3Position, {
                        toValue: { x: 100, y: 300 },
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubble3Position, {
                        toValue: { x: 200, y: 200 },
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(bubble4Position, {
                        toValue: { x: 0, y: 50 },
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubble4Position, {
                        toValue: { x: -100, y: -50 },
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
        // GoogleSignin.configure({
        //     webClientId: "YOUR_WEB_CLIENT_ID", // Get this from your Firebase console
        // });
    }, []);

    const validateInputs = () => {
        if (!email.includes("@")) {
            setErrorMessage("Please enter a valid email address.");
            return false;
        }
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const handleLogin = async () => {
        if (validateInputs()) {
            try {
                // Firebase sign-in
                await signInWithEmailAndPassword(auth, email.trim(), password);

                // Check user in corresponding collection based on role
                const collectionRef = collection(db, role + "s"); // adds 's' to make plural
                const q = query(
                    collectionRef,
                    where("email", "==", email),
                    where("universityId", "==", universityId)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // User exists in the role collection
                    const userData = querySnapshot.docs[0].data();

                    // Navigate based on role
                    switch (role) {
                        case "student":
                            navigation.navigate("StudentDashboardApp", {
                                screen: "Dashboard", // Specify the screen name
                                initial: true,
                                params: {
                                    // Nest the params
                                    studentId: id,
                                    universityId: universityId,
                                },
                            });
                            break;
                        case "coordinator":
                            navigation.navigate("CoordinatorsDashboard", {
                                screen: "Dashboard",
                                params: {
                                    coordinatorId: id,
                                    universityId: universityId,
                                },
                            });
                            break;
                        case "eventManager":
                            navigation.navigate("eventmanagerdashboard", {
                                screen: "EventManagerDashboard",
                                intital: true,
                                params: {
                                    managerId: id,
                                    universityId: universityId,
                                },
                            });
                            console.log("Navigating with:", {
                                managerId: id,
                                universityId: universityId,
                            });
                            break;
                        case "admin":
                            navigation.navigate("UniversityDashboard", {
                                adminId: id,
                                universityId: universityId,
                            });
                            break;
                    }
                } else {
                    setErrorMessage("User not found in selected role.");
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    };

    // const handleGoogleSignIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const { idToken } = await GoogleSignin.signIn();
    //         const googleCredential = GoogleAuthProvider.credential(idToken);
    //         const userCredential = await signInWithCredential(
    //             auth,
    //             googleCredential
    //         );

    //         // Check user role in Firestore
    //         const user = userCredential.user;
    //         const collectionRef = collection(db, role + "s");
    //         const q = query(
    //             collectionRef,
    //             where("email", "==", user.email),
    //             where("universityId", "==", universityId)
    //         );
    //         const querySnapshot = await getDocs(q);

    //         if (!querySnapshot.empty) {
    //             const userData = querySnapshot.docs[0].data();
    //             // Navigate based on role (similar to handleLogin)
    //             switch (role) {
    //                 case "student":
    //                     navigation.navigate("StudentDashboardApp", {
    //                         screen: "Dashboard",
    //                         initial: true,
    //                         params: {
    //                             studentId: userData.id,
    //                             universityId: universityId,
    //                         },
    //                     });
    //                     break;
    //                 // ... other cases for different roles
    //             }
    //         } else {
    //             setErrorMessage("User not found in selected role.");
    //         }
    //     } catch (error) {
    //         setErrorMessage(error.message);
    //     }
    // };

    const handleForgotPassword = () => {
        console.log("Forgot Password button pressed");
        // Implement forgot password functionality
    };

    const handleSignUp = () => {
        navigation.navigate("Signup"); // Navigate back to SignInPage
    };

    return (
        <View style={styles.container}>
            {/* Animated Bubbles */}
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        transform: [
                            { translateX: bubble1Position.x },
                            { translateY: bubble1Position.y },
                        ],
                    },
                ]}
            ></Animated.View>
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        transform: [
                            { translateX: bubble2Position.x },
                            { translateY: bubble2Position.y },
                        ],
                    },
                ]}
            ></Animated.View>
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        transform: [
                            { translateX: bubble3Position.x },
                            { translateY: bubble3Position.y },
                        ],
                    },
                ]}
            ></Animated.View>
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        transform: [
                            { translateX: bubble4Position.x },
                            { translateY: bubble4Position.y },
                        ],
                    },
                ]}
            ></Animated.View>

            {/* Title with animation */}
            
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                    Evento
                </Animated.Text>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#fff"
                    >
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Coordinator" value="coordinator" />
                        <Picker.Item
                            label="Event Manager"
                            value="eventManager"
                        />
                        <Picker.Item label="Admin" value="admin" />
                    </Picker>
                </View>

                {/* Email Input */}
                <View style={styles.input}>
                    <Icon
                        name="mail-outline"
                        size={20}
                        color="#ddd"
                        style={{ marginHorizontal: 5 }}
                    />
                    <TextInput
                        placeholder="Email address"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.textInput}
                    />
                </View>

                {/* Password Input */}
                <View style={styles.input}>
                    <Icon
                        name="lock-closed-outline"
                        size={20}
                        color="#ddd"
                        style={{ marginHorizontal: 5 }}
                    />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.input}>
                    <Icon
                        name="id-card-outline"
                        size={20}
                        color="#ddd"
                        style={{ marginHorizontal: 5 }}
                    />
                    <TextInput
                        placeholder={`Enter ${role} ID`}
                        value={id}
                        onChangeText={setId}
                        style={styles.textInput}
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.input}>
                    <Icon
                        name="business-outline"
                        size={20}
                        color="#ddd"
                        style={{ marginHorizontal: 5 }}
                    />
                    <TextInput
                        placeholder="University ID"
                        value={universityId}
                        onChangeText={setUniversityId}
                        style={styles.textInput}
                        placeholderTextColor="#888"
                    />
                </View>

                {/* Error Message */}
                {errorMessage !== "" && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    activeOpacity={0.8}
                >
                    <Icon
                        name="logo-google"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 10 }}
                    />
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity> */}

                {/* Forgot Password */}
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.backButtonText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign Up Navigation */}
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.backButtonText}>
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    // googleButton: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     backgroundColor: "#fff",
    //     paddingVertical: 12,
    //     paddingHorizontal: 20,
    //     borderRadius: 8,
    //     marginVertical: 10,
    // },
    // googleIcon: {
    //     width: 24,
    //     height: 24,
    //     marginRight: 10,
    // },
    // googleButtonText: {
    //     color: "#757575",
    //     fontSize: 16,
    //     fontWeight: "bold",
    // },
    pickerContainer: {
        backgroundColor: "#333",
        borderRadius: 10,
        marginBottom: 15,
        width: "100%",
        overflow: "hidden",
    },
    picker: {
        color: "#fff",
        width: "100%",
        height: 50, // Add specific height
        backgroundColor: "transparent",
    },
    // Add styles for Picker.Item
    pickerItem: {
        fontSize: 16,
        color: "#fff",
    },

    container: {
        flex: 1,
        backgroundColor: "#121212", // Dark background
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#fff", // White title
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: "#ddd", // Light grey text
        marginBottom: 10,
    },
    input: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333", // Dark input background
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        width: "100%",
    },
    textInput: {
        flex: 1,
        color: "#fff", // White text in input fields
        paddingHorizontal: 10,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#62B1F6", // Blue button
        paddingVertical: 12,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff", // White text on button
    },
    backButtonText: {
        color: "#62B1F6", // Blue text for links
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
    },
    bubble: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#4C9EE6", // Lighter blue bubble for dark theme
        position: "absolute",
        opacity: 0.6,
    },
});
