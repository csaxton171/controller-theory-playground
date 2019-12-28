import { Chance } from "chance";
import { range } from "ramda";
import { isUndefined } from "util";

const chance = new Chance();

export type WorkDuration = 1 | 3 | 5 | 10 | 15 | 30;

export const workDurations = [1, 3, 5, 10, 15, 30];

export const parseWorkDuration = (
    value: string | undefined | null
): WorkDuration | null => {
    const match = `${value}`.match(/^(\d+)(Units?)?/);
    const [, rawDuration] = match || [, ,];

    if (isUndefined(rawDuration) || isNaN(Number.parseInt(rawDuration))) {
        return null;
    }

    const nValue = Number.parseInt(rawDuration);
    return workDurations.includes(nValue) ? (nValue as WorkDuration) : null;
};

export const randomDuration = (): WorkDuration => {
    return chance.pickone(workDurations) as WorkDuration;
};

export const randomDurations = (count: number): WorkDuration[] =>
    range(0, count).map(_ => randomDuration());

export const fixedDuration = (unit: WorkDuration) => () => unit;
