import { COLORS, stylesCss } from "@/styles/styles";
import { Link, router } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PageInscription() {
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
          <Text style={styles.formLabel}>{"Nom d'utilisateur"}</Text>
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

        {/* Bouton inscription */}
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary, styles.btnFull]}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={{ color: "white" }}>{"S'inscrire"}</Text>
        </TouchableOpacity>
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
