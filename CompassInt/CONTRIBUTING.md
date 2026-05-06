# Contributing to CompassInt

Thank you for your interest in contributing to CompassInt! 🎉  
This project welcomes contributions of all kinds — bug fixes, new features, documentation improvements, and more.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We are here to learn and build together.

---

## How to Contribute

### Reporting Bugs

1. Check the [existing issues](https://github.com/your-username/CompassInt/issues) to avoid duplicates.
2. Open a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs. actual behaviour
   - Your OS and Node.js version

### Suggesting Features

Open an issue labelled `enhancement` and describe:
- The problem you are trying to solve
- Your proposed solution
- Any alternatives you considered

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Open a Pull Request against `main`

---

## Development Setup

```bash
git clone https://github.com/your-username/CompassInt.git
cd CompassInt
npm install
npm start
```

---

## Coding Guidelines

- Use **vanilla JavaScript** (ES2020+) — no frameworks, no transpilers
- Keep modules self-contained (each module exposes a single object/namespace)
- Follow the existing code style (2-space indentation, single quotes)
- Write descriptive comments for non-obvious logic
- Do not commit `node_modules/` or build artefacts

---

## Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add VirusTotal URL scanner module
fix: correct haversine distance calculation for antipodal points
docs: update API table in README
chore: upgrade electron to v31
```

---

## Pull Request Process

1. Ensure your branch is up-to-date with `main` before submitting.
2. Describe what your PR does and why in the PR description.
3. Link any related issues with `Closes #<issue-number>`.
4. Be responsive to review feedback.

---

Thank you for helping make CompassInt better! 🧭
