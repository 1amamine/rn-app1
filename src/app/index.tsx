import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { supabase } from "./utils/supabase";

export default function Index() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });
  }, []);

  // Show a loading spinner while checking the session
  if (session === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If logged in -> go to dashboard, otherwise -> go to login
  if (session) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
