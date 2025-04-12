import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function CreateEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [registrationLimit, setRegistrationLimit] = useState('');
  const [speakers, setSpeakers] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    eventTitle: '',
    eventDate: '',
    location: '',
    description: '',
    registrationLimit: '',
    speakers: '',
  });

  const handleConfirmDate = (date) => {
    setEventDate(date);
    setCalendarVisible(false);
  };

  const handleDatePress = () => {
    setCalendarVisible(true);
  };

  const handleTimePress = () => {
    setTimePickerVisible(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventTime;
    setTimePickerVisible(false);
    setEventTime(currentDate);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate each field
    if (!eventTitle) {
      formErrors.eventTitle = 'Event Title is required';
      isValid = false;
    }

    if (!eventDate) {
      formErrors.eventDate = 'Event Date is required';
      isValid = false;
    }

    if (!location) {
      formErrors.location = 'Event Location is required';
      isValid = false;
    }

    if (!description) {
      formErrors.description = 'Event Description is required';
      isValid = false;
    }

    if (!registrationLimit) {
      formErrors.registrationLimit = 'Registration Limit is required';
      isValid = false;
    }

    if (!speakers) {
      formErrors.speakers = 'Speakers information is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Event Created with details:', {
        eventTitle,
        eventDate,
        eventTime,
        eventType,
        location,
        description,
        image,
        registrationLimit,
        speakers,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Create New Event</Text>

      {/* Event Title Input */}
      <Text style={styles.label}>Event Title</Text>
      <TextInput
        style={[styles.input, errors.eventTitle && styles.inputError]}
        placeholder="Enter Event Title"
        placeholderTextColor="#bbb"
        value={eventTitle}
        onChangeText={setEventTitle}
      />
      {errors.eventTitle && <Text style={styles.errorText}>{errors.eventTitle}</Text>}

      {/* Event Date Picker */}
      <Text style={styles.label}>Event Date</Text>
      <TouchableOpacity onPress={handleDatePress} style={[styles.datePicker, errors.eventDate && styles.inputError]}>
        <Text style={styles.input}>
          {eventDate ? eventDate : 'Select Event Date'}
        </Text>
      </TouchableOpacity>
      {errors.eventDate && <Text style={styles.errorText}>{errors.eventDate}</Text>}

      {calendarVisible && (
        <Calendar
          onDayPress={(day) => handleConfirmDate(day.dateString)}
          markedDates={{
            [eventDate]: {
              selected: true,
              selectedColor: '#2D9CDB',
              selectedTextColor: 'white',
            },
          }}
          theme={{
            backgroundColor: '#121212',
            calendarBackground: '#121212',
            selectedDayBackgroundColor: '#2D9CDB',
            selectedDayTextColor: 'white',
            todayTextColor: '#FF3B30',
            arrowColor: '#2D9CDB',
            monthTextColor: 'white',
            textSectionTitleColor: 'white',
            dayTextColor: 'white',
            dotColor: '#2D9CDB',
            selectedDotColor: 'white',
          }}
        />
      )}

      {/* Event Time Picker */}
      <Text style={styles.label}>Event Time</Text>
      <TouchableOpacity onPress={handleTimePress} style={styles.datePicker}>
        <Text style={styles.input}>
          {eventTime ? eventTime.toLocaleTimeString() : 'Select Event Time'}
        </Text>
      </TouchableOpacity>

      {timePickerVisible && (
        <DateTimePicker
          value={eventTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Event Location Input */}
      <Text style={styles.label}>Event Location</Text>
      <TextInput
        style={[styles.input, errors.location && styles.inputError]}
        placeholder="Enter Event Location"
        placeholderTextColor="#bbb"
        value={location}
        onChangeText={setLocation}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      {/* Event Description Input */}
      <Text style={styles.label}>Event Description</Text>
      <TextInput
        style={[styles.input, { height: 120 }, errors.description && styles.inputError]} // Increased height for description
        placeholder="Event Description"
        placeholderTextColor="#bbb"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      {/* Image Upload Button */}
      <Text style={styles.label}>Event Image</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
        <Text style={styles.uploadText}>
          {image ? 'Change Event Image' : 'Upload Event Image'}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      {/* Registration Limit Input */}
      <Text style={styles.label}>Registration Limit</Text>
      <TextInput
        style={[styles.input, errors.registrationLimit && styles.inputError]}
        placeholder="Registration Limit"
        placeholderTextColor="#bbb"
        keyboardType="numeric"
        value={registrationLimit}
        onChangeText={setRegistrationLimit}
      />
      {errors.registrationLimit && <Text style={styles.errorText}>{errors.registrationLimit}</Text>}

      {/* Speakers Input */}
      <Text style={styles.label}>Speakers</Text>
      <TextInput
        style={[styles.input, errors.speakers && styles.inputError]}
        placeholder="Add Speakers"
        placeholderTextColor="#bbb"
        value={speakers}
        onChangeText={setSpeakers}
      />
      {errors.speakers && <Text style={styles.errorText}>{errors.speakers}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Event</Text>
      </TouchableOpacity>

      {/* Additional Content for a Long Page */}
      <View style={styles.additionalContent}>
        <Text style={styles.additionalText}>More content goes here to extend the page...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: width * 0.05, // Added padding for better layout
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    padding: 16,
    marginBottom: 20,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30', // Red border for errors
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 10,
  },
  datePicker: {
    width: '100%',
    padding: 16,
    marginBottom: 20,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#333',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 15,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  additionalContent: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalText: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 10,
},
});
