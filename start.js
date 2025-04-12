// import React, { useEffect, useState, useRef } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Animated,
// } from "react-native";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// export default function Start({ navigation }) {
//     const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
//     const fadeAnimTitle = useRef(new Animated.Value(0)).current;
//     const fadeAnimSubtitle = useRef(new Animated.Value(0)).current;
//     const scaleAnim = useRef(new Animated.Value(1)).current;

//     // Animated values for bubble movement
//     const bubble1Position = useRef(
//         new Animated.ValueXY({ x: -50, y: 0 })
//     ).current;
//     const bubble2Position = useRef(
//         new Animated.ValueXY({ x: 200, y: 0 })
//     ).current;
//     const bubble3Position = useRef(
//         new Animated.ValueXY({ x: 500, y: 0 })
//     ).current;
//     const bubble4Position = useRef(
//         new Animated.ValueXY({ x: 300, y: 0 })
//     ).current;

//     // Firebase Authentication
//     const auth = getAuth();

//     useEffect(() => {
//         // Check the user's login state when the component is mounted
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 // User is logged in, navigate to the dashboard or home page
//                 setIsUserLoggedIn(true);
//                 navigation.replace("RoleSelection"); // Replace the Start screen with the Home screen if logged in
//             } else {
//                 // User is not logged in, show the Start screen
//                 setIsUserLoggedIn(false);
//             }
//         });

//         // Cleanup on unmount
//         return () => unsubscribe();
//     }, [auth, navigation]);

//     useEffect(() => {
//         if (!isUserLoggedIn) {
//             // Fade-in animation for the title and subtitle when the user is not logged in
//             Animated.sequence([
//                 Animated.timing(fadeAnimTitle, {
//                     toValue: 1,
//                     duration: 1000,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(fadeAnimSubtitle, {
//                     toValue: 1,
//                     duration: 1000,
//                     useNativeDriver: true,
//                 }),
//             ]).start();

//             // Start continuous bubble animations
//             Animated.loop(
//                 Animated.stagger(1500, [
//                     // Bubble 1 animation: Move in a circular pattern
//                     Animated.timing(bubble1Position, {
//                         toValue: {
//                             x: Math.random() * 300 - 150,
//                             y: Math.random() * 300 - 150,
//                         }, // Randomized movement
//                         duration: 5000 + Math.random() * 2000, // Random duration for each move
//                         useNativeDriver: true,
//                     }),
//                     // Bubble 2 animation
//                     Animated.timing(bubble2Position, {
//                         toValue: {
//                             x: Math.random() * 300 - 150,
//                             y: Math.random() * 300 - 150,
//                         },
//                         duration: 5000 + Math.random() * 2000,
//                         useNativeDriver: true,
//                     }),
//                     // Bubble 3 animation
//                     Animated.timing(bubble3Position, {
//                         toValue: {
//                             x: Math.random() * 300 - 150,
//                             y: Math.random() * 300 - 150,
//                         },
//                         duration: 5000 + Math.random() * 2000,
//                         useNativeDriver: true,
//                     }),
//                     // Bubble 4 animation
//                     Animated.timing(bubble4Position, {
//                         toValue: {
//                             x: Math.random() * 300 - 150,
//                             y: Math.random() * 300 - 150,
//                         },
//                         duration: 5000 + Math.random() * 2000,
//                         useNativeDriver: true,
//                     }),
//                 ])
//             ).start();
//         }
//     }, [isUserLoggedIn]);

//     const handlePressIn = () => {
//         Animated.spring(scaleAnim, {
//             toValue: 0.95,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     const handlePressOut = () => {
//         Animated.spring(scaleAnim, {
//             toValue: 1,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     const handlePress = () => {
//         // Redirect to the next page (Signup)
//         navigation.navigate("Signup");
//     };

//     // Show the Start screen only if the user is not logged in
//     if (isUserLoggedIn) {
//         return null; // Return nothing if logged in, as user is redirected
//     }

