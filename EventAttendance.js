import React, { useState, useRef } from "react";  // Add useRef import
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const EventManagerDashboard = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      name: "Tech Conference 2025",
      date: "2025-01-15",
      time: "10:00 AM",
      coordinatorsAssigned: 5,
      studentsRegistered: 200,
      attendanceCoordinator: 90,
      attendanceStudent: 85,
    },
    {
      id: "2",
      name: "Hackathon 2025",
      date: "2025-02-10",
      time: "9:00 AM",
      coordinatorsAssigned: 3,
      studentsRegistered: 150,
      attendanceCoordinator: 80,
      attendanceStudent: 75,
    },
  ]);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [coordinatorModalVisible, setCoordinatorModalVisible] = useState(false);  // Add state for coordinator modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const svgRef = useRef();  // Initialize the useRef hook for QRCode

  const generateQRCode = (event) => {
    setSelectedEvent(event);
    setQrModalVisible(true);
  };

  const saveQRCode = () => {
    if (svgRef.current) {
      svgRef.current.toDataURL((data) => {
        const fileUri = FileSystem.documentDirectory + `${selectedEvent.name}_QR.png`;
        FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        }).then(() => {
          Sharing.shareAsync(fileUri);
          Alert.alert("QR Code Saved", "The QR code has been saved and shared!");
        });
      });
    }
  };

  const downloadAttendanceReport = (event) => {
    const reportData = `
      Event Name: ${event.name}
      Date: ${event.date}
      Time: ${event.time}
      Total Coordinators Assigned: ${event.coordinatorsAssigned}
      Total Students Registered: ${event.studentsRegistered}
      Attendance Percentage (Coordinators): ${event.attendanceCoordinator}%
      Attendance Percentage (Students): ${event.attendanceStudent}%
    `;

    const fileUri = FileSystem.documentDirectory + `${event.name}_Attendance_Report.txt`;
    FileSystem.writeAsStringAsync(fileUri, reportData).then(() => {
      Alert.alert("Report Downloaded", `Attendance report for ${event.name} has been downloaded!`);
    });
  };

  const showCoordinatorAttendance = (event) => {
    setSelectedEvent(event);
    setCoordinatorModalVisible(true);  // Open coordinator modal
  };

  const renderEventOverview = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventDetails}>
        {item.date} | {item.time}
      </Text>
      <Text style={styles.statText}>Coordinators Assigned: {item.coordinatorsAssigned}</Text>
      <Text style={styles.statText}>Students Registered: {item.studentsRegistered}</Text>
      <Text style={styles.statText}>
        Attendance (Coordinators): {item.attendanceCoordinator}%
      </Text>
      <Text style={styles.statText}>
        Attendance (Students): {item.attendanceStudent}%
      </Text>
      <TouchableOpacity
        style={styles.qrButton}
        onPress={() => generateQRCode(item)} // QR code generation
      >
        <Text style={styles.qrButtonText}>Generate QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attendanceButton}
        onPress={() => showCoordinatorAttendance(item)} // View Coordinator Attendance
      >
        <Text style={styles.attendanceButtonText}>View Coordinator Attendance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attendanceButton}
        onPress={() => downloadAttendanceReport(item)} // Download student attendance report
      >
        <Text style={styles.attendanceButtonText}>Download Student Attendance Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Event Manager Dashboard</Text>
      <FlatList
        data={events}
        renderItem={renderEventOverview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventList}
      />

      {/* QR Code Modal */}
      {qrModalVisible && selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={qrModalVisible}
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>QR Code for {selectedEvent.name}</Text>
              <QRCode
                value={`Event: ${selectedEvent.name}, Date: ${selectedEvent.date}, Time: ${selectedEvent.time}`}
                size={200}
                getRef={svgRef} // Use the ref from useRef hook
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveQRCode} // Save QR Code functionality
              >
                <Text style={styles.saveButtonText}>Save QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Coordinator Attendance Modal */}
      {coordinatorModalVisible && selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={coordinatorModalVisible}
          onRequestClose={() => setCoordinatorModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Coordinator Attendance for {selectedEvent.name}
              </Text>
              <Text style={styles.statText}>
                Coordinators Assigned: {selectedEvent.coordinatorsAssigned}
              </Text>
              <Text style={styles.statText}>
                Attendance Percentage: {selectedEvent.attendanceCoordinator}%
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCoordinatorModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  eventList: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  eventTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    color: "#bbb",
  },
  qrButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  qrButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  attendanceButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  attendanceButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default EventManagerDashboard;