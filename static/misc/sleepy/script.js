const generateSoundToVolumeMap = (soundButtons) => {
  const map = {};
  soundButtons.forEach((button) => {
    const audio = new Audio(`sounds/${button.dataset.sound}`);
    map[button.dataset.sound] = audio;
    audio.volume = 0;
    audio.loop = true;
  });

  return map;
};

const triggerSoundChange = (soundKey, val, soundToVolumeMap) => {
  const audio = soundToVolumeMap[soundKey];
  audio.volume = val / 100;

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
      if (buttonRange.value > 0) buttonRange.value = 0;
      else buttonRange.value = 100;

      triggerSoundChange(
        button.dataset.sound,
        buttonRange.value,
        soundToVolumeMap
      );
    });

    buttonRange.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    buttonRange.addEventListener("input", () => {
      triggerSoundChange(
        button.dataset.sound,
        buttonRange.value,
        soundToVolumeMap
      );
    });
  });
};

const initialiseMixer = (soundButtons, soundToVolumeMap) => {
  soundButtons.forEach((button) => {
    const buttonRange = getButtonRange(button);
    buttonRange.value = soundToVolumeMap[button.dataset.sound].volume * 100;

    triggerSoundChange(
      button.dataset.sound,
      buttonRange.value,
      soundToVolumeMap
    );
  });
};

const soundButtons = document.querySelectorAll(".sound");
const soundToVolumeMap = generateSoundToVolumeMap(soundButtons);

addSoundButtonListeners(soundButtons, soundToVolumeMap);
initialiseMixer(soundButtons, soundToVolumeMap);
