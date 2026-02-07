import {
  a as l,
  c as s
} from "./_deps/AJORQ7CY.js";
import {
  b as p
} from "./_deps/Y2CE7CMW.js";
import {
  a,
  b as o
} from "./_deps/M2D6NT5W.js";

// convex/cms.ts
var u = o.object({
  slug: o.string(),
  title: o.string(),
  description: o.string(),
  content: o.string(),
  date: o.string(),
  published: o.boolean(),
  tags: o.array(o.string()),
  readTime: o.optional(o.string()),
  image: o.optional(o.string()),
  showImageAtTop: o.optional(o.boolean()),
  excerpt: o.optional(o.string()),
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
  blogFeatured: o.optional(o.boolean()),
  newsletter: o.optional(o.boolean()),
  contactForm: o.optional(o.boolean()),
  unlisted: o.optional(o.boolean()),
  docsSection: o.optional(o.boolean()),
  docsSectionGroup: o.optional(o.string()),
  docsSectionOrder: o.optional(o.number()),
  docsSectionGroupOrder: o.optional(o.number()),
  docsSectionGroupIcon: o.optional(o.string()),
  docsLanding: o.optional(o.boolean())
}), c = o.object({
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
}), b = s({
  args: { post: u },
  returns: o.id("posts"),
  handler: /* @__PURE__ */ a(async (i, n) => {
    if (await i.db.query("posts").withIndex("by_slug", (r) => r.eq("slug", n.post.slug)).first())
      throw new Error(`Post with slug "${n.post.slug}" already exists`);
    return await i.db.insert("posts", {
      ...n.post,
      source: "dashboard",
      lastSyncedAt: Date.now()
    });
  }, "handler")
}), w = s({
  args: {
    id: o.id("posts"),
    post: o.object({
      slug: o.optional(o.string()),
      title: o.optional(o.string()),
      description: o.optional(o.string()),
      content: o.optional(o.string()),
      date: o.optional(o.string()),
      published: o.optional(o.boolean()),
      tags: o.optional(o.array(o.string())),
      readTime: o.optional(o.string()),
      image: o.optional(o.string()),
      showImageAtTop: o.optional(o.boolean()),
      excerpt: o.optional(o.string()),
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
      blogFeatured: o.optional(o.boolean()),
      newsletter: o.optional(o.boolean()),
      contactForm: o.optional(o.boolean()),
      unlisted: o.optional(o.boolean()),
      docsSection: o.optional(o.boolean()),
      docsSectionGroup: o.optional(o.string()),
      docsSectionOrder: o.optional(o.number()),
      docsSectionGroupOrder: o.optional(o.number()),
      docsSectionGroupIcon: o.optional(o.string()),
      docsLanding: o.optional(o.boolean())
    })
  },
  returns: o.null(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    let t = await i.db.get(n.id);
    if (!t)
      throw new Error("Post not found");
    let e = n.post.slug;
    if (e && e !== t.slug && await i.db.query("posts").withIndex("by_slug", (d) => d.eq("slug", e)).first())
      throw new Error(`Post with slug "${e}" already exists`);
    return await i.scheduler.runAfter(0, p.versions.createVersion, {
      contentType: "post",
      contentId: n.id,
      slug: t.slug,
      title: t.title,
      content: t.content,
      description: t.description,
      source: "dashboard"
    }), await i.db.patch(n.id, {
      ...n.post,
      lastSyncedAt: Date.now()
    }), null;
  }, "handler")
}), m = s({
  args: { id: o.id("posts") },
  returns: o.null(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    if (!await i.db.get(n.id))
      throw new Error("Post not found");
    return await i.db.delete(n.id), null;
  }, "handler")
}), S = s({
  args: { page: c },
  returns: o.id("pages"),
  handler: /* @__PURE__ */ a(async (i, n) => {
    if (await i.db.query("pages").withIndex("by_slug", (r) => r.eq("slug", n.page.slug)).first())
      throw new Error(`Page with slug "${n.page.slug}" already exists`);
    return await i.db.insert("pages", {
      ...n.page,
      source: "dashboard",
      lastSyncedAt: Date.now()
    });
  }, "handler")
}), $ = s({
  args: {
    id: o.id("pages"),
    page: o.object({
      slug: o.optional(o.string()),
      title: o.optional(o.string()),
      content: o.optional(o.string()),
      published: o.optional(o.boolean()),
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
  },
  returns: o.null(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    let t = await i.db.get(n.id);
    if (!t)
      throw new Error("Page not found");
    let e = n.page.slug;
    if (e && e !== t.slug && await i.db.query("pages").withIndex("by_slug", (d) => d.eq("slug", e)).first())
      throw new Error(`Page with slug "${e}" already exists`);
    return await i.scheduler.runAfter(0, p.versions.createVersion, {
      contentType: "page",
      contentId: n.id,
      slug: t.slug,
      title: t.title,
      content: t.content,
      source: "dashboard"
    }), await i.db.patch(n.id, {
      ...n.page,
      lastSyncedAt: Date.now()
    }), null;
  }, "handler")
}), I = s({
  args: { id: o.id("pages") },
  returns: o.null(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    if (!await i.db.get(n.id))
      throw new Error("Page not found");
    return await i.db.delete(n.id), null;
  }, "handler")
}), y = l({
  args: { id: o.id("posts") },
  returns: o.string(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    let t = await i.db.get(n.id);
    if (!t)
      throw new Error("Post not found");
    let e = ["---"];
    return e.push(`title: "${t.title.replace(/"/g, '\\"')}"`), e.push(`description: "${t.description.replace(/"/g, '\\"')}"`), e.push(`date: "${t.date}"`), e.push(`slug: "${t.slug}"`), e.push(`published: ${t.published}`), e.push(`tags: [${t.tags.map((r) => `"${r}"`).join(", ")}]`), t.readTime && e.push(`readTime: "${t.readTime}"`), t.image && e.push(`image: "${t.image}"`), t.showImageAtTop !== void 0 && e.push(`showImageAtTop: ${t.showImageAtTop}`), t.excerpt && e.push(`excerpt: "${t.excerpt.replace(/"/g, '\\"')}"`), t.featured !== void 0 && e.push(`featured: ${t.featured}`), t.featuredOrder !== void 0 && e.push(`featuredOrder: ${t.featuredOrder}`), t.authorName && e.push(`authorName: "${t.authorName}"`), t.authorImage && e.push(`authorImage: "${t.authorImage}"`), t.layout && e.push(`layout: "${t.layout}"`), t.rightSidebar !== void 0 && e.push(`rightSidebar: ${t.rightSidebar}`), t.showFooter !== void 0 && e.push(`showFooter: ${t.showFooter}`), t.footer && e.push(`footer: "${t.footer.replace(/"/g, '\\"')}"`), t.showSocialFooter !== void 0 && e.push(`showSocialFooter: ${t.showSocialFooter}`), t.aiChat !== void 0 && e.push(`aiChat: ${t.aiChat}`), t.blogFeatured !== void 0 && e.push(`blogFeatured: ${t.blogFeatured}`), t.newsletter !== void 0 && e.push(`newsletter: ${t.newsletter}`), t.contactForm !== void 0 && e.push(`contactForm: ${t.contactForm}`), t.unlisted !== void 0 && e.push(`unlisted: ${t.unlisted}`), t.docsSection !== void 0 && e.push(`docsSection: ${t.docsSection}`), t.docsSectionGroup && e.push(`docsSectionGroup: "${t.docsSectionGroup}"`), t.docsSectionOrder !== void 0 && e.push(`docsSectionOrder: ${t.docsSectionOrder}`), t.docsSectionGroupOrder !== void 0 && e.push(`docsSectionGroupOrder: ${t.docsSectionGroupOrder}`), t.docsSectionGroupIcon && e.push(`docsSectionGroupIcon: "${t.docsSectionGroupIcon}"`), t.docsLanding !== void 0 && e.push(`docsLanding: ${t.docsLanding}`), e.push("---"), `${e.join(`
`)}

${t.content}`;
  }, "handler")
}), F = l({
  args: { id: o.id("pages") },
  returns: o.string(),
  handler: /* @__PURE__ */ a(async (i, n) => {
    let t = await i.db.get(n.id);
    if (!t)
      throw new Error("Page not found");
    let e = ["---"];
    return e.push(`title: "${t.title.replace(/"/g, '\\"')}"`), e.push(`slug: "${t.slug}"`), e.push(`published: ${t.published}`), t.order !== void 0 && e.push(`order: ${t.order}`), t.showInNav !== void 0 && e.push(`showInNav: ${t.showInNav}`), t.excerpt && e.push(`excerpt: "${t.excerpt.replace(/"/g, '\\"')}"`), t.image && e.push(`image: "${t.image}"`), t.showImageAtTop !== void 0 && e.push(`showImageAtTop: ${t.showImageAtTop}`), t.featured !== void 0 && e.push(`featured: ${t.featured}`), t.featuredOrder !== void 0 && e.push(`featuredOrder: ${t.featuredOrder}`), t.authorName && e.push(`authorName: "${t.authorName}"`), t.authorImage && e.push(`authorImage: "${t.authorImage}"`), t.layout && e.push(`layout: "${t.layout}"`), t.rightSidebar !== void 0 && e.push(`rightSidebar: ${t.rightSidebar}`), t.showFooter !== void 0 && e.push(`showFooter: ${t.showFooter}`), t.footer && e.push(`footer: "${t.footer.replace(/"/g, '\\"')}"`), t.showSocialFooter !== void 0 && e.push(`showSocialFooter: ${t.showSocialFooter}`), t.aiChat !== void 0 && e.push(`aiChat: ${t.aiChat}`), t.contactForm !== void 0 && e.push(`contactForm: ${t.contactForm}`), t.newsletter !== void 0 && e.push(`newsletter: ${t.newsletter}`), t.textAlign && e.push(`textAlign: "${t.textAlign}"`), t.docsSection !== void 0 && e.push(`docsSection: ${t.docsSection}`), t.docsSectionGroup && e.push(`docsSectionGroup: "${t.docsSectionGroup}"`), t.docsSectionOrder !== void 0 && e.push(`docsSectionOrder: ${t.docsSectionOrder}`), t.docsSectionGroupOrder !== void 0 && e.push(`docsSectionGroupOrder: ${t.docsSectionGroupOrder}`), t.docsSectionGroupIcon && e.push(`docsSectionGroupIcon: "${t.docsSectionGroupIcon}"`), t.docsLanding !== void 0 && e.push(`docsLanding: ${t.docsLanding}`), e.push("---"), `${e.join(`
`)}

${t.content}`;
  }, "handler")
});
export {
  S as createPage,
  b as createPost,
  I as deletePage,
  m as deletePost,
  F as exportPageAsMarkdown,
  y as exportPostAsMarkdown,
  $ as updatePage,
  w as updatePost
};
//# sourceMappingURL=cms.js.map
