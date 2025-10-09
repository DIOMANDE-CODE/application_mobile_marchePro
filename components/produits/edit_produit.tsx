import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type EditProduitProps = {
  identifiant: number | null;
  editVisible: boolean;
  onEditClose: () => void;
};

export default function EditProduit({
  identifiant,
  editVisible,
  onEditClose,
}: EditProduitProps) {
  useEffect(() => {
    console.log("identifiant cliqué ", identifiant);
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback>
          <Modal
            animationType="slide"
            visible={editVisible}
            onRequestClose={onEditClose}
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Detail du produit
                </Text>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.label}>Nom du produit</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Saumon frais"
                  />

                  <Text style={styles.label}>Catégorie</Text>
                  <Picker style={styles.picker}>
                    <Picker.Item label="Sélectionnez une catégorie" value="" />
                    <Picker.Item label="Poissonnerie" value="poissonnerie" />
                    <Picker.Item label="Boucherie" value="boucherie" />
                  </Picker>

                  <Text style={styles.label}>Prix (€)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 32.50"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Unité</Text>
                  <Picker style={styles.picker}>
                    <Picker.Item label="Kilogramme (kg)" value="kg" />
                    <Picker.Item label="Unité" value="unit" />
                    <Picker.Item label="Pack" value="pack" />
                  </Picker>

                  <Text style={styles.label}>Stock initial</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 15"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Alerte stock faible</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 5"
                    keyboardType="numeric"
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.btn]}
                    onPress={onEditClose}
                  >
                    <Ionicons name="close-circle" size={40} color={COLORS.danger}/>

                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn]}>
                    <Ionicons name="add-circle" size={40} color={COLORS.primary}/>
                    
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = stylesCss;
