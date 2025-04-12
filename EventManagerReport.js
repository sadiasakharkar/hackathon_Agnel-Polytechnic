import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { BarChart } from 'react-native-chart-kit';

const EventManagerReport= () => {
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterTask, setFilterTask] = useState('');
  const [reportData, setReportData] = useState([]);
  const [downloadedFile, setDownloadedFile] = useState(null);

  const handleGenerateReport = () => {
    const data = [
      { task: 'Task 1', completed: 30, pending: 5 },
      { task: 'Task 2', completed: 50, pending: 10 },
      { task: 'Task 3', completed: 80, pending: 20 },
    ];
    setReportData(data);
    Alert.alert('Report Generated', 'The report has been generated successfully.');
  };

  const handleDownloadReport = () => {
    const reportCSV = `Task, Completed, Pending\n${reportData.map(item => `${item.task}, ${item.completed}, ${item.pending}`).join('\n')}`;
    const fileUri = FileSystem.documentDirectory + 'event_report.csv';
    
    FileSystem.writeAsStringAsync(fileUri, reportCSV, { encoding: FileSystem.EncodingType.UTF8 })
      .then(() => {
        setDownloadedFile(fileUri);
        Alert.alert('Download Successful', 'The report has been downloaded successfully.');
      })
      .catch(error => {
        Alert.alert('Error', 'There was an error downloading the report.');
      });
  };

  const handleDownloadPDF = () => {
    Alert.alert('PDF Download', 'PDF download functionality coming soon.');
  };

  const handleShowCustomReportModal = () => {
    setShowCustomReportModal(true);
  };

  const handleCloseCustomReportModal = () => {
    setShowCustomReportModal(false);
  };

  const chartData = {
    labels: ['Task 1', 'Task 2', 'Task 3'],
    datasets: [
      {
        data: [30, 50, 80],
        color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Event Reporting Page</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Downloadable Reports</Text>
        <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDownloadReport}>
          <Text style={styles.buttonText}>Download CSV Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDownloadPDF}>
          <Text style={styles.buttonText}>Download PDF Report</Text>
        </TouchableOpacity>
        {downloadedFile && <Text style={styles.downloadMessage}>Downloaded Report: {downloadedFile}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
        <BarChart
          data={chartData}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#1e1e1e',
            backgroundGradientFrom: '#1e1e1e',
            backgroundGradientTo: '#1e1e1e',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Reports</Text>
        <TouchableOpacity style={styles.button} onPress={handleShowCustomReportModal}>
          <Text style={styles.buttonText}>Filter and Generate Custom Report</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showCustomReportModal} animationType="slide" onRequestClose={handleCloseCustomReportModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Generate Custom Report</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Date (e.g. 2025-01-11)"
            value={filterDate}
            onChangeText={setFilterDate}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Task Name (optional)"
            value={filterTask}
            onChangeText={setFilterTask}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleGenerateReport}>
            <Text style={styles.modalButtonText}>Generate Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleCloseCustomReportModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique velit lorem, sit amet sodales libero
          scelerisque ut. Curabitur id mauris quis libero tempus fermentum. Vestibulum non est lacus. Donec et pharetra
          turpis. Sed gravida, libero eget consequat viverra, libero turpis egestas odio, sit amet fermentum nunc erat ac
          lectus. Sed vitae lacus ut lorem malesuada vehicula sit amet quis felis. Suspendisse potenti. Donec accumsan leo
          libero, eget sodales metus sodales at. Nulla facilisi.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1f87d4',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadMessage: {
    color: '#00FF00',
    marginTop: 10,
    fontSize: 14,
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#333',
    flex: 1,
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#444',
    color: '#fff',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#1f87d4',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
});

export default EventManagerReport;
