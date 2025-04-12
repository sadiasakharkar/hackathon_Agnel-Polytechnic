import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Button,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb } from "react-native-pdf-lib";

export default function App() {
    const [name, setName] = useState("");
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState("");
    const [signature, setSignature] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const pickSignature = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSignature(result.assets[0].uri);
        }
    };

    // const generateCertificate = async () => {
    //     if (!name || !eventName || !date) {
    //         setErrorMessage(
    //             "Please fill in all fields before generating the certificate."
    //         );
    //         return;
    //     }
    //     setErrorMessage("");
    //     setLoading(true);

    //     try {
    //         const certificate = { name, eventName, date, signature };
    //         setCertificateData(certificate);
    //         setShowCertificate(true);
    //     } catch (error) {
    //         console.error("Error generating certificate:", error);
    //         Alert.alert(
    //             "Error",
    //             "Unable to generate the certificate. Please try again."
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const sendCertificate = () => {
        Alert.alert(
            "Certificate Sent",
            `The certificate for ${name} has been sent successfully.`
        );
        setShowCertificate(false);
    };

    const downloadCertificate = async () => {
        try {
            const doc = await PDFDocument.create();
            const page = doc.addPage([600, 800]);

            page.drawText("Certificate of Recognition", {
                x: 200,
                y: 700,
                fontSize: 24,
                color: rgb(1, 1, 1),
            });

            page.drawText(`This award is given to ${certificateData?.name}`, {
                x: 180,
                y: 650,
                fontSize: 18,
                color: rgb(1, 1, 1),
            });

            page.drawText(
                `This is to certify that ${certificateData?.name} has actively participated in the ${certificateData?.eventName} event held on ${certificateData?.date}`,
                {
                    x: 50,
                    y: 600,
                    fontSize: 14,
                    color: rgb(1, 1, 1),
                }
            );

            page.drawText(
                "Your dedication and contribution to the event are highly appreciated, and we commend your enthusiasm and efforts.",
                {
                    x: 50,
                    y: 550,
                    fontSize: 12,
                    color: rgb(1, 1, 1),
                }
            );

            if (signature) {
                const signatureImage = await FileSystem.readAsStringAsync(
                    signature,
                    { encoding: FileSystem.EncodingType.Base64 }
                );
                page.drawImage(signatureImage, {
                    x: 200,
                    y: 450,
                    width: 100,
                    height: 50,
                });
            }

            page.drawText("Principal", {
                x: 250,
                y: 400,
                fontSize: 14,
                color: rgb(1, 1, 1),
            });

            const pdfPath = FileSystem.documentDirectory + "certificate.pdf";
            await doc.writeToFile(pdfPath);

            await Sharing.shareAsync(pdfPath);

            Alert.alert(
                "Download Successful",
                "The certificate has been downloaded."
            );
        } catch (error) {
            console.error("Error generating PDF:", error);
            Alert.alert(
                "Error",
                "Unable to generate the certificate. Please try again."
            );
        }
    };

    const clearFields = () => {
        setName("");
        setEventName("");
        setDate("");
        setSignature(null);
        setCertificateData(null);
        setShowCertificate(false);
        setErrorMessage("");
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}

            {!showCertificate ? (
                <View style={styles.form}>
                    <Text style={styles.label}>Enter Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.label}>Enter Event Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Event Name"
                        value={eventName}
                        onChangeText={setEventName}
                    />
                    <Text style={styles.label}>Enter Date:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Date (DD/MM/YYYY)"
                        value={date}
                        onChangeText={setDate}
                    />
                    <Text style={styles.label}>
                        Upload Principal's Signature:
                    </Text>
                    <Button title="Pick Signature" onPress={pickSignature} />
                    {signature && (
                        <Image
                            source={{ uri: signature }}
                            style={styles.previewImage}
                        />
                    )}
                    {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={generateCertificate}
                        disabled={loading}
                    >
                        <Text style={styles.generateButtonText}>
                            Generate Certificate
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.certificateContainer}>
                    <Image
                        source={require("./123.jpg")}
                        style={styles.certificateBackground}
                    />
                    <View style={styles.textContainer}>
                        <Text style={[styles.text, styles.header]}>
                            Certificate of Recognition
                        </Text>
                        <Text style={[styles.text, styles.subHeader]}>
                            This award is given to
                        </Text>
                        <Text style={[styles.text, styles.name]}>
                            {certificateData?.name}
                        </Text>
                        <Text
                            style={[styles.text, styles.body]}
                        >{`This is to certify that ${certificateData?.name} has actively participated in the ${certificateData?.eventName} event held on ${certificateData?.date}.`}</Text>
                        <Text style={[styles.text, styles.footer]}>
                            Your dedication and contribution to the event are
                            highly appreciated, and we commend your enthusiasm
                            and efforts.
                        </Text>
                        {signature && (
                            <Image
                                source={{ uri: signature }}
                                style={styles.signature}
                            />
                        )}
                        <Text style={[styles.text, styles.principal]}>
                            Principal
                        </Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={sendCertificate}
                        >
                            <Text style={styles.buttonText}>
                                Send to Student
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={downloadCertificate}
                        >
                            <Text style={styles.buttonText}>
                                Download Certificate
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={clearFields}
                        >
                            <Text style={styles.buttonText}>Clear Fields</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212", // Dark background color
        paddingHorizontal: 20,
    },
    form: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: "bold",
        color: "#fff", // White text color
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
        color: "#fff", // White text color
        backgroundColor: "#333", // Dark input background
    },
    previewImage: {
        width: 100,
        height: 50,
        marginVertical: 10,
    },
    generateButton: {
        backgroundColor: "#003366", // Dark blue color
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
    },
    generateButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    certificateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
    },
    certificateBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    textContainer: {
        width: "80%",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        textAlign: "center",
    },
    text: {
        color: "#000", // Black text color for certificate text
        textAlign: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 18,
        fontStyle: "italic",
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    body: {
        fontSize: 14,
        marginBottom: 18,
    },
    footer: {
        fontSize: 12,
        marginBottom: 18,
    },
    signature: {
        width: 100,
        height: 50,
        resizeMode: "contain",
        marginBottom: 16,
    },
    principal: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 30,
        left: "10%",
        right: "10%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    button: {
        backgroundColor: "#003366", // Dark blue color
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    errorMessage: {
        color: "red",
        fontSize: 14,
        marginVertical: 10,
    },
});

