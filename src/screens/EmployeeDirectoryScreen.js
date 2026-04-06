import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";
import { getCurrentUserProfile } from "../services/auth";
import { theme } from "../theme/theme";

export default function EmployeeDirectoryScreen({ navigation }) {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const currentUser = await getCurrentUserProfile();

            const { data, error } = await supabase
                .from("app_users")
                .select("id, username, display_name, role, active")
                .eq("active", true)
                .order("display_name", { ascending: true });

            if (error) {
                console.warn("employee load error:", error.message);
                return;
            }

            const cleaned =
                data?.filter((user) => user.id !== currentUser?.id) ?? [];

            setEmployees(cleaned);
            setFilteredEmployees(cleaned);
        } catch (err) {
            console.warn("employee directory error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);

        const q = text.trim().toLowerCase();

        if (!q) {
            setFilteredEmployees(employees);
            return;
        }

        const filtered = employees.filter((emp) => {
            const displayName = emp.display_name?.toLowerCase() || "";
            const username = emp.username?.toLowerCase() || "";
            const role = emp.role?.toLowerCase() || "";

            return (
                displayName.includes(q) || username.includes(q) || role.includes(q)
            );
        });

        setFilteredEmployees(filtered);
    };

    const handleOpenMember = (employee) => {
        navigation.navigate("MemberChat", {
            member: {
                id: employee.id,
                name: employee.username,
                display_name: employee.display_name,
                role: employee.role,
            },
        });
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.bg,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 18 }}>
            <Text
                style={{
                    color: theme.colors.text,
                    fontSize: 28,
                    fontWeight: "900",
                    marginBottom: 14,
                }}
            >
                Employee Directory
            </Text>

            <TextInput
                value={search}
                onChangeText={handleSearch}
                placeholder="Search by name, username, or role"
                placeholderTextColor={theme.colors.muted}
                style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    marginBottom: 16,
                }}
            />

            <FlatList
                data={filteredEmployees}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleOpenMember(item)}
                        style={({ pressed }) => ({
                            backgroundColor: theme.colors.surface,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            padding: 16,
                            marginBottom: 10,
                            opacity: pressed ? 0.92 : 1,
                        })}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        fontSize: 16,
                                        fontWeight: "800",
                                        marginBottom: 4,
                                    }}
                                >
                                    {item.display_name || item.username}
                                </Text>

                                <Text
                                    style={{
                                        color: theme.colors.muted,
                                        fontSize: 13,
                                    }}
                                >
                                    @{item.username} • {item.role}
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: "rgba(124,92,255,0.16)",
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        fontWeight: "800",
                                    }}
                                >
                                    Ping
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
                        No employees found.
                    </Text>
                }
            />
        </View>
    );
}