import {
  b as d
} from "./_deps/AJORQ7CY.js";
import {
  a as o,
  b as t
} from "./_deps/M2D6NT5W.js";

// convex/semanticSearchQueries.ts
var a = d({
  args: { ids: t.array(t.id("posts")) },
  returns: t.array(
    t.object({
      _id: t.id("posts"),
      slug: t.string(),
      title: t.string(),
      description: t.string(),
      content: t.string(),
      unlisted: t.optional(t.boolean())
    })
  ),
  handler: /* @__PURE__ */ o(async (n, e) => {
    let i = [];
    for (let r of e.ids) {
      let s = await n.db.get(r);
      s && s.published && !s.unlisted && i.push({
        _id: s._id,
        slug: s.slug,
        title: s.title,
        description: s.description,
        content: s.content,
        unlisted: s.unlisted
      });
    }
    return i;
  }, "handler")
}), u = d({
  args: { ids: t.array(t.id("pages")) },
  returns: t.array(
    t.object({
      _id: t.id("pages"),
      slug: t.string(),
      title: t.string(),
      content: t.string()
    })
  ),
  handler: /* @__PURE__ */ o(async (n, e) => {
    let i = [];
    for (let r of e.ids) {
      let s = await n.db.get(r);
      s && s.published && i.push({
        _id: s._id,
        slug: s.slug,
        title: s.title,
        content: s.content
      });
    }
    return i;
  }, "handler")
});
export {
  u as fetchPagesByIds,
  a as fetchPostsByIds
};
//# sourceMappingURL=semanticSearchQueries.js.map
