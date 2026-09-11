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
- `greatcompassion/` — self-contained Great Compassion Mantra memorization practice side project

## Temporary side-project hosting

[Great Compassion Mantra · Memorization Practice](https://quickworlds.com/greatcompassion/) is a separate personal side project, temporarily hosted here because QuickWorlds is currently the only website we have available for hosting. The practice tool has its own purpose and maintenance scope, separate from the QuickWorlds game.

Its page, chant text, timing data, and audio live together in `greatcompassion/` so the tool can move to dedicated hosting later. See [the practice tool's README](greatcompassion/README.md) for attribution, maintenance, and migration notes.

## Preview locally

Serve the repository root with any basic static web server and open the printed local address. No dependencies need to be installed.

The public labyrinth picture launches the desktop-only Grass Field proof. It performs the mobile/touch-class check before requesting the large world files, plays one website pixel-assembly entrance with an approved generated QuickTheme, then continues into Grass Field in the same browser tab. The game uses a quiet text-only loader. On exit, the same tab holds `QUICKWORLDS COMING SOON` before returning without replaying the animation. `[ enter later ]` remains as inert placeholder text and triggers nothing.

## Publish an update

Commit and push to `main`. The Pages workflow publishes the repository root automatically. Verify the workflow, the canonical HTTPS URL, and the layout at desktop and phone widths.

Michael completed the in-Godot tuning pass and explicitly approved publication on September 4, 2026. Each launch gives QuickFugue an independent randomized visit seed.
