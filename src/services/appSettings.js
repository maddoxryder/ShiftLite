import { getItem, setItem } from "./storage";

const SETTINGS_KEY = "appSettings";

const defaultSettings = {
    pushEnabled: true,
    soundEnabled: true,
    darkMode: true,
    lowStockAlerts: true,
    shiftReminders: true,
    announcementsEnabled: true,
    autoMarkAnnouncementsRead: false,
    compactMode: false,
};

export async function loadAppSettings() {
    const saved = await getItem(SETTINGS_KEY, null);
    return { ...defaultSettings, ...(saved || {}) };
}

export async function saveAppSettings(nextSettings) {
    await setItem(SETTINGS_KEY, nextSettings);
    return nextSettings;
}

export { defaultSettings };