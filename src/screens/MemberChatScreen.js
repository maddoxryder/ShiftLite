import React from "react";
import { View, Text, Pressable } from "react-native";

export default function MemberChatScreen({ route, navigation }) {
    const member = route?.params?.member;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                Page {member?.name ?? "Team Member"}
            </Text>

            <Text style={{ marginTop: 10, opacity: 0.7 }}>
                This is a placeholder for paging / quick messaging.
            </Text>

            <Pressable
                onPress={() => navigation.goBack()}
                style={{
                    marginTop: 20,
                    padding: 14,
                    borderRadius: 10,
                    backgroundColor: "#111",
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                    Back
                </Text>
            </Pressable>
        </View>
    );
}
