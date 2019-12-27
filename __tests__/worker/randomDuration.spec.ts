import { randomDuration, randomDurations } from "../../src/worker";

const workerDurations = [1, 3, 5, 10, 15, 30];

describe("randomDuration", () => {
  it("it should return a random WorkDuration", () => {
    expect(workerDurations).toContain(randomDuration());
  });
});

describe("randomDurations", () => {
  it("it should yield the requested number of value(s)", () => {
    expect(randomDurations(10).length).toBe(10);
  });

  it("all values produced must be of the WorkDuration set", () => {
    const results = randomDurations(10);

    for (const value of results) {
      expect(workerDurations).toContain(value);
    }
  });
});
