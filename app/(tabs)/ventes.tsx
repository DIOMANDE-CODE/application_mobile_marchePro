import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import RecuVente from "@/components/recu";
import AjoutNouveauAchat from "@/components/ventes/add_achat";
import ListVentes from "@/components/ventes/list_achat";


type Client = {
  nom_client: string;
}

type DetailVente = {
  produit: string;
  quantite: number;
  prix_unitaire: number;
}

type Vente = {
  identifiant_vente: string;
  id: string;
  client: Client;
  details_ventes: DetailVente[];
  total_ttc: number;
}

export default function Ventes() {
  const [showBill, setShowBill] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [listeVentes, setListeVentes] = useState<Vente[]>([]);
  const [selectedVenteId, setSelectedVenteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVente, setLoadingVente] = useState(false);
  const [offset, setOffset] = useState(0)
  const [next, setNext] = useState(null)
  const limit = 10

  // Afficher les ventes
  const listeVente = async (customOffset=offset) => {
    if (loadingVente) return;
    setLoadingVente(true)
    const role = await AsyncStorage.getItem("user_role");
    if (role === "admin") {
      try {
        const response = await api.get("/ventes/list/", {
          params: { limit, offset: customOffset}
        });
        if (response.status === 200) {
          const root = response.data;
          const pagination = root.data

          setListeVentes((prev) => {
            const merged = [...prev, ...pagination.results];

            const unique = merged.filter(
              (item, index, self) =>
                index === self.findIndex(
                  (p) => p.identifiant_vente === item.identifiant_vente
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
      } finally {

        setLoadingVente(false);
      }
    } else {
      try {
        const response = await api.get("/ventes/list/vendeur/", {
          params: { limit, offset: customOffset}
        });
        if (response.status === 200) {
          const root = response.data;
          const pagination = root.data

          setListeVentes((prev) => {
            const results = pagination.results;
            const merged = [...prev, ...results];

            const unique = merged.filter(
              (item, index, self) =>
                index === self.findIndex(
                  (p) => p.identifiant_vente === item.identifiant_vente
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
      } finally {
        setLoadingVente(false);
      }
    }
  };

  const afficherDetail = useCallback(
    (id: string) => {
      setSelectedVenteId(id);
      setShowBill(true);
    },
    [setShowBill]
  );

  const closeDetail = useCallback(() => {
    refreshPage();
    setShowBill(false);
  }, [setShowBill]);

  // Foncton rafraichir la page
  const refreshPage = async () => {
    setListeVentes([]);
    await listeVente(0);
  };

  useEffect(() => {
    listeVente(0);
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
        {showBill && selectedVenteId ? (
          <RecuVente
            isVisible={showBill}
            venteID={selectedVenteId}
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
              <Text style={styles.headerTitle}>Ventes</Text>
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
            <ListVentes data={listeVentes} onSelectedId={afficherDetail} onEndReached={() => {
              if (!loadingVente && next) {
                listeVente()
              }
            }} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
