import { Controller, calculateError } from "../controller";

export const integralControllerFactory = (
    setPoint: number,
    errors: number[] = []
): Controller => (input: number) => {
    errors.push(calculateError(setPoint, input));
    return errors.reduce((acc, cur) => acc + cur, 0);
};
