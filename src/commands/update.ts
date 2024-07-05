import { updateDependencies } from "../lib/includes/updateDependencies";

export function update() {
  updateDependencies()
    .then(() => {

    })
    .catch((err) => {
      console.error("Error updating dependencies:", err);
    });
}
