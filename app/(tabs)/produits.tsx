import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouveauProduit from "@/components/produits/add_produit";
import EditProduit from "@/components/produits/edit_produit";
import ListProduits from "@/components/produits/list_produit";

export default function Produits() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idProduit, setIdProduit] = useState<number | null>(null);

  const Produits = [
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Saumon frais",
      details: "Poissonnerie • Réf: P001",
      price: "32.50FCFA/kg",
      stock: "3 kg",
      stockStyle: styles.badgeWarning,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Filet de bœuf",
      details: "Boucherie • Réf: B005",
      price: "24.90FCFA/kg",
      stock: "15 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Crevettes roses",
      details: "Poissonnerie • Réf: P012",
      price: "18.75FCFA/kg",
      stock: "8 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Poulet fermier",
      details: "Boucherie • Réf: B008",
      price: "12.50FCFA/kg",
      stock: "2 kg",
      stockStyle: styles.badgeWarning,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Truite arc-en-ciel",
      details: "Poissonnerie • Réf: P007",
      price: "14.20FCFA/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Truite arc-en-ciel",
      details: "Poissonnerie • Réf: P007",
      price: "14.20FCFA/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Côte de porc",
      details: "Poissonnerie • Réf: P007",
      price: "14.20FCFA/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
  ];

  //   Fonction modifier profil
  const modifierProduit = useCallback((index: number) => {
    setEditVisible(true);
    setIdProduit(index);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gestion des produits</Text>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="search" size={25} color={COLORS.light} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={() => setIsVisible(true)}
              >
                <Ionicons name="add-circle" size={25} color={COLORS.light} />
              </Pressable>
            </View>
          </View>
          <AjoutNouveauProduit
            visible={isVisible}
            onEditClose={() => setIsVisible(false)}
          />
          <EditProduit
            identifiant={idProduit}
            editVisible={editVisible}
            onEditClose={() => setEditVisible(false)}
          />
          {/* Contenu principal */}
          <ListProduits data={Produits} onSelectProduit={modifierProduit} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
