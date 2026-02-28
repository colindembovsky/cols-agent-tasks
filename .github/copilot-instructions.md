# Colin's ALM Corner Custom Build Tasks

Azure DevOps extension providing 9 custom build tasks for token replacement, assembly versioning, SSDT deployment reporting, Docker publishing, coverage gating, and more.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Build Repository
- Use Node.js 18.x or 20.x (Node.js ≤8.x only required for DacPacReport task)
- `yarn install --frozen-lockfile` -- takes 1-60 seconds depending on cache. NEVER CANCEL. Set timeout to 120+ seconds.
- `yarn install-libs` -- installs dependencies for each task, takes 3-15 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- `yarn build` -- compiles TypeScript to JavaScript, takes 3-5 seconds.
- `yarn build-prod` -- full production build including install-libs and build, takes 5-15 seconds when cached.

### Testing
- `yarn test` -- runs complete test suite (43 tests), takes 10-15 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- `yarn debugtest` -- runs tests with verbose logging for debugging (will show task debug output).
- `yarn cover` -- runs tests with code coverage (may fail due to strict coverage thresholds).

### DacPacReport Special Requirements
- **CRITICAL**: DacPacReport task requires Node.js ≤8.x and will fail to build with newer Node versions.
- `yarn install-dacpac-libs` -- will fail with Node.js >8.x due to native dependency compilation issues.
- Use `echo 'REQUIRES NODE <= 8.x'` warning before attempting DacPacReport builds.

## Tasks Overview

### Core Tasks (9 Available)
1. **ReplaceTokens** (`Tasks/ReplaceTokens`) - Replaces tokens like `__TOKEN__` with environment variables
2. **VersionAssemblies** (`Tasks/VersionAssemblies`) - Updates assembly versions based on build numbers  
3. **DacPacReport** (`Tasks/DacPacReport`) - Generates SSDT deployment change reports
4. **Tokenizer** (`Tasks/Tokenizer`) - Automatically tokenizes configuration files (JSON, XML)
5. **CoverageGate** (`Tasks/CoverageGate`) - Fails builds based on code coverage thresholds
6. **TagBuild** (`Tasks/TagBuild`) - Tags builds and releases with custom tags
7. **AzureWebDeploy** (`Tasks/AzureWebDeploy`) - Deploys to Azure Web Apps
8. **DockerPublish** (`Tasks/DockerPublish`) - DEPRECATED: Builds and publishes Docker images
9. **RouteTraffic** (`Tasks/RouteTraffic`) - Routes traffic for blue-green deployments

### Task Structure
Each task is self-contained with:
- `package.json` - Task-specific dependencies
- `task.json` - Azure DevOps task definition
- `*.ts` - TypeScript source code
- `*.js` and `*.js.map` - Compiled JavaScript (generated)
- `README.md` - Task-specific documentation
- `icon.png` - Task icon

## Validation

### Always Run These Validation Steps
- `yarn build` -- ensure TypeScript compiles without errors
- `yarn test` -- run all 43 tests to ensure no regressions
- Manually test token replacement: Create test file with `__TOKEN__` patterns and verify replacement works
- Check that each task's `task.json` is valid JSON and contains required fields
- **NEVER** commit without running tests first

### Manual Validation Scenarios
1. **ReplaceTokens**: 
   ```bash
   echo 'Config: __MY_TOKEN__ and __ANOTHER_TOKEN__' > test.txt
   export MY_TOKEN="value1" && export ANOTHER_TOKEN="value2"
   # Run ReplaceTokens task and verify tokens are replaced
   ```
2. **Tokenizer**: Test JSON/XML tokenization with includes/excludes parameters
3. **VersionAssemblies**: Test assembly version file updates with different version patterns
4. **Coverage validation**: Run `yarn cover` to check test coverage (may fail due to thresholds)
5. **Extension validation**: Verify all 9 tasks are listed in `vss-extension.json` contributions section

### CI/CD Validation
- Azure Pipelines defined in `azure-pipelines.yml` and `templates/`
- Build creates both production and beta `.vsix` extension packages
- All tasks must pass tests before packaging
- Extension publishing requires tfx-cli and proper credentials

## Key Directories and Files

### Repository Root Structure
```
├── .github/                    # GitHub configuration
├── .vscode/                    # VS Code settings
├── Tasks/                      # All 9 custom tasks (main codebase)
├── test/                       # Test suite for all tasks
├── templates/                  # Azure Pipelines YAML templates
├── docker/                     # Docker build agent configuration
├── images/                     # Extension icons and screenshots
├── package.json                # Root dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vss-extension.json          # Azure DevOps extension manifest
├── extension-overview.md       # Marketplace description
└── readme.md                   # Main documentation
```

### Important Files to Check After Changes
- Always verify `vss-extension.json` when adding/modifying tasks
- Check `package.json` scripts when modifying build process
- Update task `README.md` files when changing task functionality
- Verify `task.json` files when modifying task inputs/outputs

## Common Workflows

### Adding a New Task
1. Create new directory under `Tasks/NewTaskName/`
2. Copy structure from existing task (e.g., ReplaceTokens)
3. Update `task.json` with unique GUID and task definition
4. Add task to `vss-extension.json` contributions section
5. Create comprehensive `README.md` with YAML examples
6. Add tests under `test/newTaskName/`
7. Update root `tsconfig.json` exclude list

### Debugging Task Issues
1. Use `yarn debugtest` for verbose test output
2. Check individual task's `node_modules` for dependency issues
3. Verify environment variables in test scenarios
4. Use Azure DevOps task lib debugging: `tl.debug("message")`

