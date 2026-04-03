import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MemberChatScreen from "../screens/MemberChatScreen";
import PingInboxScreen from "../screens/PingInboxScreen";
import OrdersScreen from "../screens/OrdersScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import TasksScreen from "../screens/TasksScreen";
import InventoryScreen from "../screens/InventoryScreen";
import MessagingScreen from "../screens/MessagingScreen";

import {
  getCurrentSession,
  getCurrentUserProfile,
  signOut,
} from "../services/auth";
import { supabase } from "../services/supabase";

const Stack = createNativeStackNavigator();

const darkHeaderOptions = {
  headerStyle: {
    backgroundColor: "#070B14",
  },
  headerTintColor: "#F8FAFF",
  headerShadowVisible: false,
  headerTitleStyle: {
    fontWeight: "800",
  },
  headerBackTitleVisible: false,
};

export default function AppNavigator() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const p = await getCurrentUserProfile();
    setProfile(p);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const currentSession = await getCurrentSession();
        if (!mounted) return;

        setSession(currentSession);

        if (currentSession) {
          await loadProfile();
        }
      } catch (err) {
        console.warn("init auth error:", err);
      } finally {
        if (mounted) setBooting(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);

      if (nextSession) {
        await loadProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const currentSession = await getCurrentSession();
    setSession(currentSession);
    await loadProfile();
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
    setProfile(null);
  };

  if (booting) return null;

  return (
      <Stack.Navigator screenOptions={darkHeaderOptions}>
        {!session || !profile ? (
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
        ) : (
            <>
              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => (
                    <HomeScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                        onLogout={handleLogout}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="MemberChat"
                  options={{ title: "Page Member" }}
              >
                {(props) => <MemberChatScreen {...props} />}
              </Stack.Screen>

              <Stack.Screen
                  name="PingInbox"
                  options={{ title: "Ping Inbox" }}
              >
                {(props) => (
                    <PingInboxScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="Orders"
                  options={{ title: "Orders" }}
              >
                {(props) => <OrdersScreen {...props} />}
              </Stack.Screen>

              <Stack.Screen
                  name="Settings"
                  options={{ title: "Settings" }}
              >
                {(props) => (
                    <SettingsScreen
                        {...props}
                        role={profile.role}
                        onLogout={handleLogout}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="Schedule"
                  options={{ title: "Schedule" }}
              >
                {(props) => (
                    <ScheduleScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="Tasks"
                  options={{ title: "Tasks" }}
              >
                {(props) => (
                    <TasksScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="Inventory"
                  options={{ title: "Inventory" }}
              >
                {(props) => (
                    <InventoryScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                    />
                )}
              </Stack.Screen>

              <Stack.Screen
                  name="Messaging"
                  options={{ title: "Announcements" }}
              >
                {(props) => (
                    <MessagingScreen
                        {...props}
                        role={profile.role}
                        user={profile}
                    />
                )}
              </Stack.Screen>
            </>
        )}
      </Stack.Navigator>
  );
}