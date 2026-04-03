import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, TextInput } from "react-native";
import { sendPingToUser } from "../services/pings";
import { theme } from "../theme/theme";

const LOCATIONS = [
    "Front entrance",
    "Main bar",
    "VIP section",
    "DJ booth",
    "Patio",
    "Washrooms",
    "Back hallway",
    "Booth 1",
    "Booth 2",
    "Booth 3",
    "Table 1",
    "Table 2",
    "Table 3",
    "Table 4",
    "Table 5",
    "Table 6",
    "Table 7",
    "Table 8",
];

const ITEMS = [
    "ice",
    "vodka",
    "tequila",
    "gin",
    "mixers",
    "napkins",
    "glasses",
    "menus",
    "water",
    "receipts",
];

const PEOPLE = [
    "manager",
    "bartender",
    "host",
    "busser",
    "security",
    "server",
    "barback",
];

const TABLES = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
];

export default function MemberChatScreen({ route, navigation }) {
    const member = route?.params?.member;

    const [selectedType, setSelectedType] = useState("come_to");

    const [location1, setLocation1] = useState("Main bar");
    const [item, setItem] = useState("ice");
    const [person, setPerson] = useState("bartender");
    const [securityLocation, setSecurityLocation] = useState("Front entrance");
    const [tableNumber, setTableNumber] = useState("4");
    const [customMessage, setCustomMessage] = useState("");

    const previewMessage = useMemo(() => {
        switch (selectedType) {
            case "come_to":
                return `Come to ${location1}`;
            case "bring_to":
                return `Please bring ${item} to ${person}`;
            case "security_needed":
                return `Security needed at ${securityLocation}`;
            case "check_table":
                return `Please check table ${tableNumber}`;
            case "custom":
                return customMessage.trim();
            default:
                return "";
        }
    }, [
        selectedType,
        location1,
        item,
        person,
        securityLocation,
        tableNumber,
        customMessage,
    ]);

    const handleSend = async () => {
        const finalMessage = previewMessage.trim();

        if (!finalMessage) {
            Alert.alert("Missing message", "Please enter or select a message first.");
            return;
        }

        try {
            await sendPingToUser({
                toUserId: member.id,
                message: finalMessage,
            });

            Alert.alert(
                "Ping sent",
                `${finalMessage} → ${member.display_name || member.name}`
            );
            navigation.goBack();
        } catch (err) {
            console.log("FULL PING ERROR:", err);
            Alert.alert(
                "Could not send ping",
                err?.message || JSON.stringify(err) || "Unknown error"
            );
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
                    Page Member
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    Send a fast operational ping to{" "}
                    {member?.display_name || member?.name || "team member"}.
                </Text>

                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        padding: 16,
                        marginBottom: 18,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontSize: 17,
                            fontWeight: "900",
                            marginBottom: 6,
                        }}
                    >
                        Recipient
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                        {member?.display_name || member?.name} • {member?.role}
                    </Text>
                </View>

                <SectionTitle title="Message Type" />
                <ChipRow
                    options={[
                        { label: "Come to", value: "come_to" },
                        { label: "Bring to", value: "bring_to" },
                        { label: "Security", value: "security_needed" },
                        { label: "Check table", value: "check_table" },
                        { label: "Custom", value: "custom" },
                    ]}
                    value={selectedType}
                    onChange={setSelectedType}
                />

                {selectedType === "come_to" ? (
                    <>
                        <SectionTitle title="Come to ____" />
                        <OptionGrid
                            options={LOCATIONS}
                            value={location1}
                            onChange={setLocation1}
                        />
                    </>
                ) : null}

                {selectedType === "bring_to" ? (
                    <>
                        <SectionTitle title="Please bring ____" />
                        <OptionGrid options={ITEMS} value={item} onChange={setItem} />

                        <SectionTitle title="to ____" />
                        <OptionGrid options={PEOPLE} value={person} onChange={setPerson} />
                    </>
                ) : null}

                {selectedType === "security_needed" ? (
                    <>
                        <SectionTitle title="Security needed at ____" />
                        <OptionGrid
                            options={LOCATIONS}
                            value={securityLocation}
                            onChange={setSecurityLocation}
                        />
                    </>
                ) : null}

                {selectedType === "check_table" ? (
                    <>
                        <SectionTitle title="Please check table ____" />
                        <OptionGrid
                            options={TABLES}
                            value={tableNumber}
                            onChange={setTableNumber}
                        />
                    </>
                ) : null}

                {selectedType === "custom" ? (
                    <>
                        <SectionTitle title="Custom message" />
                        <TextInput
                            value={customMessage}
                            onChangeText={setCustomMessage}
                            placeholder="Type your message..."
                            placeholderTextColor={theme.colors.muted}
                            multiline
                            style={{
                                minHeight: 120,
                                textAlignVertical: "top",
                                backgroundColor: theme.colors.surface,
                                borderRadius: theme.radius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                            }}
                        />
                    </>
                ) : null}

                <SectionTitle title="Preview" />
                <View
                    style={{
                        backgroundColor: "rgba(124,92,255,0.14)",
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: "rgba(124,92,255,0.35)",
                        padding: 16,
                        marginBottom: 18,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontSize: 17,
                            fontWeight: "900",
                        }}
                    >
                        {previewMessage || "Your message preview will appear here"}
                    </Text>
                </View>

                <Pressable
                    onPress={handleSend}
                    style={({ pressed }) => ({
                        backgroundColor: theme.colors.accent,
                        borderRadius: theme.radius.md,
                        paddingVertical: 15,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "900",
                            fontSize: 15,
                        }}
                    >
                        Send Ping
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

function SectionTitle({ title }) {
    return (
        <Text
            style={{
                color: theme.colors.text,
                fontSize: 17,
                fontWeight: "800",
                marginBottom: 10,
                marginTop: 16,
            }}
        >
            {title}
        </Text>
    );
}

function ChipRow({ options, value, onChange }) {
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
            }}
        >
            {options.map((opt) => {
                const selected = opt.value === value;
                return (
                    <Pressable
                        key={opt.value}
                        onPress={() => onChange(opt.value)}
                        style={({ pressed }) => ({
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            borderRadius: theme.radius.pill,
                            borderWidth: 1,
                            borderColor: selected
                                ? "rgba(124,92,255,0.45)"
                                : theme.colors.border,
                            backgroundColor: selected
                                ? "rgba(124,92,255,0.16)"
                                : "rgba(255,255,255,0.04)",
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        })}
                    >
                        <Text
                            style={{
                                color: selected ? theme.colors.text : theme.colors.muted,
                                fontWeight: "700",
                            }}
                        >
                            {opt.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function OptionGrid({ options, value, onChange }) {
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
            }}
        >
            {options.map((opt) => {
                const selected = opt === value;
                return (
                    <Pressable
                        key={opt}
                        onPress={() => onChange(opt)}
                        style={({ pressed }) => ({
                            paddingVertical: 10,
                            paddingHorizontal: 14,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: selected
                                ? "rgba(124,92,255,0.45)"
                                : theme.colors.border,
                            backgroundColor: selected
                                ? "rgba(124,92,255,0.16)"
                                : theme.colors.surface,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        })}
                    >
                        <Text
                            style={{
                                color: selected ? theme.colors.text : theme.colors.muted,
                                fontWeight: selected ? "800" : "700",
                            }}
                        >
                            {opt}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}