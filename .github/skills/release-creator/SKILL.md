---
name: release-creator
description: Prepare or create a consistent Math Sprout GitHub release. Use when asked to review changes since the last release, choose a release version, write release notes, or publish a release.
---

# Math Sprout release creator

Create user-focused release notes from the changes actually included in a release. Do not treat a commit log, roadmap, or issue list as a release changelog.

## Workflow

1. Identify the repository, target branch, and requested version. Check the latest published release and tag; stop to clarify if the target or intended version is ambiguous. Never reuse an existing tag or create a duplicate release.
2. Compare the previous release tag with the exact target commit. Review the commits and merged pull requests in that range. Read relevant issues and PR descriptions, and use GitHub-generated notes as a completeness cross-check, not as the final copy.
3. Keep only notable user-visible changes. Summarize them in plain language, group related changes, and omit internal or documentation-only work unless it matters to users. Do not copy raw commit subjects.
4. Verify issue references against merged PRs or other evidence that the change is included in the release. List an issue under **Issues addressed** only if it is resolved by a change in this release; do not infer that an issue is fixed just because it is closed. Include every verified addressed issue and link it using `#number`.
5. Follow Semantic Versioning when recommending a version: patch for backward-compatible fixes, minor for backward-compatible functionality, and major for incompatible changes. Explain uncertainty and ask before publishing if the version or compatibility impact is unclear.
6. Draft the title and Markdown notes using the formats below. Omit empty sections, avoid duplicating the overview in bullets, and keep the description concise.
7. If the user asked only for a draft, return the proposed title and notes without publishing. If the user explicitly asked to create or publish the release, confirm the tag does not exist and publish against the verified target commit. Do not create milestones, change issue assignments, or upload assets unless requested.
8. After publishing, verify the release title, tag, target, and description, then provide the release link.

## Title format

`Math Sprout vX.Y.Z — <short user-facing summary>`

Keep the summary brief. For a first or unusually broad release, `Math Sprout vX.Y.Z` without a subtitle is acceptable.

## Markdown description template

Use only sections that have entries. Keep the overview to one or two sentences.

```markdown
<Brief overview of the release and its main user benefit.>

### Added

- <New user-facing capability>

### Improved

- <Meaningful improvement to an existing capability>

### Fixed

- <User-visible bug fix>

### Breaking changes

- <Incompatible change and any required action>

### Issues addressed

- [#123](https://github.com/AbrahamEastwood/math-sprout/issues/123) — <short description>
```

The **Issues addressed** section may include completed feature requests as well as bug reports. Include all verified issues resolved in the release, and omit the section when none can be verified. Do not use issue-closing keywords unless the release is intended to close an issue that is still open.

## Release checks

- Confirm the release is based on the intended previous tag and target commit.
- Check that the selected version reflects the scope and compatibility of the shipped changes.
- Ensure every bullet describes something present in the release and understandable to users.
- Verify issue links and avoid claiming unshipped, planned, or merely closed work.
- Mark a release as a prerelease only when it is explicitly intended to be unstable or not production-ready.

## References

- [GitHub: Automatically generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) — review generated notes for completeness and curate them before publication.
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — changelogs are for people, group changes by type, and omit empty sections.
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) — use version changes to communicate compatibility and scope.
