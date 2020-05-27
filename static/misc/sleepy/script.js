const generateSoundToVolumeMap = (soundButtons) => {
  const map = {};
  soundButtons.forEach((button) => {
    const audio = new Audio(`sounds/${button.dataset.sound}`);
    map[button.dataset.sound] = audio;
    audio.loop = true;
  });

  soundButtons.forEach((button) => {
    // init all to 0
    triggerSoundChange(button, 0, map);
  });

  return map;
};

const triggerSoundChange = (button, rawVal, soundToVolumeMap) => {
  const val = Math.max(0, Math.min(100, rawVal));
  const soundKey = button.dataset.sound;

  const audio = soundToVolumeMap[soundKey];
  audio.volume = val / 100;

  const buttonRange = getButtonRange(button);
  buttonRange.value = soundToVolumeMap[soundKey].volume * 100;

  if (audio.paused && val > 0) {
    audio.play();
  } else if (!audio.paused && val === 0) {
    audio.pause();
  }
};

const getButtonRange = (button) => button.querySelector('input[type="range"]');

const addSoundButtonListeners = (soundButtons, soundToVolumeMap) => {
  soundButtons.forEach((button) => {
    const buttonRange = getButtonRange(button);

    button.addEventListener("click", () => {
      const targetVal = buttonRange.value > 0 ? 0 : 100;
      triggerSoundChange(button, targetVal, soundToVolumeMap);
    });

    buttonRange.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    buttonRange.addEventListener("input", () => {
      triggerSoundChange(button, buttonRange.value, soundToVolumeMap);
    });
  });
};

const timeToHuman = (milliseconds) => {
  const rawMm = Math.floor(milliseconds / (1000 * 60));
  const hh = Math.floor(milliseconds / (1000 * 60 * 60));
  const mm = rawMm - hh * 60;

  if (hh > 0) return `${hh} hours ${mm} minutes`;
  return `${mm} minutes`;
};

let fadeInterval;
const fadeOut = (soundButtons, soundToVolumeMap) => {
  clearInterval(fadeInterval);

  let inc = 1;
  const baseVolumeMap = Object.keys(soundToVolumeMap).reduce(
    (acc, soundKey) => ({
      ...acc,
      [soundKey]: soundToVolumeMap[soundKey].volume,
    }),
    {}
  );

  fadeInterval = setInterval(() => {
    inc -= 0.01;
    soundButtons.forEach((button) => {
      triggerSoundChange(
        button,
        baseVolumeMap[button.dataset.sound] * inc * 100,
        soundToVolumeMap
      );
    });

    if (inc <= 0) clearInterval(fadeInterval);
  }, 100);
};

let timerInterval;
const createTimerFor = (
  value,
  soundButtons,
  countdownText,
  soundToVolumeMap
) => {
  const [hh, mm] = value.split(":");
  const targetDate = new Date();
  targetDate.setHours(hh);
  targetDate.setMinutes(mm);

  const aDay = 1000 * 60 * 60 * 24;
  const targetTime =
    Date.now() < targetDate
      ? targetDate.getTime()
      : targetDate.getTime() + aDay;

  timerInterval = setInterval(() => {
    const timeUntil = targetTime - Date.now();
    countdownText.innerHTML = `(clear) Time until ${timeToHuman(timeUntil)}`;

    if (timeUntil < 0) {
      clearTimer(countdownTimer, countdownText);
      fadeOut(soundButtons, soundToVolumeMap);
    }
  }, 1000);
};

const clearTimer = (countdownTimer, countdownText) => {
  countdownTimer.value = "";
  countdownText.innerHTML = "";
  clearInterval(timerInterval);
};

const detectCountdown = (
  soundButtons,
  countdownTimer,
  countdownText,
  soundToVolumeMap
) => {
  countdownTimer.addEventListener("change", () => {
    clearInterval(timerInterval);

    if (countdownTimer.value)
      createTimerFor(
        countdownTimer.value,
        soundButtons,
        countdownText,
        soundToVolumeMap
      );
  });

  countdownText.addEventListener("click", () => {
    clearTimer(countdownTimer, countdownText);
  });
};

const initialiseMixer = (soundButtons, soundToVolumeMap) => {
  soundButtons.forEach((button) => {
    triggerSoundChange(button, getButtonRange(button).value, soundToVolumeMap);
  });
};

const soundButtons = document.querySelectorAll(".sound");
const countdownTimer = document.querySelector('.countdown input[type="time"]');
const countdownText = document.querySelector(".countdown span");
const soundToVolumeMap = generateSoundToVolumeMap(soundButtons);

addSoundButtonListeners(soundButtons, soundToVolumeMap);
detectCountdown(soundButtons, countdownTimer, countdownText, soundToVolumeMap);
initialiseMixer(soundButtons, soundToVolumeMap);
