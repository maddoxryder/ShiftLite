import React from "react";
import { View, Text } from "react-native";
import { seed } from "../data/seed";

export default function MessagingScreen() {
  return (
    <View style={{ padding: 20 }}>
      {seed.messages.map(m => (
        <Text key={m.id}>
          {m.title} {m.unread ? "(new)" : ""}
        </Text>
      ))}
    </View>
  );
}
