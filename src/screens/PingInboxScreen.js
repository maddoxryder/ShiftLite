import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Switch } from "react-native";
import { getPings, acknowledgePing, markPingRead } from "../services/pings";
import { getItem } from "../services/storage";

export default function PingInboxScreen({ role }) {
    const [items, setItems] = useState([]);
    const [username, setUsername] = useState("");
    const [unreadOnly, setUnreadOnly] = useState(false);

    const load = async () => {
        const all = await getPings();
        const currentUsername = await getItem("username", "");
        setUsername(currentUsername);
        setItems(all);
    };

    useEffect(() => {
        load();
    }, []);

    const visible = useMemo(() => {
        let filtered = items;

        if (role !== "manager") {
            filtered = filtered.filter(
                (p) =>
                    p.to === username ||
                    p.to === username.toLowerCase() ||
                    p.toRole === role
            );
        }

        if (unreadOnly) {
            filtered = filtered.filter((p) => p.unread);
        }

        return filtered;
    }, [items, username, role, unreadOnly]);

    const handleAcknowledge = async (id) => {
        await acknowledgePing(id);
        load();
    };

    const handleRead = async (id) => {
        await markPingRead(id);
        load();
    };

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F6F7FF" }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>
                Ping Inbox {role === "manager" ? "(Manager)" : "(Staff)"}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{ fontWeight: "800" }}>Unread only</Text>
                <Switch value={unreadOnly} onValueChange={setUnreadOnly} />
            </View>

            <FlatList
                data={visible}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.06)",
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>{item.message}</Text>
                        <Text style={{ marginTop: 6, opacity: 0.75 }}>
                            From: {item.from} → To: {item.to}
                        </Text>
                        <Text style={{ opacity: 0.7 }}>
                            {new Date(item.timestamp).toLocaleString()}
                        </Text>
                        <Text style={{ marginTop: 6 }}>
                            {item.unread ? "Unread" : "Read"} •{" "}
                            {item.acknowledged ? "Acknowledged" : "Pending"}
                        </Text>

                        {role === "manager" ? null : (
                            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                                <Pressable
                                    onPress={() => handleRead(item.id)}
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: "rgba(17,17,17,0.08)",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontWeight: "800" }}>Mark Read</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => handleAcknowledge(item.id)}
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: "#111",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                                        Acknowledge
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
}