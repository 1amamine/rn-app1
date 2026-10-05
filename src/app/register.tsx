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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, fontSize } from "@/constants/theme";
import { ActivityIndicator } from "react-native";

import React, { useState, useEffect } from "react";

import { supabase } from "./utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

const Register = () => {
  const router = useRouter();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState("");
  const [sex, setSex] = useState("male");
  const [isvisible, setisvisible] = useState(false);

  const [loading, setloading] = useState(false);

  const handleRegister = async () => {
    Keyboard.dismiss();
    setloading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user.id,
          name: username,
          age: age,
          sex: sex,
        },
      ]);

      if (profileError) {
        throw new Error(
          `Auth succeeded, but profile creation failed: ${profileError.message}`,
        );
      } else {
        if (data.user) router.replace("/dashboard");
      }
    }
    if (error) alert(error);
    setloading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerTitle}>Register</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username :</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. JohnDoe"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setusername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age: </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor="#999"
                value={age}
                onChangeText={setage}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sex: </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={sex}
                  onValueChange={(itemValue) => setSex(itemValue)}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email :</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. JohnDoe@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setemail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password :</Text>
              <View style={styles.pswrapper}>
                <TextInput
                  style={styles.psinput}
                  placeholder="Enter password..."
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setpassword}
                  secureTextEntry={!isvisible}
                />
                <Ionicons
                  name={isvisible ? "eye-off" : "eye"}
                  size={20}
                  color={"black"}
                  onPress={() => {
                    setisvisible(!isvisible);
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, !username.trim() && styles.disabledButton]}
              onPress={handleRegister}
              disabled={!username.trim()}
            >
              {loading ? (
                <ActivityIndicator size={22} color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
            <Text
              style={styles.registerText}
              onPress={() => router.push("/login")}
            >
              already have an account? Login
            </Text>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    padding: 20,
  },
  loginform: {
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: "Jaro",
    marginTop: 60,
    marginBottom: 38,
    color: Colors.light.text,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: "Imprima",
    marginBottom: 6,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: fontSize.sm,
    fontFamily: "Imprima",
    color: Colors.light.text,
  },
  pswrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  psinput: {
    fontSize: fontSize.sm,
    fontFamily: "Imprima",
    color: Colors.light.text,
    flex: 1,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 22,
  },
  disabledButton: {
    backgroundColor: Colors.light.primaryLight,
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontFamily: "Jaro",
  },
  registerText: {
    color: Colors.light.text,
    alignSelf: "center",
    marginTop: 6,
    fontSize: fontSize.xs,
    fontFamily: "Imprima",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
});
