export type Controller = (input: number) => number;

export const proportionalControllerFactory = (
    setPoint: number,
    gain: number
): Controller => (input: number) => (setPoint - input) * gain;

export const compositeControllerFactory = (
    controllers: Controller[]
): Controller => (input: number) =>
    controllers.reduce((acc, cur) => acc + cur(input), 0);
