import { supabase } from "./supabase";
import { getCurrentUserProfile } from "./auth";

export async function sendPingToUser({ toUserId, message }) {
    const currentUser = await getCurrentUserProfile();

    if (!currentUser) {
        throw new Error("No logged in user found.");
    }

    const { data: targetUser, error: targetError } = await supabase
        .from("app_users")
        .select("id, username, display_name")
        .eq("id", toUserId)
        .single();

    if (targetError) throw targetError;

    const { data, error } = await supabase.from("pings").insert({
        from_user_id: currentUser.id,
        to_user_id: targetUser.id,
        from_user: currentUser.username,
        to_user: targetUser.username,
        message,
        acknowledged: false,
        sent: false,
    }).select().single();

    if (error) throw error;
    return data;
}

export async function getInboxPings() {
    const currentUser = await getCurrentUserProfile();

    if (!currentUser) {
        throw new Error("No logged in user found.");
    }

    const { data, error } = await supabase
        .from("pings")
        .select(`
      id,
      message,
      acknowledged,
      sent,
      created_at,
      from_user,
      to_user,
      from_user_id,
      to_user_id
    `)
        .eq("to_user_id", currentUser.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getSentPings() {
    const currentUser = await getCurrentUserProfile();

    if (!currentUser) {
        throw new Error("No logged in user found.");
    }

    const { data, error } = await supabase
        .from("pings")
        .select(`
      id,
      message,
      acknowledged,
      sent,
      created_at,
      from_user,
      to_user,
      from_user_id,
      to_user_id
    `)
        .eq("from_user_id", currentUser.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function acknowledgePing(id) {
    const { error } = await supabase
        .from("pings")
        .update({ acknowledged: true })
        .eq("id", id);

    if (error) throw error;
}