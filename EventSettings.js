import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventSettings = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [eventNotificationsEnabled, setEventNotificationsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // For Theme Customization Modal

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = (value) => {
    setEventNotificationsEnabled(value);
  };

  const openThemeModal = () => {
    setIsModalVisible(true);
  };

  const closeThemeModal = () => {
    setIsModalVisible(false);
  };

  const styles = createStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Event Settings</Text>

      {/* Event Management Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Management</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('CreateEvent')}>
          <Ionicons name="add-circle" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ManageEvents')}>
          <Ionicons name="cog" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Manage Events</Text>
        </TouchableOpacity>
      </View>

      {/* Event Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Notifications</Text>
        <View style={styles.option}>
          <Ionicons name="notifications" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Event Notifications</Text>
          <Switch
            value={eventNotificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>

      {/* Event Visibility Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Visibility</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EventVisibility')}>
          <Ionicons name="eye" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Manage Event Visibility</Text>
        </TouchableOpacity>
      </View>

      {/* Event Reminders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Reminders</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EventReminders')}>
          <Ionicons name="alarm" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Set Event Reminders</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Customization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.option}>
          <Ionicons name="moon" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
          />
        </View>
        <TouchableOpacity style={styles.option} onPress={openThemeModal}>
          <Ionicons name="color-palette" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Theme Customization</Text>
        </TouchableOpacity>
      </View>

      {/* Event Calendar Sync */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calendar Sync</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SyncCalendar')}>
          <Ionicons name="calendar" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Sync with Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Support and Feedback */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('HelpCenter')}>
          <Ionicons name="help-circle" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Feedback')}>
          <Ionicons name="chatbubble-ellipses" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Event Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Actions</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('DeleteEvent')}>
          <Ionicons name="trash" size={24} color="#FF5722" />
          <Text style={styles.optionText}>Delete Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Logout')}>
          <Ionicons name="log-out" size={24} color="#FF5722" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Customization Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeThemeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Theme Color</Text>
            <View style={styles.colorOptions}>
              <TouchableOpacity style={styles.colorOption} onPress={() => {/* Implement Color Change Logic */}}>
                <View style={[styles.colorCircle, { backgroundColor: '#FF5722' }]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.colorOption} onPress={() => {/* Implement Color Change Logic */}}>
                <View style={[styles.colorCircle, { backgroundColor: '#4CAF50' }]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.colorOption} onPress={() => {/* Implement Color Change Logic */}}>
                <View style={[styles.colorCircle, { backgroundColor: '#2196F3' }]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={closeThemeModal}>
              <Text style={styles.modalButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#FFF',
      padding: 16,
    },
    headerText: {
      fontSize: 28,
      color: isDarkMode ? '#FFF' : '#000',
      fontWeight: 'bold',
      marginBottom: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      color: isDarkMode ? '#4CAF50' : '#000',
      marginBottom: 8,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#2C2C2C' : '#E0E0E0',
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#FFF' : '#000',
      marginLeft: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 16,
      textAlign: 'center',
    },
    colorOptions: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 16,
    },
    colorOption: {
      padding: 10,
    },
    colorCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    modalButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 16,
    },
  });

export default EventSettings;
