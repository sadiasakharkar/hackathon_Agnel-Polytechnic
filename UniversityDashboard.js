import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UniversityEvents from './UniversityEvents';
import { Image } from "react-native";
import UniBudgetPage from './UniBudgetPage';
import UniPermissionPage from './UniPermissionPage';
import UniReportPage from './UniReportPage';
import UniSettingPage from './UniSettingPage';
// Sidebar Menu
const SidebarMenu = ({ navigation }) => {
  return (
    <View style={styles.sidebarContainer}>
      {/* University Admin Image and Tag */}
      <Image 
        source={require('./UniversityAdminImage.png')} 
        style={styles.adminImage} 
      />
      <View style={styles.adminContainer}>
        <Text style={styles.adminTag}>University Admin</Text>
      </View>

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Dashboard")}>
        <Ionicons name="home" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UniversityEvents')}>
        <Ionicons name="calendar" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Events</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UniBudgetPage')}>
        <Ionicons name="wallet" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Budgets</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UniPermissionPage')}>
        <Ionicons name="lock-closed" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Permissions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UniReportPage')}>
        <Ionicons name="document-text" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Reports</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UniSettingPage')}>
        <Ionicons name="settings" size={24} color="#FFF" />
        <Text style={styles.menuItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

// Dashboard Overview (Main Screen)
const Dashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([
    { name: "Data Science Workshop", date: "2025-02-12", status: "Scheduled", location: "Room 101" },
    { name: "Tech Conference", date: "2025-03-10", status: "Scheduled", location: "Hall A" },
  ]);

  const stats = {
    totalEvents: 15,
    activeEvents: 5,
    completedEvents: 10,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>University Admin</Text>

      {/* Event Statistics Section */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Events</Text>
          <Text style={styles.cardContent}>{stats.totalEvents}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Events</Text>
          <Text style={styles.cardContent}>{stats.activeEvents}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Completed Events</Text>
          <Text style={styles.cardContent}>{stats.completedEvents}</Text>
        </View>
      </View>

      {/* Upcoming Events Section */}
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDetails}>Date: {item.date} | Location: {item.location}</Text>
            <Text style={styles.eventStatus}>Status: {item.status}</Text>
            <TouchableOpacity style={styles.viewButton} onPress={() => { /* Navigate to event details */ }}>
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Reports of Completed Events */}
      <Text style={styles.sectionTitle}>Reports of Completed Events</Text>
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Monthly Event Analysis</Text>
        <Text style={styles.reportDetails}>Total Completed Events: 10</Text>
        <Text style={styles.reportDetails}>Average Budget: $2000</Text>
      </View>

      {/* Notifications of Permission Requests */}
      <Text style={styles.sectionTitle}>Permission Requests</Text>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>2 New Permission Requests</Text>
      </View>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>5 Granted Permissions</Text>
      </View>
    </ScrollView>
  );
};

// Event Pages (For details, budget, etc.)
const Events = () => <View><Text>Events Screen</Text></View>;
const Budgets = () => <View><Text>Budgets Screen</Text></View>;
const Permissions = () => <View><Text>Permissions Screen</Text></View>;
const Reports = () => <View><Text>Reports Screen</Text></View>;
const Settings = () => <View><Text>Settings Screen</Text></View>;

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function UniversityDashboard() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SidebarMenu {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="UniversityEvents" component={UniversityEvents} />
      <Drawer.Screen name="Budgets" component={Budgets} />
      <Drawer.Screen name="UniBudgetPage" component={UniBudgetPage} />
      <Drawer.Screen name="Permissions" component={Permissions} />
      <Drawer.Screen name="UniPermissionPage" component={UniPermissionPage} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="UniReportPage" component={UniReportPage} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="UniSettingPage" component={UniSettingPage} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#121212",
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: "#333",
    padding: 15,
  },
  adminContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  adminImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  adminTag: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#FFF",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#FFFFFF",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    margin: 5,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    minWidth: "40%",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardContent: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FFF",
  },
  eventItem: {
    backgroundColor: "#333",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  eventDetails: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  eventStatus: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  viewButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  reportCard: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  reportDetails: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 5,
  },
  notificationCard: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
 
  },
  notificationText: {
    fontSize: 16,
    color: "#B0B0B0",
  },
});

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UniversityDashboard" component={UniversityDashboard} />
    </Stack.Navigator>
  );
}
