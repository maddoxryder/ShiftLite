import React from "react";
import { View, Text } from "react-native";
import { theme } from "../theme/theme";

export default function StatusBadge({ label, color }) {
    return (
        <View
            style={{
                backgroundColor: color,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: theme.radius.pill,
            }}
        >
            <Text style={{ color: "#000", fontWeight: "700", fontSize: 12 }}>
                {label}
            </Text>
        </View>
    );
}