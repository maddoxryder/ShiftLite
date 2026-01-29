import React, { useState } from "react";
import { View, Text } from "react-native";
import { seed, taskStatus } from "../data/seed";
import SegmentedControl from "../components/SegmentedControl";

export default function TasksScreen() {
  const [status, setStatus] = useState("All");
  const data = seed.tasks.filter(t => status === "All" || t.status === status);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "700" }}>status</Text>
      <SegmentedControl options={taskStatus} value={status} onChange={setStatus} />
      {data.map(t => <Text key={t.id}>{t.title}</Text>)}
    </View>
  );
}
