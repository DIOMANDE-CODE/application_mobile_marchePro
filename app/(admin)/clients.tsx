import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


// Import des composants
import AjoutNouveauClient from "@/components/clients/add_client";
import EditClient from "@/components/clients/edit_client";
import ListeDesClients from "@/components/clients/list_client";

interface Client {
  identifiant_client: string;
  nom_client: string;
  numero_telephone_client: string;
  date_creation : string;
}

export default function ListClients() {
  const [isVisible, setIsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [idClient, setIdClient] = useState<string | null>(null);
  const [client, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [offset,setOffset] = useState(0)
  const [next,setNext] = useState(null)
  const limit = 10

  //   Fonction modifier client
  const modifierClient = (id: string) => {
    setIdClient(id);
    setEditVisible(true);
  };

  // Lister les clients
  const listeClient = async () => {
    if (loadingClient) return;
    setLoadingClient(true)
    try {
      const response = await api.get("/clients/list/",{
        params : {
          limit,offset
        }
      });
      if (response.status === 200) {
        const root = response.data
        const pagination = root.data;
        setClient((prev) => {
          const merged = [...prev,...pagination.results];

          const unique = merged.filter(
            (item,index,self) => index === self.findIndex((p) => p.identifiant_client === item.identifiant_client)
          );
          return unique;
        });

        setOffset((prev) => prev + pagination.results.length);
        setNext(pagination.next)
        
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        console.error("Erreur dans listeClient:", error);

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
    setLoadingClient(false)
  };

  // Foncton rafraichir la page
  const refreshPage = () => {
    setLoading(true);
    listeClient();
    setOffset(0)
    setNext(null)
    setLoading(false);
  }

  // Pre-chargement
  useEffect(() => {
    setOffset(0)
    setNext(null)
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
            <TouchableOpacity style={styles.iconBtn} onPress={refreshPage}>
              <Ionicons name="reload-circle" size={35} color={COLORS.light} />
            </TouchableOpacity>
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
        <ListeDesClients data={client} onSelectedId={modifierClient} onEndReached = {() => {
          if (!loadingClient && next){
            listeClient()
          }
        }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
