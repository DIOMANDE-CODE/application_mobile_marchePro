import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilUtilisateur() {
  const [nom, setNom] = useState("Martin Dupont");
  const [email, setEmail] = useState("martin.dupont@example.com");
  const [telephone, setTelephone] = useState("+33 6 45 78 90 12");

  const handleSave = () => {
    alert("Profil mis à jour avec succès !");
  };

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      {/* ===== HEADER ===== */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={COLORS.light} />
        </Pressable>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* ===== CONTENU ===== */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Photo de profil */}
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Image
            source={
              require("../../assets/images/photo_profil.png")
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
          <Pressable>
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Changer la photo
            </Text>
          </Pressable>
        </View>

        {/* Formulaire */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Boutons */}
        <Pressable
          style={[styles.btn, styles.btnPrimary, { marginTop: 20 }]}
          onPress={handleSave}
        >
          <Text style={styles.btnText}>Enregistrer</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnDanger, { marginTop: 10 }]}
          onPress={handleLogout}
        >
          <Text style={[styles.btnText, styles.textLight]}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = stylesCss;
