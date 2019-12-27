import { WorkerPlant, BasicWorker } from "../../src/worker";

const mockLoggerInfo = jest.fn();
const mockLogger = {
  info: mockLoggerInfo
};

describe("WorkerPlant", () => {
  let plant: WorkerPlant;
  beforeEach(() => {
    mockLoggerInfo.mockClear();
    plant = new WorkerPlant(
      [new BasicWorker(1), new BasicWorker(3)],
      mockLogger
    );
  });
  describe("when adding worker(s)", () => {
    it("should log additions", () => {
      plant.addWorkers([new BasicWorker(3)]);

      expect(mockLoggerInfo).toBeCalledTimes(1);
    });

    it("should add supplied workers to plant", () => {
      const originalCount = plant.workerCount;
      plant.addWorkers([new BasicWorker(30), new BasicWorker(10)]);

      expect(plant.workerCount).toBe(originalCount + 2);
    });
  });

  describe("when removing workers", () => {
    it("should log removals", () => {
      plant.addWorkers([new BasicWorker(3)]);

      expect(mockLoggerInfo).toBeCalledTimes(1);
    });

    it("should remove the specified amount", () => {
      const originalCount = plant.workerCount;

      plant.removeWorkers(1);

      expect(plant.workerCount).toBe(originalCount - 1);
    });
  });

  describe("when iterating", () => {
    it("should terminate after reaching specified maximum iteration count", () => {
      const iterator = plant.iterate(2);
      expect(iterator.next()).toMatchObject({ done: false });
      expect(iterator.next()).toMatchObject({ done: false });
      expect(iterator.next()).toMatchObject({ done: true });
    });

    it("should cycle each worker per iteration", () => {
      const workers = [new BasicWorker(3), new BasicWorker(3)];
      const mockCycles = workers.map(w => jest.spyOn(w, "cycle"));
      const plant = new WorkerPlant(workers, mockLogger);
      const iterator = plant.iterate(3);

      iterator.next();
      expect(mockCycles[0]).toHaveBeenCalledTimes(1);
      expect(mockCycles[1]).toHaveBeenCalledTimes(1);

      iterator.next();
      expect(mockCycles[0]).toHaveBeenCalledTimes(2);
      expect(mockCycles[1]).toHaveBeenCalledTimes(2);
    });

    it("should prune completed workers from its pool", () => {
      const plant = new WorkerPlant(
        [new BasicWorker(3), new BasicWorker(1), new BasicWorker(3)],
        mockLogger
      );
      const iterator = plant.iterate(3);

      iterator.next();
      expect(plant.workerCount).toBe(2);

      iterator.next();
      expect(plant.workerCount).toBe(2);

      iterator.next();
      expect(plant.workerCount).toBe(0);
    });
  });
});
