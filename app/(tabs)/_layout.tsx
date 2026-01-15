import { COLORS } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import React from "react";

export default function TabLayout() {
  const pathname = usePathname()
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tableau de bord",
          tabBarIcon: () => (
            <Ionicons
              size={30}
              name={pathname === "/" ? "home" : "home-outline"}
              color={COLORS.primary}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ventes"
        options={{
          title: "Ventes",
          tabBarIcon: () => (
            <Ionicons
              size={30}
              name={pathname === "/ventes" ? "cart" : "cart-outline"}
              color={COLORS.primary}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: "Commandes",
          tabBarIcon: () => (
            <Ionicons
              size={30}
              name={pathname === "/commandes" ? "bag" : "bag-outline"}
              color={COLORS.primary}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}