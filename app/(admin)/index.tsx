import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Menu from "@/components/menu";
import api from "@/services/api";


type TopProduit = {
  id?: number;
  produit__nom_produit: string;
  produit__identifiant_produit: number;
  total_qty:number;
};

type VueEnsembleVentes = {
  chiffre_affaires: number;
  nombre_ventes: number;
  produits_plus_vendus: TopProduit[];
  marge_beneficiaire_estimee: number;
};

type ComparaisonPeriodePrecedente = {
  chiffre_affaires_variation: number;
  nombre_ventes_variation: number;
  tendance: "hausse" | "baisse" | "stable";
};

type CommandesEnCours = {
  total_commande: number;
  en_cours: number;
  en_livraison: number;
  livrees: number;
  annulees: number;
  valeur_commande_en_livraison: number,
  valeur_commande_en_cours: number,
  valeur_commande_livre:number
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

type statsType = {
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



interface Categorie {
  identifiant_categorie: string;
  nom_categorie: string;
}
interface Produit {
  identifiant_produit: string;
  image_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
  seuil_alerte_produit: number;
  categorie_produit: Categorie;
}

export default function TableauBord() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [stockproduitfaible, setStockproduitfaible] = useState([]);
  const [stats, setStats] = useState<statsType>();
  const [next, setNext] = useState(null)
  const [offset, setOffset] = useState(0)
  const limit = 7

  const router = useRouter();

  // Afficher les 2 recents ventes et produits
  const ListProduits = async () => {
    try {
      const response = await api.get("/produits/list/", {
        params: { limit, offset }
      });
      if (response.status === 200) {
        const root = response.data;
        const pagination = root.data

        setProduits((prev) => {
          const merged = [...prev, ...pagination.results];

          const unique = merged.filter(
            (item, index, self) =>
              index === self.findIndex(
                (p) => p.identifiant_produit === item.identifiant_produit
              )
          );
          return unique;
        })

        setOffset((prev) => prev + pagination.results.length);
        setNext(pagination.next);
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

  // Lister les produits en stock faible
  const ListProduitsStockFaible = async () => {
    try {
      const response = await api.get("/produits/alerte/stock_faible/");
      if (response.status === 200) {
        const data = response.data;
        setStockproduitfaible(data.data);

        // setProduits(data.data);
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

  const masquerMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const voirPlusProduit = useCallback(
    () => router.push("/(admin)/produits"),
    [router]
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleProfile = useCallback(() => {
    setMenuVisible(false);
    router.push("/profil");
  }, [setMenuVisible, router]);

  const addVendeur = useCallback(() => {
    setMenuVisible(false);
    router.push("/register");
  }, [setMenuVisible, router]);

  const handleInfo = useCallback(() => {
    setMenuVisible(false);
    router.push("/(pages)/info");
  }, [setMenuVisible, router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await api.post("/authentification/logout/");
      if (response.status === 200 || response.status === 201) {
        await SecureStore.deleteItemAsync("auth_token");
        delete api.defaults.headers.common["Authorization"];
        await AsyncStorage.removeItem("user_role");

        router.replace("/login");
        Alert.alert("Succès", "Deconnexion réussie");
      }
    } catch {
      Alert.alert("Erreur", "Echec de la deconnexion");
    } finally {
      setLoading(false);
    }
  };

  const stats_du_jour = async () => {
    try {
      const response = await api.get("/statistiques/du_jour/");
      if (response.status === 200) {
        const data = response.data;
        setStats(data.data);
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

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    setProduits([])
    setOffset(0)
    setNext(null)
    stats_du_jour();
    ListProduits();
    ListProduitsStockFaible();
    setLoading(false);
  };

  useEffect(() => {
    setOffset(0)
    setNext(null)
    stats_du_jour();
    ListProduits();
    ListProduitsStockFaible();
  }, []);
  if (!next) return;
  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  return (
    <SafeAreaProvider>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView removeClippedSubviews={true} style={{ flex: 1 }}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Tableau de bord</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={refreshPage}
                  >
                    <Ionicons
                      name="reload-circle"
                      size={35}
                      color={COLORS.light}
                    />
                  </TouchableOpacity>
                  <Pressable style={styles.iconBtn} onPress={toggleMenu}>
                    <Ionicons
                      name="person-circle"
                      size={35}
                      color={COLORS.light}
                    />
                  </Pressable>
                </View>
              </View>
              {menuVisible && (
                <TouchableWithoutFeedback onPress={masquerMenu}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  >
                    <TouchableWithoutFeedback>
                      <View
                        style={{ position: "absolute", top: 50, right: 10 }}
                      >
                        <Menu
                          onProfile={handleProfile}
                          addVendeur={addVendeur}
                          onInfo={handleInfo}
                          onLogout={handleLogout}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              )}

              <View style={styles.content}>
                {/* Section Aujourd'hui */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {"Statistiques du jour"}
                  </Text>

                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <Pressable
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.statValue}>
                          {stats?.produits_stock.total_stock}
                        </Text>
                        <Text style={styles.statLabel}>{"Produits en stock"}</Text>
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
                          {stats?.produits_stock.alerte_faible_stock}
                        </Text>
                        <Text style={styles.statLabel}>
                          {"Produits stock faible"}
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
                          {stats?.commandes_en_cours.total_commande}
                        </Text>
                        <Text style={styles.statLabel}>{"Total commandes"}</Text>
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
                          {stats?.vue_ensemble_ventes.nombre_ventes}
                        </Text>
                        <Text style={styles.statLabel}>{"Total ventes"}</Text>
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
                          {stats?.commandes_en_cours.en_cours}
                        </Text>
                        <Text style={styles.statLabel}>{"Commandes en attente"}</Text>
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
                          {stats?.commandes_en_cours.en_livraison}
                        </Text>
                        <Text style={styles.statLabel}>{"Commandes en livraison"}</Text>
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
                          {stats?.commandes_en_cours.livrees}
                        </Text>
                        <Text style={styles.statLabel}>{"Commandes livrées"}</Text>
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
                          {stats?.clients.nouveaux_clients}
                        </Text>
                        <Text style={styles.statLabel}>{"Total clients"}</Text>
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
                          {stats?.vue_ensemble_ventes.chiffre_affaires}
                        </Text>
                        <Text style={styles.statLabel}>{"Total caisse (FCFA)"}</Text>
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
                          {stats?.commandes_en_cours.valeur_commande_livre}
                        </Text>
                        <Text style={styles.statLabel}>{"Total commandes (FCFA)"}</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.quickActions}>
                    <Pressable
                      style={[styles.btn, styles.btnSecondary]}
                      onPress={() => router.push("/(admin)/rapports")}
                    >
                      <Text style={styles.btnText}>Voir le Rapport</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.btnOutline]}>
                      <Text
                        style={[styles.btnText, styles.textPrimary]}
                        onPress={() => router.push("/(admin)/ventes")}
                      >
                        Voir les ventes
                      </Text>
                    </Pressable>
                  </View>

                  {stockproduitfaible.length > 0 && (
                    <View style={[styles.alert, styles.alertWarning]}>
                      <Ionicons
                        name="warning-outline"
                        size={30}
                        color={COLORS.danger}
                      />

                      <View>
                        <Text style={{ fontWeight: "bold" }}>
                          {stockproduitfaible.length} produit(s) en stock faible
                          :
                        </Text>
                        <Text>
                          {stockproduitfaible
                            .map((item: any) => item.produit.nom_produit)
                            .join(", ")}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
