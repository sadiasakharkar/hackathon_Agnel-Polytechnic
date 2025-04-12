import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
    Alert,
    Share,
} from "react-native";

const EventDescription = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    const events = [
        {
            id: "1",
            name: "Coding Contest",
            department: "Computer Science",
            date: "2025-01-20",
            time: "10:00 AM - 1:00 PM",
            manager: "John Doe",
            contact: "123-456-7890",
            coordinators: "Alice, Bob",
            entryFee: "₹100",
            venue: "Lab 1, Block A",
            tags: ["Coding", "Competition"],
            category: "Competition",
            website: "https://codingcontest.com",
        },
        {
            id: "2",
            name: "Art Exhibition",
            department: "Arts",
            date: "2025-01-21",
            time: "11:00 AM - 4:00 PM",
            manager: "Jane Smith",
            contact: "987-654-3210",
            coordinators: "Charlie, Diana",
            entryFee: "₹50",
            venue: "Gallery, Block B",
            tags: ["Exhibition", "Art"],
            category: "Cultural",
            website: "https://artexhibition.com",
        },
    ];

    const filteredEvents = events.filter((event) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            event.name.toLowerCase().includes(searchLower) ||
            event.department.toLowerCase().includes(searchLower) ||
            event.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        const matchesCategory = categoryFilter
            ? event.category === categoryFilter
            : true;

        return matchesSearch && matchesCategory;
    });

    const toggleBookmark = (eventId) => {
        if (bookmarkedEvents.includes(eventId)) {
            setBookmarkedEvents((prev) => prev.filter((id) => id !== eventId));
        } else {
            setBookmarkedEvents((prev) => [...prev, eventId]);
        }
    };

    const handleShare = async (event) => {
        try {
            const result = await Share.share({
                message: `Event: ${event.name}\nDepartment: ${event.department}\nDate: ${event.date}\nTime: ${event.time}\nVenue: ${event.venue}\nManager: ${event.manager}\nContact: ${event.contact}`,
            });
            if (result.action === Share.sharedAction) {
                Alert.alert("Event shared successfully!");
            }
        } catch (error) {
            Alert.alert("Failed to share event. Please try again.");
        }
    };

    const handleAddToCalendar = (event) => {
        Alert.alert(
            "Add to Calendar",
            `Event ${event.name} has been added to your calendar.`,
            [{ text: "OK" }]
        );
    };

    const handleVisitWebsite = (event) => {
        Alert.alert(
            "Visit Website",
            `You are being redirected to the website: ${event.website}`,
            [{ text: "OK" }]
        );
    };

    const categories = [...new Set(events.map((event) => event.category))];

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Events</Text>

            <TextInput
                style={styles.input}
                placeholder="Search events..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <Text style={styles.subheading}>Categories</Text>
            <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            category === categoryFilter &&
                                styles.selectedCategory,
                        ]}
                        onPress={() =>
                            setCategoryFilter(
                                categoryFilter === category ? "" : category
                            )
                        }
                    >
                        <Text style={styles.categoryText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.eventCard}>
                        <View style={styles.eventHeader}>
                            <Text style={styles.eventName}>{item.name}</Text>
                            <TouchableOpacity
                                onPress={() => toggleBookmark(item.id)}
                                style={styles.bookmarkButton}
                            >
                                <Text style={styles.bookmarkText}>
                                    {bookmarkedEvents.includes(item.id)
                                        ? "★ Bookmarked"
                                        : "☆ Bookmark"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Department:</Text>{" "}
                            {item.department}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Date:</Text> {item.date}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Time:</Text> {item.time}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Manager:</Text>{" "}
                            {item.manager}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Contact:</Text>{" "}
                            {item.contact}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Coordinators:</Text>{" "}
                            {item.coordinators}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Entry Fee:</Text>{" "}
                            {item.entryFee}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Venue:</Text>{" "}
                            {item.venue}
                        </Text>
                        <Text style={styles.eventDetails}>
                            <Text style={styles.label}>Tags:</Text>{" "}
                            {item.tags.join(", ")}
                        </Text>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                onPress={() => handleShare(item)}
                                style={styles.actionButton}
                            >
                                <Text style={styles.actionText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleAddToCalendar(item)}
                                style={styles.actionButton}
                            >
                                <Text style={styles.actionText}>
                                    Add to Calendar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleVisitWebsite(item)}
                                style={styles.actionButton}
                            >
                                <Text style={styles.actionText}>
                                    Visit Website
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
    },
    heading: {
        fontSize: 24,
        color: "#669bbc",
        fontWeight: "bold",
        marginBottom: 16,
    },
    subheading: {
        fontSize: 18,
        color: "#bde0fe",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        padding: 10,
        color: "#FFF",
        marginBottom: 16,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    categoryButton: {
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        padding: 10,
        margin: 4,
    },
    selectedCategory: {
        backgroundColor: "#4CAF50",
    },
    categoryText: {
        color: "#FFF",
    },
    eventCard: {
        backgroundColor: "#1E1E1E",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    eventHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    eventName: {
        fontSize: 18,
        color: "#9c89b8",
        fontWeight: "bold",
    },
    bookmarkButton: {
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 8,
    },
    bookmarkText: {
        color: "#cce3de",
    },
    eventDetails: {
        color: "#BBB",
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
        color: "#FFF",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    actionButton: {
        backgroundColor: "#5c6b73",
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 4,
    },
    actionText: {
        color: "#FFF",
        textAlign: "center",
    },
});

export default EventDescription;
