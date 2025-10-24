import AsyncStorage from "@react-native-async-storage/async-storage";

const estVendeur = async () => {
    const roleData = await AsyncStorage.getItem("user_info");
    if (roleData) {
        const role = JSON.parse(roleData)
        return role.role === "vendeur";
    }
}

const estAdmin = async () => {
    const roleData = await AsyncStorage.getItem("user_info");
    if (roleData) {
        const role = JSON.parse(roleData)
        return role.role === "admin";
    }
}

export { estAdmin, estVendeur };

