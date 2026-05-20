import { createMocks } from "node-mocks-http";
import confirmHandler from "../pages/api/confirm";

describe("/api/confirm Integration Test", () => {
  it("returns 405 when method is not POST", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await confirmHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: "Method not allowed" });
  });

  it("returns 200 and a receipt on POST", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        quoteId: "123e4567-e89b-12d3-a456-426614174000",
      },
    });

    await confirmHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("transactionId");
    expect(data).toHaveProperty("status", "SUCCESS");
    expect(data).toHaveProperty("date");
  });
});
