import React from "react";
import { View } from "react-native";
import { theme } from "../theme/theme";

export default function ScreenContainer({ children }) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.bg,
                padding: theme.spacing.md,
            }}
        >
            {children}
        </View>
    );
}