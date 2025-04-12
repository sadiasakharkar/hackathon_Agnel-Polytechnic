import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Picker, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CooridinatorRegistrationsPage = () => {
  const [registrants, setRegistrants] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Pending', event: 'Tech Conference', registrationDate: '2025-01-10' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'Confirmed', event: 'Tech Conference', registrationDate: '2025-01-11' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', status: 'Pending', event: 'Health Summit', registrationDate: '2025-01-09' },
    { id: '4', name: 'David Lee', email: 'david@example.com', status: 'Pending', event: 'AI Summit', registrationDate: '2025-01-12' },
    { id: '5', name: 'Eva White', email: 'eva@example.com', status: 'Confirmed', event: 'Tech Conference', registrationDate: '2025-01-13' },
    { id: '6', name: 'Frank Miller', email: 'frank@example.com', status: 'Pending', event: 'Health Summit', registrationDate: '2025-01-14' },
    { id: '7', name: 'Grace Lee', email: 'grace@example.com', status: 'Rejected', event: 'AI Summit', registrationDate: '2025-01-15' },
    { id: '8', name: 'Henry Walker', email: 'henry@example.com', status: 'Confirmed', event: 'Tech Conference', registrationDate: '2025-01-16' },
    { id: '9', name: 'Ivy Wang', email: 'ivy@example.com', status: 'Pending', event: 'Health Summit', registrationDate: '2025-01-17' },
    { id: '10', name: 'James Black', email: 'james@example.com', status: 'Confirmed', event: 'AI Summit', registrationDate: '2025-01-18' },
  ]);
  
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistrants, setSelectedRegistrants] = useState([]);
  const events = ['Tech Conference', 'Health Summit', 'AI Summit'];
  
  const handleStatusChange = (id, status) => {
    const updatedRegistrants = registrants.map(registrant =>
      registrant.id === id ? { ...registrant, status } : registrant
    );
    setRegistrants(updatedRegistrants);
  };

  const filterRegistrants = () => {
    return registrants.filter(registrant => {
      const statusMatch = filterStatus === 'All' || registrant.status === filterStatus;
      const eventMatch = filterEvent === 'All' || registrant.event === filterEvent;
      const dateMatch = filterDate === '' || registrant.registrationDate.includes(filterDate);
      const searchMatch = registrant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          registrant.email.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && eventMatch && dateMatch && searchMatch;
    });
  };

  const handleBulkAction = (action) => {
    const updatedRegistrants = registrants.map(registrant => {
      if (selectedRegistrants.includes(registrant.id)) {
        if (action === 'approve') {
          return { ...registrant, status: 'Confirmed' };
        }
        if (action === 'reject') {
          return { ...registrant, status: 'Rejected' };
        }
      }
      return registrant;
    });
    setRegistrants(updatedRegistrants);
    setSelectedRegistrants([]);
    Alert.alert('Success', `Selected registrants have been ${action}d.`);
  };

  const handleExport = (format) => {
    Alert.alert('Export', `Data has been exported as ${format}.`);
  };

  const toggleSelection = (id) => {
    setSelectedRegistrants(prevState => 
      prevState.includes(id) ? prevState.filter(item => item !== id) : [...prevState, id]
    );
  };

  const renderRegistrant = ({ item }) => (
    <View style={styles.registrantItem}>
      <Text style={styles.registrantName}>{item.name}</Text>
      <Text style={styles.registrantDetails}>{item.email}</Text>
      <Text style={styles.registrantDetails}>Event: {item.event}</Text>
      <Text style={styles.registrantDetails}>Registration Date: {item.registrationDate}</Text>
      <Text style={styles.registrantStatus}>Status: {item.status}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleStatusChange(item.id, item.status === 'Confirmed' ? 'Pending' : 'Confirmed')} style={styles.button}>
          <Text style={styles.buttonText}>{item.status === 'Confirmed' ? 'Mark as Pending' : 'Confirm Registration'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Rejected')} style={styles.button}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.checkbox}>
          <Ionicons name={selectedRegistrants.includes(item.id) ? 'checkbox' : 'square-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registrations</Text>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Picker
          selectedValue={filterStatus}
          style={styles.filterInput}
          onValueChange={setFilterStatus}
        >
          <Picker.Item label="All Statuses" value="All" />
          <Picker.Item label="Confirmed" value="Confirmed" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Rejected" value="Rejected" />
        </Picker>
        <Picker
          selectedValue={filterEvent}
          style={styles.filterInput}
          onValueChange={setFilterEvent}
        >
          <Picker.Item label="All Events" value="All" />
          {events.map((event, index) => (
            <Picker.Item key={index} label={event} value={event} />
          ))}
        </Picker>
        <TextInput
          style={styles.filterInput}
          placeholder="Search by name or email"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by registration date (YYYY-MM-DD)"
          value={filterDate}
          onChangeText={setFilterDate}
        />
      </View>

      {/* Bulk Actions */}
      <View style={styles.bulkActions}>
        <TouchableOpacity onPress={() => handleBulkAction('approve')} style={styles.bulkButton}>
          <Text style={styles.buttonText}>Approve Selected</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBulkAction('reject')} style={styles.bulkButton}>
          <Text style={styles.buttonText}>Reject Selected</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleExport('CSV')} style={styles.bulkButton}>
          <Text style={styles.buttonText}>Export CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleExport('PDF')} style={styles.bulkButton}>
          <Text style={styles.buttonText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Registrants List */}
      <FlatList
        data={filterRegistrants()}
        renderItem={renderRegistrant}
        keyExtractor={item => item.id}
      />

      {/* Footer with more info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total Registrants: {registrants.length}</Text>
        <Text style={styles.footerText}>For more event details, please contact support.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  filterSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    marginRight: 10,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff',
  },
  registrantItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  registrantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  registrantDetails: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5,
  },
  registrantStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bbb',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bulkActions: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  bulkButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CooridinatorRegistrationsPage;