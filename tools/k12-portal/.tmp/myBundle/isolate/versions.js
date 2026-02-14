import {
  a as i,
  c,
  d
} from "./_deps/AJORQ7CY.js";
import {
  a as r,
  b as e
} from "./_deps/M2D6NT5W.js";

// convex/versions.ts
var p = 4320 * 60 * 1e3, y = i({
  args: {},
  returns: e.boolean(),
  handler: /* @__PURE__ */ r(async (o) => (await o.db.query("versionControlSettings").withIndex("by_key", (t) => t.eq("key", "enabled")).first())?.value === !0, "handler")
}), w = c({
  args: { enabled: e.boolean() },
  returns: e.null(),
  handler: /* @__PURE__ */ r(async (o, s) => {
    let t = await o.db.query("versionControlSettings").withIndex("by_key", (n) => n.eq("key", "enabled")).first();
    return t ? await o.db.patch(t._id, { value: s.enabled }) : await o.db.insert("versionControlSettings", {
      key: "enabled",
      value: s.enabled
    }), null;
  }, "handler")
}), I = d({
  args: {
    contentType: e.union(e.literal("post"), e.literal("page")),
    contentId: e.string(),
    slug: e.string(),
    title: e.string(),
    content: e.string(),
    description: e.optional(e.string()),
    source: e.union(
      e.literal("sync"),
      e.literal("dashboard"),
      e.literal("restore")
    )
  },
  returns: e.union(e.id("contentVersions"), e.null()),
  handler: /* @__PURE__ */ r(async (o, s) => (await o.db.query("versionControlSettings").withIndex("by_key", (a) => a.eq("key", "enabled")).first())?.value !== !0 ? null : await o.db.insert("contentVersions", {
    contentType: s.contentType,
    contentId: s.contentId,
    slug: s.slug,
    title: s.title,
    content: s.content,
    description: s.description,
    createdAt: Date.now(),
    source: s.source
  }), "handler")
}), h = i({
  args: {
    contentType: e.union(e.literal("post"), e.literal("page")),
    contentId: e.string()
  },
  returns: e.array(
    e.object({
      _id: e.id("contentVersions"),
      title: e.string(),
      createdAt: e.number(),
      source: e.union(
        e.literal("sync"),
        e.literal("dashboard"),
        e.literal("restore")
      ),
      contentPreview: e.string()
    })
  ),
  handler: /* @__PURE__ */ r(async (o, s) => (await o.db.query("contentVersions").withIndex(
    "by_content",
    (n) => n.eq("contentType", s.contentType).eq("contentId", s.contentId)
  ).order("desc").collect()).map((n) => ({
    _id: n._id,
    title: n.title,
    createdAt: n.createdAt,
    source: n.source,
    contentPreview: n.content.slice(0, 150) + (n.content.length > 150 ? "..." : "")
  })), "handler")
}), m = i({
  args: { versionId: e.id("contentVersions") },
  returns: e.union(
    e.object({
      _id: e.id("contentVersions"),
      contentType: e.union(e.literal("post"), e.literal("page")),
      contentId: e.string(),
      slug: e.string(),
      title: e.string(),
      content: e.string(),
      description: e.optional(e.string()),
      createdAt: e.number(),
      source: e.union(
        e.literal("sync"),
        e.literal("dashboard"),
        e.literal("restore")
      )
    }),
    e.null()
  ),
  handler: /* @__PURE__ */ r(async (o, s) => {
    let t = await o.db.get(s.versionId);
    return t ? {
      _id: t._id,
      contentType: t.contentType,
      contentId: t.contentId,
      slug: t.slug,
      title: t.title,
      content: t.content,
      description: t.description,
      createdAt: t.createdAt,
      source: t.source
    } : null;
  }, "handler")
}), V = c({
  args: { versionId: e.id("contentVersions") },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ r(async (o, s) => {
    let t = await o.db.get(s.versionId);
    if (!t)
      return { success: !1, message: "Version not found" };
    let n;
    return t.contentType === "post" ? n = await o.db.get(
      t.contentId
    ) : n = await o.db.get(
      t.contentId
    ), n ? (await o.db.insert("contentVersions", {
      contentType: t.contentType,
      contentId: t.contentId,
      slug: t.slug,
      title: n.title,
      content: n.content,
      description: "description" in n ? n.description : void 0,
      createdAt: Date.now(),
      source: "restore"
    }), t.contentType === "post" ? await o.db.patch(t.contentId, {
      title: t.title,
      content: t.content,
      description: t.description || "",
      lastSyncedAt: Date.now()
    }) : await o.db.patch(t.contentId, {
      title: t.title,
      content: t.content,
      lastSyncedAt: Date.now()
    }), { success: !0, message: "Version restored successfully" }) : { success: !1, message: "Original content not found" };
  }, "handler")
}), f = d({
  args: {},
  returns: e.number(),
  handler: /* @__PURE__ */ r(async (o) => {
    let s = Date.now() - p, t = await o.db.query("contentVersions").withIndex("by_createdAt", (n) => n.lt("createdAt", s)).take(1e3);
    return await Promise.all(t.map((n) => o.db.delete(n._id))), t.length;
  }, "handler")
}), v = i({
  args: {},
  returns: e.object({
    enabled: e.boolean(),
    totalVersions: e.number(),
    oldestVersion: e.union(e.number(), e.null()),
    newestVersion: e.union(e.number(), e.null())
  }),
  handler: /* @__PURE__ */ r(async (o) => {
    let s = await o.db.query("versionControlSettings").withIndex("by_key", (l) => l.eq("key", "enabled")).first(), t = await o.db.query("contentVersions").collect(), n = t.map((l) => l.createdAt), a = n.length > 0 ? Math.min(...n) : null, u = n.length > 0 ? Math.max(...n) : null;
    return {
      enabled: s?.value === !0,
      totalVersions: t.length,
      oldestVersion: a,
      newestVersion: u
    };
  }, "handler")
});
export {
  f as cleanupOldVersions,
  I as createVersion,
  v as getStats,
  m as getVersion,
  h as getVersionHistory,
  y as isEnabled,
  V as restoreVersion,
  w as setEnabled
};
//# sourceMappingURL=versions.js.map
