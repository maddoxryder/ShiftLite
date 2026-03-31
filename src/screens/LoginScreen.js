import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { signInWithEmail } from "../services/auth";
import { theme } from "../theme/theme";

export default function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password.trim()) {
            Alert.alert("Login", "Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmail(cleanEmail, password);
            await onLogin();
        } catch (err) {
            Alert.alert("Login failed", err.message || "Unable to log in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                padding: 24,
                backgroundColor: theme.colors.bg,
            }}
        >
            <Text
                style={{
                    color: theme.colors.text,
                    fontSize: 32,
                    fontWeight: "900",
                    marginBottom: 8,
                }}
            >
                ShiftLite
            </Text>

            <Text
                style={{
                    color: theme.colors.muted,
                    marginBottom: 24,
                }}
            >
                Sign in with your email and password.
            </Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor={theme.colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    padding: 14,
                    borderRadius: 14,
                    marginBottom: 12,
                }}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.colors.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    padding: 14,
                    borderRadius: 14,
                    marginBottom: 18,
                }}
            />

            <PrimaryButton
                label={loading ? "Signing in..." : "Login"}
                onPress={submit}
            />

            <View
                style={{
                    marginTop: 24,
                    padding: 14,
                    borderRadius: 14,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            >
                <Text style={{ color: theme.colors.text, fontWeight: "800", marginBottom: 8 }}>
                    Demo accounts
                </Text>
                <Text style={{ color: theme.colors.muted }}>Manager: manager@shiftlite.com</Text>
                <Text style={{ color: theme.colors.muted }}>Staff: kal@shiftlite.com</Text>
                <Text style={{ color: theme.colors.muted }}>Password: Shiftlite123!</Text>
            </View>
        </View>
    );
}