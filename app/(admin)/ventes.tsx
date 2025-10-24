import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import des composants
import RecuVente from "@/components/recu";
import AjoutNouveauAchat from "@/components/ventes/add_achat";
import ListVentes from "@/components/ventes/list_achat";

export default function Ventes() {
  const [showBill, setShowBill] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [listeVentes, setListeVentes] = useState([]);
  const [selectedVenteId, setSelectedVenteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Afficher les ventes
  const listeVente = async () => {
    try {
      const response = await api.get("/ventes/list/");
      if (response.status === 200) {
        const data = response.data;
        setListeVentes(data.data);
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

  const afficherDetail = useCallback(
    (id: string) => {
      setSelectedVenteId(id);
      setShowBill(true);
    },
    [setShowBill]
  );

  const closeDetail = useCallback(() => {
    setShowBill(false);
  }, [setShowBill]);

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    listeVente();
    setLoading(false);
  };

  useEffect(() => {
    listeVente();
  }, [showBill, isVisible]);

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
        {showBill && selectedVenteId ? (
          <RecuVente
            isVisible={showBill}
            venteID={selectedVenteId}
            onClose={closeDetail}
          />
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
                <Pressable style={styles.iconBtn} onPress={refreshPage}>
                  <Ionicons
                    name="reload-circle"
                    size={35}
                    color={COLORS.light}
                  />
                </Pressable>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => setIsVisible(!isVisible)}
                >
                  <Ionicons name="add-circle" size={35} color={COLORS.light} />
                </Pressable>
              </View>
            </View>
            <ListVentes data={listeVentes} onSelectedId={afficherDetail} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
