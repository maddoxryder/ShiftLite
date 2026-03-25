import { getItem, setItem } from "./storage";

const STORAGE_KEY = "pingData";

export async function getPings() {
    return (await getItem(STORAGE_KEY, [])) || [];
}

export async function savePings(pings) {
    await setItem(STORAGE_KEY, pings);
}

export async function addPing(ping) {
    const current = await getPings();
    const updated = [ping, ...current];
    await savePings(updated);
    return updated;
}

export async function acknowledgePing(id) {
    const current = await getPings();
    const updated = current.map((p) =>
        p.id === id ? { ...p, unread: false, acknowledged: true } : p
    );
    await savePings(updated);
    return updated;
}

export async function markPingRead(id) {
    const current = await getPings();
    const updated = current.map((p) =>
        p.id === id ? { ...p, unread: false } : p
    );
    await savePings(updated);
    return updated;
}

export async function clearPings() {
    await savePings([]);
}