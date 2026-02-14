import {
  a as s,
  c as p,
  e as l
} from "./_deps/AJORQ7CY.js";
import {
  b as d,
  c as n
} from "./_deps/LFQTZ6CE.js";
import "./_deps/Y2CE7CMW.js";
import {
  a as i,
  b as e,
  i as c
} from "./_deps/M2D6NT5W.js";

// convex/files.ts
var f = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp"
], h = 10 * 1024 * 1024, x = s({
  args: {},
  handler: /* @__PURE__ */ i(async () => ({ configured: d }), "handler")
}), y = l({
  args: {
    blobId: e.string(),
    filename: e.string(),
    contentType: e.string(),
    size: e.number(),
    width: e.optional(e.number()),
    height: e.optional(e.number())
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      throw new Error(
        "Media uploads not configured. Set BUNNY_API_KEY, BUNNY_STORAGE_ZONE, and BUNNY_CDN_HOSTNAME in Convex Dashboard."
      );
    if (!f.includes(t.contentType))
      throw new Error(
        `Invalid file type: ${t.contentType}. Allowed: ${f.join(", ")}`
      );
    if (t.size > h)
      throw new Error(
        `File too large: ${(t.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`
      );
    let o = t.filename.replace(/[^a-zA-Z0-9.-]/g, "-").replace(/-+/g, "-").toLowerCase(), u = `/uploads/${Date.now()}-${o}`;
    return await n.commitFiles(r, [{ path: u, blobId: t.blobId }]), {
      path: u,
      filename: o,
      contentType: t.contentType,
      size: t.size,
      width: t.width,
      height: t.height
    };
  }, "handler")
}), E = s({
  args: {
    prefix: e.optional(e.string()),
    paginationOpts: c
  },
  handler: /* @__PURE__ */ i(async (r, t) => n ? await n.list(r, {
    prefix: t.prefix ?? "/uploads/",
    paginationOpts: t.paginationOpts
  }) : {
    page: [],
    isDone: !0,
    continueCursor: ""
  }, "handler")
}), I = s({
  args: { path: e.string() },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      return null;
    let o = await n.stat(r, t.path);
    return o ? {
      path: o.path,
      blobId: o.blobId,
      contentType: o.contentType,
      size: o.size
    } : null;
  }, "handler")
}), F = l({
  args: { path: e.string() },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      throw new Error("Media uploads not configured");
    let o = await n.stat(r, t.path);
    if (!o)
      throw new Error("File not found");
    return { url: await n.getDownloadUrl(r, o.blobId), expiresIn: 3600 };
  }, "handler")
}), M = p({
  args: { path: e.string() },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      throw new Error("Media uploads not configured");
    return await n.delete(r, t.path), { success: !0 };
  }, "handler")
}), N = p({
  args: { paths: e.array(e.string()) },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      throw new Error("Media uploads not configured");
    let o = 0;
    for (let a of t.paths)
      await n.delete(r, a), o++;
    return { success: !0, deleted: o };
  }, "handler")
}), T = l({
  args: {
    path: e.string(),
    expiresInMs: e.optional(e.number())
    // null to remove expiration
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    if (!n)
      throw new Error("Media uploads not configured");
    let o = await n.stat(r, t.path);
    if (!o)
      throw new Error("File not found");
    let a = t.expiresInMs ? Date.now() + t.expiresInMs : null;
    return await n.transact(r, [
      {
        op: "setAttributes",
        source: o,
        attributes: { expiresAt: a }
      }
    ]), { success: !0, expiresAt: a };
  }, "handler")
}), z = s({
  args: {},
  handler: /* @__PURE__ */ i(async (r) => n ? (await n.list(r, {
    prefix: "/uploads/",
    paginationOpts: { numItems: 1e3, cursor: null }
  })).page.length : 0, "handler")
});
export {
  y as commitFile,
  M as deleteFile,
  N as deleteFiles,
  F as getDownloadUrl,
  z as getFileCount,
  I as getFileInfo,
  x as isConfigured,
  E as listFiles,
  T as setFileExpiration
};
//# sourceMappingURL=files.js.map
