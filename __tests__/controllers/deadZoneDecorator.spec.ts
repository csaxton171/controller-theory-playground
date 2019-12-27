import { deadZoneDecorator } from "../../src/controller";
describe("deadZoneDecorator", () => {
  const passThroughController = (input: number) => input;
  it.each`
    dzMin | dzMax | innerControllerOutput | expectedOutput
    ${2}  | ${5}  | ${2}                  | ${0}
    ${2}  | ${5}  | ${5}                  | ${0}
    ${2}  | ${5}  | ${1}                  | ${1}
    ${2}  | ${5}  | ${6}                  | ${6}
  `(
    "it should output $expectedOutput when given $innerControllerOutput with a deadzone of [$dzMin, $dzMax]  ",
    ({ dzMin, dzMax, innerControllerOutput, expectedOutput }) => {
      expect(
        deadZoneDecorator(passThroughController, [dzMin, dzMax])(
          innerControllerOutput
        )
      ).toBe(expectedOutput);
    }
  );

  it("should throw an exception if misconfigured", () => {
    expect(() => {
      deadZoneDecorator(passThroughController, [5, 1]);
    }).toThrow();
  });
});
