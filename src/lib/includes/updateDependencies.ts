import * as fs from "fs";

import chalk from "chalk";
import fetch from "npm-registry-fetch";
import ora from "ora";
import path from "path";

export async function updateDependencies() {
  const spinner = ora("Updating dependencies...").start();

  try {
    const packageJSONPath = path.join(process.cwd(), "package.json");
    const packageNinjaFilePath = path.join(process.cwd(), ".pkgninja");

    if (!fs.existsSync(packageJSONPath)) {
      spinner.fail("Package.json not found");
      return;
    }

    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
    const dependencies = packageJSON.dependencies || {};
    const devDependencies = packageJSON.devDependencies || {};

    if (fs.existsSync(packageNinjaFilePath)) {
      const packageNinjaFile = JSON.parse(
        fs.readFileSync(packageNinjaFilePath, "utf8")
      );
      const ninjaDependencies = packageNinjaFile.dependencies || {};
      const ninjaDevDependencies = packageNinjaFile.devDependencies || {};

      const updatedDependenciesForPackageJSON = await updateDepsPackageJSON(
        dependencies,
        ninjaDependencies
      );
      const updatedDevDependenciesForPackageJSON = await updateDepsPackageJSON(
        devDependencies,
        ninjaDevDependencies
      );

      const updatedDependenciesForNinja = await updateDepsNinja(
        dependencies,
        ninjaDependencies
      );
      const updatedDevDependenciesForNinja = await updateDepsNinja(
        devDependencies,
        ninjaDevDependencies
      );

      // Update package.json
      packageJSON.dependencies = updatedDependenciesForPackageJSON;
      packageJSON.devDependencies = updatedDevDependenciesForPackageJSON;

      fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

      // Update .pkgninja
      packageNinjaFile.dependencies = updatedDependenciesForNinja;
      packageNinjaFile.devDependencies = updatedDevDependenciesForNinja;

      fs.writeFileSync(
        packageNinjaFilePath,
        JSON.stringify(packageNinjaFile, null, 2)
      );

      spinner.succeed(
        "Dependencies updated successfully. Run 'npm install' to apply changes."
      );
    } else {
      spinner.fail(".pkgninja file not found");
    }
  } catch (error) {
    spinner.fail(`Failed to update dependencies: ${error}`);
  }
}

async function updateDepsNinja(
  deps: { [key: string]: string },
  ninjaDeps: { [key: string]: { version: string; locked: boolean } }
) {
  const updatedDeps: { [key: string]: any } = {};

  for (const [dep, version] of Object.entries(deps)) {
    if (ninjaDeps[dep] && ninjaDeps[dep].locked) {
      // Use the locked version
      updatedDeps[dep] = {
        version,
        locked: true,
      };
    } else {
      // Fetch the latest version and update
      const latestVersion = await getLatestVersion(dep);
      updatedDeps[dep] = {
        version: latestVersion,
        locked: false,
      };
    }
  }

  return updatedDeps;
}

async function updateDepsPackageJSON(
  deps: { [key: string]: string },
  ninjaDeps: { [key: string]: { version: string; locked: boolean } }
) {
  const updatedDeps: { [key: string]: any } = {};

  for (const [dep, version] of Object.entries(deps)) {
    if (ninjaDeps[dep] && ninjaDeps[dep].locked) {
      // Use the locked version
      updatedDeps[dep] = version;
    } else {
      // Fetch the latest version and update
      const latestVersion = await getLatestVersion(dep);
      updatedDeps[dep] = latestVersion;
    }
  }

  return updatedDeps;
}

async function getLatestVersion(dep: string): Promise<string> {
  try {
    const response = await fetch.json(`/${dep}`);
    return (response["dist-tags"] as any).latest;
  } catch (error) {
    console.error(`Failed to fetch latest version for ${dep}: ${error}`);
    return "";
  }
}
