import { Controller, calculateError } from "./index";

export const proportionalControllerFactory = (
    setPoint: number,
    gain: number
): Controller => (input: number) => calculateError(setPoint, input) * gain;
