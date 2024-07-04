import * as fs from "fs";
import * as path from "path";

import chalk from "chalk";
import fetch from "npm-registry-fetch";

/**
 * Check if the current directory contains a package.json file
 * Then check dependencies in the package.json file
 * @returns void
 */
export async function checkDependencies(): Promise<void> {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.json not found in the current directory");
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Continue with dependency checking logic
  console.log("Using package.json : " + packageJson.name);
  // Add more logic for checking dependencies here

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  console.log("Checking dependencies...");
  await checkDependencyVersions(dependencies);
  console.log("Checking devDependencies...");
  await checkDependencyVersions(devDependencies);
}

async function getLatestVersion(packageName: string): Promise<string> {
  const response = await fetch.json(`/${packageName}`);
  return (response["dist-tags"] as any).latest;
}

function compareVersions(
  currentVersion: string,
  latestVersion: string
): string {
  const currentParts = currentVersion.replace("^", "").split(".").map(Number);
  const latestParts = latestVersion.split(".").map(Number);

  if (currentParts[0] < latestParts[0]) return "outdated";
  if (currentParts[1] < latestParts[1]) return "canUpdate";
  if (currentParts[2] < latestParts[2]) return "canUpdate";
  return "upToDate";
}

function checkVersionsLocked(dependency: string): boolean {
  const pkgNinjaFilePath = path.join(process.cwd(), ".pkgninja");

  if (fs.existsSync(pkgNinjaFilePath)) {
    const pkgFile = JSON.parse(fs.readFileSync(pkgNinjaFilePath, "utf-8"));

    const deps = pkgFile.dependencies;
    const devDeps = pkgFile.devDependencies;

    if (deps && deps[dependency] && deps[dependency].locked) {
      return true;
    }
    if (devDeps && devDeps[dependency] && devDeps[dependency].locked) {
      return true;
    }
  }

  return false;
}

async function checkDependencyVersions(dependencies: {
  [key: string]: string;
}): Promise<void> {
  for (const [dep, version] of Object.entries(dependencies)) {
    const latestVersion = await getLatestVersion(dep);
    const status = compareVersions(version, latestVersion);
    const isLocked = checkVersionsLocked(dep);

    let currentVersionText = "";
    let latestVersionText = "";
    let statusText = "";

    if (status === "canUpdate") {
      currentVersionText = chalk.yellow(version);
      latestVersionText = chalk.green(latestVersion);
      statusText = "⚠️";
    }
    if (status === "outdated") {
      currentVersionText = chalk.red(version);
      latestVersionText = chalk.green(latestVersion);
      statusText = "❌";
    }
    if (status === "upToDate") {
      currentVersionText = chalk.green(version);
      latestVersionText = chalk.green(latestVersion);
      statusText = "✅";
    }

    console.log(
      statusText +
        " " +
        chalk.bold(`${dep}`) +
        " => " +
        currentVersionText +
        chalk.gray(" vs ") +
        latestVersionText +
        " " +
        (isLocked
          ? chalk.greenBright("[locked]")
          : chalk.redBright("[unlocked]"))
    );
  }
}
