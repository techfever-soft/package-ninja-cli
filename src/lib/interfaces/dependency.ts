interface Dependency {
  version: string;
  locked: boolean;
}

interface Dependencies {
  [key: string]: Dependency;
}
