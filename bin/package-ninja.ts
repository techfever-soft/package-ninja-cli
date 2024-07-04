#!/usr/bin/env node

import { check } from "../src/commands/check";
import { init } from "../src/commands/init";
import { lock } from "../src/commands/lock";
import { program } from "commander";
import { sync } from "../src/commands/sync";
import { unlock } from "../src/commands/unlock";

program.version("0.1.0");

program
  .command("init")
  .description("Init a new .pkgninja file")
  .action(init);

program
  .command("sync")
  .description("Synchronize the .pkgninja file with the package.json")
  .action(sync);

program.command("check").description("Check dependencies").action(check);

program
  .command("lock <dependency>")
  .description("Lock a dependency")
  .action(lock);

program
  .command("unlock <dependency>")
  .description("Unlock a locked dependency")
  .action(unlock);

program.parse(process.argv);
