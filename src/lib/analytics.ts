import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "kw_session_id";

function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export async function trackEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      metadata: metadata as never,
    });
  } catch (error) {
    console.warn("analytics failed", error);
  }
}
