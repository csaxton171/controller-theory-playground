import { plot } from "asciichart";

describe("should run test", () => {
  it("should support basic assertions", () => {
    expect(true).toBeTruthy();
  });

  it("should bla", () => {
    const result = [...iterate(3)];
    expect(result).toEqual([1, 2, 3]);

    console.log(plot(result));
  });
});

function* iterate(maxIterations: number = 10) {
  for (let i = 1; i <= maxIterations; i++) {
    yield i;
  }
}
