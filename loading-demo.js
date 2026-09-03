(() => {
  "use strict";

  const DURATION_SECONDS = 8;
  const enterLink = document.querySelector("[data-quickworlds-loading]");
  const overlay = document.querySelector("[data-loading-overlay]");
  const canvas = document.querySelector("[data-loading-logo]");

  if (!enterLink || !overlay || !canvas) {
    return;
  }

  const context2d = canvas.getContext("2d", { alpha: true });
  const logo = new Image();
  logo.decoding = "async";
  logo.src = "assets/quickworlds-logo-horizontal.png";

  let active = false;
  let animationFrame = 0;
  let finishTimer = 0;
  let audioContext = null;

  const randomUnit = () => {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] / 4294967296;
  };

  const shuffle = (items) => {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(randomUnit() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  };

  const scheduleSine = (audio, destination, frequency, start, duration, peak) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const attack = Math.min(0.12, duration * 0.22);
    const release = Math.min(0.55, duration * 0.42);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.detune.setValueAtTime((randomUnit() - 0.5) * 3.5, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.setValueAtTime(peak, Math.max(start + attack, start + duration - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  };

  const playQuickTheme = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }

    const audio = new AudioContext();
    const now = audio.currentTime + 0.025;
    const master = audio.createGain();
    const room = audio.createDelay(1);
    const roomGain = audio.createGain();
    const e2 = 82.4069;
    const scale = [1, 9 / 8, 81 / 64, 4 / 3, 3 / 2, 27 / 16, 243 / 128, 2];

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.72, now + 0.18);
    master.gain.setValueAtTime(0.72, now + 7.15);
    master.gain.exponentialRampToValueAtTime(0.0001, now + DURATION_SECONDS);
    master.connect(audio.destination);

    room.delayTime.setValueAtTime(0.24 + randomUnit() * 0.08, now);
    roomGain.gain.setValueAtTime(0.16, now);
    room.connect(roomGain);
    roomGain.connect(master);

    const dryAndRoom = audio.createGain();
    dryAndRoom.gain.setValueAtTime(1, now);
    dryAndRoom.connect(master);
    dryAndRoom.connect(room);

    scheduleSine(audio, dryAndRoom, e2, now, 7.95, 0.036);
    scheduleSine(audio, dryAndRoom, e2 * 1.5, now + 0.04, 7.82, 0.024);

    const arrivals = randomUnit() < 0.5 ? [0, 2, 4, 7] : [0, 1, 2, 4, 7];
    const arrivalStep = 0.38 + randomUnit() * 0.08;
    arrivals.forEach((degree, index) => {
      const start = now + 0.34 + index * arrivalStep;
      scheduleSine(audio, dryAndRoom, e2 * 2 * scale[degree], start, 0.72, 0.052);
    });

    const patterns = [
      [0, 2, 4, 7, 4, 2],
      [0, 4, 2, 7, 4, 2],
      [0, 2, 4, 5, 7, 4],
      [0, 1, 4, 2, 5, 7],
    ];
    const pattern = patterns[Math.floor(randomUnit() * patterns.length)];
    const arpStep = 0.31 + randomUnit() * 0.055;
    const arpStart = now + 2.05 + randomUnit() * 0.18;

    for (let index = 0; index < 14; index += 1) {
      const degree = pattern[index % pattern.length];
      const octave = index > 7 && randomUnit() > 0.42 ? 4 : 2;
      const bloom = 0.025 + Math.sin((index / 13) * Math.PI) * 0.014;
      scheduleSine(
        audio,
        dryAndRoom,
        e2 * octave * scale[degree],
        arpStart + index * arpStep,
        0.48 + randomUnit() * 0.18,
        bloom,
      );
    }

    const reflectionDegrees = shuffle([2, 4, 5, 7]).slice(0, 3);
    reflectionDegrees.forEach((degree, index) => {
      scheduleSine(
        audio,
        dryAndRoom,
        e2 * 8 * scale[degree],
        now + 4.15 + index * (0.72 + randomUnit() * 0.16),
        0.82,
        0.0085,
      );
    });

    audio.resume().catch(() => {});
    return audio;
  };

  const makeTiles = () => {
    const columns = 38;
    const rows = 17;
    const tiles = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        tiles.push({
          column,
          row,
          order: randomUnit(),
          offsetX: (randomUnit() - 0.5) * 78,
          offsetY: (randomUnit() - 0.5) * 58,
          duration: 0.38 + randomUnit() * 0.66,
        });
      }
    }

    return tiles;
  };

  const smoothstep = (value) => {
    const bounded = Math.max(0, Math.min(1, value));
    return bounded * bounded * (3 - 2 * bounded);
  };

  const drawLogoSequence = async (startedAt) => {
    try {
      if (!logo.complete) {
        await logo.decode();
      }
    } catch (_error) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = makeTiles();
    const columns = 38;
    const rows = 17;
    const sourceWidth = logo.naturalWidth / columns;
    const sourceHeight = logo.naturalHeight / rows;
    const destinationWidth = canvas.width / columns;
    const destinationHeight = canvas.height / rows;

    context2d.imageSmoothingEnabled = false;

    const draw = (timestamp) => {
      const elapsed = (timestamp - startedAt) / 1000;
      const exitFade = smoothstep((elapsed - 7.15) / 0.85);
      context2d.clearRect(0, 0, canvas.width, canvas.height);

      if (reducedMotion) {
        context2d.globalAlpha = 1 - exitFade;
        context2d.drawImage(logo, 0, 0, canvas.width, canvas.height);
      } else {
        tiles.forEach((tile) => {
          const onset = 0.12 + tile.order * 4.85;
          const progress = smoothstep((elapsed - onset) / tile.duration);
          if (progress <= 0) {
            return;
          }

          const sourceX = tile.column * sourceWidth;
          const sourceY = tile.row * sourceHeight;
          const destinationX = tile.column * destinationWidth + tile.offsetX * (1 - progress);
          const destinationY = tile.row * destinationHeight + tile.offsetY * (1 - progress);
          const scale = 0.56 + progress * 0.44;
          const width = destinationWidth * scale + 1;
          const height = destinationHeight * scale + 1;
          const centeredX = destinationX + (destinationWidth - width) / 2;
          const centeredY = destinationY + (destinationHeight - height) / 2;

          context2d.globalAlpha = Math.min(1, progress * 1.18) * (1 - exitFade);
          context2d.drawImage(
            logo,
            sourceX,
            sourceY,
            sourceWidth + 0.5,
            sourceHeight + 0.5,
            centeredX,
            centeredY,
            width,
            height,
          );
        });
      }

      context2d.globalAlpha = 1;
      if (elapsed < DURATION_SECONDS && active) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    animationFrame = requestAnimationFrame(draw);
  };

  const finishSequence = () => {
    cancelAnimationFrame(animationFrame);
    clearTimeout(finishTimer);
    context2d.clearRect(0, 0, canvas.width, canvas.height);
    overlay.hidden = true;
    document.body.classList.remove("loading-active");
    document.querySelector("main")?.removeAttribute("aria-hidden");
    active = false;

    if (audioContext && audioContext.state !== "closed") {
      audioContext.close().catch(() => {});
    }
    audioContext = null;
    enterLink.focus({ preventScroll: true });
  };

  enterLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (active) {
      return;
    }

    active = true;
    overlay.hidden = false;
    document.body.classList.add("loading-active");
    document.querySelector("main")?.setAttribute("aria-hidden", "true");

    audioContext = playQuickTheme();
    const startedAt = performance.now();
    drawLogoSequence(startedAt);
    finishTimer = window.setTimeout(finishSequence, DURATION_SECONDS * 1000 + 80);
  });
})();
