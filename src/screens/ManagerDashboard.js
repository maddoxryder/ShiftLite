import React from "react";
import { View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function ManagerDashboard({ navigation, onLogout }) {
  return (
    <View style={{ padding: 20 }}>
      <PrimaryButton label="schedule" onPress={() => navigation.navigate("Schedule")} />
      <PrimaryButton label="tasks" onPress={() => navigation.navigate("Tasks")} />
      <PrimaryButton label="inventory" onPress={() => navigation.navigate("Inventory")} />
      <PrimaryButton label="messaging" onPress={() => navigation.navigate("Messaging")} />
      <PrimaryButton label="logout" onPress={onLogout} />
    </View>
  );
}
