import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Button,
  Animated,
} from 'react-native';

const EventPermissions = () => {
  const accessLevels = {
    'Full Access': [
      'Create and manage event schedules',
      'Assign roles to volunteers/attendees',
      'Edit and update event details',
      'Manage permissions for users',
      'Approve registrations',
      'View all event data (attendees, registration status, etc.)',
    ],
    'Limited Access': [
      'View event schedules and some resources',
      'Submit attendance for themselves or their group',
      'Manage their own registration details',
    ],
    'View Only': [
      'View event schedule and public resources',
    ],
  };

  const [permissions, setPermissions] = useState([
    { id: '1', role: 'Coordinator', access: 'Full Access' },
    { id: '2', role: 'Volunteer', access: 'Limited Access' },
    { id: '3', role: 'Attendee', access: 'View Only' },
    { id: '4', role: 'Speaker', access: 'Limited Access' },
    { id: '5', role: 'Sponsor', access: 'View Only' },
    { id: '6', role: 'Event Manager', access: 'Full Access' },
    { id: '7', role: 'Organizer', access: 'Full Access' },
    { id: '8', role: 'Panelist', access: 'Limited Access' },
    { id: '9', role: 'Vendor', access: 'View Only' },
    { id: '10', role: 'Attendee VIP', access: 'View Only' },
    // Add more permissions here to make the page longer
  ]);
  
  const [newRole, setNewRole] = useState('');
  const [newAccess, setNewAccess] = useState('');
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAddPermission = () => {
    if (!newRole.trim() || !newAccess.trim()) {
      Alert.alert('Error', 'Please provide both role and access level.');
      return;
    }
    const newPermission = {
      id: (permissions.length + 1).toString(),
      role: newRole,
      access: newAccess,
    };
    setPermissions((prev) => [...prev, newPermission]);
    setNewRole('');
    setNewAccess('');
  };

  const handleEditPermission = (id) => {
    const permissionToEdit = permissions.find((item) => item.id === id);
    setNewRole(permissionToEdit.role);
    setNewAccess(permissionToEdit.access);
    setPermissions(permissions.filter((item) => item.id !== id));
  };

  const handleDeletePermission = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this permission?',
      [
        { text: 'Cancel' },
        { text: 'Yes', onPress: () => setPermissions(permissions.filter((item) => item.id !== id)) },
      ]
    );
  };

  const filteredPermissions = permissions.filter((permission) =>
    permission.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAccessColor = (accessLevel) => {
    switch (accessLevel) {
      case 'Full Access':
        return '#388E3C'; // Green for Full Access
      case 'Limited Access':
        return '#FFA000'; // Orange for Limited Access
      case 'View Only':
        return '#1976D2'; // Blue for View Only
      default:
        return '#757575'; // Default gray
    }
  };

  const renderPermissionItem = ({ item }) => (
    <Animated.View style={[styles.permissionCard, { borderColor: getAccessColor(item.access) }]}>
      <Text style={styles.roleText}>Role: {item.role}</Text>
      <Text style={styles.accessText}>Access: {item.access}</Text>
      <Text style={styles.accessText}>
        Responsibilities: {accessLevels[item.access].join(', ')}
      </Text>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#757575' }]} // Gray for Edit button
          onPress={() => handleEditPermission(item.id)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#757575' }]} // Gray for Delete button
          onPress={() => handleDeletePermission(item.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#757575' }]} // Gray for Details button
          onPress={() => {
            setSelectedRole(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.actionText}>Details</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRole(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Permissions Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Search Roles"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredPermissions}
        keyExtractor={(item) => item.id}
        renderItem={renderPermissionItem}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Role 🖊️"
          value={newRole}
          onChangeText={setNewRole}
        />
        <TextInput
          style={styles.input}
          placeholder="Access Level 🔐"
          value={newAccess}
          onChangeText={setNewAccess}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPermission}>
          <Text style={styles.buttonText}>➕ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          App Version: 1.0.0 | Powered by Eventify
        </Text>
      </View>

      {/* Modal for Role Details */}
      {selectedRole && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>{selectedRole.role} - {selectedRole.access}</Text>
              <Text style={styles.modalText}>Responsibilities:</Text>
              {accessLevels[selectedRole.access].map((responsibility, index) => (
                <Text key={index} style={styles.modalText}>- {responsibility}</Text>
              ))}
              <Button title="Close" onPress={closeModal} color="#757575" />
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
    padding: 16,
    backgroundColor: '#181818',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#E0E0E0',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  permissionCard: {
    padding: 16,
    backgroundColor: '#222222',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#6A6A6A',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D3D3D3',
  },
  accessText: {
    color: '#A9A9A9',
    marginTop: 4,
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#757575',
  },
  actionText: {
    color: '#E0E0E0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 16,
    borderRadius: 10,
  },
  input: {
    borderColor: '#444444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#333333',
    color: '#E0E0E0',
    fontSize: 16,
    marginHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#757575',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#E0E0E0',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#222222',
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#222222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  modalText: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 8,
  },
});

export default EventPermissions;
