import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { formatDateHeureFR } from "@/utils/dateFormat";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Téléchargement du reçu de vente
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";


type ReçuVenteProps = {
  isVisible: boolean;
  venteID: string;
  onClose: () => void;
};

type Client = {
  nom_client: string;
  numero_telephone_client: string;
};

type Utilisateur = {
  nom_utilisateur: string;
};

type Details = {
  produit: string;
  quantite: number;
  prix_unitaire: string;
  sous_total: string;
};

type DetailTache = {
  identifiant_vente: string;
  date_vente: string;
  total_ht: string;
  tva: string;
  total_ttc: string;
  client: Client;
  utilisateur: Utilisateur;
  details: Details[];
};

export default function RecuVente({
  isVisible,
  venteID,
  onClose,
}: ReçuVenteProps) {
  const [voirDetail, setVoirDetail] = React.useState<DetailTache | null>(null);
  const viewRef = useRef<View>(null);

  // Fonction de téléchargement du reçu
  const telechargerRecu = async () => {
    try {
      if (!viewRef.current) return;
      // Capture d'écran du reçu

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.9,
      });

      // Convertir en pdf
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: `
            <html>
              <body style="text-align:center;">
                <img src="${uri}" style="width:100%;" />
              </body>
            </html>
          `,
      });

      // Sauvegarde / partage du fichier
      await Sharing.shareAsync(pdfUri);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de générer le reçu PDF");
      console.error(error);
    }
  };

  // Afficher le détail de la vente
  const detailVente = async () => {
    try {
      const response = await api.get(`/ventes/detail/${venteID}/`);
      if (response.status === 200) {
        const data = response.data.data;
        setVoirDetail(data);
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
          Alert.alert("", "Mot de passe incorrect");
        } else {
          Alert.alert("Erreur", error.message || "Erreur survenue");
        }
      }
    }
  };

  useEffect(() => {
    if (venteID) detailVente();
  }, [venteID]);

  if (!voirDetail) {
    return (
      <View style={stylesCss.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback>
        <View style={stylesCss.container}>
          {/* HEADER */}
          <View style={stylesCss.header}>
            <Text style={stylesCss.headerTitle}>FACTURE</Text>
            <View style={stylesCss.headerActions}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={25} color={COLORS.light} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="download" size={25} color={COLORS.light} onPress={telechargerRecu} />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTENU */}
          <ScrollView style={stylesCss.content}>
            {/* En-tête du reçu */}
            <View style={stylesCss.receiptHeader}>
              <Text style={stylesCss.title}>MarchéPro</Text>
              <Text>{"Côte d'Ivoire, Yamoussoukro, Grand Marché"}</Text>
              <Text>+225 07-11-39-95-67 / 05-95-03-16-94</Text>
            </View>

            {/* Informations générales */}
            <View collapsable={false} ref={viewRef} style={stylesCss.infoContainer} >
              <View>
                <Text style={stylesCss.infoLabel}>Boutique</Text>
                <Text style={stylesCss.infoValue}>
                  MarchéPro
                </Text>

                <Text style={stylesCss.infoLabel}>N° de vente</Text>
                <Text style={stylesCss.infoValue}>
                  {voirDetail.identifiant_vente}
                </Text>

                <Text style={stylesCss.infoLabel}>Date</Text>
                <Text style={stylesCss.infoValue}>
                  {formatDateHeureFR(voirDetail.date_vente).split("-")[0]}
                </Text>

                <Text style={stylesCss.infoLabel}>Heure</Text>
                <Text style={stylesCss.infoValue}>
                  {formatDateHeureFR(voirDetail.date_vente).split("-")[1]}
                </Text>

                <Text style={stylesCss.infoLabel}>Vendeur</Text>
                <Text style={stylesCss.infoValue}>
                  {voirDetail.utilisateur.nom_utilisateur}
                </Text>
              </View>

              <View>
                <Text style={stylesCss.infoLabel}>Client</Text>
                <Text style={stylesCss.infoValue}>
                  {voirDetail.client.nom_client
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")}
                </Text>

                <Text style={stylesCss.infoLabel}>Téléphone</Text>
                <Text style={stylesCss.infoValue}>
                  {voirDetail.client.numero_telephone_client}
                </Text>

                <Text style={stylesCss.infoLabel}>Statut</Text>
                <Text style={[stylesCss.badge, stylesCss.badgeSuccess]}>
                  Payé
                </Text>
              </View>
            </View>

            {/* Produits */}
            <View style={stylesCss.table}>
              <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.productName}>Article</Text>
                </View>
                <Text style={styles.cell}>Qte</Text>
                <Text style={styles.cell}>Prix U</Text>
                <Text style={styles.cell}>Total</Text>
              </View>
              {voirDetail.details.map((item, i) => (
                <View key={i} style={stylesCss.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={stylesCss.productName}>{item.produit}</Text>
                  </View>
                  <Text style={stylesCss.cell}>{item.quantite}</Text>
                  <Text style={stylesCss.cell}>
                    {formatMoneyFR(item.prix_unitaire)}
                  </Text>
                  <Text style={stylesCss.cell}>
                    {formatMoneyFR(item.sous_total)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Sommaire */}
            <View style={stylesCss.summary}>
              <View style={stylesCss.summaryRow}>
                <Text>Sous-total:</Text>
                <Text>{formatMoneyFR(voirDetail.total_ht)} XOF</Text>
              </View>
              <View style={stylesCss.summaryRow}>
                <Text>TVA (10%):</Text>
                <Text>{formatMoneyFR(voirDetail.tva)} XOF</Text>
              </View>
              <View style={[stylesCss.summaryRow, stylesCss.summaryTotal]}>
                <Text>TOTAUX:</Text>
                <Text>{formatMoneyFR(voirDetail.total_ttc)} XOF</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
