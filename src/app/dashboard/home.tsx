import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { Colors, fontSize } from "@/constants/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Materialicons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { ActivityIndicator } from "react-native";

import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../utils/supabase";
import { useRouter } from "expo-router";

import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import * as Clipboard from "expo-clipboard";

const Home = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userSex, setUserSex] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [list1open, setlist1open] = useState(false);
  const [list2open, setlist2open] = useState(false);
  const [list3open, setlist3open] = useState(false);

  const [loading, setloading] = useState(false);

  useEffect(() => {
    const handleDataUpload = async () => {
      setloading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error.message);
        return null;
      }

      if (data) {
        setUserName(data.name);
        setUserAge(data.age);
        setUserSex(data.sex);
        setImageUri(data.avatar_url);
      }
      setloading(false);
    };
    handleDataUpload();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    router.replace("/login");
    if (error) throw new Error(error.message);
  };

  const pickImage = async () => {
    setloading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("User not authenticated");

        const base64 = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          },
        );

        const arrayBuffer = decode(base64);
        const fileName = `${user.id}/${Date.now()}-avatar.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, arrayBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl })
          .eq("user_id", user.id);

        if (updateError) throw updateError;

        console.log("Avatar successfully uploaded and profile updated!");
      } catch (err) {
        console.error("Error processing profile image update: ", err);
      }
    }
    setloading(false);
  };

  const autoCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    console.log("Copied to clipboard");
  };

  return (
    <MenuProvider style={loading ? styles.container : { flex: 1 }}>
      {loading ? (
        <ActivityIndicator size={30} color={Colors.light.primary} />
      ) : (
        <ScrollView style={styles.profileform}>
          <View style={styles.topbar}>
            <Menu>
              <MenuTrigger
                customStyles={{ triggerWrapper: styles.triggerWrapper }}
              >
                <Entypo name="dots-three-vertical" size={25} color={"black"} />
              </MenuTrigger>

              <MenuOptions customStyles={optionsStyles}>
                <MenuOption onSelect={() => alert("")} style={styles.optionRow}>
                  <Materialicons name="edit" size={20} color="black" />
                  <Text style={styles.optionText}>Edit</Text>
                </MenuOption>

                <MenuOption onSelect={() => alert("")} style={styles.optionRow}>
                  <Entypo name="share" size={20} color="black" />
                  <Text style={styles.optionText}>Share</Text>
                </MenuOption>

                <MenuOption onSelect={signOut} style={styles.optionRow}>
                  <Materialicons name="logout" size={20} color="black" />
                  <Text style={styles.optionText}>Logout</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>

          <View style={styles.avatar}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require("../../../assets/images/anonyme.png")
              }
              style={imageUri ? styles.profileimage : styles.anonymimage}
            />
            <View style={styles.imageicon}>
              <Ionicons
                name="camera"
                size={20}
                color={"white"}
                onPress={pickImage}
              />
            </View>
          </View>

          <Text style={styles.name}>{userName}</Text>

          <View style={styles.infoscontainer}>
            <Text style={styles.agetext}>{userAge} yo</Text>
            <Image
              source={require("../../../assets/images/flags/morocco.png")}
              style={styles.flagicon}
            />
            <Ionicons
              name={userSex == "male" ? "male" : "female"}
              size={30}
              color="black"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.menu}
            onPress={() => setlist1open(!list1open)}
          >
            <Text style={styles.menutitle}>Social media</Text>
            <Ionicons
              name={list1open ? "arrow-up" : "arrow-down"}
              size={25}
              color="black"
            />
          </TouchableOpacity>
          {list1open && (
            <View style={styles.list}>
              <Pressable
                style={styles.listitem}
                onPress={() => autoCopy("@amamine11")}
              >
                <Text style={styles.listtext}>@amamine11</Text>
                <Ionicons name="logo-instagram" size={25} color="black" />
              </Pressable>
              <Pressable
                style={styles.listitem}
                onPress={() => autoCopy("@amamine11")}
              >
                <Text style={styles.listtext}>@Iam_amine_111</Text>
                <Ionicons name="logo-facebook" size={25} color="black" />
              </Pressable>
              <Pressable
                style={styles.listitem}
                onPress={() => autoCopy("@amamine11")}
              >
                <Text style={styles.listtext}>@Iam_011</Text>
                <Ionicons name="logo-tiktok" size={25} color="black" />
              </Pressable>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.menu}
            onPress={() => setlist2open(!list2open)}
          >
            <Text style={styles.menutitle}>Personal infos</Text>
            <Ionicons
              name={list2open ? "arrow-up" : "arrow-down"}
              size={25}
              color="black"
            />
          </TouchableOpacity>
          {list2open && (
            <View style={styles.list}>
              <View style={styles.listitem}>
                <Text style={styles.listtext}>6 Jan</Text>
                <Materialicons name="cake" size={25} color="black" />
              </View>
              <View style={styles.listitem}>
                <Text style={styles.listtext}>Khemisset</Text>
                <Ionicons name="location-sharp" size={25} color="black" />
              </View>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.menu}
            onPress={() => setlist3open(!list3open)}
          >
            <Text style={styles.menutitle}>Interests</Text>
            <Ionicons
              name={list3open ? "arrow-up" : "arrow-down"}
              size={25}
              color="black"
            />
          </TouchableOpacity>
        </ScrollView>
      )}
    </MenuProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  profileform: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  topbar: {
    alignItems: "flex-end",
    marginTop: 10,
    paddingRight: 5,
  },
  triggerWrapper: {
    padding: 5,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 14,
    gap: 16,
  },
  optionText: {
    marginRight: 10,
    fontSize: fontSize.sm,
    fontFamily: "Imprima",
    color: "#000",
  },
  avatar: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: "#fff",
    marginTop: 20,
    marginBottom: 14,
  },
  name: {
    alignSelf: "center",
    color: Colors.light.text,
    fontSize: fontSize.lg,
    fontFamily: "Jaro",
  },
  anonymimage: {
    width: 100,
    height: 100,
  },
  profileimage: {
    width: "100%",
    height: "100%",
    borderRadius: 90,
  },
  imageicon: {
    backgroundColor: "#5d5d5db3",
    position: "absolute",
    bottom: 12,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 20,
  },
  infoscontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 38,
    paddingHorizontal: 24,
  },
  agetext: {
    color: "black",
    fontSize: fontSize.lg,
    fontFamily: "Imprima",
  },
  flagicon: {
    width: 35,
    height: 35,
  },
  menu: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menutitle: {
    fontFamily: "Imprima",
    fontSize: fontSize.lg,
  },
  list: {
    gap: 8,
  },
  listtext: {
    fontFamily: "Imprima",
    fontSize: fontSize.md,
  },
  listitem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: 200,
  },
};
