import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

const AttendanceTrackingcoordinator = () => {
  const [attendees, setAttendees] = useState([
    { id: '1', name: 'Alice Johnson', status: 'Pending', session: 'Session 1' },
    { id: '2', name: 'Bob Smith', status: 'Absent', session: 'Session 1' },
    { id: '3', name: 'Carol Davis', status: 'Present', session: 'Session 1' },
    { id: '4', name: 'David Lee', status: 'Pending', session: 'Session 2' },
    { id: '5', name: 'Eva White', status: 'Present', session: 'Session 2' },
    { id: '6', name: 'Frank Green', status: 'Pending', session: 'Session 2' },
    { id: '7', name: 'Grace Hall', status: 'Absent', session: 'Session 2' },
    { id: '8', name: 'Hannah Knight', status: 'Present', session: 'Session 2' },
    { id: '9', name: 'Ivy Lewis', status: 'Pending', session: 'Session 1' },
    { id: '10', name: 'Jack Morgan', status: 'Present', session: 'Session 1' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceReportData, setAttendanceReportData] = useState([0, 0]);
  const [modalVisible, setModalVisible] = useState(false);

  const updateAttendanceReportData = () => {
    const session1PresentCount = attendees.filter(attendee => attendee.session === 'Session 1' && attendee.status === 'Present').length;
    const session2PresentCount = attendees.filter(attendee => attendee.session === 'Session 2' && attendee.status === 'Present').length;
    setAttendanceReportData([session1PresentCount, session2PresentCount]);
  };

  const handleCheckIn = (id) => {
    const updatedAttendees = attendees.map(attendee =>
      attendee.id === id ? { ...attendee, status: 'Present' } : attendee
    );
    setAttendees(updatedAttendees);
    updateAttendanceReportData();
  };

  const handleManualCheckIn = (id) => {
    const updatedAttendees = attendees.map(attendee =>
      attendee.id === id ? { ...attendee, status: 'Present' } : attendee
    );
    setAttendees(updatedAttendees);
    updateAttendanceReportData();
    Alert.alert('Checked-in', 'Attendee manually marked as Present');
  };

  const handleQRScan = () => {
    Alert.alert('QR Scan', 'QR Code Scan Triggered');
  };

  const handleExportReport = () => {
    Alert.alert('Export Report', 'Attendance Report Exported');
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleSessionCheckIn = (session) => {
    const updatedAttendees = attendees.map(attendee =>
      attendee.session === session ? { ...attendee, status: 'Present' } : attendee
    );
    setAttendees(updatedAttendees);
    updateAttendanceReportData();
    Alert.alert('Session Check-in', `All attendees for ${session} are marked as Present`);
  };

  const handleMarkAll = (status) => {
    const updatedAttendees = attendees.map(attendee => ({ ...attendee, status }));
    setAttendees(updatedAttendees);
    updateAttendanceReportData();
    Alert.alert('Bulk Action', `All attendees marked as ${status}`);
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAttendee = ({ item }) => (
    <View style={styles.attendeeItem}>
      <Text style={styles.attendeeName}>{item.name}</Text>
      <Text style={styles.attendeeDetails}>Session: {item.session}</Text>
      <Text style={styles.attendeeDetails}>Status: {item.status}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleCheckIn(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleManualCheckIn(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Manual Check-in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Attendance Tracking</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Attendees"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {/* QR Code Scanning Section */}
      <TouchableOpacity onPress={handleQRScan} style={styles.qrButton}>
        <Ionicons name="scan" size={24} color="#fff" />
        <Text style={styles.qrButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {/* Mark All as Present or Absent */}
      <View style={styles.bulkActions}>
        <TouchableOpacity onPress={() => handleMarkAll('Present')} style={styles.button}>
          <Text style={styles.buttonText}>Mark All as Present</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMarkAll('Absent')} style={styles.button}>
          <Text style={styles.buttonText}>Mark All as Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Filtered Attendees */}
      <FlatList
        data={filteredAttendees}
        renderItem={renderAttendee}
        keyExtractor={item => item.id}
      />

      {/* Attendance Reports */}
      <View style={styles.attendanceReports}>
        <Text style={styles.reportTitle}>Attendance Report</Text>
        <BarChart
          data={{
            labels: ['Session 1', 'Session 2'],
            datasets: [{
              data: attendanceReportData,
            }],
          }}
          width={300} // Adjust width for mobile
          height={200} // Adjust height for mobile
          fromZero={true}
          yAxisLabel="%"
          chartConfig={{
            backgroundColor: '#1e1e1e',
            backgroundGradientFrom: '#1e1e1e',
            backgroundGradientTo: '#1e1e1e',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{ marginVertical: 8 }}
        />
        <TouchableOpacity onPress={handleExportReport} style={styles.button}>
          <Text style={styles.buttonText}>Export Report</Text>
        </TouchableOpacity>
      </View>

      {/* Session Check-ins */}
      <View style={styles.sessionCheckInSection}>
        <Text style={styles.sessionTitle}>Session Check-ins</Text>
        <TouchableOpacity onPress={() => handleSessionCheckIn('Session 1')} style={styles.button}>
          <Text style={styles.buttonText}>Check-in for Session 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSessionCheckIn('Session 2')} style={styles.button}>
          <Text style={styles.buttonText}>Check-in for Session 2</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>Attendees marked as Present: {attendanceReportData[0]}</Text>
        <Text style={styles.activityText}>Attendees marked as Absent: {attendees.length - attendanceReportData[0]}</Text>
      </View>

      {/* Feedback */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.activityText}>Please provide your feedback on the session.</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Enter feedback here"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Modal for attendance details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Attendance Details</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    color: '#fff',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginVertical: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  attendeeItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  attendeeName: {
    fontSize: 18,
    color: '#fff',
  },
  attendeeDetails: {
    fontSize: 12,
    color: '#aaa',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  attendanceReports: {
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  sessionCheckInSection: {
    marginBottom: 15,
  },
  sessionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  recentActivity: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  activityText: {
    fontSize: 12,
    color: '#aaa',
  },
  feedbackSection: {
    marginBottom: 15,
  },
  feedbackInput: {
    height: 70,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    color: '#fff',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AttendanceTrackingcoordinator;
