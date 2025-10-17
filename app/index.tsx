import { isAuthenticated } from "@/services/auth";
import { COLORS } from "@/styles/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    (async () => {
      const ok = await isAuthenticated();
      if (ok) router.replace("/(tabs)");
      else router.replace("/login");
      setLoading(false);
    })();
  }, []);
  if (loading){
    return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><ActivityIndicator size="large" color={COLORS.primary}/></View>);
  }
  return null;
}
