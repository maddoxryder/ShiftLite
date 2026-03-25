import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { setItem } from "../services/storage";

export default function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState("");

    const submit = async () => {
        const cleanUsername = username.trim().toLowerCase();
        const role = cleanUsername.includes("mgr") ? "manager" : "staff";

        await setItem("username", cleanUsername);
        onLogin(role);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "700" }}>ShiftLite</Text>
            <TextInput
                placeholder="username (include mgr for manager)"
                value={username}
                onChangeText={setUsername}
                style={{ borderWidth: 1, padding: 12, marginVertical: 10 }}
            />
            <PrimaryButton label="login" onPress={submit} />
        </View>
    );
}