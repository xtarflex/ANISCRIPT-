---
description: how to update all documentation after a fix or release
---

# Documentation Update Workflow

Whenever a bug is fixed, a new feature is shipped, or a new version is released, it is critical to keep the project's documentation synchronized. Follow this step-by-step checklist to update all relevant files.

### 1. Update `package.json`
- Bump the version number according to Semantic Versioning (you can refer to the `/versioning` workflow for guidance).
- Ensure any new dependencies or package configuration changes (like `.npmignore` or `files` arrays) are accurate.

### 2. Update `RELEASE_NOTES.md`
- Add a new section at the very top for the new version (`## [vX.X.X] - YYYY-MM-DD`).
- Write a user-facing summary of the bug fixes, features, or performance improvements.

### 3. Update `DEV_LOG.md`
- Add a new entry detailing the technical work done.
- Include the `Status`, specific `Progress` bullet points, and `Notes` on any challenges faced (e.g., *Fixed FOUC and stagger flicker using animation-fill-mode: both*).

### 4. Review `README.md`
- Update any hardcoded version strings listed in the README (e.g., the installation snippet).
- Ensure badges, feature lists, and the "Current Status" reflect the latest updates.

### 5. Review Feature & Setup Documentation
- **`SPEC.md`**: Update this if the actual DSL syntax, compiler rules, or core architecture have changed.
- **`docs/GETTING_STARTED.md`**: Update if the installation logic or the CDN unpkg paths have changed.
- **`docs/API_REFERENCE.md`**: Update if new parameters were added, default behaviors were modified, or if the IntersectionObserver `init()` config changed.

### 6. Update the Core Source Comment
- **`src/index.js`**: Check and update the internal version string comment at the very top of the file to match the new version.

### 7. Commit the Documentation
Once all files reflect the update, commit them securely to version control.

// turbo-all
```bash
git add package.json *.md docs/*.md src/index.js
git commit -m "docs: synchronize documentation for vX.X.X"
git push origin master
```
