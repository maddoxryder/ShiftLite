import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { theme } from "../theme/theme";
import { supabase } from "../services/supabase";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("app_users")
      .select("*")
      .limit(1); // simplest version

    if (error) {
      console.log("Fetch user error:", error);
    } else {
      setUser(data?.[0] || null);
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 20 }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "900", color: theme.colors.text }}>
        Profile
      </Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: theme.colors.muted }}>Name</Text>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          {user.display_name || "N/A"}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 12 }}>Email</Text>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          {user.email || "N/A"}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 12 }}>Role</Text>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          {user.role || "employee"}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 12 }}>Active</Text>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          {user.active ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}