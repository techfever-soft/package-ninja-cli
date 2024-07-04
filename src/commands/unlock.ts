import { unlockDependency } from "../lib/includes/unlockDependency";

export function unlock(dependency: string) {
  unlockDependency(dependency).then(() => {
    console.log(`Dependency ${dependency} unlocked successfully.`);
  }).catch((err) => {
    console.error(`Error unlocking dependency ${dependency}:`, err);
  });
}
