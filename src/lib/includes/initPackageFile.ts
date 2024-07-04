import * as fs from "fs";

import chalk from "chalk";
import path from "path";

export async function initPackageNinjaFile(): Promise<void> {
  const pkgNinjaFilePath = path.join(process.cwd(), ".pkgninja");

  if (!fs.existsSync(pkgNinjaFilePath)) {
    fs.writeFileSync(
      pkgNinjaFilePath,
      JSON.stringify(
        {
          dependencies: {},
          devDependencies: {},
        },
        null,
        2
      )
    );

    console.log(
      chalk.bold(
        chalk.blueBright("[INFO]") +
          " " +
          chalk.reset("Package file created successfully")
      )
    );
  } else {
    console.log(
      chalk.bold(
        chalk.blueBright("[INFO]") +
          " " +
          chalk.reset(".pkgninja file already exists")
      )
    );
  }
}
