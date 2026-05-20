import { renderHook, act } from "@testing-library/react";
import { useRemittanceWizardViewModel } from "../hooks/use-remittance-wizard-view-model";
import { Provider } from "jotai";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Provider>{children}</Provider>
  </QueryClientProvider>
);

const mockTrackAbandonment = jest.fn();

jest.mock("../query/remittance-query", () => ({
  useCreateQuote: () => ({
    mutate: jest.fn((data, callbacks) =>
      callbacks.onSuccess({ quoteId: "q1" }),
    ),
    isPending: false,
  }),
  useConfirmTransfer: () => ({
    mutate: jest.fn((data, callbacks) =>
      callbacks.onSuccess({ transactionId: "t1" }),
    ),
    isPending: false,
  }),
  useTrackAbandonment: () => ({
    mutate: mockTrackAbandonment,
  }),
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

describe("useRemittanceWizardViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should start at step 1", () => {
    const { result } = renderHook(() => useRemittanceWizardViewModel(), {
      wrapper,
    });
    expect(result.current.step).toBe(1);
  });

  it("should advance to step 2 after getting a quote", () => {
    const { result } = renderHook(() => useRemittanceWizardViewModel(), {
      wrapper,
    });

    act(() => {
      result.current.handleGetQuote({
        sendAmount: 100,
        sendCurrency: "USD",
        receiveCurrency: "EUR",
      });
    });

    expect(result.current.step).toBe(2);
    expect(result.current.quote).toEqual({ quoteId: "q1" });
  });

  it("should advance to step 3 after confirming", () => {
    const { result } = renderHook(() => useRemittanceWizardViewModel(), {
      wrapper,
    });

    act(() => {
      result.current.handleGetQuote({
        sendAmount: 100,
        sendCurrency: "USD",
        receiveCurrency: "EUR",
      });
    });

    act(() => {
      result.current.handleConfirm();
    });

    expect(result.current.step).toBe(3);
    expect(result.current.receipt).toEqual({ transactionId: "t1" });
  });

  it("should reset to step 1 on resetWizard", () => {
    const { result } = renderHook(() => useRemittanceWizardViewModel(), {
      wrapper,
    });

    act(() => {
      result.current.handleGetQuote({
        sendAmount: 100,
        sendCurrency: "USD",
        receiveCurrency: "EUR",
      });
    });
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.resetWizard();
    });
    expect(result.current.step).toBe(1);
    expect(result.current.quote).toBeNull();
  });

  /**
   * CRITICAL: Verifies the Temporal State Management requirement.
   * When the 5-minute countdown expires at Step 2 without user confirmation,
   * the hook MUST:
   *   1. Call trackAbandonment() to log the Prometheus metric.
   *   2. Reset the wizard state back to Step 1.
   *   3. Clear the locked quote and timer.
   */
  it("should call trackAbandonment and reset to step 1 when timer expires", () => {
    const { result } = renderHook(() => useRemittanceWizardViewModel(), {
      wrapper,
    });

    // Move to Step 2 (starts the timer)
    act(() => {
      result.current.handleGetQuote({
        sendAmount: 100,
        sendCurrency: "USD",
        receiveCurrency: "EUR",
      });
    });

    expect(result.current.step).toBe(2);
    expect(result.current.timeLeft).toBe(300);

    // Simulate all 300 seconds elapsing (1 tick per second)
    act(() => {
      jest.advanceTimersByTime(300 * 1000);
    });

    // Step 2: The hook must fire the abandonment metric
    expect(mockTrackAbandonment).toHaveBeenCalledTimes(1);

    // Step 3: The wizard must auto-reset back to Step 1
    expect(result.current.step).toBe(1);
    expect(result.current.quote).toBeNull();
    expect(result.current.timeLeft).toBe(300);
  });
});
