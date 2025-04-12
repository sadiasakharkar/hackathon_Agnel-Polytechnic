import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const CoordinatorEventResource = () => {
  const [resources, setResources] = useState([
    { id: '1', title: 'Event Schedule', category: 'Event Details', fileUri: null, type: 'document' },
    { id: '2', title: 'Speaker Bios', category: 'Documents', fileUri: null, type: 'document' },
    { id: '3', title: 'Media Gallery', category: 'Media', fileUri: null, type: 'image' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', category: '', fileUri: null, type: 'document' });
  const [accessControl, setAccessControl] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = async (resourceId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        const updatedResources = resources.map(resource =>
          resource.id === resourceId ? { ...resource, fileUri: result.uri, type: 'document' } : resource
        );
        setResources(updatedResources);
        Alert.alert('File Uploaded', 'The file has been uploaded successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error uploading the file.');
    }
  };

  const handleImageUpload = async (resourceId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const updatedResources = resources.map(resource =>
        resource.id === resourceId ? { ...resource, fileUri: result.uri, type: 'image' } : resource
      );
      setResources(updatedResources);
      Alert.alert('Image Uploaded', 'The image has been uploaded successfully.');
    }
  };

  const handleAddResource = () => {
    if (!newResource.title || !newResource.category) {
      Alert.alert('Validation Error', 'Please provide a title and category for the resource.');
      return;
    }
    const newResourceData = { ...newResource, id: String(resources.length + 1), fileUri: null };
    setResources([...resources, newResourceData]);
    setShowModal(false);
    setNewResource({ title: '', category: '', fileUri: null, type: 'document' });
  };

  const handleAccessControlChange = (resourceId, access) => {
    setAccessControl({ ...accessControl, [resourceId]: access });
  };

  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter(resource => resource.id !== resourceId);
    setResources(updatedResources);
    Alert.alert('Resource Deleted', 'The resource has been deleted.');
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.resourceCard}>
      <Text style={styles.resourceTitle}>{item.title}</Text>
      <Text style={styles.resourceCategory}>Category: {item.category}</Text>
      {item.type === 'image' ? (
        <Image source={{ uri: item.fileUri }} style={styles.resourceImage} />
      ) : item.fileUri ? (
        <TouchableOpacity style={styles.downloadButton}>
          <MaterialIcons name="download" size={24} color="white" />
          <Text style={styles.buttonText}>Download {item.title}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={() => item.type === 'image' ? handleImageUpload(item.id) : handleFileUpload(item.id)}>
          <MaterialIcons name="upload" size={24} color="white" />
          <Text style={styles.buttonText}>Upload File</Text>
        </TouchableOpacity>
      )}
      <View style={styles.accessControlContainer}>
        <Text style={styles.accessControlText}>Access:</Text>
        <TouchableOpacity
          style={[styles.accessButton, { backgroundColor: accessControl[item.id] === 'admin' ? '#4CAF50' : '#FF5722' }]}
          onPress={() => handleAccessControlChange(item.id, accessControl[item.id] === 'admin' ? 'participant' : 'admin')}
        >
          <Text style={styles.buttonText}>
            {accessControl[item.id] === 'admin' ? 'Admin Access' : 'Participant Access'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteResource(item.id)}>
        <MaterialIcons name="delete" size={24} color="white" />
        <Text style={styles.buttonText}>Delete Resource</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Resources</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Resources"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredResources}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.resourceList}
      />

      <TouchableOpacity style={styles.addResourceButton} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>+ Add New Resource</Text>
      </TouchableOpacity>

      {/* Modal for Adding New Resource */}
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Add New Resource</Text>
          <TextInput
            style={styles.input}
            placeholder="Resource Title"
            value={newResource.title}
            onChangeText={(text) => setNewResource({ ...newResource, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Event Details)"
            value={newResource.category}
            onChangeText={(text) => setNewResource({ ...newResource, category: text })}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleAddResource}>
            <Text style={styles.modalButtonText}>Add Resource</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', // Light text color
  },
  searchInput: {
    height: 45,
    borderColor: '#444', // Darker border
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#fff', // Light text color
    backgroundColor: '#333', // Dark background for input
  },
  resourceList: {
    marginBottom: 20,
  },
  resourceCard: {
    backgroundColor: '#1e1e1e', // Dark card background
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444', // Darker border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Light text color
  },
  resourceCategory: {
    fontSize: 14,
    color: '#bbb', // Light gray text
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#1f87d4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resourceImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  accessControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessControlText: {
    fontSize: 16,
    color: '#bbb', // Light gray text
    marginRight: 10,
  },
  accessButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  addResourceButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#1e1e1e', // Dark background for modal
    flex: 1,
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Light text color
  },
  input: {
    height: 45,
    borderColor: '#444', // Dark border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    color: '#fff', // Light text color
    backgroundColor: '#333', // Dark background for input
  },
  modalButton: {
    backgroundColor: '#1f87d4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CoordinatorEventResource;
