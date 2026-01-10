// styles.js
import { StyleSheet } from "react-native";

export const COLORS = {
  // primary: "#2c7873",
  primary: "#002f55",
  primaryDark: "#1e5651",
  primaryLight: "#4fa19b",
  // secondary: "#ff7b54",
  secondary: "#e7423e",
  secondaryDark: "#e05a3a",
  // third:"#fff5e8",
  light: "#f8f9fa",
  dark: "#343a40",
  gray: "#6c757d",
  grayLight: "#e9ecef",
  success: "#28a745",
  warning: "#ffc107",
  danger: "#dc3545",
};

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
};

export const stylesCss = StyleSheet.create({

  // === Layout principal ===
  appContainer: {
    maxWidth: 480,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    minHeight: "100%",
    ...SHADOW,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },

  // ===== PAGE CONNEXION =====
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },

  loginHeader: {
    alignItems: "center",
    marginBottom: 40,
  },

  loginLogo: {
    fontSize: 48, // 3rem ≈ 48px
    marginBottom: 16,
  },

  loginLogoImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignSelf: "center",
  },

  loginTitle: {
    fontSize: 40, // 1.5rem ≈ 24px
    fontWeight: "600",
    color: COLORS.primaryDark,
    marginBottom: 8,
  },

  loginSubtitle: {
    color: COLORS.gray,
    textAlign: "center",
    fontSize: 17,
  },

  loginForm: {
    marginBottom: 24,
  },

  loginOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  forgotPassword: {
    color: COLORS.primary,
    textDecorationLine: "none", // équivaut à text-decoration: none
  },

  fingerprintOption: {
    alignItems: "center",
    marginTop: 24,
  },

  fingerprintBtn: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 32, // 2rem ≈ 32px
    color: COLORS.primary,
    marginTop: 8,
  },

  // === Header ===
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOW,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "600",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },

  // === Boutons ===
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: "500",
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: COLORS.secondary,
  },
  btnThird: {
    backgroundColor: COLORS.dark,
  },
  btnSuccess: {
    backgroundColor: COLORS.success
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnFull: {
    width: "100%",
  },
  btnSm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  // === Cartes ===
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    ...SHADOW,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  // === Statistiques ===
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    ...SHADOW,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },

  // === Formulaire ===
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 6,
    fontWeight: "500",
    color: COLORS.dark,
  },
  formControl: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    fontSize: 16,
  },

  // === Listes ===
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  listItemTitle: {
    fontWeight: "500",
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
  },

  // === Badges ===
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    borderRadius: 20,
    textAlign: "center",
  },
  badgePrimary: {
    backgroundColor: COLORS.primaryLight,
    color: "#fff",
  },
  badgeDanger: {
    backgroundColor: COLORS.danger,
    color: "#fff",
  },

  // === Navigation bas ===
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    ...SHADOW,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navItemActive: {
    color: COLORS.primary,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  // === Produits ===
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    ...SHADOW,
    marginBottom: 12,
    marginLeft:0,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.grayLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 13,
    color: COLORS.gray,
  },
  productPrice: {
    fontWeight: "600",
    color: COLORS.primary,
  },

  // === Alertes ===
  alert: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alertWarning: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  alertDanger: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },

  // === Modales ===
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
    padding: 16,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingBottom: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Tableau de Bord
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  iconBtn: { padding: 8 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  btnText: { color: '#fff' },
  alertIcon: { fontSize: 20, marginRight: 8 },
  btnSmall: { color: '#007bff' },
  productStock: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 20 },
  badgeWarning: { backgroundColor: '#dc3545', color: '#fff' },
  badgeSuccess: { backgroundColor: '#28a745', color: '#fff' },
  saleItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 },
  saleInfo: {},
  saleClient: { fontWeight: 'bold' },
  saleDetails: { fontSize: 12, color: '#555' },
  saleAmount: { fontWeight: 'bold' },

  // Filtres
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Remarque: React Native <0.71 ne supporte pas gap, on utilisera margin
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e9ecef", // var(--gray-light)
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 14,
    textAlign: "center",
  },
  filterBtnActive: {
    // backgroundColor: "#2c7873", // var(--primary)
    backgroundColor: "#e7423e",
    color: "white",
    // borderColor: "#2c7873",
    borderColor: "#e7423e",
  },

  // Clients
  listItemContent: { flex: 1 },
  badgeText: { color: "#fff", fontSize: 12 },

  // Ventes
  cartItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: "500" },
  cartItemDetails: { color: "#6c757d", fontSize: 12 },
  cartItemActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  quantityControl: { flexDirection: "row", alignItems: "center", gap: 4 },
  quantityBtn: { borderWidth: 3, borderColor: "#e9ecef", borderRadius: 15, padding: 4 },
  quantityValue: { minWidth: 30, textAlign: "center" },
  cartSummary: { backgroundColor: "white", borderRadius: 8, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryTotal: { borderTopWidth: 1, borderTopColor: "#e9ecef", paddingTop: 8, marginTop: 8 },

  // Rapports
  filterTextActive: { color: "white" },
  chartContainer: { backgroundColor: "white", borderRadius: 8, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  chartPlaceholder: { height: 200, backgroundColor: "#e9ecef", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  activeNav: { color: "#2c7873" },

  // Couleurs texte
  textPrimary: {
    color: COLORS.primary,
  },
  textLight: {
    color: COLORS.light,
  },
  textDark: {
    color: COLORS.dark,
  },
  textSuccess: {
    color: COLORS.success
  },
  textSecondary: {
    color: COLORS.secondary
  },
  textDanger: {
    color: COLORS.danger
  },

  // Modal ajouter vente
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
    alignItems:"center"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalBody: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  // Ajout de client
  modalClose: {
    fontSize: 26,
    color: "gray",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  // Menu deroulant
  menu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    paddingVertical: 8,
    width: 200,
    zIndex: 999,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },

  // Profil utilisateur
  inputGroup: {
    marginBottom: 20,
  },

  // Detail de la vente
  icon: {
    color: '#fff',
    fontSize: 18,
  },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  receiptHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#2c7873',
    marginBottom: 16,
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e5651',
  },
  receiptSubtitle: {
    color: '#6c757d',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#1e5651',
  },
  infoValue: {
    color: '#343a40',
  },
  summary: {
    borderTopWidth: 2,
    borderTopColor: '#2c7873',
    paddingTop: 10,
  },
  summaryLabel: {
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  infoContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  table: { borderTopWidth: 1, borderColor: "#ccc", marginTop: 12 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderColor: "#eee" },
  cell: { flex: 1, textAlign: "right" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  notification: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#d4edda",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 6,
  },
  productCategory: { color: "#777", fontSize: 12 },
  
  // Voir Panier
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.dark,
  },


});
