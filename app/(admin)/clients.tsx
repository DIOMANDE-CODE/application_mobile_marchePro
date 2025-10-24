import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


// Import des composants
import AjoutNouveauClient from "@/components/clients/add_client";
import EditClient from "@/components/clients/edit_client";
import ListeDesClients from "@/components/clients/list_client";

interface Tache {
  identifiant_client: string;
  nom_client: string;
  numero_telephone_client: string;
}

export default function ListClients() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idClient, setIdClient] = useState<string | null>(null);
  const [client, setClient] = useState<Tache[]>([]);
  const [loading, setLoading] = useState(false);

  //   Fonction modifier client
  const modifierClient = (id: string) => {
    setIdClient(id);
    setEditVisible(true);
  };

  // Lister les clients
  const listeClient = async () => {
    try {
      const response = await api.get("/clients/list/");
      if (response.status === 200) {
        const data = response.data;
        console.log("Liste des clients :",data.data);
        setClient(data.data);
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
    listeClient();
    setLoading(false);
  }

  // Pre-chargement
  useEffect(() => {
    listeClient();
  }, [isVisible, editVisible, idClient]);

  if (loading) return (<ActivityIndicator size="large" color={COLORS.primary} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestion des clients</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={refreshPage}>
              <Ionicons name="reload-circle" size={35} color={COLORS.light} />
            </Pressable>
          </View>
        </View>
        {isVisible && (
          <AjoutNouveauClient
            visible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        )}
        {editVisible && (
          <EditClient
            identifiant={idClient}
            editVisible={editVisible}
            onEditClose={() => setEditVisible(false)}
          />
        )}
        <ListeDesClients data={client} onSelectedId={modifierClient} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
