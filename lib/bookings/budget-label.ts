const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatBookingBudgetLabel(budget: number | null) {
  if (budget !== null) {
    return pesoFormatter.format(budget);
  }

  return "Not specified";
}
