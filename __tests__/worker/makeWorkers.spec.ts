import { makeCountWorkers, makeWorkers } from "../../src/worker";

describe("makeCountWorkers", () => {
  const durationFn = jest.fn().mockResolvedValue(1);
  beforeEach(() => {
    durationFn.mockClear();
  });
  it("should make the number of requested workers", () => {
    expect(makeCountWorkers(4, durationFn).length).toBe(4);
  });

  it("should yield empty result for negative counts", () => {
    expect(makeCountWorkers(-1, durationFn)).toMatchObject([]);
  });

  it("should yield empty result for 0 count", () => {
    expect(makeCountWorkers(0, durationFn)).toMatchObject([]);
  });

  it("should use supplied duration strategy to initialise worker", () => {
    makeCountWorkers(4, durationFn);
    expect(durationFn).toHaveBeenCalledTimes(4);
  });
});

describe("makeWorkers", () => {
  it("should make the number of requested workers", () => {
    expect(makeWorkers([1, 3, 5, 10]).length).toBe(4);
  });
});
