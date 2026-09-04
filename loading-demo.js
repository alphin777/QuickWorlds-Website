(() => {
  "use strict";

  const DURATION_SECONDS = 8;
  const CANONICAL_QUICK_THEME_SEEDS = [545, 656, 707, 818, 1040];
  const enterLinks = Array.from(document.querySelectorAll("[data-quickworlds-loading]"));
  const overlay = document.querySelector("[data-loading-overlay]");
  const canvas = document.querySelector("[data-loading-logo]");
  const mobileMessage = document.querySelector("[data-mobile-world-message]");
  const scriptUrl = document.currentScript?.src || window.location.href;

  if (!enterLinks.length || !overlay || !canvas) {
    return;
  }

  const context2d = canvas.getContext("2d", { alpha: true });
  const logo = new Image();
  logo.decoding = "async";
  logo.src = new URL("assets/quickworlds-logo-horizontal.png", scriptUrl).href;

  let active = false;
  let animationFrame = 0;
  let finishTimer = 0;
  let audioContext = null;
  let audioElement = null;
  let audioUrl = "";
  let visitSeed = 0;
  let quickThemeSeed = 0;
  let randomState = 0;
  let pendingWorldWindow = null;
  let enterLink = enterLinks[0];
  let worldUrl = "";
  let returnUrl = "";

  const secureRandomUnit = () => {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] / 4294967296;
  };

  const randomUnit = () => {
    if (!randomState) {
      return secureRandomUnit();
    }
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  };

  const isMobileDeviceClass = () => {
    if (navigator.userAgentData && navigator.userAgentData.mobile) {
      return true;
    }
    const userAgent = navigator.userAgent || "";
    if (/Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(userAgent)) {
      return true;
    }
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hoverUnavailable = window.matchMedia("(hover: none)").matches;
    return navigator.maxTouchPoints > 1 && coarsePointer && hoverUnavailable;
  };

  const launchWorld = () => {
    if (!worldUrl) {
      return;
    }
    const destination = new URL(worldUrl, window.location.href);
    destination.searchParams.set("offline", "1");
    destination.searchParams.set("seed", String(visitSeed));
    if (returnUrl) {
      destination.searchParams.set("return", new URL(returnUrl, window.location.href).href);
    }
    pendingWorldWindow = window.open(
      destination.href,
      "quickworlds-grass-field",
      "popup=yes,width=754,height=419,resizable=yes,scrollbars=no",
    );
    if (pendingWorldWindow) {
      pendingWorldWindow.focus();
      return;
    }
    window.location.assign(destination.href);
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

  const playOriginalQuickTheme = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return false;
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

    audioContext = audio;
    overlay.dataset.audioState = audio.state;
    audio.addEventListener("statechange", () => {
      overlay.dataset.audioState = audio.state;
    });
    audio.resume().catch(() => {});
    return true;
  };

  const playCanonicalQuickTheme = () => {
    const themeUrl = new URL(
      `assets/audio/quicktheme/quicktheme-${quickThemeSeed}.wav`,
      scriptUrl,
    );
    audioElement = new Audio(themeUrl.href);
    audioElement.preload = "auto";
    audioElement.volume = 0.92;
    audioElement.setAttribute("playsinline", "");
    overlay.dataset.audioState = "prepared";
    audioElement.addEventListener("playing", () => {
      overlay.dataset.audioState = "playing";
    }, { once: true });
    audioElement.addEventListener("ended", () => {
      overlay.dataset.audioState = "ended";
    }, { once: true });
    const playback = audioElement.play();
    if (playback) {
      playback.catch(() => {
        overlay.dataset.audioState = "blocked";
      });
    }
  };

  const writeAscii = (view, offset, text) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  const renderQuickTheme = () => {
    const sampleRate = 24000;
    const sampleCount = sampleRate * DURATION_SECONDS;
    const samples = new Float32Array(sampleCount);
    const events = [];
    const e2 = 82.4069;
    const scale = [1, 9 / 8, 81 / 64, 4 / 3, 3 / 2, 27 / 16, 243 / 128, 2];

    const addNote = (frequency, start, duration, amplitude) => {
      events.push({
        frequency,
        start,
        duration,
        amplitude,
        phase: randomUnit() * Math.PI * 2,
      });
    };

    addNote(e2, 0, 7.95, 0.19);
    addNote(e2 * 1.5, 0.04, 7.82, 0.13);

    const arrivals = randomUnit() < 0.5 ? [0, 2, 4, 7] : [0, 1, 2, 4, 7];
    const arrivalStep = 0.38 + randomUnit() * 0.08;
    arrivals.forEach((degree, index) => {
      addNote(e2 * 2 * scale[degree], 0.34 + index * arrivalStep, 0.72, 0.28);
    });

    const patterns = [
      [0, 2, 4, 7, 4, 2],
      [0, 4, 2, 7, 4, 2],
      [0, 2, 4, 5, 7, 4],
      [0, 1, 4, 2, 5, 7],
    ];
    const pattern = patterns[Math.floor(randomUnit() * patterns.length)];
    const arpStep = 0.31 + randomUnit() * 0.055;
    const arpStart = 2.05 + randomUnit() * 0.18;

    for (let index = 0; index < 14; index += 1) {
      const degree = pattern[index % pattern.length];
      const octave = index > 7 && randomUnit() > 0.42 ? 4 : 2;
      const bloom = 0.12 + Math.sin((index / 13) * Math.PI) * 0.08;
      addNote(
        e2 * octave * scale[degree],
        arpStart + index * arpStep,
        0.48 + randomUnit() * 0.18,
        bloom,
      );
    }

    const reflectionDegrees = shuffle([2, 4, 5, 7]).slice(0, 3);
    reflectionDegrees.forEach((degree, index) => {
      addNote(
        e2 * 8 * scale[degree],
        4.15 + index * (0.72 + randomUnit() * 0.16),
        0.82,
        0.045,
      );
    });

    events.forEach((note) => {
      const firstSample = Math.max(0, Math.floor(note.start * sampleRate));
      const noteSamples = Math.floor(note.duration * sampleRate);
      const lastSample = Math.min(sampleCount, firstSample + noteSamples);
      const attack = Math.min(0.09, note.duration * 0.2);
      const release = Math.min(0.48, note.duration * 0.4);

      for (let sampleIndex = firstSample; sampleIndex < lastSample; sampleIndex += 1) {
        const noteTime = (sampleIndex - firstSample) / sampleRate;
        const attackGain = Math.min(1, noteTime / attack);
        const releaseGain = Math.min(1, (note.duration - noteTime) / release);
        const envelope = Math.sin(Math.min(1, attackGain) * Math.PI * 0.5)
          * Math.sin(Math.min(1, releaseGain) * Math.PI * 0.5);
        const wave = Math.sin(Math.PI * 2 * note.frequency * noteTime + note.phase);
        samples[sampleIndex] += wave * envelope * note.amplitude;

        const echoIndex = sampleIndex + Math.floor(0.265 * sampleRate);
        if (echoIndex < sampleCount) {
          samples[echoIndex] += wave * envelope * note.amplitude * 0.12;
        }
      }
    });

    let peak = 0.0001;
    for (let index = 0; index < sampleCount; index += 1) {
      peak = Math.max(peak, Math.abs(samples[index]));
    }

    for (let index = 0; index < sampleCount; index += 1) {
      const time = index / sampleRate;
      const fadeIn = Math.min(1, time / 0.16);
      const fadeOut = Math.min(1, (DURATION_SECONDS - time) / 0.82);
      samples[index] = (samples[index] / peak) * 0.86 * fadeIn * fadeOut;
    }

    const wav = new ArrayBuffer(44 + sampleCount * 2);
    const view = new DataView(wav);
    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + sampleCount * 2, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, sampleCount * 2, true);

    for (let index = 0; index < sampleCount; index += 1) {
      const value = Math.max(-1, Math.min(1, samples[index]));
      view.setInt16(44 + index * 2, value < 0 ? value * 32768 : value * 32767, true);
    }

    return new Blob([wav], { type: "audio/wav" });
  };

  const playMediaQuickTheme = () => {
    const theme = renderQuickTheme();
    audioUrl = URL.createObjectURL(theme);
    audioElement = new Audio(audioUrl);
    audioElement.preload = "auto";
    audioElement.volume = 1;
    audioElement.setAttribute("playsinline", "");
    overlay.dataset.audioState = "prepared";

    audioElement.addEventListener("playing", () => {
      overlay.dataset.audioState = "playing";
    }, { once: true });
    audioElement.addEventListener("ended", () => {
      overlay.dataset.audioState = "ended";
    }, { once: true });

    const playback = audioElement.play();
    if (playback) {
      playback.catch(() => {
        overlay.dataset.audioState = "blocked";
      });
    }
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

    if (audioElement) {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
    }
    audioElement = null;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      audioUrl = "";
    }
    if (!worldUrl && audioContext && audioContext.state !== "closed") {
      audioContext.close().catch(() => {});
    }
    if (!worldUrl) {
      audioContext = null;
      enterLink.focus({ preventScroll: true });
    } else {
      launchWorld();
    }
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || !event.data) {
      return;
    }
    if (event.data.type === "quickworld-ready") {
      document.body.dataset.quickworldState = "ready";
      return;
    }
    if (event.data.type === "quickworld-profile") {
      document.body.dataset.quickworldProfile = JSON.stringify(event.data.detail || {});
      return;
    }
    if (event.data.type === "quickworld-exited") {
      document.body.dataset.quickworldState = "ending";
      const exitingWorldWindow = pendingWorldWindow;
      pendingWorldWindow = null;
      window.setTimeout(() => {
        if (exitingWorldWindow && !exitingWorldWindow.closed) {
          exitingWorldWindow.close();
        }
        document.body.dataset.quickworldState = "returned";
        enterLink.focus({ preventScroll: true });
      }, 4700);
    }
  });

  enterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (active) {
        return;
      }

      enterLink = link;
      worldUrl = link.dataset.quickworldUrl || "";
      returnUrl = link.dataset.quickworldReturn || "";
      if (worldUrl && isMobileDeviceClass()) {
        if (mobileMessage) {
          mobileMessage.hidden = false;
          mobileMessage.focus({ preventScroll: true });
        }
        return;
      }

      active = true;
      visitSeed = Math.floor(secureRandomUnit() * 2147483646) + 1;
      if (link.hasAttribute("data-canonical-quicktheme")) {
        const presetIndex = Math.floor(secureRandomUnit() * CANONICAL_QUICK_THEME_SEEDS.length);
        quickThemeSeed = CANONICAL_QUICK_THEME_SEEDS[presetIndex];
      } else {
        quickThemeSeed = 0;
      }
      randomState = visitSeed >>> 0;
      overlay.hidden = false;
      document.body.classList.add("loading-active");
      document.querySelector("main")?.setAttribute("aria-hidden", "true");

      if (link.hasAttribute("data-canonical-quicktheme")) {
        playCanonicalQuickTheme();
      } else if (!window.isSecureContext || !playOriginalQuickTheme()) {
        playMediaQuickTheme();
      }
      const startedAt = performance.now();
      drawLogoSequence(startedAt);
      finishTimer = window.setTimeout(finishSequence, DURATION_SECONDS * 1000 + 80);
    });
  });
})();
