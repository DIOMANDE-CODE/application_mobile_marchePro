import CONFIG from "@/constants/config";
import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Image } from "expo-image";
import { memo, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

// Déclaration des types
type Categorie = {
  identifiant_categorie: string;
  nom_categorie: string;
};

type Produit = {
  identifiant_produit: string;
  image_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
  seuil_alerte_produit: number;
  categorie_produit: Categorie;
};

type ListProduitsProps = {
  data: Produit[];
  onSelectProduit: (index: string) => void;
  onEndReached: () => void;
};

const ListProduits = ({ data, onSelectProduit, onEndReached }: ListProduitsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les produits en fonction de la recherche
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    return data.filter(
      (produit) =>
        produit.nom_produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        produit.categorie_produit.nom_categorie.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <FlatList
      style={styles.content}
      keyExtractor={(item) => item.identifiant_produit}
      data={filteredData}
      initialNumToRender={5} // évite de tout charger d’un coup
      windowSize={5} // limite le nombre d’éléments gardés en mémoire
      removeClippedSubviews={true} // nettoie les vues invisibles
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>Aucun produit trouvé</Text>
        </View>
      }
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>{"Liste des articles"}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Recherchez un produit</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Saucisse"
              returnKeyType="search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.productCard}
          onPress={() => onSelectProduit(item.identifiant_produit)}
        >
          <Image
            cachePolicy="memory-disk"
            transition={200}
            contentFit="cover"
            style={styles.productImage}
            source={{ uri: `${CONFIG.API_IMAGE_BASE_URL}${item.image_produit}` }}
          />
          <View style={styles.productInfo}>
            <Text>Nom: </Text>
            <Text style={[styles.productName, { fontWeight: "bold" }]}>{item.nom_produit}</Text>

            <Text>Prix unitaire: </Text>
            <Text style={[styles.productPrice, { fontWeight: "bold" }]}>
              {formatMoneyFR(item.prix_unitaire_produit)} FCFA
            </Text>

            <Text>Catégorie: </Text>
            <Text style={[styles.productName, { fontWeight: "bold" }]}>
              {item.categorie_produit.nom_categorie}
            </Text>
          </View>
          {item.quantite_produit_disponible <= item.seuil_alerte_produit ? (
            <Text style={[styles.productStock, styles.badgeWarning]}>
              {item.quantite_produit_disponible}
            </Text>
          ) : (
            <Text style={[styles.productStock, styles.badgeSuccess]}>
              {item.quantite_produit_disponible}
            </Text>
          )}
        </Pressable>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
    />
  );
};

const styles = stylesCss;

export default memo(ListProduits);
