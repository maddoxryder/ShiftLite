import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getItem, setItem, removeItem } from "../services/storage";

import LoginScreen from "../screens/LoginScreen";
import ManagerDashboard from "../screens/ManagerDashboard";
import StaffDashboard from "../screens/StaffDashboard";
import ScheduleScreen from "../screens/ScheduleScreen";
import TasksScreen from "../screens/TasksScreen";
import InventoryScreen from "../screens/InventoryScreen";
import MessagingScreen from "../screens/MessagingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    getItem("role").then(setRole);
  }, []);

  const login = async (r) => {
    await setItem("role", r);
    setRole(r);
  };

  const logout = async () => {
    await removeItem("role");
    setRole(null);
  };

  return (
    <Stack.Navigator>
      {!role ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={login} />}
        </Stack.Screen>
      ) : (
        <>
          {role === "manager" ? (
            <Stack.Screen name="Manager">
              {(props) => <ManagerDashboard {...props} onLogout={logout} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Staff">
              {(props) => <StaffDashboard {...props} onLogout={logout} />}
            </Stack.Screen>
          )}

          <Stack.Screen name="Schedule" component={ScheduleScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Inventory" component={InventoryScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
