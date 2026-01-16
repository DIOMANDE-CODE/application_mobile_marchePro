import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { memo, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

// import des composants

// Déclaration des types
type Vente = {
  identifiant_vente: string;
  id: string;
  details_ventes: [];
  total_ttc: number;
};

type ListVentesProps = {
  data: Vente[];
  onSelectedId: (id: string) => void;
  onEndReached?: () => void;
};

const ListVentes = ({ data, onSelectedId, onEndReached }: ListVentesProps) => {

  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les ventes en fonction de la recherche
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    return data.filter(
      (vente) =>
        vente.identifiant_vente.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <FlatList
      style={styles.content}
      data={filteredData}
      initialNumToRender={10} // évite de tout charger d’un coup
      windowSize={5} // limite le nombre d’éléments gardés en mémoire
      removeClippedSubviews={true} // nettoie les vues invisibles
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>
            Aucune vente trouvée
          </Text>
        </View>
      }
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>{"Ventes du jour"}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Recherchez une vente</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 001"
              returnKeyType="search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"

            />
          </View>
        </>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelectedId(item.identifiant_vente)}>
          <View style={styles.saleItem}>
            <View style={styles.saleInfo}>
              <Text style={styles.saleDetails}>{item.details_ventes.length} {"produit(s) acheté(s)"}</Text>
              <Text style={styles.saleDetails}>Ref : {item.identifiant_vente} </Text>
            </View>
            <Text style={styles.saleAmount}>{formatMoneyFR(item.total_ttc)} FCFA</Text>
          </View>
        </Pressable>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
    />
  );
};

const styles = stylesCss;

export default memo(ListVentes);
