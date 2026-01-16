import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const screenwidth = Dimensions.get("window").width;

type TopProduit = {
  id?: number;
  produit__nom_produit: string;
  produit__identifiant_produit: number;
  total_qty: number;
};

type VueEnsembleVentes = {
  chiffre_affaires: number;
  nombre_ventes: number;
  produits_plus_vendus: TopProduit[];
  marge_beneficiaire_estimee: number;
};

type ComparaisonPeriodePrecedente = {
  ca_evolution: number; // pourcentage (ex: 12.5 pour +12.5%)
  ventes_evolution: number; // pourcentage
  ca_periode_actuelle?: number; // valeur absolue période actuelle
  ca_periode_precedente?: number; // valeur absolue période précédente
  // compatibilité ascendante: certains backends peuvent encore renvoyer l'ancien schéma
  chiffre_affaires_variation?: number;
  nombre_ventes_variation?: number;
  tendance?: "hausse" | "baisse" | "stable";
};

type CommandesEnCours = {
  total_commande: number;
  en_cours: number;
  en_livraison: number;
  livrees: number;
  annulees: number;
  valeur_commande_en_livraison: number;
  valeur_commande_en_cours: number;
  valeur_commande_annulees: number;
};

type ProduitsStock = {
  total_stock: number;
  alerte_faible_stock: number;
  rupture_stock: number;
};

type ClientsStats = {
  total: number;
  nouveaux_clients: number;
  actifs: number;
};

