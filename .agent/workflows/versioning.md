---
description: how to calculate and apply semantic versioning (SemVer)
---

# 🔢 Semantic Versioning Workflow

Use this workflow to determine the next version number for AniScript.

## 1. The SemVer Format
Versions follow the format: `MAJOR.MINOR.PATCH` (e.g., `1.1.0`)

## 2. Decision Logic
Follow these rules to decide which number to increment:

### 🔴 MAJOR (The First Number)
- **When to increment**: You make incompatible API changes (Breaking Changes).
- **AniScript Example**: Changing `:: animation ::` syntax to something completely different (e.g., `(( animation ))`) or removing support for existing data-attributes.
- **Action**: Increment MAJOR, set MINOR and PATCH to 0. (e.g., `1.5.2` -> `2.0.0`)

### 🟡 MINOR (The Second Number)
- **When to increment**: You add functionality in a backwards-compatible manner.
- **AniScript Example**: Adding new animations, adding a new flag to the CLI, or adding a new parameter like `data-ani-once`.
- **Action**: Increment MINOR, set PATCH to 0. (e.g., `1.1.0` -> `1.2.0`)

### 🟢 PATCH (The Third Number)
- **When to increment**: You make backwards-compatible bug fixes or performance improvements.
- **AniScript Example**: Fixing a memory leak, correcting a typo in a CSS class, or optimizing the parser lookahead.
- **Action**: Increment PATCH. (e.g., `1.1.0` -> `1.1.1`)

## 3. How to Apply
1. Update `"version"` in `package.json`.
2. Update the header in `RELEASE_NOTES.md`.
3. Add a log entry in `DEV_LOG.md`.
4. Git commit with a tag:
   ```powershell
   git add .
   git commit -m "chore: release v1.1.0"
   git tag v1.1.0
   git push origin master --tags
   ```
