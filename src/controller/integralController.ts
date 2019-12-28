import { Controller, calculateError } from "../controller";
import { sum } from "ramda";

export const integralControllerFactory = (
    setPoint: number,
    errors: number[] = []
): Controller => (input: number) => {
    errors.push(calculateError(setPoint, input));
    return sum(errors);
};
