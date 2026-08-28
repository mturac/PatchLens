# PatchLens examples

Review the latest commit:

```bash
node bin/patchlens.mjs review HEAD~1..HEAD --repo . --format markdown
```

Review a pull-request branch and export SARIF:

```bash
node bin/patchlens.mjs review origin/main...HEAD \
  --repo . \
  --format sarif \
  --out patchlens.sarif \
  --fail-on medium
```
