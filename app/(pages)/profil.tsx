import CONFIG from "@/constants/config";
import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilUtilisateur() {
  const [nom, setNom] = useState("");
  const [erreurNom, setErreurNom] = useState("")
  const [email, setEmail] = useState("");
  const [erreurEmail, setErreurEmail] = useState("")
  const [numero, setNumero] = useState("");
  const [erreurNumero, setErreurNumero] = useState("")
  const [photo, setPhoto] = useState("");
  const [nouveauCode, setNouveauCode] = useState("");
  const [erreurNouveauCode, setErreurNouveauCode] = useState("")
  const [confirmerNouveauCode, setConfirmerNouveauCode] = useState("");
  const [erreurConfirmerNouveauCode, setErreurConfirmerNouveauCode] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const scrollViewRef = useRef<ScrollView>(null);

  // Fonction de redimensionnement de l'image
  const resizeAndCompressImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // tableau d'actions
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // options de sauvegarde
    );

    return result.uri;
  };

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
    try {
      setLoading(true);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission refusée", "Tu dois autoriser l’accès à la galerie.");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        try {
          const resizedUri = await resizeAndCompressImage(uri);
          setImage(resizedUri);
        } catch (e: any) {
          console.error("Erreur lors du redimensionnement:", e);
          Alert.alert("Erreur", "Impossible de traiter l'image sélectionnée");
        }
      }
    } catch (e: any) {
      console.error("Erreur ImagePicker:", e);
      Alert.alert("Erreur", e?.message || "Impossible de choisir l'image");
    } finally {
      setLoading(false); 
    }
  };



  // Fonction de validation email
  const validationEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction de validation du numero
  const validationNumeroCI = (numero: string) => {
    const regex = /^(?:\+225|00225)?(01|05|07|25|27)\d{8}$/;
    return regex.test(numero);
  };

  const sauvegarder = async () => {

    setErreurNom("");
    setErreurEmail("");
    setErreurNumero("");
    setErreurNouveauCode("");
    setConfirmerNouveauCode("");

    // Verification des erreurs
    let hasError = false;
    if (!nom.trim()) {
      setErreurNom("Ce champs est obligatoire");
      hasError = true;
    }
    if (!email.trim()) {
      setErreurEmail("Ce champs est obligatoire");
      hasError = true;
    } else if (!validationEmail(email)) {
      setErreurEmail("Email invalide");
      hasError = true;
    }
    if (nouveauCode !== confirmerNouveauCode) {
      setErreurNouveauCode("Les mots de passes doivent être pareil");
      setErreurConfirmerNouveauCode("Les mots de passes doivent être pareil");
      hasError = true;
    }

    if (!numero.trim()) {
      setErreurNumero("Ce champs est obligatoire");
      hasError = true;

    } else if (!validationNumeroCI(numero)) {
      setErreurNumero("Numero invalide (respecter le format des numeros ivoiriens)");
      hasError = true;
    }

    if (hasError) return;


    const formData = new FormData();
    formData.append("email_utilisateur", email.trim());
    formData.append("nom_utilisateur", nom.trim());
    formData.append("numero_telephone_utilisateur", numero.trim());
    if (nouveauCode) {
      formData.append("nouveau_code", nouveauCode)
    }
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
        const data = error.response.data.errors;

        // On transforme le message en texte
        let message = "";

        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = JSON.stringify(data);
        } else {
          message = "Erreur inattendue";
        }

        if (status === 400) {
          Alert.alert("", message);
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else {
          Alert.alert("Erreur", message);
        }
      } else {
        Alert.alert("Erreur", error.message || "Erreur réseau");
      }
    } finally {
      setNouveauCode("")
      setConfirmerNouveauCode("")
      setErreurConfirmerNouveauCode("")
      setErreurNouveauCode("")
      setLoading(false);
    }
  };

  const deconnexion = async () => {
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

  // Gestion du clavier et ramener à position initiale
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: COLORS.light }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
            backgroundColor: COLORS.light,
          }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo de profil */}
          <View style={{ alignItems: "center", marginBottom: 25 }}>
            {image ? (
              <Image
                cachePolicy="disk"
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
              />
            ) : (
              <Image
                cachePolicy="disk"
                source={{ uri: `${CONFIG.API_IMAGE_BASE_URL}${photo}` }}
                style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
              />
            )}

            <Pressable
              onPress={changePhotoProfil}
              style={[stylesCss.btnSm, stylesCss.btnThird]}
              disabled={loading} 
            >
              <Text style={{ color: COLORS.light, fontWeight: "bold" }}>
                {"Changer la photo"}
              </Text>
            </Pressable>
          </View>


          {/* Formulaire */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            {erreurNom && <Text style={styles.textDanger}>{erreurNom}</Text>}
            <TextInput style={styles.input} value={nom} onChangeText={setNom} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            {erreurEmail && <Text style={styles.textDanger}>{erreurEmail}</Text>}
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            {erreurNumero && <Text style={styles.textDanger}>{erreurNumero}</Text>}

            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={setNumero}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nouveau mot de passe</Text>
            {erreurNouveauCode && <Text style={styles.textDanger}>{erreurNouveauCode}</Text>}

            <TextInput
              style={styles.input}
              value={nouveauCode}
              onChangeText={setNouveauCode}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
            {erreurConfirmerNouveauCode && <Text style={styles.textDanger}>{erreurConfirmerNouveauCode}</Text>}
            <TextInput
              style={styles.input}
              value={confirmerNouveauCode}
              onChangeText={setConfirmerNouveauCode}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = stylesCss;
