import { checkDependencies } from "../lib/includes/checkDependencies";
import { initPackageNinjaFile } from "../lib/includes/initPackageFile";
import { sync } from "./sync";

export function init() {
  initPackageNinjaFile()
    .then(() => {
      checkDependencies();
      sync();
    })
    .catch((err) => {
      console.error("Error creating package file:", err);
    });
}