type StatsApiResponse = {
  periode: "jour" | "semaine" | "mois";
  date?: string;
  date_debut?: string;
  date_fin?: string;
  vue_ensemble_ventes: VueEnsembleVentes;
  comparaison_periode_precedente: ComparaisonPeriodePrecedente;
  commandes_en_cours: CommandesEnCours;
  produits_stock: ProduitsStock;
  clients: ClientsStats;
};
export default function Rapports() {
  const [filter, setFilter] = useState("Aujourd'hui");
  const [statsDuJour, setStatsDuJour] = useState<StatsApiResponse>();
  const [statsDeSemaine, setStatsDeSemaine] = useState<StatsApiResponse>();
  const [statsDeMois, setStatsDeMois] = useState<StatsApiResponse>();
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
          Alert.alert("", "Non autorisé");
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
          Alert.alert("", "Non autorisé");
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
          Alert.alert("", "Non autorisé");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  // Graphiques et statistiques
  const dataJourVente = {
    labels: ["Ventes", "Marge", ""],
    datasets: [
      {
        data: [
          statsDuJour?.vue_ensemble_ventes.chiffre_affaires || 0,
          statsDuJour?.vue_ensemble_ventes.marge_beneficiaire_estimee || 0,
          0,
        ],
      },
    ],
  };

  const dataJourClient = {
    labels: ["Clients", ""],
    datasets: [
      {
        data: [
          statsDuJour?.clients.nouveaux_clients || 0,
          0,
        ],
      },
    ],
  };

  // Graphiques et statistiques de la semaine
  const dataSemaine = {
    labels: ["Ventes", "Marge", "Clients"],
    datasets: [
      {
        data: [
          statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 0,
          statsDeSemaine?.vue_ensemble_ventes.marge_beneficiaire_estimee || 0,
          statsDeSemaine?.clients.total || 0,
        ],
      },
    ],
  };

  // Graphiques et statistiques du mois
  const dataMois = {
    labels: ["Ventes", "Marge", "Clients"],
    datasets: [
      {
        data: [
          statsDeMois?.vue_ensemble_ventes.chiffre_affaires || 0,
          statsDeMois?.vue_ensemble_ventes.marge_beneficiaire_estimee || 0,
          statsDeMois?.clients.total || 0,
        ],
      },
    ],
  };

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    setTimeout(() => {
      stats_du_jour();
      stats_de_semaine();
      stats_de_mois();
      setLoading(false);
    }, 500);
  }

  const filters = ["Aujourd'hui", "Semaine", "Mois"];
  useEffect(() => {
    stats_du_jour();
    stats_de_semaine();
    stats_de_mois();
  }, []);

  if (loading) return (<ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rapports</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => { refreshPage() }}>
                <Ionicons name="reload-circle" size={35} color={COLORS.light} />
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
                {/* Statistiques du jour - Vue ensemble ventes */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.vue_ensemble_ventes.chiffre_affaires}
                      </Text>
                      <Text style={styles.statLabel}>{"Chiffre d'affaire (FCFA)"}</Text>
                    </Pressable>
                  </View>

                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.vue_ensemble_ventes.nombre_ventes}
                      </Text>
                      <Text style={styles.statLabel}>
                        {"Ventes"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.vue_ensemble_ventes.marge_beneficiaire_estimee}
                      </Text>
                      <Text style={styles.statLabel}>{"Marge Béneficiaire (FCFA)"}</Text>
                    </Pressable>
                  </View>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.clients.nouveaux_clients}
                      </Text>
                      <Text style={styles.statLabel}>{"Nouveaux clients"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.commandes_en_cours.valeur_commande_en_cours}
                      </Text>
                      <Text style={styles.statLabel}>{"Valeur des commandes en cours (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                     <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.commandes_en_cours.valeur_commande_en_livraison}
                      </Text>
                      <Text style={styles.statLabel}>{"valeur des commandes en cours de livraison (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.commandes_en_cours.valeur_commande_annulees}
                      </Text>
                      <Text style={styles.statLabel}>{"Valeur des commandes annulées (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Comparaison avec période précédente */}
                <ComparisonCard
                  comparaison={statsDuJour?.comparaison_periode_precedente}
                  titre="Comparaison avec hier"
                />

                {/* Statut des commandes */}
                <StatusCard
                  title="État des Commandes"
                  icon="package-variant-closed"
                  data={[
                    { label: "Annulées", value: statsDuJour?.commandes_en_cours.annulees || 0, color: "#6c757d" },
                    { label: "En livraison", value: statsDuJour?.commandes_en_cours.en_livraison || 0, color: "#FFA502" },
                    { label: "En cours", value: statsDuJour?.commandes_en_cours.en_cours || 0, color: "#FF6B6B" },
                    { label: "Livrées", value: statsDuJour?.commandes_en_cours.livrees || 0, color: "#26D07C" },
                    { label: "Total", value: statsDuJour?.commandes_en_cours.total_commande || 0, color: "#4ECDC4" },
                  ]}
                />

                {/* Statut du stock */}
                <StatusCard
                  title="État du Stock"
                  icon="warehouse"
                  data={[
                    { label: "Total", value: statsDuJour?.produits_stock.total_stock || 0, color: "#4ECDC4" },
                    { label: "Faible stock", value: statsDuJour?.produits_stock.alerte_faible_stock || 0, color: "#FFA502" },
                    { label: "Rupture", value: statsDuJour?.produits_stock.rupture_stock || 0, color: "#FF6B6B" },
                  ]}
                />

                {/* Graphiques des ventes */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.primary} />
                    <Text style={customStyles.cardTitle}>Statistiques des ventes</Text>
                  </View>
                  <View>
                    <BarChart
                      data={dataJourVente}
                      width={screenwidth - 50}
                      height={280}
                      yAxisLabel=""
                      yAxisSuffix=""
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#f9f9f9",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 47, 85, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(50, 50, 50, ${opacity})`,
                        style: { borderRadius: 8 },
                        barPercentage: 0.7,
                      }}
                      style={{ marginVertical: 12, borderRadius: 8 }}
                    />
                  </View>
                </View>


                {/* Graphiques des ventes */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.primary} />
                    <Text style={customStyles.cardTitle}>Statistiques des clients</Text>
                  </View>
                  <View>
                    <BarChart
                      data={dataJourClient}
                      width={screenwidth - 50}
                      height={280}
                      yAxisLabel=""
                      yAxisSuffix=""
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#f9f9f9",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(50, 50, 50, ${opacity})`,
                        style: { borderRadius: 8 },
                        barPercentage: 0.7,
                      }}
                      style={{ marginVertical: 12, borderRadius: 8 }}
                    />
                  </View>
                </View>

                {/* Top produits du jour */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />
                    <Text style={customStyles.cardTitle}>Top produits vendus</Text>
                  </View>
                  {statsDuJour?.vue_ensemble_ventes.produits_plus_vendus && statsDuJour.vue_ensemble_ventes.produits_plus_vendus.length > 0 ? (
                    statsDuJour?.vue_ensemble_ventes.produits_plus_vendus.slice(0, 3).map((p, idx) => (
                      <TopProductItem key={idx} index={idx} product={p} />
                    ))
                  ) : (
                    <Text style={customStyles.emptyText}>
                      Aucun produit vendu aujourd'hui
                    </Text>
                  )}
                </View>
              </>
            ) : filter === "Semaine" ? (
              <>
                {/* Statistiques de la semaine */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires}
                      </Text>
                      <Text style={styles.statLabel}>{"Chiffre d'affaire (FCFA)"}</Text>
                    </Pressable>
                  </View>

                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.vue_ensemble_ventes.nombre_ventes}
                      </Text>
                      <Text style={styles.statLabel}>
                        {"Vente"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.vue_ensemble_ventes.marge_beneficiaire_estimee}
                      </Text>
                      <Text style={styles.statLabel}>{"Marge Béneficiaire (FCFA)"}</Text>
                    </Pressable>
                  </View>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.clients.nouveaux_clients}
                      </Text>
                      <Text style={styles.statLabel}>{"Nouveaux clients"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.commandes_en_cours.valeur_commande_en_cours}
                      </Text>
                      <Text style={styles.statLabel}>{"Valeur des commandes en cours (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeSemaine?.commandes_en_cours.valeur_commande_en_livraison}
                      </Text>
                      <Text style={styles.statLabel}>{"valeur des commandes en cours de livraison (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                     <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.commandes_en_cours.valeur_commande_annulees}
                      </Text>
                      <Text style={styles.statLabel}>{"valeur des commandes annulées (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Comparaison avec période précédente */}
                <ComparisonCard
                  comparaison={statsDeSemaine?.comparaison_periode_precedente}
                  titre="Comparaison avec semaine précédente"
                />

                {/* Statut des commandes */}
                <StatusCard
                  title="État des Commandes"
                  icon="package-variant-closed"
                  data={[
                    { label: "Annulées", value: statsDeSemaine?.commandes_en_cours.annulees || 0, color: "#6c757d" },
                    { label: "En livraison", value: statsDeSemaine?.commandes_en_cours.en_livraison || 0, color: "#FFA502" },
                    { label: "En cours", value: statsDeSemaine?.commandes_en_cours.en_cours || 0, color: "#FF6B6B" },
                    { label: "Livrées", value: statsDeSemaine?.commandes_en_cours.livrees || 0, color: "#26D07C" },
                    { label: "Total", value: statsDeSemaine?.commandes_en_cours.total_commande || 0, color: "#4ECDC4" },
                  ]}
                />

                {/* Statut du stock */}
                <StatusCard
                  title="État du Stock"
                  icon="warehouse"
                  data={[
                    { label: "Total", value: statsDeSemaine?.produits_stock.total_stock || 0, color: "#4ECDC4" },
                    { label: "Faible stock", value: statsDeSemaine?.produits_stock.alerte_faible_stock || 0, color: "#FFA502" },
                    { label: "Rupture", value: statsDeSemaine?.produits_stock.rupture_stock || 0, color: "#FF6B6B" },
                  ]}
                />

                {/* Graphiques */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.primary} />
                    <Text style={customStyles.cardTitle}>Performance du chiffre d'affaire</Text>
                  </View>
                  <View>
                    <LineChart
                      data={{
                        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                        datasets: [
                          {
                            data: [
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              Math.random() * (statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000),
                              statsDeSemaine?.vue_ensemble_ventes.chiffre_affaires || 1000,
                            ],
                          },
                        ],
                      }}
                      width={screenwidth - 50}
                      height={280}
                      yAxisLabel=""
                      yAxisSuffix=""
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#f9f9f9",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(76, 205, 196, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(50, 50, 50, ${opacity})`,
                        style: { borderRadius: 8 },
                        propsForDots: {
                          r: "6",
                          strokeWidth: "2",
                          stroke: "#4ECDC4"
                        }
                      }}
                      style={{ marginVertical: 12, borderRadius: 8 }}
                    />
                  </View>
                </View>

                {/* Top produits semaine */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />
                    <Text style={customStyles.cardTitle}>Top produits de la semaine</Text>
                  </View>
                  {statsDeSemaine?.vue_ensemble_ventes.produits_plus_vendus && statsDeSemaine.vue_ensemble_ventes.produits_plus_vendus.length > 0 ? (
                    statsDeSemaine?.vue_ensemble_ventes.produits_plus_vendus.slice(0, 3).map((p, idx) => (
                      <TopProductItem key={idx} index={idx} product={p} />
                    ))
                  ) : (
                    <Text style={customStyles.emptyText}>
                      Aucun produit vendu cette semaine
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Statistiques du mois */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.vue_ensemble_ventes.chiffre_affaires}
                      </Text>
                      <Text style={styles.statLabel}>{"Chiffre d'affaire (FCFA)"}</Text>
                    </Pressable>
                  </View>

                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.vue_ensemble_ventes.nombre_ventes}
                      </Text>
                      <Text style={styles.statLabel}>
                        {"Vente"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.vue_ensemble_ventes.marge_beneficiaire_estimee}
                      </Text>
                      <Text style={styles.statLabel}>{"Marge Béneficiaire (FCFA)"}</Text>
                    </Pressable>
                  </View>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.clients.nouveaux_clients}
                      </Text>
                      <Text style={styles.statLabel}>{"Nouveaux clients"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.commandes_en_cours.valeur_commande_en_cours}
                      </Text>
                      <Text style={styles.statLabel}>{"Valeur des commandes en cours (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDeMois?.commandes_en_cours.valeur_commande_en_livraison}
                      </Text>
                      <Text style={styles.statLabel}>{"valeur des commandes en cours de livraison (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>
                     <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.statValue}>
                        {statsDuJour?.commandes_en_cours.valeur_commande_annulees}
                      </Text>
                      <Text style={styles.statLabel}>{"valeur des commandes annulées (FCFA)"}</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Comparaison avec période précédente */}
                <ComparisonCard
                  comparaison={statsDeMois?.comparaison_periode_precedente}
                  titre="Comparaison avec mois précédent"
                />

                {/* Statut des commandes */}
                <StatusCard
                  title="État des Commandes"
                  icon="package-variant-closed"
                  data={[
                    { label: "Annulées", value: statsDeMois?.commandes_en_cours.annulees || 0, color: "#6c757d" },
                    { label: "En livraison", value: statsDeMois?.commandes_en_cours.en_livraison || 0, color: "#FFA502" },
                    { label: "En cours", value: statsDeMois?.commandes_en_cours.en_cours || 0, color: "#FF6B6B" },
                    { label: "Livrées", value: statsDeMois?.commandes_en_cours.livrees || 0, color: "#26D07C" },
                    { label: "Total", value: statsDeMois?.commandes_en_cours.total_commande || 0, color: "#4ECDC4" },
                  ]}
                />

                {/* Statut du stock */}
                <StatusCard
                  title="État du Stock"
                  icon="warehouse"
                  data={[
                    { label: "Total", value: statsDeMois?.produits_stock.total_stock || 0, color: "#4ECDC4" },
                    { label: "Faible stock", value: statsDeMois?.produits_stock.alerte_faible_stock || 0, color: "#FFA502" },
                    { label: "Rupture", value: statsDeMois?.produits_stock.rupture_stock || 0, color: "#FF6B6B" },
                  ]}
                />

                {/* Graphiques */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="chart-pie" size={24} color={COLORS.primary} />
                    <Text style={customStyles.cardTitle}>Distribution des ventes</Text>
                  </View>
                  <View style={{ alignItems: 'center', marginVertical: 12 }}>
                    <PieChart
                      data={[
                        {
                          name: "Ventes",
                          population: statsDeMois?.vue_ensemble_ventes.chiffre_affaires || 1,
                          color: "#FF6B6B",
                          legendFontColor: "#333",
                          legendFontSize: 12,
                        },
                        {
                          name: "Marge",
                          population: statsDeMois?.vue_ensemble_ventes.marge_beneficiaire_estimee || 1,
                          color: "#FFA502",
                          legendFontColor: "#333",
                          legendFontSize: 12,
                        },
                      ]}
                      width={screenwidth - 50}
                      height={280}
                      chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#f9f9f9",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 8 },
                      }}
                      style={{ marginVertical: 0, borderRadius: 8 }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="35"
                    />
                  </View>
                </View>

                {/* Top produits mois */}
                <View style={customStyles.chartContainer}>
                  <View style={customStyles.cardHeader}>
                    <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />
                    <Text style={customStyles.cardTitle}>Top produits du mois</Text>
                  </View>
                  {statsDeMois?.vue_ensemble_ventes.produits_plus_vendus && statsDeMois.vue_ensemble_ventes.produits_plus_vendus.length > 0 ? (
                    statsDeMois?.vue_ensemble_ventes.produits_plus_vendus.slice(0, 3).map((p, idx) => (
                      <TopProductItem key={idx} index={idx} product={p} />
                    ))
                  ) : (
                    <Text style={customStyles.emptyText}>
                      Aucun produit vendu ce mois
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

// Composant pour les cartes statistiques améliorées
interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
}

function StatCard({ title, value, unit, icon, color }: StatCardProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          customStyles.statCard,
          {
            transform: [{ scale: scaleAnim }],
            borderLeftColor: color,
          },
        ]}
      >
        <View style={customStyles.statCardHeader}>
          <View
            style={[
              customStyles.statIconContainer,
              { backgroundColor: `${color}20` },
            ]}
          >
            <MaterialCommunityIcons name={icon as any} size={28} color={color} />
          </View>
          <Text style={customStyles.statCardTitle}>{title}</Text>
        </View>
        <View style={customStyles.statCardContent}>
          <Text style={customStyles.statCardValue}>{value}</Text>
          {unit && <Text style={customStyles.statCardUnit}>{unit}</Text>}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// Composant pour afficher les meilleurs produits
interface TopProductItemProps {
  index: number;
  product: TopProduit;
}

function TopProductItem({ index, product }: TopProductItemProps) {
  const medals = ["🥇", "🥈", "🥉"];
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <View style={customStyles.topProductItem}>
      <View style={customStyles.topProductRank}>
        <Text style={customStyles.topProductMedal}>{medals[index]}</Text>
      </View>
      <View style={customStyles.topProductContent}>
        <Text style={customStyles.topProductName} numberOfLines={1}>
          {product.produit__nom_produit}
        </Text>
        <Text style={customStyles.topProductQty}>
          {product.total_qty} unité{product.total_qty > 1 ? "s" : ""} vendues
        </Text>
      </View>
      <View
        style={[
          customStyles.topProductBadge,
          { backgroundColor: `${colors[index]}20` },
        ]}
      >
        <Text style={[customStyles.topProductNumber, { color: colors[index] }]}>
          #{index + 1}
        </Text>
      </View>
    </View>
  );
}

