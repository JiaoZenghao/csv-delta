# Visit analytics

Site configured: https://jiaozenghao.goatcounter.com on 2026-10-03. Deployment passed and dashboard confirmed /csv-delta with 1 visit from verification traffic. Collection is active; the initial count is not organic acquisition. Historical visits cannot be recovered.

1. Create a free site at https://www.goatcounter.com/signup and complete account/terms confirmation yourself.
2. In GitHub repository Settings → Secrets and variables → Actions → Variables, optionally set `GOATCOUNTER_SITE` to override the configured site origin, e.g. `https://your-code.goatcounter.com`. This is a public site identifier, not an API key.
3. Run the Deploy demo workflow when changing the site. Verify a real demo visit appears in the GoatCounter dashboard before marking collection active. Keep the dashboard private; no public visitor counter is required.

Only the canonical HTTPS Pages demo counts. Localhost, file reports and unconfigured builds make no analytics requests. The integration uses a project-owned script and GoatCounter's documented image endpoint; no third-party script can read the CSV workspace. Only fixed path/title, origin-only referrer and a cache buster are sent. Queries, fragments, file names and comparison state are excluded. Network requests necessarily expose IP and User-Agent to GoatCounter. DNT and Global Privacy Control opt out. CSP allows only the configured site's /count image endpoint; connect-src remains none.

GoatCounter normally counts repeat visits to a path once per eight-hour session. These are visit estimates, not exact people or globally unique users. Browser blockers, opt-outs, bots and shared networks affect counts. Record the dashboard's exact metric/date range; do not call it raw pageviews or calculate person-level conversion from it. Referring website origins are approximate and may be absent.

Weekly follow-up: record available visits, sources and Star change in docs/growth.md; distinguish repository visitors (GitHub traffic) from demo visits. Missing access is unavailable, never zero. Preserve start date and exclude development/verification visits when interpreting early small samples.

Official references: https://www.goatcounter.com/help/pixel and https://www.goatcounter.com/help/sessions
