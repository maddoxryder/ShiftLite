import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { seed, days } from "../data/seed";
import SegmentedControl from "../components/SegmentedControl";

export default function ScheduleScreen() {
  const [day, setDay] = useState("All");

  const data = seed.schedule.filter(s => day === "All" || s.day === day);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "700" }}>day</Text>
      <SegmentedControl options={days.slice(0, 4)} value={day} onChange={setDay} />

      <FlatList
        data={data}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <Text>{item.day} • {item.person} • {item.shift}</Text>
        )}
      />
    </View>
  );
}
