import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Define Drawer Navigator
const Drawer = createDrawerNavigator();

// ProfilePageStudent Component
function ProfilePageStudentScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('./studentavtar.png')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.headerText}>Student Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <Text style={styles.cardContent}>Name: John Doe</Text>
        <Text style={styles.cardContent}>Email: john.doe@example.com</Text>
        <Text style={styles.cardContent}>Contact: +1234567890</Text>
        <Text style={styles.cardContent}>Student ID: S1234 </Text>
        <Text style={styles.cardContent}>Department: Computer Science</Text>
        <Text style={styles.cardContent}>University: DBATU </Text>
      </View>
    </ScrollView>
  );
}

// Wrapper Component for independent navigation
function ProfilePageWrapper() {
  return (
    <View style={styles.wrapper}>
      <ProfilePageStudentScreen />
    </View>
  );
}

// Drawer Navigator Setup
function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="ProfilePageStudent">
      <Drawer.Screen
        name="ProfilePageStudent"
        component={ProfilePageWrapper} // Use wrapper component here
        options={{ headerTitle: 'Profile' }}
      />
    </Drawer.Navigator>
  );
}

// App Component - The entry point
export default function App() {
  return (
    <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarContainer: {
    marginBottom: 15,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
  },
  wrapper: {
    flex: 1, 
    backgroundColor: '#f9f9f9'
  }
});
