import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    name: '',
    studentId: '',
    email: '',
    contactNumber: '',
    department: '',
    collegeName: '',
  });

  const bubblePositions = Array(5)
    .fill()
    .map(() =>
      useRef(new Animated.ValueXY({ x: Math.random() * 400 - 200, y: Math.random() * 600 - 300 }))
        .current
    );

  useEffect(() => {
    bubblePositions.forEach((position) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(position, {
            toValue: { x: Math.random() * 400 - 200, y: Math.random() * 600 - 300 },
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: { x: Math.random() * 400 - 200, y: Math.random() * 600 - 300 },
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handlePayment = () => {
    if (
      !formData.eventName ||
      !formData.name ||
      !formData.studentId ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.department ||
      !formData.collegeName
    ) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const options = {
      description: `Registration for ${formData.eventName}`,
      image: 'https://example.com/your-logo.png', // Replace with your logo URL
      currency: 'INR',
      key: 'rzp_test_your_api_key', // Replace with your Razorpay API key
      amount: 50000, // Amount in paise (500.00 INR)
      name: 'Event Management',
      prefill: {
        email: formData.email,
        contact: formData.contactNumber,
        name: formData.name,
      },
      theme: { color: '#1E90FF' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        Alert.alert('Payment Success', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        Alert.alert('Payment Failed', error.description);
      });
  };

  return (
    <View style={styles.background}>
      {/* Moving Bubbles */}
      {bubblePositions.map((position, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            { backgroundColor: bubbleColors[index % bubbleColors.length] },
            { transform: [{ translateX: position.x }, { translateY: position.y }] },
          ]}
        />
      ))}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eventTitle}>
          Register for "{formData.eventName || 'Your Event'}"
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          placeholderTextColor="#aaa"
          value={formData.eventName}
          onChangeText={(text) => handleInputChange('eventName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#aaa"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          placeholderTextColor="#aaa"
          value={formData.studentId}
          onChangeText={(text) => handleInputChange('studentId', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={(text) => handleInputChange('contactNumber', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Department"
          placeholderTextColor="#aaa"
          value={formData.department}
          onChangeText={(text) => handleInputChange('department', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="College Name"
          placeholderTextColor="#aaa"
          value={formData.collegeName}
          onChangeText={(text) => handleInputChange('collegeName', text)}
        />
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay and Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const bubbleColors = ['#ADD8E6', '#87CEFA', '#4682B4', '#5F9EA0', '#00BFFF'];

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#1E90FF',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  bubble: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.4,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1E90FF',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationPage;
