import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");

  const submit = () => {
    const role = username.includes("mgr") ? "manager" : "staff";
    onLogin(role);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>ShiftLite</Text>
      <TextInput
        placeholder="username (include mgr)"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 12, marginVertical: 10 }}
      />
      <PrimaryButton label="login" onPress={submit} />
    </View>
  );
}
