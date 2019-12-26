import { compositeControllerFactory } from "../../src/controller";

describe("compositeController", () => {
  // TODO: re-eval implementation here - might need to be an aggregation of results rather than sum
  it("should combine the results of its constituent controllers", () => {
    const controller1 = jest.fn().mockReturnValue(10);
    const controller2 = jest.fn().mockReturnValue(2);
    const doesntMatter = 1;
    expect(
      compositeControllerFactory([controller1, controller2])(doesntMatter)
    ).toBe(12);
  });
});
