import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getItem, setItem } from "../services/storage";
import { days, roles, seed } from "../data/seed";
import { theme } from "../theme/theme";

const STORAGE_KEY = "scheduleData";

function makeId(prefix = "s") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function ScheduleScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    const [day, setDay] = useState("All");
    const [jobRole, setJobRole] = useState("All");
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

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
            setItems((prev) =>
                prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x))
            );
        } else {
            setItems((prev) => [{ id: makeId("s"), ...cleaned }, ...prev]);
        }
        setModalOpen(false);
    };

    const remove = (id) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

    if (booting) return null;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                        fontSize: 28,
                        fontWeight: "900",
                        marginBottom: 6,
                    }}
                >
                    Schedule
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        marginBottom: 18,
                        fontSize: 14,
                    }}
                >
                    {isManager
                        ? "Manage shifts, coverage, and staffing."
                        : "View shifts, roles, and who is on the floor."}
                </Text>

                {/* Search */}
                <View
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 16,
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color={theme.colors.muted}
                    />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search person, role, notes..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                        }}
                    />
                </View>

                <SectionTitle title="Day" />
                <ChipRow options={days} value={day} onChange={setDay} />

                <View style={{ height: 14 }} />

                <SectionTitle title="Role" />
                <ChipRow options={roles} value={jobRole} onChange={setJobRole} />

                {isManager ? (
                    <Pressable
                        onPress={openAdd}
                        style={({ pressed }) => ({
                            marginTop: 18,
                            backgroundColor: theme.colors.accent,
                            borderRadius: theme.radius.md,
                            paddingVertical: 14,
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text style={{ color: "#fff", fontWeight: "900" }}>+ Add Shift</Text>
                    </Pressable>
                ) : null}

                <View style={{ marginTop: 18, gap: 12 }}>
                    {filtered.map((item) => (
                        <ShiftCard
                            key={item.id}
                            item={item}
                            isManager={isManager}
                            onEdit={() => openEdit(item)}
                            onDelete={() => remove(item.id)}
                        />
                    ))}

                    {filtered.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: theme.colors.surface,
                                borderRadius: theme.radius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: 18,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: theme.colors.muted }}>
                                No shifts match your filters.
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setModalOpen(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.surfaceStrong,
                            borderTopLeftRadius: theme.radius.xl,
                            borderTopRightRadius: theme.radius.xl,
                            padding: 18,
                            borderTopWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontSize: 20,
                                fontWeight: "900",
                                marginBottom: 14,
                            }}
                        >
                            {editing ? "Edit Shift" : "Add Shift"}
                        </Text>

                        <SectionTitle title="Day" compact />
                        <ChipRow
                            options={days.filter((d) => d !== "All")}
                            value={fDay}
                            onChange={setFDay}
                        />

                        <SectionTitle title="Time (24h)" compact />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <StyledInput
                                value={fStart}
                                onChangeText={setFStart}
                                placeholder="09:00"
                                flex
                            />
                            <StyledInput
                                value={fEnd}
                                onChangeText={setFEnd}
                                placeholder="17:00"
                                flex
                            />
                        </View>

                        <SectionTitle title="Person" compact />
                        <StyledInput
                            value={fPerson}
                            onChangeText={setFPerson}
                            placeholder="Ava"
                        />

                        <SectionTitle title="Role" compact />
                        <ChipRow
                            options={roles.filter((r) => r !== "All")}
                            value={fRole}
                            onChange={setFRole}
                        />

                        <SectionTitle title="Notes" compact />
                        <StyledInput
                            value={fNotes}
                            onChangeText={setFNotes}
                            placeholder="Optional notes..."
                        />

                        <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
                            <Pressable
                                onPress={() => setModalOpen(false)}
                                style={({ pressed }) => ({
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: theme.radius.md,
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    alignItems: "center",
                                    transform: [{ scale: pressed ? 0.985 : 1 }],
                                })}
                            >
                                <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={save}
                                style={({ pressed }) => ({
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: theme.radius.md,
                                    backgroundColor: theme.colors.accent,
                                    alignItems: "center",
                                    transform: [{ scale: pressed ? 0.985 : 1 }],
                                })}
                            >
                                <Text style={{ color: "#fff", fontWeight: "900" }}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function SectionTitle({ title, compact = false }) {
    return (
        <Text
            style={{
                color: theme.colors.text,
                fontSize: compact ? 15 : 17,
                fontWeight: "800",
                marginBottom: 10,
                marginTop: compact ? 14 : 0,
            }}
        >
            {title}
        </Text>
    );
}

function StyledInput({ value, onChangeText, placeholder, flex = false }) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.muted}
            style={{
                flex: flex ? 1 : undefined,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                paddingHorizontal: 14,
                paddingVertical: 12,
            }}
        />
    );
}

