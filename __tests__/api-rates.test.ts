import { createMocks } from "node-mocks-http";
import ratesHandler from "../pages/api/rates";

describe("/api/rates Integration Test", () => {
  it("returns 405 when method is not GET", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await ratesHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: "Method not allowed" });
  });

  it("returns exactly 200 and an array of rates on GET", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await ratesHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    expect(data[0]).toHaveProperty("currency");
    expect(data[0]).toHaveProperty("rate");
    expect(data[0]).toHaveProperty("previousRate");
    expect(data[0]).toHaveProperty("timestamp");
  });
});
