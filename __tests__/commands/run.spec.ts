import {
  describe as runDescribe,
  builder,
  handler,
  buildController,
  ControllerRunConfig
} from "../../src/commands/run";
import {
  proportionalControllerFactory,
  integralControllerFactory,
  deadZoneDecorator
} from "../../src/controller";
import yargs = require("yargs");

describe("run", () => {
  let config: ControllerRunConfig;
  beforeEach(() => {
    config = {
      setPoint: 5,
      debug: false,
      iterations: 5,
      gain: 1,
      graph: false,
      deadZone: [],
      initialWorkers: [5, 3],
      durationStrategy: () => 10,
      controllers: "P"
    };
  });
  it("should describe itself", () => {
    expect(runDescribe.length).toBeGreaterThan(0);
  });

  describe("when providing argument", () => {
    it("should allow set point specification", () => {
      expect(builder()).toBeDefined();
    });

    describe("when building controllers", () => {
      const mockPcontroller = jest.fn(proportionalControllerFactory);
      const mockIcontroller = jest.fn(integralControllerFactory);
      const mockdeadZoneDecorator = jest.fn(deadZoneDecorator);

      beforeEach(() => {
        mockPcontroller.mockReset();
        mockIcontroller.mockReset();
        mockdeadZoneDecorator.mockReset();
      });

      it("should yield a PController only when configured so", () => {
        config.controllers = "P";

        buildController(config, mockPcontroller, mockIcontroller, jest.fn());

        expect(mockPcontroller).toBeCalledTimes(1);
        expect(mockIcontroller).toBeCalledTimes(0);
      });
      it("should yield a IController only when configured so", () => {
        config.controllers = "I";

        buildController(config, mockPcontroller, mockIcontroller, jest.fn());

        expect(mockPcontroller).toBeCalledTimes(0);
        expect(mockIcontroller).toBeCalledTimes(1);
      });
      it("should yield both P & I Controllers when configured so", () => {
        config.controllers = "PI";

        buildController(config, mockPcontroller, mockIcontroller, jest.fn());

        expect(mockPcontroller).toBeCalledTimes(1);
        expect(mockIcontroller).toBeCalledTimes(1);
      });
      it("should wrap with dead zone decorator when configured to", () => {
        config.deadZone = [2, 6];

        buildController(config, jest.fn(), jest.fn(), mockdeadZoneDecorator);

        expect(mockdeadZoneDecorator).toBeCalledWith(
          expect.any(Function),
          config.deadZone
        );
      });
    });
  });

  describe("when executing the command", () => {
    const parseRunCommand = (commandline: string): ControllerRunConfig => {
      const command = yargs.command("run", "test", builder);

      return (command.parse(commandline) as unknown) as ControllerRunConfig;
    };
    describe("when configuring duration strategy", () => {
      it("should default to random", () => {
        const config = parseRunCommand("run --set-point 12");

        expect(config.durationStrategy.toString()).toBe("random");
      });

      it("should allow random config", () => {
        const config = parseRunCommand(
          "run --set-point 12 --duration-strategy random"
        );

        expect(config.durationStrategy.toString()).toBe("random");
      });

      it.each`
        duration    | expected
        ${"1Unit"}  | ${"1Unit"}
        ${"3Unit"}  | ${"3Unit"}
        ${"99Unit"} | ${"random"}
      `("should allow $duration unit config", ({ duration, expected }) => {
        const config = parseRunCommand(
          `run --set-point 12 --duration-strategy ${duration}`
        );

        expect(config.durationStrategy.toString()).toBe(expected);
      });
    });
    describe("when configuring deadzone", () => {
      it("should default to no deadzone", () => {
        const config = parseRunCommand("run --set-point 12");

        expect(config.deadZone).toEqual([]);
      });

      it("should allow dead zone specification", () => {
        const config = parseRunCommand("run --set-point 12 --dead-zone 1-5");

        expect(config.deadZone).toEqual([1, 5]);
      });
    });

    it("should return a useful result", async () => {
      const result = await handler(config);

      expect(result).toMatchObject({
        config: expect.any(Object),
        baseline: expect.any(Array),
        subject: expect.any(Array)
      });
    });
  });
});
