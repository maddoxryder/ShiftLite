// src/data/seed.js

export const seed = {
    // ✅ Updated schedule format (works with the new ScheduleScreen)
    schedule: [
        { id: "s1", day: "Mon", start: "09:00", end: "17:00", person: "Ava", role: "server", notes: "" },
        { id: "s2", day: "Mon", start: "17:00", end: "01:00", person: "Liam", role: "bartender", notes: "bar close" },
        { id: "s3", day: "Tue", start: "12:00", end: "20:00", person: "Noah", role: "host", notes: "" },
        { id: "s4", day: "Wed", start: "10:00", end: "18:00", person: "Charlize", role: "server", notes: "" },
        { id: "s5", day: "Fri", start: "18:00", end: "02:00", person: "Kal", role: "security", notes: "busy night" },
    ],

    // ✅ Updated inventory format (works with the new InventoryScreen)
    inventory: [
        { id: "i1", name: "Vodka", category: "Liquor", qty: 5, min: 8, unit: "bottles" },
        { id: "i2", name: "Gin", category: "Liquor", qty: 10, min: 8, unit: "bottles" },
        { id: "i3", name: "Napkins", category: "Supplies", qty: 2, min: 6, unit: "packs" },
        { id: "i4", name: "Limes", category: "Produce", qty: 30, min: 20, unit: "pcs" },
        { id: "i5", name: "Ice", category: "Supplies", qty: 1, min: 3, unit: "bins" },
    ],

    // (Optional) Keep your existing ones if you already have them
    tasks: [
        { id: "t1", title: "restock napkins", status: "open", priority: "low", assignee: "Ava" },
        { id: "t2", title: "clean bar", status: "in-progress", priority: "medium", assignee: "Liam" },
        { id: "t3", title: "inventory count", status: "done", priority: "high", assignee: "Kal" },
    ],

    messages: [
        { id: "m1", title: "happy hour", body: "starts friday", channel: "announcements", unread: true },
        { id: "m2", title: "delivery delay", body: "produce late", channel: "ops", unread: false },
    ],
};

// Filters used by the screens
export const days = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const roles = ["All", "server", "bartender", "host", "security"];
export const invCategories = ["All", "Liquor", "Produce", "Supplies"];
