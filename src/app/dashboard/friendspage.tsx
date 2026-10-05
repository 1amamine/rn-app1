import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Button,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors, fontSize } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

import { supabase } from "../utils/supabase";

const Friendspage = () => {
  const [profiles, setprofiles] = useState<any[]>([]);
  const [searchtext, setsearchtext] = useState("");

  useEffect(() => {
    const fetchfriendslist = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url");

      if (error) {
        console.error("Error fetching data: ", error.message);
        return null;
      }
      if (data) setprofiles(data);
    };
    fetchfriendslist();
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.friendsform}>
        <View style={styles.inputform}>
          <View style={styles.searchicon}>
            <Ionicons name="search" size={20} color={"black"} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type smth..."
            placeholderTextColor="#999"
            value={searchtext}
            onChangeText={setsearchtext}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View>
          <FlatList
            data={profiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.profile}>
                <Image
                  source={{ uri: item.avatar_url }}
                  style={styles.profileimg}
                />
                <View>
                  <Text style={styles.profilename}>{item.name}</Text>
                  <Text style={styles.profiletime}>6h ago</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Friendspage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  friendsform: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputform: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchicon: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: fontSize.md,
    fontFamily: "Imprima",
    color: Colors.light.text,
  },
  profile: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profileimg: {
    width: 40,
    height: 40,
    borderRadius: 90,
  },
  profilename: {
    fontSize: fontSize.lg,
    fontFamily: "Imprima",
  },
  profiletime: {
    fontSize: fontSize.sm,
    fontFamily: "Imprima",
  },
});
