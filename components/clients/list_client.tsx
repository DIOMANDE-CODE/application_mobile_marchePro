import { stylesCss } from "@/styles/styles";
import { memo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

// Import des composants

// Declaration des types
type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  purchases: number;
  total: number;
  badge?: string;
};

type ListeDesClientsProps = {
  data: Client[];
  onSelectedId: (id: number) => void;
};

const ListeDesClients = ({ data, onSelectedId }: ListeDesClientsProps) => {
  return (
    <FlatList
      style={styles.content}
      data={data}
      keyExtractor={(item) => item.id.toString()}
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
          key={item.id}
          style={styles.productCard}
          onPress={() => onSelectedId(item.id)}
        >
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{item.name}</Text>
            <Text style={styles.listItemSubtitle}>
              {item.email} • {item.phone}
            </Text>
            <Text style={styles.listItemSubtitle}>
              {item.purchases} achats • {item.total.toFixed(2)}€ total
            </Text>
          </View>
          {item.badge && (
            <TouchableOpacity style={[styles.badge, styles.badgePrimary]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
    />
  );
};

const styles = stylesCss;

export default memo(ListeDesClients);
