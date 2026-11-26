# Contributing to Math Sprout

Thanks for your interest in improving Math Sprout! Bug fixes, accessibility improvements, translations, tests, and thoughtful feature ideas are welcome.

## Git workflow

Math Sprout uses Gitflow, with `master` as the production branch and `develop` as the integration branch. Create feature and release branches from `develop`; create hotfix branches from `master`.

### Features

```sh
git switch develop
git pull
git switch -c feature/short-description
```

Open a pull request from `feature/short-description` into `develop`. Once reviewed and the Build checks pass, merge the pull request and delete the feature branch.

### Releases

When `develop` is ready for a release, create `release/<version>` from it, for example `release/1.2.0`. Only release-preparation fixes should go into this branch. Open a pull request into `master`; after it is merged, create a version tag such as `v1.2.0` on `master`. Merge the release branch back into `develop` so any release fixes are included in future work, then delete the release branch.

### Hotfixes

Create `hotfix/<short-description>` from `master` for an urgent production fix. Open pull requests into both `master` and `develop` (and any active release branch). After merging into `master`, tag the new production version, then delete the hotfix branch.

The Build workflow checks pull requests and pushes on `master` and `develop`. GitHub Pages deploys only from `master`. Repository maintainers should protect both long-lived branches with rules that require pull requests and passing Build checks; branch protection is configured in GitHub, not in this repository.

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
