import {
  f as c
} from "./AJORQ7CY.js";
import {
  a as g
} from "./Y2CE7CMW.js";
import {
  a as o
} from "./M2D6NT5W.js";

// convex/rss.ts
var a = process.env.SITE_URL || "http://localhost:5173", u = "K12 portal", p = "A site built with markdown-sync framework.";
function i(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
o(i, "escapeXml");
function d(s, r = "/rss.xml") {
  let e = s.map((t) => {
    let n = new Date(t.date).toUTCString(), l = `${a}/${t.slug}`;
    return `
    <item>
      <title>${i(t.title)}</title>
      <link>${l}</link>
      <guid>${l}</guid>
      <pubDate>${n}</pubDate>
      <description>${i(t.description)}</description>
    </item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${i(u)}</title>
    <link>${a}</link>
    <description>${i(p)}</description>
    <language>en-us</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${a}${r}" rel="self" type="application/rss+xml"/>
    ${e}
  </channel>
</rss>`;
}
o(d, "generateRssXml");
function m(s) {
  let r = s.map((e) => {
    let t = new Date(e.date).toUTCString(), n = `${a}/${e.slug}`;
    return `
    <item>
      <title>${i(e.title)}</title>
      <link>${n}</link>
      <guid>${n}</guid>
      <pubDate>${t}</pubDate>
      <description>${i(e.description)}</description>
      <content:encoded><![CDATA[${e.content}]]></content:encoded>
      ${e.tags.map((l) => `<category>${i(l)}</category>`).join(`
      `)}
    </item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${i(u)} - Full Content</title>
    <link>${a}</link>
    <description>${i(p)} Full article content for readers and AI.</description>
    <language>en-us</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${a}/rss-full.xml" rel="self" type="application/rss+xml"/>
    ${r}
  </channel>
</rss>`;
}
o(m, "generateFullRssXml");
var h = c(async (s) => {
  let r = await s.runQuery(g.posts.getAllPosts), e = d(
    r.map((t) => ({
      title: t.title,
      description: t.description,
      slug: t.slug,
      date: t.date
    }))
  );
  return new Response(e, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=7200"
    }
  });
}), T = c(async (s) => {
  let r = await s.runQuery(g.posts.getAllPosts), e = await Promise.all(
    r.map(async (n) => {
      let l = await s.runQuery(g.posts.getPostBySlug, {
        slug: n.slug
      });
      return {
        title: n.title,
        description: n.description,
        slug: n.slug,
        date: n.date,
        content: l?.content || "",
        readTime: n.readTime,
        tags: n.tags
      };
    })
  ), t = m(e);
  return new Response(t, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=7200"
    }
  });
});

export {
  h as a,
  T as b
};
//# sourceMappingURL=ITXHG73A.js.map
