import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingStudent = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme mode

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const styles = createStyles(isDarkMode); // Dynamic styles based on theme

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Settings</Text>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="person" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
          <Ionicons name="lock-closed" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.option}>
          <Ionicons name="notifications" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
          />
        </View>
      </View>

      {/* App Preferences */}
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
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('LanguageSettings')}>
          <Ionicons name="globe" size={24} color={isDarkMode ? "#4CAF50" : "#121212"} />
          <Text style={styles.optionText}>Language</Text>
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

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('DeleteAccount')}>
          <Ionicons name="trash" size={24} color="#FF5722" />
          <Text style={styles.optionText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Logout')}>
          <Ionicons name="log-out" size={24} color="#FF5722" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  });

export default SettingStudent;
