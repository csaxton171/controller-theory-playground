import { Logger } from "./index";

export class ConsoleLogger implements Logger {
    info(message: string) {
        console.log(message);
    }
}
