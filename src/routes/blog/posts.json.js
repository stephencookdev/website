const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parse5 = require("parse5");

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

    const meta = {};
    metaNode.attrs.forEach((attr) => {
      meta[attr.name] = attr.value;
    });

    return meta;
  });

export function get(req, res, next) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(posts));
}
