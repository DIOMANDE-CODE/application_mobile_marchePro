# Changelog - Gestion Poissonnerie Mobile

## Dernières Modifications (Janvier 2026)

#### 1. **Rechargement Automatique de la Liste des Commandes (Version 2)**
- ✅ Refactorisation complète du système de rechargement
- ✅ Paramètre `customOffset` ajouté à `listeCommande(customOffset = offset)` pour flexibilité
- ✅ Fonction `refreshPage()` simplifiée : vide la liste et force `offset = 0`
- ✅ `useEffect` réagit à `isVisible` et `showBill` pour recharger automatiquement
- ✅ Suppression du `useFocusEffect` pour une approche plus simple et maintenable
- **Solution finale** : 
  ```typescript
  const refreshPage = async () => {
    setListeCommandes([]);
    await listeCommande(0); // force offset = 0
  };
  ```
- **Fichiers modifiés** : `app/(tabs)/commandes.tsx`


**Dernière mise à jour** : 20 Janvier 2026
**Version** : 1.0.2
