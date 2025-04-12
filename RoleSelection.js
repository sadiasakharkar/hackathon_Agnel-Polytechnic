import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar } from 'react-native';

export default function RoleSelection({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('');

  // Define animated values for multiple bubbles
  const bubble1Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const bubble2Position = useRef(new Animated.ValueXY({ x: 150, y: 100 })).current;
  const bubble3Position = useRef(new Animated.ValueXY({ x: 200, y: 200 })).current;
  const bubble4Position = useRef(new Animated.ValueXY({ x: -100, y: -50 })).current;

  useEffect(() => {
    // Start bubble animations for all bubbles
    Animated.loop(
      Animated.stagger(500, [
        Animated.sequence([
          Animated.timing(bubble1Position, {
            toValue: { x: 100, y: 150 },
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble1Position, {
            toValue: { x: 0, y: 0 },
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bubble2Position, {
            toValue: { x: -50, y: 100 },
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble2Position, {
            toValue: { x: 150, y: 100 },
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bubble3Position, {
            toValue: { x: 100, y: 300 },
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble3Position, {
            toValue: { x: 200, y: 200 },
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bubble4Position, {
            toValue: { x: 0, y: 50 },
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble4Position, {
            toValue: { x: -100, y: -50 },
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* StatusBar customization */}
      <StatusBar barStyle="light-content" backgroundColor="#333" />

      {/* Animated Bubbles */}
      <Animated.View
        style={[styles.bubble, { transform: [{ translateX: bubble1Position.x }, { translateY: bubble1Position.y }] }]}
      ></Animated.View>
      <Animated.View
        style={[styles.bubble, { transform: [{ translateX: bubble2Position.x }, { translateY: bubble2Position.y }] }]}
      ></Animated.View>
      <Animated.View
        style={[styles.bubble, { transform: [{ translateX: bubble3Position.x }, { translateY: bubble3Position.y }] }]}
      ></Animated.View>
      <Animated.View
        style={[styles.bubble, { transform: [{ translateX: bubble4Position.x }, { translateY: bubble4Position.y }] }]}
      ></Animated.View>

      <Text style={styles.title}>Select Your Role</Text>

      {/* Role Buttons */}
      <TouchableOpacity
        style={[styles.button, selectedRole === 'Coordinator' && styles.selectedButton]}
        onPress={() => {
          setSelectedRole('Coordinator');
          navigation.navigate('Coordinator');
        }}
      >
        <Text style={styles.buttonText}>Coordinator</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedRole === 'UniversityAdmin' && styles.selectedButton]}
        onPress={() => {
          setSelectedRole('UniversityAdmin');
          navigation.navigate('UniversityAdmin');
        }}
      >
        <Text style={styles.buttonText}>University Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedRole === 'Student' && styles.selectedButton]}
        onPress={() => {
          setSelectedRole('Student');
          navigation.navigate('Student');
        }}
      >
        <Text style={styles.buttonText}>Student</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedRole === 'EventManager' && styles.selectedButton]}
        onPress={() => {
          setSelectedRole('EventManager');
          navigation.navigate('EventManager');
        }}
      >
        <Text style={styles.buttonText}>Event Manager</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Full dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFF', // Light text for the title
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginBottom: 15,
    opacity: 0.9, // Slight opacity for buttons
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#333', // Darker color for selected button
  },
  bubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#62B1F6', // Light blue bubble
    position: 'absolute',
    opacity: 0.5,
  },
});