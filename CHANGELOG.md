# Changelog - Gestion Poissonnerie Mobile

## Dernières Modifications (Janvier 2026)

### 🎨 Modifications UI/UX

#### 1. **Configuration Full-Screen**
- ✅ Application utilise maintenant tout l'espace de l'écran du téléphone
- ✅ Barre de statut transparente et transversale configurée dans `app.json`
- ✅ Composant `StatusBar` importé dans `app/_layout.tsx`
- ✅ Layouts convertis en `flex: 1` pour utiliser tout l'espace disponible
- **Fichiers modifiés** : `app.json`, `app/_layout.tsx`, `styles/styles.ts`

#### 2. **Correction de Visibilité des Boutons**
- ✅ Boutons de la page facture (`facture.tsx`) étaient cachés par la barre de navigation
- ✅ Augmentation du padding bottom à 150px pour `ScrollView` sur la page facture
- ✅ Ajout de `paddingBottom: 40px` aux modals
- **Solution** : `contentContainerStyle={{ paddingBottom: 150 }}` + `style={{ paddingBottom: 150 }}`
- **Fichiers modifiés** : `app/(pages)/facture.tsx`, `styles/styles.ts`

#### 3. **Réparation Scroll sur Detail Commande**
- ✅ Page `detail_commande.tsx` ne pouvait pas scroller pour voir tous les détails
- ✅ Correction de la configuration du `ScrollView`
- ✅ Changement du style inline : `style={{ flex: 1, padding: 16 }}`
- ✅ Augmentation du `contentContainerStyle={{ paddingBottom: 100 }}`
- **Fichiers modifiés** : `app/(pages)/detail_commande.tsx`

#### 4. **Correction des Boutons Detail Commande**
- ✅ Suppression des styles problématiques (`margin: 50`, `top: -80`)
- ✅ Implémentation d'une layout horizontale avec `flexDirection: 'row'`
- ✅ Espacement uniforme avec `gap: 10`
- ✅ Distribution équitable de la largeur avec `flex: 1` pour chaque bouton
- ✅ Margins ajustés : `marginTop: 20, marginBottom: 20`
- **Fichiers modifiés** : `app/(pages)/detail_commande.tsx`

#### 5. **Rechargement Automatique de la Liste des Commandes**
- ✅ Page des commandes se recharge automatiquement au retour de la page de détail
- ✅ Hook `useFocusEffect` intégré pour détecter quand l'écran gagne le focus
- ✅ Réinitialisation de la pagination et de la liste lors du retour
- **Fichiers modifiés** : `app/(tabs)/commandes.tsx`

---

### 🔧 État du Projet

**Pages corrigées** :
- ✅ `app/(tabs)/commandes.tsx` - Rechargement auto
- ✅ `app/(pages)/facture.tsx` - Visibilité boutons + scroll
- ✅ `app/(pages)/detail_commande.tsx` - Scroll + boutons layout
- ✅ `components/clients/list_client.tsx` - Alignement left

**Pages à vérifier** :
- 🔍 `app/(pages)/profil.tsx` - Vérifier si scroll OK
- 🔍 `app/(pages)/info.tsx` - Vérifier si scroll OK
- 🔍 Autres pages avec ScrollView

---

### 📋 Notes Importantes

1. **Pagination** : La fonction `listeCommande()` ajoute des résultats en continue, pas de remplacement
2. **Refresh** : Le bouton refresh réinitialise l'offset et la liste avant d'appeler l'API
3. **SafeAreaView** : Ne pas oublier de laisser de l'espace pour la barre de navigation du bas
4. **Loading States** : Les indicateurs de chargement sont visibles pendant les appels API



**Dernière mise à jour** : 20 Janvier 2026
**Version** : 1.0.1
