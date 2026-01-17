import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouveauProduit from "@/components/produits/add_produit";
import EditProduit from "@/components/produits/edit_produit";
import ListProduits from "@/components/produits/list_produit";

interface Categorie {
  identifiant_categorie: string;
  nom_categorie: string;
}
interface Produit {
  identifiant_produit: string;
  image_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
  seuil_alerte_produit: number;
  categorie_produit: Categorie;
  thumbnail:string;
}

export default function Produits() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idProduit, setIdProduit] = useState<string | null>(null);
  const [produit, setProduit] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduit, setLoadingProduit] = useState(false);

  const [offset, setOffset] = useState(0)
  const [next, setNext] = useState(null)
  const limit = 10

  // Lister les clients
  const listeProduit = async () => {
    if (loadingProduit) return;
    setLoadingProduit(true);

    try {
      const response = await api.get("/produits/list/", {
        params: { limit, offset },
      });

      if (response.status === 200) {
        const root = response.data;
        const pagination = root.data;

        // fusion + suppression des doublons
        setProduit((prev) => {
          const merged = [...prev, ...pagination.results];

          const unique = merged.filter(
            (item, index, self) =>
              index === self.findIndex(
                (p) => p.identifiant_produit === item.identifiant_produit
              )
          );
          return unique;
        });

        setOffset((prev) => prev + pagination.results.length);
        setNext(pagination.next);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingProduit(false);
  };

  //   Fonction modifier profil
  const modifierProduit = useCallback((index: string) => {
    setEditVisible(true);
    setIdProduit(index);
  }, []);

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    setProduit([]);
    setOffset(0);
    setNext(null);
    listeProduit();
    setLoading(false);
  };

  // Pre-chargement
  useEffect(() => {
    setOffset(0)
    setNext(null)
    listeProduit();
  }, [isVisible, editVisible, idProduit]);

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
        <View style={styles.container}> 
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gestion des produits</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={refreshPage}>
                <Ionicons name="reload-circle" size={35} color={COLORS.light} />
              </TouchableOpacity>
              <Pressable
                style={styles.iconBtn}
                onPress={() => setIsVisible(true)}
              >
                <Ionicons name="add-circle" size={35} color={COLORS.light} />
              </Pressable>
            </View>
          </View>
          {isVisible && (
            <AjoutNouveauProduit
              visible={isVisible}
              onEditClose={() => setIsVisible(false)}
            />
          )}

          {editVisible && (
            <EditProduit
              identifiant={idProduit}
              editVisible={editVisible}
              onEditClose={() => setEditVisible(false)}
            />
          )}

          {/* Contenu principal */}
          <ListProduits data={produit} onSelectProduit={modifierProduit} onEndReached={() => {
            if (!loadingProduit && next) {
              listeProduit();
            }
          }} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
