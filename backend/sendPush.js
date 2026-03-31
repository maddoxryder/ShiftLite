import fetch from "node-fetch";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

async function sendPush(token, message) {
    await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: token,
            sound: "default",
            title: "ShiftLite Ping 🚨",
            body: message,
        }),
    });
}

async function processPings() {
    const { data: pings } = await supabase
        .from("pings")
        .select("*")
        .eq("acknowledged", false);

    for (const ping of pings) {
        const { data: tokens } = await supabase
            .from("device_tokens")
            .select("*")
            .eq("username", ping.to_user);

        for (const t of tokens) {
            await sendPush(t.expo_push_token, ping.message);
        }

        await supabase
            .from("pings")
            .update({ acknowledged: true })
            .eq("id", ping.id);
    }
}

// Run every 5 seconds
setInterval(processPings, 5000);

console.log("🚀 Push server running...");