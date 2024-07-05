import * as fs from "fs";

import chalk from "chalk";
import { input } from "@inquirer/prompts";
import path from "path";

export async function initPackageNinjaFile(): Promise<void> {
  const pkgNinjaFilePath = path.join(process.cwd(), ".pkgninja");

  if (!fs.existsSync(pkgNinjaFilePath)) {
    const reportsPath = await input({
      message: "Where do you want to store the reports ?",
      default: "reports",
    });

    fs.writeFileSync(
      pkgNinjaFilePath,
      JSON.stringify(
        {
          config: {
            reportsPath: path.join(process.cwd(), reportsPath),
          },
          dependencies: {},
          devDependencies: {},
        },
        null,
        2
      )
    );

    console.log(
      chalk.bold(chalk.blueBright("[INFO]")) +
        "Package file created successfully"
    );
  } else {
    console.log(
      chalk.bold(
        chalk.yellow("[WARNING]") +
          " " +
          chalk.reset(".pkgninja file already exists, skipping...")
      )
    );

    console.log(" ");
  }
}
