import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack'; 
import CertificateGeneration from "./CertificateGeneration";
import FeedbackPageStudent from "./FeedbackPageStudent";

const certificates = [
  { id: 1, eventName: "AI Webinar", date: "2025-02-15", certificateStatus: "Available", feedbackSubmitted: true, certificateId: "AI12345" },
  { id: 2, eventName: "Tech Workshop", date: "2025-03-01", certificateStatus: "Pending", feedbackSubmitted: false, certificateId: "TW67890" },
  { id: 3, eventName: "Science Seminar", date: "2025-04-10", certificateStatus: "Available", feedbackSubmitted: true, certificateId: "SS111213" },
];

const CertificateStudent = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredCertificates, setFilteredCertificates] = useState(certificates);

  const handleFilter = () => {
    let filtered = certificates;
    if (selectedStatus !== "All") {
      filtered = filtered.filter(cert => cert.certificateStatus === selectedStatus);
    }
    setFilteredCertificates(filtered);
  };

  const renderCertificate = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.eventName}</Text>
      <Text style={styles.cardDate}>Date of Completion: {item.date}</Text>
      <Text style={styles.cardDetails}>Certificate ID: {item.certificateId}</Text>
  
      {/* Certificate Eligibility Status */}
      <View style={styles.statusContainer}>
        {item.feedbackSubmitted ? (
          <Text style={styles.availableStatus}>Certificate Available</Text>
        ) : (
          <Text style={styles.pendingStatus}>Feedback Pending</Text>
        )}
      </View>
  
      {/* Certificate Download or Feedback Link */}
      {item.feedbackSubmitted ? (
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={() => navigation.navigate("CertificateGeneration", { certificateId: item.certificateId })}
        >
          <Text style={styles.buttonText}>Download Certificate</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.feedbackButton} 
          onPress={() => navigation.navigate("FeedbackPageStudent", { eventId: item.id })}
        >
          <Text style={styles.buttonText}>Complete Feedback</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filters Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Certificate Status:</Text>
        <Picker
          selectedValue={selectedStatus}
          style={styles.picker}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Available" value="Available" />
          <Picker.Item label="Pending" value="Pending" />
        </Picker>

        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Certificates List */}
      <View style={styles.certificateContainer}>
        {filteredCertificates.length > 0 ? (
          <FlatList
            data={filteredCertificates}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCertificate}
            contentContainerStyle={styles.certificateList}
          />
        ) : (
          <Text style={styles.noDataText}>No certificates found matching your filter criteria.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const Stack = createStackNavigator();

function CertificateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add CertificateStudent as the first screen in the stack */}
      <Stack.Screen name="CertificateList" component={CertificateStudent} />
      <Stack.Screen name="CertificateGeneration" component={CertificateGeneration} />
      <Stack.Screen name="FeedbackPageStudent" component={FeedbackPageStudent} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",  // Dark Theme
  },
  filterSection: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  certificateContainer: {
    marginBottom: 20,
  },
  certificateList: {
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardDate: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: "#ccc",
    marginVertical: 5,
  },
  statusContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  availableStatus: {
    fontSize: 16,
    color: "#28a745",  // Green for available
    fontWeight: "bold",
  },
  pendingStatus: {
    fontSize: 16,
    color: "#f39c12",  // Orange for pending feedback
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "#28a745",  // Green for download
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  feedbackButton: {
    backgroundColor: "#f39c12",  // Orange for feedback
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
  },
});

export default CertificateStack;
