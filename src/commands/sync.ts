import chalk from "chalk";
import { syncDependencies } from "../lib/includes/syncDependencies";

export function sync() {
  syncDependencies()
    .then(() => {
      console.log(" ");

      console.log(
        chalk.bold(chalk.greenBright("[SUCCESS]")) +
          " " +
          `Dependencies synced successfully !`
      );
    })
    .catch((err) => {
      console.error(`Error can\'t sync dependencies`);
    });
}
