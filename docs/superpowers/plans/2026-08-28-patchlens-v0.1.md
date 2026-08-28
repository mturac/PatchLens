# PatchLens v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build deterministic risk review for coding-agent patches.

**Architecture:** A strict unified-diff parser feeds isolated rule modules. Canonical review artifacts drive CLI, Markdown, comparison, and CI gates.

**Tech Stack:** TypeScript 5.8, Node.js 22+, ESM, zero runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-28-patchlens-design.md`

## Global Constraints
- No LLM or network calls.
- Never expose raw secret values in findings.
- Identical inputs produce identical findings and review hashes.
- Every finding contains file and evidence.

### Task 1: Diff contracts and parser
- [ ] Write failing parser tests.
- [ ] Implement strict unified-diff parsing and canonical hashing.
- [ ] Verify focused tests.

### Task 2: Risk rules
- [ ] Write failing tests for secrets, scope, tests, migrations, dependencies, generated files, and patch size.
- [ ] Implement isolated deterministic rules.
- [ ] Verify focused tests.

### Task 3: CLI and artifacts
- [ ] Write failing CLI and comparison tests.
- [ ] Implement review, inspect, compare, Markdown, atomic writes, and exit semantics.
- [ ] Verify all tests and package smoke.

### Task 4: OSS delivery
- [ ] Add README, schemas, examples, PNG hero, CI, and community files.
- [ ] Run complete verification and clean-tree checks.
