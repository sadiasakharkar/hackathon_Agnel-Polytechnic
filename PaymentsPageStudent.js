import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Animated, ScrollView } from 'react-native';

// Sample Data for Events Requiring Payment
const paymentEvents = [
  { id: 1, title: "Inter-college Sports Meet", amount: 500, paymentStatus: "Unpaid", paymentMethod: "Credit Card" },
  { id: 2, title: "Workshop on AI", amount: 300, paymentStatus: "Unpaid", paymentMethod: "PayPal" },
  { id: 3, title: "Tech Conference", amount: 400, paymentStatus: "Paid", paymentMethod: "Credit Card" }
];

// Sample Data for Transaction History
const transactionHistory = [
  { id: 1, title: "Inter-college Sports Meet", amount: 500, paymentStatus: "Paid", date: "2025-01-05" },
  { id: 2, title: "Workshop on AI", amount: 300, paymentStatus: "Paid", date: "2025-01-06" }
];

const PaymentsPageStudent = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const fadeAnimTitle = useRef(new Animated.Value(0)).current;
  const fadeAnimSubtitle = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animated values for bubble movement
  const bubble1Position = useRef(new Animated.ValueXY({ x: -50, y: 0 })).current;
  const bubble2Position = useRef(new Animated.ValueXY({ x: 200, y: 0 })).current;
  const bubble3Position = useRef(new Animated.ValueXY({ x: 500, y: 0 })).current;
  const bubble4Position = useRef(new Animated.ValueXY({ x: 300, y: 0 })).current;

  useEffect(() => {
    // Fade-in animation for the title and subtitle
    Animated.sequence([ 
      Animated.timing(fadeAnimTitle, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimSubtitle, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();

    // Start continuous bubble animations
    Animated.loop(
      Animated.stagger(1500, [
        Animated.timing(bubble1Position, {
          toValue: { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble2Position, {
          toValue: { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble3Position, {
          toValue: { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble4Position, {
          toValue: { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePayment = (event) => {
    // Payment logic (can integrate Razorpay here)
    alert(`Initiating payment for ${event.title}`);
  };

  const renderPaymentEvent = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardAmount}>Amount: ₹{item.amount}</Text>
        <Text style={styles.cardStatus}>Payment Status: {item.paymentStatus}</Text>
        <Text style={styles.paymentMethod}>Payment Method: {item.paymentMethod}</Text>
        {item.paymentStatus === "Unpaid" && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.payNowButton}
              onPress={() => handlePayment(item)}
              onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, friction: 4, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
            >
              <Text style={styles.payNowButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderTransactionHistory = ({ item }) => {
    return (
      <View style={styles.transactionCard}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>Date: {item.date}</Text>
        <Text style={styles.transactionAmount}>Amount: ₹{item.amount}</Text>
        <Text style={styles.transactionStatus}>Status: {item.paymentStatus}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Moving Bubbles */}
      <Animated.View
        style={[styles.bubble1, { transform: [{ translateX: bubble1Position.x }, { translateY: bubble1Position.y }] }] }
      />
      <Animated.View
        style={[styles.bubble2, { transform: [{ translateX: bubble2Position.x }, { translateY: bubble2Position.y }] }] }
      />
      <Animated.View
        style={[styles.bubble3, { transform: [{ translateX: bubble3Position.x }, { translateY: bubble3Position.y }] }] }
      />
      <Animated.View
        style={[styles.bubble4, { transform: [{ translateX: bubble4Position.x }, { translateY: bubble4Position.y }] }] }
      />

      <View style={styles.innerContainer}>
        <Animated.Text style={[styles.title, { opacity: fadeAnimTitle }]}>
          Payment for Events
        </Animated.Text>

        <Text style={styles.subHeader}>Events Requiring Payment</Text>
        <FlatList
          data={paymentEvents.filter(event => event.paymentStatus === 'Unpaid')}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPaymentEvent}
        />

        <Text style={styles.subHeader}>Payment History</Text>
        <FlatList
          data={transactionHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionHistory}
        />

        {/* Payment Confirmation Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Payment Successful</Text>
              <Text style={styles.modalText}>Thank you for your payment. You can now submit feedback and access your certificates.</Text>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30, // Ensure enough padding for smooth scrolling
    backgroundColor: '#121212', // Dark background color
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ccc',
  },
  card: {
    backgroundColor: '#1F3558',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  payNowButton: {
    backgroundColor: '#62B1F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  payNowButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#1F3558',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  transactionDate: {
    fontSize: 14,
    color: '#bbb',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#bbb',
  },
  transactionStatus: {
    fontSize: 14,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#62B1F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentsPageStudent;
