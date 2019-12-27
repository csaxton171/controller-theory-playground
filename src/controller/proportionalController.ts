import { Controller } from "./index";

export const proportionalControllerFactory = (
    setPoint: number,
    gain: number
): Controller => (input: number) => (setPoint - input) * gain;
