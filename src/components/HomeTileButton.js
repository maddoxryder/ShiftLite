import React from "react";
import { Pressable, Text } from "react-native";

export default function HomeTileButton({ label, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                paddingVertical: 18,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.65)",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.06)",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text style={{ fontWeight: "800" }}>{label}</Text>
        </Pressable>
    );
}
