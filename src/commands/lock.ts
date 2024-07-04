import { lockDependency } from "../lib/includes/lockDependency";

export function lock(dependency: string) {
  lockDependency(dependency).then(() => {
    console.log(`Dependency ${dependency} locked successfully.`);
  }).catch((err) => {
    console.error(`Error locking dependency ${dependency}:`, err);
  });
}
