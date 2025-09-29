import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import SparePart from "../models/spare-part.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await SparePart.deleteMany({});
});

describe("Spare Part API", () => {
  it("should create a spare part", async () => {
    const data = {
      manufacturer: "Bosch",
      model: "X123",
      type: "Filter",
      depot: "Main",
      amount: 5,
      remarks: ["test remark"]
    };

    const res = await request(app).post("/spare-part-list").send(data);

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("New item added");

    const parts = await SparePart.find({});
    expect(parts.length).toBe(1);
    expect(parts[0].manufacturer).toBe("Bosch");
  });

  it("should get all spare parts", async () => {
    await SparePart.create({
      manufacturer: "Bosch",
      model: "X123",
      type: "Filter",
      depot: "Main",
      amount: 5
    });

    const res = await request(app).get("/spare-part-list");

    expect(res.statusCode).toBe(200);
    expect(res.body.spareParts.length).toBe(1);
    expect(res.body.spareParts[0].manufacturer).toBe("Bosch");
  });

  it("should get spare part by id", async () => {
    const part = await SparePart.create({
      manufacturer: "Bosch",
      model: "X123",
      type: "Filter",
      depot: "Main",
      amount: 5
    });

    const res = await request(app).get(`/spare-part-list/${part._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("X123");
  });

  it("should delete a spare part", async () => {
    const part = await SparePart.create({
      manufacturer: "Bosch",
      model: "X123",
      type: "Filter",
      depot: "Main",
      amount: 5
    });

    const res = await request(app).delete(`/spare-part-list/${part._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("deleted");

    const parts = await SparePart.find({});
    expect(parts.length).toBe(0);
  });
});
