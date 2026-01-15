import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { memo, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";


type MenuProps = {
  onProfile: () => void;
  addVendeur: () => void;
  onInfo: () => void;
  onLogout: () => void;
};
const Menu = ({ onProfile, addVendeur, onInfo, onLogout }: MenuProps) => {
  const [isAdmin, setIsAdmin] = useState(false)


  const estAdmin = async () => {
    const role = await AsyncStorage.getItem("user_role");
    if (role === "admin") {
      setIsAdmin(true)
    }

  }

  useEffect(() => {
    estAdmin()
  })

  return (
    <View style={stylesCss.menu}>
      {
        isAdmin && (
          <Pressable style={stylesCss.menuItem} onPress={addVendeur}>
            <Ionicons
              name="add"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={stylesCss.menuText}>Ajouter un employé</Text>
          </Pressable>
        )
      }

      <Pressable style={stylesCss.menuItem} onPress={onProfile}>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={stylesCss.menuText}>Mon profil</Text>
      </Pressable>

      <Pressable style={stylesCss.menuItem} onPress={onInfo}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={stylesCss.menuText}>Info</Text>
      </Pressable>

      <Pressable style={stylesCss.menuItem} onPress={onLogout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color={COLORS.danger}
          style={{ marginRight: 8 }}
        />
        <Text style={[stylesCss.menuText, { color: COLORS.danger }]}>
          Déconnexion
        </Text>
      </Pressable>
    </View>
  );
};

export default memo(Menu);
