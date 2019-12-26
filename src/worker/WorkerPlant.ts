import { Logger } from "../Logger";
import { Worker } from "./Worker";

export class WorkerPlant {
    constructor(private workers: Worker[] = [], private logger: Logger) {}

    *iterate(maxIterations: number = 10): IterableIterator<Worker[]> {
        for (let iteration = 1; iteration <= maxIterations; iteration++) {
            this.workers.forEach(w => w.cycle());
            this.workers = this.workers.filter(w => !w.completed);

            yield this.workers;
        }
    }

    addWorkers(workers: Worker[]) {
        this.logger.info(
            `adding ${workers.length} workers to pool of ${this.workers.length}`
        );
        this.workers.push(...workers);
    }
}
