import { supabase } from "../services/supabase";
import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { roles } from "../data/seed";
import { theme } from "../theme/theme";

const priorities = ["All", "low", "medium", "high"];
const statuses = ["All", "open", "in progress", "complete"];

function makeId(prefix = "t") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function TasksScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    const [search, setSearch] = useState("");
    const [jobRole, setJobRole] = useState("All");
    const [priority, setPriority] = useState("All");
    const [status, setStatus] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [fTitle, setFTitle] = useState("");
    const [fAssignedTo, setFAssignedTo] = useState("server");
    const [fPriority, setFPriority] = useState("medium");
    const [fStatus, setFStatus] = useState("open");
    const [fNotes, setFNotes] = useState("");

    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*");

                if (error) {
                console.log("Fetch tasks error:", error);
                } else {
                setItems(data || []);
                }
            
            setBooting(false);
        })();
    }, []);


    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchRole = jobRole === "All" ? true : item.assignedto === jobRole;
            const matchPriority = priority === "All" ? true : item.priority === priority;
            const matchStatus = status === "All" ? true : item.status === status;
            const matchSearch =
                !q ||
                (item.title ?? "").toLowerCase().includes(q) ||
                (item.assignedto ?? "").toLowerCase().includes(q) ||
                (item.priority ?? "").toLowerCase().includes(q) ||
                (item.status ?? "").toLowerCase().includes(q) ||
                (item.notes ?? "").toLowerCase().includes(q);

            return matchRole && matchPriority && matchStatus && matchSearch;
        });
    }, [items, search, jobRole, priority, status]);

    const summary = useMemo(() => {
        const total = items.length;
        const open = items.filter((x) => x.status === "open").length;
        const inProgress = items.filter((x) => x.status === "in progress").length;
        const complete = items.filter((x) => x.status === "complete").length;
        return { total, open, inProgress, complete };
    }, [items]);

    const openAdd = () => {
        setEditing(null);
        setFTitle("");
        setFAssignedTo("server");
        setFPriority("medium");
        setFStatus("open");
        setFNotes("");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFTitle(item.title ?? "");
        setFAssignedTo(item.assignedto ?? "server");
        setFPriority(item.priority ?? "medium");
        setFStatus(item.status ?? "open");
        setFNotes(item.notes ?? "");
        setModalOpen(true);
    };

    const save = async () => {
        const cleaned = {
            title: fTitle.trim() || "New Task",
            assignedto: fAssignedTo,
            priority: fPriority,
            status: fStatus,
            notes: fNotes,
        };

        if (editing) {
            await supabase
            .from("tasks")
            .update(cleaned)
            .eq("id", editing.id);
        } else {
            await supabase
            .from("tasks")
            .insert([cleaned]);
        }

        const { data } = await supabase.from("tasks").select("*");
        setItems(data || []);

        setModalOpen(false);
        };

    const remove = async (id) => {
        await supabase.from("tasks").delete().eq("id", id);

        const { data } = await supabase.from("tasks").select("*");
        setItems(data || []);
    };

    const markComplete = async (id) => {
        await supabase
            .from("tasks")
            .update({ status: "complete" })
            .eq("id", id);

        const { data } = await supabase.from("tasks").select("*");
        setItems(data || []);
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
                    Tasks
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    {isManager
                        ? "Create, assign, and track operational tasks."
                        : "View your tasks and update completion status."}
                </Text>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <SummaryCard label="Total" value={summary.total} />
                    <SummaryCard label="Open" value={summary.open} accent="danger" />
                    <SummaryCard label="Active" value={summary.inProgress} />
                    <SummaryCard label="Done" value={summary.complete} accent="success" />
                </View>

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
                        placeholder="Search tasks..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                        }}
                    />
                </View>

                <SectionTitle title="Assigned Role" />
                <ChipRow options={roles} value={jobRole} onChange={setJobRole} />

                <View style={{ height: 14 }} />

                <SectionTitle title="Priority" />
                <ChipRow options={priorities} value={priority} onChange={setPriority} />

                <View style={{ height: 14 }} />

                <SectionTitle title="Status" />
                <ChipRow options={statuses} value={status} onChange={setStatus} />

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
                        <Text style={{ color: "#fff", fontWeight: "900" }}>+ Add Task</Text>
                    </Pressable>
                ) : null}

                <View style={{ marginTop: 18, gap: 12 }}>
                    {filtered.map((item) => (
                        <TaskCard
                            key={item.id}
                            item={item}
                            isManager={isManager}
                            onEdit={() => openEdit(item)}
                            onDelete={() => remove(item.id)}
                            onComplete={() => markComplete(item.id)}
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
                                No tasks match your filters.
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
                            {editing ? "Edit Task" : "Add Task"}
                        </Text>

                        <SectionTitle title="Task Title" compact />
                        <StyledInput
                            value={fTitle}
                            onChangeText={setFTitle}
                            placeholder="Restock bar fridge"
                        />

                        <SectionTitle title="Assigned Role" compact />
                        <ChipRow
                            options={roles.filter((r) => r !== "All")}
                            value={fAssignedTo}
                            onChange={setFAssignedTo}
                        />

                        <SectionTitle title="Priority" compact />
                        <ChipRow
                            options={priorities.filter((p) => p !== "All")}
                            value={fPriority}
                            onChange={setFPriority}
                        />

                        <SectionTitle title="Status" compact />
                        <ChipRow
                            options={statuses.filter((s) => s !== "All")}
                            value={fStatus}
                            onChange={setFStatus}
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

function StyledInput({ value, onChangeText, placeholder }) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.muted}
            style={{
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

function SummaryCard({ label, value, accent }) {
    const color =
        accent === "danger"
            ? theme.colors.danger
            : accent === "success"
                ? theme.colors.success
                : theme.colors.accent;

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 14,
            }}
        >
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
            <Text
                style={{
                    color,
                    fontSize: 22,
                    fontWeight: "900",
                    marginTop: 4,
                }}
            >
                {value}
            </Text>
        </View>
    );
}

function TaskCard({ item, isManager, onEdit, onDelete, onComplete }) {
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
                        {item.title}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 6,
                            lineHeight: 20,
                        }}
                    >
                        Assigned to: {item.assignedto}
                    </Text>

                    {!!item.notes && (
                        <Text
                            style={{
                                color: theme.colors.muted,
                                marginTop: 6,
                                lineHeight: 20,
                            }}
                        >
                            {item.notes}
                        </Text>
                    )}
                </View>

                <View style={{ alignItems: "flex-end", gap: 8 }}>
                    <PriorityPill priority={item.priority} />
                    <StatusPill status={item.status} />
                </View>
            </View>

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
            ) : item.status !== "complete" ? (
                <Pressable
                    onPress={onComplete}
                    style={({ pressed }) => ({
                        marginTop: 14,
                        backgroundColor: theme.colors.accent,
                        borderRadius: theme.radius.md,
                        paddingVertical: 13,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.985 : 1 }],
                    })}
                >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                        Mark Complete
                    </Text>
                </Pressable>
            ) : (
                <View
                    style={{
                        marginTop: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={20}
                        color={theme.colors.success}
                    />
                    <Text style={{ color: theme.colors.success, fontWeight: "800" }}>
                        Completed
                    </Text>
                </View>
            )}
        </View>
    );
}

