import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera, CameraType, useCameraPermissions } from "expo-camera";
// import { CameraType } from "expo-image-picker";

export default function App() {
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        requestPermission();
    }, []);  

    console.log(CameraType.Back);
    

    const handleBarCodeScanned = ({ type, data }) => {
        console.log("Barcode scanned:", type, data);
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };
    

    if (!permission) {
        return <Text>Requesting camera permission</Text>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                type={CameraType.Back}
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && (
                <Button
                    title={"Tap to Scan Again"}
                    onPress={() => setScanned(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
});



// import { Camera, CameraView } from "expo-camera";
// // import { Stack } from "expo-router";
// import {
//     AppState,
//     Linking,
//     Platform,
//     SafeAreaView,
//     StatusBar,
//     StyleSheet,
// } from "react-native";
// // import { Overlay } from "./Overlay";
// import { useEffect, useRef } from "react";

// export default function Home() {
//     const qrLock = useRef(false);
//     const appState = useRef(AppState.currentState);

//     useEffect(() => {
//         const subscription = AppState.addEventListener(
//             "change",
//             (nextAppState) => {
//                 if (
//                     appState.current.match(/inactive|background/) &&
//                     nextAppState === "active"
//                 ) {
//                     qrLock.current = false;
//                 }
//                 appState.current = nextAppState;
//             }
//         );

//         return () => {
//             subscription.remove();
//         };
//     }, []);

//     return (
//         <SafeAreaView style={StyleSheet.absoluteFillObject}>
//             <Stack.Screen
//                 options={{
//                     title: "Overview",
//                     headerShown: false,
//                 }}
//             />
//             {Platform.OS === "android" ? <StatusBar hidden /> : null}
//             <CameraView
//                 style={StyleSheet.absoluteFillObject}
//                 facing="back"
//                 onBarcodeScanned={({ data }) => {
//                     if (data && !qrLock.current) {
//                         qrLock.current = true;
//                         setTimeout(async () => {
//                             await Linking.openURL(data);
//                         }, 500);
//                     }
//                 }}
//             />
//             <Overlay />
//         </SafeAreaView>
//     );
// }
