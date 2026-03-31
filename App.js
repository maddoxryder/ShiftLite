import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForNotificationsAsync } from "./src/services/notifications";
import { supabase } from "./src/services/supabase";
import { getCurrentUserProfile } from "./src/services/auth";

export default function App() {
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                const { expoPushToken } = await registerForNotificationsAsync();
                if (!expoPushToken) return;

                const profile = await getCurrentUserProfile();
                if (!profile?.username) return;

                const { error } = await supabase.from("device_tokens").upsert(
                    {
                        username: profile.username,
                        expo_push_token: expoPushToken,
                    },
                    {
                        onConflict: "username",
                    }
                );

                if (error) {
                    console.warn("device token upsert error:", error.message);
                }
            } catch (err) {
                console.warn("notification setup error:", err);
            }
        };

        setupNotifications();
    }, []);

    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
}