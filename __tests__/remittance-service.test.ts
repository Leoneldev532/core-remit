import { remittanceService } from "../services/remittance-service";
import axiosInstance from "../config/axiosInstance";
import type {
  CurrencyRate,
  QuoteResponse,
  TransferReceipt,
} from "../types/remittance";

// ---------------------------------------------------------------------------
// Mock the axiosInstance module so no real HTTP calls are made
// ---------------------------------------------------------------------------
jest.mock("../config/axiosInstance", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

// ---------------------------------------------------------------------------
// Test data fixtures
// ---------------------------------------------------------------------------
const mockRates: CurrencyRate[] = [
  { currency: "EUR", rate: 1.08, previousRate: 1.07, timestamp: 1716200000 },
  { currency: "GBP", rate: 0.87, previousRate: 0.86, timestamp: 1716200000 },
];

const mockQuoteResponse: QuoteResponse = {
  quoteId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  sendAmount: 1000,
  sendCurrency: "USD",
  receiveAmount: 920,
  receiveCurrency: "EUR",
  exchangeRate: 0.92,
  fee: 5,
  expiresAt: 1716300000,
};

const mockReceipt: TransferReceipt = {
  transactionId: "txn-001",
  totalPaid: 1005,
  receivedAmount: 920,
  currencyPair: "USD/EUR",
  status: "SUCCESS",
  date: "2026-05-20T12:00:00Z",
};

// ---------------------------------------------------------------------------
// remittanceService.getRates
// ---------------------------------------------------------------------------
describe("remittanceService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRates", () => {
    it("should call GET /api/rates and return the rate list", async () => {
      (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ data: mockRates });

      const result = await remittanceService.getRates();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/rates");
      expect(result).toEqual(mockRates);
    });

    it("should propagate network errors from the API", async () => {
      const networkError = new Error("Network Error");
      (mockedAxios.get as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(remittanceService.getRates()).rejects.toThrow(
        "Network Error",
      );
    });
  });

  // -------------------------------------------------------------------------
  // remittanceService.createQuote
  // -------------------------------------------------------------------------
  describe("createQuote", () => {
    const validPayload = {
      sendAmount: 1000,
      sendCurrency: "USD",
      receiveCurrency: "EUR",
    };

    it("should validate input with Zod and POST to /api/quote", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
        data: mockQuoteResponse,
      });

      const result = await remittanceService.createQuote(validPayload);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/quote", validPayload);
      expect(result).toEqual(mockQuoteResponse);
    });

    it("should throw a ZodError when sendAmount is negative", async () => {
      const invalidPayload = { ...validPayload, sendAmount: -100 };

      await expect(
        remittanceService.createQuote(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when sendCurrency is too short", async () => {
      const invalidPayload = { ...validPayload, sendCurrency: "US" };

      await expect(
        remittanceService.createQuote(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when sendCurrency is too long", async () => {
      const invalidPayload = { ...validPayload, sendCurrency: "USDD" };

      await expect(
        remittanceService.createQuote(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when receiveCurrency is missing", async () => {
      const invalidPayload = { sendAmount: 500, sendCurrency: "USD" };

      await expect(
        remittanceService.createQuote(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when sendAmount is zero", async () => {
      const invalidPayload = { ...validPayload, sendAmount: 0 };

      await expect(
        remittanceService.createQuote(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should propagate API errors after successful validation", async () => {
      const apiError = new Error("Internal Server Error");
      (mockedAxios.post as jest.Mock).mockRejectedValueOnce(apiError);

      await expect(remittanceService.createQuote(validPayload)).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });

  // -------------------------------------------------------------------------
  // remittanceService.confirmTransfer
  // -------------------------------------------------------------------------
  describe("confirmTransfer", () => {
    const validPayload = {
      quoteId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    };

    it("should validate input with Zod and POST to /api/confirm", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
        data: mockReceipt,
      });

      const result = await remittanceService.confirmTransfer(validPayload);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/confirm",
        validPayload,
      );
      expect(result).toEqual(mockReceipt);
    });

    it("should throw a ZodError when quoteId is not a valid UUID", async () => {
      const invalidPayload = { quoteId: "not-a-uuid" };

      await expect(
        remittanceService.confirmTransfer(invalidPayload),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when quoteId is missing", async () => {
      await expect(remittanceService.confirmTransfer({})).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should throw a ZodError when input is an empty string", async () => {
      await expect(
        remittanceService.confirmTransfer({ quoteId: "" }),
      ).rejects.toThrow();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should propagate API errors after successful validation", async () => {
      const apiError = new Error("Service Unavailable");
      (mockedAxios.post as jest.Mock).mockRejectedValueOnce(apiError);

      await expect(
        remittanceService.confirmTransfer(validPayload),
      ).rejects.toThrow("Service Unavailable");
    });

    it("should return a receipt with status SUCCESS on valid transfer", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
        data: mockReceipt,
      });

      const result = await remittanceService.confirmTransfer(validPayload);
      expect(result.status).toBe("SUCCESS");
      expect(result.transactionId).toBeDefined();
    });
  });
});
