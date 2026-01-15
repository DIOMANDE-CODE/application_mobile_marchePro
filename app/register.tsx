import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
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

export default function PageInscription() {
  const [nom, setNom] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorNumero, setErrorNumero] = useState("");
  const [nomError, setNomError] = useState("");
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const scrollViewRef = useRef<ScrollView>(null);

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

  const Inscription = async () => {
    setEmailError("");
    setNomError("");
    setPasswordError("");
    setErrorNumero("");

    // Verification des erreurs
    let hasError = false;
    if (!nom.trim()) {
      setNomError("Ce champs est obligatoire");
      hasError = true;
    }
    if (!email.trim()) {
      setEmailError("Ce champs est obligatoire");
      hasError = true;
    } else if (!validationEmail(email)) {
      setEmailError("Email invalide");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Ce champs est obligatoire");
      hasError = true;
    }

    if (!numero.trim()) {
      setErrorNumero("Ce champs est obligatoire");
    } else if (!validationNumeroCI(numero)) {
      setErrorNumero("Numero invalide (respecter le format des numeros ivoiriens)");
    }

    if (hasError) return;


    // Appel API Inscription
    setLoading(true);
    try {
      const response = await api.post("/utilisateurs/create/", {
        email_utilisateur: email.trim(),
        nom_utilisateur: nom.trim(),
        password: password.trim(),
        numero_telephone_utilisateur: numero.trim(),
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Succès",
          "Nouveau employé ajouté"
        );
        // Renitialisation des champs
        setEmail("");
        setNom("");
        setPassword("");
        setNumero("");
        setEmailError("");
        setNomError("");
        setPasswordError("");
        setErrorNumero("");
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
          Alert.alert("Erreur 500", "Erreur survenue au niveau du serveur");
        } else if (status === 409) {
          Alert.alert("", message);
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

  // Pre-chargement de la page et gestion du clavier
  useEffect(() => {
    setNom("");
    setEmail("");
    setPassword("");

    // Listener pour réinitialiser la position du scroll quand le clavier se ferme
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
            {"Nom et Prenoms "}
            <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {nomError && <Text style={styles.textDanger}>{nomError}</Text>}
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre nom d'utilisateur"
            value={nom}
            onChangeText={setNom}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            {"Email "}
            <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {emailError && <Text style={styles.textDanger}>{emailError}</Text>}
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
            {"Numéro de Téléphone "}
            <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {errorNumero && <Text style={styles.textDanger}>{errorNumero}</Text>}
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre numero de téléphone"
            keyboardType="phone-pad"
            value={numero}
            onChangeText={setNumero}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            Mot de passe <Text style={stylesCss.textDanger}>(*)</Text>
          </Text>
          {passwordError && (
            <Text style={styles.textDanger}>{passwordError}</Text>
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
            style={[styles.btn, styles.btnSecondary, styles.btnFull]}
            onPress={Inscription}
          >
            <Text style={{ color: "white" }}>{"Ajouter"}</Text>
          </TouchableOpacity>
        )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Styles
const styles = stylesCss;
