import { stylesCss } from "@/styles/styles";
import { router } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PageConnexion() {
  
  return (
    <View style={stylesCss.loginContainer}>
      {/* HEADER */}
      <View style={styles.loginHeader}>
        <Text style={styles.loginLogo}>
          <Image
            source={require("../assets/logo_marchePro_sans_fond.png")}
            style={styles.loginLogoImage}
          />
        </Text>
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

        {/* Bouton connexion */}
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, styles.btnFull]}
        >
          <Text style={{ color: "white" }} onPress={() => router.push("/(tabs)")}>
            Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Code CSS
const styles = stylesCss;
