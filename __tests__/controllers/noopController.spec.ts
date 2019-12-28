import { noopControllerFactory } from "../../src/controller";

describe("noopController", () => {
  it("should return the configured value", () => {
    expect(noopControllerFactory(1)(9)).toBe(1);
  });
});
