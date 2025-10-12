import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PageInscription() {
  const [nom, setNom] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [numero,setNumero] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorNumero,setErrorNumero] = useState("")
  const [nomError, setNomError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction de validation email
  const validationEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction de validation du numero
  const validationNumeroCI = (numero:string) => {
  const regex = /^(?:\+225|00225)?(01|05|07|25|27)\d{8}$/;
  return regex.test(numero);
}

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

    if (!numero.trim()){
      setErrorNumero("Ce champs est obligatoire")
    }
    else if (!validationNumeroCI(numero)){
      setErrorNumero("Numero invalide (ex: +2250102030405 ou 0102030405)")
    }

    if (hasError) return;

    console.log("inscription...");

    // Appel API Inscription
    setLoading(true);
    try {
      const response = await api.post("/utilisateurs/create/", {
        email_utilisateur: email.trim(),
        nom_utilisateur: nom.trim(),
        password: password.trim(),
        numero_telephone_utilisateur:numero.trim(),
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Succès",
          "Nouveau compte crée, connectez-vous avec votre compte"
        );
        setEmail("");
        setNom("");
        setPassword("");
        setNumero("")
        setEmailError("");
        setNomError("");
        setPasswordError("");
        setErrorNumero("")
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        if (status === 400) {
          Alert.alert("Erreur 400", message?.errors || "Erreur survenue");
        }
        else if (status === 404){
          Alert.alert("Erreur",message?.errors || "Aucun compte associé à ce compte")
        }
        else if (status === 500) {
          Alert.alert("Erreur 500", message?.errors || "Erreur survenue au niveau du serveur");
        } else {
          Alert.alert("Echec", "Une erreur est survenue");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-chargement de la page
  useEffect(() => {
    setNom("");
    setEmail("");
    setPassword("");
  }, []);
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
            secureTextEntry
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
            <Text style={{ color: "white" }}>{"S'inscrire"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lien vers la connexion */}
      <Text style={{ textAlign: "center" }}>
        Vous avez un compte ?{" "}
        <Link
          href="/login"
          style={{
            fontWeight: "bold",
            color: COLORS.primaryDark,
            textDecorationLine: "underline",
          }}
        >
          Connectez-vous
        </Link>
      </Text>
    </View>
  );
}

// Styles
const styles = stylesCss;
