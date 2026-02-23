import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Modal, Switch } from "react-native";
import { getItem, setItem } from "../services/storage";
import { seed } from "../data/seed";

const STORAGE_KEY = "messagesData";

const channels = ["All", "announcements", "ops"];

function makeId(prefix = "m") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function MessagingScreen({ role }) {
    const isManager = role === "manager";

    const [booting, setBooting] = useState(true);
    const [items, setItems] = useState([]);

    // filters
    const [channel, setChannel] = useState("All");
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [search, setSearch] = useState("");

    // modal (manager)
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // form
    const [fTitle, setFTitle] = useState("");
    const [fBody, setFBody] = useState("");
    const [fChannel, setFChannel] = useState("announcements");

    useEffect(() => {
        (async () => {
            const saved = await getItem(STORAGE_KEY, null);
            setItems(saved ?? seed.messages ?? []);
            setBooting(false);
        })();
    }, []);

    useEffect(() => {
        if (booting) return;
        setItem(STORAGE_KEY, items);
    }, [items, booting]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((m) => {
            const matchChannel = channel === "All" ? true : m.channel === channel;
            const matchUnread = unreadOnly ? !!m.unread : true;
            const matchSearch =
                !q ||
                (m.title ?? "").toLowerCase().includes(q) ||
                (m.body ?? "").toLowerCase().includes(q) ||
                (m.channel ?? "").toLowerCase().includes(q);

            return matchChannel && matchUnread && matchSearch;
        });
    }, [items, channel, unreadOnly, search]);

    const ChipRow = ({ options, value, onChange }) => (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {options.map((opt) => {
                const selected = opt === value;
                return (
                    <Pressable
                        key={opt}
                        onPress={() => onChange(opt)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: selected ? "#111" : "rgba(0,0,0,0.15)",
                            backgroundColor: selected ? "#111" : "rgba(255,255,255,0.65)",
                        }}
                    >
                        <Text style={{ color: selected ? "#fff" : "#111", fontWeight: "700" }}>{opt}</Text>
                    </Pressable>
                );
            })}
        </View>
    );

    const toggleRead = (id) => {
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x))
        );
    };

    const openAdd = () => {
        setEditing(null);
        setFTitle("");
        setFBody("");
        setFChannel("announcements");
        setModalOpen(true);
    };

    const openEdit = (msg) => {
        setEditing(msg);
        setFTitle(msg.title ?? "");
        setFBody(msg.body ?? "");
        setFChannel(msg.channel ?? "announcements");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            title: (fTitle.trim() || "untitled").replace(/\s+/g, " "),
            body: fBody.trim(),
            channel: fChannel,
            unread: true, // new announcements start unread for everyone (local prototype)
        };

        if (editing) {
            setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x)));
        } else {
            setItems((prev) => [{ id: makeId("m"), ...cleaned }, ...prev]);
        }
        setModalOpen(false);
    };

    const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    if (booting) return null;

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F6F7FF" }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>
                Announcements {isManager ? "(Manager)" : "(Staff)"}
            </Text>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search title/body..."
                style={{
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.12)",
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: "#fff",
                }}
            />

            <Text style={{ fontWeight: "800" }}>Channel</Text>
            <ChipRow options={channels} value={channel} onChange={setChannel} />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "800" }}>Unread only</Text>
                <Switch value={unreadOnly} onValueChange={setUnreadOnly} />
            </View>

            {isManager ? (
                <Pressable
                    onPress={openAdd}
                    style={{ padding: 14, borderRadius: 12, backgroundColor: "#111", alignItems: "center" }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>+ New Announcement</Text>
                </Pressable>
            ) : null}

            <FlatList
                data={filtered}
                keyExtractor={(x) => x.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => (isManager ? openEdit(item) : toggleRead(item.id))}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.06)",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                            <Text style={{ fontWeight: "900", flex: 1 }}>{item.title}</Text>
                            {!!item.unread && (
                                <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "rgba(220,0,0,0.12)" }}>
                                    <Text style={{ fontWeight: "900", color: "crimson" }}>NEW</Text>
                                </View>
                            )}
                        </View>

                        <Text style={{ marginTop: 6, opacity: 0.75 }}>{item.channel}</Text>
                        {!!item.body && <Text style={{ marginTop: 10, opacity: 0.85 }}>{item.body}</Text>}

                        {isManager ? (
                            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                                <Pressable
                                    onPress={() => openEdit(item)}
                                    style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(17,17,17,0.08)", alignItems: "center" }}
                                >
                                    <Text style={{ fontWeight: "800" }}>Edit</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => remove(item.id)}
                                    style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(220,0,0,0.10)", alignItems: "center" }}
                                >
                                    <Text style={{ fontWeight: "900", color: "crimson" }}>Delete</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Text style={{ marginTop: 10, opacity: 0.65 }}>
                                Tap to mark as {item.unread ? "read" : "unread"}.
                            </Text>
                        )}
                    </Pressable>
                )}
            />

            {/* manager modal */}
            <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
                    <View style={{ backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, gap: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "900" }}>{editing ? "Edit Announcement" : "New Announcement"}</Text>

                        <Text style={{ fontWeight: "800" }}>Title</Text>
                        <TextInput value={fTitle} onChangeText={setFTitle} placeholder="happy hour" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

                        <Text style={{ fontWeight: "800" }}>Channel</Text>
                        <ChipRow options={channels.filter((c) => c !== "All")} value={fChannel} onChange={setFChannel} />

                        <Text style={{ fontWeight: "800" }}>Body</Text>
                        <TextInput
                            value={fBody}
                            onChangeText={setFBody}
                            placeholder="details..."
                            multiline
                            style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12, minHeight: 90 }}
                        />

                        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                            <Pressable onPress={() => setModalOpen(false)} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.08)", alignItems: "center" }}>
                                <Text style={{ fontWeight: "900" }}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={save} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: "#111", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontWeight: "900" }}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
