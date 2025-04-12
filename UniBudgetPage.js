import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UniBudgetPage = () => {
  const [budgetData, setBudgetData] = useState([
    {
      eventName: 'Tech Fest 2025',
      totalBudget: 50000,
      amountSpent: 30000,
      remainingBudget: 20000,
      categories: {
        venue: 20000,
        speakers: 10000,
        marketing: 5000,
        refreshments: 5000,
      },
    },
    {
      eventName: 'Cultural Night',
      totalBudget: 30000,
      amountSpent: 20000,
      remainingBudget: 10000,
      categories: {
        venue: 15000,
        entertainment: 5000,
        marketing: 3000,
        decorations: 3000,
      },
    },
  ]);

  const [completedEvents, setCompletedEvents] = useState([
    { eventName: 'Hackathon 2024', totalBudget: 40000, amountSpent: 38000 },
    { eventName: 'Art Fest 2024', totalBudget: 25000, amountSpent: 24000 },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { eventName: 'Sports Meet 2025', totalBudget: 60000, expectedExpenses: 40000, requestedFunds: 15000, grantedFunds: 0 },
    { eventName: 'Science Expo 2025', totalBudget: 50000, expectedExpenses: 30000, requestedFunds: 10000, grantedFunds: 5000 },
  ]);

  const grantFunds = (index, amount) => {
    const updatedEvents = [...upcomingEvents];
    const event = updatedEvents[index];

    if (amount <= event.requestedFunds - event.grantedFunds) {
      event.grantedFunds += amount;
    } else {
      alert('Grant amount exceeds the requested funds!');
    }

    setUpcomingEvents(updatedEvents);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Budget for Events</Text>

      {/* Current Events */}
      {budgetData.map((event, index) => (
        <View key={index} style={styles.budgetCard}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          <Text style={styles.budgetText}>
            Total Budget: ₹{event.totalBudget.toLocaleString()}
          </Text>
          <Text style={styles.budgetText}>
            Amount Spent: ₹{event.amountSpent.toLocaleString()}
          </Text>
          <Text style={styles.budgetText}>
            Remaining Budget: ₹{event.remainingBudget.toLocaleString()}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={{
                ...styles.progressBar,
                width: `${(event.amountSpent / event.totalBudget) * 100}%`,
              }}
            />
          </View>
          <View style={styles.breakdown}>
            <Text style={styles.breakdownTitle}>Budget Breakdown</Text>
            {Object.entries(event.categories).map(([category, amount], idx) => (
              <Text key={idx} style={styles.breakdownItem}>
                {category.charAt(0).toUpperCase() + category.slice(1)}: ₹{amount.toLocaleString()}
              </Text>
            ))}
          </View>
        </View>
      ))}

      {/* Completed Events */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Completed Events</Text>
        {completedEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventName}>{event.eventName}</Text>
            <Text style={styles.budgetText}>
              Total Budget: ₹{event.totalBudget.toLocaleString()}
            </Text>
            <Text style={styles.budgetText}>
              Amount Spent: ₹{event.amountSpent.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        {upcomingEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventName}>{event.eventName}</Text>
            <Text style={styles.budgetText}>
              Total Budget: ₹{event.totalBudget.toLocaleString()}
            </Text>
            <Text style={styles.budgetText}>
              Expected Expenses: ₹{event.expectedExpenses.toLocaleString()}
            </Text>
            <Text style={styles.budgetText}>
              Requested Funds: ₹{event.requestedFunds.toLocaleString()}
            </Text>
            <Text style={styles.budgetText}>
              Granted Funds: ₹{event.grantedFunds.toLocaleString()}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Grant Amount"
              placeholderTextColor="#AAA"
              onSubmitEditing={(e) => grantFunds(index, parseInt(e.nativeEvent.text))}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() =>
                alert(`Funds granted for ${event.eventName}: ₹${event.grantedFunds}`)
              }
            >
              <Text style={styles.saveButtonText}>Grant Funds</Text>
            </TouchableOpacity>
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
  budgetCard: {
    backgroundColor: '#1E1E2A',
    padding: 16,
    borderRadius: 8,
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
  budgetText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  breakdown: {
    marginTop: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  breakdownItem: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
    height: 40,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UniBudgetPage;
