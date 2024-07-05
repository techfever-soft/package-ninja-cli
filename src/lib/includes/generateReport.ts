import * as fs from "fs";
import * as path from "path";

import chalk from "chalk";

/**
 * Generate a JSON report of the dependencies and devDependencies
 * @param dependencies - List of dependencies with their statuses
 * @param devDependencies - List of devDependencies with their statuses
 */
export async function generateReportJSON(
  dependencies: any[],
  devDependencies: any[]
): Promise<void> {
  const reportName = new Date().getTime().toString();
  const reportDirectory = path.join(process.cwd(), "reports");
  const reportPath = path.join(reportDirectory, reportName + ".json");

  try {
    // Ensure the report directory exists
    if (!fs.existsSync(reportDirectory)) {
      fs.mkdirSync(reportDirectory, { recursive: true });
    }

    // Write the report to a JSON file
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ dependencies, devDependencies }, null, 2)
    );

    console.log(
      chalk.bold(chalk.green("[SUCCESS]")) + ` Report generated at : ${reportPath}`
    );
  } catch (error) {
    console.error(`Failed to generate report: ${error}`);
  }
}
