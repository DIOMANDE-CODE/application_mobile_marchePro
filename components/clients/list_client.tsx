import { stylesCss } from "@/styles/styles";
import { memo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

// Import des composants

// Declaration des types
type Client = {
  identifiant_client:string;
  nom_client:string,
  numero_telephone_client:string
};

type ListeDesClientsProps = {
  data: Client[];
  onSelectedId: (id: string) => void;
};

const ListeDesClients = ({ data, onSelectedId }: ListeDesClientsProps) => {
  return (
    <FlatList
      style={styles.content}
      data={data}
      keyExtractor={(item) => item.identifiant_client.toString()}
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>Aucun client trouvé</Text>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.filters}>
          <TouchableOpacity style={[styles.filterBtn, styles.filterBtnActive]}>
            <Text style={styles.textLight}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text>Fidèles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text>Nouveaux</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.identifiant_client}
          style={styles.productCard}
          onPress={() => onSelectedId(item.identifiant_client)}
        >
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>Nom & Prénoms: </Text><Text style={[styles.listItemTitle, { fontWeight: "bold" }]}>{item.nom_client}</Text>
            <Text style={styles.listItemTitle}>Numéro: </Text><Text style={[styles.listItemTitle, { fontWeight: "bold" }]}>
              {item.numero_telephone_client}
            </Text>
            {/* <Text style={styles.listItemSubtitle}>
              {item.purchases} achats • {item.total.toFixed(2)}€ total
            </Text> */}
          </View>
          {/* {item.badge && (
            <TouchableOpacity style={[styles.badge, styles.badgePrimary]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </TouchableOpacity>
          )} */}
        </TouchableOpacity>
      )}
    />
  );
};

const styles = stylesCss;

export default memo(ListeDesClients);
