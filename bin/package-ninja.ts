#!/usr/bin/env node

import { check } from "../src/commands/check";
import { init } from "../src/commands/init";
import { lock } from "../src/commands/lock";
import { program } from "commander";
import { sync } from "../src/commands/sync";
import { unlock } from "../src/commands/unlock";
import { update } from "../src/commands/update";

program.version("0.1.1");

program
  .command("init")
  .description("Initialize a new .pkgninja file")
  .action(init);

program
  .command("sync")
  .description("Sync the .pkgninja file with the package.json")
  .action(sync);

program
  .command("check")
  .description("Check dependencies and optionally generate a report")
  .action(check);

program
  .command("update")
  .description("Update only unlocked dependencies")
  .action(update);

program
  .command("lock <dependency>")
  .description("Lock a dependency")
  .action(lock);

program
  .command("unlock <dependency>")
  .description("Unlock a locked dependency")
  .action(unlock);

program.parse(process.argv);
