import { stylesCss } from "@/styles/styles";
import { memo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

// import des composants

// Déclaration des types
type Vente = {
  id: string;
  client: string;
  details: string;
  amount: number;
};

type ListVentesProps = {
  data: Vente[];
  onSelectedId: () => void;
};

const ListVentes = ({ data, onSelectedId }: ListVentesProps) => {
  return (
    <FlatList
      style={styles.content}
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <Text style={styles.sectionTitle}>{"Ventes du jour"}</Text>
      }
      renderItem={({ item }) => (
        <Pressable onPress={onSelectedId}>
          <View style={styles.saleItem}>
            <View style={styles.saleInfo}>
              <Text style={styles.saleClient}>{item.client}</Text>
              <Text style={styles.saleDetails}>{item.details}</Text>
            </View>
            <Text style={styles.saleAmount}>{item.amount.toFixed(2)}€</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = stylesCss;

export default memo(ListVentes);
