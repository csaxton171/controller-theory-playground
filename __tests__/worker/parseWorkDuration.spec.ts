import { parseWorkDuration } from "../../src/worker";

describe("parseWorkDuration", () => {
  it.each`
    input        | expected
    ${"1"}       | ${1}
    ${"3Units"}  | ${3}
    ${"rubbish"} | ${null}
    ${"8Units"}  | ${null}
    ${"1Unit"}   | ${1}
  `("should parse all the things", ({ input, expected }) => {
    expect(parseWorkDuration(input)).toBe(expected);
  });
});
