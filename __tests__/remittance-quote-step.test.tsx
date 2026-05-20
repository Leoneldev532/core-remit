import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RemittanceQuoteStep from "../components/remittance-quote-step";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

jest.mock("../query/remittance-query", () => ({
  useGetRates: () => ({
    data: [
      {
        currency: "EUR",
        rate: 0.92,
        previousRate: 0.91,
        timestamp: Date.now(),
      },
    ],
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("RemittanceQuoteStep", () => {
  it("renders correctly with default values", () => {
    render(<RemittanceQuoteStep onSubmit={jest.fn()} isLoading={false} />, {
      wrapper,
    });

    // Uses getByDisplayValue since labels were removed in the UI refactor
    // sends currency code is rendered as a visible span and option
    expect(screen.getAllByText("USD").length).toBeGreaterThan(0);
  });

  it("updates preview when amount changes", () => {
    render(<RemittanceQuoteStep onSubmit={jest.fn()} isLoading={false} />, {
      wrapper,
    });

    // Target by id since there is no label association anymore
    const input = screen.getByDisplayValue("100");
    fireEvent.change(input, { target: { value: "200" } });

    // (200 - 2) * 0.92 = 182.16 — verify the receive amount updates
    expect(screen.getByDisplayValue("182.16")).toBeInTheDocument();
  });

  it("calls onSubmit with form data when button is clicked", () => {
    const onSubmit = jest.fn();
    render(<RemittanceQuoteStep onSubmit={onSubmit} isLoading={false} />, {
      wrapper,
    });

    fireEvent.click(screen.getByText("remittance.step1.button"));

    expect(onSubmit).toHaveBeenCalledWith({
      sendAmount: 100,
      sendCurrency: "USD",
      receiveCurrency: "EUR",
    });
  });

  it("disables submit button when isLoading is true", () => {
    render(<RemittanceQuoteStep onSubmit={jest.fn()} isLoading={true} />, {
      wrapper,
    });

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(
      screen.getByText("remittance.step1.calculating"),
    ).toBeInTheDocument();
  });
});
