import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';

const events = [
  { id: 1, name: "AI Webinar", date: "2025-02-15", type: "Webinar", status: "Scheduled", budget: "$500", organizer: "John Doe", department: "Computer Science", permissions: "Approved" },
  { id: 2, name: "Tech Workshop", date: "2025-03-01", type: "Workshop", status: "Pending", budget: "$1000", organizer: "Jane Smith", department: "Electrical Engineering", permissions: "Pending" },
  { id: 3, name: "Science Seminar", date: "2025-04-10", type: "Seminar", status: "Completed", budget: "$2000", organizer: "Michael Lee", department: "Physics", permissions: "Approved" },
];

const UniversityEvents = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState(events);

  const upcomingEvents = filteredEvents.filter(event => event.status !== "Completed");
  const completedEvents = filteredEvents.filter(event => event.status === "Completed");

  const handleFilter = () => {
    let filtered = events;
    if (selectedType !== "All") {
      filtered = filtered.filter(event => event.type === selectedType);
    }
    if (selectedStatus !== "All") {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }
    setFilteredEvents(filtered);
  };

  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDetails}>Date: {item.date}</Text>
      <Text style={styles.cardDetails}>Type: {item.type}</Text>
      <Text style={styles.cardDetails}>Status: {item.status}</Text>
      <Text style={styles.cardDetails}>Budget: {item.budget}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("ViewEvent", { eventId: item.id })}
        >
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>University Events</Text>

      {/* Filters Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Event Type:</Text>
          <Picker
            selectedValue={selectedType}
            style={styles.picker}
            onValueChange={(value) => setSelectedType(value)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Webinar" value="Webinar" />
            <Picker.Item label="Workshop" value="Workshop" />
            <Picker.Item label="Seminar" value="Seminar" />
          </Picker>
        </View>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Event Status:</Text>
          <Picker
            selectedValue={selectedStatus}
            style={styles.picker}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Scheduled" value="Scheduled" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Completed" value="Completed" />
          </Picker>
        </View>
        <TouchableOpacity style={[styles.filterButton, styles.matchPickerSize]} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        {upcomingEvents.length > 0 ? (
          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEvent}
            contentContainerStyle={styles.eventList}
          />
        ) : (
          <Text style={styles.noDataText}>No upcoming events found.</Text>
        )}
      </View>

      {/* Completed Events */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Completed Events</Text>
        {completedEvents.length > 0 ? (
          <FlatList
            data={completedEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEvent}
            contentContainerStyle={styles.eventList}
          />
        ) : (
          <Text style={styles.noDataText}>No completed events found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 8,
  },
  filterGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
  },
  filterButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  matchPickerSize: {
    height: 50,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardDetails: {
    fontSize: 14,
    color: "#ccc",
    marginVertical: 5,
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
    marginTop: 10,
  },
});

export default UniversityEvents;
