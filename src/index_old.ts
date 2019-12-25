import { plot } from "asciichart";

import {
    makeCountWorkers,
    makeWorkers,
    WorkerPlant,
    randomDuration
} from "./worker";
import {
    proportionalControllerFactory,
    compositeControllerFactory
} from "./controller";

const gain = 0.9;
const setPoint = 5;
const iterations = 110;
const series = new Array<number>();
const series2 = new Array<number>();
const plant = new WorkerPlant(makeWorkers([10, 5, 1, 5, 15, 30, 15]));
const plant2 = new WorkerPlant(makeWorkers([10, 5, 1, 5, 15, 30, 15]));

const controllers = compositeControllerFactory([
    proportionalControllerFactory(setPoint, gain)
]);

for (const result of plant.iterate(iterations)) {
    series.push(result.length);
}
for (const result of plant2.iterate(iterations)) {
    series2.push(result.length);

    plant2.addWorkers(
        makeCountWorkers(controllers(result.length), randomDuration())
    );
}

console.log(`\n\nset-point: ${setPoint}`);
console.log(`gain: ${gain}\n\n`);
console.log(plot(series, { height: 10 }));
console.log("\n\n");
console.log(plot(series2, { height: 10 }));
