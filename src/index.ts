/* istanbul ignore file */
import yargs from "yargs";

yargs
    .scriptName("ctlr")
    .usage("$0 <cmd> [args]")
    .commandDir("./commands", { extensions: ["ts"] })
    .wrap(120)
    .env("CTLR")
    .help().argv;
