import { useRef, useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PagerView from "react-native-pager-view";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

import Home from "./home";
import Friends from "./friendspage";
import Notifs from "./notifs";
import { Colors } from "@/constants/theme";

export default function Dashboard() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (page: number) => {
    pagerRef.current?.setPage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={(event) => {
          setCurrentPage(event.nativeEvent.position);
        }}
      >
        <View key="friends">
          <Friends />
        </View>

        <View key="home">
          <Home />
        </View>

        <View key="notifs">
          <Notifs />
        </View>
      </PagerView>

      <View style={styles.bottombar}>
        <Pressable
          style={[styles.navButton, currentPage === 0 && styles.activebtn]}
          onPress={() => goToPage(0)}
        >
          <FontAwesome5
            name="user-friends"
            size={20}
            color={currentPage === 0 ? "#fff" : "#000"}
          />
        </Pressable>

        <Pressable
          style={[styles.navButton, currentPage === 1 && styles.activebtn]}
          onPress={() => goToPage(1)}
        >
          <FontAwesome5
            name="home"
            size={20}
            color={currentPage === 1 ? "#fff" : "#000"}
          />
        </Pressable>

        <Pressable
          style={[styles.navButton, currentPage === 2 && styles.activebtn]}
          onPress={() => goToPage(2)}
        >
          <Ionicons
            name="notifications"
            size={20}
            color={currentPage === 2 ? "#fff" : "#000"}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
  },

  pager: {
    flex: 1,
  },

  bottombar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 25,
  },
  activebtn: {
    backgroundColor: Colors.light.primary,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});
