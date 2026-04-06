import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import PremiumTile from "../components/PremiumTile";
import { theme } from "../theme/theme";

export default function HomeScreen({ navigation, role }) {
    const isManager = role === "manager";

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <LinearGradient
                colors={[theme.colors.bg, theme.colors.bg2]}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontSize: 30,
                            fontWeight: "900",
                            marginBottom: 18,
                        }}
                    >
                        ShiftLite
                    </Text>

                    <View style={{ marginBottom: 24 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.text,
                                    fontSize: 20,
                                    fontWeight: "900",
                                }}
                            >
                                Quick Page
                            </Text>

                            <View
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: theme.radius.pill,
                                    backgroundColor: "rgba(124,92,255,0.14)",
                                    borderWidth: 1,
                                    borderColor: "rgba(124,92,255,0.35)",
                                }}
                            >
                                <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                                    {isManager ? "Manager" : "Staff"}
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => navigation.navigate("EmployeeDirectory")}
                            style={({ pressed }) => ({
                                backgroundColor: "rgba(255,255,255,0.05)",
                                borderRadius: 18,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.08)",
                                transform: [{ scale: pressed ? 0.985 : 1 }],
                            })}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 14,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            color: theme.colors.text,
                                            fontWeight: "900",
                                            fontSize: 17,
                                            marginBottom: 6,
                                        }}
                                    >
                                        Open employee ping list
                                    </Text>
                                    <Text
                                        style={{
                                            color: theme.colors.muted,
                                            lineHeight: 20,
                                        }}
                                    >
                                        View every active employee in the company and choose who you
                                        want to ping.
                                    </Text>
                                </View>

                                <Ionicons
                                    name="people-outline"
                                    size={24}
                                    color={theme.colors.text}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: 14,
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    backgroundColor: "rgba(124,92,255,0.16)",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                                    Browse Employees
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    <SectionTitle title="Quick Actions" />

                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                        <PremiumTile
                            title="Schedule"
                            subtitle="Shifts"
                            icon={
                                <Ionicons
                                    name="calendar-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Schedule")}
                        />
                        <PremiumTile
                            title="Tasks"
                            subtitle="Track"
                            icon={
                                <Feather
                                    name="check-square"
                                    size={21}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Tasks")}
                        />
                    </View>

                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                        <PremiumTile
                            title="Inventory"
                            subtitle="Stock"
                            icon={
                                <MaterialCommunityIcons
                                    name="archive-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Inventory")}
                        />
                        <PremiumTile
                            title="Announcements"
                            subtitle="Updates"
                            icon={
                                <Ionicons
                                    name="megaphone-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Messaging")}
                        />
                    </View>

                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                        <PremiumTile
                            title="Orders"
                            subtitle="Track"
                            icon={
                                <Feather
                                    name="shopping-bag"
                                    size={21}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Orders")}
                        />
                        <PremiumTile
                            title="Ping Inbox"
                            subtitle="Alerts"
                            icon={
                                <Ionicons
                                    name="notifications-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("PingInbox")}
                        />
                    </View>

                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                        <PremiumTile
                            title="Settings"
                            subtitle="Preferences"
                            icon={
                                <Ionicons
                                    name="settings-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Settings")}
                        />
                        <PremiumTile
                            title="Profile"
                            subtitle="My Info"
                            icon={
                                <Ionicons
                                    name="person-outline"
                                    size={22}
                                    color={theme.colors.text}
                                />
                            }
                            onPress={() => navigation.navigate("Profile")}
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
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