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

type statsType = {
  total_caisse_jour: string;
  total_commande_aujourd_hui:string;
  total_commande_attente_aujourd_hui:string;
  total_commande_valide_aujourd_hui:string;
  total_commande_livre_aujourd_hui:string;
  total_ventes_aujourd_hui:string;
  total_ventes_commandes_aujourd_hui:string;
};

export default function TableauBord() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockproduitfaible, setStockproduitfaible] = useState([]);
  const [stats, setStats] = useState<statsType>();

  const router = useRouter();

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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleProfile = useCallback(() => {
    setMenuVisible(false);
    router.push("/profil");
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
      const response = await api.get("/statistiques/du_jour/vendeur/");
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
    stats_du_jour();
    ListProduitsStockFaible();
    setLoading(false);
  };

  useEffect(() => {
    stats_du_jour();
    ListProduitsStockFaible();
  }, []);

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
                          onInfo={handleInfo}
                          onLogout={handleLogout}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              )}

              <ScrollView style={styles.content}>
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
                          {stats?.total_caisse_jour}
                        </Text>
                        <Text style={styles.statLabel}>{"Total caisse (FCFA)"}</Text>
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
                          {stats?.total_commande_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>
                          {"Total Commande"}
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
                          {stats?.total_commande_attente_aujourd_hui}
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
                          {stats?.total_commande_valide_aujourd_hui}
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
                          {stats?.total_commande_livre_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>{"Commandes livrées"}</Text>
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
                          {stats?.total_ventes_commandes_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>{"Total caisse commandes (FCFA)"}</Text>
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
                          {stats?.total_ventes_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>{"Total caisse vente (FCFA)"}</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.quickActions}>
                    <Pressable
                      style={[styles.btn, styles.btnSuccess]}
                      onPress={() => router.push("/(tabs)/ventes")}
                    >
                      <Text style={styles.btnText}>Voir mes ventes</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.btn, styles.btnPrimary]}
                      onPress={() => router.push("/(tabs)/commandes")}
                    >
                      <Text style={styles.btnText}>Voir mes commandes</Text>
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
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
