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
    compositeControllerFactory,
    deadZoneDecorator
} from "../controller";
import { ConsoleLogger } from "../Logger";

type ControllerRunConfig = {
    setPoint: number;
    gain: number;
    iterations: number;
    deadZone: [number, number] | [];
    debug: boolean;
};

export const describe = "runs controller against plant";

export const builder = () =>
    yargs
        .options({
            iterations: {
                describe: "number of iterations/time-units to execute",
                type: "number",
                default: 120
            },
            setPoint: {
                alias: "sp",
                describe: "desired plant output signal value",
                type: "number",
                require: true
            },
            gain: {
                alias: "g",
                describe: "gain applied to controller signal output",
                type: "number",
                default: 1
            },
            debug: {
                describe: "output worker plant activity",
                type: "boolean",
                default: false
            },
            deadZone: {
                alias: "dz",
                describe: "an input range expressed as 'min-max' ",
                type: "string",
                default: ""
            }
        })
        .coerce({
            deadZone: (opt: string) =>
                !opt.trim() ? [] : opt.split("-").map(e => parseInt(e))
        })
        .usage(
            "$0 run --set-point <number> [--gain <number>] [--terations <number>]"
        );

export const handler = async (argv: ControllerRunConfig) => {
    const workerSpecs: WorkDuration[] = [10, 5, 1, 5, 15, 30, 15];
    const logger = argv.debug ? new ConsoleLogger() : { info: () => null };
    const baselinePlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const baselineSeries = [];
    for (const result of baselinePlant.iterate(argv.iterations)) {
        baselineSeries.push(result.length);
    }
    outputConfig(argv, workerSpecs);

    let controller = compositeControllerFactory([
        proportionalControllerFactory(argv.setPoint, argv.gain)
    ]);

    if (argv.deadZone.length == 2) {
        controller = deadZoneDecorator(controller, argv.deadZone);
    }
    const controlledPlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const controlledSeries = [];
    for (const result of controlledPlant.iterate(argv.iterations)) {
        controlledSeries.push(result.length);

        controlledPlant.addWorkers(
            makeCountWorkers(controller(result.length), randomDuration())
        );
    }

    console.log("[ baseline plant (uncontrolled) ]");
    console.log(outputPlantSeries(baselineSeries));
    console.log("\n\n");
    console.log("[ subject plant ]");
    console.log(outputPlantSeries(controlledSeries));
};

const outputConfig = (
    argv: ControllerRunConfig,
    workerSpecs: WorkDuration[]
) => {
    console.table([
        { param: "initial-workers", value: workerSpecs.length },
        { param: "iterations", value: argv.iterations },
        { param: "set-point", value: argv.setPoint },
        { param: "gain", value: argv.gain },
        { param: "dead-zone", value: argv.deadZone }
    ]);
};

const outputPlantSeries = (series: number[]) => plot(series, { height: 10 });
