import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Switch, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getInboxPings, acknowledgePing } from "../services/pings";
import { theme } from "../theme/theme";

export default function PingInboxScreen({ role }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getInboxPings();
            setItems(data || []);
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

    const visible = useMemo(() => {
        if (!unreadOnly) return items;
        return items.filter((item) => !item.acknowledged);
    }, [items, unreadOnly]);

    const summary = useMemo(() => {
        const total = items.length;
        const unread = items.filter((x) => !x.acknowledged).length;
        const acknowledged = total - unread;
        return { total, unread, acknowledged };
    }, [items]);

    const handleAcknowledge = async (id) => {
        try {
            await acknowledgePing(id);
            await load();
        } catch (err) {
            console.warn("ack error:", err);
        }
    };

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
                    Ping Inbox
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    {role === "manager"
                        ? "Monitor incoming operational alerts."
                        : "View and acknowledge incoming pings."}
                </Text>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <SummaryCard label="Total" value={summary.total} />
                    <SummaryCard label="Unread" value={summary.unread} accent="danger" />
                    <SummaryCard
                        label="Acknowledged"
                        value={summary.acknowledged}
                        accent="success"
                    />
                </View>

                {/* Controls */}
                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        paddingHorizontal: 14,
                        paddingVertical: 14,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                    }}
                >
                    <View>
                        <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                            Unread only
                        </Text>
                        <Text style={{ color: theme.colors.muted, marginTop: 4, fontSize: 12 }}>
                            Show only pings that still need attention
                        </Text>
                    </View>
                    <Switch value={unreadOnly} onValueChange={setUnreadOnly} />
                </View>

                <Pressable
                    onPress={load}
                    style={({ pressed }) => ({
                        marginBottom: 18,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        borderRadius: theme.radius.md,
                        paddingVertical: 12,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                >
                    <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                        {loading ? "Refreshing..." : "Refresh Inbox"}
                    </Text>
                </Pressable>

                <View style={{ gap: 12 }}>
                    {visible.map((item) => (
                        <PingCard
                            key={item.id}
                            item={item}
                            role={role}
                            onAcknowledge={() => handleAcknowledge(item.id)}
                        />
                    ))}

                    {!loading && visible.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: theme.colors.surface,
                                borderRadius: theme.radius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: 18,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: theme.colors.muted }}>
                                No pings found.
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

function SummaryCard({ label, value, accent }) {
    const color =
        accent === "danger"
            ? theme.colors.danger
            : accent === "success"
                ? theme.colors.success
                : theme.colors.accent;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 14,
            }}
        >
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
            <Text
                style={{
                    color,
                    fontSize: 22,
                    fontWeight: "900",
                    marginTop: 4,
                }}
            >
                {value}
            </Text>
        </View>
    );
}

function PingCard({ item, role, onAcknowledge }) {
    const unread = !item.acknowledged;

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: unread
                    ? "rgba(255,92,122,0.25)"
                    : theme.colors.border,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontSize: 17,
                            fontWeight: "900",
                        }}
                    >
                        {item.message}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 6,
                            lineHeight: 20,
                        }}
                    >
                        From: {item.from_user}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 4,
                            fontSize: 12,
                        }}
                    >
                        {new Date(item.created_at).toLocaleString()}
                    </Text>
                </View>

                <StatusPill unread={unread} />
            </View>

            <View
                style={{
                    marginTop: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: unread
                            ? "rgba(255,92,122,0.14)"
                            : "rgba(61,220,151,0.14)",
                        borderWidth: 1,
                        borderColor: unread
                            ? "rgba(255,92,122,0.35)"
                            : "rgba(61,220,151,0.35)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MaterialCommunityIcons
                        name={unread ? "bell-alert-outline" : "check-circle-outline"}
                        size={20}
                        color={unread ? theme.colors.danger : theme.colors.success}
                    />
                </View>

                <Text style={{ color: theme.colors.muted, flex: 1 }}>
                    {unread
                        ? "Pending acknowledgement"
                        : "Acknowledged by recipient"}
                </Text>
            </View>

            {role !== "manager" && unread ? (
                <Pressable
                    onPress={onAcknowledge}
                    style={({ pressed }) => ({
                        marginTop: 14,
                        backgroundColor: theme.colors.accent,
                        borderRadius: theme.radius.md,
                        paddingVertical: 13,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                        Acknowledge
                    </Text>
                </Pressable>
            ) : null}
        </View>
    );
}

function StatusPill({ unread }) {
    return (
        <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: unread
                    ? "rgba(255,92,122,0.14)"
                    : "rgba(61,220,151,0.14)",
                borderWidth: 1,
                borderColor: unread
                    ? "rgba(255,92,122,0.35)"
                    : "rgba(61,220,151,0.35)",
            }}
        >
            <Text
                style={{
                    color: unread ? theme.colors.danger : theme.colors.success,
                    fontWeight: "800",
                }}
            >
                {unread ? "Unread" : "Seen"}
            </Text>
        </View>
    );
}