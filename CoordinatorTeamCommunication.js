import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const Button = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const CoordinatorTeamCommunication = () => {
  const [inboxMessages, setInboxMessages] = useState([
    { id: '1', from: 'John Doe', subject: 'Volunteer Meeting', content: 'Meeting tomorrow at 10 AM.', isRead: false },
    { id: '2', from: 'Jane Smith', subject: 'Speaker Confirmed', content: 'Our keynote speaker is confirmed.', isRead: false },
  ]);

  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [file, setFile] = useState(null);

  const handleSendMessage = () => {
    if (messageContent.trim() === '') {
      Alert.alert('Error', 'Please enter a message before sending.');
      return;
    }
    const newMessage = {
      id: String(outgoingMessages.length + 1),
      from: 'You',
      subject: 'New Message',
      content: messageContent,
      isRead: false,
      readBy: [],
    };
    setOutgoingMessages([...outgoingMessages, newMessage]);
    setMessageContent('');
    setModalVisible(false);
    Alert.alert('Message Sent', 'Your message has been sent successfully.');
  };

  const handleMarkAsReadInbox = (messageId) => {
    setInboxMessages(inboxMessages.map(msg =>
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
    Alert.alert('Message Marked as Read', 'The message has been marked as read.');
  };

  const handleAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (result.type === 'success') {
      setFile(result);
      Alert.alert('File Selected', `File name: ${result.name}`);
    }
  };

  const renderInboxMessage = ({ item }) => (
    <TouchableOpacity
      style={[styles.messageItem, item.isRead && styles.messageRead]}
      onPress={() => handleMarkAsReadInbox(item.id)}
    >
      <Text style={styles.messageSubject}>{item.subject}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageFrom}>From: {item.from}</Text>
      <Text style={styles.messageReadStatus}>{item.isRead ? 'Read' : 'Unread'}</Text>
    </TouchableOpacity>
  );

  const renderOutgoingMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageSubject}>{item.subject}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageFrom}>From: {item.from}</Text>
      <Text style={styles.messageReadBy}>
        Read By: {item.readBy.length > 0 ? item.readBy.join(', ') : 'Not read yet'}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Team Communication Tools</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search messages"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Inbox Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inbox</Text>
        <FlatList
          data={inboxMessages}
          renderItem={renderInboxMessage}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Outgoing Messages Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Outgoing Messages</Text>
        <FlatList
          data={outgoingMessages}
          renderItem={renderOutgoingMessage}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Compose Message Button */}
      <Button title="Compose Message" onPress={() => setModalVisible(true)} />

      {/* Modal for Compose Message */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Compose Message</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Enter your message here"
            value={messageContent}
            onChangeText={setMessageContent}
          />
          <Button title="Send Message" onPress={handleSendMessage} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
          <Button title="Attach File" onPress={handleAttachment} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1e1e1e',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#333',
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  messageItem: {
    padding: 15,
    backgroundColor: '#333',
    marginBottom: 10,
    borderRadius: 10,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageContent: {
    fontSize: 14,
    marginTop: 5,
    color: '#ccc',
  },
  messageFrom: {
    fontSize: 12,
    marginTop: 5,
    color: '#bbb',
  },
  messageReadStatus: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 5,
  },
  messageReadBy: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  textInput: {
    height: 150,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#444',
    color: '#fff',
  },
});

export default CoordinatorTeamCommunication;