// export default App();
// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     StyleSheet,
// } from "react-native";
// import { collection, query, where, getDocs, doc } from "firebase/firestore";
// import { db } from "./src/firebase";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { PDFDocument, rgb } from "react-native-pdf-lib";

// const CertificateGenerator = () => {
//     const [eventId, setEventId] = useState("");
//     const [universityId, setUniversityId] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [registrations, setRegistrations] = useState([]);

//     const fetchRegistrationsAndGenerateCertificates = async () => {
//         if (!eventId || !universityId) {
//             Alert.alert(
//                 "Error",
//                 "Please enter both Event ID and University ID"
//             );
//             return;
//         }

//         setLoading(true);
//         try {
//             // First verify if event exists for this university
//             const eventsRef = collection(db, "events");
//             const eventQuery = query(
//                 eventsRef,
//                 where("universityId", "==", universityId)
//             );
//             const eventSnapshot = await getDocs(eventQuery);

//             if (eventSnapshot.empty) {
//                 Alert.alert("Error", "No events found for this university");
//                 return;
//             }

//             // Get event details
//             let eventName = "";
//             eventSnapshot.forEach((doc) => {
//                 if (doc.id === eventId) {
//                     eventName = doc.data().eventName;
//                 }
//             });

//             if (!eventName) {
//                 Alert.alert("Error", "Event not found");
//                 return;
//             }

//             // Fetch registrations for this event
//             const registrationsRef = collection(db, "eventRegistrations");
//             const registrationsQuery = query(
//                 registrationsRef,
//                 where("eventId", "==", eventId),
//                 where("universityId", "==", universityId)
//             );
//             const registrationsSnapshot = await getDocs(registrationsQuery);

//             if (registrationsSnapshot.empty) {
//                 Alert.alert("Error", "No registrations found for this event");
//                 return;
//             }