//     return (
//         <View style={styles.container}>
//             {/* Moving Bubbles */}
//             <Animated.View
//                 style={[
//                     styles.bubble1,
//                     {
//                         transform: [
//                             { translateX: bubble1Position.x },
//                             { translateY: bubble1Position.y },
//                         ],
//                     },
//                 ]}
//             />
//             <Animated.View
//                 style={[
//                     styles.bubble2,
//                     {
//                         transform: [
//                             { translateX: bubble2Position.x },
//                             { translateY: bubble2Position.y },
//                         ],
//                     },
//                 ]}
//             />
//             <Animated.View
//                 style={[
//                     styles.bubble3,
//                     {
//                         transform: [
//                             { translateX: bubble3Position.x },
//                             { translateY: bubble3Position.y },
//                         ],
//                     },
//                 ]}
//             />
//             <Animated.View
//                 style={[
//                     styles.bubble4,
//                     {
//                         transform: [
//                             { translateX: bubble4Position.x },
//                             { translateY: bubble4Position.y },
//                         ],
//                     },
//                 ]}
//             />

//             <View style={styles.innerContainer}>
//                 <Animated.Text
//                     style={[styles.title, { opacity: fadeAnimTitle }]}
//                 >
//                     Welcome to EventManager
//                 </Animated.Text>
//                 <Animated.Text
//                     style={[styles.subtitle, { opacity: fadeAnimSubtitle }]}
//                 >
//                     Start managing your events with ease. Let’s get started!
//                 </Animated.Text>
//                 <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//                     <TouchableOpacity
//                         style={styles.buttonPrimary}
//                         onPress={handlePress}
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                     >
//                         <Text style={styles.buttonText}>Get Started</Text>
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//         backgroundColor: "#121212", // Dark background color
//     },
//     bubble1: {
//         width: 180, // Bigger bubbles
//         height: 180, // Bigger bubbles
//         borderRadius: 90, // Make it round
//         backgroundColor: "#62B1F6", // Light blue
//         position: "absolute",
//         top: 20,
//         left: -30,
//         opacity: 0.5,
//     },
//     bubble2: {
//         width: 160, // Bigger bubbles
//         height: 160, // Bigger bubbles
//         borderRadius: 80, // Make it round
//         backgroundColor: "#4A90E2", // Medium blue
//         position: "absolute",
//         top: 150,
//         left: 200,
//         opacity: 0.4,
//     },
//     bubble3: {
//         width: 200, // Bigger bubbles
//         height: 200, // Bigger bubbles
//         borderRadius: 100, // Make it round
//         backgroundColor: "#2A5298", // Royal blue
//         position: "absolute",
//         top: 400,
//         left: -50,
//         opacity: 0.3,
//     },
//     bubble4: {
//         width: 240, // Bigger bubbles
//         height: 240, // Bigger bubbles
//         borderRadius: 120, // Make it round
//         backgroundColor: "#1F3558", // Dark blue
//         position: "absolute",
//         top: 600,
//         left: 50,
//         opacity: 0.4,
//     },
//     innerContainer: {
//         justifyContent: "center",
//         alignItems: "center",
//         textAlign: "center",
//         zIndex: 1, // Ensure content stays above the bubbles
//     },
//     title: {
//         fontSize: 36,
//         marginBottom: 20,
//         fontWeight: "bold",
//         color: "#fff", // White text color for dark theme
//         textAlign: "center",
//     },
//     subtitle: {
//         fontSize: 18,
//         marginBottom: 40,
//         color: "#ccc", // Lighter gray for subtitle text
//         textAlign: "center",
//         paddingHorizontal: 10,
//     },
//     buttonPrimary: {
//         width: "80%",
//         padding: 15,
//         marginBottom: 20,
//         borderRadius: 30,
//         backgroundColor: "#62B1F6", // blue button
//         alignItems: "center",
//         elevation: 5,
//     },
//     buttonText: {
//         fontSize: 18,
//         color: "#fff",
//         fontWeight: "bold",
//     },
// });

import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";

