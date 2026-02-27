---
description: |
  Manually triggered workflow that reads the latest published Azure DevOps Marketplace
  extension version, bumps the repository extension version, and creates a matching
  GitHub release tag to trigger the release build pipeline.
on:
  workflow_dispatch:

permissions:
  contents: write

network: defaults

safe-outputs:
  create-release:

tools:
  azure-devops-marketplace:
  github:
    toolsets: [default]

timeout-minutes: 15
---

# Agentic Release Version Bump

You are preparing the next release tag for this repository.

Follow these steps in order:

1. Read `vss-extension.json` and capture:
   - `publisher`
   - `id`
   - current `version`

2. Use the Azure DevOps marketplace tool to fetch the latest published extension version for this extension (`publisher.id`).

3. Determine `nextVersion` by incrementing the patch part of the latest marketplace version (semver `major.minor.patch`).
   - Example: `1.0.36` -> `1.0.37`.
   - If the current repo version is already greater than this calculated value, keep the current repo version as `nextVersion`.

4. Update `vss-extension.json` so `version` equals `nextVersion`.

5. Commit and push the version change to the current branch with message:
   - `chore: bump extension version to <nextVersion>`
   - If no file change is needed, skip creating a commit.

6. Ensure there is no existing GitHub release or tag with `nextVersion`. If one exists, fail with a clear message.

7. Create a GitHub release with:
   - `tag_name`: `nextVersion`
   - `name`: `nextVersion`
   - target commit: the latest commit on the current branch (including the version bump commit when one was created)
   - concise body noting this release was created to kick off the release build workflow chain.

8. Add a short run summary containing:
   - marketplace version found
   - repository version before/after
   - created release tag
