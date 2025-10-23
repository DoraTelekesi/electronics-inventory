process.env.JWT_SECRET = "testsecret";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import SparePart from "../models/spare-part.js";
// import router from "../routes/spare-part.js";

let mongoServer;
let cookies;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await request(app).post("/register").send({
    username: "testuser",
    email: "testuser@test.com",
    password: "password123",
  });

  const res = await request(app).post("/login").send({
    email: "testuser@test.com",
    password: "password123",
  });
  expect(res.status).toBe(200);
  cookies = res.headers["set-cookie"];
  expect(cookies).toBeDefined();

  // const tokenCookie = cookies.find((c) => c.startsWith('token='));
  // expect(tokenCookie).toBeTruthy();

  // token = tokenCookie.split(";")[0].split('=')[1];

  // expect(res.body.token).toBeDefined();
  // token = res.body.token;
  // console.log("Test token:", token);
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
        remarks: "test remark",
      };
      const res = await request(app).post("/spare-part-list").set("Cookie", cookies).send(data);
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
      const res = await request(app).get("/spare-part-list").set("Cookie", cookies);
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
      const res = await request(app).get(`/spare-part-list/${part._id}`).set("Cookie", cookies);
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
      const res = await request(app).delete(`/spare-part-list/${part._id}`).set("Cookie", cookies);
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
        .send({ manufacturer: "Bosch", model: "X123", type: "Filter", depot: "Main", amount: 10 })
        .set("Cookie", cookies);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("updated");
      const updatedItem = await SparePart.findById({ _id: part._id });
      expect(updatedItem.amount).toBe(10);
    });
  });

  describe("Error cases", () => {
    it("should return 404 if no items is in the list", async () => {
      const res = await request(app).get("/spare-part-list").set("Cookie", cookies);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No Spare Parts in the List");
    });

    it("should return 404 if item is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/spare-part-list/${fakeId}`).set("Cookie", cookies);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });

    it("should return 404 if item is not found for edit", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/spare-part-list/${fakeId}/edit`).set("Cookie", cookies);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });

    it("should return 404 if PUT /:id item is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/spare-part-list/${fakeId}`).set("Cookie", cookies).send({
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
        .send({ manufacturer: "Bosch", model: "X123", type: 256, depot: "Main", amount: 2 })
        .set("Cookie", cookies);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('"type" must be a string');
    });

    it("should return 404 if DELETE :/id is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/spare-part-list/${fakeId}`).set("Cookie", cookies);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Spare Part Not Found");
    });
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/spare-part-list");
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token/i);
    });

    it("should return 403 if token is invalid", async () => {
      const invalidCookies = cookies.map((c) => c.replace(/token=[^;]+/, "token=invalidtoken"));
      const res = await request(app).get("/spare-part-list").set("Cookie", invalidCookies);
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });
});
