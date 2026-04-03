import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Modal,
    ScrollView,
    Switch,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getItem, setItem } from "../services/storage";
import { invCategories, seed } from "../data/seed";
import { theme } from "../theme/theme";

const STORAGE_KEY = "inventoryData";

function makeId(prefix = "i") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function InventoryScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    const [category, setCategory] = useState("All");
    const [lowOnly, setLowOnly] = useState(false);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [fName, setFName] = useState("");
    const [fCategory, setFCategory] = useState("Liquor");
    const [fQty, setFQty] = useState("0");
    const [fMin, setFMin] = useState("0");
    const [fUnit, setFUnit] = useState("units");

    useEffect(() => {
        (async () => {
            const saved = await getItem(STORAGE_KEY, null);
            setItems(saved ?? seed.inventory);
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
            const matchCategory = category === "All" ? true : item.category === category;
            const matchLow = lowOnly ? Number(item.qty) <= Number(item.min) : true;
            const matchSearch =
                !q ||
                (item.name ?? "").toLowerCase().includes(q) ||
                (item.category ?? "").toLowerCase().includes(q) ||
                (item.unit ?? "").toLowerCase().includes(q);

            return matchCategory && matchLow && matchSearch;
        });
    }, [items, category, lowOnly, search]);

    const summary = useMemo(() => {
        const total = items.length;
        const low = items.filter((x) => Number(x.qty) <= Number(x.min)).length;
        const healthy = total - low;
        return { total, low, healthy };
    }, [items]);

    const openAdd = () => {
        setEditing(null);
        setFName("");
        setFCategory("Liquor");
        setFQty("0");
        setFMin("0");
        setFUnit("units");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFName(item.name ?? "");
        setFCategory(item.category ?? "Liquor");
        setFQty(String(item.qty ?? 0));
        setFMin(String(item.min ?? 0));
        setFUnit(item.unit ?? "units");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            name: fName.trim() || "New Item",
            category: fCategory,
            qty: Number(fQty) || 0,
            min: Number(fMin) || 0,
            unit: fUnit.trim() || "units",
        };

        if (editing) {
            setItems((prev) =>
                prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x))
            );
        } else {
            setItems((prev) => [{ id: makeId("i"), ...cleaned }, ...prev]);
        }

        setModalOpen(false);
    };

    const remove = (id) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

    const adjustQty = (id, delta) => {
        setItems((prev) =>
            prev.map((x) =>
                x.id === id
                    ? { ...x, qty: Math.max(0, Number(x.qty) + delta) }
                    : x
            )
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
                    Inventory
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    {isManager
                        ? "Monitor stock, edit counts, and manage inventory items."
                        : "View stock levels and low-stock alerts."}
                </Text>

                {/* Summary */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <SummaryCard label="Items" value={summary.total} />
                    <SummaryCard label="Low" value={summary.low} accent="danger" />
                    <SummaryCard label="Healthy" value={summary.healthy} accent="success" />
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
                        placeholder="Search inventory..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                        }}
                    />
                </View>

                <SectionTitle title="Category" />
                <ChipRow options={invCategories} value={category} onChange={setCategory} />

                <View
                    style={{
                        marginTop: 16,
                        marginBottom: 12,
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.radius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        paddingHorizontal: 14,
                        paddingVertical: 14,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                            Low stock only
                        </Text>
                        <Text style={{ color: theme.colors.muted, marginTop: 4, fontSize: 12 }}>
                            Show only items at or below minimum level
                        </Text>
                    </View>
                    <Switch value={lowOnly} onValueChange={setLowOnly} />
                </View>

                {isManager ? (
                    <Pressable
                        onPress={openAdd}
                        style={({ pressed }) => ({
                            marginTop: 6,
                            backgroundColor: theme.colors.accent,
                            borderRadius: theme.radius.md,
                            paddingVertical: 14,
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text style={{ color: "#fff", fontWeight: "900" }}>+ Add Item</Text>
                    </Pressable>
                ) : null}

                <View style={{ marginTop: 18, gap: 12 }}>
                    {filtered.map((item) => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            isManager={isManager}
                            onEdit={() => openEdit(item)}
                            onDelete={() => remove(item.id)}
                            onMinus={() => adjustQty(item.id, -1)}
                            onPlus={() => adjustQty(item.id, 1)}
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
                                No inventory items match your filters.
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
                            {editing ? "Edit Item" : "Add Item"}
                        </Text>

                        <SectionTitle title="Item Name" compact />
                        <StyledInput
                            value={fName}
                            onChangeText={setFName}
                            placeholder="Vodka"
                        />

                        <SectionTitle title="Category" compact />
                        <ChipRow
                            options={invCategories.filter((c) => c !== "All")}
                            value={fCategory}
                            onChange={setFCategory}
                        />

                        <SectionTitle title="Stock / Minimum" compact />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <StyledInput
                                value={fQty}
                                onChangeText={setFQty}
                                placeholder="10"
                                flex
                                keyboardType="numeric"
                            />
                            <StyledInput
                                value={fMin}
                                onChangeText={setFMin}
                                placeholder="5"
                                flex
                                keyboardType="numeric"
                            />
                        </View>

                        <SectionTitle title="Unit" compact />
                        <StyledInput
                            value={fUnit}
                            onChangeText={setFUnit}
                            placeholder="bottles"
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

function InventoryCard({
                           item,
                           isManager,
                           onEdit,
                           onDelete,
                           onMinus,
                           onPlus,
                       }) {
    const low = Number(item.qty) <= Number(item.min);
    const percent =
        Number(item.min) <= 0
            ? 1
            : Math.min(1, Number(item.qty) / Math.max(Number(item.min) * 2, 1));

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: low ? "rgba(255,92,122,0.25)" : theme.colors.border,
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
                        {item.name}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 4,
                        }}
                    >
                        {item.category} • Min {item.min} {item.unit}
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: theme.radius.pill,
                        backgroundColor: low
                            ? "rgba(255,92,122,0.14)"
                            : "rgba(61,220,151,0.14)",
                        borderWidth: 1,
                        borderColor: low
                            ? "rgba(255,92,122,0.35)"
                            : "rgba(61,220,151,0.35)",
                    }}
                >
                    <Text
                        style={{
                            color: low ? theme.colors.danger : theme.colors.success,
                            fontWeight: "800",
                        }}
                    >
                        {low ? "LOW" : "OK"}
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 14 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                        Current stock
                    </Text>
                    <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                        {item.qty} {item.unit}
                    </Text>
                </View>

                <View
                    style={{
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                    }}
                >
                    <View
                        style={{
                            width: `${Math.max(8, percent * 100)}%`,
                            height: "100%",
                            backgroundColor: low ? theme.colors.danger : theme.colors.accent,
                            borderRadius: 999,
                        }}
                    />
                </View>
            </View>

            {isManager ? (
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 14,
                        }}
                    >
                        <QtyButton icon="remove" onPress={onMinus} />
                        <View
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: theme.radius.md,
                                backgroundColor: "rgba(255,255,255,0.04)",
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: theme.colors.text, fontWeight: "900" }}>
                                {item.qty} {item.unit}
                            </Text>
                        </View>
                        <QtyButton icon="add" onPress={onPlus} />
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
                </>
            ) : null}
        </View>
    );
}

function QtyButton({ icon, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: "rgba(124,92,255,0.16)",
                borderWidth: 1,
                borderColor: "rgba(124,92,255,0.35)",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
        >
            <MaterialCommunityIcons
                name={icon}
                size={22}
                color={theme.colors.text}
            />
        </Pressable>
    );
}