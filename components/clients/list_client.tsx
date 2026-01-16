import { stylesCss } from "@/styles/styles";
import { formatDateHeureFR } from "@/utils/dateFormat";
import { memo, useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

// Import des composants

// Declaration des types
type Client = {
  identifiant_client: string;
  nom_client: string;
  numero_telephone_client: string;
  date_creation: string;
};

type ListeDesClientsProps = {
  data: Client[];
  onSelectedId: (id: string) => void;
  onEndReached: () => void;
};

const ListeDesClients = ({ data, onSelectedId, onEndReached }: ListeDesClientsProps) => {

  const [searchQuery, setSearchQuery] = useState("");
  
    // Filtrer les clients en fonction de la recherche
    const filteredData = useMemo(() => {
      if (!searchQuery.trim()) {
        return data;
      }
      return data.filter(
        (client) =>
          client.nom_client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.numero_telephone_client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [data, searchQuery]);

  return (
    <FlatList
      style={styles.content}
      data={filteredData}
      initialNumToRender={10} // évite de tout charger d’un coup
      windowSize={5} // limite le nombre d’éléments gardés en mémoire
      removeClippedSubviews={true} // nettoie les vues invisibles
      keyExtractor={(item) => item.identifiant_client.toString()}
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>
            Aucun client trouvé
          </Text>
        </View>
      }
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>{"Clients du jour"}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Recherchez un client</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Yao Amoin"
              returnKeyType="search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.identifiant_client}
          style={styles.productCard}
          onPress={() => onSelectedId(item.identifiant_client)}
        >
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>Nom & Prénoms: </Text>
            <Text style={[styles.listItemTitle, { fontWeight: "bold" }]}>
              {item.nom_client}
            </Text>
            <Text style={styles.listItemTitle}>Numéro: </Text>
            <Text style={[styles.listItemTitle, { fontWeight: "bold" }]}>
              {item.numero_telephone_client}
            </Text>
            <Text style={styles.listItemTitle}>{"Date et heure d'enregistrement :"} </Text>
            <Text style={[styles.listItemTitle, { fontWeight: "bold" }]}>
              {formatDateHeureFR(item.date_creation)}
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
    />
  );
};

const styles = stylesCss;

export default memo(ListeDesClients);
