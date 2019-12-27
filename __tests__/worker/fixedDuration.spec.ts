import { fixedDuration } from "../../src/worker";

describe("fixedDuration", () => {
  it.each`
    input  | output
    ${1}   | ${1}
    ${4}   | ${4}
    ${100} | ${100}
  `("it should return $output when given $input", ({ input, output }) => {
    expect(fixedDuration(input)()).toBe(output);
  });
});
