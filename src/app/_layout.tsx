import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Jaro: require("../../assets/fonts/Jaro-Regular-VariableFont_opsz.ttf"),
    Imprima: require("../../assets/fonts/Imprima-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
