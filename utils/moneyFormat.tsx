export function formatMoneyFR(value: number | string): string {
  if (typeof value === "string") {
    value = parseFloat(value.replace(",", ".")); // support string "250.00" ou "250,00"
  }

  if (isNaN(value)) return "0,00";

  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
