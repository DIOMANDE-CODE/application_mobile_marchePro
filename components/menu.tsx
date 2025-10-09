import { COLORS, stylesCss } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

type MenuProps = {
    onProfile : ()=>void;
    onInfo : ()=>void;
    onLogout : ()=>void;
}
const Menu = ({onProfile, onInfo, onLogout}:MenuProps) => {
    return (
        <View style={stylesCss.menu}>
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
    )
}

export default memo(Menu);