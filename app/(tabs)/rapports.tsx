import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Rapports() {
  const [filter, setFilter] = useState("Aujourd'hui");

  const stats = [
    { label: "Chiffre d'affaires", value: "1,250€" },
    { label: "Clients", value: "18" },
    { label: "Produits vendus", value: "42" },
    { label: "Panier moyen", value: "29.80€" },
  ];

  const topProducts = [
    { name: "Saumon frais", category: "Poissonnerie", sales: "420.50€" },
    { name: "Filet de bœuf", category: "Boucherie", sales: "398.75€" },
    { name: "Crevettes roses", category: "Poissonnerie", sales: "225.30€" },
  ];

  const filters = ["Aujourd'hui", "Semaine", "Mois", "Année"];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rapports et statistiques</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="download" size={20} color={COLORS.light} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* Filtres */}
            <View style={styles.filters}>
              {filters.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterBtn,
                    filter === f && styles.filterBtnActive,
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={filter === f ? styles.filterTextActive : undefined}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Statistiques */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>1,250€</Text>
                <Text style={styles.statLabel}>{"Chiffre d'affaire"}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>42</Text>
                <Text style={styles.statLabel}>Clients</Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statLabel}>Produits vendus</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Paniers moyens</Text>
              </View>
            </View>

            {/* Graphiques */}
            <View style={styles.chartContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {"Évolution du chiffre d'affaires"}
                </Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text>Graphique des ventes</Text>
              </View>
            </View>

            {/* Top produits */}
            <View style={styles.chartContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Top produits</Text>
              </View>
              {topProducts.map((p, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{p.name}</Text>
                    <Text style={styles.listItemSubtitle}>{p.category}</Text>
                  </View>
                  <Text style={styles.saleAmount}>{p.sales}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
