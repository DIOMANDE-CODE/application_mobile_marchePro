import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const screenwidth = Dimensions.get("window").width;

type top_produits = {
  produit__nom_produit: string;
  qte_vendue: number;
};

type statsJourType = {
  total_ventes_aujourd_hui: string;
  total_produits_en_stock: string;
  total_clients_aujourd_hui: string;
  nombre_produits_vendus_aujourd_hui: string;
  panier_moyen_aujourd_hui: string;
  top_produits_aujourd_hui: top_produits[];
};

type statsSemaineType = {
  total_ventes_semaine: string;
  total_produits_en_stock: string;
  total_clients_semaine: string;
  nombre_produits_vendus_semaine: string;
  panier_moyen_semaine: string;
  top_produits_semaine: top_produits[];
};

type statsMoisType = {
  total_ventes_mois: string;
  total_produits_en_stock: string;
  total_clients_mois: string;
  nombre_produits_vendus_mois: string;
  panier_moyen_mois: string;
  top_produits_mois: top_produits[];
};
export default function Rapports() {
  const [filter, setFilter] = useState("Aujourd'hui");
  const [statsDuJour, setStatsDuJour] = useState<statsJourType>();
  const [statsDeSemaine, setStatsDeSemaine] = useState<statsSemaineType>();
  const [statsDeMois, setStatsDeMois] = useState<statsMoisType>();
  const [loading, setLoading] = useState(false);

  // Afficher les statistiques du jour
  const stats_du_jour = async () => {
    try {
      const response = await api.get("/statistiques/du_jour/");
      if (response.status === 200) {
        const data = response.data;

        setStatsDuJour(data.data);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;

        if (status === 400) {
          Alert.alert("", message.errors || "Erreur de saisie");
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("", "Mot de passe incorrecte");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  // Afficher statistiques de la semaine
  const stats_de_semaine = async () => {
    try {
      const response = await api.get("/statistiques/de_semaine/");
      if (response.status === 200) {
        const data = response.data;

        setStatsDeSemaine(data.data);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;

        if (status === 400) {
          Alert.alert("", message.errors || "Erreur de saisie");
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("", "Mot de passe incorrecte");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  // Afficher statistiques du mois
  const stats_de_mois = async () => {
    try {
      const response = await api.get("/statistiques/de_mois/");
      if (response.status === 200) {
        const data = response.data;

        setStatsDeMois(data.data);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;

        if (status === 400) {
          Alert.alert("", message.errors || "Erreur de saisie");
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("", "Mot de passe incorrecte");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  // Graphiques et statistiques
  const dataJour = {
    labels: ["Caisse", "Clients", "Produits"],
    datasets: [
      {
        data: [
          parseFloat(statsDuJour?.total_ventes_aujourd_hui || "0"),
          parseFloat(statsDuJour?.total_clients_aujourd_hui || "0"),
          parseFloat(statsDuJour?.nombre_produits_vendus_aujourd_hui || "0"),
        ],
      },
    ],
  };

  // Graphiques et statistiques de la semaine
  const dataSemaine = {
    labels: ["Caisse", "Clients", "Produits"],
    datasets: [
      {
        data: [
          parseFloat(statsDeSemaine?.total_ventes_semaine || "0"),
          parseFloat(statsDeSemaine?.total_clients_semaine || "0"),
          parseFloat(statsDeSemaine?.nombre_produits_vendus_semaine || "0"),
        ],
      },
    ],
  };

  // Graphiques et statistiques du mois
  const dataMois = {
    labels: ["Caisse", "Clients", "Produits"],
    datasets: [
      {
        data: [
          parseFloat(statsDeMois?.total_ventes_mois || "0"),
          parseFloat(statsDeMois?.total_clients_mois || "0"),
          parseFloat(statsDeMois?.nombre_produits_vendus_mois || "0"),
        ],
      },
    ],
  };

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    stats_du_jour();
    stats_de_semaine();
    stats_de_mois();
    setLoading(false);
  }

  const filters = ["Aujourd'hui", "Semaine", "Mois"];
  useEffect(() => {
    stats_du_jour();
    stats_de_semaine();
    stats_de_mois();
  }, []);

  if (loading) return (<ActivityIndicator size="large" color={COLORS.primary} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rapports</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={()=>{refreshPage}}>
                <Ionicons name="reload-circle" size={35} color={COLORS.light} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="download" size={35} color={COLORS.light} />
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

            {filter === "Aujourd'hui" ? (
              <>
                {/* Statistiques du jour */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDuJour?.total_ventes_aujourd_hui} FCFA
                    </Text>
                    <Text style={styles.statLabel}>{"Caisse"}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDuJour?.total_clients_aujourd_hui}
                    </Text>
                    <Text style={styles.statLabel}>Clients</Text>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDuJour?.nombre_produits_vendus_aujourd_hui}
                    </Text>
                    <Text style={styles.statLabel}>Produits vendus</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {Number(statsDuJour?.panier_moyen_aujourd_hui).toFixed(2)}
                    </Text>
                    <Text style={styles.statLabel}>Paniers moyens</Text>
                  </View>
                </View>
                {/* Graphiques */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{"Graphisme du jour"}</Text>
                  </View>
                  <View>
                    <BarChart
                      data={dataJour}
                      width={screenwidth - 100}
                      height={250}
                      yAxisLabel="" // préfixe si tu veux mettre "FCFA" avant le nombre
                      yAxisSuffix="" // suffixe obligatoire (même vide "")
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 8 },
                      }}
                      style={{ marginVertical: 8, borderRadius: 8 }}
                    />
                  </View>
                </View>
                {/* Top produits */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Top 3 produits vendus</Text>
                  </View>
                  {statsDuJour?.top_produits_aujourd_hui ? (
                    statsDuJour?.top_produits_aujourd_hui.map((p, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>
                            {p.produit__nom_produit}
                          </Text>
                        </View>
                        <Text style={styles.saleAmount}>
                          {p.qte_vendue} {"vendu(s)"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ padding: 10, color: "#555" }}>
                      {"Aucun produit vendu aujourd'hui"}
                    </Text>
                  )}
                </View>
              </>
            ) : filter === "Semaine" ? (
              <>
                {/* Statistiques de la semaine */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeSemaine?.total_ventes_semaine} FCFA
                    </Text>
                    <Text style={styles.statLabel}>{"Caisse"}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeSemaine?.total_clients_semaine}
                    </Text>
                    <Text style={styles.statLabel}>Clients</Text>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeSemaine?.nombre_produits_vendus_semaine}
                    </Text>
                    <Text style={styles.statLabel}>Produits vendus</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {Number(statsDeSemaine?.panier_moyen_semaine).toFixed(2)} FCFA
                    </Text>
                    <Text style={styles.statLabel}>Paniers moyens</Text>
                  </View>
                </View>
                {/* Graphiques */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {"Graphisme de la semaine"}
                    </Text>
                  </View>
                  <View>
                    <BarChart
                      data={dataSemaine}
                      width={screenwidth - 100}
                      height={250}
                      yAxisLabel="" // préfixe si tu veux mettre "FCFA" avant le nombre
                      yAxisSuffix="" // suffixe obligatoire (même vide "")
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 8 },
                      }}
                      style={{ marginVertical: 8, borderRadius: 8 }}
                    />
                  </View>
                </View>
                {/* Top produits */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Top 3 produits vendus</Text>
                  </View>
                  {statsDeSemaine?.top_produits_semaine ? (
                    statsDeSemaine?.top_produits_semaine.map((p, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>
                            {p.produit__nom_produit}
                          </Text>
                        </View>
                        <Text style={styles.saleAmount}>
                          {p.qte_vendue} {"vendu(s)"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ padding: 10, color: "#555" }}>
                      {"Aucun produit vendu cette semaine"}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Statistiques du mois */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeMois?.total_ventes_mois} FCFA
                    </Text>
                    <Text style={styles.statLabel}>{"Caisse"}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeMois?.total_clients_mois}
                    </Text>
                    <Text style={styles.statLabel}>Clients</Text>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {statsDeMois?.nombre_produits_vendus_mois}
                    </Text>
                    <Text style={styles.statLabel}>Produits vendus</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {Number(statsDeMois?.panier_moyen_mois).toFixed(2)} FCFA
                    </Text>
                    <Text style={styles.statLabel}>Paniers moyens</Text>
                  </View>
                </View>
                {/* Graphiques */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {"Graphisme du mois"}
                    </Text>
                  </View>
                  <View>
                    <BarChart
                      data={dataMois}
                      width={screenwidth - 100}
                      height={250}
                      yAxisLabel="" // préfixe si tu veux mettre "FCFA" avant le nombre
                      yAxisSuffix="" // suffixe obligatoire (même vide "")
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 8 },
                      }}
                      style={{ marginVertical: 8, borderRadius: 8 }}
                    />
                  </View>
                </View>
                {/* Top produits */}
                <View style={styles.chartContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Top 3 produits vendus</Text>
                  </View>
                  {statsDeMois?.top_produits_mois ? (
                    statsDeMois?.top_produits_mois.map((p, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>
                            {p.produit__nom_produit}
                          </Text>
                        </View>
                        <Text style={styles.saleAmount}>
                          {p.qte_vendue} {"vendu(s)"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ padding: 10, color: "#555" }}>
                      {"Aucun produit vendu cette semaine"}
                    </Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
