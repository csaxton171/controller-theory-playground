import { Controller } from "./index";

export const compositeControllerFactory = (
    controllers: Controller[]
): Controller => (input: number) =>
    controllers.reduce((acc, cur) => acc + cur(input), 0);
