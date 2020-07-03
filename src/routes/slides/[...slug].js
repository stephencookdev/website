const fs = require("fs");
const path = require("path");

const FILE_META = {
  ".js": {
    "Content-Type": "text/javascript; charset=utf-8",
  },
  ".html": {
    "Content-Type": "text/html; charset=utf-8",
  },
};

export async function get(req, res, next) {
  const { slug } = req.params;

  if (process.env.SAPPER_EXPORT) {
    // Sapper's crawl isn't smart enough to crawl these files, so we intead
    // depend on `build-slides.sh` for this in export mode
    res.writeHead(404);
    res.end(null);
    return;
  }

  try {
    const dirPath = path.join("node_modules/@stephencookdev", ...slug);
    const distDirPath = dirPath.replace(
      /stephencookdev\/([^/]+)/,
      "stephencookdev/$1/dist"
    );
    const filePath = fs.statSync(distDirPath).isDirectory()
      ? distDirPath + "/index.html"
      : distDirPath;

    res.writeHead(200, FILE_META[path.extname(filePath)] || {});
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.writeHead(500);
    res.end({ error });
  }
}
