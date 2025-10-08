import { stylesCss } from "@/styles/styles";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
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
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          visible={visible}
          onRequestClose={onClose}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un nouveau produit</Text>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Martin Dupont"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: martin.dupont@email.com"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 06 12 34 56 78"
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Adresse</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Adresse complète"
                  multiline
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={onClose}
                >
                  <Text style={[styles.btnText, styles.textLight]}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
                  <Text style={[styles.btnText, { color: "#fff" }]}>
                    Enregistrer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
