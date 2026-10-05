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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors, fontSize } from "@/constants/theme";

import { supabase } from "./utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

const Login = () => {
  const router = useRouter();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [loading, setloading] = useState(false);
  const [isvisible, setisvisible] = useState(false);

  const handleLogin = async () => {
    setloading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) alert(error);
    if (data) console.log(data);
    if (data.user) router.replace("/dashboard");
    setloading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.loginform}>
          <Text style={styles.headerTitle}>Login</Text>
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
            activeOpacity={0.7}
            style={[styles.button, !email.trim() && styles.disabledButton]}
            onPress={handleLogin}
            disabled={!email.trim()}
          >
            {loading ? (
              <ActivityIndicator size={22} color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
          <Text
            style={styles.registerText}
            onPress={() => router.push("/register")}
          >
            don't have an account? Register
          </Text>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loginform: {
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: "Jaro",
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
});
