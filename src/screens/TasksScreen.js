import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Modal } from "react-native";
import { getItem, setItem } from "../services/storage";
import { seed } from "../data/seed";

const STORAGE_KEY = "tasksData";

const statuses = ["All", "open", "in-progress", "done"];
const priorities = ["All", "low", "medium", "high"];

function makeId(prefix = "t") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function TasksScreen({ role }) {
    const isManager = role === "manager";

    const [booting, setBooting] = useState(true);
    const [items, setItems] = useState([]);

    // filters
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [search, setSearch] = useState("");

    // modal (manager)
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // form
    const [fTitle, setFTitle] = useState("");
    const [fAssignee, setFAssignee] = useState("");
    const [fStatus, setFStatus] = useState("open");
    const [fPriority, setFPriority] = useState("low");
    const [fNotes, setFNotes] = useState("");

    useEffect(() => {
        (async () => {
            const saved = await getItem(STORAGE_KEY, null);
            setItems(saved ?? seed.tasks ?? []);
            setBooting(false);
        })();
    }, []);

    useEffect(() => {
        if (booting) return;
        setItem(STORAGE_KEY, items);
    }, [items, booting]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((t) => {
            const matchStatus = status === "All" ? true : t.status === status;
            const matchPriority = priority === "All" ? true : t.priority === priority;
            const matchSearch =
                !q ||
                (t.title ?? "").toLowerCase().includes(q) ||
                (t.assignee ?? "").toLowerCase().includes(q) ||
                (t.notes ?? "").toLowerCase().includes(q);

            return matchStatus && matchPriority && matchSearch;
        });
    }, [items, status, priority, search]);

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

    const openAdd = () => {
        setEditing(null);
        setFTitle("");
        setFAssignee("");
        setFStatus("open");
        setFPriority("low");
        setFNotes("");
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditing(task);
        setFTitle(task.title ?? "");
        setFAssignee(task.assignee ?? "");
        setFStatus(task.status ?? "open");
        setFPriority(task.priority ?? "low");
        setFNotes(task.notes ?? "");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            title: (fTitle.trim() || "untitled task").replace(/\s+/g, " "),
            assignee: (fAssignee.trim() || "unassigned").replace(/\s+/g, " "),
            status: fStatus,
            priority: fPriority,
            notes: fNotes.trim(),
        };

        if (editing) {
            setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x)));
        } else {
            setItems((prev) => [{ id: makeId("t"), ...cleaned }, ...prev]);
        }
        setModalOpen(false);
    };

    const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const cycleStatus = (id) => {
        // staff-friendly: tap to cycle open -> in-progress -> done
        const order = ["open", "in-progress", "done"];
        setItems((prev) =>
            prev.map((x) => {
                if (x.id !== id) return x;
                const idx = Math.max(0, order.indexOf(x.status));
                return { ...x, status: order[Math.min(order.length - 1, idx + 1)] };
            })
        );
    };

    if (booting) return null;

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F6F7FF" }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>
                Tasks {isManager ? "(Manager)" : "(Staff)"}
            </Text>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search task, assignee, notes..."
                style={{
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.12)",
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: "#fff",
                }}
            />

            <Text style={{ fontWeight: "800" }}>Status</Text>
            <ChipRow options={statuses} value={status} onChange={setStatus} />

            <Text style={{ fontWeight: "800" }}>Priority</Text>
            <ChipRow options={priorities} value={priority} onChange={setPriority} />

            {isManager ? (
                <Pressable
                    onPress={openAdd}
                    style={{ padding: 14, borderRadius: 12, backgroundColor: "#111", alignItems: "center" }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>+ Add Task</Text>
                </Pressable>
            ) : (
                <Text style={{ opacity: 0.7 }}>
                    Tip: tap a task to move it from open → in-progress → done.
                </Text>
            )}

            <FlatList
                data={filtered}
                keyExtractor={(x) => x.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => (isManager ? openEdit(item) : cycleStatus(item.id))}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.06)",
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>{item.title}</Text>
                        <Text style={{ marginTop: 6, opacity: 0.75 }}>
                            {item.assignee} • {item.status} • {item.priority}
                        </Text>
                        {!!item.notes && <Text style={{ marginTop: 8, opacity: 0.75 }}>{item.notes}</Text>}

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
                        ) : null}
                    </Pressable>
                )}
            />

            {/* manager modal */}
            <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
                    <View style={{ backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, gap: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "900" }}>{editing ? "Edit Task" : "Add Task"}</Text>

                        <Text style={{ fontWeight: "800" }}>Title</Text>
                        <TextInput value={fTitle} onChangeText={setFTitle} placeholder="clean bar" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

                        <Text style={{ fontWeight: "800" }}>Assignee</Text>
                        <TextInput value={fAssignee} onChangeText={setFAssignee} placeholder="Ava" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

                        <Text style={{ fontWeight: "800" }}>Status</Text>
                        <ChipRow options={statuses.filter((x) => x !== "All")} value={fStatus} onChange={setFStatus} />

                        <Text style={{ fontWeight: "800" }}>Priority</Text>
                        <ChipRow options={priorities.filter((x) => x !== "All")} value={fPriority} onChange={setFPriority} />

                        <Text style={{ fontWeight: "800" }}>Notes (optional)</Text>
                        <TextInput value={fNotes} onChangeText={setFNotes} placeholder="extra details..." style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

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
