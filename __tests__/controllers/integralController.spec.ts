import { integralControllerFactory } from "../../src/controller";

describe("integralController", () => {
  it("should yield incremented value with positive error", () => {
    const controller = integralControllerFactory(10, [2]);
    expect(controller(1)).toBe(11);
  });
  it("should yield decremented value with negative error", () => {
    const controller = integralControllerFactory(10, [1]);
    expect(controller(-6)).toBe(17);
  });
});
