import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/theme";

export default function PremiumTile({ icon, title, subtitle, onPress, accent }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flex: 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
            })}
        >
            <LinearGradient
                colors={[
                    "rgba(255,255,255,0.08)",
                    "rgba(255,255,255,0.03)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    minHeight: 132,
                    borderRadius: theme.radius.lg,
                    padding: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    justifyContent: "space-between",
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 16,
                        backgroundColor: accent || theme.colors.surfaceSoft,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </View>

                <View>
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "800",
                            fontSize: 16,
                        }}
                    >
                        {title}
                    </Text>
                    {!!subtitle && (
                        <Text
                            style={{
                                color: theme.colors.muted,
                                marginTop: 4,
                                fontSize: 12,
                            }}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </LinearGradient>
        </Pressable>
    );
}