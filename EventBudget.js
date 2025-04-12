import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

const EventBudget = () => {
  const [budgetItems, setBudgetItems] = useState([
    { id: '1', name: 'Venue', amount: 5000, category: 'Venue', notes: '' },
    { id: '2', name: 'Catering', amount: 3000, category: 'Catering', notes: '' },
    { id: '3', name: 'Decorations', amount: 1500, category: 'Miscellaneous', notes: '' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [totalBudget, setTotalBudget] = useState(
    budgetItems.reduce((sum, item) => sum + item.amount, 0)
  );
  const [budgetLimit, setBudgetLimit] = useState(10000);
  const [searchText, setSearchText] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemAmount.trim() || !newItemCategory.trim()) {
      Alert.alert('Error', 'Please provide all required fields.');
      return;
    }
    const newItem = {
      id: (budgetItems.length + 1).toString(),
      name: newItemName,
      amount: parseFloat(newItemAmount),
      category: newItemCategory,
      notes: newItemNotes,
    };
    setBudgetItems((prev) => [...prev, newItem]);
    setTotalBudget((prev) => prev + newItem.amount);
    setNewItemName('');
    setNewItemAmount('');
    setNewItemCategory('');
    setNewItemNotes('');
  };

  const filteredItems = budgetItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBudgetItem = ({ item }) => (
    <View style={styles.budgetCard}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>Category: {item.category}</Text>
        <Text style={styles.itemAmount}>${item.amount}</Text>
        <Text style={styles.itemNotes}>Notes: {item.notes || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Budget Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Search Items 🔍"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetItem}
      />

      <View style={styles.totalBudgetContainer}>
        <Text style={styles.totalBudgetText}>💰 Total Budget: ${totalBudget}</Text>
        {totalBudget > budgetLimit && (
          <Text style={styles.warningText}>⚠️ Over Budget Limit!</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name 🖊️"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount 💵"
          keyboardType="numeric"
          value={newItemAmount}
          onChangeText={setNewItemAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Category 📂"
          value={newItemCategory}
          onChangeText={setNewItemCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Notes 📝"
          value={newItemNotes}
          onChangeText={setNewItemNotes}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.buttonText}>➕ Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1c1c1c', // Dark background
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff', // White text
  },
  budgetCard: {
    padding: 16,
    backgroundColor: '#2e2e2e', // Dark card background
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  itemDetails: {
    flexDirection: 'column',
  },
  itemName: {
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  itemCategory: {
    color: '#bbb', // Lighter gray text
    marginTop: 4,
  },
  itemAmount: {
    color: '#bbb', // Lighter gray text
    marginTop: 4,
  },
  itemNotes: {
    color: '#777', // Darker gray text
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderColor: '#555', // Dark border
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#333', // Dark input background
    color: '#fff', // White text
  },
  addButton: {
    backgroundColor: '#2196f3', // Blue button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text
    fontWeight: 'bold',
  },
  totalBudgetContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#2e2e2e', // Dark background for total budget
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  totalBudgetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  warningText: {
    color: '#f44336', // Red warning text
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default EventBudget;
