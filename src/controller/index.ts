export type Controller = (input: number) => number;

export { proportionalControllerFactory } from "./proportionalController";

export { compositeControllerFactory } from "./compositeController";

export { deadZoneDecorator } from "./deadZoneDecorator";
