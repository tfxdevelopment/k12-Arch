import {
  a as y
} from "./_deps/AJORQ7CY.js";
import {
  a as h,
  b as n
} from "./_deps/M2D6NT5W.js";

// convex/search.ts
var q = n.object({
  _id: n.string(),
  type: n.union(n.literal("post"), n.literal("page")),
  slug: n.string(),
  title: n.string(),
  description: n.optional(n.string()),
  snippet: n.string(),
  anchor: n.optional(n.string())
  // Anchor ID for scrolling to exact match location
}), S = y({
  args: {
    query: n.string()
  },
  returns: n.array(q),
  handler: /* @__PURE__ */ h(async (r, s) => {
    if (!s.query.trim())
      return [];
    let i = [], l = await r.db.query("posts").withSearchIndex(
      "search_title",
      (e) => e.search("title", s.query).eq("published", !0)
    ).take(10), p = await r.db.query("posts").withSearchIndex(
      "search_content",
      (e) => e.search("content", s.query).eq("published", !0)
    ).take(10), u = await r.db.query("pages").withSearchIndex(
      "search_title",
      (e) => e.search("title", s.query).eq("published", !0)
    ).take(10), t = await r.db.query("pages").withSearchIndex(
      "search_content",
      (e) => e.search("content", s.query).eq("published", !0)
    ).take(10), g = /* @__PURE__ */ new Set();
    for (let e of [...l, ...p]) {
      if (g.has(e._id) || (g.add(e._id), e.unlisted)) continue;
      let { snippet: o, anchor: d } = w(e.content, s.query, 120);
      i.push({
        _id: e._id,
        type: "post",
        slug: e.slug,
        title: e.title,
        description: e.description,
        snippet: o,
        anchor: d || void 0
      });
    }
    let c = /* @__PURE__ */ new Set();
    for (let e of [...u, ...t]) {
      if (c.has(e._id)) continue;
      c.add(e._id);
      let { snippet: o, anchor: d } = w(e.content, s.query, 120);
      i.push({
        _id: e._id,
        type: "page",
        slug: e.slug,
        title: e.title,
        snippet: o,
        anchor: d || void 0
      });
    }
    let a = s.query.toLowerCase();
    return i.sort((e, o) => {
      let d = e.title.toLowerCase().includes(a), f = o.title.toLowerCase().includes(a);
      return d && !f ? -1 : !d && f ? 1 : 0;
    }), i.slice(0, 15);
  }, "handler")
});
function b(r) {
  return r.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
h(b, "generateSlug");
function _(r, s) {
  let i = r.split(`
`), l = [], p = 0;
  for (let t = 0; t < i.length; t++) {
    let g = i[t], c = g.match(/^(#{1,6})\s+(.+)$/);
    if (c) {
      let a = c[2].trim(), e = b(a);
      l.push({ text: a, position: p, id: e });
    }
    p += g.length + 1;
  }
  let u = null;
  for (let t of l)
    if (t.position <= s)
      u = t;
    else
      break;
  return u?.id || null;
}
h(_, "findNearestHeading");
function w(r, s, i) {
  let l = s.toLowerCase(), p = r.toLowerCase().indexOf(l), u = p !== -1 ? _(r, p) : null, t = r.replace(/#{1,6}\s/g, "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/```[\s\S]*?```/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/!\[([^\]]*)\]\([^)]+\)/g, "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim(), c = t.toLowerCase().indexOf(l);
  if (c === -1)
    return {
      snippet: t.slice(0, i) + (t.length > i ? "..." : ""),
      anchor: null
    };
  let a = Math.max(0, c - Math.floor(i / 3)), e = Math.min(t.length, a + i), o = t.slice(a, e);
  return a > 0 && (o = "..." + o), e < t.length && (o = o + "..."), { snippet: o, anchor: u };
}
h(w, "createSnippet");
export {
  S as search
};
//# sourceMappingURL=search.js.map
