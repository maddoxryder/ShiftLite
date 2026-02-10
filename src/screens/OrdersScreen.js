import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";

const SEED_ORDERS = [
    { id: "o1", table: "12", item: "Wings", status: "pending", time: "12:05" },
    { id: "o2", table: "4", item: "Burger", status: "in-progress", time: "12:10" },
    { id: "o3", table: "7", item: "Nachos", status: "ready", time: "12:12" },
    { id: "o4", table: "2", item: "Caesar Salad", status: "pending", time: "12:15" },
    { id: "o5", table: "9", item: "Fries", status: "done", time: "12:01" },
];

const STATUS_OPTIONS = ["All", "pending", "in-progress", "ready", "done"];

export default function OrdersScreen() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return SEED_ORDERS.filter((o) => {
            const matchStatus = status === "All" ? true : o.status === status;
            const matchSearch =
                !q ||
                o.table.toLowerCase().includes(q) ||
                o.item.toLowerCase().includes(q) ||
                o.status.toLowerCase().includes(q);

            return matchStatus && matchSearch;
        });
    }, [search, status]);

    return (
        <View style={{ flex: 1, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "800" }}>Orders</Text>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="search table, item, status..."
                autoCapitalize="none"
                style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                }}
            />

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {STATUS_OPTIONS.map((opt) => {
                    const selected = opt === status;
                    return (
                        <Pressable
                            key={opt}
                            onPress={() => setStatus(opt)}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 999,
                                borderWidth: 1,
                                borderColor: selected ? "#111" : "#ddd",
                                backgroundColor: selected ? "#111" : "#fff",
                            }}
                        >
                            <Text style={{ color: selected ? "#fff" : "#111", fontWeight: "700" }}>
                                {opt}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Text style={{ opacity: 0.7 }}>showing {filtered.length} order(s)</Text>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "#eee",
                            borderRadius: 14,
                            padding: 12,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Text style={{ fontWeight: "800" }}>
                            Table {item.table} • {item.item}
                        </Text>
                        <Text style={{ marginTop: 6, opacity: 0.75 }}>
                            {item.status} • {item.time}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
