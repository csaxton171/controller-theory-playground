import { Logger } from "../logging";
import { Worker } from "./Worker";
import { range } from "ramda";

export class WorkerPlant {
    private workers: Worker[];
    constructor(workers: Worker[], private logger: Logger) {
        this.workers = [...workers];
    }

    *iterate(maxIterations: number = 10): IterableIterator<Worker[]> {
        for (let iteration = 1; iteration <= maxIterations; iteration++) {
            this.workers.forEach(w => w.cycle());
            this.workers = this.workers.filter(w => !w.completed);

            yield this.workers;
        }
    }

    addWorkers(workers: Worker[]) {
        this.logger.info(
            `  adding ${workers.length} workers ${workers
                .map(w => w.toString())
                .join(",")}`
        );
        this.workers.push(...workers);
    }

    removeWorkers(count: number) {
        this.logger.info(`  removing ${count} workers`);
        range(0, Math.min(this.workers.length, Math.abs(count))).forEach(() =>
            this.workers.pop()
        );
    }

    get workerCount() {
        return this.workers.length;
    }
}
