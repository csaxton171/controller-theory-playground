import {
  describe as runDescribe,
  builder,
  handler
} from "../../src/commands/run";

describe("run", () => {
  it("should describe itself", () => {
    expect(runDescribe.length).toBeGreaterThan(0);
  });

  describe("when providing argument", () => {
    it("should allow set point specification", () => {
      expect(builder()).toBeDefined();
    });
  });

  describe("when executing the command", () => {
    it("should return a useful result", async () => {
      const result = await handler({
        setPoint: 5,
        debug: false,
        iterations: 5,
        gain: 1,
        graph: false,
        deadZone: [],
        initialWorkers: [5, 3],
        durationStrategy: () => 10
      });

      expect(result).toMatchObject({
        config: expect.any(Object),
        baseline: expect.any(Array),
        subject: expect.any(Array)
      });
    });
  });
});
