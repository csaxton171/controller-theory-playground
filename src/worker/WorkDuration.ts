import { Chance } from "chance";
import { range } from "ramda";

const chance = new Chance();

export type WorkDuration = 1 | 3 | 5 | 10 | 15 | 30;

export const randomDuration = (): WorkDuration =>
    chance.pickone([1, 3, 5, 10, 15, 30]);

export const randomDurations = (count: number): WorkDuration[] =>
    range(0, count).map(_ => randomDuration());

export const fixedDuration = (unit: WorkDuration) => () => unit;