function ChipRow({ options, value, onChange }) {
    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {options.map((opt) => {
                const selected = opt === value;
                return (
                    <Pressable
                        key={opt}
                        onPress={() => onChange(opt)}
                        style={({ pressed }) => ({
                            paddingVertical: 9,
                            paddingHorizontal: 14,
                            borderRadius: theme.radius.pill,
                            borderWidth: 1,
                            borderColor: selected
                                ? "rgba(124,92,255,0.45)"
                                : theme.colors.border,
                            backgroundColor: selected
                                ? "rgba(124,92,255,0.16)"
                                : "rgba(255,255,255,0.04)",
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        })}
                    >
                        <Text
                            style={{
                                color: selected ? theme.colors.text : theme.colors.muted,
                                fontWeight: "700",
                            }}
                        >
                            {opt}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function ShiftCard({ item, isManager, onEdit, onDelete }) {
    const roleColor = getRoleColor(item.role);

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontSize: 18,
                            fontWeight: "900",
                        }}
                    >
                        {item.person}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 4,
                        }}
                    >
                        {item.day} • {item.start} – {item.end}
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: theme.radius.pill,
                        backgroundColor: roleColor.bg,
                        borderWidth: 1,
                        borderColor: roleColor.border,
                    }}
                >
                    <Text style={{ color: roleColor.text, fontWeight: "800" }}>
                        {item.role}
                    </Text>
                </View>
            </View>

            {!!item.notes ? (
                <Text
                    style={{
                        color: theme.colors.muted,
                        marginTop: 12,
                        lineHeight: 20,
                    }}
                >
                    {item.notes}
                </Text>
            ) : null}

            {isManager ? (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                    <Pressable
                        onPress={onEdit}
                        style={({ pressed }) => ({
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: theme.radius.md,
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                            Edit
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onDelete}
                        style={({ pressed }) => ({
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: theme.radius.md,
                            backgroundColor: "rgba(255,92,122,0.14)",
                            borderWidth: 1,
                            borderColor: "rgba(255,92,122,0.35)",
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text style={{ color: theme.colors.danger, fontWeight: "900" }}>
                            Delete
                        </Text>
                    </Pressable>
                </View>
            ) : null}
        </View>
    );
}

function getRoleColor(role) {
    const r = role?.toLowerCase() || "";

    if (r.includes("security")) {
        return {
            bg: "rgba(255,92,122,0.14)",
            border: "rgba(255,92,122,0.35)",
            text: theme.colors.danger,
        };
    }

    if (r.includes("bartender")) {
        return {
            bg: "rgba(76,201,240,0.14)",
            border: "rgba(76,201,240,0.35)",
            text: theme.colors.accent2,
        };
    }

    if (r.includes("host")) {
        return {
            bg: "rgba(255,184,77,0.14)",
            border: "rgba(255,184,77,0.35)",
            text: theme.colors.warning,
        };
    }

    return {
        bg: "rgba(124,92,255,0.14)",
        border: "rgba(124,92,255,0.35)",
        text: theme.colors.accent,
    };
}