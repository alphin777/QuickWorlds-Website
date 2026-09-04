# QuickWorlds website deployment

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

The website performs the desktop/mobile gate before the large world download, plays the pixel-assembly entrance and an approved canonical Godot QuickTheme render once, and only then attempts to open a resizable compact window with a text-only `loading Grass Field…` progress screen. Browsers that block the delayed popup fall back to the current tab. Each launch passes an independent randomized seed to the in-world QuickFugue. Grass Field is a separate desktop-only delivery proof; it does not publish or modify the Labyrinth and does not establish gallery, multiplayer, or mobile architecture.
