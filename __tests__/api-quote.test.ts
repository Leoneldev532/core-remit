import { createMocks } from "node-mocks-http";
import quoteHandler from "../pages/api/quote";

jest.mock("uuid", () => ({
  v4: () => "mock-uuid-1234",
}));

describe("/api/quote Integration Test", () => {
  it("returns 405 when method is not POST", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await quoteHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: "Method not allowed" });
  });

  it("returns 400 when body does not match schema", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { sendAmount: -100, sendCurrency: "USD", receiveCurrency: "EUR" },
    });

    await quoteHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toHaveProperty("message", "Invalid request");
    expect(res._getJSONData()).toHaveProperty("errors");
  });

  it("returns 200 and quote on valid POST", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { sendAmount: 1000, sendCurrency: "USD", receiveCurrency: "EUR" },
    });

    await quoteHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.quoteId).toBe("mock-uuid-1234");
    expect(data.sendAmount).toBe(1000);
    expect(data.receiveCurrency).toBe("EUR");
    expect(data.exchangeRate).toBeDefined();
    expect(data.receiveAmount).toBeDefined();
    expect(data.fee).toBeDefined();
    expect(data.expiresAt).toBeGreaterThan(Date.now());
  });
});
