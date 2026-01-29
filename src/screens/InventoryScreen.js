import React from "react";
import { View, Text } from "react-native";
import { seed } from "../data/seed";

export default function InventoryScreen() {
  return (
    <View style={{ padding: 20 }}>
      {seed.inventory.map(i => (
        <Text key={i.id}>
          {i.name} ({i.qty}/{i.min})
        </Text>
      ))}
    </View>
  );
}
