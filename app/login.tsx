import api, { attachTokenToApi } from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function PageConnexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const scrollViewRef = useRef<ScrollView>(null);

  // Verification du mail
  const validationEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const Connexion_utilisateur = async () => {

    // Verification des champs saisi
    let hasError = false;
    if (!password.trim()) {
      setErrorPassword("Ce champs est obligatoire");
      hasError = true;
    }
    if (!email.trim()) {
      setErrorEmail("Ce champs est obligatoire");
      hasError = true;
    } else if (!validationEmail(email)) {
      setErrorEmail("Email invalide");
      hasError = true;
    }

    if (hasError) return;

    // Connexion via api
    setLoading(true);
    try {

      const response = await api.post("/authentification/login/", {
        email_utilisateur: email.trim(),
        password: password.trim(),
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        if (token) {
          await SecureStore.setItemAsync("auth_token", token);
          await AsyncStorage.setItem("user_role", response.data.user.role);
          await attachTokenToApi();
          const role = await AsyncStorage.getItem("user_role");
          if (role?.trim().toLowerCase() === "admin") {
            router.replace("/(admin)");
            Alert.alert("Succès", "Connexion réussie");
            return;
          } else {
            router.replace("/(tabs)");
            Alert.alert("Succès", "Connexion réussie");
            return;
          }
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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <ScrollView
            ref={scrollViewRef}
            style={[stylesCss.loginContainer, { backgroundColor: "#fff" }]}
            contentContainerStyle={{ 
              minHeight: screenHeight,
              justifyContent: "center",
              paddingVertical: 16,
              backgroundColor: "#fff",
            }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
              {"Email "}
              <Text style={stylesCss.textDanger}>(*)</Text>
            </Text>
            {errorEmail && <Text style={styles.textDanger}>{errorEmail}</Text>}
            <TextInput
              style={styles.formControl}
              placeholder="Entrez votre adresse email"
              keyboardType="email-address"
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
              // secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
  
          {/* Bouton inscription */}
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, styles.btnFull]}
              onPress={Connexion_utilisateur}
            >
              <Text style={{ color: "white" }}>{"Se connecter"}</Text>
            </TouchableOpacity>
          )}
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
}

// Code CSS
const styles = stylesCss;
