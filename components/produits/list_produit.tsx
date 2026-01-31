import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Image } from "expo-image";
import { memo, useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

// Declaration des types

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
  thumbnail:string
};

type ListProduitsProps = {
  data: Produit[];
  onSelectProduit: (index: string) => void;
  onEndReached: () => void;
};

const ListProduits = ({ data, onSelectProduit, onEndReached }: ListProduitsProps) => {

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((produit) =>
      produit.nom_produit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);


  const renderItem = useCallback(({ item }: { item: Produit }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => onSelectProduit(item.identifiant_produit)}
    >
      <Image
        cachePolicy="memory-disk"
        transition={200}
        contentFit="cover"
        style={styles.productImage}
        source={{ uri: `${item.thumbnail}` }}
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
  ), [onSelectProduit])

  return (
    <FlatList
      style={styles.content}
      keyExtractor={(item) => item.identifiant_produit}
      data={filteredData}
      initialNumToRender={5} // évite de tout charger d’un coup
      windowSize={21} // limite le nombre d’éléments gardés en mémoire
      removeClippedSubviews={true} // nettoie les vues invisibles
      maxToRenderPerBatch={10}
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
              value={searchQuery} onChangeText={setSearchQuery}
            />
          </View>
        </>
      }
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
    />
  );
};

const styles = stylesCss;

export default memo(ListProduits);
