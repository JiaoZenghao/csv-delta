# Growth observations

Goal: 100 genuine GitHub stars. First evaluation window: 30 days after the verified public release.

Repository: https://github.com/JiaoZenghao/csv-delta
Demo: https://jiaozenghao.github.io/csv-delta/

## Baseline

2026-10-01 21:45 Asia/Shanghai: 0 stars observed in the repository UI. Visitor and clone data are unavailable, not zero.

2026-10-01 21:48 Asia/Shanghai: [v0.1.0 published](https://github.com/JiaoZenghao/csv-delta/releases/tag/v0.1.0), targeting commit 2af71f9. Public demo verified with the built-in example (1 added / 1 removed / 2 changed / 2 unchanged).

[Test workflow passed](https://github.com/JiaoZenghao/csv-delta/actions/runs/36870730117). [Pages build and deployment passed](https://github.com/JiaoZenghao/csv-delta/actions/runs/36870730203) after enabling GitHub Actions as the Pages source.

Positioning: a free, local-first CSV comparison utility with composite keys and shareable offline reports. GitHub topics, bilingual README, screenshot, example and issue templates are published. Launch drafts are in docs/launch.md; no community messages have been sent. Next priority is evidence from first users and visibility, rather than adding speculative features.

## Observation rules

Record date, star count, available visitor/clone data, reproducible issues and actions taken. Missing traffic permissions mean unavailable. Do not present missing data as zero or small-sample correlations as causal results.

At day 3, confirm CI, demo and onboarding. Then observe weekly and evaluate the direction at day 30. Stay quiet when nothing actionable changes; notify on meaningful progress, failure, completion or needed user action.

- Reproducible issues: fix with regression tests before new features.
- Visits with little interest: improve README positioning and the example.
- Low visibility: improve relevant GitHub topics and prepare targeted launch materials; do not auto-message communities.
- Confusing comparison results: clarify rules and fix behavior if incorrect.
- 100 stars reached: record the outcome and stop growth monitoring.

Active thread heartbeat: `csv-delta-100-star`. Every Sunday at 10:00 Asia/Shanghai, first follow-up 2026-10-04 (day 3); evaluate the approximately 30-day window at the first run after 2026-10-31. Local follow-ups depend on the Codex scheduler and available GitHub access. The 100-star goal remains incomplete.

## 2026-10-03 follow-up

Public GitHub REST API observation: 0 stars, 0 forks, 0 open issues (includes pull requests). No increase from the release baseline. Traffic/unique visitors remain unavailable; zero stars alone cannot distinguish low visibility from low conversion.

Latest main commit c81adc8: [tests passed](https://github.com/JiaoZenghao/csv-delta/actions/runs/36871626043) and [Pages deployment passed](https://github.com/JiaoZenghao/csv-delta/actions/runs/36871626052). Demo HTTP fetch succeeded. This check did not repeat interactive browser validation.

Recommended next experiment: targeted distribution of the existing launch material, with a concrete before/after example and direct demo link. Prioritize developers comparing migration/export snapshots and operations users comparing price tables. Prepare or publish only where user authorization and community rules allow. Track available unique repository visitors, stars and actual feedback for seven days; unknown traffic remains unknown. Improve positioning toward explicit composite-key comparison and add a compact visual example before speculative feature expansion. No community posts were sent during this follow-up.

## Analytics activation — 2026-10-03

User-owned dashboard: https://jiaozenghao.goatcounter.com/ (private; authenticated access required). Demo visit estimates are active. [Deployment succeeded](https://github.com/JiaoZenghao/csv-delta/actions/runs/37123617618), and dashboard showed /csv-delta with 1 visit after real-browser verification on 2026-10-03. This initial verification traffic is not organic acquisition. Dashboard remains private; eight-hour sessions are enabled. Account email verification is still requested by the service. Include this dashboard in weekly follow-ups when access is available; otherwise record unavailable, never zero. Initial verification visits are test traffic and do not represent acquired users.

## 2026-10-07 distribution experiment

Baseline before distribution: GitHub public REST API reported 0 stars. Topics already include csv, csv-diff, data-comparison, developer-tools, javascript, local-first and offline; no topic changes needed.

GoatCounter authenticated dashboard is accessible again. Date range 2026-09-30 through 2026-10-07, timezone Asia/Singapore (UTC+8): 3 visits shown for /csv-delta. These estimates may include maintainer/verification traffic; organic visits and confirmed trials remain unknown. This baseline was read before today's demo check. Email verification is still requested.

User authorized the proposed distribution experiment. Reddit accepted the submission and assigned https://www.reddit.com/r/SideProject/comments/1wzmklh/i_built_a_local_csv_diff_for_price_tables_match/ . The detail page then displayed “Sorry, this post was removed by Reddit’s filters.” Treat this as filtered, not successful public distribution. No repeated submission or filter bypass attempted. Moderator review is the next step for this channel.

V2EX login completed by the user, but the account requires invitation activation before using site features. Chinese publication is blocked until activation; no paid activation or token purchase attempted.

Public demo verified: 1 added / 1 removed / 2 changed / 2 unchanged, including 79→74 and 89→94. Captured public screenshots are in artifacts/launch-2026-10-07. The 20-second MP4 is a screenshot walkthrough, not continuous screen recording. Report download verification timed out and is unverified in this run.

Next checkpoints: 2026-10-08 and 2026-10-10 at approximately 11:45 Asia/Shanghai, then experiment review on 2026-10-21. Record filter/review status, available visit estimates, confirmed trials, concrete feedback and stars; unknown metrics remain unknown. Target: first 10 genuine stars, an experiment goal rather than a forecast.

## Searchable tutorial experiment 2026-10-07

Implemented bilingual public tutorials at /guides/compare-csv.html and /guides/compare-csv.zh-CN.html, with three downloadable synthetic scenarios: prices, database exports and configuration updates. README links and demo footer expose the tutorial. Each scenario documents keys, ignored and numeric columns, absolute tolerance and expected results. Automated checks verify counts and actual changed fields against the comparison engine.

Tutorial pages have language alternates, canonical URLs, descriptive metadata and separate fixed-path visit estimates through the existing opt-in analytics deployment. No CSV values, query strings or fragments enter analytics. Indexing and acquired visitors are not yet established.

Validation: 50 tests passed; analytics-enabled production build passed; bilingual page rendering, language switch, scenario anchor and 390px mobile layout checked. No horizontal overflow or broken images observed in the mobile tutorial check.

Publication channel: the existing project GitHub Pages website. No new community posts were sent for this tutorial experiment. Review tutorial visits, repository traffic when accessible, concrete feedback and star change on 2026-10-21. Use visit estimates rather than person-level conversion rates.