//             const registrationData = [];
//             registrationsSnapshot.forEach((doc) => {
//                 registrationData.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             await generateBulkCertificates(registrationData, eventName);
//             setRegistrations(registrationData);
//         } catch (error) {
//             console.error("Error:", error);
//             Alert.alert("Error", "Failed to generate certificates");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateBulkCertificates = async (registrations, eventName) => {
//         try {
//             // Create a new PDF document
//             const pdfDoc = await PDFDocument.create();
//             const pages = [];

//             // Add pages and content
//             for (const registration of registrations) {
//                 const page = pdfDoc.addPages([595, 842]); // A4 size in points
//                 const { width, height } = page.getSize();

//                 // Certificate Header
//                 page.drawText("Certificate of Recognition", {
//                     x: width / 2 - 100,
//                     y: height - 100,
//                     size: 24,
//                     color: rgb(0, 0, 0),
//                 });

//                 // Student Name
//                 page.drawText(`This award is given to ${registration.name}`, {
//                     x: width / 2 - 150,
//                     y: height - 200,
//                     size: 18,
//                     color: rgb(0, 0, 0),
//                 });

//                 // Certificate Body
//                 page.drawText(
//                     `This is to certify that ${registration.name} has actively participated in the ${eventName} event.`,
//                     {
//                         x: 50,
//                         y: height - 300,
//                         size: 14,
//                         color: rgb(0, 0, 0),
//                     }
//                 );

//                 // Date
//                 page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
//                     x: 50,
//                     y: height - 400,
//                     size: 12,
//                     color: rgb(0, 0, 0),
//                 });

//                 // Principal Text
//                 page.drawText("Principal", {
//                     x: width / 2 - 30,
//                     y: height - 500,
//                     size: 14,
//                     color: rgb(0, 0, 0),
//                 });

//                 pages.push(page);
//             }

//             // Save the PDF
//             const pdfBytes = await pdfDoc.save();
//             const pdfPath = `${FileSystem.documentDirectory}certificates.pdf`;
//             await FileSystem.writeAsStringAsync(pdfPath, pdfBytes, {
//                 encoding: FileSystem.EncodingType.Base64,
//             });

//             // Share the PDF
//             await Sharing.shareAsync(pdfPath);

//             Alert.alert(
//                 "Success",
//                 `Generated certificates for ${registrations.length} students`
//             );
//         } catch (error) {
//             console.error("Error generating certificates:", error);
//             Alert.alert("Error", "Failed to generate certificates");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.form}>
//                 <Text style={styles.label}>Enter Event ID:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Event ID"
//                     value={eventId}
//                     onChangeText={setEventId}
//                     placeholderTextColor="#666"
//                 />

//                 <Text style={styles.label}>Enter University ID:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="University ID"
//                     value={universityId}
//                     onChangeText={setUniversityId}
//                     placeholderTextColor="#666"
//                 />

//                 <TouchableOpacity
//                     style={styles.generateButton}
//                     onPress={fetchRegistrationsAndGenerateCertificates}
//                     disabled={loading}
//                 >
//                     <Text style={styles.generateButtonText}>
//                         {loading ? "Generating..." : "Generate Certificates"}
//                     </Text>
//                 </TouchableOpacity>

//                 {registrations.length > 0 && (
//                     <Text style={styles.resultText}>
//                         Generated {registrations.length} certificates
//                     </Text>
//                 )}
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#121212",
//         padding: 20,
//     },
//     form: {
//         flex: 1,
//         paddingTop: 20,
//     },
//     label: {
//         fontSize: 16,
//         color: "#FFF",
//         marginBottom: 8,
//     },
//     input: {
//         backgroundColor: "#333",
//         padding: 12,
//         borderRadius: 8,
//         color: "#FFF",
//         marginBottom: 16,
//         fontSize: 16,
//     },
//     generateButton: {
//         backgroundColor: "#1E90FF",
//         padding: 15,
//         borderRadius: 8,
//         alignItems: "center",
//         marginTop: 20,
//     },
//     generateButtonText: {
//         color: "#FFF",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
//     resultText: {
//         color: "#1E90FF",
//         fontSize: 16,
//         textAlign: "center",
//         marginTop: 20,
//     },
// });

// export default CertificateGenerator;
