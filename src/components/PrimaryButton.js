import React from "react";
import { Pressable, Text } from "react-native";
import { theme } from "../theme/theme";

export default function PrimaryButton({ label, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                backgroundColor: theme.colors.accent,
                padding: 14,
                borderRadius: theme.radius.md,
                alignItems: "center",
                transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
        >
            <Text style={{ color: "#fff", fontWeight: "800" }}>{label}</Text>
        </Pressable>
    );
}