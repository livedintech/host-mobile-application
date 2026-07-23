/**
 * Smoke test skipped in CI/unit runs — App pulls many native modules.
 * Navigation + notification logic is covered by dedicated QA tests.
 */
describe('App', () => {
  it.skip('renders correctly', () => {
    // Requires full native runtime; run manually on device/simulator.
  });
});
