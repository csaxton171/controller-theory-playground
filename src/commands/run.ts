import yargs from "yargs";
import { plot } from "asciichart";
import {
    makeCountWorkers,
    makeWorkers,
    WorkerPlant,
    WorkDuration,
    randomDuration,
    fixedDuration,
    parseWorkDuration
} from "../worker";
import {
    proportionalControllerFactory,
    compositeControllerFactory,
    deadZoneDecorator,
    noopControllerFactory,
    integralControllerFactory,
    Controller
} from "../controller";
import { ConsoleLogger, Logger } from "../logging";

export type ControllerRunConfig = {
    setPoint: number;
    gain: number;
    iterations: number;
    deadZone: [number, number] | [];
    initialWorkers: WorkDuration[];
    durationStrategy: () => WorkDuration;
    controllers: "P" | "I" | "PI";
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
                alias: "w",
                describe: "an list of work durations ( e.g. 1 5 3 10 8 )",
                array: true,
                default: [10, 5, 3, 5, 15, 30, 15]
            },
            durationStrategy: {
                alias: "ds",
                describe:
                    "method of producing durations for new workers either 'randomUnits' or 'nUnits' (where n is a valid Work Duration)",
                default: "randomUnits"
            },
            controllers: {
                alias: "c",
                describe: "dictates the composition of controllers employed",
                choices: ["P", "I", "PI"],
                default: "P"
            }
        })
        .coerce({
            deadZone: (opt: string) =>
                !opt.trim() ? [] : opt.split("-").map(e => parseInt(e)),

            initialWorkers: (opt: WorkDuration[]) => opt,
            durationStrategy: (opt: string) => {
                const parsedDuration = parseWorkDuration(opt);
                const result = parsedDuration
                    ? fixedDuration(parsedDuration as WorkDuration)
                    : randomDuration;

                result.toString = parsedDuration ? () => opt : () => "random";

                return result;
            }
        })
        .usage(
            "$0 run --set-point <number> [--gain <number>] [--terations <number>]"
        );

export const handler = async (argv: ControllerRunConfig) => {
    const workerSpecs: WorkDuration[] = argv.initialWorkers;
    /* istanbul ignore next */
    const logger = argv.debug ? new ConsoleLogger() : { info: () => null };
    outputConfig(argv, workerSpecs);

    // no controller
    const baselineSeries = runWorkPlant(
        argv,
        new WorkerPlant(makeWorkers(workerSpecs), logger),
        logger
    );

    // tada!
    const controlledSeries = runWorkPlant(
        argv,
        new WorkerPlant(makeWorkers(workerSpecs), logger),
        logger,
        buildController(argv)
    );

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
    /* istanbul ignore next */
    const table = console.table
        ? console.table
        : (items: { para: string; value: string }[]) =>
              items.forEach(console.log);

    table([
        { param: "set-point", value: argv.setPoint },
        { param: "controllers", value: argv.controllers },
        { param: "initial-workers", value: workerSpecs.length },
        { param: "gain", value: argv.gain },
        { param: "iterations", value: argv.iterations },
        {
            param: "duration-strategy",
            value: argv.durationStrategy.toString()
        },
        { param: "dead-zone", value: argv.deadZone }
    ]);
};

const outputPlantSeries = (series: number[]) => plot(series, { height: 10 });

export const buildController = (
    config: ControllerRunConfig,
    pControllerFactory: Function = proportionalControllerFactory,
    iControllerFactory: Function = integralControllerFactory,
    dzDecoratorFactory: Function = deadZoneDecorator
) => {
    let result = compositeControllerFactory([
        `${config.controllers}`.includes("P")
            ? pControllerFactory(config.setPoint, config.gain)
            : noopControllerFactory(0),
        `${config.controllers}`.includes("I")
            ? iControllerFactory(config.setPoint)
            : noopControllerFactory(0)
    ]);
    if (config.deadZone.length == 2) {
        result = dzDecoratorFactory(result, config.deadZone);
    }
    return result;
};

export const runWorkPlant = (
    config: ControllerRunConfig,
    workerPlant: WorkerPlant,
    logger: Logger,
    controller: Controller = noopControllerFactory(0)
): number[] => {
    const resultSeries: number[] = [];
    for (const result of workerPlant.iterate(config.iterations)) {
        resultSeries.push(workerPlant.workerCount);
        const error = controller(result.length);
        logger.info(`error ${error}`);

        if (error > 0) {
            workerPlant.addWorkers(
                makeCountWorkers(error, config.durationStrategy)
            );
        } else {
            workerPlant.removeWorkers(error);
        }
    }
    return resultSeries;
};
