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

export default function EventManagerRegistration() {
    const navigation = useNavigation();

    const [managerName, setManagerName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [managerId, setManagerId] = useState("");
    const [universityId, setUniversityId] = useState("");

    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleRegistration = async () => {
        if (
            !managerName ||
            !email ||
            !password ||
            !managerId ||
            !universityId
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

            await setDoc(doc(db, "eventManagers", managerId), {
                name: managerName,
                email: email,
                universityId: universityId,
            });

            Alert.alert("Success", "Registration completed successfully.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("eventmanagerdashboard"),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Event Manager Registration</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Manager Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter manager name"
                    value={managerName}
                    onChangeText={setManagerName}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Manager ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter manager ID"
                    value={managerId}
                    onChangeText={setManagerId}
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
