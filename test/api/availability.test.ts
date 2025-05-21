import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "@/lib/testServer";

describe("GET /api/accommodation/availability", () => {
  it("returns 400 if required query is missing", async () => {
    const res = await request(app).get("/api/accommodation/availability");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns available accommodations", async () => {
    // You should seed your test DB first
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000).toISOString(),
        guests: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
