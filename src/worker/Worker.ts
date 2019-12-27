import { WorkDuration } from "./WorkDuration";
import { range } from "ramda";

export interface Worker {
    cycle(): number;
    completed: boolean;
}

export class BasicWorker {
    private remainingDuration: number;
    constructor(duration: WorkDuration) {
        this.remainingDuration = duration;
    }
    cycle() {
        return --this.remainingDuration;
    }

    get completed() {
        return this.remainingDuration < 1;
    }

    toString() {
        return `W[${this.remainingDuration}]`;
    }
}

export const makeWorkers = (durations: WorkDuration[]) =>
    durations.map(d => new BasicWorker(d));

export const makeCountWorkers = (count: number, duration: () => WorkDuration) =>
    count < 1 ? [] : range(0, count).map(_ => new BasicWorker(duration()));
