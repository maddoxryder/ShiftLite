import React from "react";
import { View, Text, Pressable } from "react-native";

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 10 }}>
      {options.map((o) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: selected ? "#111" : "#fff",
            }}
          >
            <Text style={{ color: selected ? "#fff" : "#111", textAlign: "center" }}>
              {o}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
