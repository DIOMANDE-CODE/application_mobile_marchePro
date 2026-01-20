import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type EditClientProps = {
  identifiant: string | null;
  editVisible: boolean;
  onEditClose: () => void;
};

export default function EditClient({
  identifiant,
  editVisible,
  onEditClose,
}: EditClientProps) {
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [erreurNom, setErreurNom] = useState("");
  const [erreurNumero, setErreurNumero] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction de validation du numero
  const validationNumeroCI = (numero: string) => {
    const regex = /^(?:\+225|00225)?(01|05|07|25|27)\d{8}$/;
    return regex.test(numero);
  };

  // Fonction pour modifier les info
  const modifierClient = async () => {
    setErreurNom("");
    setErreurNumero("");
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
      setErreurNumero("Numero invalide");
      hasError = true;
    }
    if (hasError) return;

    // Appel API
    setLoading(true);
    try {
      const response = await api.put(`/clients/detail/${identifiant}/`, {
        nom_client: nom,
        numero_telephone_client: numero,
      });
      if (response.status === 200) {
        Alert.alert("Succès", "Modification effectuée");
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
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les details du client
  const info_client = useCallback(async () => {
    try {
      const response = await api.get(`/clients/detail/${identifiant}/`);
      if (response.status === 200) {
        const data = response.data;
        setNom(data.data.nom_client);
        setNumero(data.data.numero_telephone_client);
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
  }, [identifiant]);

  // Pre-chargement
  useEffect(() => {
    info_client();
  }, [info_client]);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          visible={editVisible}
          onRequestClose={onEditClose}
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={onEditClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Detail du client</Text>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.label}>Nom complet</Text>
                  {erreurNom && (
                    <Text style={styles.textDanger}>{erreurNom}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    value={nom}
                    onChangeText={setNom}
                  />

                  <Text style={styles.label}>Téléphone</Text>
                  {erreurNumero && (
                    <Text style={styles.textDanger}>{erreurNumero}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={numero}
                    onChangeText={setNumero}
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={[styles.btn]} onPress={onEditClose}>
                    <Ionicons
                      name="close-circle"
                      size={30}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                  {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <TouchableOpacity
                      style={[styles.btn]}
                      onPress={modifierClient}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={30}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
