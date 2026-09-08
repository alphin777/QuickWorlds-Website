# QuickWorlds website deployment

## September 8 moon settings follow-up

Michael saved and approved updated Desktop settings: moon brightness 1.42, diameter 5 degrees. The fresh audited threaded export lives at `worlds/grass-field/releases/20260908-moon/`; packed-scene inspection confirmed both values. NASA texture, threaded audio and reverb support are retained. The test channel remains independent. PCK: 32,985,708 bytes; total: 72,269,200 bytes; 284 packed resources; publication package audit passed. Source scene authorship was exported without staging unrelated Desktop edits.

## September 8, 2026 — approved threaded audio and adaptive quality

Michael accepted the threaded candidate on his Chrome work laptop and explicitly authorized public promotion, deferring broader device checks. The exact accepted test package is copied to `worlds/grass-field/releases/20260908-threaded/`. The homepage's existing intro targets that versioned directory; the permanent world index redirects there while preserving visit/return parameters. This keeps engine files isolated from older caches. The existing public look and intro are retained; the new world includes adaptive quality and the saved Desktop candidate authorship.

`https://quickworlds.com/test/` remains the reusable unlinked public test entry, automatically playing the intro. Future test updates do not change the production copy. No multiplayer backend exists. Threaded Stream audio retains environmental sounds, QuickFugue and reverb via Godot PWA isolation on HTTPS. First visit can reload once. The unsuccessful dry Sample experiment is superseded. Safari and broader device/listening checks remain open.

Future full-audio candidates use `QUICKWORLDS_THREADED_TEST=1` with the canonical hosted exporter. Retain package audits outside this website and obtain explicit authorization before public promotion. Canonical detailed record: QuickWorlds `docs/ADAPTIVE_QUALITY_RELEASE_20260908.md`.

## Intended live configuration

- Source: `https://github.com/alphin777/QuickWorlds-Website`
- Static host: GitHub Pages
- Canonical URL: `https://quickworlds.com/`
- Alternate: `https://www.quickworlds.com/` redirects to the canonical apex URL
- Deployment: `.github/workflows/pages.yml` on every push to `main`

GitHub Pages hosts only the public website and future static Godot Web client files. It does not run the authoritative WebSocket service required for a shared room.

## DNS inventory inspected on August 29, 2026

Registrar and authoritative DNS are at Porkbun. Before the Pages cutover, the zone contained:

- apex `ALIAS` → `uixie.porkbun.com`
- wildcard `CNAME` → `uixie.porkbun.com`
- apex `MX` → `fwd1.porkbun.com`, priority 10
- apex `MX` → `fwd2.porkbun.com`, priority 20
- apex `TXT` → `v=spf1 include:_spf.porkbun.com ~all`
- two `_acme-challenge` `TXT` records

The MX, SPF, wildcard, and certificate-validation records are unrelated to the web cutover and must not be removed by a bulk replacement.

## GitHub Pages setup

1. Keep the repository public and enable Pages with GitHub Actions as its publishing source.
2. Verify the temporary project URL before changing DNS.
3. In Pages settings, set the custom domain to `quickworlds.com`.
4. At Porkbun, point only the apex web record to `alphin777.github.io` and add an explicit `www` CNAME to `alphin777.github.io`.
5. Preserve the existing wildcard, mail, SPF, and `_acme-challenge` records.
6. Wait for GitHub's DNS check and certificate issuance, then enable HTTPS enforcement.
7. Verify both hostnames and the canonical redirect.

DNS changes require a fresh inspection and Michael's explicit confirmation immediately before the edit.

## Future playable rooms

- A bounded single-player Godot Web export can be deployed as static files at a path or play subdomain.
- A shared-link room also needs a separate TLS-secured authoritative service, for example at `wss://rooms.quickworlds.com`.
- Start with short-lived links and a small capacity. Do not expose the current local development server as production infrastructure.
- If the site grows beyond GitHub Pages' static-project boundary, move hosting behind the same stable domain rather than changing the public QuickWorlds address.

## Hosted Grass Field v0

Michael completed the tuning pass and explicitly approved publication on September 4, 2026. The public labyrinth picture is the only Grass Field launch surface; `[ enter later ]` remains visible as inert placeholder text. The generated non-threaded Godot export lives at `worlds/grass-field/`, with `staging/grass-field/` retained as a diagnostic launcher.

The website performs the desktop/mobile gate before the large world download, plays the pixel-assembly entrance and an approved canonical Godot QuickTheme render once, and then continues in the same tab with a text-only `loading Grass Field…` progress screen. Each launch passes an independent randomized seed to the in-world QuickFugue. On exit, the same tab holds `QUICKWORLDS COMING SOON` for four and a half seconds, then returns without another animation. Grass Field is a separate desktop-only delivery proof; it does not publish or modify the Labyrinth and does not establish gallery, multiplayer, or mobile architecture.

## September 5 terrain composition publication

Michael approved publishing his current authored scene after the local Terrain Composition v1 audition. Source: QuickWorlds commit `3d1de8f9e90b88c7a28ecdd2704cbd1bea471026`. Build token: `20260905-terrain-1`.

This export includes three authored mounds, one ridge, terrain-conforming grass and distant coverage, and the current ten-minute cycle with 10% night duration. The placeholder page layout and same-tab launch remain unchanged. The local Web build reached its ready marker without browser errors; the authored terrain recipe replay passed. The separate Labyrinth and unrelated local project edits are excluded.

Export PCK SHA-256: `6e883fb9eb7f31073130bb40ba86d9e077f699e320824b01e8bb666bd4cbf7b2`.

## Cycling stars update — September 5, 2026

Published with Michael's explicit approval. Source implementation `a55632c10d441330e2d1d5762b04272c1b6eb434`; shell cache token `20260905-stars-1`. Stars rotate with the authored sky clock and night duration. The existing authored scene, launcher and site layout are preserved. Native sky render, clock/recipe and editor checks passed, including `QW_STAR_CYCLE_OK`.

## Moon and slower stars publication — September 5, 2026

Approved publication of the moon/star updates only, retaining the original 15:00 start, ten-minute cycle and 10% night duration. Moon settings: enabled, diameter 5.11 degrees, brightness 1.23, authored near-white tint, random initial phase, advance each moonrise, five-moonrise phase cycle. Stars move at half the Moon's speed; the Moon fades later at dawn. Uses the GPU-compressed NASA texture with source credit retained in the QuickWorlds repo.

All scene content outside SkyAndTime matches the existing published source, including terrain, clouds, grass and audio settings. Cache token: `20260905-moon-1`. Export and local browser startup passed without browser errors at a measured 60 FPS startup average.

Final publication uses the concurrently landed scoped export hardening, merged without history rewriting. Source commit: `62302ac`. `QW_PUBLICATION_PACKAGE_AUDIT_OK`: PCK 9,340,788 bytes, total delivery 49,189,776 bytes, 238 packed resources. The dependency list includes the compressed moon texture. The audit report stays outside the website.
