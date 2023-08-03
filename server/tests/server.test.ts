import { describe, expect, test } from "@jest/globals";

import api from "../src/api";
import app from "../src/app";

describe("Api", () => {
  test("should return an Api", () => {
    expect(api).toBeDefined();
  });
});

describe("App", () => {
  test("should return an App", () => {
    expect(app).toBeDefined();
  });
});
