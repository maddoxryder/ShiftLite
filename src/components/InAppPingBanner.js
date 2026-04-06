import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function InAppPingBanner({
                                            visible,
                                            message,
                                            fromUser,
                                            onPress,
                                            onHide,
                                        }) {
    const translateY = useRef(new Animated.Value(-140)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 260,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 260,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hideBanner();
            }, 3500);

            return () => clearTimeout(timer);
        } else {
            hideBanner(true);
        }
    }, [visible]);

    const hideBanner = (silent = false) => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -140,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (!silent && onHide) onHide();
        });
    };

    return (
        <Animated.View
            pointerEvents={visible ? "auto" : "none"}
            style={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                zIndex: 999,
                opacity,
                transform: [{ translateY }],
            }}
        >
            <Pressable
                onPress={onPress}
                style={{
                    backgroundColor: "rgba(12,16,28,0.97)",
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: "rgba(124,92,255,0.35)",
                    padding: 14,
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 8,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: 14,
                            backgroundColor: "rgba(124,92,255,0.16)",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={theme.colors.text}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontWeight: "900",
                                fontSize: 15,
                            }}
                        >
                            New Ping
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: theme.colors.muted,
                                marginTop: 2,
                                fontSize: 13,
                            }}
                        >
                            {fromUser ? `From ${fromUser}: ` : ""}
                            {message}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}