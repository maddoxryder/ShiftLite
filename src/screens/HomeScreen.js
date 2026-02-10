import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import HomeTileButton from "../components/HomeTileButton";
import TeamMemberRow from "../components/TeamMemberRow";

export default function HomeScreen({ navigation, route }) {
  // you can pass user info via route params later
  const userInitial = "M";

  const team = useMemo(
    () => [
      { id: "u1", name: "Rock L.", role: "Manager", initial: "R" },
      { id: "u2", name: "Arthur L.", role: "BOH Support", initial: "A" },
      { id: "u3", name: "Charlize C.", role: "Service Attendant", initial: "C" },
      { id: "u4", name: "Kal E.", role: "Security", initial: "K" },
    ],
    []
  );

  const [selectedMemberId, setSelectedMemberId] = useState(team[0]?.id);

  const onPage = (member) => {
    // for now: navigate to a placeholder "MemberChat" screen
    navigation.navigate("MemberChat", { member });
  };

  const TableLayoutPreview = () => {
    // lightweight “table layout” placeholder — matches your mock vibe
    return (
      <View
        style={{
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.65)",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
          padding: 14,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        }}
      >
        <Text style={{ fontWeight: "700", textAlign: "center", marginBottom: 10 }}>
          Table Layout
        </Text>

        {/* simple blocks to look like the layout boxes */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View
            style={{
              width: 70,
              height: 150,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderWidth: 2,
              borderColor: "rgba(120,120,255,0.25)",
            }}
          />
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  flex: 1,
                  height: 45,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 2,
                  borderColor: "rgba(120,120,255,0.25)",
                }}
              />
              <View
                style={{
                  flex: 1,
                  height: 45,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 2,
                  borderColor: "rgba(120,120,255,0.25)",
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  width: 48,
                  height: 68,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 2,
                  borderColor: "rgba(120,120,255,0.25)",
                }}
              />
              <View
                style={{
                  width: 48,
                  height: 68,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 2,
                  borderColor: "rgba(120,120,255,0.25)",
                }}
              />
              <View
                style={{
                  width: 48,
                  height: 68,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 2,
                  borderColor: "rgba(120,120,255,0.25)",
                }}
              />
            </View>

            <View
              style={{
                height: 55,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderWidth: 2,
                borderColor: "rgba(120,120,255,0.25)",
              }}
            />
          </View>

          <View
            style={{
              width: 70,
              height: 150,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderWidth: 2,
              borderColor: "rgba(120,120,255,0.25)",
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#DDE1FF" }}>
      {/* top header */}
      <View
        style={{
          paddingTop: 14,
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
            }}
          />
          <Text style={{ fontWeight: "800", fontSize: 16 }}>Club GBC</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontWeight: "700" }}>User Profile</Text>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(0,0,0,0.15)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.85)",
            }}
          >
            <Text style={{ fontWeight: "900" }}>{userInitial}</Text>
          </View>
        </View>
      </View>

      {/* scroll-like body */}
      <View style={{ paddingHorizontal: 16, gap: 14 }}>
        <TableLayoutPreview />

        {/* team list + paging */}
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={team}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <TeamMemberRow
                  member={item}
                  selected={item.id === selectedMemberId}
                  onSelect={() => setSelectedMemberId(item.id)}
                  onPage={() => onPage(item)}
                />
              )}
            />
          </View>

          {/* “Page” quick buttons stack (like your mock) */}
          <View style={{ width: 110, gap: 10, justifyContent: "center" }}>
            {team.slice(0, 3).map((m) => (
              <Pressable
                key={m.id}
                onPress={() => onPage(m)}
                style={{
                  paddingVertical: 12,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.65)",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 6 },
                }}
              >
                <Text style={{ fontWeight: "700" }}>Page</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* bottom tiles */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <HomeTileButton label="Schedule" onPress={() => navigation.navigate("Schedule")} />
          <HomeTileButton label="Announcements" onPress={() => navigation.navigate("Messaging")} />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <HomeTileButton label="Inventory" onPress={() => navigation.navigate("Inventory")} />
          <HomeTileButton label="Orders" onPress={() => navigation.navigate("Orders")} />
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
          <HomeTileButton label="Tasks" onPress={() => navigation.navigate("Tasks")} />
          <HomeTileButton label="Settings" onPress={() => navigation.navigate("Settings")} />
        </View>
      </View>
    </View>
  );
}
