import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions, ScrollView, Animated } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Sample Data for Registrants
const sampleRegistrants = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Confirmed', registrationTime: '2025-01-05 10:30 AM', event: 'AI Workshop' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Pending', registrationTime: '2025-01-06 12:00 PM', event: 'Inter-college Sports Meet' },
  { id: 3, name: 'Mark Lee', email: 'mark.lee@example.com', status: 'Confirmed', registrationTime: '2025-01-07 02:00 PM', event: 'AI Workshop' },
  { id: 4, name: 'Emma Davis', email: 'emma.davis@example.com', status: 'Pending', registrationTime: '2025-01-08 03:00 PM', event: 'Inter-college Sports Meet' },
  { id: 5, name: 'Anna Brown', email: 'anna.brown@example.com', status: 'Confirmed', registrationTime: '2025-01-09 09:30 AM', event: 'AI Workshop' },
  { id: 6, name: 'Leo King', email: 'leo.king@example.com', status: 'Pending', registrationTime: '2025-01-10 01:00 PM', event: 'Inter-college Sports Meet' },
  { id: 7, name: 'Sophia Taylor', email: 'sophia.taylor@example.com', status: 'Confirmed', registrationTime: '2025-01-05 05:30 PM', event: 'AI Workshop' },
  { id: 8, name: 'Ethan Walker', email: 'ethan.walker@example.com', status: 'Pending', registrationTime: '2025-01-12 10:15 AM', event: 'Inter-college Sports Meet' },
];

const Registration = () => {
  const [registrants, setRegistrants] = useState(sampleRegistrants);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in effect

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleFilterChange = () => {
    let filteredData = sampleRegistrants;

    if (filterStatus) {
      filteredData = filteredData.filter((registrant) => registrant.status === filterStatus);
    }
    if (filterEvent) {
      filteredData = filteredData.filter((registrant) => registrant.event === filterEvent);
    }
    if (filterDate) {
      filteredData = filteredData.filter((registrant) => registrant.registrationTime.includes(filterDate));
    }
    if (searchQuery) {
      filteredData = filteredData.filter((registrant) => registrant.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setRegistrants(filteredData);
  };

  const confirmRegistrant = (id) => {
    const updatedRegistrants = registrants.map((registrant) => {
      if (registrant.id === id) {
        registrant.status = 'Confirmed';
      }
      return registrant;
    });
    setRegistrants(updatedRegistrants);
    setModalVisible(false);
  };

  const rejectRegistrant = (id) => {
    const updatedRegistrants = registrants.filter((registrant) => registrant.id !== id);
    setRegistrants(updatedRegistrants);
    setModalVisible(false);
  };

  const openModal = (registrant) => {
    setSelectedRegistrant(registrant);
    setModalVisible(true);
  };

  useEffect(() => {
    // Trigger fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <Text style={styles.cardText}>Status: {item.status}</Text>
      <Text style={styles.cardText}>Time: {item.registrationTime}</Text>
      <Text style={styles.cardText}>Event: {item.event}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => openModal(item)}>
        <Text style={styles.actionButtonText}>Actions</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Online Registrations</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Filters</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Status (Confirmed/Pending)"
          value={filterStatus}
          onChangeText={setFilterStatus}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Event"
          value={filterEvent}
          onChangeText={setFilterEvent}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Date"
          value={filterDate}
          onChangeText={setFilterDate}
        />
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterChange}>
          <Text style={styles.filterButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Card List */}
      <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={registrants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </Animated.View>

      {/* Registration Action Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm or Reject Registration</Text>
            <Text style={styles.modalText}>
              Name: {selectedRegistrant?.name} {'\n'}
              Email: {selectedRegistrant?.email} {'\n'}
              Event: {selectedRegistrant?.event}
            </Text>

            {/* Custom Buttons for Confirm and Reject */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={() => confirmRegistrant(selectedRegistrant?.id)}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => rejectRegistrant(selectedRegistrant?.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>For any inquiries, contact us at support@example.com</Text>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 26,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  filterInput: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  cardContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: width * 0.85,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#28a745', // Green for confirm
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc3545', // Red for reject
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  footerText: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default Registration;
