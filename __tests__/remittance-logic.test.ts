import {
  calculateReceiveAmount,
  isQuoteExpired,
} from "../logic/remittance-logic";

describe("Remittance Utilities", () => {
  test("calculateReceiveAmount should correctly compute amount after fee", () => {
    const sendAmount = 100;
    const rate = 0.92;
    const fee = 2.0;
    const expected = (100 - 2) * 0.92;
    expect(calculateReceiveAmount(sendAmount, rate, fee)).toBe(expected);
  });

  test("calculateReceiveAmount should return 0 if amount is less than fee", () => {
    expect(calculateReceiveAmount(1, 0.92, 2)).toBe(0);
  });

  test("isQuoteExpired should return true if expiresAt is in the past", () => {
    const past = Date.now() - 1000;
    expect(isQuoteExpired(past)).toBe(true);
  });

  test("isQuoteExpired should return false if expiresAt is in the future", () => {
    const future = Date.now() + 1000;
    expect(isQuoteExpired(future)).toBe(false);
  });
});