export default function Start({ navigation }) {
    const fadeAnimTitle = useRef(new Animated.Value(0)).current;
    const fadeAnimSubtitle = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animated values for bubble movement
    const bubble1Position = useRef(
        new Animated.ValueXY({ x: -50, y: 0 })
    ).current;
    const bubble2Position = useRef(
        new Animated.ValueXY({ x: 200, y: 0 })
    ).current;
    const bubble3Position = useRef(
        new Animated.ValueXY({ x: 500, y: 0 })
    ).current;
    const bubble4Position = useRef(
        new Animated.ValueXY({ x: 300, y: 0 })
    ).current;

    useEffect(() => {
        // Disable the header for this screen
        navigation.setOptions({ headerShown: false });

        // Fade-in animation for the title and subtitle
        Animated.sequence([
            Animated.timing(fadeAnimTitle, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnimSubtitle, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Start continuous bubble animations
        Animated.loop(
            Animated.stagger(1500, [
                // Bubble 1 animation: Move in a circular pattern
                Animated.timing(bubble1Position, {
                    toValue: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                    }, // Randomized movement
                    duration: 5000 + Math.random() * 2000, // Random duration for each move
                    useNativeDriver: true,
                }),
                // Bubble 2 animation
                Animated.timing(bubble2Position, {
                    toValue: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                    },
                    duration: 5000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
                // Bubble 3 animation
                Animated.timing(bubble3Position, {
                    toValue: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                    },
                    duration: 5000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
                // Bubble 4 animation
                Animated.timing(bubble4Position, {
                    toValue: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                    },
                    duration: 5000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [navigation]); // Make sure to include navigation as a dependency

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        // Redirect to the next page (Signup)
        navigation.navigate("Signup");
    };
    // const handlePress = () => { fo tp
    //   navigation.navigate('StudentDashboardApp');
    // };

    return (
        <View style={styles.container}>
            {/* Moving Bubbles */}
            <Animated.View
                style={[
                    styles.bubble1,
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
                    styles.bubble2,
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
                    styles.bubble3,
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
                    styles.bubble4,
                    {
                        transform: [
                            { translateX: bubble4Position.x },
                            { translateY: bubble4Position.y },
                        ],
                    },
                ]}
            ></Animated.View>

            <View style={styles.innerContainer}>
                <Animated.Text
                    style={[styles.title, { opacity: fadeAnimTitle }]}
                >
                    Welcome to EventManager
                </Animated.Text>
                <Animated.Text
                    style={[styles.subtitle, { opacity: fadeAnimSubtitle }]}
                >
                    Start managing your events with ease. Let’s get started!
                </Animated.Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={handlePress}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#121212", // Dark background color
    },
    bubble1: {
        width: 180, // Bigger bubbles
        height: 180, // Bigger bubbles
        borderRadius: 90, // Make it round
        backgroundColor: "#62B1F6", // Light blue
        position: "absolute",
        top: 20,
        left: -30,
        opacity: 0.5,
    },
    bubble2: {
        width: 160, // Bigger bubbles
        height: 160, // Bigger bubbles
        borderRadius: 80, // Make it round
        backgroundColor: "#4A90E2", // Medium blue
        position: "absolute",
        top: 150,
        left: 200,
        opacity: 0.4,
    },
    bubble3: {
        width: 200, // Bigger bubbles
        height: 200, // Bigger bubbles
        borderRadius: 100, // Make it round
        backgroundColor: "#2A5298", // Royal blue
        position: "absolute",
        top: 400,
        left: -50,
        opacity: 0.3,
    },
    bubble4: {
        width: 240, // Bigger bubbles
        height: 240, // Bigger bubbles
        borderRadius: 120, // Make it round
        backgroundColor: "#1F3558", // Dark blue
        position: "absolute",
        top: 600,
        left: 50,
        opacity: 0.4,
    },
    innerContainer: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 1, // Ensure content stays above the bubbles
    },
    title: {
        fontSize: 36,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#fff", // White text color for dark theme
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        color: "#ccc", // Lighter gray for subtitle text
        textAlign: "center",
        paddingHorizontal: 10,
    },
    buttonPrimary: {
        width: "80%",
        padding: 15,
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: "#62B1F6", // blue button
        alignItems: "center",
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});
