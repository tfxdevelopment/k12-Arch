"use node";
import {
  a as n,
  f as t,
  g as p,
  j as l
} from "./_deps/node/27R56OS5.js";

// convex/semanticSearch.ts
import b from "openai";
var f = t.object({
  _id: t.string(),
  type: t.union(t.literal("post"), t.literal("page")),
  slug: t.string(),
  title: t.string(),
  description: t.optional(t.string()),
  snippet: t.string(),
  score: t.number()
  // Similarity score from vector search
}), E = p({
  args: { query: t.string() },
  returns: t.array(f),
  handler: /* @__PURE__ */ n(async (s, o) => {
    if (!o.query.trim())
      return [];
    let i = process.env.OPENAI_API_KEY;
    if (!i)
      return console.log("OPENAI_API_KEY not set, semantic search unavailable"), [];
    let g = (await new b({ apiKey: i }).embeddings.create({
      model: "text-embedding-ada-002",
      input: o.query
    })).data[0].embedding, d = await s.vectorSearch("posts", "by_embedding", {
      vector: g,
      limit: 10,
      filter: /* @__PURE__ */ n((e) => e.eq("published", !0), "filter")
    }), u = await s.vectorSearch("pages", "by_embedding", {
      vector: g,
      limit: 10,
      filter: /* @__PURE__ */ n((e) => e.eq("published", !0), "filter")
    }), _ = await s.runQuery(l.semanticSearchQueries.fetchPostsByIds, {
      ids: d.map((e) => e._id)
    }), y = await s.runQuery(l.semanticSearchQueries.fetchPagesByIds, {
      ids: u.map((e) => e._id)
    }), a = [];
    for (let e of d) {
      let r = _.find((c) => c._id === e._id);
      r && a.push({
        _id: String(r._id),
        type: "post",
        slug: r.slug,
        title: r.title,
        description: r.description,
        snippet: m(r.content, 120),
        score: e._score
      });
    }
    for (let e of u) {
      let r = y.find((c) => c._id === e._id);
      r && a.push({
        _id: String(r._id),
        type: "page",
        slug: r.slug,
        title: r.title,
        snippet: m(r.content, 120),
        score: e._score
      });
    }
    return a.sort((e, r) => r.score - e.score), a.slice(0, 15);
  }, "handler")
}), q = p({
  args: {},
  returns: t.boolean(),
  handler: /* @__PURE__ */ n(async () => !!process.env.OPENAI_API_KEY, "handler")
});
function m(s, o) {
  let i = s.replace(/#{1,6}\s/g, "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/```[\s\S]*?```/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/!\[([^\]]*)\]\([^)]+\)/g, "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  return i.length <= o ? i : i.slice(0, o) + "...";
}
n(m, "createSnippet");
export {
  q as isSemanticSearchAvailable,
  E as semanticSearch
};
//# sourceMappingURL=semanticSearch.js.map
