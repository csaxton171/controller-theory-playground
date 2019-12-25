import yargs from "yargs";
import { plot } from "asciichart";
import {
    makeCountWorkers,
    makeWorkers,
    WorkerPlant,
    WorkDuration,
    randomDuration
} from "../worker";
import {
    proportionalControllerFactory,
    compositeControllerFactory
} from "../controller";
import { ConsoleLogger } from "../Logger";

type ControllerRunConfig = {
    setPoint: number;
    gain: number;
    iterations: number;
    debug: boolean;
};

export const describe = "runs controller against plant";

export const builder = () =>
    yargs.options({
        iterations: {
            describe: "number of iterations/time-units to execute",
            type: "number",
            default: 120
        },
        setPoint: {
            describe: "desired plant output signal value",
            type: "number",
            require: true
        },
        gain: {
            describe: "gain applied to controller signal output",
            type: "number",
            default: 1
        },
        debug: {
            describe: "output worker plant activity",
            type: "boolean",
            default: false
        }
    });

export const handler = async (argv: ControllerRunConfig) => {
    const workerSpecs: WorkDuration[] = [10, 5, 1, 5, 15, 30, 15];
    const logger = argv.debug ? new ConsoleLogger() : { info: () => null };
    const baselinePlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const baselineSeries = [];
    for (const result of baselinePlant.iterate(argv.iterations)) {
        baselineSeries.push(result.length);
    }

    const controllers = compositeControllerFactory([
        proportionalControllerFactory(argv.setPoint, argv.gain)
    ]);
    const controlledPlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const controlledSeries = [];
    for (const result of controlledPlant.iterate(argv.iterations)) {
        controlledSeries.push(result.length);

        controlledPlant.addWorkers(
            makeCountWorkers(controllers(result.length), randomDuration())
        );
    }

    console.table([
        { param: "initial-workers", value: workerSpecs.length },
        { param: "iterations", value: argv.iterations },
        { param: "set-point", value: argv.setPoint },
        { param: "gain", value: argv.gain }
    ]);
    console.log(outputPlantSeries(baselineSeries));
    console.log("\n\n");
    console.log(outputPlantSeries(controlledSeries));
};

const outputPlantSeries = (series: number[]) => plot(series, { height: 10 });
