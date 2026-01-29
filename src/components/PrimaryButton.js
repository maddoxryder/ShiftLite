import React from "react";
import { Pressable, Text } from "react-native";

export default function PrimaryButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 12,
        marginVertical: 6,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>
        {label}
      </Text>
    </Pressable>
  );
}
