import { getDirect as getPosts } from "./blog/posts.json";

const BASE_URL = "https://stephencook.dev";

const renderItems = (items) =>
  items
    .map(
      (item) => `
<item>
  <title>
    <![CDATA[ ${item.title} ]]>
  </title>
  <description>
    <![CDATA[ ${item.description} ]]>
  </description>
  <link>${BASE_URL}${item.relativeLink}</link>
  <guid>${BASE_URL}${item.relativeLink}</guid>
  ${item.keywords
    .split(",")
    .map((keyword) => `<category><![CDATA[ ${keyword} ]]></category>`)
    .join("")}
  <pubDate>${new Date(item.published).toUTCString()}</pubDate>
</item>
`
    )
    .map((item) => item.trim())
    .join("");

const render = () => `
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>
      <![CDATA[ Stephen Cook Dev | RSS Feed ]]>
    </title>
    <description>
      <![CDATA[ Software engineer at Let’s Do This. Saving up to fulfil true dream of professional Mario Kart ]]>
    </description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${renderItems(
      getPosts()
        .filter((post) => post.live)
        .map((post) => ({
          ...post,
          description: post.opening,
          relativeLink: `/blog/${post.slug}/`,
        }))
    )}
  </channel>
</rss>
`;

export function get(req, res, next) {
  res.setHeader("Cache-Control", "max-age=0, s-max-age=604800");
  res.setHeader("Content-Type", "application/xml");

  const sitemap = render().trim();
  res.end(sitemap);
}
