# Great Compassion Mantra · Memorization Practice

Practice page: **https://quickworlds.com/greatcompassion/**

## Temporary home

This is a separate personal side project for memorizing the Great Compassion Mantra. It is temporarily hosted inside the QuickWorlds website because we currently have only one website available for hosting. Its purpose and maintenance are independent of the QuickWorlds game.

Keep this directory self-contained so it can move to a dedicated site later. Relative asset paths allow the complete directory to be hosted under another path or domain. When relocating it, update the links in this repository and leave a redirect at `/greatcompassion/` so saved practice links continue to work.

## Practice and source material

The visible spelling and numbering follow the supplied 87-line chant card. The audio comes from [Chu Dai Bi Slow by compassheart on SoundCloud](https://soundcloud.com/compassheart/chu-dai-bi-slow); the page keeps a link to that original recording. The recording contains two complete recitations, with timing data for each one.

Play the full recording to follow the highlights, select a line number to practice a line, or select a word to hear that part of the recording. Repeat adds a pause for recall. Slower playback at 0.8× and 0.65× preserves vocal pitch, and Hide words supports memorization.

Word timings are automatically aligned. Chanting naturally joins sounds, so a word clip can include part of a neighboring sound. Use the full line as the listening reference when a boundary is unclear.

## Files and maintenance

- `index.html` and `style.css`: the practice page and layout.
- `app.js`: playback, selection, synchronized highlights, and recall controls.
- `mantra.js`: the 87 numbered lines, preserving the reference card's spelling.
- `timings.json`: two sets of 87 line intervals and 415 word intervals per recitation.
- `recording.mp3`: the original-speed recording.
- `recording-080.mp3` and `recording-065.mp3`: pitch-preserving slower versions, mapped to the same timing data.

The app uses static files and needs no build step, account, microphone, analytics, or browser storage. Serve the repository root with a basic HTTP server and open `/greatcompassion/` to preview it. Changes committed to this website repository's `main` branch are published by the existing GitHub Pages workflow.

The initial package was copied from the accepted practice source at commit `e18cfb243d22d10a5eecae4129fd179afd8c2f28`. Its 174 line intervals and 830 word intervals were checked, and the original app's playback and responsive layout were exercised in the browser before publication. After updates, verify the Pages deployment and the served page, timing data, and all three audio files. Changes to timing or playback should also be checked by listening to the affected passages.
