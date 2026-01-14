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

type Details_ventes = {
  produit: string;
  quantite: number;
  prix_unitaire: string;
  sous_total: string;
};

type DetailTache = {
  identifiant_vente: string;
  date_vente: string | number | Date;
  total_ht: string;
  tva: string;
  total_ttc: string;
  client: Client;
  utilisateur: Utilisateur;
  details_ventes: Details_ventes[];
};

export default function RecuVente({
  isVisible,
  venteID,
  onClose,
}: ReçuVenteProps) {
  const [voirDetail, setVoirDetail] = React.useState<DetailTache | null>(null);
  const viewRef = useRef<ScrollView>(null);

  // Fonction pour envoyer reçu
  const envoyerRecu = async () => {
    try {
      if (!viewRef.current) return;
      // Capture d'écran du reçu

      const uri = await captureRef(viewRef.current, {
        format: "png",
        quality: 0.8,
      });


      const ligneProduits = voirDetail?.details_ventes
        .map(
          (item) =>
            `
      <tr>
      <td>${item.produit}</td>
      <td class="col-qty">${item.quantite}</td>
      <td class="col-price">${formatMoneyFR(item.prix_unitaire)}</td>
      <td class="col-total">${formatMoneyFR(item.sous_total)}</td>
    </tr>
        `
        );

      // Convertir en pdf
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: `
   <!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reçu de vente</title>
  <style>
    /* Couleurs */
    :root {
      --primary: #002f55;
      --primaryDark: #1e5651;
      --primaryLight: #4fa19b;
      --secondary: #e7423e;
      --success: #28a745;
      --light: #f8f9fa;
      --dark: #343a40;
      --gray: #6c757d;
      --grayLight: #e9ecef;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--dark);
      margin: 0;
      padding: 16px;
      background: var(--light);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px;
      background-color: #fff;
      border: 1px solid var(--grayLight);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .store-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--primaryDark);
      margin-bottom: 4px;
    }
    .store-info {
      font-size: 12px;
      color: var(--gray);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    .meta > div {
      flex: 1 1 45%;
      min-width: 220px;
    }

    /* Colonne de droite alignée à droite */
    .meta-right {
      text-align: right;
    }

    .label {
      font-size: 12px;
      color: var(--gray);
      margin-bottom: 4px;
      font-weight: 600;
    }
    .value {
      font-size: 14px;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 8px;
    }
    .badge-paid {
      display: inline-block;
      background-color: var(--success);
      color: #fff;
      padding: 4px 8px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12px;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border-bottom: 1px solid var(--grayLight);
      padding: 8px 6px;
      font-size: 13px;
    }
    th {
      font-weight: 700;
      background-color: var(--light);
    }
    .col-qty, .col-price, .col-total {
      text-align: right;
    }

    .summary {
      margin-top: 12px;
      border-top: 2px solid var(--primaryDark);
      padding-top: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .summary-row.total {
      font-weight: 800;
      font-size: 16px;
      border-top: 2px solid var(--grayLight);
      margin-top: 8px;
      padding-top: 8px;
    }

    .footer {
      margin-top: 18px;
      text-align: center;
      font-size: 12px;
      color: var(--gray);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .meta {
        flex-direction: column;
      }
      .meta-right {
        text-align: left; /* aligne à gauche sur mobile */
        margin-top: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="store-name">MarchéPro</div>
      <div class="store-info">
        Côte d'Ivoire — Yamoussoukro, Grand Marché<br/>
        +225 07-11-39-95-67 / 05-95-03-16-94
      </div>
    </div>

    <div class="meta">
      <!-- Colonne gauche -->
      <div>

        <div class="label">N° de vente</div>
        <div class="value">${voirDetail?.identifiant_vente}</div>

        <div class="label">Date</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_vente).split("-")[0]
          }</div>
        <div class="label">Heure</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_vente).split("-")[1]
          }</div>

        <div class="label">Vendeur</div>
        <div class="value">${voirDetail?.utilisateur.nom_utilisateur}</div>
      </div>

      <!-- Colonne droite alignée à droite -->
      <div class="meta-right">
          ${voirDetail?.client?.nom_client ? (
            `<div class="label">Client</div>
            <div class="value">${voirDetail?.client.nom_client}</div>`
          ) : ``
          }

          ${voirDetail?.client?.numero_telephone_client ? (
            `<div class="label">Client</div>
            <div class="value">${voirDetail?.client.numero_telephone_client}</div>`
          ) : ``
          }

        <div class="label">Statut</div>
        <div class="value"><span class="badge-paid">Payé</span></div>
      </div>
    </div>

    <table role="table" aria-label="Produits">
      <thead>
        <tr>
          <th style="width:50%">Article</th>
          <th class="col-qty" style="width:10%">Qte</th>
          <th class="col-price" style="width:20%">Prix U</th>
          <th class="col-total" style="width:20%">Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Lignes produits dynamiques -->
        ${ligneProduits}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <div>Sous-total:</div>
        <div>${voirDetail?.total_ht} FCFA</div>
      </div>
      <div class="summary-row">
        <div>TVA (10%):</div>
        <div>${voirDetail?.tva} FCFA</div>
      </div>
      <div class="summary-row total">
        <div>TOTAUX:</div>
        <div>${voirDetail?.total_ttc} FCFA</div>
      </div>
    </div>

    <div class="footer">
      Merci pour votre achat — MarchéPro
    </div>
  </div>
</body>
</html>
  `,
      });

      // Sauvegarde / partage du fichier
      await Sharing.shareAsync(pdfUri);
      Alert.alert("Succès", "Reçu envoyé avec succès !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de générer le reçu PDF");
      console.error(error);
    }
  };

