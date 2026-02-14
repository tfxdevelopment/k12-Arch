import {
  c as _
} from "./Y2CE7CMW.js";
import {
  a as g,
  b as n,
  h as O,
  l as S,
  m as j
} from "./M2D6NT5W.js";

// node_modules/convex-helpers/server/cors.js
var k = [
  // For Range requests
  "Content-Range",
  "Accept-Ranges"
], M = /* @__PURE__ */ g((s, e) => {
  let t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  return {
    http: s,
    route: /* @__PURE__ */ g((o) => {
      let a = j();
      a.exactRoutes = s.exactRoutes, a.prefixRoutes = s.prefixRoutes;
      let u = {
        ...e,
        ...o
      }, w = H({
        originalHandler: o.handler,
        allowedMethods: [o.method],
        ...u
      });
      if ("path" in o) {
        let i = t.get(o.path);
        i || (i = /* @__PURE__ */ new Set(), t.set(o.path, i)), i.add(o.method), a.route({
          path: o.path,
          method: o.method,
          handler: w
        }), F(a, o, u, Array.from(i));
      } else {
        let i = r.get(o.pathPrefix);
        i || (i = /* @__PURE__ */ new Set(), r.set(o.pathPrefix, i)), i.add(o.method), a.route({
          pathPrefix: o.pathPrefix,
          method: o.method,
          handler: w
        }), v(a, o, u, Array.from(i));
      }
      s.exactRoutes = new Map(a.exactRoutes), s.prefixRoutes = new Map(a.prefixRoutes);
    }, "route")
  };
}, "corsRouter");
function F(s, e, t, r) {
  let o = s.exactRoutes.get(e.path), a = I(r, t);
  o?.set("OPTIONS", a), s.exactRoutes.set(e.path, new Map(o));
}
g(F, "handleExactRoute");
function v(s, e, t, r) {
  let o = I(r, t), a = s.prefixRoutes.get("OPTIONS") || /* @__PURE__ */ new Map();
  a.set(e.pathPrefix, o), s.prefixRoutes.set("OPTIONS", a);
}
g(v, "handlePrefixRoute");
function I(s, e) {
  return H({
    ...e,
    allowedMethods: s
  });
}
g(I, "createOptionsHandlerForMethods");
var K = 3600 * 24, H = /* @__PURE__ */ g(({ originalHandler: s, allowedMethods: e = ["OPTIONS"], allowedOrigins: t = ["*"], allowedHeaders: r = ["Content-Type"], exposedHeaders: o = k, allowCredentials: a = !1, browserCacheMaxAge: u = K, enforceAllowOrigins: w = !1, debug: i = !1 }) => {
  let c = Array.from(new Set(e.map((y) => y.toUpperCase()))).filter((y) => S.includes(y));
  if (c.length === 0)
    throw new Error("No valid HTTP methods provided");
  let l = c.includes("OPTIONS") ? c.join(", ") : [...c].join(", "), d = {
    Vary: "Origin"
  };
  a && (d["Access-Control-Allow-Credentials"] = "true"), o.length > 0 && (d["Access-Control-Expose-Headers"] = o.join(", "));
  async function h(y) {
    return Array.isArray(t) ? t : await t(y);
  }
  g(h, "parseAllowedOrigins");
  async function b(y) {
    let f = y.headers.get("origin");
    return f ? (await h(y)).some((m) => {
      if (m === "*" || m === f)
        return !0;
      if (m.startsWith("*.")) {
        let T = m.slice(1), x = m.slice(2);
        try {
          let U = new URL(f);
          return U.protocol === "https:" && (U.hostname.endsWith(T) || U.hostname === x);
        } catch {
          return !1;
        }
      }
      return !1;
    }) : !1;
  }
  return g(b, "isAllowedOrigin"), O(async (y, f) => {
    i && console.log("CORS request", {
      path: f.url,
      origin: f.headers.get("origin"),
      headers: f.headers,
      method: f.method,
      body: f.body
    });
    let m = f.headers.get("origin"), T = await h(f);
    i && console.log("allowed origins", T);
    let x = null;
    if ((T.includes("*") && m && !a || m && await b(f)) && (x = m), w && !x)
      return console.error(`Request from origin ${m} blocked, missing from allowed origins: ${T.join()}`), new Response(null, { status: 403 });
    if (f.method === "OPTIONS") {
      let N = new Headers({
        ...d,
        ...x ? { "Access-Control-Allow-Origin": x } : {},
        "Access-Control-Allow-Methods": l,
        "Access-Control-Allow-Headers": r.join(", "),
        "Access-Control-Max-Age": u.toString()
      });
      return i && console.log("CORS OPTIONS response headers", N), new Response(null, {
        status: 204,
        headers: N
      });
    }
    if (!s)
      throw new Error("No PublicHttpAction provider to CORS handler");
    let R = await ("_handler" in s ? s._handler : s)(y, f), A = new Headers(R.headers);
    return x && A.set("Access-Control-Allow-Origin", x), Object.entries(d).forEach(([N, L]) => {
      A.set(N, L);
    }), i && console.log("CORS response headers", A), new Response(R.body, {
      status: R.status,
      statusText: R.statusText,
      headers: A
    });
  });
}, "handleCors");

