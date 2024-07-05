import { confirm, select } from "@inquirer/prompts";

import chalk from "chalk";
import { checkDependencies } from "../lib/includes/checkDependencies";

export async function check() {
  const canGenerateReport = await confirm({
    message: "Generate a report ?",
  });

  if (canGenerateReport) {
    const reportFormat = await select({
      message: "Select a report format",
      choices: [
        {
          name: "JSON",
          value: "json",
        },
        {
          name: "HTML",
          value: "html",
          disabled: true
        },
        {
          name: "XML",
          value: "xml",
          disabled: true
        },
      ],
    });

    checkDependencies(canGenerateReport, reportFormat)
      .then(() => {
        console.log(" ");

        console.log(
          chalk.bold(chalk.green("[SUCCESS]")) +
            " Dependencies checked successfully."
        );
      })
      .catch((err) => {
        console.error("Error checking dependencies:", err);
      });
  } else {
    checkDependencies(false)
      .then(() => {
        console.log(" ");

        console.log(
          chalk.bold(chalk.green("[SUCCESS]")) +
            " Dependencies checked successfully."
        );
      })
      .catch((err) => {
        console.error("Error checking dependencies:", err);
      });
  }
}
