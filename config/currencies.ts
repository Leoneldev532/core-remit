export const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "USA", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Europe", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "UK", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japan", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australia", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canada", symbol: "C$", flag: "🇨🇦" },
];

export const SEND_CURRENCIES = SUPPORTED_CURRENCIES.filter(
  (c) => c.code === "USD",
);
export const RECEIVE_CURRENCIES = SUPPORTED_CURRENCIES.filter(
  (c) => c.code !== "USD",
);
