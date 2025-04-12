import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as BarCodeScanner from "expo-barcode-scanner";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

const LiveCheckInPage = () => {
  // Sample attendees data
  const [attendees, setAttendees] = useState([
    { id: "1", name: "John Doe", checkedIn: false },
    { id: "2", name: "Jane Smith", checkedIn: false },
    { id: "3", name: "Mark Johnson", checkedIn: false },
    { id: "4", name: "Emma Williams", checkedIn: false },
  ]);

  const [search, setSearch] = useState("");
  const [manualCheckInId, setManualCheckInId] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  // Function to handle manual check-in
  const handleManualCheckIn = (id) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.id === id ? { ...attendee, checkedIn: true } : attendee
      )
    );
  };

  // Function to handle search functionality
  const filterAttendees = () => {
    if (search.trim() === "") {
      return attendees;
    }
    return attendees.filter((attendee) =>
      attendee.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Request camera permission for QR code scanning
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle barcode scan
  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data);
    Alert.alert("QR Code Scanned", `Attendee ID: ${data}`, [
      {
        text: "Confirm",
        onPress: () => {
          const attendee = attendees.find((attendee) => attendee.id === data);
          if (attendee) {
            handleManualCheckIn(attendee.id);
            setScannedData(null);
          }
        },
      },
      { text: "Cancel", onPress: () => setScannedData(null) },
    ]);
  };

  // Live Check-in
  const renderItem = ({ item }) => (
    <View style={styles.attendeeCard}>
      <Text style={styles.attendeeName}>{item.name}</Text>
      <Text style={styles.attendeeStatus}>
        {item.checkedIn ? "Checked In" : "Not Checked In"}
      </Text>
      <TouchableOpacity
        style={[styles.checkInButton, item.checkedIn && styles.checkedInButton]}
        onPress={() => handleManualCheckIn(item.id)}
      >
        <Ionicons
          name={item.checkedIn ? "checkmark-circle" : "checkmark-circle-outline"}
          size={20}
          color={item.checkedIn ? "#4CAF50" : "#FF9800"}
        />
        <Text style={styles.checkInButtonText}>
          {item.checkedIn ? "Mark as Checked" : "Mark as Present"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Generate CSV Report
  const generateCSVReport = () => {
    const checkedInAttendees = attendees.filter((attendee) => attendee.checkedIn);
    let csv = "Name,Status\n";
    checkedInAttendees.forEach((attendee) => {
      csv += `${attendee.name},Checked In\n`;
    });
    const fileUri = FileSystem.documentDirectory + "attendance_report.csv";
    FileSystem.writeAsStringAsync(fileUri, csv).then(() => {
      Sharing.shareAsync(fileUri);
    });
  };

  // Generate PDF Report
  const generatePDFReport = async () => {
    const checkedInAttendees = attendees.filter((attendee) => attendee.checkedIn);
    let htmlContent = "<h1>Attendance Report</h1><ul>";
    checkedInAttendees.forEach((attendee) => {
      htmlContent += `<li>${attendee.name} - Checked In</li>`;
    });
    htmlContent += "</ul>";

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Live Check-in</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Attendees"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filterAttendees()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.attendeeList}
      />

      {/* QR Code Scanner */}
      <View style={styles.qrScannerContainer}>
        <Text style={styles.qrScannerText}>Scan QR Code for Check-in</Text>
        {hasPermission === null ? (
          <Text style={styles.qrScannerText}>Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <Text style={styles.qrScannerText}>No access to camera</Text>
        ) : (
          <BarCodeScanner
            onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
            style={styles.qrScanner}
          />
        )}
      </View>

      {/* Attendance Report Buttons */}
      <View style={styles.reportButtonContainer}>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={generateCSVReport}
        >
          <Text style={styles.reportButtonText}>Generate CSV Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={generatePDFReport}
        >
          <Text style={styles.reportButtonText}>Generate PDF Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Light text
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "#333", // Dark input field
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#fff", // Light text inside input
    borderWidth: 1,
    borderColor: "#555", // Lighter border
  },
  attendeeList: {
    paddingBottom: 20,
  },
  attendeeCard: {
    backgroundColor: "#222", // Dark background for each card
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#555", // Lighter border
  },
  attendeeName: {
    fontSize: 18,
    color: "#fff", // Light text
    marginBottom: 5,
  },
  attendeeStatus: {
    fontSize: 14,
    color: "#bbb", // Lighter text
    marginBottom: 10,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800", // Orange background
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  checkedInButton: {
    backgroundColor: "#4CAF50", // Green background when checked in
  },
  checkInButtonText: {
    color: "#fff", // Light text
    marginLeft: 10,
    fontSize: 16,
  },
  qrScannerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrScannerText: {
    fontSize: 18,
    color: "#fff", // Light text for QR scanner instructions
    marginBottom: 10,
  },
  qrScanner: {
    width: "100%",
    height: 300,
  },
  reportButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  reportButton: {
    backgroundColor: "#FF9800", // Orange background for report buttons
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  reportButtonText: {
    color: "#fff", // Light text on report buttons
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LiveCheckInPage;
