import api, { attachTokenToApi } from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CONFIG from "@/constants/config";
import * as SecureStore from "expo-secure-store";

export default function PageConnexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Verification du mail
  const validationEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const Connexion_utilisateur = async () => {
    console.log("Connexion.....", CONFIG.API_IMAGE_BASE_URL);

    // Verification des champs saisi
    let hasError = false;
    if (!password.trim()) {
      setErrorPassword("Ce champs est obligatoire");
      hasError = true;
    }
    if (!email.trim()) {
      setErrorEmail("Ce champs est obligatoire");
      hasError = true;
    } else if (!validationEmail) {
      setErrorEmail("Email invalide");
      hasError = true;
    }

    if (hasError) return;

    // Connexion via api
    setLoading(true);
    try {
      console.log("API");

      const response = await api.post("/authentification/login/", {
        email_utilisateur: email.trim(),
        password: password.trim(),
      });

      if (response.status === 200 || response.status === 201) {
        console.log("API");

        const token = response.data.token;
        if (token) {
          await SecureStore.setItemAsync("auth_token", token);
          await attachTokenToApi();
          router.replace("/(tabs)");
          Alert.alert("Succès", "Connexion réussie");
        }
        // Renitialisation des champs

        setEmail("");
        setPassword("");
        setErrorEmail("");
        setErrorPassword("");
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
        } else if (status === 401) {
          Alert.alert("", "Email ou mot de passe incorrect");
        } else if (status === 404) {
          Alert.alert("", "Compte inexistant");
        } else {
          Alert.alert("Erreur", message);
        }
      } else {
        Alert.alert("Erreur", error.message || "Erreur réseau");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={stylesCss.loginContainer}>
      {/* HEADER */}
      <View style={styles.loginHeader}>
        <Image
          source={require("../assets/logo_marchePro_sans_fond.png")}
          style={styles.loginLogoImage}
        />
        <Text style={styles.loginSubtitle}>
          Gestion de poissonnerie et boucherie
        </Text>
      </View>

      {/* FORMULAIRE */}
      <View style={styles.loginForm}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            {"Adresse email "} <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {errorEmail && <Text style={styles.textDanger}>{errorEmail}</Text>}
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre nom d'utilisateur"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            Mot de passe <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {errorPassword && (
            <Text style={styles.textDanger}>{errorPassword}</Text>
          )}
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre mot de passe"
            value={password}
            onChangeText={setPassword}
            // secureTextEntry
          />
        </View>

        {/* Bouton connexion */}
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary, styles.btnFull]}
            onPress={Connexion_utilisateur}
          >
            <Text style={{ color: "white" }}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lien vers l'inscription */}
      <Text style={{ textAlign: "center" }}>
        Aucun compte ?{" "}
        <Link
          href="/register"
          style={{
            fontWeight: "bold",
            color: COLORS.primaryDark,
            textDecorationLine: "underline",
          }}
        >
          créez un compte
        </Link>
      </Text>
    </View>
  );
}

// Code CSS
const styles = stylesCss;
