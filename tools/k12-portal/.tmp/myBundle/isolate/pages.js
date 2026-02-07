import {
  a as g,
  c as h
} from "./_deps/AJORQ7CY.js";
import {
  b
} from "./_deps/Y2CE7CMW.js";
import {
  a as d,
  b as o
} from "./_deps/M2D6NT5W.js";

// convex/pages.ts
var I = g({
  args: {},
  returns: o.array(
    o.object({
      _id: o.id("pages"),
      _creationTime: o.number(),
      slug: o.string(),
      title: o.string(),
      content: o.string(),
      published: o.boolean(),
      order: o.optional(o.number()),
      showInNav: o.optional(o.boolean()),
      excerpt: o.optional(o.string()),
      image: o.optional(o.string()),
      featured: o.optional(o.boolean()),
      featuredOrder: o.optional(o.number()),
      authorName: o.optional(o.string()),
      authorImage: o.optional(o.string()),
      source: o.optional(o.union(o.literal("dashboard"), o.literal("sync")))
    })
  ),
  handler: /* @__PURE__ */ d(async (a) => (await a.db.query("pages").collect()).sort((r, t) => {
    let i = r.order ?? 999, s = t.order ?? 999;
    return i !== s ? i - s : r.title.localeCompare(t.title);
  }).map((r) => ({
    _id: r._id,
    _creationTime: r._creationTime,
    slug: r.slug,
    title: r.title,
    content: r.content,
    published: r.published,
    order: r.order,
    showInNav: r.showInNav,
    excerpt: r.excerpt,
    image: r.image,
    featured: r.featured,
    featuredOrder: r.featuredOrder,
    authorName: r.authorName,
    authorImage: r.authorImage,
    source: r.source
  })), "handler")
}), y = g({
  args: {},
  returns: o.array(
    o.object({
      _id: o.id("pages"),
      slug: o.string(),
      title: o.string(),
      published: o.boolean(),
      order: o.optional(o.number()),
      showInNav: o.optional(o.boolean()),
      excerpt: o.optional(o.string()),
      image: o.optional(o.string()),
      featured: o.optional(o.boolean()),
      featuredOrder: o.optional(o.number()),
      authorName: o.optional(o.string()),
      authorImage: o.optional(o.string()),
      layout: o.optional(o.string()),
      rightSidebar: o.optional(o.boolean()),
      showFooter: o.optional(o.boolean()),
      footer: o.optional(o.string())
    })
  ),
  handler: /* @__PURE__ */ d(async (a) => (await a.db.query("pages").withIndex("by_published", (t) => t.eq("published", !0)).collect()).filter(
    (t) => t.showInNav !== !1
  ).sort((t, i) => {
    let s = t.order ?? 999, c = i.order ?? 999;
    return s !== c ? s - c : t.title.localeCompare(i.title);
  }).map((t) => ({
    _id: t._id,
    slug: t.slug,
    title: t.title,
    published: t.published,
    order: t.order,
    showInNav: t.showInNav,
    excerpt: t.excerpt,
    image: t.image,
    featured: t.featured,
    featuredOrder: t.featuredOrder,
    authorName: t.authorName,
    authorImage: t.authorImage,
    layout: t.layout,
    rightSidebar: t.rightSidebar,
    showFooter: t.showFooter
  })), "handler")
}), x = g({
  args: {},
  returns: o.array(
    o.object({
      _id: o.id("pages"),
      slug: o.string(),
      title: o.string(),
      excerpt: o.optional(o.string()),
      image: o.optional(o.string()),
      featuredOrder: o.optional(o.number())
    })
  ),
  handler: /* @__PURE__ */ d(async (a) => (await a.db.query("pages").withIndex("by_featured", (r) => r.eq("featured", !0)).collect()).filter((r) => r.published).sort((r, t) => {
    let i = r.featuredOrder ?? 999, s = t.featuredOrder ?? 999;
    return i - s;
  }).map((r) => ({
    _id: r._id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    image: r.image,
    featuredOrder: r.featuredOrder
  })), "handler")
}), O = g({
  args: {
    slug: o.string()
  },
  returns: o.union(
    o.object({
      _id: o.id("pages"),
      slug: o.string(),
      title: o.string(),
      content: o.string(),
      published: o.boolean(),
      order: o.optional(o.number()),
      showInNav: o.optional(o.boolean()),
      excerpt: o.optional(o.string()),
      image: o.optional(o.string()),
      showImageAtTop: o.optional(o.boolean()),
      featured: o.optional(o.boolean()),
      featuredOrder: o.optional(o.number()),
      authorName: o.optional(o.string()),
      authorImage: o.optional(o.string()),
      layout: o.optional(o.string()),
      rightSidebar: o.optional(o.boolean()),
      showFooter: o.optional(o.boolean()),
      footer: o.optional(o.string()),
      showSocialFooter: o.optional(o.boolean()),
      aiChat: o.optional(o.boolean()),
      contactForm: o.optional(o.boolean()),
      newsletter: o.optional(o.boolean()),
      textAlign: o.optional(o.string()),
      docsSection: o.optional(o.boolean())
    }),
    o.null()
  ),
  handler: /* @__PURE__ */ d(async (a, l) => {
    let e = await a.db.query("pages").withIndex("by_slug", (r) => r.eq("slug", l.slug)).first();
    return !e || !e.published ? null : {
      _id: e._id,
      slug: e.slug,
      title: e.title,
      content: e.content,
      published: e.published,
      order: e.order,
      showInNav: e.showInNav,
      excerpt: e.excerpt,
      image: e.image,
      showImageAtTop: e.showImageAtTop,
      featured: e.featured,
      featuredOrder: e.featuredOrder,
      authorName: e.authorName,
      authorImage: e.authorImage,
      layout: e.layout,
      rightSidebar: e.rightSidebar,
      showFooter: e.showFooter,
      footer: e.footer,
      showSocialFooter: e.showSocialFooter,
      aiChat: e.aiChat,
      contactForm: e.contactForm,
      newsletter: e.newsletter,
      textAlign: e.textAlign,
      docsSection: e.docsSection
    };
  }, "handler")
}), _ = g({
  args: {},
  returns: o.array(
    o.object({
      _id: o.id("pages"),
      slug: o.string(),
      title: o.string(),
      docsSectionGroup: o.optional(o.string()),
      docsSectionOrder: o.optional(o.number()),
      docsSectionGroupOrder: o.optional(o.number()),
      docsSectionGroupIcon: o.optional(o.string())
    })
  ),
  handler: /* @__PURE__ */ d(async (a) => (await a.db.query("pages").withIndex("by_docsSection", (t) => t.eq("docsSection", !0)).collect()).filter((t) => t.published).sort((t, i) => {
    let s = t.docsSectionOrder ?? 999, c = i.docsSectionOrder ?? 999;
    return s !== c ? s - c : t.title.localeCompare(i.title);
  }).map((t) => ({
    _id: t._id,
    slug: t.slug,
    title: t.title,
    docsSectionGroup: t.docsSectionGroup,
    docsSectionOrder: t.docsSectionOrder,
    docsSectionGroupOrder: t.docsSectionGroupOrder,
    docsSectionGroupIcon: t.docsSectionGroupIcon
  })), "handler")
}), N = g({
  args: {},
  returns: o.union(
    o.object({
      _id: o.id("pages"),
      slug: o.string(),
      title: o.string(),
      content: o.string(),
      excerpt: o.optional(o.string()),
      image: o.optional(o.string()),
      showImageAtTop: o.optional(o.boolean()),
      authorName: o.optional(o.string()),
      authorImage: o.optional(o.string()),
      docsSectionGroup: o.optional(o.string()),
      docsSectionOrder: o.optional(o.number()),
      showFooter: o.optional(o.boolean()),
      footer: o.optional(o.string()),
      aiChat: o.optional(o.boolean())
    }),
    o.null()
  ),
  handler: /* @__PURE__ */ d(async (a) => {
    let e = (await a.db.query("pages").withIndex("by_docsSection", (r) => r.eq("docsSection", !0)).collect()).find((r) => r.published && r.docsLanding);
    return e ? {
      _id: e._id,
      slug: e.slug,
      title: e.title,
      content: e.content,
      excerpt: e.excerpt,
      image: e.image,
      showImageAtTop: e.showImageAtTop,
      authorName: e.authorName,
      authorImage: e.authorImage,
      docsSectionGroup: e.docsSectionGroup,
      docsSectionOrder: e.docsSectionOrder,
      showFooter: e.showFooter,
      footer: e.footer,
      aiChat: e.aiChat
    } : null;
  }, "handler")
}), F = h({
  args: {
    pages: o.array(
      o.object({
        slug: o.string(),
        title: o.string(),
        content: o.string(),
        published: o.boolean(),
        order: o.optional(o.number()),
        showInNav: o.optional(o.boolean()),
        excerpt: o.optional(o.string()),
        image: o.optional(o.string()),
        showImageAtTop: o.optional(o.boolean()),
        featured: o.optional(o.boolean()),
        featuredOrder: o.optional(o.number()),
        authorName: o.optional(o.string()),
        authorImage: o.optional(o.string()),
        layout: o.optional(o.string()),
        rightSidebar: o.optional(o.boolean()),
        showFooter: o.optional(o.boolean()),
        footer: o.optional(o.string()),
        showSocialFooter: o.optional(o.boolean()),
        aiChat: o.optional(o.boolean()),
        contactForm: o.optional(o.boolean()),
        newsletter: o.optional(o.boolean()),
        textAlign: o.optional(o.string()),
        docsSection: o.optional(o.boolean()),
        docsSectionGroup: o.optional(o.string()),
        docsSectionOrder: o.optional(o.number()),
        docsSectionGroupOrder: o.optional(o.number()),
        docsSectionGroupIcon: o.optional(o.string()),
        docsLanding: o.optional(o.boolean())
      })
    )
  },
  returns: o.object({
    created: o.number(),
    updated: o.number(),
    deleted: o.number(),
    skipped: o.number()
  }),
  handler: /* @__PURE__ */ d(async (a, l) => {
    let e = 0, r = 0, t = 0, i = 0, s = Date.now(), c = new Set(l.pages.map((n) => n.slug)), p = await a.db.query("pages").collect(), m = new Map(p.map((n) => [n.slug, n]));
    for (let n of l.pages) {
      let u = m.get(n.slug);
      if (u) {
        if (u.source === "dashboard") {
          i++;
          continue;
        }
        await a.scheduler.runAfter(0, b.versions.createVersion, {
          contentType: "page",
          contentId: u._id,
          slug: u.slug,
          title: u.title,
          content: u.content,
          source: "sync"
        }), await a.db.patch(u._id, {
          title: n.title,
          content: n.content,
          published: n.published,
          order: n.order,
          showInNav: n.showInNav,
          excerpt: n.excerpt,
          image: n.image,
          showImageAtTop: n.showImageAtTop,
          featured: n.featured,
          featuredOrder: n.featuredOrder,
          authorName: n.authorName,
          authorImage: n.authorImage,
          layout: n.layout,
          rightSidebar: n.rightSidebar,
          showFooter: n.showFooter,
          footer: n.footer,
          showSocialFooter: n.showSocialFooter,
          aiChat: n.aiChat,
          contactForm: n.contactForm,
          newsletter: n.newsletter,
          textAlign: n.textAlign,
          docsSection: n.docsSection,
          docsSectionGroup: n.docsSectionGroup,
          docsSectionOrder: n.docsSectionOrder,
          docsSectionGroupOrder: n.docsSectionGroupOrder,
          docsSectionGroupIcon: n.docsSectionGroupIcon,
          docsLanding: n.docsLanding,
          source: "sync",
          lastSyncedAt: s
        }), r++;
      } else
        await a.db.insert("pages", {
          ...n,
          source: "sync",
          lastSyncedAt: s
        }), e++;
    }
    for (let n of p)
      !c.has(n.slug) && n.source !== "dashboard" && (await a.db.delete(n._id), t++);
    return { created: e, updated: r, deleted: t, skipped: i };
  }, "handler")
});
export {
  y as getAllPages,
  N as getDocsLandingPage,
  _ as getDocsPages,
  x as getFeaturedPages,
  O as getPageBySlug,
  I as listAll,
  F as syncPagesPublic
};
//# sourceMappingURL=pages.js.map
