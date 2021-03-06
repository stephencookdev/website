const Jimp = require("jimp");

const comics = [
  {
    published: "2021-03-13",
    slug: "sad-songs",
    title: "Sad Songs",
    hoverText: "it was a real sad picture of the rain, though",
    keywords: "quarantine, lonely, christmas",
  },
  {
    published: "2020-12-01",
    slug: "counting-down-the-days",
    title: "Home stretch",
    hoverText:
      "dealing with 2020, one advent calendar window of chocolate at a time",
    keywords: "quarantine, lonely, christmas",
  },
  {
    published: "2020-11-29",
    slug: "how-i-die",
    title: "DIY Did I Think This Was a Good Idea?",
    hoverText: "I could call for help. But, then someone would know.",
    keywords: "diy, fail, stuck",
  },
  {
    published: "2020-07-17",
    slug: "rubber-ducking",
    title: "Rubber Ducking",
    hoverText: "ah, yes — the elusive rubber duck technique",
    keywords: "dev, debugging, rubber-duck",
  },
  {
    published: "2020-06-26",
    slug: "social-distancing",
    title: "Social Distancing",
    hoverText: "I really only trained for the down part of lockdown",
    keywords: "quarantine, lonely, friends",
  },
  {
    published: "2020-06-19",
    slug: "that-will-teach-them",
    title: "That’ll Teach ’Em",
    hoverText: "my only regret is not being more passive-aggressive",
    keywords: "quarantine, passive-aggressive",
  },
  {
    published: "2020-06-12",
    slug: "need-for-zoom-speed",
    title: "Need for (Zoom) Speed",
    hoverText:
      "just because no one else realises this is a game doesn't mean I'm not winning",
    keywords: "remote, zoom, racing",
  },
  {
    published: "2020-05-29",
    slug: "slouch",
    title: "Slouch",
    hoverText:
      "okay sure but I'll sort my posture when I do all of my self-care… later…",
    keywords: "quarantine, remote",
  },
  {
    published: "2020-05-22",
    slug: "toy-api",
    title: "Toy API",
    hoverText:
      "sure, I hate dealing with third-party APIs, but NOW I'm doing it OUTSIDE of work, so I'm sure it'll be fun",
    keywords: "dev, api, time-management",
  },
  {
    published: "2020-05-15",
    slug: "find-that-music",
    title: "Find That Music",
    hoverText:
      "next you'll tell me that adjusting my window positions is procrastinating too",
    keywords: "dev, procrastinating, music",
  },
  {
    published: "2020-05-08",
    slug: "un-mute",
    title: "Un-Mute",
    hoverText: "adjusting to remote work well",
    keywords: "remote, conference, zoom, mute",
  },
  {
    published: "2020-05-01",
    slug: "just-one-bug",
    title: "Just One Bug",
    hoverText: "okay but just 5 more minutes otherwise I'll lose my place",
    keywords: "dev, bugs, time-management",
  },
  {
    published: "2020-04-24",
    slug: "new-project",
    title: "New Project",
    hoverText: "I would never start a new project during quarantine...",
    keywords: "quarantine, side-project",
  },
];

export const getAllDirect = () => {
  return comics;
};

const generatePreviewImage = async (slug) => {
  const comicBase = `comics/${slug}`;

  const comicImage = await Jimp.read(`static/${comicBase}.png`);

  comicImage.crop(
    0,
    0,
    comicImage.bitmap.width,
    comicImage.bitmap.height * 0.58
  );

  await comicImage.writeAsync(`__sapper__/export/${comicBase}-preview.png`);
};

export async function get(req, res, next) {
  const { slug } = req.params;

  const matchingComicIndex =
    slug === "latest" ? 0 : comics.findIndex((comic) => comic.slug === slug);

  if (matchingComicIndex !== -1) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    const matchingComic = {
      ...comics[matchingComicIndex],
      preview: `${comics[matchingComicIndex].slug}-preview`,
      before: comics[matchingComicIndex + 1]
        ? comics[matchingComicIndex + 1].slug
        : null,
      after: comics[matchingComicIndex - 1]
        ? comics[matchingComicIndex - 1].slug
        : null,
    };

    await generatePreviewImage(matchingComic.slug);

    res.end(JSON.stringify(matchingComic));
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}
