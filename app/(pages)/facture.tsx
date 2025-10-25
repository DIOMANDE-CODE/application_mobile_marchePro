import { COLORS, stylesCss } from "@/styles/styles";
import { formatDateHeureFR } from "@/utils/dateFormat";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import api from "@/services/api";

type Client = {
  nom_client: string;
  numero_telephone_client: string;
};

type Item = {
  identifiant_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
};

type Facture = {
  client: Client;
  items: Item[];
  total_ht: string;
  tva: string;
  total_ttc: string;
};

export default function DetailVente() {
  const params = useLocalSearchParams();
  const facture: Facture | null = params.facture
    ? JSON.parse(params.facture as string)
    : null;

  const [loading, setLoading] = useState(false);

  const valider = async () => {
    const role = 
    setLoading(true);
    try {
      const response = await api.post("/ventes/creer/", facture);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Succès", "Article vendu avec succès");
        router.replace("/(tabs)/ventes");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data.errors;

        // On transforme le message en texte
        let message = "";

        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = JSON.stringify(data);
        } else {
          message = "Erreur inattendue";
        }

        if (status === 400) {
          Alert.alert("Erreur 400", message);
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 409) {
          Alert.alert("Erreur 401", message);
        } else {
          Alert.alert("Erreur", message);
        }
      } else {
        Alert.alert("Erreur", error.message || "Erreur réseau");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!facture) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={{ textAlign: "center", marginTop: 50 }}>
              Aucune facture disponible
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginTop: 20, alignSelf: "center" }}
            >
              <Text style={{ color: COLORS.primary }}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>FACTURE</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={25} color={COLORS.light} />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTENU */}
          <ScrollView style={styles.content}>
            {/* En-tête du reçu */}
            <View style={styles.receiptHeader}>
              <Text style={styles.title}>MarchéPro</Text>
              <Text>{"Côte d'Ivoire, Yamoussoukro, Grand Marché"}</Text>
              <Text>+225 07-11-39-95-67/05-95-03-16-94</Text>
            </View>

            {/* Informations générales */}
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>
                  {facture.client.nom_client}
                </Text>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>
                  {facture.client.numero_telephone_client}
                </Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {formatDateHeureFR(new Date()).split("-")[0]}
                </Text>
                <Text style={styles.infoLabel}>Heure</Text>
                <Text style={styles.infoValue}>
                  {formatDateHeureFR(new Date()).split("-")[1]}
                </Text>
                <Text style={styles.infoLabel}>Statut</Text>
                <Text style={[styles.badge, styles.badgeWarning]}>
                  Non payée
                </Text>
              </View>
            </View>

            {/* Produits */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.productName}>Article</Text>
                </View>
                <Text style={styles.cell}>Qte</Text>
                <Text style={styles.cell}>Prix U</Text>
                <Text style={styles.cell}>Total</Text>
              </View>
              {facture.items.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.productName}>{item.nom_produit}</Text>
                  </View>
                  <Text style={styles.cell}>
                    {item.quantite_produit_disponible} *
                  </Text>
                  <Text style={styles.cell}>
                    {formatMoneyFR(item.prix_unitaire_produit)} FCFA
                  </Text>
                  <Text style={styles.cell}>
                    {item.quantite_produit_disponible *
                      item.prix_unitaire_produit}{" "}
                    FCFA
                  </Text>
                </View>
              ))}
            </View>

            {/* Sommaire */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text>Sous-total:</Text>
                <Text>{formatMoneyFR(facture.total_ht)} FCFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>TVA:</Text>
                <Text>{formatMoneyFR(facture.tva)} FCFA</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text>TOTAUX:</Text>
                <Text>{formatMoneyFR(facture.total_ttc)} FCFA</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary]}
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="close-outline" size={20} color={COLORS.light} />
                <Text style={styles.textLight}>Annuler</Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <TouchableOpacity
                  style={[styles.btn, styles.btnSuccess]}
                  onPress={valider}
                >
                  <Ionicons
                    name="checkmark-done"
                    size={20}
                    color={COLORS.light}
                  />
                  <Text style={styles.textLight}>Valider la vente</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
