import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Modal, Switch } from "react-native";
import { getItem, setItem } from "../services/storage";
import { invCategories, seed } from "../data/seed";

const STORAGE_KEY = "inventoryData";

function makeId(prefix = "i") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function InventoryScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);

    // filters
    const [category, setCategory] = useState("All");
    const [lowOnly, setLowOnly] = useState(false);
    const [search, setSearch] = useState("");

    // modal (manager)
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // form
    const [fName, setFName] = useState("");
    const [fCategory, setFCategory] = useState("Liquor");
    const [fQty, setFQty] = useState("0");
    const [fMin, setFMin] = useState("0");
    const [fUnit, setFUnit] = useState("");

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
        return items.filter((i) => {
            const matchCategory = category === "All" ? true : i.category === category;
            const isLow = Number(i.qty) < Number(i.min);
            const matchLow = lowOnly ? isLow : true;
            const matchSearch =
                !q ||
                i.name.toLowerCase().includes(q) ||
                i.category.toLowerCase().includes(q) ||
                (i.unit ?? "").toLowerCase().includes(q);

            return matchCategory && matchLow && matchSearch;
        });
    }, [items, category, lowOnly, search]);

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
        setFName("");
        setFCategory("Liquor");
        setFQty("0");
        setFMin("0");
        setFUnit("");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFName(item.name ?? "");
        setFCategory(item.category ?? "Liquor");
        setFQty(String(item.qty ?? 0));
        setFMin(String(item.min ?? 0));
        setFUnit(item.unit ?? "");
        setModalOpen(true);
    };

    const save = () => {
        const cleaned = {
            name: (fName.trim() || "Unnamed").replace(/\s+/g, " "),
            category: fCategory,
            qty: Number(fQty) || 0,
            min: Number(fMin) || 0,
            unit: fUnit.trim(),
        };

        if (editing) {
            setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...cleaned } : x)));
        } else {
            setItems((prev) => [{ id: makeId("i"), ...cleaned }, ...prev]);
        }
        setModalOpen(false);
    };

    const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

    const adjustQty = (id, delta) => {
        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, qty: Math.max(0, Number(x.qty) + delta) } : x))
        );
    };

    if (booting) return null;

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F6F7FF" }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>
                Inventory {isManager ? "(Manager)" : "(Staff)"}
            </Text>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search item, category..."
                style={{
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.12)",
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: "#fff",
                }}
            />

            <Text style={{ fontWeight: "800" }}>Category</Text>
            <ChipRow options={invCategories} value={category} onChange={setCategory} />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "800" }}>Low stock only</Text>
                <Switch value={lowOnly} onValueChange={setLowOnly} />
            </View>

            {isManager ? (
                <Pressable
                    onPress={openAdd}
                    style={{ padding: 14, borderRadius: 12, backgroundColor: "#111", alignItems: "center" }}
                >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>+ Add Item</Text>
                </Pressable>
            ) : null}

            <FlatList
                data={filtered}
                keyExtractor={(x) => x.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => {
                    const low = Number(item.qty) < Number(item.min);
                    return (
                        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" }}>
                            <Text style={{ fontWeight: "900" }}>
                                {item.name} {low ? "• LOW" : ""}
                            </Text>
                            <Text style={{ opacity: 0.7, marginTop: 6 }}>{item.category}</Text>
                            <Text style={{ marginTop: 6, fontWeight: "800" }}>
                                Qty: {item.qty} {item.unit ? item.unit : ""} • Min: {item.min}
                            </Text>

                            {isManager ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                                        <Pressable onPress={() => adjustQty(item.id, -1)} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(17,17,17,0.08)", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "900" }}>-1</Text>
                                        </Pressable>
                                        <Pressable onPress={() => adjustQty(item.id, +1)} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(17,17,17,0.08)", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "900" }}>+1</Text>
                                        </Pressable>
                                    </View>

                                    <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                                        <Pressable onPress={() => openEdit(item)} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(17,17,17,0.08)", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "800" }}>Edit</Text>
                                        </Pressable>
                                        <Pressable onPress={() => remove(item.id)} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: "rgba(220,0,0,0.10)", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "900", color: "crimson" }}>Delete</Text>
                                        </Pressable>
                                    </View>
                                </>
                            ) : null}
                        </View>
                    );
                }}
            />

            {/* Manager edit modal */}
            <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
                    <View style={{ backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, gap: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "900" }}>{editing ? "Edit Item" : "Add Item"}</Text>

                        <Text style={{ fontWeight: "800" }}>Name</Text>
                        <TextInput value={fName} onChangeText={setFName} placeholder="Vodka" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

                        <Text style={{ fontWeight: "800" }}>Category</Text>
                        <ChipRow options={invCategories.filter((c) => c !== "All")} value={fCategory} onChange={setFCategory} />

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <View style={{ flex: 1, gap: 6 }}>
                                <Text style={{ fontWeight: "800" }}>Qty</Text>
                                <TextInput value={fQty} onChangeText={setFQty} keyboardType="numeric" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />
                            </View>
                            <View style={{ flex: 1, gap: 6 }}>
                                <Text style={{ fontWeight: "800" }}>Min</Text>
                                <TextInput value={fMin} onChangeText={setFMin} keyboardType="numeric" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />
                            </View>
                        </View>

                        <Text style={{ fontWeight: "800" }}>Unit (optional)</Text>
                        <TextInput value={fUnit} onChangeText={setFUnit} placeholder="bottles / packs / pcs" style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }} />

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
