export type Controller = (input: number) => number;

export const proportionalControllerFactory = (
    setPoint: number,
    gain: number
): Controller => (input: number) => (setPoint - input) * gain;

export const compositeControllerFactory = (
    controllers: Controller[]
): Controller => (input: number) =>
    controllers.reduce((acc, cur) => acc + cur(input), 0);

export const deadZoneDecorator = (
    controller: Controller,
    zoneRange: [number, number]
) => (input: number) => {
    const [zoneMin, zoneMax] = zoneRange;
    if (zoneMax <= zoneMin) {
        throw new Error("zone max must be greater than zone min");
    }
    return input < zoneMin || input > zoneMax ? controller(input) : 0;
};
