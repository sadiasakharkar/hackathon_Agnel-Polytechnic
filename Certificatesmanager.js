import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ECertificatesManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [customData, setCustomData] = useState({
    name: '',
    event: '',
    date: '',
    additionalNotes: '',
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Fetch templates and participants (use API or local data)
  useEffect(() => {
    setLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setTemplates([
        { id: 1, name: 'Classic Template', image: 'https://yourdomain.com/path/to/classic-template.jpg' },
        { id: 2, name: 'Modern Template', image: 'https://yourdomain.com/path/to/modern-template.jpg' },
        // More templates here
      ]);
      setParticipants([
        { id: 1, name: 'John Doe', avatar: '' },
        { id: 2, name: 'Jane Smith', avatar: '' },
        // More participants here
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Animation for preview modal
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    Alert.alert('Template Selected', `You have selected: ${template.name}`);
  };

  const toggleRecipientSelection = (participant) => {
    if (selectedRecipients.includes(participant)) {
      setSelectedRecipients(selectedRecipients.filter((p) => p.id !== participant.id));
    } else {
      setSelectedRecipients([...selectedRecipients, participant]);
    }
  };

  const handleGenerateCertificates = () => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Please select a certificate template.');
      return;
    }
    if (selectedRecipients.length === 0) {
      Alert.alert('Error', 'Please select at least one recipient.');
      return;
    }
    if (!customData.name || !customData.event || !customData.date) {
      Alert.alert('Error', 'Please complete all customization fields.');
      return;
    }
    setPreviewVisible(true);
    fadeIn(); // Trigger fade-in animation for modal
  };

  const handleSendCertificates = () => {
    Alert.alert('Success', `Certificates sent to ${selectedRecipients.length} recipients.`);
    setPreviewVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>E-Certificates Management</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={28} color="#4caf50" />
        </TouchableOpacity>
      </View>

      {/* Search for Templates */}
      <TextInput
        style={styles.input}
        placeholder="Search Templates"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" style={styles.loader} />
      ) : (
        <>
          {/* Template Selection */}
          <Text style={styles.subHeader}>1. Select a Template</Text>
          <FlatList
            data={filteredTemplates}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.templateCard, selectedTemplate?.id === item.id && styles.selectedCard]}
                onPress={() => selectTemplate(item)}
              >
                <Image source={{ uri: item.image }} style={styles.templateImage} />
                <Text style={styles.templateName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Template Design Preview */}
          {selectedTemplate && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewHeader}>Template Design Preview:</Text>
              <Image source={{ uri: selectedTemplate.image }} style={styles.largeTemplateImage} />
            </View>
          )}

          {/* Recipient Selection */}
          <Text style={styles.subHeader}>2. Select Recipients</Text>
          <FlatList
            data={participants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.participantCard, selectedRecipients.includes(item) && styles.selectedCard]}
                onPress={() => toggleRecipientSelection(item)}
              >
                <Ionicons name="person-outline" size={24} color="#ccc" />
                <Text style={styles.participantName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyList}>No participants available.</Text>}
          />

          {/* Customize Certificate */}
          <Text style={styles.subHeader}>3. Customize Certificate</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient Name"
            placeholderTextColor="#888"
            value={customData.name}
            onChangeText={(text) => setCustomData({ ...customData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            placeholderTextColor="#888"
            value={customData.event}
            onChangeText={(text) => setCustomData({ ...customData, event: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (e.g., 2025-01-01)"
            placeholderTextColor="#888"
            value={customData.date}
            onChangeText={(text) => setCustomData({ ...customData, date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Add any additional instructions or notes"
            placeholderTextColor="#888"
            value={customData.additionalNotes}
            onChangeText={(text) => setCustomData({ ...customData, additionalNotes: text })}
          />

          {/* Generate & Send */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateCertificates}
          >
            <Text style={styles.buttonText}>Preview Certificates</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Preview Modal */}
      {previewVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={previewVisible}
          onRequestClose={() => setPreviewVisible(false)}
        >
          <Animated.View style={[styles.modal, { opacity: fadeAnim }]}>
            <View style={styles.previewCard}>
              <Text style={styles.previewHeader}>Certificate Preview</Text>
              <Text style={styles.previewText}>Template: {selectedTemplate.name}</Text>
              <Text style={styles.previewText}>Recipient: {customData.name}</Text>
              <Text style={styles.previewText}>Event: {customData.event}</Text>
              <Text style={styles.previewText}>Date: {customData.date}</Text>
              <Text style={styles.previewText}>Notes: {customData.additionalNotes}</Text>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendCertificates}
              >
                <Text style={styles.buttonText}>Send Certificates</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}

      {/* Certificate History Section */}
      <View style={styles.historySection}>
        <Text style={styles.subHeader}>4. Certificate History</Text>
        <FlatList
          data={selectedRecipients}  // Simulating history from selected recipients
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>Recipient: {item.name}</Text>
              <Text style={styles.historyText}>Certificate Sent</Text>
            </View>
          )}
        />
      </View>

    </ScrollView>
  );
};

// Styles (Updated for better design)
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#121212' },
  historySection: {
    marginTop: 30,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  historyText: { color: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  subHeader: { fontSize: 18, marginBottom: 10, color: '#ccc' },
  templateCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateImage: { width: 100, height: 100, borderRadius: 8 },
  templateName: { marginTop: 10, fontSize: 14, color: '#fff' },
  selectedCard: { borderColor: '#4caf50', backgroundColor: '#2e2e2e' },
  previewContainer: { marginTop: 20 },
  previewHeader: { fontSize: 16, color: '#fff', marginBottom: 10 },
  largeTemplateImage: { width: '100%', height: 250, borderRadius: 8 },
  participantCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantName: { marginLeft: 10, fontSize: 16, color: '#fff' },
  emptyList: { color: '#ccc', textAlign: 'center' },
  generateButton: {
    padding: 15,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { fontSize: 18, color: '#fff' },
  previewCard: {
    backgroundColor: '#2e2e2e',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewText: { color: '#fff', marginBottom: 5 },
  sendButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
});

export default ECertificatesManagement;
