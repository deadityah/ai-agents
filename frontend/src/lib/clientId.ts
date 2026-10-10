// Browser client UUID generator and localStorage persistence helper

const CLIENT_ID_KEY = "rp_client_id";

export function getClientId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = window.localStorage.getItem(CLIENT_ID_KEY);
    if (existing && existing.length > 10) {
      return existing;
    }

    // Generate RFC4122 v4 UUID
    const newId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });

    window.localStorage.setItem(CLIENT_ID_KEY, newId);
    return newId;
  } catch {
    return "demo-browser-client-id";
  }
}
