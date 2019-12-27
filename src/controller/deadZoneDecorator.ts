import { Controller } from "./index";

export const deadZoneDecorator = (
    controller: Controller,
    zoneRange: [number, number]
) => {
    const [zoneMin, zoneMax] = zoneRange;
    if (zoneMax <= zoneMin) {
        throw new Error("zone max must be greater than zone min");
    }
    return (input: number) =>
        input < zoneMin || input > zoneMax ? controller(input) : 0;
};
