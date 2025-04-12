// AdminReportPage.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UniReportPage = () => {
  const [completedEvents, setCompletedEvents] = useState([
    { eventName: 'Hackathon 2024', totalBudget: 40000, amountSpent: 38000, attendees: 200 },
    { eventName: 'Art Fest 2024', totalBudget: 25000, amountSpent: 24000, attendees: 150 },
  ]);

  const [lettersReceived, setLettersReceived] = useState([
    {
      sender: 'Science Club',
      subject: 'Request for additional funds',
      date: 'Jan 5, 2025',
      description: 'Requesting additional funds of ₹10,000 for Science Expo 2025 due to increased costs.',
    },
    {
      sender: 'Cultural Committee',
      subject: 'Permission for venue allocation',
      date: 'Jan 3, 2025',
      description: 'Seeking approval for venue allocation for Cultural Night 2025 on Feb 10, 2025.',
    },
  ]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Reports and Letters</Text>

      {/* Completed Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Completed Events</Text>
        {completedEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventName}>{event.eventName}</Text>
            <Text style={styles.reportText}>Total Budget: ₹{event.totalBudget.toLocaleString()}</Text>
            <Text style={styles.reportText}>Amount Spent: ₹{event.amountSpent.toLocaleString()}</Text>
            <Text style={styles.reportText}>Attendees: {event.attendees}</Text>
          </View>
        ))}
      </View>

      {/* Letters Received Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Letters Received</Text>
        {lettersReceived.map((letter, index) => (
          <View key={index} style={styles.letterCard}>
            <Text style={styles.letterSender}>{letter.sender}</Text>
            <Text style={styles.letterSubject}>{letter.subject}</Text>
            <Text style={styles.letterDate}>Date: {letter.date}</Text>
            <Text style={styles.letterDescription}>{letter.description}</Text>
          </View>
        ))}
      </View>

      {/* Generate Report Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Generate Report</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Event Performance Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Budget Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Attendance Report</Text>
        </TouchableOpacity>
      </View>

      {/* Download Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Download Options</Text>
        <Text style={styles.downloadText}>Select Report Type</Text>
        <Text style={styles.downloadText}>Date Range: Choose a custom date range to generate the report</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download as PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Download as Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Event Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Event Summary</Text>
        <View style={styles.eventSummaryCard}>
          <Text style={styles.summaryText}>Total Attendees: 350</Text>
          <Text style={styles.summaryText}>Budget Spent: ₹62,000</Text>
          <Text style={styles.summaryText}>Upcoming Event Status: Active</Text>
        </View>
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
    textAlign:'center',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#1E1E2A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventName: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reportText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  letterCard: {
    backgroundColor: '#1E1E2A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  letterSender: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  letterSubject: {
    fontSize: 16,
    color: '#FFF',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  letterDate: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 8,
  },
  letterDescription: {
    fontSize: 14,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  downloadText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 8,
  },
  eventSummaryCard: {
    backgroundColor: '#1E1E2A',
    padding: 16,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
});

export default UniReportPage;
