import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import AjoutNouveauAchat from "@/components/ventes/add_achat";

export default function Ventes() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {isVisible ? (
          <AjoutNouveauAchat visible={isVisible} onClose={() => setIsVisible(false)} />
        ) : (
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Ventes</Text>
              <View style={styles.headerActions}>
                <Pressable style={styles.iconBtn}>
                  <Ionicons name="search" size={25} color={COLORS.light} />
                </Pressable>
                <Pressable style={styles.iconBtn} onPress={()=>setIsVisible(!isVisible)}>
                  <Ionicons name="add-circle" size={25} color={COLORS.light} />
                </Pressable>
              </View>
            </View>
            <ScrollView style={styles.content}>
              <Text style={styles.sectionTitle}>{"Ventes du jour"}</Text>
              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Martin Dupont</Text>
                  <Text style={styles.saleDetails}>2 produits • 10:24</Text>
                </View>
                <Text style={styles.saleAmount}>45.80€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Martin Dupont</Text>
                  <Text style={styles.saleDetails}>2 produits • 10:24</Text>
                </View>
                <Text style={styles.saleAmount}>45.80€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>

              <View style={styles.saleItem}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleClient}>Sophie Leroy</Text>
                  <Text style={styles.saleDetails}>3 produits • 09:15</Text>
                </View>
                <Text style={styles.saleAmount}>67.20€</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