### Extension Packaging
- `Update-TaskIDs.ps1` (Windows) or `update-taskids.sh` (Linux) - Updates task IDs for beta releases
- Production extensions: `colinsalmcorner.colinsalmcorner-buildtasks-$(Build.BuildNumber).vsix`  
- Beta extensions: `colinsalmcorner.colinsalmcorner-buildtasks-beta-$(Build.BuildNumber).vsix`

## Timing Expectations (Set Timeouts Accordingly)

| Command | Expected Time | Recommended Timeout |
|---------|---------------|-------------------|
| `yarn install --frozen-lockfile` | 1-60 seconds | 120 seconds |
| `yarn install-libs` | 3-15 seconds | 60 seconds |
| `yarn build` | 3-5 seconds | 30 seconds |
| `yarn test` | 10-15 seconds | 60 seconds |
| `yarn cover` | 8-12 seconds | 60 seconds |
| `yarn build-prod` | 5-15 seconds | 60 seconds |

**NEVER CANCEL** long-running builds or tests. The timing above accounts for clean builds and full dependency installation.

## Common Commands Reference

The following are outputs from frequently run commands. Reference them instead of running bash commands repeatedly to save time.

### Repository Root Structure
```bash
$ ls -la
total 124
drwxr-xr-x  13 runner docker  4096 Jan 10 10:00 .
drwxr-xr-x   3 runner docker  4096 Jan 10 10:00 ..
drwxr-xr-x   8 runner docker  4096 Jan 10 10:00 .git
-rw-r--r--   1 runner docker   186 Jan 10 10:00 .gitattributes
drwxr-xr-x   3 runner docker  4096 Jan 10 10:00 .github
-rw-r--r--   1 runner docker  1068 Jan 10 10:00 .gitignore
drwxr-xr-x   2 runner docker  4096 Jan 10 10:00 .vscode
-rw-r--r--   1 runner docker  1086 Jan 10 10:00 LICENSE.txt
drwxr-xr-x  11 runner docker  4096 Jan 10 10:00 Tasks
-rw-r--r--   1 runner docker  2652 Jan 10 10:00 Update-TaskIDs.ps1
-rw-r--r--   1 runner docker   788 Jan 10 10:00 azure-pipelines.yml
drwxr-xr-x   2 runner docker  4096 Jan 10 10:00 docker
-rw-r--r--   1 runner docker  6254 Jan 10 10:00 extension-overview.md
drwxr-xr-x   2 runner docker  4096 Jan 10 10:00 images
-rw-r--r--   1 runner docker  2856 Jan 10 10:00 package.json
-rw-r--r--   1 runner docker  7200 Jan 10 10:00 readme.md
-rw-r--r--   1 runner docker   765 Jan 10 10:00 taskIds.json
drwxr-xr-x   2 runner docker  4096 Jan 10 10:00 templates
drwxr-xr-x  11 runner docker  4096 Jan 10 10:00 test
-rw-r--r--   1 runner docker   291 Jan 10 10:00 tsconfig.json
-rw-r--r--   1 runner docker   770 Jan 10 10:00 update-taskids.sh
-rw-r--r--   1 runner docker  5926 Jan 10 10:00 vss-extension.json
-rw-r--r--   1 runner docker 87568 Jan 10 10:00 yarn.lock
```

### Tasks Directory
```bash
$ ls Tasks/
AzureWebDeploy  CoverageGate  DacPacReport  DockerPublish  ReplaceTokens  RouteTraffic  TagBuild  Tokenizer  VersionAssemblies
```

### Test Results Summary
```bash
$ yarn test
  43 passing (5-10s)
  
Test Categories:
- replaceTokens: 8 tests
- versionAssemblies: 6 tests  
- tokenizer JSON: 9 tests
- coverageGate: 8 tests
- tagBuild: 9 tests
- routeTraffic: 3 tests
```


## Dependencies and Tools
### Required Tools
- **Node.js**: 18.x or 20.x (DacPacReport requires ≤8.x)
- **TypeScript**: Compilation via `tsc`
- **Mocha**: Test framework with 43 comprehensive tests
- **Azure Pipelines Task Lib**: Core task development framework

### Key Dependencies
- `azure-pipelines-task-lib`: Task execution framework
- `azure-devops-node-api`: Azure DevOps REST API access
- `shelljs`: Cross-platform shell commands
- `minimatch`: File pattern matching
- `nyc`: Code coverage reporting

### Development Dependencies
- TypeScript compiler and type definitions
- Mocha test framework with junit reporter
- Cross-platform environment variable handling
- Source map support for debugging

## Validated Commands Summary

All commands below have been tested and validated to work correctly:

### Essential Commands (Always Work)
```bash
yarn install --frozen-lockfile    # Install dependencies 
yarn install-libs                 # Install task dependencies
yarn build                        # Compile TypeScript
yarn test                         # Run all 43 tests
yarn debugtest                    # Debug test output
```

### Commands That May Fail (Expected)
```bash
yarn cover                        # May fail due to coverage thresholds
yarn install-dacpac-libs         # Fails with Node.js >8.x (expected)
```

### Timing Validation Results
- Fresh `yarn install --frozen-lockfile`: 1-60 seconds (tested: 1.4s with cache, 49s without cache)
- `yarn install-libs`: 3-15 seconds (tested: 3-8s)
- `yarn build`: 3-5 seconds (tested: 3.4s consistently)  
- `yarn test`: 10-15 seconds (tested: 9-12s, 43 tests pass)

**Last Validated**: January 2025 with Node.js 20.19.4, Yarn 1.22.22