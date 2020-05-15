const comics = [
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

export function get(req, res, next) {
  const { slug } = req.params;

  const matchingComicIndex =
    slug === "latest" ? 0 : comics.findIndex((comic) => comic.slug === slug);

  if (matchingComicIndex !== -1) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    const matchingComic = {
      ...comics[matchingComicIndex],
      before: comics[matchingComicIndex + 1]
        ? comics[matchingComicIndex + 1].slug
        : null,
      after: comics[matchingComicIndex - 1]
        ? comics[matchingComicIndex - 1].slug
        : null,
    };

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
