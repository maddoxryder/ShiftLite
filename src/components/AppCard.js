import React from "react";
import { View } from "react-native";
import { theme } from "../theme/theme";

export default function AppCard({ children, style }) {
    return (
        <View
            style={[
                {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radius.lg,
                    padding: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}