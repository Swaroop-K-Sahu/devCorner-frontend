# devCorner-frontend

## Tests and coverage

Run the test suite in watch mode during development:

```bash
npm test
```

Generate a one-time coverage report:

```bash
npm run test:coverage
```

For CI, use the non-interactive command:

```bash
npm run test:coverage:ci
```

The command prints the coverage summary in the terminal and generates reports in `coverage/`, including:

- `coverage/lcov-report/index.html` — interactive HTML report. Open this file in a browser to inspect coverage by file and line.
- `coverage/lcov.info` — LCOV data for CI and coverage services.

The report is generated when the test command runs; coverage percentages are not committed here because they depend on the current test results and environment. Add `coverage/` to `.gitignore` if generated reports should not be tracked.
