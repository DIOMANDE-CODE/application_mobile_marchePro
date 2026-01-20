import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import ListCommandes from "@/components/commandes/list_commande";
import AjoutNouveauAchat from "@/components/ventes/add_achat";
import DetailCommande from "../(pages)/detail_commande";


type Client = {
  nom_client: string;
};
type Commande = {
  identifiant_commande: string;
  id: string;
  client: Client;
  details_commandes: [];
  total_ttc: number;
  etat_commande: string;
  code_livraison: string;
};

export default function Commandes() {
  const [showBill, setShowBill] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [listeCommandes, setListeCommandes] = useState<Commande[]>([]);
  const [selectedCommandeId, setSelectedCommandeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCommande, setLoadingCommande] = useState(false);

  const [offset, setOffset] = useState(0)
  const [next, setNext] = useState(null)
  const limit = 10

  // Afficher les commandes
  const listeCommande = async (customOffset = offset) => {
    setLoading(true);
    if (loadingCommande) return;
    setLoadingCommande(true);
    const role = await AsyncStorage.getItem("user_role");
    if (role === "admin") {
      try {
        const response = await api.get("/commandes/list/", {
          params: { limit, offset: customOffset },
        });
        if (response.status === 200) {
          const root = response.data;
          const pagination = root.data;

          setListeCommandes((prev) => {
            const merged = [...prev, ...pagination.results];

            const unique = merged.filter(
              (item, index, self) =>
                index === self.findIndex(
                  (p) => p.identifiant_commande === item.identifiant_commande
                )
            );
            return unique;
          });

          setOffset(customOffset + pagination.results.length);
          setNext(pagination.next);

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
            Alert.alert("", "Accès non autorisé");
          } else {
            Alert.alert("Erreur", error.message || "Erreur survenue");
          }
        }
      }
      setLoadingCommande(false);
      setLoading(false);
    } else {
      setLoading(true);
      if (loadingCommande) return;
      setLoadingCommande(true);
      try {
        const response = await api.get("/commandes/list/vendeur", {
          params: { limit, offset: customOffset },
        });
        if (response.status === 200) {
          const root = response.data;
          const pagination = root.data;

          setListeCommandes((prev) => {
            const merged = [...prev, ...pagination.results];

            const unique = merged.filter(
              (item, index, self) =>
                index === self.findIndex(
                  (p) => p.identifiant_commande === item.identifiant_commande
                )
            );
            return unique;
          });

          setOffset(customOffset + pagination.results.length);
          setNext(pagination.next);
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
      setLoadingCommande(false);
      setLoading(false);
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
    refreshPage();
    setShowBill(false);
  }, []);

  // Foncton rafraichir la page
  const refreshPage = async () => {
    setListeCommandes([]);
    await listeCommande(0);
  };

  useEffect(() => {
    listeCommande(0);

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
          <AjoutNouveauAchat
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
              </View>
            </View>
            {
              loading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                />
              ) : (
                <ListCommandes data={listeCommandes} onSelectedId={afficherDetail} onEndReached={() => {
                  if (!loadingCommande && next) {
                    listeCommande();
                  }
                }} />
              )
            }

          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
