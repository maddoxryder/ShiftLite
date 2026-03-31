import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { getInboxPings, acknowledgePing } from "../services/pings";

export default function PingInboxScreen({ role }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getInboxPings();
            setItems(data);
        } catch (err) {
            console.warn("inbox load error:", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await acknowledgePing(id);
            await load();
        } catch (err) {
            console.warn("ack error:", err);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading pings...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: "900" }}>Ping Inbox</Text>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No pings found.</Text>}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "#eee",
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>{item.message}</Text>
                        <Text style={{ marginTop: 6, opacity: 0.7 }}>
                            From: {item.from_user}
                        </Text>
                        <Text style={{ opacity: 0.6 }}>
                            {new Date(item.created_at).toLocaleString()}
                        </Text>

                        {!item.acknowledged && role !== "manager" ? (
                            <Pressable
                                onPress={() => handleAcknowledge(item.id)}
                                style={{
                                    marginTop: 12,
                                    backgroundColor: "#111",
                                    padding: 12,
                                    borderRadius: 12,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "800" }}>
                                    Acknowledge
                                </Text>
                            </Pressable>
                        ) : (
                            <Text style={{ marginTop: 10, fontWeight: "700", color: "green" }}>
                                {item.acknowledged ? "Acknowledged" : "Received"}
                            </Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}