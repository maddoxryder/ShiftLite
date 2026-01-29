export const seed = {
  schedule: [
    { id: "s1", day: "Mon", shift: "09–17", person: "Ava", role: "server" },
    { id: "s2", day: "Tue", shift: "17–01", person: "Liam", role: "bartender" },
    { id: "s3", day: "Wed", shift: "12–20", person: "Noah", role: "host" },
    { id: "s4", day: "Fri", shift: "18–02", person: "Mia", role: "security" },
  ],
  tasks: [
    { id: "t1", title: "restock napkins", status: "open", priority: "low", assignee: "Ava" },
    { id: "t2", title: "clean bar", status: "in-progress", priority: "medium", assignee: "Liam" },
    { id: "t3", title: "inventory count", status: "done", priority: "high", assignee: "Mia" },
  ],
  inventory: [
    { id: "i1", name: "vodka", category: "liquor", qty: 5, min: 8 },
    { id: "i2", name: "napkins", category: "supplies", qty: 2, min: 6 },
    { id: "i3", name: "limes", category: "produce", qty: 30, min: 20 },
  ],
  messages: [
    { id: "m1", title: "happy hour", body: "starts friday", channel: "announcements", unread: true },
    { id: "m2", title: "delivery delay", body: "produce late", channel: "ops", unread: false },
  ],
};

export const days = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const roles = ["All", "server", "bartender", "host", "security"];
export const taskStatus = ["All", "open", "in-progress", "done"];
export const taskPriority = ["All", "low", "medium", "high"];
export const invCategories = ["All", "liquor", "produce", "supplies"];
export const msgChannels = ["All", "announcements", "ops"];
