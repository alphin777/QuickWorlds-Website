# QuickWorlds website

This is the canonical public source for the lightweight placeholder at `quickworlds.com`.

The site deliberately preserves an early-internet / late-1990s visual language. It uses plain HTML and CSS, a small purpose-built loading script, an original labyrinth illustration, and a system globe emoji. There is no build step, framework, bundled font, analytics, cookie, or tracker.

## Files

- `index.html` — accessible page content and structure
- `styles.css` — compact early-web styling and narrow-screen adaptation
- `assets/labyrinth.png` — original transparent labyrinth illustration made for QuickWorlds
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment
- `DEPLOYMENT.md` — domain, DNS, and future hosting notes
- `staging/grass-field/` — non-indexed Hosted Grass Field diagnostic launcher
- `worlds/grass-field/` — generated non-threaded Godot Web export
- `assets/audio/quicktheme/` — approved WAV renders from the canonical Godot QuickTheme generator

## Preview locally

Serve the repository root with any basic static web server and open the printed local address. No dependencies need to be installed.

The public labyrinth picture launches the desktop-only Grass Field proof. It performs the mobile/touch-class check before requesting the large world files, plays one website pixel-assembly entrance with an approved generated QuickTheme, then opens Grass Field with a quiet text-only game loader. The separate `[ enter later ]` behavior remains available.

## Publish an update

Commit and push to `main`. The Pages workflow publishes the repository root automatically. Verify the workflow, the canonical HTTPS URL, and the layout at desktop and phone widths.

Michael completed the in-Godot tuning pass and explicitly approved publication on September 4, 2026. Each launch gives QuickFugue an independent randomized visit seed.
