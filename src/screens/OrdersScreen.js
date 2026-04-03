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
import { getItem, setItem } from "../services/storage";
import { theme } from "../theme/theme";

const STORAGE_KEY = "ordersData";

const seedOrders = [
    {
        id: "o1",
        item: "Grey Goose Vodka",
        quantity: 6,
        unit: "bottles",
        supplier: "Premium Spirits Co.",
        priority: "high",
        status: "pending",
        notes: "Needed before Friday service",
    },
    {
        id: "o2",
        item: "Lime Juice",
        quantity: 12,
        unit: "cartons",
        supplier: "Fresh Mix Supply",
        priority: "medium",
        status: "approved",
        notes: "Bar prep restock",
    },
    {
        id: "o3",
        item: "Disposable Gloves",
        quantity: 8,
        unit: "boxes",
        supplier: "Venue Essentials",
        priority: "low",
        status: "delivered",
        notes: "",
    },
];

const priorities = ["All", "low", "medium", "high"];
const statuses = ["All", "pending", "approved", "delivered"];

function makeId(prefix = "o") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function OrdersScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("All");
    const [status, setStatus] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [fItem, setFItem] = useState("");
    const [fQuantity, setFQuantity] = useState("1");
    const [fUnit, setFUnit] = useState("units");
    const [fSupplier, setFSupplier] = useState("");
    const [fPriority, setFPriority] = useState("medium");
    const [fStatus, setFStatus] = useState("pending");
    const [fNotes, setFNotes] = useState("");

    useEffect(() => {
        (async () => {
            const saved = await getItem(STORAGE_KEY, null);
            setItems(saved ?? seedOrders);
            setBooting(false);
        })();
    }, []);

    useEffect(() => {
        if (booting) return;
        setItem(STORAGE_KEY, items);
    }, [items, booting]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchPriority =
                priority === "All" ? true : item.priority === priority;
            const matchStatus = status === "All" ? true : item.status === status;
            const matchSearch =
                !q ||
                (item.item ?? "").toLowerCase().includes(q) ||
                (item.supplier ?? "").toLowerCase().includes(q) ||
                (item.notes ?? "").toLowerCase().includes(q) ||
                (item.unit ?? "").toLowerCase().includes(q);

            return matchPriority && matchStatus && matchSearch;
        });
    }, [items, search, priority, status]);

    const summary = useMemo(() => {
        const total = items.length;
        const pending = items.filter((x) => x.status === "pending").length;
        const approved = items.filter((x) => x.status === "approved").length;
        const delivered = items.filter((x) => x.status === "delivered").length;
        return { total, pending, approved, delivered };
    }, [items]);

    const openAdd = () => {
        setEditing(null);
        setFItem("");
        setFQuantity("1");
        setFUnit("units");
        setFSupplier("");
        setFPriority("medium");
        setFStatus("pending");
        setFNotes("");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFItem(item.item ?? "");
        setFQuantity(String(item.quantity ?? 1));
        setFUnit(item.unit ?? "units");
        setFSupplier(item.supplier ?? "");
        setFPriority(item.priority ?? "medium");
        setFStatus(item.status ?? "pending");
        setFNotes(item.notes ?? "");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            item: fItem.trim() || "New Order",
            quantity: Number(fQuantity) || 1,
            unit: fUnit.trim() || "units",
            supplier: fSupplier.trim() || "Supplier",
            priority: fPriority,
            status: fStatus,
            notes: fNotes.trim(),
        };

        if (editing) {
            setItems((prev) =>
                prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x))
            );
        } else {
            setItems((prev) => [{ id: makeId("o"), ...cleaned }, ...prev]);
        }

        setModalOpen(false);
    };

    const remove = (id) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

    const cycleStatus = (id) => {
        setItems((prev) =>
            prev.map((x) => {
                if (x.id !== id) return x;

                const next =
                    x.status === "pending"
                        ? "approved"
                        : x.status === "approved"
                            ? "delivered"
                            : "delivered";

                return { ...x, status: next };
            })
        );
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
                    Orders
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    {isManager
                        ? "Approve, track, and manage incoming supply orders."
                        : "View and submit supply order requests."}
                </Text>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <SummaryCard label="Total" value={summary.total} />
                    <SummaryCard label="Pending" value={summary.pending} accent="danger" />
                    <SummaryCard label="Approved" value={summary.approved} />
                    <SummaryCard
                        label="Delivered"
                        value={summary.delivered}
                        accent="success"
                    />
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
                        placeholder="Search orders..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                        }}
                    />
                </View>

                <SectionTitle title="Priority" />
                <ChipRow options={priorities} value={priority} onChange={setPriority} />

                <View style={{ height: 14 }} />

                <SectionTitle title="Status" />
                <ChipRow options={statuses} value={status} onChange={setStatus} />

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
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                        + New Order
                    </Text>
                </Pressable>

                <View style={{ marginTop: 18, gap: 12 }}>
                    {filtered.map((item) => (
                        <OrderCard
                            key={item.id}
                            item={item}
                            isManager={isManager}
                            onEdit={() => openEdit(item)}
                            onDelete={() => remove(item.id)}
                            onAdvance={() => cycleStatus(item.id)}
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
                                No orders match your filters.
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
                            {editing ? "Edit Order" : "New Order"}
                        </Text>

                        <SectionTitle title="Item" compact />
                        <StyledInput
                            value={fItem}
                            onChangeText={setFItem}
                            placeholder="Grey Goose Vodka"
                        />

                        <SectionTitle title="Quantity / Unit" compact />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <StyledInput
                                value={fQuantity}
                                onChangeText={setFQuantity}
                                placeholder="6"
                                flex
                                keyboardType="numeric"
                            />
                            <StyledInput
                                value={fUnit}
                                onChangeText={setFUnit}
                                placeholder="bottles"
                                flex
                            />
                        </View>

                        <SectionTitle title="Supplier" compact />
                        <StyledInput
                            value={fSupplier}
                            onChangeText={setFSupplier}
                            placeholder="Premium Spirits Co."
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
                        <TextInput
                            value={fNotes}
                            onChangeText={setFNotes}
                            placeholder="Optional notes..."
                            placeholderTextColor={theme.colors.muted}
                            multiline
                            style={{
                                minHeight: 100,
                                textAlignVertical: "top",
                                backgroundColor: theme.colors.surface,
                                borderRadius: theme.radius.md,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                            }}
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

function StyledInput({
                         value,
                         onChangeText,
                         placeholder,
                         flex = false,
                         keyboardType = "default",
                     }) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.muted}
            keyboardType={keyboardType}
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

function OrderCard({ item, isManager, onEdit, onDelete, onAdvance }) {
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
                        {item.item}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 6,
                        }}
                    >
                        {item.quantity} {item.unit} • {item.supplier}
                    </Text>

                    {!!item.notes && (
                        <Text
                            style={{
                                color: theme.colors.muted,
                                marginTop: 8,
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

                {isManager ? (
                    <Pressable
                        onPress={onAdvance}
                        style={({ pressed }) => ({
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: theme.radius.md,
                            backgroundColor: theme.colors.accent,
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text style={{ color: "#fff", fontWeight: "900" }}>
                            Advance Status
                        </Text>
                    </Pressable>
                ) : null}

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
        status === "delivered"
            ? theme.colors.success
            : status === "approved"
                ? theme.colors.accent
                : theme.colors.danger;

    const bg =
        status === "delivered"
            ? "rgba(61,220,151,0.14)"
            : status === "approved"
                ? "rgba(124,92,255,0.14)"
                : "rgba(255,92,122,0.14)";

    const border =
        status === "delivered"
            ? "rgba(61,220,151,0.35)"
            : status === "approved"
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