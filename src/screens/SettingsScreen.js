import React, { useState } from "react";
import { View, Text, Switch, Pressable, Alert } from "react-native";

export default function SettingsScreen({ onLogout }) {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const SettingRow = ({ title, subtitle, value, onValueChange }) => (
        <View
            style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 14,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
            }}
        >
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800" }}>{title}</Text>
                {!!subtitle && <Text style={{ opacity: 0.7, marginTop: 4 }}>{subtitle}</Text>}
            </View>
            <Switch value={value} onValueChange={onValueChange} />
        </View>
    );

    const confirmLogout = () => {
        if (typeof onLogout !== "function") {
            Alert.alert("Logout", "Logout is not wired from AppNavigator yet.");
            return;
        }

        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: onLogout },
        ]);
    };

    return (
        <View style={{ flex: 1, padding: 18, gap: 14 }}>
            <Text style={{ fontSize: 18, fontWeight: "800" }}>Settings</Text>

            <Text style={{ fontWeight: "900" }}>Notifications</Text>
            <SettingRow
                title="Push notifications"
                subtitle="Receive pages, announcements, and updates"
                value={pushEnabled}
                onValueChange={setPushEnabled}
            />
            <SettingRow
                title="Sound"
                subtitle="Play a sound when you get paged"
                value={soundEnabled}
                onValueChange={setSoundEnabled}
            />

            <Text style={{ fontWeight: "900", marginTop: 6 }}>Appearance</Text>
            <SettingRow
                title="Dark mode"
                subtitle="Use a darker theme (demo toggle)"
                value={darkMode}
                onValueChange={setDarkMode}
            />

            <Text style={{ fontWeight: "900", marginTop: 6 }}>Account</Text>

            <Pressable
                onPress={() => Alert.alert("Profile", "Profile editing coming next.")}
                style={{
                    padding: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "#fff",
                }}
            >
                <Text style={{ fontWeight: "800" }}>Edit Profile</Text>
                <Text style={{ opacity: 0.7, marginTop: 4 }}>Name, role, contact</Text>
            </Pressable>

            <Pressable
                onPress={() => Alert.alert("Privacy", "Privacy options coming next.")}
                style={{
                    padding: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#eee",
                    backgroundColor: "#fff",
                }}
            >
                <Text style={{ fontWeight: "800" }}>Privacy</Text>
                <Text style={{ opacity: 0.7, marginTop: 4 }}>Data & permissions</Text>
            </Pressable>

            {/* Logout */}
            <Pressable
                onPress={confirmLogout}
                style={{
                    marginTop: 6,
                    padding: 14,
                    borderRadius: 14,
                    backgroundColor: "#111",
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>
                    Logout
                </Text>
            </Pressable>
        </View>
    );
}
