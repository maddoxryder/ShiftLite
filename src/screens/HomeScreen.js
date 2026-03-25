import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import HomeTileButton from "../components/HomeTileButton";
import TeamMemberRow from "../components/TeamMemberRow";

export default function HomeScreen({ navigation, role }) {
    const userInitial = role === "manager" ? "M" : "S";

    const team = useMemo(
        () => [
            { id: "u1", name: "rock", role: "manager", initial: "R" },
            { id: "u2", name: "arthur", role: "boh support", initial: "A" },
            { id: "u3", name: "charlize", role: "server", initial: "C" },
            { id: "u4", name: "kal", role: "security", initial: "K" },
        ],
        []
    );

    const [selectedMemberId, setSelectedMemberId] = useState(team[0]?.id);

    const onPage = (member) => {
        navigation.navigate("MemberChat", { member });
    };

    const TableLayoutPreview = () => {
        return (
            <View
                style={{
                    borderRadius: 18,
                    backgroundColor: "rgba(255,255,255,0.65)",
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)",
                    padding: 14,
                }}
            >
                <Text style={{ fontWeight: "700", textAlign: "center", marginBottom: 10 }}>
                    Table Layout
                </Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                    <View
                        style={{
                            width: 70,
                            height: 150,
                            borderRadius: 10,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderWidth: 2,
                            borderColor: "rgba(120,120,255,0.25)",
                        }}
                    />
                    <View style={{ flex: 1, gap: 10 }}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <View
                                style={{
                                    flex: 1,
                                    height: 45,
                                    borderRadius: 10,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderWidth: 2,
                                    borderColor: "rgba(120,120,255,0.25)",
                                }}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    height: 45,
                                    borderRadius: 10,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderWidth: 2,
                                    borderColor: "rgba(120,120,255,0.25)",
                                }}
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 68,
                                    borderRadius: 10,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderWidth: 2,
                                    borderColor: "rgba(120,120,255,0.25)",
                                }}
                            />
                            <View
                                style={{
                                    width: 48,
                                    height: 68,
                                    borderRadius: 10,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderWidth: 2,
                                    borderColor: "rgba(120,120,255,0.25)",
                                }}
                            />
                            <View
                                style={{
                                    width: 48,
                                    height: 68,
                                    borderRadius: 10,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderWidth: 2,
                                    borderColor: "rgba(120,120,255,0.25)",
                                }}
                            />
                        </View>

                        <View
                            style={{
                                height: 55,
                                borderRadius: 10,
                                backgroundColor: "rgba(255,255,255,0.9)",
                                borderWidth: 2,
                                borderColor: "rgba(120,120,255,0.25)",
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: 70,
                            height: 150,
                            borderRadius: 10,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderWidth: 2,
                            borderColor: "rgba(120,120,255,0.25)",
                        }}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#DDE1FF" }}>
            <View
                style={{
                    paddingTop: 14,
                    paddingHorizontal: 16,
                    paddingBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.08)",
                        }}
                    />
                    <Text style={{ fontWeight: "800", fontSize: 16 }}>Club GBC</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={{ fontWeight: "700" }}>User Profile</Text>
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: "rgba(0,0,0,0.15)",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            borderColor: "rgba(255,255,255,0.85)",
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>{userInitial}</Text>
                    </View>
                </View>
            </View>

            <View style={{ paddingHorizontal: 16, gap: 14 }}>
                <TableLayoutPreview />

                <View style={{ flexDirection: "row", gap: 14 }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={team}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            renderItem={({ item }) => (
                                <TeamMemberRow
                                    member={item}
                                    selected={item.id === selectedMemberId}
                                    onSelect={() => setSelectedMemberId(item.id)}
                                    onPage={() => onPage(item)}
                                />
                            )}
                        />
                    </View>

                    <View style={{ width: 110, gap: 10, justifyContent: "center" }}>
                        {team.slice(0, 3).map((m) => (
                            <Pressable
                                key={m.id}
                                onPress={() => onPage(m)}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 999,
                                    backgroundColor: "rgba(255,255,255,0.65)",
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.06)",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontWeight: "700" }}>Page</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <HomeTileButton label="Schedule" onPress={() => navigation.navigate("Schedule")} />
                    <HomeTileButton label="Announcements" onPress={() => navigation.navigate("Messaging")} />
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <HomeTileButton label="Inventory" onPress={() => navigation.navigate("Inventory")} />
                    <HomeTileButton label="Orders" onPress={() => navigation.navigate("Orders")} />
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <HomeTileButton label="Tasks" onPress={() => navigation.navigate("Tasks")} />
                    <HomeTileButton label="Ping Inbox" onPress={() => navigation.navigate("PingInbox")} />
                </View>

                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <HomeTileButton label="Settings" onPress={() => navigation.navigate("Settings")} />
                    <View style={{ flex: 1 }} />
                </View>
            </View>
        </View>
    );
}