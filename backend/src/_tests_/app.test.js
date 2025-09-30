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
  describe("Success cases", () => {
    it("should create a spare part", async () => {
      const data = {
        manufacturer: "Bosch",
        model: "X123",
        type: "Filter",
        depot: "Main",
        amount: 5,
        remarks: ["test remark"],
      };
      const res = await request(app).post("/spare-part-list").send(data);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("New item added");
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
        amount: 5,
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
        amount: 5,
      });
      const res = await request(app).get(`/spare-part-list/${part._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.sparePart.model).toBe("X123");
    });

    it("should delete a spare part", async () => {
      const part = await SparePart.create({
        manufacturer: "Bosch",
        model: "X123",
        type: "Filter",
        depot: "Main",
        amount: 5,
      });
      const res = await request(app).delete(`/spare-part-list/${part._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("deleted");
      const parts = await SparePart.find({});
      expect(parts.length).toBe(0);
    });

    it("should update a spare part", async () => {
      const part = await SparePart.create({
        manufacturer: "Bosch",
        model: "X123",
        type: "Filter",
        depot: "Main",
        amount: 5,
      });
      const res = await request(app)
        .put(`/spare-part-list/${part._id}`)
        .send({ manufacturer: "Bosch", model: "X123", type: "Filter", depot: "Main", amount: 10 });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("updated");
      const updatedItem = await SparePart.findById({ _id: part._id });
      expect(updatedItem.amount).toBe(10);
    });
  });

  describe("Error cases", () => {
    it("should return 404 if no items is in the list", async () => {
      const res = await request(app).get("/spare-part-list");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No Spare Parts in the List");
    });

    it("should return 404 if item is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/spare-part-list/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });

    it("should return 404 if item is not found for edit", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/spare-part-list/${fakeId}/edit`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });

    it("should return 404 if PUT /:id item is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/spare-part-list/${fakeId}`).send({
        manufacturer: "Test",
        model: "TestModel",
        type: "TestType",
        depot: "TestDepot",
        amount: 1,
      });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });

    it("should return 400 if PUT /:id has invalid data", async () => {
      const part = await SparePart.create({
        manufacturer: "Bosch",
        model: "X123",
        type: "Filter",
        depot: "Main",
        amount: 5,
      });
      const res = await request(app)
        .put(`/spare-part-list/${part._id}`)
        .send({ manufacturer: "Bosch", model: "X123", type: "Filter", depot: "Main", amount: null });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid Spare Part Data");
    });

    it("should return 404 if DELETE :/id is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/spare-part-list/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });
  });
});
