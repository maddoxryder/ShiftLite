import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem(key, fallback = null) {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function setItem(key, value) {
  const raw = typeof value === "string" ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, raw);
}

export async function removeItem(key) {
  await AsyncStorage.removeItem(key);
}