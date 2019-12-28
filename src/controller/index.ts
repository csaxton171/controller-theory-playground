export type Controller = (input: number) => number;

export { proportionalControllerFactory } from "./proportionalController";

export { integralControllerFactory } from "./integralController";

export { compositeControllerFactory } from "./compositeController";

export { deadZoneDecorator } from "./deadZoneDecorator";

export const noopControllerFactory = (output: number): Controller => (
    _input: number
) => output;

export const calculateError = (setPoint: number, input: number) =>
    setPoint - input;
