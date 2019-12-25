import { Chance } from "chance";
import { range } from "ramda";
import { Logger } from "../Logger";

const chance = new Chance();

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

export type WorkDuration = 1 | 3 | 5 | 10 | 15 | 30;

export const randomDuration = (): WorkDuration =>
    chance.pickone([1, 3, 5, 10, 15, 30]);

export const randomDurations = (count: number): WorkDuration[] =>
    range(0, count).map(_ => randomDuration());

export interface Worker {
    cycle(): void;
    completed: boolean;
}

export class BasicWorker {
    private remainingDuration: number;
    constructor(duration: WorkDuration, public id: string = "") {
        if (!id) {
            this.id = chance.guid({ version: 4 });
        }
        this.remainingDuration = duration;
    }
    cycle() {
        this.remainingDuration--;
    }

    get completed() {
        return this.remainingDuration < 1;
    }

    toString() {
        return `Worker[${this.remainingDuration}]`;
    }
}

export const makeWorkers = (durations: WorkDuration[]) =>
    durations.map(d => new BasicWorker(d));

export const makeCountWorkers = (count: number, duration: WorkDuration = 1) =>
    count < 1 ? [] : range(0, count).map(_ => new BasicWorker(duration));
