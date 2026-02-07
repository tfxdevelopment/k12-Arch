"use node";
import {
  a as o,
  f as t,
  g as h,
  i as d
} from "./_deps/node/27R56OS5.js";

// convex/importAction.ts
import y from "@mendable/firecrawl-js";
function $(e) {
  return e.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
}
o($, "generateSlug");
function A(e) {
  return e.replace(/^\s+|\s+$/g, "").replace(/\n{3,}/g, `

`);
}
o(A, "cleanMarkdown");
function b(e) {
  let a = e.split(/\s+/).length;
  return `${Math.ceil(a / 200)} min read`;
}
o(b, "calculateReadTime");
var S = h({
  args: {
    url: t.string(),
    published: t.optional(t.boolean())
  },
  returns: t.object({
    success: t.boolean(),
    slug: t.optional(t.string()),
    title: t.optional(t.string()),
    error: t.optional(t.string())
  }),
  handler: /* @__PURE__ */ o(async (e, r) => {
    let a = process.env.FIRECRAWL_API_KEY;
    if (!a)
      return {
        success: !1,
        error: "FIRECRAWL_API_KEY not configured. Add it to your Convex environment variables."
      };
    try {
      let n = await new y({ apiKey: a }).scrapeUrl(r.url, {
        formats: ["markdown"]
      });
      if (!n.success || !n.markdown)
        return {
          success: !1,
          error: n.error || "Failed to scrape URL - no content returned"
        };
      let s = n.metadata?.title || "Imported Post", m = n.metadata?.description || "", c = A(n.markdown), u = $(s) || `imported-${Date.now()}`, g = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], l;
      try {
        l = new URL(r.url).hostname;
      } catch {
        l = "external source";
      }
      let f = `${c}

---

*Originally published at [${l}](${r.url})*`;
      try {
        await e.runMutation(d.cms.createPost, {
          post: {
            slug: u,
            title: s,
            description: m,
            content: f,
            date: g,
            published: r.published ?? !1,
            tags: ["imported"],
            readTime: b(c)
          }
        });
      } catch (p) {
        if (p instanceof Error && p.message.includes("already exists")) {
          let w = `${u}-${Date.now()}`;
          return await e.runMutation(d.cms.createPost, {
            post: {
              slug: w,
              title: s,
              description: m,
              content: f,
              date: g,
              published: r.published ?? !1,
              tags: ["imported"],
              readTime: b(c)
            }
          }), {
            success: !0,
            slug: w,
            title: s
          };
        }
        throw p;
      }
      return {
        success: !0,
        slug: u,
        title: s
      };
    } catch (i) {
      return {
        success: !1,
        error: i instanceof Error ? i.message : "Unknown error occurred"
      };
    }
  }, "handler")
});
export {
  S as importFromUrl
};
//# sourceMappingURL=importAction.js.map
