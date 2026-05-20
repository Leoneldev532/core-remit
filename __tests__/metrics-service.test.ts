import { metricsService } from "../services/metrics-service";
import axiosInstance from "../config/axiosInstance";

// ---------------------------------------------------------------------------
// Mock the axiosInstance module so no real HTTP calls are made
// ---------------------------------------------------------------------------
jest.mock("../config/axiosInstance", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

// ---------------------------------------------------------------------------
// metricsService
// ---------------------------------------------------------------------------
describe("metricsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("trackAbandonment", () => {
    it("should POST to /api/metrics", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      await metricsService.trackAbandonment();

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/metrics");
    });

    it("should not return any data (void)", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValueOnce({
        data: undefined,
      });

      const result = await metricsService.trackAbandonment();

      expect(result).toBeUndefined();
    });

    it("should propagate network errors", async () => {
      const networkError = new Error("Network Error");
      (mockedAxios.post as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(metricsService.trackAbandonment()).rejects.toThrow(
        "Network Error",
      );
    });

    it("should propagate server errors (500)", async () => {
      const serverError = {
        response: { status: 500, data: { message: "Internal Server Error" } },
      };
      (mockedAxios.post as jest.Mock).mockRejectedValueOnce(serverError);

      await expect(metricsService.trackAbandonment()).rejects.toEqual(
        serverError,
      );
    });

    it("should handle being called multiple times independently", async () => {
      (mockedAxios.post as jest.Mock).mockResolvedValue({ data: undefined });

      await metricsService.trackAbandonment();
      await metricsService.trackAbandonment();
      await metricsService.trackAbandonment();

      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });
  });
});
