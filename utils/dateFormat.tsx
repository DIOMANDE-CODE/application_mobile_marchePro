export const formatDateHeureFR = (date: Date | string | number): string => {
  const d = new Date(date);

  // Formater la date
  const dateStr = d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase()); // première lettre en majuscule

  // Formater l'heure
  const heures = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const heureStr = `${heures}:${minutes}`;

  return `${dateStr} - ${heureStr}`;
};