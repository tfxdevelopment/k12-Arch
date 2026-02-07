import {
  b as r,
  d as a
} from "./_deps/AJORQ7CY.js";
import {
  a as d,
  b as t
} from "./_deps/M2D6NT5W.js";

// convex/embeddingsQueries.ts
var g = r({
  args: { limit: t.number() },
  returns: t.array(
    t.object({
      _id: t.id("posts"),
      title: t.string(),
      content: t.string()
    })
  ),
  handler: /* @__PURE__ */ d(async (n, i) => (await n.db.query("posts").withIndex("by_published", (e) => e.eq("published", !0)).collect()).filter((e) => !e.embedding).slice(0, i.limit).map((e) => ({
    _id: e._id,
    title: e.title,
    content: e.content
  })), "handler")
}), c = r({
  args: { limit: t.number() },
  returns: t.array(
    t.object({
      _id: t.id("pages"),
      title: t.string(),
      content: t.string()
    })
  ),
  handler: /* @__PURE__ */ d(async (n, i) => (await n.db.query("pages").withIndex("by_published", (e) => e.eq("published", !0)).collect()).filter((e) => !e.embedding).slice(0, i.limit).map((e) => ({
    _id: e._id,
    title: e.title,
    content: e.content
  })), "handler")
}), u = a({
  args: {
    id: t.id("posts"),
    embedding: t.array(t.float64())
  },
  handler: /* @__PURE__ */ d(async (n, i) => {
    await n.db.patch(i.id, { embedding: i.embedding });
  }, "handler")
}), b = a({
  args: {
    id: t.id("pages"),
    embedding: t.array(t.float64())
  },
  handler: /* @__PURE__ */ d(async (n, i) => {
    await n.db.patch(i.id, { embedding: i.embedding });
  }, "handler")
}), m = r({
  args: { slug: t.string() },
  returns: t.union(
    t.object({
      _id: t.id("posts"),
      title: t.string(),
      content: t.string()
    }),
    t.null()
  ),
  handler: /* @__PURE__ */ d(async (n, i) => {
    let s = await n.db.query("posts").withIndex("by_slug", (e) => e.eq("slug", i.slug)).first();
    return s ? {
      _id: s._id,
      title: s.title,
      content: s.content
    } : null;
  }, "handler")
});
export {
  c as getPagesWithoutEmbeddings,
  m as getPostBySlug,
  g as getPostsWithoutEmbeddings,
  b as savePageEmbedding,
  u as savePostEmbedding
};
//# sourceMappingURL=embeddingsQueries.js.map