// node_modules/convex-fs/dist/blobstore/bunny.js
async function J(s, e, t, r, o) {
  let a = Math.floor(Date.now() / 1e3) + r, u = "";
  o && Object.keys(o).length > 0 && (u = Object.entries(o).sort(([y], [f]) => y.localeCompare(f)).map(([y, f]) => `${y}=${encodeURIComponent(f)}`).join("&"));
  let w = u ? `${t}${e}${a}${u}` : `${t}${e}${a}`, p = new TextEncoder().encode(w), c = await crypto.subtle.digest("SHA-256", p), l = new Uint8Array(c), d = btoa(String.fromCharCode(...l)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""), h = `${s}${e}?token=${d}&expires=${a}`;
  return u && (h += `&${u}`), h;
}
g(J, "signBunnyUrl");
function $(s) {
  let { apiKey: e, storageZoneName: t, region: r = "", cdnHostname: o, tokenKey: a } = s, u = r ? `${r}.storage.bunnycdn.com` : "storage.bunnycdn.com", w = `https://${o}`;
  function i(p) {
    return `https://${u}/${t}/${p}`;
  }
  return g(i, "buildStorageUrl"), {
    async generateUploadUrl(p, c) {
      throw new Error("Bunny.net storage does not support presigned upload URLs. Use the HTTP upload proxy endpoint instead.");
    },
    async generateDownloadUrl(p, c) {
      let l = `/${p}`;
      if (a) {
        let d = c?.expiresIn ?? 3600;
        return J(w, l, a, d, c?.extraParams);
      }
      if (c?.extraParams && Object.keys(c.extraParams).length > 0) {
        let d = Object.entries(c.extraParams).map(([h, b]) => `${h}=${encodeURIComponent(b)}`).join("&");
        return `${w}${l}?${d}`;
      }
      return `${w}${l}`;
    },
    async put(p, c, l) {
      let d = i(p), h = l?.contentType ?? "application/octet-stream", b = {
        AccessKey: e,
        "Content-Type": h
      };
      l?.contentLength !== void 0 && (b["Content-Length"] = String(l.contentLength));
      let y, f = {
        method: "PUT",
        headers: b
      };
      c instanceof ReadableStream ? (y = c, f.duplex = "half") : c instanceof Uint8Array ? y = new Blob([new Uint8Array(c).buffer]) : y = c, f.body = y;
      let m = await fetch(d, f);
      if (!m.ok) {
        let T = await m.text().catch(() => "");
        throw new Error(`Failed to put blob to Bunny: ${m.status} ${m.statusText}${T ? ` - ${T}` : ""}`);
      }
    },
    async get(p) {
      let c = i(p), l = await fetch(c, {
        method: "GET",
        headers: {
          AccessKey: e
        }
      });
      if (l.status === 404)
        return null;
      if (!l.ok) {
        let d = await l.text().catch(() => "");
        throw new Error(`Failed to get blob from Bunny: ${l.status} ${l.statusText}${d ? ` - ${d}` : ""}`);
      }
      return l.blob();
    },
    async delete(p) {
      let c = i(p), l = await fetch(c, {
        method: "DELETE",
        headers: {
          AccessKey: e
        }
      });
      if (l.status === 404)
        return { status: "not_found" };
      if (!l.ok) {
        let d = await l.text().catch(() => "");
        throw new Error(`Failed to delete blob from Bunny: ${l.status} ${l.statusText}${d ? ` - ${d}` : ""}`);
      }
      return { status: "deleted" };
    }
  };
}
g($, "createBunnyBlobStore");

