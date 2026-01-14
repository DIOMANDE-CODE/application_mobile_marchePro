import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { memo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

// import des composants

// Déclaration des types
type Client = {
    nom_client: string;
};
type Commande = {
    identifiant_commande: string;
    id: string;
    client: Client;
    details_commandes: [];
    total_ttc: number;
    etat_commande: string;
    code_livraison:string;
};

type ListVentesProps = {
    data: Commande[];
    onSelectedId: (id: string) => void;
    onEndReached?: () => void;
};

const ListCommandes = ({ data, onSelectedId, onEndReached }: ListVentesProps) => {
    return (
        <FlatList
            style={styles.content}
            data={data}
            initialNumToRender={10} // évite de tout charger d’un coup
            windowSize={5} // limite le nombre d’éléments gardés en mémoire
            removeClippedSubviews={true} // nettoie les vues invisibles
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                    <Text style={{ color: "#888", fontSize: 16 }}>
                        Aucune commande trouvée
                    </Text>
                </View>
            }
            ListHeaderComponent={
                <Text style={styles.sectionTitle}>{"Commandes du jour"}</Text>
            }
            renderItem={({ item }) => (
                <Pressable onPress={() => onSelectedId(item.identifiant_commande)}>
                    <View style={styles.saleItem}>
                        <View style={styles.saleInfo}>
                            <Text style={styles.saleClient}>{item.client.nom_client}</Text>
                            <Text style={styles.saleDetails}>{item.details_commandes.length} {"produit(s) commandé(s)"}</Text>
                            <Text style={styles.saleDetails}>Total : {formatMoneyFR(item.total_ttc)} FCFA</Text>
                            <Text style={styles.saleDetails}>Ref : {item.identifiant_commande}</Text>
                            <Text style={styles.saleDetails}>Code : {item.code_livraison}</Text>
                        </View>
                        {
                            item.etat_commande === "en_cours" && (
                                <Text style={[styles.productStock, styles.badgeWarning]}>
                                    en attente
                                </Text>
                            )
                        }
                        {
                            item.etat_commande === "valide" && (
                                <Text style={[styles.productStock, styles.badgePrimary]}>
                                    Livraison...
                                </Text>
                            )
                        }
                        {
                            item.etat_commande === "livre" && (
                                <Text style={[styles.productStock, styles.badgeSuccess]}>
                                    Livrée
                                </Text>
                            )
                        }
                         {
                            item.etat_commande === "annule" && (
                                <Text style={[styles.productStock, styles.badgeGrey]}>
                                    Annulée
                                </Text>
                            )
                        }

                    </View>
                </Pressable>
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
        />
    );
};

const styles = stylesCss;

export default memo(ListCommandes);
