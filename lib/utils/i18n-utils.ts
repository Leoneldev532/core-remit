export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = "en-US",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string | Date, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof date === "string" ? new Date(date) : date);
};
