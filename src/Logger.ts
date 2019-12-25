export interface Logger {
    info(message: string): void;
}

export class ConsoleLogger implements Logger {
    info(message: string) {
        console.log(message);
    }
}
