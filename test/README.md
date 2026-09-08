# Reusable device testing

Current audio trial: `builds/20260908-audio-sample/?offline=1&audio_samples=1`. Keep Reverb and QuickFugue off for the wind comparison. Set `audio_samples=0` on the same build for the previous streamed path. Native audio tests and local browser startup/backend-switch checks passed; laptop listening acceptance remains open. The prior candidate remains available. No production snapshot files changed.

Stable entry: https://quickworlds.com/test/

The test URL automatically plays the existing website intro and continues to the candidate loading screen, without an entry page. Browsers may suppress intro audio until the first user interaction; automatic visual launch still proceeds. No production intro code is forked or changed.

Michael authorized this separate public, unlinked single-player test channel on September 8, 2026. It does not replace `worlds/grass-field/` or add a homepage link. HTTPS uses the existing GitHub Pages domain. This is public by URL, not access-controlled; the landing page asks search engines not to index it.

Current candidate: `builds/20260908-adaptive-quality/`, the previously validated and audited Desktop adaptive-quality release. PCK SHA256: `78ce9e29717a943639410fbfbb21d1fdd4084559bfbc6d23633fc55c4f5c0b78`. The build includes saved Desktop authorship, which may differ from committed source. Source framework: `a42bae521adef9d5dee6407904b377e48ffbaee3`.

To update after explicit testing-publication authorization:

1. Export to a fresh isolated directory using QuickWorlds' existing hosted exporter and retain the passing audit outside this website.
2. Validate the candidate locally in a browser.
3. Copy only audited delivery files into a new uniquely named `test/builds/` directory. Never copy certificates, audit reports, logs, or project source.
4. Update the candidate label and relative launch link in `test/index.html`, retaining `?offline=1`. Unique build paths prevent old cached engine or world files mixing with a new candidate.
5. Commit only the test channel changes, push normally, and verify the deployed page and candidate bytes. Keep the stable `/test/` link when inviting testers.

No backend or multiplayer service is provisioned. Devices need internet access, a compatible WebGL2 browser, and keyboard/mouse controls; the Mac Studio need not stay running. Managed network/browser policies can still block games or WebGL independently of HTTPS.
