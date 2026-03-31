import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { sendPingToUser } from "../services/pings";

const PRESETS = [
    "Need help at front",
    "Come to bar",
    "Inventory issue",
    "Security needed",
    "Please check table 4",
];

export default function MemberChatScreen({ route, navigation }) {
    const member = route?.params?.member;

    const handleSend = async (message) => {
        try {
            await sendPingToUser({
                toUserId: member.id,
                message,
            });

            Alert.alert("Ping sent", `${message} → ${member.display_name || member.name}`);
            navigation.goBack();
        } catch (err) {
            console.warn("send ping error:", err);
            Alert.alert("Error", "Could not send ping.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                Page {member?.display_name || member?.name || "Team Member"}
            </Text>

            <Text style={{ opacity: 0.7 }}>Choose a preset message:</Text>

            {PRESETS.map((msg) => (
                <Pressable
                    key={msg}
                    onPress={() => handleSend(msg)}
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