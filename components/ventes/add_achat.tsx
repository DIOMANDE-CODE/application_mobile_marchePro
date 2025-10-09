import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type NouveauAchatProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AjoutNouveauAchat({
  visible,
  onClose,
}: NouveauAchatProps) {
  const [cart, setCart] = useState([
    { name: "Saumon frais", price: 32.5, qty: 1.2 },
    { name: "Filet de bœuf", price: 24.9, qty: 0.8 },
    { name: "Crevettes roses", price: 18.75, qty: 1.5 },
  ]);

  const products = [
    { image: require("@/assets/produits/poisson.jpg") ,name: "Saumon frais", details: "32.50€/kg • 3 kg restants" },
    { image: require("@/assets/produits/viande.jpg") , name: "Filet de bœuf", details: "24.90€/kg • 15 kg restants" },
  ];

  const increaseQty = (index: number) => {
    const newCart = [...cart];
    newCart[index].qty += 0.1;
    setCart(newCart);
  };

  const decreaseQty = (index: number) => {
    const newCart = [...cart];
    newCart[index].qty = Math.max(newCart[index].qty - 0.1, 0);
    setCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
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
            <View style={{ width: 25 }} />
          </View>

          <ScrollView style={styles.content}>
            {/* Panier */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Panier</Text>
                <Text style={styles.badge}>{cart.length} articles</Text>
              </View>

              {cart.map((item, index) => (
                <View key={index} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemDetails}>{item.price}€/kg</Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => decreaseQty(index)}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>
                        {item.qty.toFixed(1)}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => increaseQty(index)}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.saleAmount}>
                      {(item.price * item.qty).toFixed(2)}€
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Résumé */}
            <View style={styles.cartSummary}>
              <View style={styles.summaryRow}>
                <Text>Sous-total:</Text>
                <Text>{subtotal.toFixed(2)}€</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>TVA (10%):</Text>
                <Text>{tax.toFixed(2)}€</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text>Total:</Text>
                <Text>{total.toFixed(2)}€</Text>
              </View>

              <TouchableOpacity style={[styles.btn, styles.btnSuccess]}>
                <Text style={[styles.btnText]}>Finaliser la vente</Text>
              </TouchableOpacity>
            </View>

            {/* Produits disponibles */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Produits disponibles</Text>
              </View>

              {products.map((prod, idx) => (
                <View key={idx} style={styles.productCard}>
                  <Image style={styles.productImage} source={prod.image} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{prod.name}</Text>
                    <Text style={styles.productDetails}>{prod.details}</Text>
                  </View>
                  <TouchableOpacity style={[styles.btn]}>
                    <Ionicons name="add-circle" size={30} color={COLORS.primaryDark}/>
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
