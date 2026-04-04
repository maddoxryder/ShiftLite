import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Switch, Pressable, ScrollView, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import { loadAppSettings, saveAppSettings } from "../services/appSettings";

export default function SettingsScreen({ onLogout, role, user }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        (async () => {
            const loaded = await loadAppSettings();
            setSettings(loaded);
        })();
    }, []);

    const updateSetting = async (key, value) => {
        const next = { ...(settings || {}), [key]: value };
        setSettings(next);
        await saveAppSettings(next);
    };

    const initials = useMemo(() => {
        const source =
            user?.display_name ||
            user?.username ||
            (role === "manager" ? "Manager" : "Staff");
        return source
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }, [user, role]);

    if (!settings) return null;

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
                    Manage preferences, alerts, appearance, and account tools.
                </Text>

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
                            width: 56,
                            height: 56,
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
                            {initials}
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
                            {user?.display_name || user?.username || "ShiftLite User"}
                        </Text>
                        <Text
                            style={{
                                color: theme.colors.muted,
                                marginTop: 4,
                            }}
                        >
                            {role === "manager" ? "Manager" : "Staff"} account
                        </Text>
                    </View>
                </View>

                <SectionTitle title="Notifications" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <SettingRow
                        icon={<Ionicons name="notifications-outline" size={20} color={theme.colors.text} />}
                        title="Push notifications"
                        subtitle="Enable incoming pings and operational alerts"
                        value={settings.pushEnabled}
                        onValueChange={(value) => updateSetting("pushEnabled", value)}
                    />
                    <SettingRow
                        icon={<Ionicons name="volume-high-outline" size={20} color={theme.colors.text} />}
                        title="Sound"
                        subtitle="Play a sound when a ping or alert arrives"
                        value={settings.soundEnabled}
                        onValueChange={(value) => updateSetting("soundEnabled", value)}
                    />
                    <SettingRow
                        icon={<MaterialCommunityIcons name="archive-alert-outline" size={20} color={theme.colors.text} />}
                        title="Low stock alerts"
                        subtitle="Show alerts for inventory items below threshold"
                        value={settings.lowStockAlerts}
                        onValueChange={(value) => updateSetting("lowStockAlerts", value)}
                    />
                    <SettingRow
                        icon={<Ionicons name="calendar-outline" size={20} color={theme.colors.text} />}
                        title="Shift reminders"
                        subtitle="Enable schedule and shift update reminders"
                        value={settings.shiftReminders}
                        onValueChange={(value) => updateSetting("shiftReminders", value)}
                    />
                    <SettingRow
                        icon={<Ionicons name="megaphone-outline" size={20} color={theme.colors.text} />}
                        title="Announcements"
                        subtitle="Enable announcement notifications"
                        value={settings.announcementsEnabled}
                        onValueChange={(value) => updateSetting("announcementsEnabled", value)}
                    />
                </View>

                <SectionTitle title="Appearance" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <SettingRow
                        icon={<Ionicons name="moon-outline" size={20} color={theme.colors.text} />}
                        title="Dark mode"
                        subtitle="Current app theme preference"
                        value={settings.darkMode}
                        onValueChange={(value) => updateSetting("darkMode", value)}
                    />
                    <SettingRow
                        icon={<Feather name="minimize-2" size={20} color={theme.colors.text} />}
                        title="Compact mode"
                        subtitle="Use denser cards and list layouts"
                        value={settings.compactMode}
                        onValueChange={(value) => updateSetting("compactMode", value)}
                    />
                </View>

                <SectionTitle title="Inbox behavior" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <SettingRow
                        icon={<MaterialCommunityIcons name="email-check-outline" size={20} color={theme.colors.text} />}
                        title="Auto-mark announcements"
                        subtitle="Automatically mark announcements as read after opening"
                        value={settings.autoMarkAnnouncementsRead}
                        onValueChange={(value) => updateSetting("autoMarkAnnouncementsRead", value)}
                    />
                </View>

                <SectionTitle title="Tools" />
                <View style={{ gap: 12, marginBottom: 18 }}>
                    <ActionCard
                        icon={<MaterialCommunityIcons name="account-edit-outline" size={20} color={theme.colors.text} />}
                        title="Edit Profile"
                        subtitle="Profile editing screen can be added next"
                        onPress={() => Alert.alert("Edit Profile", "Profile editing can be added as the next screen.")}
                    />
                    <ActionCard
                        icon={<Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.text} />}
                        title="Privacy & Permissions"
                        subtitle="Review permissions and notification access"
                        onPress={() =>
                            Alert.alert(
                                "Privacy & Permissions",
                                "You can manage system-level notification permissions from your device settings."
                            )
                        }
                    />
                    <ActionCard
                        icon={<Ionicons name="information-circle-outline" size={20} color={theme.colors.text} />}
                        title="About ShiftLite"
                        subtitle="Version 1.0.0 • Club operations platform"
                        onPress={() =>
                            Alert.alert(
                                "About ShiftLite",
                                "ShiftLite helps staff manage schedules, inventory, tasks, pings, and announcements."
                            )
                        }
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