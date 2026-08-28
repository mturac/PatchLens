# PatchLens Design

PatchLens is a deterministic, local-first reviewer for AI-generated patches. It parses unified diffs or a Git range, maps changed files and hunks, then emits evidence-backed findings for scope escape, secret additions, code changes without tests, schema changes without migrations, dependency drift, generated-file edits, and oversized or high-churn patches. It never calls an LLM, executes project code, or claims semantic correctness.

The output is a versioned JSON review, a Markdown report, stable SHA-256 identity, and a CI comparison. High-confidence findings fail closed when requested. Node.js 22+, TypeScript 5.8, zero runtime dependencies, Apache-2.0.
