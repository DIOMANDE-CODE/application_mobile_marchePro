import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
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
}

export default function Produits() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idProduit, setIdProduit] = useState<string | null>(null);
  const [produit, setProduit] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);

  // Lister les clients
  const listeProduit = async () => {
    try {
      const response = await api.get("/produits/list/");
      if (response.status === 200) {
        const data = response.data;
        setProduit(data.data);
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
  };

  //   Fonction modifier profil
  const modifierProduit = useCallback((index: string) => {
    setEditVisible(true);
    setIdProduit(index);
  }, []);

     // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    listeProduit();
    setLoading(false);
  }

  // Pre-chargement
  useEffect(() => {
    listeProduit();
  }, [isVisible, editVisible, idProduit]);

    if (loading) return (<ActivityIndicator size="large" color={COLORS.primary} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gestion des produits</Text>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconBtn} onPress={refreshPage}>
                <Ionicons name="reload-circle" size={25} color={COLORS.light} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={() => setIsVisible(true)}
              >
                <Ionicons name="add-circle" size={25} color={COLORS.light} />
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
          <ListProduits data={produit} onSelectProduit={modifierProduit} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
