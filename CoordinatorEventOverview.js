import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'; // Import Animatable

const CoordinatorEventOverview = () => {
  const [showResources, setShowResources] = useState(true);

  const eventDetails = {
    name: "Tech Conference 2025",
    date: "March 15, 2025",
    time: "9:00 AM - 5:00 PM",
    venue: "Convention Center, City",
    description: "A conference to discuss the latest trends in technology.",
  };

  const eventTimeline = [
    { time: "9:00 AM", task: "Event Start" },
    { time: "10:00 AM", task: "Keynote Speaker - John Doe" },
    { time: "12:00 PM", task: "Networking Break" },
    { time: "2:00 PM", task: "Workshop: AI and Machine Learning" },
    { time: "4:00 PM", task: "Closing Remarks" },
    { time: "5:00 PM", task: "After-Party" }, // Additional timeline item
  ];

  const eventResources = [
    { name: "Event Brochure", url: "https://linktobrochure.com" },
    { name: "Workshop Slides", url: "https://linktoslides.com" },
    { name: "Event Photos", url: "https://linktophotos.com" },
    { name: "Speaker Presentations", url: "https://linktospeakerpresentations.com" }, // Additional resource
    { name: "Event Video", url: "https://linktoeventvideo.com" }, // Additional resource
  ];

  const openResource = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL: ", err));
  };

  const toggleResources = () => {
    setShowResources((prev) => !prev); // Toggle the visibility of resources
  };

  const renderTimelineItem = ({ item }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={500}
      style={styles.timelineItem}
    >
      <Text style={styles.timelineTime}>{item.time}</Text>
      <Text style={styles.timelineTask}>{item.task}</Text>
    </Animatable.View>
  );

  const renderResourceLink = ({ item, index }) => (
    <Animatable.View
      animation="fadeIn"
      delay={index * 300} // Stagger animations for each resource link
      key={index}
    >
      <TouchableOpacity
        style={styles.resourceLink}
        onPress={() => openResource(item.url)}
      >
        <Ionicons name="link" size={20} color="#1976D2" />
        <Text style={styles.resourceText}>{item.name}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Event Summary */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event Overview</Text>
        <Text style={styles.headerSubtitle}>All the details at a glance</Text>
      </View>

      {/* Event Summary */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
        <Text style={styles.sectionTitle}>Event Summary</Text>
        <Text style={styles.text}>Name: {eventDetails.name}</Text>
        <Text style={styles.text}>Date: {eventDetails.date}</Text>
        <Text style={styles.text}>Time: {eventDetails.time}</Text>
        <Text style={styles.text}>Venue: {eventDetails.venue}</Text>
        <Text style={styles.text}>Description: {eventDetails.description}</Text>
      </Animatable.View>

      {/* Event Timeline */}
      <Animatable.View animation="fadeInUp" delay={500} style={styles.section}>
        <Text style={styles.sectionTitle}>Event Timeline</Text>
        <FlatList
          data={eventTimeline}
          renderItem={renderTimelineItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animatable.View>

      {/* Event Resources */}
      <View style={styles.section}>
        <TouchableOpacity onPress={toggleResources}>
          <Text style={styles.sectionTitle}>
            Event Resources ({showResources ? "Hide" : "Show"})
          </Text>
        </TouchableOpacity>
        {showResources && (
          <FlatList
            data={eventResources}
            renderItem={renderResourceLink}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>

      {/* Additional Information Section */}
      <Animatable.View animation="fadeInUp" delay={700} style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.text}>Parking: Available at the venue</Text>
        <Text style={styles.text}>Food: Catering provided during breaks</Text>
        <Text style={styles.text}>Dress Code: Casual business attire</Text>
        <Text style={styles.text}>Contact: support@techconference.com</Text>
      </Animatable.View>

      {/* Sponsors Section */}
      <Animatable.View animation="fadeInUp" delay={900} style={styles.section}>
        <Text style={styles.sectionTitle}>Our Sponsors</Text>
        <Text style={styles.text}>TechCorp - Platinum Sponsor</Text>
        <Text style={styles.text}>AI Solutions - Gold Sponsor</Text>
        <Text style={styles.text}>Cloud Innovators - Silver Sponsor</Text>
      </Animatable.View>

      {/* Testimonials Section */}
      <Animatable.View animation="fadeInUp" delay={1100} style={styles.section}>
        <Text style={styles.sectionTitle}>What Attendees Are Saying</Text>
        <Text style={styles.text}>"This was the best tech conference I've attended!" - Sarah Lee</Text>
        <Text style={styles.text}>"Great networking opportunities and amazing workshops." - James Smith</Text>
        <Text style={styles.text}>"Highly recommend for anyone interested in tech trends." - Mary Johnson</Text>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    padding: 20,
  },
  header: {
    backgroundColor: "#1E1E1E", // Darker header background
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#B0B0B0", // Lighter text color
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E", // Dark background for sections
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333", // Dark border color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // White text for titles
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#B0B0B0", // Lighter text for content
    marginBottom: 5,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timelineTime: {
    fontSize: 16,
    color: "#888", // Lighter time text
    width: 80,
  },
  timelineTask: {
    fontSize: 16,
    color: "#fff", // White task text
  },
  resourceLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333", // Dark background for links
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  resourceText: {
    fontSize: 16,
    color: "#1976D2", // Blue color for resource links
    marginLeft: 10,
  },
});

export default CoordinatorEventOverview;