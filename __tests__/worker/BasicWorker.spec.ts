import { BasicWorker, Worker } from "../../src/worker";

describe("BasicWorker", () => {
  let worker: Worker;
  const initialUnits = 3;
  beforeEach(() => {
    worker = new BasicWorker(initialUnits);
  });

  it("should decrement remaining work by 1 per cycle", () => {
    expect(worker.cycle()).toBe(initialUnits - 1);
  });

  it.each`
    units | isComplete
    ${0}  | ${true}
    ${-1} | ${true}
    ${1}  | ${false}
    ${4}  | ${false}
  `(
    "should report completed: $isComplete with $units units remaining",
    ({ units, isComplete }) => {
      expect(new BasicWorker(units).completed).toBe(isComplete);
    }
  );

  it("should output useful string representation", () => {
    expect(worker.toString()).toEqual(`W[${initialUnits}]`);
  });
});
