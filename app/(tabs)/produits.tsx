import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouveauProduit from "@/components/produits/add_produit";
import EditProduit from "@/components/produits/edit_produit";

export default function Produits() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idProduit, setIdProduit] = useState<number | null>(null);

  const Produits = [
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Saumon frais",
      details: "Poissonnerie • Réf: P001",
      price: "32.50€/kg",
      stock: "3 kg",
      stockStyle: styles.badgeWarning,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Filet de bœuf",
      details: "Boucherie • Réf: B005",
      price: "24.90€/kg",
      stock: "15 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Crevettes roses",
      details: "Poissonnerie • Réf: P012",
      price: "18.75€/kg",
      stock: "8 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Poulet fermier",
      details: "Boucherie • Réf: B008",
      price: "12.50€/kg",
      stock: "2 kg",
      stockStyle: styles.badgeWarning,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Truite arc-en-ciel",
      details: "Poissonnerie • Réf: P007",
      price: "14.20€/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/poisson.jpg"),
      name: "Truite arc-en-ciel",
      details: "Poissonnerie • Réf: P007",
      price: "14.20€/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
    {
      image: require("@/assets/produits/viande.jpg"),
      name: "Côte de porc",
      details: "Poissonnerie • Réf: P007",
      price: "14.20€/kg",
      stock: "12 kg",
      stockStyle: styles.badgeSuccess,
    },
  ];

  //   Fonction modifier profil
  const modifierProfil = useCallback((index: number) => {
    setEditVisible(true);
    setIdProduit(index);
  },[]);
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
          <FlatList
            style={styles.content}
            data={Produits}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.filters}>
                <Pressable style={[styles.filterBtn, styles.filterBtnActive]}>
                  <Text style={styles.textLight}>Tous</Text>
                </Pressable>
                <Pressable style={styles.filterBtn}>
                  <Text>Poissonnerie</Text>
                </Pressable>
                <Pressable style={styles.filterBtn}>
                  <Text>Boucherie</Text>
                </Pressable>
                <Pressable style={styles.filterBtn}>
                  <Text>Stocks faibles</Text>
                </Pressable>
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.productCard}
                onPress={() => modifierProfil(index)}
              >
                <Image style={styles.productImage} source={item.image} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDetails}>{item.details}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
                <Text style={[styles.productStock, item.stockStyle]}>
                  {item.stock}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
