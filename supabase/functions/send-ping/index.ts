// supabase/functions/send-ping/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: {
    id: string;
    to_user?: string;
    message?: string;
  };
  old_record?: Record<string, unknown> | null;
};

Deno.serve(async (req: Request) => {
  try {
    const body: WebhookPayload = await req.json();
    const record = body?.record;

    if (!record) {
      return new Response(
          JSON.stringify({ error: "No record found in webhook payload" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
      );
    }

    const pingId = record.id;
    const toUser = record.to_user;
    const message = record.message;

    if (!pingId || !toUser || !message) {
      return new Response(
          JSON.stringify({ error: "Missing ping id, to_user, or message" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
      );
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: tokens, error: tokenError } = await supabase
        .from("device_tokens")
        .select("expo_push_token")
        .eq("username", toUser);

    if (tokenError) {
      return new Response(
          JSON.stringify({ error: `Token lookup failed: ${tokenError.message}` }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
      );
    }

    if (!tokens || tokens.length === 0) {
      await supabase.from("pings").update({ sent: false }).eq("id", pingId);

      return new Response(
          JSON.stringify({
            ok: false,
            message: "No device token found for user",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
      );
    }

    const pushMessages = tokens
        .map((t: { expo_push_token: string | null }) => t.expo_push_token)
        .filter((token): token is string => Boolean(token))
        .map((token: string) => ({
          to: token,
          sound: "default",
          title: "ShiftLite Ping 🚨",
          body: message,
          data: {
            type: "ping",
            pingId,
            toUser,
          },
        }));

    const expoRes = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
      },
      body: JSON.stringify(
          pushMessages.length === 1 ? pushMessages[0] : pushMessages
      ),
    });

    const expoJson = await expoRes.json();

    await supabase.from("pings").update({ sent: true }).eq("id", pingId);

    return new Response(
        JSON.stringify({
          ok: true,
          expo: expoJson,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
    );
  } catch (err) {
    return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
    );
  }
});