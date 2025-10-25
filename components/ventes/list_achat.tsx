import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { memo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

// import des composants

// Déclaration des types
type Client = {
  nom_client: string;
};
type Vente = {
  identifiant_vente: string;
  id: string;
  client: Client;
  details: [];
  total_ttc: number;
};

type ListVentesProps = {
  data: Vente[];
  onSelectedId: (id:string) => void;
};

const ListVentes = ({ data, onSelectedId }: ListVentesProps) => {
  return (
    <FlatList
      style={styles.content}
      data={data}
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
        <Text style={styles.sectionTitle}>{"Ventes du jour"}</Text>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelectedId(item.identifiant_vente)}>
          <View style={styles.saleItem}>  
            <View style={styles.saleInfo}>
              <Text style={styles.saleClient}>{item.client.nom_client}</Text>
              <Text style={styles.saleDetails}>{item.details.length} {"produit(s) acheté(s)"}</Text>
            </View>
            <Text style={styles.saleAmount}>{formatMoneyFR(item.total_ttc)} FCFA</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = stylesCss;

export default memo(ListVentes);
