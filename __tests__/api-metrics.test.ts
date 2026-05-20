import { createMocks } from "node-mocks-http";
import metricsHandler from "../pages/api/metrics";

describe("/api/metrics Integration Test", () => {
  it("returns 405 for PUT", async () => {
    const { req, res } = createMocks({ method: "PUT" });

    await metricsHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: "Method not allowed" });
  });

  it("increments counter on POST and returns 200", async () => {
    const { req, res } = createMocks({ method: "POST" });

    await metricsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ success: true });
  });

  it("returns prometheus metrics on GET", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await metricsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getData();
    expect(typeof data).toBe("string");
    expect(data).toContain("remittance_flow_abandonment_total");
  });
});