function PriorityPill({ priority }) {
    const color =
        priority === "high"
            ? theme.colors.danger
            : priority === "medium"
                ? theme.colors.warning
                : theme.colors.accent2;

    const bg =
        priority === "high"
            ? "rgba(255,92,122,0.14)"
            : priority === "medium"
                ? "rgba(255,184,77,0.14)"
                : "rgba(76,201,240,0.14)";

    const border =
        priority === "high"
            ? "rgba(255,92,122,0.35)"
            : priority === "medium"
                ? "rgba(255,184,77,0.35)"
                : "rgba(76,201,240,0.35)";

    return (
        <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: border,
            }}
        >
            <Text style={{ color, fontWeight: "800" }}>{priority}</Text>
        </View>
    );
}

function StatusPill({ status }) {
    const color =
        status === "complete"
            ? theme.colors.success
            : status === "in progress"
                ? theme.colors.accent
                : theme.colors.danger;

    const bg =
        status === "complete"
            ? "rgba(61,220,151,0.14)"
            : status === "in progress"
                ? "rgba(124,92,255,0.14)"
                : "rgba(255,92,122,0.14)";

    const border =
        status === "complete"
            ? "rgba(61,220,151,0.35)"
            : status === "in progress"
                ? "rgba(124,92,255,0.35)"
                : "rgba(255,92,122,0.35)";

    return (
        <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: border,
            }}
        >
            <Text style={{ color, fontWeight: "800" }}>{status}</Text>
        </View>
    );
}