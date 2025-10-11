import { COLORS, stylesCss } from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type DetailVenteProps = {
    isVisible : boolean;
    onClose: () => void;
}

export default function DetailVente({isVisible,onClose}:DetailVenteProps) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"Détails de l'achat"}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name='arrow-back' size={25} color={COLORS.light} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENU */}
      <ScrollView style={styles.content}>
        {/* En-tête du reçu */}
        <View style={styles.receiptHeader}>
          <Text style={styles.title}>FISHMEAT DELUXE</Text>
          <Text>123 Rue du Commerce, 75001 Paris</Text>
          <Text>Tél: +33 1 42 86 95 47</Text>
        </View>

        {/* Informations générales */}
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.infoLabel}>N° de vente</Text>
            <Text style={styles.infoValue}>#VM-2024-00142</Text>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>15 mars 2024 - 14:30</Text>
            <Text style={styles.infoLabel}>Vendeur</Text>
            <Text style={styles.infoValue}>Pierre Martin</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>Martin Dupont</Text>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>+33 6 12 34 56 78</Text>
            <Text style={styles.infoLabel}>Statut</Text>
            <Text style={[styles.badge, styles.badgeSuccess]}>Payée</Text>
          </View>
        </View>

        {/* Produits */}
        <View style={styles.table}>
          {[
            { produit: "Saumon frais", categorie: "Poissonnerie", qte: "1.2 kg", prix: "32,50FCFA", total: "39,00FCFA" },
            { produit: "Filet de bœuf", categorie: "Boucherie", qte: "0.8 kg", prix: "24,90FCFA", total: "19,92FCFA" },
            { produit: "Crevettes roses", categorie: "Poissonnerie", qte: "1.5 kg", prix: "18,75FCFA", total: "28,13FCFA" },
            { produit: "Poulet fermier", categorie: "Boucherie", qte: "2.0 kg", prix: "12,50FCFA", total: "25,00FCFA" },
          ].map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.productName}>{item.produit}</Text>
                <Text style={styles.productCategory}>{item.categorie}</Text>
              </View>
              <Text style={styles.cell}>{item.qte}</Text>
              <Text style={styles.cell}>{item.prix}</Text>
              <Text style={styles.cell}>{item.total}</Text>
            </View>
          ))}
        </View>

        {/* Sommaire */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Sous-total:</Text>
            <Text>111,05FCFA</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>TVA (5,5%):</Text>
            <Text>6,11FCFA</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Remise fidélité:</Text>
            <Text>-5,00FCFA</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text>TOTAL:</Text>
            <Text>112,16FCFA</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
            <Ionicons name="send" size={20} color={COLORS.light} />
            <Text style={styles.textLight}>Envoyer le reçu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
            <Ionicons name="download" size={20} color={COLORS.light} />
            <Text style={styles.textLight}>Télécharger le reçu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = stylesCss;