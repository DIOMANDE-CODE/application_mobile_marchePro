import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import api from "@/services/api";

interface Categorie {
  identifiant_categorie: string;
  nom_categorie: string;
}

type NouveauProduitProps = {
  visible: boolean;
  onEditClose: () => void;
};

export default function AjoutNouveauProduit({
  visible,
  onEditClose,
}: NouveauProduitProps) {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [seuil, setSeuil] = useState("");
  const [quantite, setQuantite] = useState("");
  const [categorie, setCategorie] = useState("");
  const [erreurNom, setErreurNom] = useState("");
  const [erreurPrix, setErreurPrix] = useState("");
  const [erreurQuantite, setErreurQuantite] = useState("");
  const [erreurSeuil, setErreurSeuil] = useState("");
  const [erreurCategorie, setErreurCategorie] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [listCategorie, setListCategorie] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(false);

    // Fonction de redimensionnement de l'image
    const resizeAndCompressImage = async (uri: string) => {
      const result = await ImageManipulator.manipulateAsync(
        uri, 
        [{ resize: { width: 800 } }], // tableau d'actions
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // options de sauvegarde
      );
    
      return result.uri;
    };

  // Fonction pour choisir une image
  const choisirImage = async () => {
    // Demande de permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission d'accès à la galerie refusée !");
      return;
    }

    // Ouverture de la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageResize = await resizeAndCompressImage(result.assets[0].uri);
      setImage(imageResize);
    }
  };

  // Charger les catégories
  const liste_categorie = async () => {
    try {
      const response = await api.get("/produits/list/categorie/");
      if (response.status === 200) {
        const data = response.data;
        setListCategorie(data.data);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // On transforme le message en texte
        let message = "";

        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = JSON.stringify(data);
        } else {
          message = "Erreur inattendue";
        }

        if (status === 400) {
          Alert.alert("Erreur 400", message);
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 401) {
          Alert.alert("Erreur 401", "Mot de passe incorrect");
        } else {
          Alert.alert("Erreur", message);
        }
      } else {
        Alert.alert("Erreur", error.message || "Erreur réseau");
      }
    } finally {
      setLoading(false);
    }
  };

  const ajouterProduit = async () => {
    setErreurNom("")
    setErreurPrix("")
    setErreurQuantite("")
    setErreurCategorie("")
    setErreurSeuil("")
    // Verifier les champs
    let hasError = false;
    if (!nom.trim()) {
      setErreurNom("Ce champs est obligatoire");
      hasError = true;
    }
    if (!prix.trim()) {
      setErreurPrix("Ce champs est obligatoire");
      hasError = true;
    }
    if (!quantite.trim()) {
      setErreurQuantite("Ce champs est obligatoire");
      hasError = true;
    }
    if (!seuil.trim()) {
      setErreurSeuil("Ce champs est obligatoire");
      hasError = true;
    }
    if (!categorie.trim()) {
      setErreurCategorie("Ce champs est obligatoire");
      hasError = true;
    }
    if (hasError) return;

    // Appell API
    const formData = new FormData();
    formData.append("nom_produit", nom.trim());
    formData.append("prix_unitaire_produit", prix.trim());
    formData.append("quantite_produit_disponible", quantite.trim());
    formData.append("seuil_alerte_produit", seuil.trim());
    formData.append("categorie_produit", categorie.trim());
    if (image) {
      const fileName = image.split("/").pop();
      const ext = fileName?.split(".").pop()?.toLowerCase();

      let mimeType = "image/jpeg";
      if (ext === "png") mimeType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";

      formData.append("image_produit", {
        uri: image,
        name: fileName || "produit.jpg",
        type: mimeType,
      } as any);
    }
    setLoading(true);

    try {
      const response = await api.post("/produits/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Succès", "Nouveau produit ajouté");
        setNom("");
        setPrix("");
        setSeuil("");
        setQuantite("");
        setCategorie("");
        setImage("");
      }
    } catch (error: any) {

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data.errors;

        // On transforme le message en texte
        let message = "";

        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = JSON.stringify(data);
        } else {
          message = "Erreur inattendue";
        }

        if (status === 400) {
          Alert.alert("Erreur 400", message);
        } else if (status === 500) {
          Alert.alert("Erreur 500", "Erreur survenue au serveur");
        } else if (status === 409) {
          Alert.alert("Erreur 401", message);
        } else {
          Alert.alert("Erreur", message);
        }
      } else {
        Alert.alert("Erreur", error.message || "Erreur réseau");
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-chargement
  useEffect(() => {
    liste_categorie();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          visible={visible}
          onRequestClose={onEditClose}
          transparent={true}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Ajouter un nouveau produit
                </Text>

                <ScrollView style={styles.modalBody}>
                  {image && (
                    <View style={{ alignItems: "center", marginVertical: 10 }}>
                      <Image
                        source={{ uri: image }}
                        style={{ width: 120, height: 120, borderRadius: 10 }}
                      />
                    </View>
                  )}
                  {/* <Text style={styles.label}>Image du produit</Text>
                  <Button title="Choisir une image" onPress={choisirImage} /> */}

                  <Text style={styles.label}>Nom du produit</Text>
                  {erreurNom && (
                    <Text style={styles.textDanger}>{erreurNom}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Saumon frais"
                    value={nom}
                    onChangeText={setNom}
                  />

                  <Text style={styles.label}>Catégorie</Text>
                  {erreurCategorie && (
                    <Text style={styles.textDanger}>{erreurCategorie}</Text>
                  )}
                  <Picker
                    style={styles.picker}
                    selectedValue={categorie}
                    onValueChange={(itemValue) => setCategorie(itemValue)}
                  >
                    <Picker.Item label="Sélectionnez une catégorie" value="" />
                    {listCategorie.map((cat, index) => (
                      <Picker.Item
                        key={index}
                        label={cat.nom_categorie}
                        value={cat.identifiant_categorie}
                      />
                    ))}
                  </Picker>

                  <Text style={styles.label}>Prix unitaire (FCFA)</Text>
                  {erreurPrix && (
                    <Text style={styles.textDanger}>{erreurPrix}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 1500"
                    keyboardType="numeric"
                    value={prix}
                    onChangeText={setPrix}
                  />

                  <Text style={styles.label}>Stock initial</Text>
                  {erreurQuantite && (
                    <Text style={styles.textDanger}>{erreurQuantite}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 15"
                    keyboardType="numeric"
                    value={quantite}
                    onChangeText={setQuantite}
                  />

                  <Text style={styles.label}>Alerte stock faible</Text>
                  {erreurSeuil && (
                    <Text style={styles.textDanger}>{erreurSeuil}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 5"
                    keyboardType="numeric"
                    value={seuil}
                    onChangeText={setSeuil}
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
                      onPress={ajouterProduit}
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
