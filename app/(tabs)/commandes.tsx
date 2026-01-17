import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouvelleCommande from "@/components/commandes/add_commande";
import ListCommandes from "@/components/commandes/list_commande";
import DetailCommande from "../(pages)/detail_commande";

export default function Commandes() {
  const [showBill, setShowBill] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [listeCommandes, setListeCommandes] = useState([]);
  const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Afficher les commandes
  const listeCommande = async () => {
    const role = await AsyncStorage.getItem("user_role");
    if (role === "admin") {
      try {
        const response = await api.get("/commandes/list/");
        if (response.status === 200) {
          const data = response.data;
          setListeCommandes(data.data);
        }
      } catch (error: any) {
        console.error("Erreur dans listeCommande:", error);

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data;

          if (status === 400) {
            Alert.alert("", message.errors || "Erreur de saisie");
          } else if (status === 500) {
            Alert.alert("Erreur 500", "Erreur survenue au serveur");
          } else if (status === 401) {
            Alert.alert("", "Accès non autorisé");
          } else {
            Alert.alert("Erreur", error.message || "Erreur survenue");
          }
        }
      }
    } else {
      try {
        const response = await api.get("/commandes/list/vendeur");
        if (response.status === 200) {
          const data = response.data;
          setListeCommandes(data.data);
        }
      } catch (error: any) {
        console.error("Erreur dans listeCommande:", error);

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
    }
  };

  const afficherDetail = useCallback(
    (id: string) => {
      setSelectedCommandeId(id);
      setShowBill(true);
    },
    [setShowBill]
  );

  const closeDetail = useCallback(() => {
    setShowBill(false);
  }, [setShowBill]);

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    listeCommande();
    setLoading(false);
  };

  useEffect(() => {
    listeCommande();
  }, [showBill, isVisible]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {showBill && selectedCommandeId ? (
          <DetailCommande
            isVisible={showBill}
            commandeID={selectedCommandeId}
            onClose={closeDetail}
          />
        ) : isVisible ? (
          <AjoutNouvelleCommande
            visible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        ) : (
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Commandes</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={refreshPage}>
                  <Ionicons
                    name="reload-circle"
                    size={35}
                    color={COLORS.light}
                  />
                </TouchableOpacity>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => setIsVisible(!isVisible)}
                >
                  <Ionicons name="add-circle" size={35} color={COLORS.light} />
                </Pressable>
              </View>
            </View>
            <ListCommandes data={listeCommandes} onSelectedId={afficherDetail} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
