import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Menu from "@/components/menu";


const imgPoisson=require("@/assets/produits/viande.jpg");
const imgViande=require("@/assets/produits/poisson.jpg");

export default function TableauBord() {
  const [menuVisible, setMenuVisible] = useState(false);

  const VoirPlusVente = useCallback(() => router.push("/(tabs)/ventes"), []);
  const voirPlusProduit = useCallback(
    () => router.push("/(tabs)/produits"),
    []
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleProfile = useCallback(() => {
    setMenuVisible(false);
    router.push("/profil");
  }, [setMenuVisible]);

  const handleInfo = useCallback(() => {
    setMenuVisible(false);
    router.replace("/(pages)/info");
  }, [setMenuVisible]);

  const handleLogout = useCallback(() => {
    setMenuVisible(false);
    router.replace("/login");
  }, [setMenuVisible]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Tableau de bord</Text>
              <View style={styles.headerActions}>
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

            <ScrollView style={styles.content} removeClippedSubviews={true}>
              {/* Section Aujourd'hui */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{"Aujourd'hui"}</Text>

                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>1,250FCFA</Text>
                    <Text style={styles.statLabel}>Ventes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>42</Text>
                    <Text style={styles.statLabel}>Produits en stock</Text>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>18</Text>
                    <Text style={styles.statLabel}>Clients</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>5</Text>
                    <Text style={styles.statLabel}>Stocks faibles</Text>
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
                      onPress={() => router.push("/(tabs)/produits")}
                    >
                      Gérer les stocks
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
              <View style={styles.section}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Produits récents</Text>
                  <Pressable>
                    <Text style={styles.btnSmall} onPress={voirPlusProduit}>
                      Voir tout
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.productCard}>
                  <Image
                    style={styles.productImage}
                    source={imgViande}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>Saumon frais</Text>
                    <Text style={styles.productDetails}>
                      Poissonnerie • 32.50FCFA/kg
                    </Text>
                    <Text style={styles.productPrice}>32.50FCFA/kg</Text>
                  </View>
                  <Text style={[styles.productStock, styles.badgeWarning]}>
                    Stock faible
                  </Text>
                </View>

                <View style={styles.productCard}>
                  <Image
                    style={styles.productImage}
                    source={imgPoisson}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>Filet de bœuf</Text>
                    <Text style={styles.productDetails}>
                      Boucherie • 24.90FCFA/kg
                    </Text>
                    <Text style={styles.productPrice}>24.90FCFA/kg</Text>
                  </View>
                  <Text style={[styles.productStock, styles.badgeSuccess]}>
                    En stock
                  </Text>
                </View>
              </View>

              {/* Section Ventes récentes */}
              <View style={styles.section}>
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
                  <Text style={styles.saleAmount}>45.80FCFA</Text>
                </View>

                <View style={styles.saleItem}>
                  <View style={styles.saleInfo}>
                    <Text style={styles.saleClient}>Sophie Leroy</Text>
                    <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                  </View>
                  <Text style={styles.saleAmount}>67.20FCFA</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
