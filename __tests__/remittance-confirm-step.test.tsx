import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RemittanceConfirmStep from "../components/remittance-confirm-step";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: { language: "en" },
    };
  },
}));

const mockQuote = {
  quoteId: "123",
  sendAmount: 100,
  sendCurrency: "USD",
  receiveAmount: 90.16,
  receiveCurrency: "EUR",
  exchangeRate: 0.92,
  fee: 2.0,
  expiresAt: Date.now() + 300000,
};

describe("RemittanceConfirmStep", () => {
  test("renders quote details correctly", () => {
    render(
      <RemittanceConfirmStep
        quote={mockQuote}
        timeLeft={300}
        onConfirm={() => {}}
        isLoading={false}
      />,
    );

    expect(screen.getByText("remittance.step2.title")).toBeInTheDocument();
    expect(screen.getByText(/€90\.16/i)).toBeInTheDocument();
  });

  test("calls onConfirm when button is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <RemittanceConfirmStep
        quote={mockQuote}
        timeLeft={300}
        onConfirm={onConfirm}
        isLoading={false}
      />,
    );

    const button = screen.getByRole("button", {
      name: "remittance.step2.confirmButton",
    });
    button.click();
    expect(onConfirm).toHaveBeenCalled();
  });
});
