import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

// Stack Navigator Setup
const Stack = createStackNavigator();

const initialChats = [
  { id: '1', name: 'Coordinator Group 1', unreadMessages: 2, type: 'group' },
  { id: '2', name: 'Event Manager Group', unreadMessages: 1, type: 'group' },
  { id: '3', name: 'Coordinator 1', unreadMessages: 0, type: 'individual' },
  { id: '4', name: 'Event Manager', unreadMessages: 0, type: 'individual' },
  { id: '5', name: 'Coordinator Group 2', unreadMessages: 3, type: 'group' },
  { id: '6', name: 'Event Manager 2', unreadMessages: 0, type: 'individual' },
  { id: '7', name: 'Coordinator 2', unreadMessages: 1, type: 'individual' },
  { id: '8', name: 'Project Team', unreadMessages: 0, type: 'group' },
];

// Chat List Screen
function ChatListScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState(initialChats);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search chats..."
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('ChatScreen', { chatId: item.id, chatName: item.name, chatType: item.type })
            }
          >
            <Text style={styles.chatName}>
              {item.name} {item.type === 'group' ? '👥' : '💬'}
            </Text>
            {item.unreadMessages > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadMessages}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Chat Screen
function ChatScreen({ route, navigation }) {
  const { chatName, chatType } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! 👋', sender: 'Coordinator 1', type: 'text', timestamp: '12:30 PM', seen: false },
    { id: '2', text: 'How can I assist you today?', sender: 'Event Manager', type: 'text', timestamp: '12:32 PM', seen: true },
    { id: '3', text: 'Sure, let me check.', sender: 'You', type: 'text', timestamp: '12:35 PM', seen: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMsg = {
        id: String(messages.length + 1),
        text: result.assets[0].uri,
        sender: 'You',
        type: 'image',
        timestamp: new Date().toLocaleTimeString(),
        seen: false,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    }
  };

  const onSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: String(messages.length + 1),
      text: newMessage,
      sender: 'You',
      type: 'text',
      timestamp: new Date().toLocaleTimeString(),
      seen: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage('');
    setTyping(false);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'You' ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.senderName}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeaderTitle}>
          {chatName} {chatType === 'group' ? '👥' : '💬'}
        </Text>
      </View>
      {typing && <Text style={styles.typingText}>Typing...</Text>}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => {
            setNewMessage(text);
            setTyping(true);
          }}
          placeholder="Type a message..."
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Main App
export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchBar: {
    backgroundColor: '#292D3E',
    padding: 10,
    margin: 20,
    borderRadius: 10,
    color: '#fff',
  },
  chatItem: {
    padding: 20,
    backgroundColor: '#292D3E',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#FF6F61',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#292D3E',
    padding: 15,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  chatHeaderTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#34B7F1',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#444',
    alignSelf: 'flex-start',
  },
  senderName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#bbb',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#292D3E',
  },
  input: {
    flex: 1,
    backgroundColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#34B7F1',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  photoButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  typingText: {
    color: '#bbb',
    marginLeft: 20,
    fontStyle: 'italic',
  },
});