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
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const EventReport = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      name: 'College Annual Fest',
      date: '2025-03-25',
      attendees: 150,
      tasksCompleted: 80,
      priority: 'High',
      media: ['url1', 'url2'],
      location: 'Main Campus Hall',
      eventType: 'Cultural',
      status: 'Completed',
      feedbackSummary: 'The event was a success, with high engagement from students and staff.',
    },
    {
      id: '2',
      name: 'Inter-college Sports Meet',
      date: '2025-02-20',
      attendees: 300,
      tasksCompleted: 60,
      priority: 'Medium',
      media: ['url3', 'url4'],
      location: 'Sports Complex',
      eventType: 'Sports',
      status: 'Ongoing',
      feedbackSummary: 'The event is progressing well, with some minor delays in sports events.',
    },
    {
      id: '3',
      name: 'Tech Fest 2025',
      date: '2025-04-10',
      attendees: 500,
      tasksCompleted: 90,
      priority: 'High',
      media: ['url5', 'url6'],
      location: 'Auditorium',
      eventType: 'Tech Conference',
      status: 'Planned',
      feedbackSummary: 'Awaiting final confirmation of speakers, but everything is on track.',
    },
    {
      id: '4',
      name: 'Art & Culture Exhibition',
      date: '2025-05-15',
      attendees: 100,
      tasksCompleted: 50,
      priority: 'Low',
      media: ['url7', 'url8'],
      location: 'Art Gallery',
      eventType: 'Exhibition',
      status: 'Upcoming',
      feedbackSummary: 'Initial planning is in progress, awaiting artists\' confirmations.',
    },
    {
      id: '5',
      name: 'Hackathon 2025',
      date: '2025-06-18',
      attendees: 200,
      tasksCompleted: 75,
      priority: 'High',
      media: ['url9', 'url10'],
      location: 'Innovation Center',
      eventType: 'Hackathon',
      status: 'Scheduled',
      feedbackSummary: 'Teams have registered and are preparing for the event.',
    },
    {
      id: '6',
      name: 'Music Concert',
      date: '2025-07-22',
      attendees: 600,
      tasksCompleted: 40,
      priority: 'Medium',
      media: ['url11', 'url12'],
      location: 'Open Air Stadium',
      eventType: 'Music',
      status: 'Planned',
      feedbackSummary: 'Artists confirmed, but the stage setup is still pending.',
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const renderEventCard = ({ item }) => (
    <View
      style={[styles.eventCard, item.priority === 'High' ? styles.highPriority : styles.mediumPriority]}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>Date: {item.date}</Text>
      <Text style={styles.attendees}>Attendees: {item.attendees}</Text>
      <Text style={styles.progress}>Tasks Completed: {item.tasksCompleted}%</Text>
      <Text style={styles.location}>Location: {item.location}</Text>
      <Text style={styles.eventType}>Type: {item.eventType}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={[
            {
              name: 'Completed',
              population: item.tasksCompleted,
              color: '#4caf50',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Remaining',
              population: 100 - item.tasksCompleted,
              color: 'gray',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ]}
          width={120}
          height={120}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      <TouchableOpacity onPress={() => openEventDetails(item)} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Event Report Manager</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Events 🔍"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
      />

      {selectedEvent && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={selectedEvent !== null}
          onRequestClose={closeEventDetails}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
              <Text style={styles.modalText}>Date: {selectedEvent.date}</Text>
              <Text style={styles.modalText}>Attendees: {selectedEvent.attendees}</Text>
              <Text style={styles.modalText}>Location: {selectedEvent.location}</Text>
              <Text style={styles.modalText}>Event Type: {selectedEvent.eventType}</Text>
              <Text style={styles.modalText}>Status: {selectedEvent.status}</Text>
              <Text style={styles.modalText}>Tasks Completed: {selectedEvent.tasksCompleted}%</Text>
              <Text style={styles.modalText}>Feedback: {selectedEvent.feedbackSummary}</Text>
              <Button title="Close" onPress={closeEventDetails} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2f2f2f', // Dark background color
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4caf50',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#3a3a3a', // Dark input background
    fontSize: 16,
    color: '#fff', // White text for dark theme
  },
  eventCard: {
    padding: 20,
    backgroundColor: '#3a3a3a', // Dark card background
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  attendees: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  highPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#ff0000',
  },
  mediumPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#ffcc00',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  modalText: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 8,
  },
});

export default EventReport;
