import CONFIG from "@/constants/config";
import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { formatMoneyFR } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type NouveauAchatProps = {
  visible: boolean;
  onClose: () => void;
};

type Categorie = {
  identifiant_categorie: string;
  nom_categorie: string;
};
type Produit = {
  identifiant_produit: string;
  image_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
  seuil_alerte_produit: number;
  categorie_produit: Categorie;
};

type Cart = {
  identifiant_produit: string;
  nom_produit: string;
  prix_unitaire_produit: number;
  quantite_produit_disponible: number;
  quantite_total_produit?: number;
};

export default function AjoutNouveauAchat({
  visible,
  onClose,
}: NouveauAchatProps) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);
  const [voirPanier, setVoirPanier] = useState(true);
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [erreurNom, setErreurNom] = useState("");
  const [erreurNumero, setErreurNumero] = useState("");
  const  [loading, setLoading] = useState(false);

  // fonction validation numero
  // Fonction de validation du numero
  const validationNumeroCI = (numero: string) => {
    const regex = /^(?:\+225|00225)?(01|05|07|25|27)\d{8}$/;
    return regex.test(numero);
  };

  // Voir resumé de la vente
  const ValiderVente = () => {
    if (!cart.length) {
      Alert.alert("", "Aucun article dans le panier");
      return;
    } else {
      // Verifier les champs
      let hasError = false;
      if (!nom.trim()) {
        setErreurNom("Ce champs est obligatoire");
        hasError = true;
      }
      if (!numero.trim()) {
        setErreurNumero("Ce champs est obligatoire");
        hasError = true;
      } else if (!validationNumeroCI(numero)) {
        setErreurNumero("Numero invalide (respecter le Format CI)");
        hasError = true;
      }
      if (hasError) return;
      const facture = {
        client: {
          nom_client: nom,
          numero_telephone_client: numero,
        },
        items: cart,
        total_ht: subtotal.toFixed(2),
        tva: tax.toFixed(2),
        total_ttc: total.toFixed(2),
      };
      router.push({
        pathname: "/(pages)/facture",
        params: { facture: JSON.stringify(facture) },
      });
      // setShowFacture(true);
      // onClose();
    }
  };



  // fonction toggle panier
  const togglePanier = () => {
    setVoirPanier(!voirPanier);
  };
  // Fonction des produits disponibles
  const listeProduitDisponible = async () => {
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

    // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    listeProduitDisponible();
    setLoading(false);
  };

  // Ajouter un produit au panier
  const ajouterProduit = (id: string) => {
    const produit = produits.find((p) => p.identifiant_produit === id);
    if (produit) {
      if (produit.quantite_produit_disponible === 0) {
        Alert.alert("", `Stock de ${produit.nom_produit} Epuisé`);
        return;
      }
      const produitPresent = cart.find((p) => p.identifiant_produit === id);
      if (produitPresent) {
        Alert.alert("", "Article déjà ajouté au panier");
        return;
      } else {
        setCart([
          ...cart,
          {
            ...produit,
            quantite_total_produit: produit.quantite_produit_disponible,
            quantite_produit_disponible: 1,
          },
        ]);
        produit.quantite_produit_disponible -= 1;
      }
    }
  };

  // Retirer un produit du panier
  const retirerProduit = (id: string) => {
    const produit = produits.find((p) => p.identifiant_produit === id);
    if (produit) {
      const produitPresent = cart.find((p) => p.identifiant_produit === id);
      if (!produitPresent) {
        Alert.alert("", "Article non présent dans le panier");
        return;
      } else {
        produit.quantite_produit_disponible =
          produitPresent.quantite_total_produit ||
          produit.quantite_produit_disponible;
        const newCart = cart.filter((p) => p.identifiant_produit !== id);
        setCart(newCart);
      }
    }
  };

  const increaseQty = (index: number, id: string) => {
    const produit = produits.find((p) => p.identifiant_produit === id);
    if (produit) {
      if (produit.quantite_produit_disponible === 0) {
        Alert.alert("", `Stock de ${produit.nom_produit} Epuisé`);
        return;
      } else if (produit.quantite_produit_disponible > 0) {
        const newCart = [...cart];
        newCart[index].quantite_produit_disponible += 1;
        setCart(newCart);
        produit.quantite_produit_disponible -= 1;
        setProduits([...produits]);
      }
    }
  };

  const decreaseQty = (index: number, id: string) => {
    const produit = produits.find((p) => p.identifiant_produit === id);
    if (produit) {
      if (cart[index].quantite_produit_disponible === 1) {
        Alert.alert("", `Quantité minimale de ${produit.nom_produit} atteinte`);
        return;
      } else {
        produit.quantite_produit_disponible += 1;
        setProduits([...produits]);
        const newCart = [...cart];
        newCart[index].quantite_produit_disponible = Math.max(
          newCart[index].quantite_produit_disponible - 1,
          0
        );
        setCart(newCart);
      }
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.prix_unitaire_produit * item.quantite_produit_disponible,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    listeProduitDisponible();
  }, [visible]);

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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
            <Pressable onPress={onClose}>
              <Ionicons name="arrow-back" size={25} color={COLORS.light} />
            </Pressable>
            <Text style={styles.headerTitle}>Nouvelle vente</Text>
            {/* <View style={{ width: 25 }} /> */}
            <TouchableOpacity style={styles.iconBtn} onPress={refreshPage}>
              <Ionicons name="reload-circle" size={35} color={COLORS.light} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Icône d’affichage */}
            <TouchableOpacity style={styles.toggleBtn} onPress={togglePanier}>
              <Ionicons
                name={voirPanier ? "chevron-up-circle" : "chevron-down-circle"}
                size={30}
                color={COLORS.dark}
              />
              <Text style={styles.toggleText}>
                {voirPanier ? "Masquer le panier" : "Afficher le panier"}
              </Text>
            </TouchableOpacity>

            {voirPanier && (
              <>
                {/* CLIENT */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Client</Text>
                  </View>
                  <Text style={styles.label}>Nom complet</Text>
                  {erreurNom && (
                    <Text style={styles.textDanger}>{erreurNom}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Konan Marcel"
                    value={nom}
                    onChangeText={setNom}
                  />

                  <Text style={styles.label}>Téléphone</Text>
                  {erreurNumero && (
                    <Text style={styles.textDanger}>{erreurNumero}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: XXXXXXXXXX"
                    keyboardType="phone-pad"
                    value={numero}
                    onChangeText={setNumero}
                  />
                </View>

                {/* Panier */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Panier</Text>
                    <Text style={styles.badge}>{cart.length} articles</Text>
                  </View>

                  {cart.map((item, index) => (
                    <View key={index} style={styles.cartItem}>
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>
                          {item.nom_produit}
                        </Text>
                        <Text style={styles.cartItemDetails}>
                          {formatMoneyFR(item.prix_unitaire_produit)} FCFA/unité
                        </Text>
                      </View>
                      <View style={styles.cartItemActions}>
                        <View style={styles.quantityControl}>
                          <TouchableOpacity
                            style={styles.quantityBtn}
                            onPress={() =>
                              decreaseQty(index, item.identifiant_produit)
                            }
                          >
                            <Text>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityValue}>
                            {item.quantite_produit_disponible}
                          </Text>
                          <TouchableOpacity
                            style={styles.quantityBtn}
                            onPress={() =>
                              increaseQty(index, item.identifiant_produit)
                            }
                          >
                            <Text>+</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.saleAmount}>
                          {formatMoneyFR(
                            (
                              item.prix_unitaire_produit *
                              item.quantite_produit_disponible
                            ).toFixed(2)
                          )}{" "}
                          FCFA
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                {/* Résumé */}
                <View style={styles.cartSummary}>
                  <View style={styles.summaryRow}>
                    <Text>Sous-total:</Text>
                    <Text>{formatMoneyFR(subtotal.toFixed(2))}FCFA</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text>TVA (10%):</Text>
                    <Text>{formatMoneyFR(tax.toFixed(2))}FCFA</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotal]}>
                    <Text>Total:</Text>
                    <Text>{formatMoneyFR(total.toFixed(2))}FCFA</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnSuccess]}
                    onPress={ValiderVente}
                  >
                    <Text style={[styles.btnText]}>Finaliser la vente</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Produits disponibles */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Produits disponibles</Text>
              </View>

              {produits.map((prod, idx) => (
                <View key={prod.identifiant_produit} style={styles.productCard}>
                  <Image
                    style={styles.productImage}
                    source={{
                      uri: `${CONFIG.API_IMAGE_BASE_URL}${prod.image_produit}`,
                    }}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{prod.nom_produit}</Text>
                    <Text style={styles.productDetails}>
                      Prix unitaire :{" "}
                      {formatMoneyFR(prod.prix_unitaire_produit)}
                    </Text>
                    <Text style={styles.productDetails}>
                      Quantité : {prod.quantite_produit_disponible}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.btn, { paddingRight: 1 }]}
                    onPress={() => {
                      ajouterProduit(prod.identifiant_produit);
                    }}
                  >
                    <Ionicons
                      name="add-circle"
                      size={30}
                      color={COLORS.primaryDark}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn]}
                    onPress={() => {
                      retirerProduit(prod.identifiant_produit);
                    }}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={30}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
