import * as Network from "expo-network";

export async function checkConnection(){
    const state = await Network.getNetworkStateAsync();
    return state.isConnected
    
}