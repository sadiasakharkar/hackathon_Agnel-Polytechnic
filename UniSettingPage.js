import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';

const UniSettingPage = () => {
  const [eventCategories, setEventCategories] = useState([
    'Webinar',
    'Conference',
    'Workshop',
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [notifications, setNotifications] = useState({
    reminders: true,
    budgetAlerts: true,
    permissionRequests: false,
  });

  const [userRoles, setUserRoles] = useState({
    admin: true,
    coordinator: true,
    organizer: true,
  });

  const addCategory = () => {
    if (newCategory.trim()) {
      setEventCategories([...eventCategories, newCategory]);
      setNewCategory('');
    } else {
      alert('Category name cannot be empty!');
    }
  };

  const removeCategory = (index) => {
    const updatedCategories = [...eventCategories];
    updatedCategories.splice(index, 1);
    setEventCategories(updatedCategories);
  };

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleUserRole = (role) => {
    setUserRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      {/* System Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>System Settings</Text>

        {/* Event Categories */}
        <View style={styles.subSection}>
          <Text style={styles.subSectionHeader}>Event Categories</Text>
          {eventCategories.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <Text style={styles.categoryText}>{category}</Text>
              <TouchableOpacity
                onPress={() => removeCategory(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.addCategoryRow}>
            <TextInput
              style={styles.input}
              placeholder="Add Category"
              placeholderTextColor="#AAA"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCategory}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Roles */}
        <View style={styles.subSection}>
          <Text style={styles.subSectionHeader}>User Roles</Text>
          {Object.keys(userRoles).map((role) => (
            <View key={role} style={styles.roleRow}>
              <Text style={styles.roleText}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
              <Switch
                value={userRoles[role]}
                onValueChange={() => toggleUserRole(role)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Notifications Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Notifications Settings</Text>
        {Object.keys(notifications).map((type) => (
          <View key={type} style={styles.notificationRow}>
            <Text style={styles.notificationText}>
              {type
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
            </Text>
            <Switch
              value={notifications[type]}
              onValueChange={() => toggleNotification(type)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionHeader: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleText: {
    color: '#FFF',
    fontSize: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default UniSettingPage;
