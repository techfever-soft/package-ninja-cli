import * as fs from "fs";

import path from "path";

export async function unlockDependency(dependency: string): Promise<void> {
  const packageNinjaFilePath = path.resolve(process.cwd(), ".pkgninja");

  if (fs.existsSync(packageNinjaFilePath)) {
    const packageNinjaFile = fs.readFileSync(packageNinjaFilePath, "utf-8");

    const packageNinja = JSON.parse(packageNinjaFile);

    const dependencyFound = packageNinja.dependencies[dependency];

    if (dependencyFound) {
      packageNinja.dependencies[dependency].locked = false;
    } else {
      const devDependencyFound = packageNinja.devDependencies[dependency];

      if (devDependencyFound) {
        packageNinja.devDependencies[dependency].locked = false;
      }
    }

    fs.writeFileSync(
      packageNinjaFilePath,
      JSON.stringify(packageNinja, null, 2)
    );

    console.log("Package unlocked successfully.");
  } else {
    console.log(
      "No .pkgninja file found in the current directory. Please run `package-ninja init` to create one."
    );
  }
}
