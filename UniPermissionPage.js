import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UniPermissionPage = () => {
  const [permissionRequests, setPermissionRequests] = useState([
    {
      id: '1',
      eventName: 'Tech Conference 2025',
      eventDate: '12th Jan 2025',
      organizerName: 'John Doe',
      status: 'Pending Approval',
    },
    {
      id: '2',
      eventName: 'Art Gala',
      eventDate: '15th Jan 2025',
      organizerName: 'Jane Smith',
      status: 'Pending Approval',
    },
  ]);

  const [grantedPermissions, setGrantedPermissions] = useState([
    {
      id: '1',
      eventName: 'Science Fair',
      date: '5th Jan 2025',
      time: '10:00 AM',
      venue: 'Auditorium A',
      budget: '$2000',
    },
  ]);

  const handleApprove = (id) => {
    Alert.alert('Approved', 'Permission has been granted.');
    setPermissionRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Approved' } : req
      )
    );
  };

  const handleReject = (id) => {
    Alert.alert('Rejected', 'Permission has been rejected.');
    setPermissionRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      )
    );
  };

  const renderPermissionRequest = ({ item }) => (
    <View style={styles.permissionCard}>
      <Text style={styles.cardText}><Text style={styles.bold}>Event:</Text> {item.eventName}</Text>
      <Text style={styles.cardText}><Text style={styles.bold}>Date:</Text> {item.eventDate}</Text>
      <Text style={styles.cardText}><Text style={styles.bold}>Organizer:</Text> {item.organizerName}</Text>
      <Text style={styles.cardText}><Text style={styles.bold}>Status:</Text> {item.status}</Text>
      {item.status === 'Pending Approval' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(item.id)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => Alert.alert('Event Details', 'More event details here.')}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Notifications Card */}
      <View style={styles.notificationsCard}>
        <Text style={styles.notificationsText}>Permissions Requested: {permissionRequests.length}</Text>
        <Text style={styles.notificationsText}>Not Yet Granted: {permissionRequests.filter(req => req.status === 'Pending Approval').length}</Text>
      </View>

      {/* Permission Requests Section */}
      <Text style={styles.sectionHeader}>Permission Requests</Text>
      <FlatList
        data={permissionRequests}
        renderItem={renderPermissionRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Granted Permissions Section */}
      <Text style={styles.sectionHeader}>Granted Permissions</Text>
      {grantedPermissions.map((permission) => (
        <View key={permission.id} style={styles.permissionCard}>
          <Text style={styles.cardText}><Text style={styles.bold}>Event:</Text> {permission.eventName}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>Date:</Text> {permission.date}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>Time:</Text> {permission.time}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>Venue:</Text> {permission.venue}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>Budget:</Text> {permission.budget}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  notificationsCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  notificationsText: {
    color: '#FFF',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 20,
    color: '#4CAF50',
    marginVertical: 16,
    fontWeight: 'bold',
  },
  permissionCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default UniPermissionPage;
