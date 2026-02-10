import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getItem, setItem, removeItem } from "../services/storage";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MemberChatScreen from "../screens/MemberChatScreen";
import OrdersScreen from "../screens/OrdersScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import TasksScreen from "../screens/TasksScreen";
import InventoryScreen from "../screens/InventoryScreen";
import MessagingScreen from "../screens/MessagingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [booting, setBooting] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    (async () => {
      // TEMP: force login to show once (remove after it works)
      await removeItem("role");

      const savedRole = await getItem("role", null);
      setRole(savedRole);
      setBooting(false);
    })();
  }, []);

  const login = async (r) => {
    await setItem("role", r);
    setRole(r);
  };

  const logout = async () => {
    await removeItem("role");
    setRole(null);
  };

  if (booting) return null;

  return (
    <Stack.Navigator>
      {!role ? (
        <Stack.Screen name="Login" options={{ title: "Login" }}>
          {(props) => <LoginScreen {...props} onLogin={login} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} role={role} onLogout={logout} />}
          </Stack.Screen>

          <Stack.Screen name="MemberChat" component={MemberChatScreen} options={{ title: "Page" }} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
