---
description: |
  Manually triggered workflow that reads the latest published Azure DevOps Marketplace
  extension version, computes the next version tag, and creates a matching GitHub
  release to trigger the release build pipeline.
on:
  workflow_dispatch:

permissions: read-all

network: defaults

tools:
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

2. Use the Azure DevOps marketplace CLI tool available in the runtime (not an MCP tool) to fetch the latest published extension version for this extension using `{publisher}.{id}` from step 1.

3. Determine `nextVersion` by incrementing the patch part of the latest marketplace version (semver `major.minor.patch`).
   - Example: `1.0.36` -> `1.0.37`.
   - If the current repo version is already greater than this calculated value, keep the current repo version as `nextVersion`.

4. If `vss-extension.json` is not already at `nextVersion`, update its `version` field to `nextVersion`, then commit and push that change to the current branch before creating the release.

5. Ensure there is no existing GitHub release or tag with `nextVersion` by checking with the `gh` CLI. If one exists, fail with a clear message.

6. Create a GitHub release with:
     - `tag_name`: `nextVersion`
     - `name`: `nextVersion`
     - target commit: the latest commit on the current branch
     - concise body noting this release was created to kick off the release build workflow chain.
    Use `gh release create` (bash), not safe outputs.

7. Add a short run summary containing:
   - marketplace version found
   - repository manifest version
   - next version selected
   - whether `vss-extension.json` was bumped
   - created release tag
