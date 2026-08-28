# PatchLens

<p align="center">
  <img src="docs/assets/patchlens-hero.png" alt="PatchLens — evidence-based review for AI-generated changes" width="100%" />
</p>

[![CI](https://github.com/mturac/PatchLens/actions/workflows/ci.yml/badge.svg)](https://github.com/mturac/PatchLens/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933.svg)](package.json)
[![Zero runtime dependencies](https://img.shields.io/badge/runtime_dependencies-0-success.svg)](package.json)

**PatchLens reviews AI-generated Git changes for scope, proof, migration, dependency, secret, and test risks—without sending the diff to an LLM.**

Coding agents can produce plausible patches that compile while quietly escaping the requested scope, changing persisted schemas without migrations, updating manifests without lockfiles, skipping focused tests, or including sensitive values. PatchLens turns a Git diff into a deterministic review report with stable rule IDs and evidence tied to exact files and lines.

```text
Git range / unified diff
          ↓
file and hunk parser
          ↓
deterministic policy rules
          ↓
severity + evidence + remediation
          ↓
JSON · Markdown · SARIF · exit code
```

PatchLens is not a stylistic reviewer and does not claim semantic correctness. It is a fast, inspectable guardrail for the failure patterns that make vibe-coded changes expensive to trust.

## Quick start

Requirements: Node.js 22+ and Git.

```bash
git clone https://github.com/mturac/PatchLens.git
cd PatchLens
npm ci --ignore-scripts
npm run build
```

Review the latest commit:

```bash
node bin/patchlens.mjs review HEAD~1..HEAD --repo .
```

Fail CI on medium-or-higher findings:

```bash
node bin/patchlens.mjs review origin/main...HEAD \
  --repo . \
  --scope src/billing/ \
  --scope test/billing/ \
  --format sarif \
  --out patchlens.sarif \
  --fail-on medium
```

Exit codes:

- `0` — review completed and no finding met the failure threshold;
- `2` — review completed and policy failed;
- `1` — invalid input or operational failure.

## Built-in rules

| ID | Default severity | Detects |
|---|---|---|
| `PL001` | High | Secret-like values added to source |
| `PL002` | Medium | Production source changed with no test change |
| `PL003` | High | Database or persisted-data schema changed without migration |
| `PL004` | Medium | Dependency manifest changed without lockfile |
| `PL005` | High | Files changed outside declared task scope |
| `PL006` | Medium | Patch exceeds file or addition review budget |
| `PL007` | Low | Generated or build output mixed into authored change |
| `PL008` | High | Completion policy requires proof but verified proof is absent |

Every finding includes a stable ID, severity, affected files, bounded evidence, and actionable remediation. Rules are deliberately conservative and visible; there is no hidden model score.

## Product-proof gate

PatchLens can require an executable product receipt:

```bash
node bin/patchlens.mjs review HEAD~1..HEAD \
  --require-proof \
  --proof .vibeproof/receipt.json
```

A proof file is accepted only when it explicitly reports a verified state. This is intentionally a narrow integration boundary: PatchLens does not re-run the product. Use [VibeProof](https://github.com/mturac/VibeProof) to produce the executable evidence.

## Output formats

### Markdown

Human-readable review summary for pull requests and handoffs.

```text
PL003 · HIGH · Schema changed without migration
prisma/schema.prisma: +8/-1
Remediation: add a forward migration, rollback strategy, and migration-focused verification.
```

### JSON

Versioned machine contract with canonical SHA-256 `reportHash`.

### SARIF

SARIF 2.1.0 output for GitHub code scanning and other compatible review surfaces.

## CLI

```text
patchlens review [range]
  [--repo <directory>]
  [--scope <path>]...
  [--format json|markdown|sarif]
  [--out <file>]
  [--fail-on high|medium|low]
  [--max-files <count>]
  [--max-additions <count>]
  [--proof <receipt.json>]
  [--require-proof]

patchlens --version
patchlens --help
```

`--scope` is repeatable. Scope enforcement fails closed: every changed path must match at least one declared scope.

## Library API

```ts
import {
  parseUnifiedDiff,
  reviewPatch,
  renderMarkdown,
  renderSarif,
  type ReviewOptions
} from "@mturac/patchlens";

const options: ReviewOptions = {
  diff: unifiedDiff,
  repository: "payments-api",
  range: "origin/main...HEAD",
  allowedScopes: ["src/billing/", "test/billing/"],
  failOn: "high"
};

const report = reviewPatch(options);
console.log(renderMarkdown(report));
console.log(JSON.stringify(renderSarif(report)));
```

## Security and privacy

PatchLens reads local Git metadata and diff content. It makes zero network calls, has zero runtime dependencies, and does not execute changed code. Reports can contain file paths and bounded added-line evidence, so review artifacts before publishing them outside the repository's trust boundary.

Secret-like value detection is a guardrail, not a complete secret scanner. A `PL001` result should trigger credential rotation and repository-history review when the value was real.

## Scope and non-goals

PatchLens does not replace human review, prove runtime behavior, reason about business correctness, execute tests, resolve supply-chain risk, or rewrite code. A clean report means configured risk patterns were not observed; it does not mean the patch is correct.

Use [RepoPack](https://github.com/mturac/RepoPack) to give the coding agent focused context, [InferShape](https://github.com/mturac/InferShape) to diagnose a failed agent session, and [VibeProof](https://github.com/mturac/VibeProof) to prove the resulting product actually runs.

## Development

```bash
npm ci --ignore-scripts
npm run verify
```

Verification covers strict TypeScript compilation, public API type contracts, diff parsing, all built-in rules, CLI exit codes, Markdown/SARIF rendering, schema checks, PNG validation, and a real npm tarball consumer install/import/CLI smoke test.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
