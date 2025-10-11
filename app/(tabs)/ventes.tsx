import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouveauAchat from "@/components/ventes/add_achat";
import DetailVente from "@/components/ventes/detail_achat";
import ListVentes from "@/components/ventes/list_achat";

export default function Ventes() {
  const [showBill, setShowBill] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const afficherDetail = useCallback(() => {
    setShowBill(true);
  }, [setShowBill]);

  const closeDetail = useCallback(() => {
    setShowBill(false);
  }, [setShowBill]);

  const ventes = [
    {
      id: "1",
      client: "Martin Dupont",
      details: "2 produits • 10:24",
      amount: 45.8,
    },
    {
      id: "2",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "3",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "4",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "5",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "6",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "7",
      client: "Martin Dupont",
      details: "2 produits • 10:24",
      amount: 45.8,
    },
    {
      id: "8",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "9",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "10",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "11",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
    {
      id: "12",
      client: "Sophie Leroy",
      details: "3 produits • 09:15",
      amount: 67.2,
    },
  ];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {showBill ? (
          <DetailVente isVisible={showBill} onClose={closeDetail} />
        ) : isVisible ? (
          <AjoutNouveauAchat
            visible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        ) : (
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Ventes</Text>
              <View style={styles.headerActions}>
                <Pressable style={styles.iconBtn}>
                  <Ionicons name="search" size={25} color={COLORS.light} />
                </Pressable>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => setIsVisible(!isVisible)}
                >
                  <Ionicons name="add-circle" size={25} color={COLORS.light} />
                </Pressable>
              </View>
            </View>
            <ListVentes data={ventes} onSelectedId={afficherDetail} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
