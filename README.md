# 🥷🏽 PackageNinja

A smart package manager for Node.js 

## Features
- Automatically synchronizes your package.json and .pkgninja files
- Detects outdated dependencies and categorizes them (upToDate, canUpdate, outdated)
- Provides a user-friendly CLI for managing dependencies
- Supports dependency locking
- Works with all project types (Node.js, Angular, React, Vue...)
- VSCode extension for enhanced workspace integration

## Installation

To install the CLI globally:

```bash
npm install -g @techfever/package-ninja
```

## Usage
### Initial Setup
To initialize PackageNinja in your project directory :
```bash
package-ninja init
```

### Syncing dependencies
To synchronize your dependencies :
```bash
package-ninja sync
```
This command ensures that your package.json and .pkgninja files are in sync.

### Checking dependencies
To check your dependencies :
```bash
package-ninja check
```
This command will categorize your dependencies as upToDate, canUpdate, or outdated.

### Locking dependencies
```bash
package-ninja lock <dependency-name>
```
This command updates the .pkgninja file to lock the specified dependency.
Unlock dependencies with the command :
```bash
package-ninja unlock <dependency-name>
```

## Contributing
We welcome contributions! Please read our contributing guidelines for more information.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Authors
- D-C-MATE (owner of TechFever)

## Acknowledgments
Inspired by the need for a smarter package manager
Thanks to the open-source community for their invaluable resources