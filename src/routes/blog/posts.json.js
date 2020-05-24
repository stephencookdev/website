const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parse5 = require("parse5");

const mostRecentFirst = (a, b) => -a.published.localeCompare(b.published);

const cwd = "src/routes/blog/";

const _getFlattenedText = (node) => {
  if (node.value) return node.value;
  if (node.childNodes) return node.childNodes.map(getFlattenedText).join("");

  return "";
};
const getFlattenedText = (node) => {
  return _getFlattenedText(node)
    .replace(/\n/g, " ")
    .replace(/[\s]+/g, " ")
    .trim();
};

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
    const opening = getFlattenedText(firstPara);

    const meta = { opening };
    metaNode.attrs.forEach((attr) => {
      meta[attr.name] = attr.value;
    });
    meta.live = metaNode.childNodes[0].value.trim() === "true";

    return meta;
  })
  .sort(mostRecentFirst);

for (let i = 0; i < posts.length; i++) {
  if (i > 0) posts[i].before = posts[i - 1].slug;
  if (i < posts.length - 1) posts[i].after = posts[i + 1].slug;
}

export function get(req, res, next) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(posts));
}
