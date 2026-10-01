# Contributing

Small fixes and reproducible bug reports are welcome. For new features, explain the CSV workflow first so we can keep the tool focused.

1. Use Node.js 22+ and run `npm test`.
2. Add a regression test before changing parsing, comparison or report behavior.
3. Run `npm start` and verify your change in a browser. Test both languages and a narrow viewport for UI changes.
4. Run `npm run build` and check that `dist/` contains only public site assets.
5. Open a pull request with the problem, change and validation.

Keep runtime dependencies at zero. Treat imported CSV values as untrusted text. Do not insert them with `innerHTML`. Reports must remain self-contained and must escape all input values.

Never upload credentials, customer exports or other private data into a public issue. A minimal synthetic CSV example is usually enough.
