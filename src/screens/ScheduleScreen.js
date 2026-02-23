import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Modal } from "react-native";
import { getItem, setItem } from "../services/storage";
import { days, roles, seed } from "../data/seed";

const STORAGE_KEY = "scheduleData";

function makeId(prefix = "s") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function ScheduleScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    // filters (staff + manager both)
    const [day, setDay] = useState("All");
    const [jobRole, setJobRole] = useState("All");
    const [search, setSearch] = useState("");

    // modal editing (manager only)
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // item or null for add

    // form state
    const [fDay, setFDay] = useState("Mon");
    const [fStart, setFStart] = useState("09:00");
    const [fEnd, setFEnd] = useState("17:00");
    const [fPerson, setFPerson] = useState("");
    const [fRole, setFRole] = useState("server");
    const [fNotes, setFNotes] = useState("");

    useEffect(() => {
        (async () => {
            const saved = await getItem(STORAGE_KEY, null);
            setItems(saved ?? seed.schedule);
            setBooting(false);
        })();
    }, []);

    useEffect(() => {
        if (booting) return;
        setItem(STORAGE_KEY, items);
    }, [items, booting]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((s) => {
            const matchDay = day === "All" ? true : s.day === day;
            const matchRole = jobRole === "All" ? true : s.role === jobRole;
            const matchSearch =
                !q ||
                s.person.toLowerCase().includes(q) ||
                s.role.toLowerCase().includes(q) ||
                s.day.toLowerCase().includes(q) ||
                `${s.start}-${s.end}`.toLowerCase().includes(q) ||
                (s.notes ?? "").toLowerCase().includes(q);

            return matchDay && matchRole && matchSearch;
        });
    }, [items, day, jobRole, search]);

    const openAdd = () => {
        setEditing(null);
        setFDay("Mon");
        setFStart("09:00");
        setFEnd("17:00");
        setFPerson("");
        setFRole("server");
        setFNotes("");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFDay(item.day);
        setFStart(item.start);
        setFEnd(item.end);
        setFPerson(item.person);
        setFRole(item.role);
        setFNotes(item.notes ?? "");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            day: fDay,
            start: fStart,
            end: fEnd,
            person: fPerson.trim() || "Unassigned",
            role: fRole,
            notes: fNotes,
        };

        if (editing) {
            setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x)));
        } else {
            setItems((prev) => [{ id: makeId("s"), ...cleaned }, ...prev]);
        }
        setModalOpen(false);
    };

    const remove = (id) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

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

    if (booting) return null;

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F6F7FF" }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>
                Schedule {isManager ? "(Manager)" : "(Staff)"}
            </Text>

            {/* search */}
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search person, role, notes..."
                style={{
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.12)",
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: "#fff",
                }}
            />

            <Text style={{ fontWeight: "800" }}>Day</Text>
            <ChipRow options={days} value={day} onChange={setDay} />

            <Text style={{ fontWeight: "800" }}>Role</Text>
            <ChipRow options={roles} value={jobRole} onChange={setJobRole} />

            {isManager ? (
                <Pressable
                    onPress={openAdd}
                    style={{
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: "#111",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>+ Add Shift</Text>
                </Pressable>
            ) : null}

            <FlatList
                data={filtered}
                keyExtractor={(x) => x.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 14,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.06)",
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>
                            {item.day} • {item.start}–{item.end}
                        </Text>
                        <Text style={{ marginTop: 6, fontWeight: "800" }}>{item.person}</Text>
                        <Text style={{ opacity: 0.7 }}>{item.role}</Text>
                        {!!item.notes && <Text style={{ marginTop: 6, opacity: 0.75 }}>{item.notes}</Text>}

                        {isManager ? (
                            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                                <Pressable
                                    onPress={() => openEdit(item)}
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: "rgba(17,17,17,0.08)",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontWeight: "800" }}>Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => remove(item.id)}
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: "rgba(220,0,0,0.10)",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontWeight: "900", color: "crimson" }}>Delete</Text>
                                </Pressable>
                            </View>
                        ) : null}
                    </View>
                )}
            />

            {/* Manager edit modal */}
            <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
                    <View style={{ backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, gap: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "900" }}>{editing ? "Edit Shift" : "Add Shift"}</Text>

                        <Text style={{ fontWeight: "800" }}>Day</Text>
                        <ChipRow options={days.filter((d) => d !== "All")} value={fDay} onChange={setFDay} />

                        <Text style={{ fontWeight: "800" }}>Time (24h)</Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TextInput value={fStart} onChangeText={setFStart} placeholder="09:00" style={{ flex: 1, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />
                            <TextInput value={fEnd} onChangeText={setFEnd} placeholder="17:00" style={{ flex: 1, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />
                        </View>

                        <Text style={{ fontWeight: "800" }}>Person</Text>
                        <TextInput value={fPerson} onChangeText={setFPerson} placeholder="Ava" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

                        <Text style={{ fontWeight: "800" }}>Role</Text>
                        <ChipRow options={roles.filter((r) => r !== "All")} value={fRole} onChange={setFRole} />

                        <Text style={{ fontWeight: "800" }}>Notes</Text>
                        <TextInput value={fNotes} onChangeText={setFNotes} placeholder="Optional notes..." style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

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
