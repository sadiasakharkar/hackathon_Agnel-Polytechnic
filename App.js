import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { Image } from "react-native";
import Start from "./start";
import Signup from "./signup";
import RoleSelection from "./RoleSelection";
import Login from "./login";
import Coordinator from "./Coordinator";
import CoordinatorsDashboard from "./CoordinatorsDashboard";
import UniversityAdmin from "./UniversityAdmin";
import Student from "./Student";
import EventManager from "./EventManager";
import UniversityDashboard from "./UniversityDashboard";
import StudentDashboardApp from "./StudentDashboardApp";
import eventmanagerdashboard from "./eventmanagerdashboard";
import evenntTaskAssignment from "./eventTaskAssignment";
import AttendanceScanner from './AttendanceScanner'
import PingChats from "./pingChats";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Start"
                screenOptions={{
                    headerStyle: { backgroundColor: "#121212" },
                    headerTintColor: "#FFF",
                    headerTitleStyle: { fontWeight: "bold" },
                }}
            >
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="RoleSelection" component={RoleSelection} />
                <Stack.Screen name="Coordinator" component={Coordinator} />
                <Stack.Screen
                    name="CoordinatorsDashboard"
                    component={CoordinatorsDashboard}
                />
                <Stack.Screen
                    name="UniversityAdmin"
                    component={UniversityAdmin}
                />
                <Stack.Screen name="Student" component={Student} />
                <Stack.Screen name="EventManager" component={EventManager} />
                <Stack.Screen
                    name="eventmanagerdashboard"
                    component={eventmanagerdashboard}
                />
                <Stack.Screen
                    name="eventTaskAssignment"
                    component={evenntTaskAssignment}
                />
                <Stack.Screen
                    name="UniversityDashboard"
                    component={UniversityDashboard}
                />
                <Stack.Screen
                    name="StudentDashboardApp"
                    component={StudentDashboardApp}
                />
                <Stack.Screen
                    name="AttendanceScanner"
                    component={AttendanceScanner}
                />
                <Stack.Screen
                name="pingChats"
                component={PingChats}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}