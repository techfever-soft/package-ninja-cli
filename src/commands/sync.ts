import * as fs from "fs";
import * as path from "path";

import chalk from "chalk";

interface Dependency {
  version: string;
  locked: boolean;
}

interface Dependencies {
  [key: string]: Dependency;
}

interface PackageJSON {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
}

interface PackageNinjaFile {
  dependencies: Dependencies;
  devDependencies: Dependencies;
}

/**
 * Reads a JSON file and returns the parsed content.
 * @param filePath The path to the JSON file.
 */
function readJsonFile<T>(filePath: string): T | null {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as T;
  }
  return null;
}

/**
 * Writes content to a JSON file.
 * @param filePath The path to the JSON file.
 * @param content The content to write.
 */
function writeJsonFile<T>(filePath: string, content: T): void {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

/**
 * Converts a simple dependencies object to the extended format with version and locked properties.
 * @param deps The simple dependencies object.
 */
function convertDependencies(deps: { [key: string]: string }): Dependencies {
  const result: Dependencies = {};
  for (const [dep, version] of Object.entries(deps)) {
    result[dep] = { version, locked: false };
  }
  return result;
}

/**
 * Synchronize dependencies between .pkgninja file and the package.json
 */
export function sync() {
  const packageJSONPath = path.join(process.cwd(), "package.json");
  const packageNinjaFilePath = path.join(process.cwd(), ".pkgninja");

  let packageJSON = readJsonFile<any>(packageJSONPath);
  if (!packageJSON) {
    console.log("package.json not found");
    return;
  }

  // Convert simple dependency structure to extended structure if necessary
  if (
    packageJSON.dependencies &&
    typeof Object.values(packageJSON.dependencies)[0] === "string"
  ) {
    packageJSON.dependencies = convertDependencies(
      packageJSON.dependencies as { [key: string]: string }
    );
  }
  if (
    packageJSON.devDependencies &&
    typeof Object.values(packageJSON.devDependencies)[0] === "string"
  ) {
    packageJSON.devDependencies = convertDependencies(
      packageJSON.devDependencies as { [key: string]: string }
    );
  }

  const packageJSONDependencies = packageJSON.dependencies || {};
  const packageJSONDevDependencies = packageJSON.devDependencies || {};

  const pkgNinjaFile = readJsonFile<PackageNinjaFile>(packageNinjaFilePath);
  if (!pkgNinjaFile) {
    console.log(".pkgninja not found");
    return;
  }

  const ninjaDependencies = pkgNinjaFile.dependencies;
  const ninjaDevDependencies = pkgNinjaFile.devDependencies;

  // Merge dependencies
  const mergedDependencies: Dependencies = {
    ...packageJSONDependencies,
    ...ninjaDependencies,
  };
  const mergedDevDependencies: Dependencies = {
    ...packageJSONDevDependencies,
    ...ninjaDevDependencies,
  };

  const updatedNinjaFile: PackageNinjaFile = {
    dependencies: mergedDependencies,
    devDependencies: mergedDevDependencies,
  };

  writeJsonFile(packageNinjaFilePath, updatedNinjaFile);

  console.log(
    chalk.bold(
      chalk.greenBright("[SUCCESS]") +
        " " +
        chalk.reset(
          ".pkgninja has been updated with the changes from package.json"
        )
    )
  );
}
