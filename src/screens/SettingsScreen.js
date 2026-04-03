import React, { useState } from "react";
import { View, Text, Switch, Pressable, Alert, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function SettingsScreen({ onLogout, role }) {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                        fontSize: 28,
                        fontWeight: "900",
                        marginBottom: 6,
                    }}
                >
                    Settings
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    Manage notifications, appearance, and account preferences.
                </Text>

                {/* Profile Summary */}
                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        padding: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <View
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: 18,
                            backgroundColor: "rgba(124,92,255,0.16)",
                            borderWidth: 1,
                            borderColor: "rgba(124,92,255,0.35)",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontSize: 20,
                                fontWeight: "900",
                            }}
                        >
                            {role === "manager" ? "M" : "S"}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontSize: 17,
                                fontWeight: "900",
                            }}
                        >
                            {role === "manager" ? "Manager Account" : "Staff Account"}
                        </Text>
                        <Text
                            style={{
                                color: theme.colors.muted,
                                marginTop: 4,
                            }}
                        >
                            Role-based access enabled
                        </Text>
                    </View>
                </View>

                <SectionTitle title="Notifications" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <SettingRow
                        icon={<Ionicons name="notifications-outline" size={20} color={theme.colors.text} />}
                        title="Push notifications"
                        subtitle="Receive pings, announcements, and alerts"
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                    />
                    <SettingRow
                        icon={<Ionicons name="volume-high-outline" size={20} color={theme.colors.text} />}
                        title="Sound"
                        subtitle="Play sound for incoming pings and updates"
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                    />
                </View>

                <SectionTitle title="Appearance" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <SettingRow
                        icon={<Ionicons name="moon-outline" size={20} color={theme.colors.text} />}
                        title="Dark mode"
                        subtitle="Premium dark theme enabled"
                        value={darkMode}
                        onValueChange={setDarkMode}
                    />
                </View>

                <SectionTitle title="Account" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <ActionCard
                        icon={
                            <MaterialCommunityIcons
                                name="account-edit-outline"
                                size={20}
                                color={theme.colors.text}
                            />
                        }
                        title="Edit Profile"
                        subtitle="Update name, contact, and staff details"
                        onPress={() => Alert.alert("Profile", "Profile editing coming next.")}
                    />

                    <ActionCard
                        icon={
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color={theme.colors.text}
                            />
                        }
                        title="Privacy"
                        subtitle="Review permissions and app access"
                        onPress={() => Alert.alert("Privacy", "Privacy options coming next.")}
                    />
                </View>

                <SectionTitle title="Session" />
                <Pressable
                    onPress={onLogout}
                    style={({ pressed }) => ({
                        backgroundColor: "rgba(255,92,122,0.14)",
                        borderWidth: 1,
                        borderColor: "rgba(255,92,122,0.35)",
                        borderRadius: theme.radius.lg,
                        padding: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={theme.colors.danger}
                    />
                    <Text
                        style={{
                            color: theme.colors.danger,
                            fontWeight: "900",
                            fontSize: 15,
                        }}
                    >
                        Logout
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

function SectionTitle({ title }) {
    return (
        <Text
            style={{
                color: theme.colors.text,
                fontSize: 18,
                fontWeight: "800",
                marginBottom: 12,
            }}
        >
            {title}
        </Text>
    );
}

function SettingRow({ icon, title, subtitle, value, onValueChange }) {
    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
            }}
        >
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </View>

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: theme.colors.text,
                        fontWeight: "800",
                        fontSize: 15,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        color: theme.colors.muted,
                        marginTop: 4,
                        fontSize: 13,
                    }}
                >
                    {subtitle}
                </Text>
            </View>

            <Switch value={value} onValueChange={onValueChange} />
        </View>
    );
}

function ActionCard({ icon, title, subtitle, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                transform: [{ scale: pressed ? 0.985 : 1 }],
            })}
        >
            <View
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </View>

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: theme.colors.text,
                        fontWeight: "800",
                        fontSize: 15,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        color: theme.colors.muted,
                        marginTop: 4,
                        fontSize: 13,
                    }}
                >
                    {subtitle}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.muted}
            />
        </Pressable>
    );
}