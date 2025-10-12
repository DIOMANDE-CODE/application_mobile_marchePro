import { COLORS, stylesCss } from "@/styles/styles";
import { Link, router } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PageConnexion() {
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
          <Text style={styles.formLabel}>{"Email du vendeur"}</Text>
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre nom d'utilisateur"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Mot de passe</Text>
          <TextInput
            style={styles.formControl}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
          />
        </View>

        {/* Bouton connexion */}
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, styles.btnFull]}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={{ color: "white" }}>Se connecter</Text>
        </TouchableOpacity>
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
