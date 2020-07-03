import { getDirect as getPosts } from "./blog/posts.json";
import { getAllDirect as getComics } from "./comics/[slug].json";

const BASE_URL = "https://stephencook.dev";

const renderUrls = (urls) =>
  urls.map((url) => `<url><loc>${BASE_URL}${url}</loc></url>`).join("");

const render = () => `
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
    ${renderUrls(["/", "/blog"])}

    ${renderUrls(
      getPosts()
        .filter((post) => post.live)
        .map((post) => `/blog/${post.slug}/`)
    )}
    
    ${renderUrls(getComics().map((comic) => `/comics/${comic.slug}/`))}
</urlset>
`;

export function get(req, res, next) {
  res.setHeader("Cache-Control", "max-age=0, s-max-age=604800");
  res.setHeader("Content-Type", "application/xml");

  const sitemap = render().trim();
  res.end(sitemap);
}
