import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForNotificationsAsync } from "./src/services/notifications";
import { setItem } from "./src/services/storage";

export default function App() {
    useEffect(() => {
        (async () => {
            const { expoPushToken } = await registerForNotificationsAsync();

            if (expoPushToken) {
                await setItem("expoPushToken", expoPushToken);
                console.log("Expo push token:", expoPushToken);
            }
        })();
    }, []);

    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
}