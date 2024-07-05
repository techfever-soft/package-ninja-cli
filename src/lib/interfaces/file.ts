interface PackageJSON {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
}

interface PackageNinjaFile {
  config: {
    reportsPath: string;
  };
  dependencies: Dependencies;
  devDependencies: Dependencies;
}
