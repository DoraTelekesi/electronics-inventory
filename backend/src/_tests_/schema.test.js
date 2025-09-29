import mongoose from "mongoose";
import SparePart from "../models/spare-part.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await SparePart.deleteMany({});
});

describe("SparePart Schema", () => {
  it("should create a SparePart successfully", async () => {
    const part = new SparePart({
      manufacturer: "TestCo",
      model: "X100",
      type: "engine",
      depot: "A1",
      amount: 10,
    });
    const saved = await part.save();

    expect(saved.manufacturer).toBe("TestCo");
    expect(saved.model).toBe("X100");
    expect(saved.amount).toBe(10);
  });

  it("should fail without required fields", async () => {
    const part = new SparePart({
      model: "X100",
    });

    let err;
    try {
      await part.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.manufacturer).toBeDefined();
    expect(err.errors.type).toBeDefined();
    expect(err.errors.depot).toBeDefined();
    expect(err.errors.amount).toBeDefined();
  });

  it("should enforce amount min value", async () => {
    const part = new SparePart({
      manufacturer: "TestCo",
      model: "X100",
      type: "engine",
      depot: "A1",
      amount: 0,
    });

    let err;
    try {
      await part.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.amount).toBeDefined();
  });
});