// node_modules/convex-fs/dist/blobstore/test.js
function E() {
  let s = /* @__PURE__ */ new Map();
  return {
    _blobs: s,
    async generateUploadUrl() {
      throw new Error("Test store does not support presigned upload URLs. Use put() directly.");
    },
    async generateDownloadUrl(e, t) {
      let r = `test://${e}`;
      if (t?.extraParams && Object.keys(t.extraParams).length > 0) {
        let o = Object.entries(t.extraParams).map(([a, u]) => `${a}=${encodeURIComponent(u)}`).join("&");
        r += `?${o}`;
      }
      return r;
    },
    async put(e, t, r) {
      let o;
      if (t instanceof ReadableStream) {
        let a = [], u = t.getReader();
        for (; ; ) {
          let { done: p, value: c } = await u.read();
          if (p)
            break;
          a.push(c);
        }
        let w = a.reduce((p, c) => p + c.length, 0);
        o = new Uint8Array(w);
        let i = 0;
        for (let p of a)
          o.set(p, i), i += p.length;
      } else t instanceof Blob ? o = new Uint8Array(await t.arrayBuffer()) : o = t;
      s.set(e, {
        data: o,
        contentType: r?.contentType ?? "application/octet-stream"
      });
    },
    async get(e) {
      let t = s.get(e);
      return t ? new Blob([t.data.buffer], {
        type: t.contentType
      }) : null;
    },
    async delete(e) {
      return s.has(e) ? (s.delete(e), { status: "deleted" }) : { status: "not_found" };
    }
  };
}
g(E, "createTestBlobStore");

// node_modules/convex-fs/dist/blobstore/index.js
function B(s) {
  switch (s.type) {
    case "bunny":
      return $({
        apiKey: s.apiKey,
        storageZoneName: s.storageZoneName,
        region: s.region,
        cdnHostname: s.cdnHostname,
        tokenKey: s.tokenKey
      });
    case "test":
      return E();
    default:
      throw new Error(`Unknown storage type: ${s.type}`);
  }
}
g(B, "createBlobStore");

// node_modules/convex-fs/dist/component/types.js
var V = n.object({
  type: n.literal("bunny"),
  apiKey: n.string(),
  storageZoneName: n.string(),
  region: n.optional(n.string()),
  cdnHostname: n.string(),
  // Full hostname, e.g., "myzone.b-cdn.net" or custom domain
  tokenKey: n.optional(n.string())
  // For token-authenticated Pull Zones
}), Y = n.object({
  type: n.literal("test")
}), G = n.union(V, Y), wt = n.object({
  // Storage backend configuration
  storage: G,
  // Download URL TTL in seconds (defaults to 3600 / 1 hour)
  downloadUrlTtl: n.optional(n.number()),
  // GC configuration
  blobGracePeriod: n.optional(n.number())
  // seconds before orphaned blobs are deleted, defaults to 86400 (24 hours)
  // NOTE: freezeGc is a dashboard-only field (not in client config) - set it manually
  // in the config table to freeze all GC jobs for emergency investigation/recovery
}), Z = n.object({
  expiresAt: n.optional(n.number())
  // Unix timestamp (ms) when file expires
}), C = n.object({
  path: n.string(),
  blobId: n.string(),
  contentType: n.string(),
  size: n.number(),
  attributes: n.optional(Z)
}), z = n.object({
  expiresAt: n.optional(n.union(n.null(), n.number()))
}), D = n.object({
  path: n.string(),
  basis: n.optional(n.union(n.null(), n.string()))
}), Q = n.object({
  op: n.literal("move"),
  source: C,
  dest: D
}), W = n.object({
  op: n.literal("copy"),
  source: C,
  dest: D
}), X = n.object({
  op: n.literal("delete"),
  source: C
}), q = n.object({
  op: n.literal("setAttributes"),
  source: C,
  attributes: z
}), mt = n.union(Q, W, X, q);

