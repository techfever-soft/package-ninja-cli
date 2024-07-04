import { checkDependencies } from "../lib/includes/checkDependencies";

export function check() {
  checkDependencies()
    .then(() => {
      console.log("Dependencies checked successfully.");
    })
    .catch((err) => {
      console.error("Error checking dependencies:", err);
    });
}
