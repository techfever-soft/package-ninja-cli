import { checkDependencies } from "../lib/includes/checkDependencies";
import { confirm } from "@inquirer/prompts";
import { initPackageNinjaFile } from "../lib/includes/initPackageFile";
import { sync } from "./sync";

export function init() {
  initPackageNinjaFile()
    .then(async () => {
      const checkAndSyncNow = await confirm({
        message: "Do you want to check and sync dependencies now ?",
        default: true,
      });

      if (checkAndSyncNow) {
        await checkDependencies(false);

        sync();
      }
    })
    .catch((err) => {
      console.error("Error creating package file:", err);
    });
}
