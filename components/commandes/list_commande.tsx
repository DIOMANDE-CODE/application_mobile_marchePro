import { stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { memo, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

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
    code_livraison: string;
};

type ListVentesProps = {
    data: Commande[];
    onSelectedId: (id: string) => void;
    onEndReached?: () => void;
};

const ListCommandes = ({ data, onSelectedId, onEndReached }: ListVentesProps) => {

    const [searchQuery, setSearchQuery] = useState("")

    const renderItem = ({ item }: { item: Commande }) => (
        <>
            <Pressable onPress={() => onSelectedId(item.identifiant_commande)}>
                <View style={styles.saleItem}>
                    <View style={styles.saleInfo}>
                        <Text style={styles.saleClient}>{item.client.nom_client}</Text>
                        <Text style={styles.saleDetails}>{item.details_commandes.length} {"produit(s) commandé(s)"}</Text>
                        <Text style={styles.saleDetails}>Total : {formatMoneyFR(item.total_ttc)} FCFA</Text>
                        <Text style={styles.saleDetails}>Ref : {item.identifiant_commande}</Text>
                        <Text style={styles.saleDetails}>Code Livraison : {item.code_livraison}</Text>
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
        </>
    );

    // Filtre des commandes
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) {
            return data;
        }

        return data.filter(
            (commande) =>
                commande.code_livraison.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) || commande.client.nom_client.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [data, searchQuery])


    return (
        <FlatList
            style={styles.content}
            data={filteredData}

            initialNumToRender={5} // évite de tout charger d’un coup
            windowSize={21} // limite le nombre d’éléments gardés en mémoire
            removeClippedSubviews={true} // nettoie les vues invisibles
            maxToRenderPerBatch={10}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                    <Text style={{ color: "#888", fontSize: 16 }}>
                        Aucune commande trouvée
                    </Text>
                </View>
            }
            ListHeaderComponent={
                <>
                    <Text style={styles.sectionTitle}>{"Commandes du jour"}</Text>
                    <View style={styles.card}>
                        <Text style={styles.label}>Recherchez une commande</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: M-A1A11A"
                            returnKeyType="search"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#999"
                        />
                    </View>
                </>
            }
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
        />
    );
};

const styles = stylesCss;

export default memo(ListCommandes);
