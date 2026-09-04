# QuickWorlds website

This is the canonical public source for the lightweight placeholder at `quickworlds.com`.

The site deliberately preserves an early-internet / late-1990s visual language. It uses plain HTML and CSS, an original labyrinth illustration, and a system globe emoji. There is no build step, JavaScript, framework, bundled font, analytics, cookie, or tracker.

## Files

- `index.html` — accessible page content and structure
- `styles.css` — compact early-web styling and narrow-screen adaptation
- `assets/labyrinth.png` — original transparent labyrinth illustration made for QuickWorlds
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment
- `DEPLOYMENT.md` — domain, DNS, and future hosting notes
- `staging/grass-field/` — non-indexed Hosted Grass Field tuning launcher; not linked by the public page
- `worlds/grass-field/` — generated Godot Web export used only by the staging launcher until human approval

## Preview locally

Serve the repository root with any basic static web server and open the printed local address. No dependencies need to be installed.

For the gated Hosted Grass Field proof, open `/staging/grass-field/`. It performs the desktop/mobile check before requesting the large world files. The root page remains the unchanged public `[ enter later ]` experience.

## Publish an update

Commit and push to `main`. The Pages workflow publishes the repository root automatically. Verify the workflow, the canonical HTTPS URL, and the layout at desktop and phone widths.

Do not merge the Hosted Grass Field staging branch into `main` until Michael has completed the in-Godot tuning pass and explicitly approves publication.
