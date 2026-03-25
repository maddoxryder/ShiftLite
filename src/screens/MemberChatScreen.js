import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { addPing } from "../services/pings";
import { getItem } from "../services/storage";
import { sendLocalPingNotification } from "../services/notifications";

const PRESETS = [
    "Need help at front",
    "Come to bar",
    "Inventory issue",
    "Security needed",
    "Please check table 4",
];

export default function MemberChatScreen({ route, navigation }) {
    const member = route?.params?.member;

    const sendPing = async (message) => {
        const from = await getItem("username", "manager");

        const ping = {
            id: `p_${Date.now()}`,
            from,
            to: (member?.name || "unknown").toLowerCase(),
            toRole: (member?.role || "").toLowerCase(),
            message,
            timestamp: new Date().toISOString(),
            unread: true,
            acknowledged: false,
        };

        await addPing(ping);

        await sendLocalPingNotification(
            `Ping for ${member?.name ?? "Team Member"}`,
            message,
            { pingId: ping.id }
        );

        Alert.alert("Ping sent", `${message} → ${member?.name ?? "team member"}`);
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                Page {member?.name ?? "Team Member"}
            </Text>

            <Text style={{ opacity: 0.7 }}>Choose a preset message:</Text>

            {PRESETS.map((msg) => (
                <Pressable
                    key={msg}
                    onPress={() => sendPing(msg)}
                    style={{
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#eee",
                    }}
                >
                    <Text style={{ fontWeight: "700" }}>{msg}</Text>
                </Pressable>
            ))}
        </View>
    );
}