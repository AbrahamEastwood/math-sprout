# Contributing to Math Sprout

Thanks for your interest in improving Math Sprout! Bug fixes, accessibility improvements, translations, tests, and thoughtful feature ideas are welcome.

## Get started

1. Fork the repository and clone your fork.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Run the tests with `npm test` and verify a production build with `npm run build`.

## Before opening a pull request

- For larger changes, open an issue first so the approach can be discussed.
- Keep changes focused and include tests for changed behavior where appropriate.
- Check that `npm test` and `npm run build` both pass.
- Describe what changed and how you verified it in the pull request.
- Update `docs/architecture.md` when a change materially affects the app’s structure, data flow, persistence, runtime dependencies, or deployment.

The app is a client-side static site with no backend. See [docs/architecture.md](docs/architecture.md) for its current structure and boundaries.
