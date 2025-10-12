import CONFIG from "@/constants/config";
import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [numero, setNumero] = useState("+33 6 45 78 90 12");
  const [photo, setPhoto] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fonction de recupération des info de l'utilisateur connecté
  const Info_utilisateur = async () => {
    try {
      const response = await api.get("/utilisateurs/detail/");
      if (response.status === 200 || response.status === 201) {
        const data = response.data.data;
        setNom(data.nom_utilisateur);
        setEmail(data.email_utilisateur);
        setNumero(data.numero_telephone_utilisateur);
        setPhoto(data.photo_profil_utilisateur);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;

        if (status === 400) {
          Alert.alert("", message.errors || "Erreur de saisie");
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("", "Mot de passe incorrecte");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  // Changer Photo de Profil
  const changePhotoProfil = async () => {
    console.log("Photo de profil");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Tu dois autoriser l’accès à la galerie."
      );
      return;
    }

    const new_image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!new_image.canceled) {
      setImage(new_image.assets[0].uri);
    }
  };

  const sauvegarder = async () => {
    const formData = new FormData();
    formData.append("email_utilisateur", email.trim());
    formData.append("nom_utilisateur", nom.trim());
    formData.append("numero_telephone_utilisateur", numero.trim());
    if (image) {
      const fileName = image.split("/").pop();
      const ext = fileName?.split(".").pop()?.toLowerCase();

      let mimeType = "image/jpeg";
      if (ext === "png") mimeType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";

      formData.append("photo_profil_utilisateur", {
        uri: image,
        name: fileName || "profil.jpg",
        type: mimeType,
      } as any);
    }
    console.log("Modification.....");
    setLoading(true);
    try {
      const response = await api.put("/utilisateurs/detail/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        const data = response.data.data;
        setNom(data.nom_utilisateur);
        setEmail(data.email_utilisateur);
        setNumero(data.numero_telephone_utilisateur);
        if (data.photo_profil_utilisateur) {
          setPhoto(data.photo_profil_utilisateur);
          setImage(null);
        }
        Alert.alert("Succès", "Informations mises à jour");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;

        if (status === 400) {
          Alert.alert("", message.errors || "Erreur de saisie");
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("", "Mot de passe incorrecte");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const deconnexion = async () => {
    console.log("Deconnexion");
    try {
      const response = await api.post("/authentification/logout/");
      if (response.status === 200 || response.status === 201) {
        await SecureStore.deleteItemAsync("auth_token");
        delete api.defaults.headers.common["Authorization"];
        router.replace("/login");
        Alert.alert("Succès", "Deconnexion réussie");
      }
    } catch {
      Alert.alert("Erreur", "Echec de la deconnexion");
    }
  };

  useEffect(() => {
    Info_utilisateur();
  }, []);
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
          {image ? (
            <Image
              source={{
                uri: `${image}`,
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
          ) : (
            <Image
              source={{
                uri: `${CONFIG.API_IMAGE_BASE_URL}${photo}`,
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
          )}

          <Pressable
            onPress={changePhotoProfil}
            style={[stylesCss.btnSm, stylesCss.btnThird]}
          >
            <Text style={{ color: COLORS.light, fontWeight: "bold" }}>
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
            value={numero}
            onChangeText={setNumero}
            keyboardType="phone-pad"
          />
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Pressable
            style={[styles.btn, styles.btnPrimary, { marginTop: 20 }]}
            onPress={sauvegarder}
          >
            <Text style={styles.btnText}>Enregistrer</Text>
          </Pressable>
        )}

        {/* Boutons */}

        <Pressable
          style={[styles.btn, styles.btnDanger, { marginTop: 10 }]}
          onPress={deconnexion}
        >
          <Text style={[styles.btnText, styles.textLight]}>Se deconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = stylesCss;
