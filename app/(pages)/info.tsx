import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InfoApplication() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      {/* ===== HEADER ===== */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={COLORS.light} />
        </Pressable>
        <Text style={styles.headerTitle}>Information Boutique</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* ===== CONTENU ===== */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Photo de profil */}
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Image
            source={
              require("../../assets/logo_marchePro_sans_fond.png")
            }
            style={{
              width: 200,
              height: 200,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
        </View>

        {/* Formulaire */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Entreprise</Text>
          <TextInput style={styles.input} value="MarchéPro" editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Localisation</Text>
          <TextInput
            style={styles.input}
            value="Côte d'Ivoire, Yamoussoukro, Grand Marché"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            value="+225 07-11-39-95-67/05-95-03-16-94"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{"Horaires d'ouverture"}</Text>
          <TextInput
            style={styles.input}
            value="Lundi au Vendredi de 08H à 17H"
            editable={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = stylesCss;
