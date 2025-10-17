import api from "@/services/api";
import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

type NouveauClientProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AjoutNouveauClient({
  visible,
  onClose,
}: NouveauClientProps) {
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

  const ajouterNouveauClient = async () => {
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
      const response = await api.post("/clients/create/", {
        nom_client: nom,
        numero_telephone_client: numero,
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Succès", "Nouveau client ajouté");
        setNom("");
        setNumero("");
        onClose();
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
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          visible={visible}
          onRequestClose={onClose}
          transparent={true}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nouveau client</Text>

                <ScrollView style={styles.modalBody}>
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
                    placeholder="Ex: XX XX XX XX XX"
                    keyboardType="phone-pad"
                    value={numero}
                    onChangeText={setNumero}
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={[styles.btn]} onPress={onClose}>
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
                      onPress={ajouterNouveauClient}
                    >
                      <Ionicons
                        name="add-circle"
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
