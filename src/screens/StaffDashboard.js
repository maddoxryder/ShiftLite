import React from "react";
import { View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function StaffDashboard({ navigation, onLogout }) {
  return (
    <View style={{ padding: 20 }}>
      <PrimaryButton label="my schedule" onPress={() => navigation.navigate("Schedule")} />
      <PrimaryButton label="my tasks" onPress={() => navigation.navigate("Tasks")} />
      <PrimaryButton label="messages" onPress={() => navigation.navigate("Messaging")} />
      <PrimaryButton label="logout" onPress={onLogout} />
    </View>
  );
}
