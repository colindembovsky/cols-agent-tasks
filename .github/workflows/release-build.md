---
description: |
  Agentic release pipeline triggered by new releases.
  Generates release notes for the release and builds a VSIX package artifact.
on:
  release:
    types: [created]

permissions: read-all

network: defaults

post-steps:
  - name: Upload VSIX artifact
    uses: actions/upload-artifact@v4
    with:
      name: release-vsix
      path: |
        dist/*.vsix
        dist/release-notes.md
      if-no-files-found: error

timeout-minutes: 25
---

# Agentic Release Build

You are the release automation assistant for this repository.

For release `${{ github.event.release.tag_name }}` (release id `${{ github.event.release.id }}`), do the following in order:

1. Generate release notes for the changes in this release:
   - Identify the previous non-draft release tag before `${{ github.event.release.tag_name }}`.
   - If no previous release exists, generate notes from the commits available for `${{ github.event.release.tag_name }}` only.
   - Summarize changes between the previous release tag (if present) and `${{ github.event.release.tag_name }}` into concise markdown release notes.
   - Include a short section for notable changes and list the included commits or pull requests.
   - Save the generated notes to `dist/release-notes.md` and add the same content to the GitHub Actions job summary.

2. Build and test the extension package:
   - Run `yarn install --frozen-lockfile` in `Tasks/DacPacReport`.
   - Run `yarn install --frozen-lockfile` in the repository root.
   - Run `yarn build`.
   - Run `yarn test`.

3. Build the VSIX release package:
   - Install `tfx-cli@0.17.0` globally.
   - Create the VSIX file under `dist/` using `tfx extension create --manifest-globs vss-extension.json --output-path dist/colinsalmcorner-buildtasks-${{ github.event.release.tag_name }}.vsix`.

4. Verify outputs:
   - Ensure exactly one VSIX file exists in `dist/`.
   - If any command fails, stop and fail the workflow with a clear error message.
