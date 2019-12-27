import yargs from "yargs";
import { plot } from "asciichart";
import {
    makeCountWorkers,
    makeWorkers,
    WorkerPlant,
    WorkDuration,
    randomDuration,
    fixedDuration
} from "../worker";
import {
    proportionalControllerFactory,
    compositeControllerFactory,
    deadZoneDecorator
} from "../controller";
import { ConsoleLogger } from "../logging";

type ControllerRunConfig = {
    setPoint: number;
    gain: number;
    iterations: number;
    deadZone: [number, number] | [];
    initialWorkers: WorkDuration[];
    durationStrategy: () => WorkDuration;
    debug: boolean;
    graph: boolean;
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
            graph: {
                describe: "output graphs of controller activity",
                type: "boolean",
                default: true
            },
            deadZone: {
                alias: "dz",
                describe: "an input range expressed as 'min-max' ",
                type: "string",
                default: ""
            },
            initialWorkers: {
                alias: "workers",
                describe: "an list of work durations ( e.g. 1 5 3 10 8 )",
                array: true,
                default: [10, 5, 3, 5, 15, 30, 15]
            },
            durationStrategy: {
                alias: "ds",
                describe: "method of producing durations for new workers",
                choices: [
                    "randomUnits",
                    "singleUnit",
                    "doubleUnit",
                    "tripleUnit"
                ],
                default: "randomUnits"
            }
        })
        .coerce({
            deadZone: (opt: string) =>
                !opt.trim() ? [] : opt.split("-").map(e => parseInt(e)),

            initialWorkers: (opt: WorkDuration[]) => opt,
            durationStrategy: (opt: string) => {
                switch (opt) {
                    case "randomUnits":
                        return randomDuration;
                    case "singleUnit":
                        return fixedDuration(1);
                    case "doubleUnit":
                        return fixedDuration(1);
                    case "tripleUnit":
                        return fixedDuration(3);
                    default:
                        return randomDuration;
                }
            }
        })
        .usage(
            "$0 run --set-point <number> [--gain <number>] [--terations <number>]"
        );

export const handler = async (argv: ControllerRunConfig) => {
    const workerSpecs: WorkDuration[] = argv.initialWorkers;
    const logger = argv.debug ? new ConsoleLogger() : { info: () => null };

    outputConfig(argv, workerSpecs);

    const baselinePlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const baselineSeries = [];
    for (const result of baselinePlant.iterate(argv.iterations)) {
        baselineSeries.push(result.length);
    }

    let controller = compositeControllerFactory([
        proportionalControllerFactory(argv.setPoint, argv.gain)
    ]);

    if (argv.deadZone.length == 2) {
        controller = deadZoneDecorator(controller, argv.deadZone);
    }
    const controlledPlant = new WorkerPlant(makeWorkers(workerSpecs), logger);
    const controlledSeries = [];
    for (const result of controlledPlant.iterate(argv.iterations)) {
        controlledSeries.push(controlledPlant.workerCount);
        const error = controller(result.length);
        logger.info(`error ${error}`);
        if (error > 0) {
            controlledPlant.addWorkers(
                makeCountWorkers(
                    controller(result.length),
                    argv.durationStrategy
                )
            );
        } else {
            controlledPlant.removeWorkers(error);
        }
    }

    console.log("[ baseline plant (uncontrolled) ]");
    console.log(outputPlantSeries(baselineSeries));
    console.log("\n\n");
    console.log("[ subject plant ]");
    console.log(outputPlantSeries(controlledSeries));
    return {
        config: argv,
        baseline: baselineSeries,
        subject: controlledSeries
    };
};

const outputConfig = (
    argv: ControllerRunConfig,
    workerSpecs: WorkDuration[]
) => {
    if (!console.table) return;
    console.table([
        { param: "set-point", value: argv.setPoint },
        { param: "initial-workers", value: workerSpecs.length },
        { param: "gain", value: argv.gain },
        { param: "iterations", value: argv.iterations },
        { param: "dead-zone", value: argv.deadZone }
    ]);
};

const outputPlantSeries = (series: number[]) => plot(series, { height: 10 });