// Composant pour la comparaison avec période précédente
interface ComparisonCardProps {
  comparaison?: ComparaisonPeriodePrecedente;
  titre: string;
}

function ComparisonCard({ comparaison, titre }: ComparisonCardProps) {
  if (!comparaison) return null;

  // Support both new schema and legacy fields as fallback
  const caEvolution = (comparaison as any).ca_evolution ?? (comparaison as any).chiffre_affaires_variation ?? 0;
  const ventesEvolution = (comparaison as any).ventes_evolution ?? (comparaison as any).nombre_ventes_variation ?? 0;
  const caActuelle = (comparaison as any).ca_periode_actuelle ?? (comparaison as any).ca_periode_actuelle;
  const caPrecedente = (comparaison as any).ca_periode_precedente ?? (comparaison as any).ca_periode_precedente;

  const isHausse = caEvolution > 0;
  const iconName = isHausse ? "trending-up" : caEvolution < 0 ? "trending-down" : "minus";
  const iconColor = isHausse ? "#26D07C" : "#FF6B6B";

  const fmt = (v?: number) => (v === undefined || v === null ? "-" : Intl.NumberFormat('fr-FR').format(v) + " FCFA");

  return (
    <View style={customStyles.comparisonCard}>
      <View style={customStyles.comparisonHeader}>
        <MaterialCommunityIcons name={iconName as any} size={24} color={iconColor} />
        <Text style={customStyles.comparisonTitle}>{titre}</Text>
      </View>
      <View style={customStyles.comparisonContent}>
        <View style={customStyles.comparisonItem}>
          <Text style={customStyles.comparisonLabel}>Chiffre d'affaires</Text>
          <Text style={[customStyles.comparisonValue, { color: isHausse ? "#26D07C" : "#FF6B6B" }]}>
            {caEvolution > 0 ? "+" : ""}{caEvolution.toFixed(2)}%
          </Text>
          <Text style={customStyles.comparisonSub}>{fmt(caActuelle)} / {fmt(caPrecedente)}</Text>
        </View>
        <View style={customStyles.comparisonItem}>
          <Text style={customStyles.comparisonLabel}>Nombre de ventes</Text>
          <Text style={[customStyles.comparisonValue, { color: ventesEvolution > 0 ? "#26D07C" : "#FF6B6B" }]}>
            {ventesEvolution > 0 ? "+" : ""}{ventesEvolution.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}


// Composant pour afficher les statuts (commandes, stock)
interface StatusCardProps {
  title: string;
  icon: string;
  data: Array<{ label: string; value: number; color: string }>;
}

function StatusCard({ title, icon, data }: StatusCardProps) {
  return (
    <View style={customStyles.chartContainer}>
      <View style={customStyles.cardHeader}>
        <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.primary} />
        <Text style={customStyles.cardTitle}>{title}</Text>
      </View>
      <View style={customStyles.statusGrid}>
        {data.map((item, idx) => (
          <View key={idx} style={customStyles.statusItem}>
            <View
              style={[
                customStyles.statusColor,
                { backgroundColor: `${item.color}20` },
              ]}
            >
              <View
                style={[customStyles.statusColorDot, { backgroundColor: item.color }]}
              />
            </View>
            <Text style={customStyles.statusLabel}>{item.label}</Text>
            <Text style={customStyles.statusValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const customStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statCardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  statCardContent: {
    justifyContent: "flex-end",
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statCardUnit: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 10,
  },
  emptyText: {
    padding: 16,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  topProductItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fafafa",
    marginBottom: 8,
    borderRadius: 8,
  },
  topProductRank: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  topProductMedal: {
    fontSize: 28,
  },
  topProductContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  topProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  topProductQty: {
    fontSize: 12,
    color: "#666",
  },
  topProductBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topProductNumber: {
    fontSize: 12,
    fontWeight: "600",
  },
  comparisonCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 10,
  },
  comparisonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  comparisonItem: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
  },
  comparisonLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  comparisonSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
    fontWeight: "500",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statusItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
  },
  statusColor: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "center",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});

const styles = stylesCss;
