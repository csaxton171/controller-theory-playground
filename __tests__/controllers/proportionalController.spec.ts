import { proportionalControllerFactory } from "../../src/controller";

describe("proportionalController", () => {
  it.each`
    setPoint | input | expectedOutput
    ${4}     | ${4}  | ${0}
    ${4}     | ${1}  | ${3}
    ${4}     | ${5}  | ${-1}
  `(
    "it should yield corrective output of $expectedOutput given $input",
    ({ setPoint, input, expectedOutput }) => {
      expect(proportionalControllerFactory(setPoint, 1)(input)).toBe(
        expectedOutput
      );
    }
  );

  it("should apply gain to output value", () => {
    expect(proportionalControllerFactory(5, 0.5)(10)).toBe(-2.5);
  });
});
