import CONFIG from "@/constants/config";
import { COLORS, stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
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
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Menu from "@/components/menu";
import api from "@/services/api";
import { Image } from "expo-image";

type statsType = {
  total_ventes_aujourd_hui: string;
  total_produits_en_stock: string;
  total_clients_aujourd_hui: string;
};

export default function TableauBord() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produits, setProduits] = useState([]);
  const [stats, setStats] = useState<statsType>();
  
  const router = useRouter();

  // Afficher les 2 recents ventes et produits
  const ListProduits = async () => {
    try {
      const response = await api.get("/produits/list/");
      if (response.status === 200) {
        const data = response.data;
        setProduits(data.data);
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

  const voirPlusProduit = useCallback(
    () => router.push("/(tabs)/produits"),
    [router]
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleProfile = useCallback(() => {
    setMenuVisible(false);
    router.push("/profil");
  }, [setMenuVisible,router]);

  const handleInfo = useCallback(() => {
    setMenuVisible(false);
    router.push("/(pages)/info");
  }, [setMenuVisible,router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await api.post("/authentification/logout/");
      if (response.status === 200 || response.status === 201) {
        await SecureStore.deleteItemAsync("auth_token");
        delete api.defaults.headers.common["Authorization"];
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
    stats_du_jour();
    ListProduits();
    setLoading(false);
  }

  useEffect(() => {
    stats_du_jour();
    ListProduits();
  }, []);

   if (loading) return (<ActivityIndicator size="large" color={COLORS.primary} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>);
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
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <ScrollView removeClippedSubviews={true} style={{ flex: 1 }}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Tableau de bord</Text>
                <View style={styles.headerActions}>
                  <Pressable style={styles.iconBtn} onPress={refreshPage}>
                    <Ionicons
                      name="reload-circle"
                      size={30}
                      color={COLORS.light}
                    />
                  </Pressable>
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
                <Menu
                  onProfile={handleProfile}
                  onInfo={handleInfo}
                  onLogout={handleLogout}
                />
              )}

              <ScrollView style={styles.content}>
                {/* Section Aujourd'hui */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{"Statistiques du jour"}</Text>

                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => router.push("/(tabs)/ventes")}
                      >
                        <Text style={styles.statValue}>
                          {stats?.total_ventes_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>Caisse</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.statCard}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => router.push("/(tabs)/produits")}
                      >
                        <Text style={styles.statValue}>
                          {stats?.total_produits_en_stock}
                        </Text>
                        <Text style={styles.statLabel}>
                          {"Produit(s) en stock"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => router.push("/(tabs)/clients")}
                      >
                        <Text style={styles.statValue}>
                          {stats?.total_clients_aujourd_hui}
                        </Text>
                        <Text style={styles.statLabel}>{"Client(s)"}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.statCard}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.statValue}>1</Text>
                        <Text style={styles.statLabel}>Stocks faibles</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.quickActions}>
                    <Pressable
                      style={[styles.btn, styles.btnSecondary]}
                      onPress={() => router.push("/(tabs)/rapports")}
                    >
                      <Text style={styles.btnText}>Voir le Rapport</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.btnOutline]}>
                      <Text
                        style={[styles.btnText, styles.textPrimary]}
                        onPress={() => router.push("/(tabs)/ventes")}
                      >
                        Voir les ventes
                      </Text>
                    </Pressable>
                  </View>

                  <View style={[styles.alert, styles.alertWarning]}>
                    <Ionicons
                      name="warning-outline"
                      size={30}
                      color={COLORS.danger}
                    />
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        5 produits en stock faible
                      </Text>
                      <Text>Saumon, Thon, Filet de bœuf...</Text>
                    </View>
                  </View>
                </View>

                {/* Section Produits récents */}
                {produits.length >= 2 && (
                  <View style={styles.section}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Produits récents</Text>
                      <Pressable>
                        <Text style={styles.btnSmall} onPress={voirPlusProduit}>
                          Voir tout
                        </Text>
                      </Pressable>
                    </View>

                    {produits.slice(0, 3).map((produit: any, i) => (
                      <View style={styles.productCard} key={i}>
                        <Image
                          cachePolicy="disk"
                          style={styles.productImage}
                          source={{
                            uri: `${CONFIG.API_IMAGE_BASE_URL}${produit.image_produit}`,
                          }}
                        />
                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>
                            {produit.nom_produit}
                          </Text>
                          <Text style={styles.productPrice}>
                            {formatMoneyFR(produit.prix_unitaire_produit)} XOF
                          </Text>
                        </View>
                        {produit.quantite_produit_disponible <=
                        produit.seuil_alerte_produit ? (
                          <Text
                            style={[styles.productStock, styles.badgeWarning]}
                          >
                            Stock faible
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}

                {/* Section Ventes récentes */}
                {/* <View style={styles.section}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Ventes récentes</Text>
                    <Pressable>
                      <Text style={styles.btnSmall} onPress={VoirPlusVente}>
                        Voir tout
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.saleItem}>
                    <View style={styles.saleInfo}>
                      <Text style={styles.saleClient}>Martin Dupont</Text>
                      <Text style={styles.saleDetails}>2 produits • 10:24</Text>
                    </View>
                    <Text style={styles.saleAmount}>45.80XOF</Text>
                  </View>

                  <View style={styles.saleItem}>
                    <View style={styles.saleInfo}>
                      <Text style={styles.saleClient}>Sophie Leroy</Text>
                      <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                    </View>
                    <Text style={styles.saleAmount}>67.20XOF</Text>
                  </View>
                </View> */}
              </ScrollView>
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
