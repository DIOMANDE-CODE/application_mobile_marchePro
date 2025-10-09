import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Import des composants
import AjoutNouveauClient from "@/components/clients/add_client";
import EditClient from "@/components/clients/edit_client";

export default function Clients() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idClient, setIdClient] = useState<number | null>(null);

  //   Fonction modifier client
  const modifierClient = (id: number) => {
    setIdClient(id);
    setEditVisible(true);
  };

  const clients = [
    {
      id: 1,
      name: "Martin Dupont",
      email: "martin.dupont@email.com",
      phone: "06 12 34 56 78",
      purchases: 12,
      total: 1245.8,
      badge: "Fidèle",
    },
    {
      id: 2,
      name: "Sophie Leroy",
      email: "sophie.leroy@email.com",
      phone: "06 98 76 54 32",
      purchases: 8,
      total: 867.5,
    },
    {
      id: 3,
      name: "Pierre Moreau",
      email: "pierre.moreau@email.com",
      phone: "06 55 44 33 22",
      purchases: 3,
      total: 156.3,
    },
    {
      id: 4,
      name: "Élise Bernard",
      email: "elise.bernard@email.com",
      phone: "06 11 22 33 44",
      purchases: 5,
      total: 423.75,
      badge: "Fidèle",
    },
  ];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestion des clients</Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => setIsVisible(!isVisible)}
            >
              <Ionicons name="add-circle" size={25} color={COLORS.light} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="search" size={25} color={COLORS.light} />
            </Pressable>
          </View>
        </View>
        {isVisible && (
          <AjoutNouveauClient
            visible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        )}
        {editVisible && (
          <EditClient
            identifiant={idClient}
            editVisible={editVisible}
            onEditClose={() => setEditVisible(false)}
          />
        )}
        <FlatList
          style={styles.content}
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={styles.filters}>
              <TouchableOpacity
                style={[styles.filterBtn, styles.filterBtnActive]}
              >
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
              style={styles.listItem}
              onPress={() => modifierClient(item.id)}
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
