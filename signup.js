import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Image } from 'react-native';
import { commonStyles } from './commonStyles';

export default function WelcomePage({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animated values for bubble and sparkle movement
  const bubblePositions = Array(5).fill().map(() =>
    useRef(new Animated.ValueXY({ x: Math.random() * 400 - 200, y: Math.random() * 600 - 300 })).current
  );

  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate title and tagline fade-in
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();

    // Animate bubble movements (without restart)
    bubblePositions.forEach((position) => {
      Animated.loop(
        Animated.timing(position, {
          toValue: { x: Math.random() * 400 - 200, y: Math.random() * 600 - 300 },
          duration: 5000,
          useNativeDriver: true,
        })
      ).start();
    });

    // Animate sparkles
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(sparkleOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleNext = () => navigation.navigate('RoleSelection');
  const handleLogin = () => navigation.navigate('Login');

  return (
    <View style={styles.container}>
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

      {/* Welcome Message */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Welcome to Evento!</Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Your Gateway to Amazing Events
      </Animated.Text>

      {/* Sparkles */}
      <Animated.Image
        source={{ uri: 'https://example.com/sparkle.png' }} // Replace with a local sparkle icon or URL
        style={[styles.sparkle, { opacity: sparkleOpacity }]}
      />

      {/* Interactive Buttons */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Select a role to sign up...</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>

      {/* Footer Text */}
      <Text style={styles.footerText}>Empowering communities, one event at a time.</Text>
    </View>
  );
}

const bubbleColors = ['#ADD8E6', '#87CEFA', '#4682B4', '#5F9EA0', '#00BFFF'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    color: '#1E90FF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  bubble: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.4,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginVertical: 15,
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
  loginText: {
    color: '#87CEFA',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  sparkle: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 50,
    right: 50,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
  },
});
