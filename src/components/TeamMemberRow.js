import React from "react";
import { View, Text, Pressable } from "react-native";

export default function TeamMemberRow({ member, selected, onSelect, onPage }) {
    return (
        <Pressable onPress={onSelect} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderWidth: 2,
                    borderColor: selected ? "rgba(30,30,30,0.8)" : "rgba(0,0,0,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ fontWeight: "900" }}>{member.initial}</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800" }}>{member.name}</Text>
                <Text style={{ opacity: 0.6 }}>{member.role}</Text>
            </View>

            <Pressable
                onPress={onPage}
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.65)",
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)",
                }}
            >
                <Text style={{ fontWeight: "700" }}>Page</Text>
            </Pressable>
        </Pressable>
    );
}
