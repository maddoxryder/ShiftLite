import { supabase } from "../services/supabase";
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
import { theme } from "../theme/theme";
import { loadAppSettings } from "../services/appSettings";

const channels = ["All", "general", "floor", "bar", "security", "management"];

function makeId(prefix = "a") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function MessagingScreen({ role }) {
    const isManager = role === "manager";

    const [items, setItems] = useState([]);
    const [booting, setBooting] = useState(true);
    const [appSettings, setAppSettings] = useState(null);

    const [search, setSearch] = useState("");
    const [channel, setChannel] = useState("All");
    const [unreadOnly, setUnreadOnly] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [fTitle, setFTitle] = useState("");
    const [fBody, setFBody] = useState("");
    const [fChannel, setFChannel] = useState("general");

    useEffect(() => {
        (async () => {
            const loadedSettings = await loadAppSettings();
            setAppSettings(loadedSettings);

            const { data, error } = await supabase
                .from("announcements")
                .select("*")
                .order("created_at", { ascending: false });

                if (error) {
                console.log("Fetch announcements error:", error);
                } else {
                setItems(data || []);
                }
            setBooting(false);
        })();
    }, []);


    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return (items ?? []).filter((item) => {
            const matchChannel = channel === "All" ? true : item.channel === channel;
            const matchUnread = unreadOnly ? !item.read : true;
            const matchSearch =
                !q ||
                (item.title ?? "").toLowerCase().includes(q) ||
                (item.body ?? "").toLowerCase().includes(q) ||
                (item.channel ?? "").toLowerCase().includes(q);

            return matchChannel && matchUnread && matchSearch;
        });
    }, [items, search, channel, unreadOnly]);

    const summary = useMemo(() => {
        const safeItems = items ?? [];
        const total = safeItems.length;
        const unread = safeItems.filter((x) => !x.read).length;
        const read = total - unread;
        return { total, unread, read };
    }, [items]);

    const openAdd = () => {
        setEditing(null);
        setFTitle("");
        setFBody("");
        setFChannel("general");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setFTitle(item.title ?? "");
        setFBody(item.body ?? "");
        setFChannel(item.channel ?? "general");
        setModalOpen(true);
    };

    const save = async () => {
    const cleaned = {
        title: fTitle.trim() || "Untitled Announcement",
        body: fBody.trim() || "",
        channel: fChannel,
        read: false,
        created_at: new Date().toISOString(),
    };

    if (editing) {
        await supabase
        .from("announcements")
        .update(cleaned)
        .eq("id", editing.id);
    } else {
        await supabase
        .from("announcements")
        .insert([cleaned]);
    }

    const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    setItems(data || []);
    setModalOpen(false);
    };

    const remove = async (id) => {
    await supabase.from("announcements").delete().eq("id", id);

    const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    setItems(data || []);
    };

    const toggleRead = async (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;

    await supabase
        .from("announcements")
        .update({ read: !item.read })
        .eq("id", id);

    const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

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
                    Announcements
                </Text>

                <Text
                    style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        marginBottom: 18,
                    }}
                >
                    {isManager
                        ? "Broadcast updates and operational notices."
                        : "View updates and mark announcements as read."}
                </Text>

                <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
                    <SummaryCard label="Total" value={summary.total} />
                    <SummaryCard label="Unread" value={summary.unread} accent="danger" />
                    <SummaryCard label="Read" value={summary.read} accent="success" />
                </View>

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
                        placeholder="Search announcements..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                        }}
                    />
                </View>

                <SectionTitle title="Channel" />
                <ChipRow options={channels} value={channel} onChange={setChannel} />

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
                            Unread only
                        </Text>
                        <Text style={{ color: theme.colors.muted, marginTop: 4, fontSize: 12 }}>
                            Show only announcements that still need review
                        </Text>
                    </View>
                    <Switch value={unreadOnly} onValueChange={setUnreadOnly} />
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
                        <Text style={{ color: "#fff", fontWeight: "900" }}>
                            + New Announcement
                        </Text>
                    </Pressable>
                ) : null}

                <View style={{ marginTop: 18, gap: 12 }}>
                    {filtered.map((item) => (
                        <AnnouncementCard
                            key={item.id}
                            item={item}
                            isManager={isManager}
                            onEdit={() => openEdit(item)}
                            onDelete={() => remove(item.id)}
                            onToggleRead={() => toggleRead(item.id)}
                            autoMarkAnnouncementsRead={appSettings?.autoMarkAnnouncementsRead}
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
                                No announcements match your filters.
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>

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
                            {editing ? "Edit Announcement" : "New Announcement"}
                        </Text>

                        <SectionTitle title="Title" compact />
                        <StyledInput
                            value={fTitle}
                            onChangeText={setFTitle}
                            placeholder="Security briefing before open"
                        />

                        <SectionTitle title="Channel" compact />
                        <ChipRow
                            options={channels.filter((c) => c !== "All")}
                            value={fChannel}
                            onChange={setFChannel}
                        />

                        <SectionTitle title="Message" compact />
                        <TextInput
                            value={fBody}
                            onChangeText={setFBody}
                            placeholder="Write your announcement..."
                            placeholderTextColor={theme.colors.muted}
                            multiline
                            style={{
                                minHeight: 120,
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

function AnnouncementCard({
                              item,
                              isManager,
                              onEdit,
                              onDelete,
                              onToggleRead,
                          }) {
    const unread = !item.read;

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: unread
                    ? "rgba(124,92,255,0.30)"
                    : theme.colors.border,
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
                            marginTop: 8,
                            lineHeight: 21,
                        }}
                    >
                        {item.body}
                    </Text>

                    <Text
                        style={{
                            color: theme.colors.muted,
                            marginTop: 10,
                            fontSize: 12,
                        }}
                    >
                        {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "Just now"}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end", gap: 8 }}>
                    <ChannelPill channel={item.channel} />
                    <ReadPill unread={unread} />
                </View>
            </View>

            <View
                style={{
                    marginTop: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: unread
                            ? "rgba(124,92,255,0.14)"
                            : "rgba(61,220,151,0.14)",
                        borderWidth: 1,
                        borderColor: unread
                            ? "rgba(124,92,255,0.35)"
                            : "rgba(61,220,151,0.35)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MaterialCommunityIcons
                        name={unread ? "message-badge-outline" : "check-circle-outline"}
                        size={20}
                        color={unread ? theme.colors.accent : theme.colors.success}
                    />
                </View>

                <Text style={{ color: theme.colors.muted, flex: 1 }}>
                    {unread ? "Needs review" : "Marked as read"}
                </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                {!isManager ? (
                    <Pressable
                        onPress={onToggleRead}
                        style={({ pressed }) => ({
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: theme.radius.md,
                            backgroundColor: unread
                                ? theme.colors.accent
                                : "rgba(255,255,255,0.06)",
                            borderWidth: unread ? 0 : 1,
                            borderColor: unread ? "transparent" : theme.colors.border,
                            alignItems: "center",
                            transform: [{ scale: pressed ? 0.985 : 1 }],
                        })}
                    >
                        <Text
                            style={{
                                color: unread ? "#fff" : theme.colors.text,
                                fontWeight: "900",
                            }}
                        >
                            {unread ? "Mark Read" : "Mark Unread"}
                        </Text>
                    </Pressable>
                ) : (
                    <>
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
                    </>
                )}
            </View>
        </View>
    );
}

function ChannelPill({ channel }) {
    const styles = getChannelStyle(channel);

    return (
        <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: styles.bg,
                borderWidth: 1,
                borderColor: styles.border,
            }}
        >
            <Text style={{ color: styles.text, fontWeight: "800" }}>{channel}</Text>
        </View>
    );
}

function ReadPill({ unread }) {
    return (
        <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.radius.pill,
                backgroundColor: unread
                    ? "rgba(124,92,255,0.14)"
                    : "rgba(61,220,151,0.14)",
                borderWidth: 1,
                borderColor: unread
                    ? "rgba(124,92,255,0.35)"
                    : "rgba(61,220,151,0.35)",
            }}
        >
            <Text
                style={{
                    color: unread ? theme.colors.accent : theme.colors.success,
                    fontWeight: "800",
                }}
            >
                {unread ? "Unread" : "Read"}
            </Text>
        </View>
    );
}

function getChannelStyle(channel) {
    const c = (channel || "").toLowerCase();

    if (c.includes("security")) {
        return {
            bg: "rgba(255,92,122,0.14)",
            border: "rgba(255,92,122,0.35)",
            text: theme.colors.danger,
        };
    }

    if (c.includes("bar")) {
        return {
            bg: "rgba(76,201,240,0.14)",
            border: "rgba(76,201,240,0.35)",
            text: theme.colors.accent2,
        };
    }

    if (c.includes("management")) {
        return {
            bg: "rgba(255,184,77,0.14)",
            border: "rgba(255,184,77,0.35)",
            text: theme.colors.warning,
        };
    }

    if (c.includes("floor")) {
        return {
            bg: "rgba(61,220,151,0.14)",
            border: "rgba(61,220,151,0.35)",
            text: theme.colors.success,
        };
    }

    return {
        bg: "rgba(124,92,255,0.14)",
        border: "rgba(124,92,255,0.35)",
        text: theme.colors.accent,
    };
}