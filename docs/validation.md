# v0.1.0 validation

2026-10-01, Node.js 24.15.0 on macOS.

- 44 automated tests passed, covering parsing, key matching, tolerance, schema changes, report escaping and per-side display fields.
- Static build passed; explicit public-file allowlist excludes Git metadata, internal plans and local scratch.
- In-app browser: one-click demo produced 1 added / 1 removed / 2 changed / 2 unchanged; selected real files; checked filters, rule invalidation, numeric tolerance and both languages.
- 205 modified records paginated 100 / 100 / 5.
- Malicious HTML stayed text, with no injected script/image elements.
- Duplicate keys, unclosed quotes, invalid UTF-8, over-10-MiB files and over-50,000-row inputs produced errors.
- 390px viewport had document scrollWidth equal to clientWidth, with a horizontally scrollable result table.
- Google Chrome: downloaded HTML report and opened it directly through file://. It contained six result rows (including unchanged rows), original values and comparison settings. Report source has no script or external-resource dependencies.
- Independent read-only branch review found a schema-only old-field rendering bug. Fixed with a failing regression test, then the full suite and browser reproduction passed.

Known minor limitation: after skipped blank lines, parser errors can use inconsistent record numbering. This affects locating invalid input, not valid-file comparison results.

Live CI, GitHub Pages and release status are verified separately at publication time.
