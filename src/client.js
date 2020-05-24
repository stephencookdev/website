import { start } from "@sapper/app";

start({
  target: document.querySelector("#sapper"),
});

const detectKonamiCode = (callback) => {
  const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let lastFewKeyDowns = [];
  document.addEventListener("keydown", (e) => {
    const prevLastFewKeyDowns = lastFewKeyDowns.slice(
      Math.max(0, lastFewKeyDowns.length - KONAMI_CODE.length + 1),
      lastFewKeyDowns.length
    );

    lastFewKeyDowns = [...prevLastFewKeyDowns, e.keyCode];

    const isKonami = KONAMI_CODE.every(
      (keyCode, i) => keyCode === lastFewKeyDowns[i]
    );

    if (isKonami) callback();
  });
};

detectKonamiCode(() => {
  const luigi = document.createElement("img");
  luigi.src = "/death-stare.gif";
  luigi.alt = "Luigi Death Stare";
  luigi.style = `
    opacity: 0;
    transition: opacity 5s ease 0s;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;`;
  document.body.appendChild(luigi);

  setTimeout(() => {
    luigi.style.opacity = "1";
  }, 0);

  setTimeout(() => {
    document.body.removeChild(luigi);
  }, 8000);
});
