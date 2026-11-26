# Math Sprout Architecture

## Purpose and status

This document describes the architecture currently implemented in the repository. It is intended to help maintainers and coding agents understand the existing boundaries and constraints before changing the app. It is not a roadmap or a specification for features that do not exist yet.

The app is a small, client-side maths practice experience for children. It runs in the browser, has no application server or backend, and is published as a static site. The architecture favors browser-native APIs and small JavaScript modules over a framework.

## System overview

```mermaid
flowchart TD
    HTML[index.html: page structure and accessible controls]
    CSS[src/style.css: layout, themes, responsive styling]
    MAIN[src/main.js: UI orchestration and session state]
    OPS[src/exercises/operations.js: question generation and arithmetic]
    SESSION[src/practice/session.js: result and score rules]
    LEADERBOARD[src/practice/leaderboard.js: ranking and eligibility]
    RESULTS[src/ui/results.js: result filtering, summaries, rendering]
    STORAGE[src/storage.js: localStorage helpers]
    I18N[src/translations.js: English, Belgian Dutch, and German strings]
    BROWSER[Browser APIs: DOM, dialogs, timers, performance clock]
    LOCAL[Browser localStorage]
    PAGES[GitHub Pages static deployment]

    HTML --> MAIN
    HTML --> CSS
    MAIN --> OPS
    MAIN --> SESSION
    MAIN --> LEADERBOARD
    MAIN --> RESULTS
    MAIN --> STORAGE
    MAIN --> I18N
    MAIN --> BROWSER
    STORAGE --> LOCAL
    HTML -. theme bootstrap .-> LOCAL
    PAGES --> HTML
```

## Runtime and data flow

1. `index.html` supplies the semantic page structure and controls, loads `src/style.css`, and starts `src/main.js` as an ES module.
2. Before the page is styled, a small inline script reads and validates the saved theme from `localStorage`, then sets theme data attributes on the document. This avoids initially rendering with the wrong theme when a valid preference exists.
3. `main.js` reads the saved language, username, and exercise selection (including practice mode and target), applies translations, configures event handlers, and coordinates DOM updates. It owns the active practice session and its transient state.
4. When a session starts, its practice mode and target are validated alongside the selected operations. Operation settings are passed to `src/exercises/operations.js`, which generates operands and calculates the answer. Random generation defaults to `Math.random`; helpers accept an injected random function to make their behavior testable.
5. Answers and skips are recorded in in-memory session state. Exercise-count sessions stop when the target number of exercises is recorded; time-limit sessions stop when their duration expires and discard an unanswered exercise. Free-form and early-stopped sessions end manually. The elapsed time uses the browser's monotonic `performance.now()` clock. Ending a session opens a results dialog; `src/ui/results.js` filters and renders the results and computes summary times. Completed timed and exercise-count sessions with at least one recorded exercise also contribute to the device-local leaderboards. `src/practice/leaderboard.js` validates eligibility and ranks entries; `src/storage.js` persists the top 20 per mode.
6. Usernames, language, theme preferences, the exercise selection (including practice mode and target), and timed and exercise-count leaderboards are stored locally in the browser. The exercise selection is a single app-wide setting, independent of the username. Leaderboards are shared across learner identities on this browser and are not synchronized. No data is sent to a server by the app.

## Code boundaries

| Area | Responsibility |
| --- | --- |
| `index.html` | Accessible page markup, labels, controls, dialogs, and startup scripts. |
| `src/main.js` | DOM wiring, translations and theme application, settings, session lifecycle, and transient application state. |
| `src/exercises/operations.js` | Random-number helpers and the four arithmetic operation definitions, including operand generation. |
| `src/practice/session.js` | Pure helpers for score counting and converting an exercise into a result record. |
| `src/practice/leaderboard.js` | Pure helpers for leaderboard eligibility, stable ranking, and top-20 retention. |
| `src/ui/results.js` | Pure result-list selection and average calculation, plus DOM rendering of the results dialog. |
| `src/storage.js` | Small helpers for reading and writing local preferences and the exercise selection. |
| `src/translations.js` | English, Belgian Dutch, and German message dictionaries. |
| `src/style.css` | Visual system, responsive layout, and theme styling driven by document data attributes and CSS variables. |
| `*.test.js` beside source modules | Vitest tests for operation generation, session calculations, storage helpers, translations, and results helpers. |

`main.js` is the integration point: domain helpers do not own the DOM, while the entry point selects inputs, coordinates state, and renders changes. Prefer keeping arithmetic and session rules independently testable as the app grows.

## State and persistence

- **Persistent browser state:** theme color/mode (`math-sprout.theme`), language (`math-sprout.language`), optional username (`math-sprout.username`), the app-wide exercise selection, practice mode, and target (`math-sprout.exercise-selection`), and two shared local leaderboards (`math-sprout.leaderboards`).
- **Transient state:** active-session clock, current question, answers, scores, timings, open dialogs, and feedback live in memory and are lost on reload. Completed session results remain transient except for qualifying leaderboard entries.
- **No account or synchronization:** preferences are scoped to the current browser's origin and are not shared across devices.
- **Storage failures:** theme, language, username, and leaderboard changes show status feedback when storage is unavailable. Exercise settings remain usable for the current visit and fall back to the page defaults on load when saved data is unavailable or invalid. Leaderboards remain available in memory for the current visit if browser storage cannot be used.

## Build, test, and deployment

- `npm test` runs the Vitest suite.
- `npm run dev` starts the Vite development server.
- `npm run build` creates the static production site in `dist`.
- `npm run preview` serves the production build locally.
- `.github/workflows/build.yml` runs tests and a production build on pull requests and pushes to `master` and `develop`; pull requests into `master` must come from `release/*` or `hotfix/*` branches.
- `.github/workflows/deploy.yml` builds and tests the app, then deploys the static build to GitHub Pages on pushes to `master` or manual dispatch.
- The repository follows Gitflow: `master` is the production branch, `develop` is the integration branch, and feature, release, and hotfix branch conventions are documented in `CONTRIBUTING.md`.
- `.github/CODEOWNERS` assigns repository ownership to the repository owner; the active branch ruleset requires Build checks and, where this file exists on the target branch, code-owner approval on `master` and `develop`.
- `vite.config.js` uses a relative base path so the built site can be served from a GitHub Pages project path.

Because the page uses JavaScript ES modules, use the Vite development server for reliable local development rather than relying on a browser's `file://` behavior.

## Current architectural constraints

- There is no backend, API, database, authentication, or remote persistence.
- The app is a single-page experience with a single main orchestration module; it is not currently divided into a component framework or a formal state-management layer.
- The username, language, theme, and exercise selection are persisted locally. Exercise settings are not keyed by username. Changes to progress tracking, accounts, or cross-device synchronization would require an explicit data and privacy design rather than extending the current preference storage implicitly.
- The four operation types and the current settings are implemented directly in the page and operation definitions. New exercise formats may need a broader exercise model, but that is not present today.
- The app targets touch-friendly phone and tablet use and includes English, Belgian Dutch, and German UI strings. Keep labels and accessibility attributes in sync when changing controls.

## Keeping this document useful

Treat this as a reviewed description of the implementation, not as generated output. Update it when a change materially alters module boundaries, data flow, persistence, runtime dependencies, or deployment. Routine UI changes and new isolated tests do not need an architecture-document edit.

When updating it, verify statements against the code and workflows in the same change. Remove or revise obsolete descriptions instead of appending release-by-release snapshots. A periodic review can catch drift, but should result in a proposed edit for human review rather than silently rewriting this document.
