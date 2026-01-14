import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { formatDateHeureFR } from "@/utils/dateFormat";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
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

type DetailCommandeProps = {
    isVisible: boolean;
    commandeID: string;
    onClose: () => void;
};

type Client = {
    nom_client: string;
    numero_telephone_client: string;
};

type Utilisateur = {
    nom_utilisateur: string;
};

type Details_commandes = {
    produit: string;
    quantite: number;
    prix_unitaire: string;
    sous_total: string;
};

type DetailCommande = {
    identifiant_commande: string;
    date_commande: string | number | Date;
    total_ht: string;
    tva: string;
    total_ttc: string;
    client: Client;
    utilisateur: Utilisateur;
    details_commandes: Details_commandes[];
    etat_commande: string;
};

export default function DetailCommande({
    isVisible,
    commandeID,
    onClose,
}: DetailCommandeProps) {
    const [voirDetail, setVoirDetail] = React.useState<DetailCommande | null>(null);
    const viewRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<string | null>(null)

    const refreshPage = () => {
        detailCommande()
    }

    // Validation de commande
    const validerCommande = async (identifiant_commande: string) => {
        setLoading(true);
        try {
            const response = await api.put(`/commandes/valider/${identifiant_commande}/`, {
                etat_commande: 'valide'
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Succès", "Commande validée avec succès");
                refreshPage()
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


    // Validation de commande
    const annulerCommande = async (identifiant_commande: string) => {
        setLoading(true);
        try {
            const response = await api.put(`/commandes/annuler/${identifiant_commande}/`, {
                is_active: false,
                etat_commande: 'annule'
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Succès", "Commande annulée");
                refreshPage()
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

    // Livraison de commande
    const livrerCommande = async (identifiant_commande: string) => {
        const role = await AsyncStorage.getItem("user_role")
        setLoading(true);
        try {
            const response = await api.put(`/commandes/livrer/${identifiant_commande}/`, {
                etat_commande: 'livre'
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Succès", "Commande livrée avec succès");
                refreshPage()
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


    // Fonction de téléchargement du reçu
    const telechargerRecu = async () => {
        try {
            if (!viewRef.current) return;
            // Capture d'écran du reçu

            const uri = await captureRef(viewRef.current, {
                format: "png",
                quality: 0.8,
            });


            const ligneProduits = voirDetail?.details_commandes
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
        <div class="value">${voirDetail?.identifiant_commande}</div>

        <div class="label">Date</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_commande).split("-")[0]
                    }</div>

        <div class="label">Heure</div>
        <div class="value">${formatDateHeureFR(voirDetail?.date_commande).split("-")[1]
                    }</div>

        <div class="label">Vendeur</div>
        <div class="value">${voirDetail?.utilisateur.nom_utilisateur}</div>
      </div>

      <!-- Colonne droite alignée à droite -->
      <div class="meta-right">
        <div class="label">Client</div>
        <div class="value">${voirDetail?.client.nom_client}</div>

        <div class="label">Téléphone</div>
        <div class="value">${voirDetail?.client.numero_telephone_client}</div>

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



    // Afficher le détail de la vente
    const detailCommande = async () => {
        const user_role = await AsyncStorage.getItem('user_role')
        setRole(user_role);
        try {
            const response = await api.get(`/commandes/detail/${commandeID}/`);
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
        if (commandeID) detailCommande();
    }, [commandeID]);

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
                        <Text style={stylesCss.headerTitle}>COMMANDE</Text>
                        <View style={stylesCss.headerActions}>
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
                                    {voirDetail.identifiant_commande}
                                </Text>

                                <Text style={stylesCss.infoLabel}>Date</Text>
                                <Text style={stylesCss.infoValue}>
                                    {formatDateHeureFR(voirDetail.date_commande).split("-")[0]}
                                </Text>

                                <Text style={stylesCss.infoLabel}>Heure</Text>
                                <Text style={stylesCss.infoValue}>
                                    {formatDateHeureFR(voirDetail.date_commande).split("-")[1]}
                                </Text>

                                <Text style={stylesCss.infoLabel}>{ }{"Vendeur(se)"}</Text>
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
                                {
                                    voirDetail.etat_commande === "livre" && (
                                        <Text style={[stylesCss.badge, stylesCss.badgeSuccess]}>
                                            Livrée
                                        </Text>
                                    )
                                }

                                {
                                    voirDetail.etat_commande === "en_cours" && (
                                        <Text style={[stylesCss.badge, stylesCss.badgeWarning]}>
                                            En attente
                                        </Text>
                                    )
                                }
                                {
                                    voirDetail.etat_commande === "valide" && (
                                        <Text style={[stylesCss.badge, stylesCss.badgePrimary]}>
                                            Livraison...
                                        </Text>
                                    )
                                }
                                {
                                    voirDetail.etat_commande === "annule" && (
                                        <Text style={[stylesCss.badge, stylesCss.badgeGrey]}>
                                            annulé
                                        </Text>
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
                            {voirDetail.details_commandes.map((item, i) => (
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
                                <Text>TVA (10%):</Text>
                                <Text>{formatMoneyFR(voirDetail.tva)} FCFA</Text>
                            </View>
                            <View style={[stylesCss.summaryRow, stylesCss.summaryTotal]}>
                                <Text>TOTAUX:</Text>
                                <Text>{formatMoneyFR(voirDetail.total_ttc)} FCFA</Text>
                            </View>
                        </View>
                        {loading ? (
                            <ActivityIndicator color={COLORS.primary} />
                        ) : role === "vendeur" && voirDetail.etat_commande === 'en_cours' ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnPrimary, { margin: 50 }]}
                                    onPress={() => validerCommande(voirDetail.identifiant_commande)}
                                >
                                    <Ionicons
                                        name="bag-check"
                                        size={20}
                                        color={COLORS.light}
                                    />
                                    <Text style={[styles.btnText]}>Valider la commande</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnDanger, { margin: 50, top: -80 }]}
                                    onPress={() => annulerCommande(voirDetail.identifiant_commande)}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color={COLORS.light}
                                    />
                                    <Text style={[styles.btnText]}>Annuler la commande</Text>
                                </TouchableOpacity>
                            </>
                        ) : role === "vendeur" && voirDetail.etat_commande === 'valide' && (
                            <>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnSuccess, { margin: 50 }]}
                                    onPress={() => livrerCommande(voirDetail.identifiant_commande)}
                                >
                                    <Ionicons
                                        name="checkmark-done"
                                        size={20}
                                        color={COLORS.light}
                                    />
                                    <Text style={[styles.btnText]}>Commmande Livrée</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnDanger, { margin: 50, top: -80 }]}
                                    onPress={() => annulerCommande(voirDetail.identifiant_commande)}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color={COLORS.light}
                                    />
                                    <Text style={[styles.btnText]}>Annuler la commande</Text>
                                </TouchableOpacity>
                            </>

                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaProvider>
    );
}

const styles = stylesCss;
