import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ncbneslsqrctgopfktdc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jYm5lc2xzcXJjdGdvcGZrdGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTc1MDQsImV4cCI6MjA4OTk3MzUwNH0.PFKLOuSRnaObK7ZQN48mWKqU8xhVvj5-jEI7b0ewkaw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});