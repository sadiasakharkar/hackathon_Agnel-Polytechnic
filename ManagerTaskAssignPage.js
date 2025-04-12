import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Picker, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManagerTaskAssignPage = () => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Create Event Website', deadline: '2025-02-20', status: 'Pending', priority: 'High', assignedTo: 'John' },
    { id: '2', name: 'Design Event Flyer', deadline: '2025-02-25', status: 'In Progress', priority: 'Medium', assignedTo: 'Sarah' },
    { id: '3', name: 'Book Venue', deadline: '2025-03-01', status: 'Completed', priority: 'Low', assignedTo: 'Mike' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMember, setFilterMember] = useState('All');
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const teamMembers = ['John', 'Sarah', 'Mike'];

  const openModal = (task) => {
    setSelectedTask(task);
    setAssignedTo(task.assignedTo);
    setPriority(task.priority);
    setStatus(task.status);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const openNewTaskModal = () => {
    setNewTaskModal(true);
  };

  const closeNewTaskModal = () => {
    setNewTaskModal(false);
    setNewTaskName('');
    setNewTaskDeadline('');
  };

  const saveTask = () => {
    const updatedTasks = tasks.map(task =>
      task.id === selectedTask.id
        ? { ...task, assignedTo, priority, status }
        : task
    );
    setTasks(updatedTasks);
    closeModal();
    Alert.alert('Success', 'Task updated successfully');
  };

  const addNewTask = () => {
    if (newTaskName && newTaskDeadline) {
      const newTask = {
        id: `${tasks.length + 1}`,
        name: newTaskName,
        deadline: newTaskDeadline,
        status: 'Pending',
        priority: 'Medium',
        assignedTo: '',
      };
      setTasks([...tasks, newTask]);
      closeNewTaskModal();
      Alert.alert('Success', 'New task added successfully');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const deleteTask = (taskId) => {
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    setTasks(filteredTasks);
    Alert.alert('Deleted', 'Task has been deleted successfully');
  };

  const filterTasks = () => {
    return tasks.filter(task => {
      const statusMatch = filterStatus === 'All' || task.status === filterStatus;
      const memberMatch = filterMember === 'All' || task.assignedTo === filterMember;
      return statusMatch && memberMatch;
    });
  };

  const renderTask = ({ item }) => {
    const isOverdue = new Date(item.deadline) < new Date() && item.status !== 'Completed';
    return (
      <View style={[styles.taskItem, isOverdue ? styles.overdueTask : null]}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskDetails}>
          Deadline: {item.deadline} | Priority: {item.priority}
        </Text>
        <Text style={styles.taskDetails}>Assigned to: {item.assignedTo || 'Unassigned'}</Text>
        <Text style={styles.taskStatus}>Status: {item.status}</Text>
        <TouchableOpacity style={styles.button} onPress={() => openModal(item)}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Assignment</Text>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Picker
          selectedValue={filterStatus}
          style={styles.filterInput}
          onValueChange={itemValue => setFilterStatus(itemValue)}
        >
          <Picker.Item label="All Statuses" value="All" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>

        <Picker
          selectedValue={filterMember}
          style={styles.filterInput}
          onValueChange={itemValue => setFilterMember(itemValue)}
        >
          <Picker.Item label="All Team Members" value="All" />
          {teamMembers.map((member, index) => (
            <Picker.Item key={index} label={member} value={member} />
          ))}
        </Picker>
      </View>

      {/* Add New Task Button */}
      <TouchableOpacity style={styles.addTaskButton} onPress={openNewTaskModal}>
        <Text style={styles.buttonText}>+ Add New Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={filterTasks()}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />

      {/* Modal for Task Editing */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          <TextInput
            style={styles.input}
            value={assignedTo}
            onChangeText={setAssignedTo}
            placeholder="Assign to"
            placeholderTextColor="#bbb"
          />
          <Picker
            selectedValue={priority}
            style={styles.input}
            onValueChange={setPriority}
          >
            <Picker.Item label="Low Priority" value="Low" />
            <Picker.Item label="Medium Priority" value="Medium" />
            <Picker.Item label="High Priority" value="High" />
          </Picker>
          <Picker
            selectedValue={status}
            style={styles.input}
            onValueChange={setStatus}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Completed" value="Completed" />
          </Picker>

          <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal for Adding New Task */}
      <Modal visible={newTaskModal} animationType="slide" onRequestClose={closeNewTaskModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          <TextInput
            style={styles.input}
            value={newTaskName}
            onChangeText={setNewTaskName}
            placeholder="Task Name"
            placeholderTextColor="#bbb"
          />
          <TextInput
            style={styles.input}
            value={newTaskDeadline}
            onChangeText={setNewTaskDeadline}
            placeholder="Deadline (YYYY-MM-DD)"
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity style={styles.saveButton} onPress={addNewTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={closeNewTaskModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Light text color
  },
  filterSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333', // Dark background for inputs
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff', // Light text color in inputs
  },
  taskItem: {
    backgroundColor: '#1e1e1e', // Dark background for task items
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, // Stronger shadow for dark mode
    shadowRadius: 4,
  },
  overdueTask: {
    backgroundColor: '#d32f2f', // Red color for overdue tasks
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Light text color for task name
  },
  taskDetails: {
    fontSize: 14,
    marginBottom: 5,
    color: '#bbb', // Light gray text for details
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bbb', // Light gray text for status
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // Light text color for buttons
    marginLeft: 5,
  },
  addTaskButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for modal
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Light text color for modal title
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff', // Light text color for inputs
    backgroundColor: '#333', // Dark background for inputs
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ManagerTaskAssignPage.js;
