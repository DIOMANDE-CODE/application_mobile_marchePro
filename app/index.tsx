import api from "@/services/api";
import { COLORS } from "@/styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StatusBar, View } from "react-native";
import "react-native-reanimated";

export default function Index() {
    const router = useRouter();
    const segments = useSegments() as string[];
    const [loading, setLoading] = useState(true);

    const checkToken = async () => {
        const token = await SecureStore.getItemAsync("auth_token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/authentification/check_session/", {
                token_key: token,
            });

            if (response.status === 200) {
                const role = await AsyncStorage.getItem("user_role");
                api.defaults.headers.common["Authorization"] = `Token ${token}`;

                if (role === "admin") {
                    router.replace("/(admin)");
                } else {
                    router.replace("/(tabs)");
                }
            }
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;

                if (status === 401 || status === 403) {
                    await SecureStore.deleteItemAsync("auth_token");
                    await AsyncStorage.removeItem("user_role");
                    router.replace("/login");
                    return;
                }

                const data = error.response.data.errors;
                let message = "";

                if (typeof data === "string") message = data;
                else if (typeof data === "object") message = JSON.stringify(data);
                else message = "Erreur inattendue";

                Alert.alert("Erreur", message);
            } else {
                Alert.alert("Erreur", error.message || "Erreur réseau");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // on n'exécute la vérification que sur la racine
        if (segments.length === 0 || segments[0] === "(root)") {
            checkToken();
        } else {
            setLoading(false);
        }
    }, [segments]);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <Redirect href="/login" />
        </>
    );
}
