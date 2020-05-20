const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parse5 = require("parse5");

const mostRecentFirst = (a, b) => -a.published.localeCompare(b.published);

const cwd = "src/routes/blog/";

const posts = glob
  .sync("*.svelte", {
    cwd,
    ignore: ["index.svelte", "_*.svelte"],
  })
  .map((pLoc) => {
    const file = fs.readFileSync(path.join(cwd, pLoc));
    const root = parse5.parseFragment(file.toString());
    const metaNode = root.childNodes.find(
      (node) => node.tagName === "blogmeta"
    );

    const firstPara = root.childNodes.find((node) => node.tagName === "p");
    const opening = firstPara.childNodes[0].value
      .replace(/\n/g, " ")
      .replace(/[\s]+/g, " ")
      .trim();

    const slug = pLoc.replace(/\.svelte$/, "");

    const meta = { slug, opening };
    metaNode.attrs.forEach((attr) => {
      meta[attr.name] = attr.value;
    });
    meta.live = metaNode.childNodes[0].value.trim() === "true";

    return meta;
  })
  .sort(mostRecentFirst);

export function get(req, res, next) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(posts));
}
