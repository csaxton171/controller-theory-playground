export interface Logger {
    info(message: string): void;
}

export { ConsoleLogger } from "./ConsoleLogger";