// Fonction pour imprimer le reçu
  const imprimerRecu = async () => {
    try {
      const ligneProduits = voirDetail?.details_ventes
        .map(
          (item) => `
          <tr>
            <td>${item.produit}</td>
            <td class="col-qty">${item.quantite}</td>
            <td class="col-price">${formatMoneyFR(item.prix_unitaire)}</td>
            <td class="col-total">${formatMoneyFR(item.sous_total)}</td>
          </tr>
        `
        )
        .join(""); 

      const html = `
      <!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reçu de vente</title>
  <style>
    /* Couleurs */
    :root {
      --primary: #002f55;
      --primaryDark: #1e5651;
      --primaryLight: #4fa19b;
      --secondary: #e7423e;
      --success: #28a745;
      --light: #f8f9fa;
      --dark: #343a40;
      --gray: #6c757d;
      --grayLight: #e9ecef;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--dark);
      margin: 0;
      padding: 16px;
      background: var(--light);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px;
      background-color: #fff;
      border: 1px solid var(--grayLight);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .store-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--primaryDark);
      margin-bottom: 4px;
    }
    .store-info {
      font-size: 12px;
      color: var(--gray);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    .meta > div {
      flex: 1 1 45%;
      min-width: 220px;
    }

    /* Colonne de droite alignée à droite */
    .meta-right {
      text-align: right;
    }

    .label {
      font-size: 12px;
      color: var(--gray);
      margin-bottom: 4px;
      font-weight: 600;
    }
    .value {
      font-size: 14px;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 8px;
    }
    .badge-paid {
      display: inline-block;
      background-color: var(--success);
      color: #fff;
      padding: 4px 8px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12px;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border-bottom: 1px solid var(--grayLight);
      padding: 8px 6px;
      font-size: 13px;
    }
    th {
      font-weight: 700;
      background-color: var(--light);
    }
    .col-qty, .col-price, .col-total {
      text-align: right;
    }

    .summary {
      margin-top: 12px;
      border-top: 2px solid var(--primaryDark);
      padding-top: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .summary-row.total {
      font-weight: 800;
      font-size: 16px;
      border-top: 2px solid var(--grayLight);
      margin-top: 8px;
      padding-top: 8px;
    }

    .footer {
      margin-top: 18px;
      text-align: center;
      font-size: 12px;
      color: var(--gray);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .meta {
        flex-direction: column;
      }
      .meta-right {
        text-align: left; /* aligne à gauche sur mobile */
        margin-top: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="store-name">MarchéPro</div>
      <div class="store-info">
        Côte d'Ivoire — Yamoussoukro, Grand Marché<br/>
        +225 07-11-39-95-67 / 05-95-03-16-94
      </div>
    </div>

    <div class="meta">
      <!-- Colonne gauche -->
      <div>

        <div class="label">N° de vente</div>
        <div class="value">${voirDetail?.identifiant_vente}</div>

        <div class="label">Date</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_vente).split("-")[0]
          }</div>
        <div class="label">Heure</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_vente).split("-")[1]
          }</div>

        <div class="label">Vendeur</div>
        <div class="value">${voirDetail?.utilisateur.nom_utilisateur}</div>
      </div>

      <!-- Colonne droite alignée à droite -->
      <div class="meta-right">
          ${voirDetail?.client?.nom_client ? (
            `<div class="label">Client</div>
            <div class="value">${voirDetail?.client.nom_client}</div>`
          ) : ``
          }

          ${voirDetail?.client?.numero_telephone_client ? (
            `<div class="label">Client</div>
            <div class="value">${voirDetail?.client.numero_telephone_client}</div>`
          ) : ``
          }

        <div class="label">Statut</div>
        <div class="value"><span class="badge-paid">Payé</span></div>
      </div>
    </div>

    <table role="table" aria-label="Produits">
      <thead>
        <tr>
          <th style="width:50%">Article</th>
          <th class="col-qty" style="width:10%">Qte</th>
          <th class="col-price" style="width:20%">Prix U</th>
          <th class="col-total" style="width:20%">Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Lignes produits dynamiques -->
        ${ligneProduits}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <div>Sous-total:</div>
        <div>${voirDetail?.total_ht} FCFA</div>
      </div>
      <div class="summary-row">
        <div>TVA (10%):</div>
        <div>${voirDetail?.tva} FCFA</div>
      </div>
      <div class="summary-row total">
        <div>TOTAUX:</div>
        <div>${voirDetail?.total_ttc} FCFA</div>
      </div>
    </div>

    <div class="footer">
      Merci pour votre achat — MarchéPro
    </div>
  </div>
</body>
</html>
    `;

      // Impression directe (ouvre le dialogue d’impression du système)
      await Print.printAsync({ html });

    } catch (error) {
      Alert.alert("Erreur", "Impossible d'imprimer le reçu");
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
            <Text style={stylesCss.headerTitle}>RECU DE PAIEMENT</Text>
            <View style={stylesCss.headerActions}>
              <TouchableOpacity onPress={envoyerRecu}>
                <Ionicons name="send" size={30} color={COLORS.light} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={35} color={COLORS.light} />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTENU */}
          <ScrollView
            style={stylesCss.content}
            collapsable={false}
            ref={viewRef}
          >
            {/* En-tête du reçu */}
            <View style={stylesCss.receiptHeader}>
              <Text style={stylesCss.title}>MarchéPro</Text>
              <Text>{"Côte d'Ivoire, Yamoussoukro, Grand Marché"}</Text>
              <Text>+225 07-11-39-95-67 / 05-95-03-16-94</Text>
            </View>

            {/* Informations générales */}
            <View style={stylesCss.infoContainer}>
              <View>

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

                <Text style={stylesCss.infoLabel}>{ }{"Vendeur(se)"}</Text>
                <Text style={stylesCss.infoValue}>
                  {voirDetail.utilisateur.nom_utilisateur}
                </Text>
              </View>

              <View>
                {
                  voirDetail?.client?.nom_client && (
                    <>
                      <Text style={stylesCss.infoLabel}>Client</Text>
                      <Text style={stylesCss.infoValue}>
                        {voirDetail.client.nom_client
                          .split(" ")
                          .slice(0, 2)
                          .join(" ")}
                      </Text>
                    </>
                  )
                }

                {
                  voirDetail?.client?.numero_telephone_client && (
                    <>
                      <Text style={stylesCss.infoLabel}>Téléphone</Text>
                      <Text style={stylesCss.infoValue}>
                        {voirDetail.client.numero_telephone_client}
                      </Text>

                      <Text style={stylesCss.infoLabel}>Statut</Text>
                      <Text style={[stylesCss.badge, stylesCss.badgeSuccess]}>
                        Payé
                      </Text>
                    </>
                  )
                }

              </View>
            </View>

            {/* Produits */}
            <View style={stylesCss.table}>
              <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.productName}>{"Article(s)"}</Text>
                </View>
                <Text style={styles.cell}>Qte</Text>
                <Text style={styles.cell}>Prix U</Text>
                <Text style={styles.cell}>Total</Text>
              </View>
              {voirDetail.details_ventes.map((item, i) => (
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
                <Text>{formatMoneyFR(voirDetail.total_ht)} FCFA</Text>
              </View>
              <View style={stylesCss.summaryRow}>
                <Text>TVA (0%):</Text>
                <Text>{formatMoneyFR(voirDetail.tva)} FCFA</Text>
              </View>
              <View style={[stylesCss.summaryRow, stylesCss.summaryTotal]}>
                <Text>TOTAUX:</Text>
                <Text>{formatMoneyFR(voirDetail.total_ttc)} FCFA</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { margin: 50 }]}
              onPress={imprimerRecu}
            >
              <Ionicons
                name="print"
                size={20}
                color={COLORS.light}
              />
              <Text style={[styles.btnText]}>Imprimez le reçu</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
