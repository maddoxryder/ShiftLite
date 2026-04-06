import { Vibration } from "react-native";
import { Audio } from "expo-av";

// vibration patterns (ms)
const patterns = {
    default: [0, 200],
    urgent: [0, 300, 150, 300],
    security: [0, 500, 200, 500],
    subtle: [0, 100],
};

// map ping types → behavior
const typeMap = {
    security: "security",
    "table-check": "subtle",
    "bring-item": "default",
    "come-here": "default",
    custom: "default",
};

// load sounds
const sounds = {
    default: require("../../assets/sounds/ping.mp3"),
    urgent: require("../../assets/sounds/urgent.mp3"),
    subtle: require("../../assets/sounds/subtle.mp3"),
};

export async function triggerPingFeedback(type = "default") {
    try {
        const mapped = typeMap[type] || "default";

        // VIBRATION
        Vibration.vibrate(patterns[mapped] || patterns.default);

        // SOUND
        const { sound } = await Audio.Sound.createAsync(
            sounds[mapped] || sounds.default
        );

        await sound.playAsync();

        // unload after playing
        setTimeout(() => {
            sound.unloadAsync();
        }, 3000);
    } catch (err) {
        console.warn("ping feedback error:", err);
    }
}