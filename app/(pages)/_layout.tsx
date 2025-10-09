import { Stack } from "expo-router";
import "react-native-reanimated";

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="profil" options={{ headerShown: false }} />
      <Stack.Screen name="info" options={{ headerShown: false }} />
    </Stack>
  );
}
