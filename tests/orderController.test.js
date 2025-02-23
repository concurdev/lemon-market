const request = require("supertest");
const app = require("../server");

describe("POST /api/orders", () => {
  // Define mock data inside the test suite
  const mockOrder = {
    type: "limit",
    side: "buy",
    instrument: "AAPLUSDT0001",
    limit_price: 150,
    quantity: 10,
  };

  const mockStockExchangeSuccess = {
    status: "success",
    message: "Order placed successfully",
  };

  const mockOrderResponse = {
    id: expect.any(Number), // Expect a number for the id
    type: "limit",
    side: "buy",
    instrument: "AAPLUSDT0001",
    limit_price: 150,
    quantity: 10,
    created_at: expect.any(String), // Expect a string for created_at
  };

  // Mocking models in beforeEach to ensure it's done after mocks are initialized
  beforeAll(() => {
    jest.mock("../app/models/orderModel", () => ({
      createOrder: jest.fn().mockResolvedValue({
        ...mockOrder,
        id: 26, // Dynamically set the id
        created_at: "2025-02-22T22:42:48.897Z", // Dynamically set created_at
      }),
    }));

    jest.mock("../app/models/stockExchange", () => ({
      placeOrder: jest.fn().mockResolvedValue(mockStockExchangeSuccess),
    }));
  });

  it("should create an order and place it at the stock exchange", async () => {
    const response = await request(app).post("/api/orders").send(mockOrder);

    expect(response.status).toBe(201); // Expect 201 for successful order creation
    expect(response.body).toMatchObject(mockOrderResponse); // Use flexible mockOrderResponse
  });

  it("should return 500 if placing order at the stock exchange fails", async () => {
    // Mock a rejection (failure) scenario
    const mockError = new Error("Failed to place order at stock exchange.");
    require("../app/models/stockExchange").placeOrder.mockRejectedValueOnce(mockError);

    const response = await request(app).post("/api/orders").send(mockOrder);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error while placing the order");
  });
});

// Ensure proper cleanup of async operations
afterAll(() => {
  // Close any connections, if necessary
  if (app.close) {
    app.close();
  }
});
