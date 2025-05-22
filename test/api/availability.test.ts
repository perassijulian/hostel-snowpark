import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import { app } from "@/lib/testServer";
import { prisma } from "@/lib/prisma";

describe("GET /api/accommodation/availability", () => {
  let availableRoom: any;
  let unavailableRoom: any;

  beforeAll(async () => {
    console.log("🧹 Clearing previous test data...");
    await prisma.booking.deleteMany();
    await prisma.accommodation.deleteMany();

    console.log("🏠 Creating 'available' room...");
    availableRoom = await prisma.accommodation.create({
      data: {
        name: "Available Room",
        description: "A test room",
        price: 100,
        guests: 2,
        type: "PRIVATE",
        pictures: {
          create: [
            {
              url: "https://example.com/photo.jpg",
              isPrimary: true,
              caption: "Beautiful view",
              altText: "Mountain cabin",
            },
          ],
        },
      },
    });

    console.log("🏠 Creating 'unavailable' room with booking...");
    unavailableRoom = await prisma.accommodation.create({
      data: {
        name: "Unavailable Room",
        description: "A booked room",
        price: 100,
        guests: 2,
        type: "PRIVATE",
        pictures: {
          create: [
            {
              url: "https://example.com/photo.jpg",
              isPrimary: true,
              caption: "Beautiful view",
              altText: "Mountain cabin",
            },
          ],
        },
      },
    });

    console.log("📅 Creating overlapping booking for 'unavailable' room...");
    await prisma.booking.create({
      data: {
        accommodationId: unavailableRoom.id,
        name: "Tester",
        email: "test@example.com",
        phone: "123456",
        guests: 2,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-05"),
      },
    });
  });

  afterEach(() => {
    console.log("✅ Test completed\n");
  });

  afterAll(async () => {
    console.log("🧹 Cleaning up test data...");
    await prisma.booking.deleteMany();
    await prisma.accommodation.deleteMany();
  });

  it("returns 400 if required query is missing", async () => {
    console.log("🚨 Testing missing query validation...");
    const res = await request(app).get("/api/accommodation/availability");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns accommodation by ID if available", async () => {
    console.log("✅ Testing availability by ID (availableRoom)...");
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        id: availableRoom.id,
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-10",
        checkOut: "2025-06-15",
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(availableRoom.id);
  });

  it("returns empty array if accommodation ID is not available", async () => {
    console.log("❌ Testing availability by ID (unavailableRoom)...");
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        id: unavailableRoom.id,
        guests: 2,
        checkIn: "2025-06-01",
        checkOut: "2025-06-03",
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns available fallback accommodation by type if no ID is given", async () => {
    console.log("🔄 Testing fallback availability by type...");
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-10",
        checkOut: "2025-06-15",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.map((a: any) => a.id)).toContain(availableRoom.id);
  });

  it("returns only available accommodations matching the type and guest count", async () => {
    console.log("🔍 Testing fallback availability with fully booked dates...");
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-02",
        checkOut: "2025-06-03",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.map((a: any) => a.id)).not.toContain(
      unavailableRoom.id
    );
  });

  // 🧪 🔄 Overlapping Dates (Edge Cases)
  it("excludes exact overlapping dates", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-01",
        checkOut: "2025-06-05",
      });

    expect(res.body.data.map((a: any) => a.id)).not.toContain(
      unavailableRoom.id
    );
  });

  it("excludes partial overlap (inside booking range)", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-03",
        checkOut: "2025-06-06",
      });

    expect(res.body.data.map((a: any) => a.id)).not.toContain(
      unavailableRoom.id
    );
  });

  it("allows booking starting the day another ends", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-06-05",
        checkOut: "2025-06-08",
      });

    expect(res.body.data.map((a: any) => a.id)).toContain(unavailableRoom.id);
  });

  it("allows booking ending the day another starts", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "PRIVATE",
        guests: 2,
        checkIn: "2025-05-28",
        checkOut: "2025-06-01",
      });

    expect(res.body.data.map((a: any) => a.id)).toContain(unavailableRoom.id);
  });

  // 🧪 🎭 Type Mismatches
  it("returns empty if requesting CABIN type but only PRIVATE exists", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        type: "CABIN",
        guests: 2,
        checkIn: "2025-06-10",
        checkOut: "2025-06-12",
      });

    expect(res.body.data).toHaveLength(0);
  });

  // 🧪 👥 Guest Count Filtering
  it("excludes room if guests exceed room capacity", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        guests: 3,
        type: "PRIVATE",
        checkIn: "2025-06-10",
        checkOut: "2025-06-12",
      });

    expect(res.body.data.map((a: any) => a.id)).not.toContain(availableRoom.id);
  });

  it("includes room if guests fit within capacity", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        guests: 1,
        type: "PRIVATE",
        checkIn: "2025-06-10",
        checkOut: "2025-06-12",
      });

    expect(res.body.data.map((a: any) => a.id)).toContain(availableRoom.id);
  });

  // 🧪 ❌ Invalid Input
  it("returns 400 on invalid date format", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        guests: 2,
        type: "PRIVATE",
        checkIn: "not-a-date",
        checkOut: "2025-06-12",
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 if checkOut is before checkIn", async () => {
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        guests: 2,
        type: "PRIVATE",
        checkIn: "2025-06-12",
        checkOut: "2025-06-10",
      });

    expect(res.status).toBe(400);
  });

  // 🧪 🔄 No Matches At All
  it("returns empty if no accommodations exist", async () => {
    await prisma.booking.deleteMany();
    await prisma.accommodation.deleteMany();
    const res = await request(app)
      .get("/api/accommodation/availability")
      .query({
        guests: 2,
        type: "PRIVATE",
        checkIn: "2025-06-10",
        checkOut: "2025-06-12",
      });

    expect(res.body.data).toHaveLength(0);
  });
});
