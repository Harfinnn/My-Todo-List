import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { FC } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title?: string;
  btnBack?: boolean;
}

const Header: FC<Props> = ({
  title = "Todo App",
  btnBack = false,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        {btnBack ? (
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#2563EB" />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.iconBtn} />
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
});