// node_modules/convex-fs/dist/client/index.js
var P = class {
  static {
    g(this, "ConvexFS");
  }
  component;
  options;
  constructor(e, t) {
    this.component = e, this.options = t;
  }
  /**
   * Build config from options.
   * Used internally and by registerRoutes for the upload proxy.
   */
  get config() {
    return {
      storage: this.options.storage,
      downloadUrlTtl: this.options.downloadUrlTtl,
      blobGracePeriod: this.options.blobGracePeriod
    };
  }
  // ============================================================================
  // Actions
  // ============================================================================
  /**
   * Commit uploaded blobs to file paths.
   *
   * This atomically creates/updates file records for previously uploaded blobs.
   *
   * @param files - Array of file commits with path, blobId, and optional basis for CAS
   *
   * The `basis` field controls overwrite behavior:
   * - `undefined`: No check - silently overwrite if file exists
   * - `null`: File must not exist (fails if file exists)
   * - `string`: File's current blobId must match (CAS update)
   *
   * @example
   * ```typescript
   * // Simple commit - overwrites if exists (after uploading via /fs/upload endpoint)
   * await fs.commitFiles(ctx, [
   *   { path: "/uploads/file.txt", blobId },
   * ]);
   *
   * // Create only - fails if file already exists
   * await fs.commitFiles(ctx, [
   *   { path: "/uploads/file.txt", blobId, basis: null },
   * ]);
   *
   * // CAS update - only succeeds if current blobId matches basis
   * await fs.commitFiles(ctx, [
   *   { path: "/uploads/file.txt", blobId: newBlobId, basis: oldBlobId },
   * ]);
   * ```
   */
  async commitFiles(e, t) {
    await e.runMutation(this.component.lib.commitFiles, {
      config: this.config,
      files: t
    });
  }
  /**
   * Get a download URL for a blob.
   *
   * For Bunny storage with token authentication, this generates a signed CDN URL.
   * Without token authentication, returns an unsigned CDN URL.
   *
   * @param blobId - The blob identifier
   * @returns Download URL
   *
   * @example
   * ```typescript
   * const file = await fs.stat(ctx, "/uploads/file.txt");
   * if (file) {
   *   const url = await fs.getDownloadUrl(ctx, file.blobId);
   *   // Return URL to client for download
   * }
   * ```
   */
  async getDownloadUrl(e, t, r) {
    return await e.runAction(this.component.lib.getDownloadUrl, {
      config: this.config,
      blobId: t,
      extraParams: r?.extraParams
    });
  }
  /**
   * Get a blob's raw data by blobId.
   *
   * This fetches the download URL from the component, then downloads
   * the blob directly from storage in the caller's execution context.
   * Returns null if the blob doesn't exist.
   *
   * @param blobId - The blob identifier
   * @returns ArrayBuffer of blob data, or null if not found
   *
   * @example
   * ```typescript
   * const data = await fs.getBlob(ctx, blobId);
   * if (data) {
   *   // Process the ArrayBuffer...
   *   const text = new TextDecoder().decode(data);
   * }
   * ```
   */
  async getBlob(e, t) {
    let r = await this.getDownloadUrl(e, t), o = await fetch(r);
    if (o.status === 404)
      return null;
    if (!o.ok)
      throw new Error(`Failed to fetch blob: ${o.status} ${o.statusText}`);
    return o.arrayBuffer();
  }
  /**
   * Get a file's contents and metadata by path.
   *
   * This looks up the file metadata, fetches the download URL,
   * then downloads the blob directly from storage in the caller's
   * execution context. Returns null if the file doesn't exist.
   *
   * @param path - The file path
   * @returns Object with data, contentType, and size, or null if not found
   *
   * @example
   * ```typescript
   * const result = await fs.getFile(ctx, "/images/photo.jpg");
   * if (result) {
   *   console.log(result.contentType); // "image/jpeg"
   *   console.log(result.size); // 12345
   *   // result.data is an ArrayBuffer
   * }
   * ```
   */
  async getFile(e, t) {
    let r = await this.stat(e, t);
    if (!r)
      return null;
    let o = await this.getBlob(e, r.blobId);
    return o ? {
      data: o,
      contentType: r.contentType,
      size: r.size
    } : null;
  }
  /**
   * Write raw bytes to blob storage.
   *
   * This uploads data directly to the blob store in the caller's execution
   * context, then registers the pending upload with the component.
   * The returned blobId can be committed to a file path using `commitFiles()`.
   *
   * @param data - The raw bytes to upload
   * @param contentType - MIME type of the data
   * @returns The blobId for the uploaded blob
   *
   * @example
   * ```typescript
   * // Upload processed data to storage
   * const blobId = await fs.writeBlob(ctx, processedData, "image/webp");
   *
   * // Later, commit to a path
   * await fs.commitFiles(ctx, [{ path: "/output.webp", blobId }]);
   * ```
   */
  async writeBlob(e, t, r) {
    let o = this.options.storage, a = crypto.randomUUID();
    return await B(o).put(a, new Uint8Array(t), { contentType: r }), await e.runMutation(this.component.lib.registerPendingUpload, {
      config: this.config,
      blobId: a,
      contentType: r,
      size: t.byteLength
    }), a;
  }
  /**
   * Write data directly to a file path.
   *
   * This is a convenience method that uploads the blob directly to storage
   * and commits it to the given path in one call. Overwrites if the file
   * already exists.
   *
   * @param path - The file path to write to
   * @param data - The raw bytes to write
   * @param contentType - MIME type of the data
   *
   * @example
   * ```typescript
   * // Read, process, and write back
   * const input = await fs.getFile(ctx, "/images/photo.jpg");
   * const processed = await resizeImage(input.data); // your processing logic
   * await fs.writeFile(ctx, "/images/photo-thumb.webp", processed, "image/webp");
   * ```
   */
  async writeFile(e, t, r, o) {
    let a = await this.writeBlob(e, r, o);
    await this.commitFiles(e, [{ path: t, blobId: a }]);
  }
  // ============================================================================
  // Queries
  // ============================================================================
  /**
   * Get file metadata by path.
   *
   * @param path - The file path
   * @returns File metadata or null if not found
   *
   * @example
   * ```typescript
   * const file = await fs.stat(ctx, "/uploads/file.txt");
   * if (file) {
   *   console.log(file.contentType, file.size);
   * }
   * ```
   */
  async stat(e, t) {
    return await e.runQuery(this.component.lib.stat, {
      config: this.config,
      path: t
    });
  }
  /**
   * List files in the filesystem with pagination.
   *
   * Returns files sorted alphabetically by path, with optional prefix filtering
   * and cursor-based pagination.
   *
   * This method is compatible with `usePaginatedQuery` from `convex-fs/react`.
   *
   * @param options.prefix - Optional path prefix filter (e.g., "/uploads/")
   * @param options.paginationOpts - Pagination options (numItems, cursor, endCursor)
   * @returns Page of files with continuation cursor
   *
   * @example
   * ```typescript
   * // Server-side: List first page
   * const page1 = await fs.list(ctx, {
   *   prefix: "/uploads/",
   *   paginationOpts: { numItems: 50, cursor: null },
   * });
   *
   * // Server-side: Get next page
   * const page2 = await fs.list(ctx, {
   *   prefix: "/uploads/",
   *   paginationOpts: { numItems: 50, cursor: page1.continueCursor },
   * });
   *
   * // React: Use with usePaginatedQuery (in your wrapper query)
   * // See convex-fs/react for the usePaginatedQuery hook
   * ```
   */
  async list(e, t) {
    return await e.runQuery(this.component.lib.list, {
      config: this.config,
      prefix: t.prefix,
      paginationOpts: t.paginationOpts
    });
  }
  // ============================================================================
  // Mutations
  // ============================================================================
  /**
   * Execute atomic file operations (move/copy/delete/setAttributes).
   *
   * All operations are validated and applied atomically. If any operation
   * fails its preconditions (source doesn't match, dest conflict), the
   * entire transaction is rejected.
   *
   * The `dest.basis` field controls overwrite behavior:
   * - `undefined`: No check - silently overwrite if dest exists
   * - `null`: Dest must not exist (fails if file exists)
   * - `string`: Dest's current blobId must match (CAS update)
   *
   * For `setAttributes`, the attributes field uses:
   * - `undefined`: Keep existing value
   * - `null`: Clear the attribute
   * - `value`: Set to new value
   *
   * @param ops - Array of operations to execute
   *
   * @example
   * ```typescript
   * const file = await fs.stat(ctx, "/old/path.txt");
   * if (file) {
   *   // Move file, overwriting dest if it exists
   *   await fs.transact(ctx, [
   *     { op: "move", source: file, dest: { path: "/new/path.txt" } },
   *   ]);
   *
   *   // Copy file, fail if dest exists (Unix semantics)
   *   await fs.transact(ctx, [
   *     { op: "copy", source: file, dest: { path: "/copy.txt", basis: null } },
   *   ]);
   *
   *   // Delete file
   *   await fs.transact(ctx, [
   *     { op: "delete", source: file },
   *   ]);
   *
   *   // Set expiration on a file
   *   await fs.transact(ctx, [
   *     { op: "setAttributes", source: file, attributes: { expiresAt: Date.now() + 3600000 } },
   *   ]);
   *
   *   // Clear expiration from a file
   *   await fs.transact(ctx, [
   *     { op: "setAttributes", source: file, attributes: { expiresAt: null } },
   *   ]);
   * }
   * ```
   */
  async transact(e, t) {
    await e.runMutation(this.component.lib.transact, {
      config: this.config,
      ops: t
    });
  }
  // ============================================================================
  // Convenience Mutations (path-based)
  // ============================================================================
  /**
   * Copy a file to a new path.
   *
   * This is a convenience wrapper around `transact` for the common case of
   * copying a file to a path that doesn't exist.
   *
   * **Note:** This method is not safe against races because it doesn't allow
   * specifying the expected version of the source file. If you need to ensure
   * the source hasn't changed, use `transact` directly with the `source` from
   * a prior `stat` call.
   *
   * @param sourcePath - Path of the file to copy
   * @param destPath - Destination path (must not exist)
   * @throws If source file doesn't exist
   * @throws If destination already exists
   *
   * @example
   * ```typescript
   * await fs.copy(ctx, "/uploads/photo.jpg", "/backups/photo.jpg");
   * ```
   */
  async copy(e, t, r) {
    await e.runMutation(this.component.lib.copyByPath, {
      config: this.config,
      sourcePath: t,
      destPath: r
    });
  }
  /**
   * Move a file to a new path.
   *
   * This is a convenience wrapper around `transact` for the common case of
   * moving a file to a path that doesn't exist.
   *
   * **Note:** This method is not safe against races because it doesn't allow
   * specifying the expected version of the source file. If you need to ensure
   * the source hasn't changed, use `transact` directly with the `source` from
   * a prior `stat` call.
   *
   * @param sourcePath - Path of the file to move
   * @param destPath - Destination path (must not exist)
   * @throws If source file doesn't exist
   * @throws If destination already exists
   *
   * @example
   * ```typescript
   * await fs.move(ctx, "/uploads/temp.txt", "/documents/final.txt");
   * ```
   */
  async move(e, t, r) {
    await e.runMutation(this.component.lib.moveByPath, {
      config: this.config,
      sourcePath: t,
      destPath: r
    });
  }
  /**
   * Delete a file by path.
   *
   * This is a convenience wrapper around `transact` for the common case of
   * deleting a file. This operation is idempotent - if the file doesn't exist,
   * it's a no-op.
   *
   * **Note:** This method is not safe against races because it doesn't allow
   * specifying the expected version of the file. If you need to ensure the
   * file hasn't changed, use `transact` directly with the `source` from a
   * prior `stat` call.
   *
   * @param path - Path of the file to delete
   *
   * @example
   * ```typescript
   * await fs.delete(ctx, "/uploads/old-file.txt");
   * ```
   */
  async delete(e, t) {
    await e.runMutation(this.component.lib.deleteByPath, {
      config: this.config,
      path: t
    });
  }
};
function At(s, e, t, r) {
  let o = r.pathPrefix ?? "/fs", a = M(s, {
    allowedOrigins: ["*"],
    allowedHeaders: ["Content-Type", "Content-Length", "Authorization"]
  });
  a.route({
    path: o + "/upload",
    method: "POST",
    handler: O(async (u, w) => {
      try {
        if (!await r.uploadAuth(u))
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          });
      } catch {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
      let i = t.config.storage, p = w.headers.get("Content-Type") ?? "application/octet-stream", c = w.headers.get("Content-Length"), l = c ? parseInt(c, 10) : 0, d = crypto.randomUUID();
      try {
        return await B(i).put(d, w.body, {
          contentType: p,
          contentLength: l > 0 ? l : void 0
        }), await u.runMutation(e.lib.registerPendingUpload, {
          config: t.config,
          blobId: d,
          contentType: p,
          size: l
        }), new Response(JSON.stringify({ blobId: d }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (h) {
        return console.error("Upload error:", h), new Response(JSON.stringify({
          error: h instanceof Error ? h.message : "Upload failed"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    })
  }), a.route({
    pathPrefix: o + "/blobs/",
    method: "GET",
    handler: O(async (u, w) => {
      let { blobId: i, path: p } = tt(w.url);
      if (!i)
        return new Response(JSON.stringify({ error: "Missing blobId" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      if (p) {
        let h = await t.stat(u, p);
        if (!h)
          return new Response(JSON.stringify({ error: "File not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        if (h.blobId !== i)
          return new Response(JSON.stringify({ error: "Blob ID mismatch" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          });
      }
      let l = new URL(w.url).searchParams.get("cdn-params"), d;
      if (l)
        try {
          d = JSON.parse(l);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid cdn-params JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      try {
        if (!await r.downloadAuth(u, i, p, d))
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          });
      } catch {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        let h = await t.getDownloadUrl(u, i, {
          extraParams: d
        }), b = t.config.downloadUrlTtl ?? 3600, m = `private, max-age=${Math.max(0, b - 300)}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: h,
            "Cache-Control": m
          }
        });
      } catch (h) {
        return console.error("Error getting download URL:", h), new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    })
  });
}
g(At, "registerRoutes");
function tt(s) {
  let e = new URL(s), t = e.pathname.split("/").pop() ?? "", r = e.searchParams.get("path");
  return { blobId: t, path: r ? decodeURIComponent(r) : void 0 };
}
g(tt, "parseDownloadUrl");

// convex/fs.ts
var et = !!process.env.BUNNY_API_KEY && !!process.env.BUNNY_STORAGE_ZONE && !!process.env.BUNNY_CDN_HOSTNAME, Bt = et ? new P(_.fs, {
  storage: {
    type: "bunny",
    apiKey: process.env.BUNNY_API_KEY,
    storageZoneName: process.env.BUNNY_STORAGE_ZONE,
    cdnHostname: process.env.BUNNY_CDN_HOSTNAME,
    region: process.env.BUNNY_REGION,
    tokenKey: process.env.BUNNY_TOKEN_KEY
  },
  downloadUrlTtl: 3600,
  // URL expiration in seconds (1 hour)
  blobGracePeriod: 86400
  // Orphaned blobs deleted after 24 hours
}) : null;

export {
  At as a,
  et as b,
  Bt as c
};
//# sourceMappingURL=LFQTZ6CE.js.map
