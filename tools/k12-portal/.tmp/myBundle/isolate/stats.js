import {
  a as Q,
  c as x,
  d as D
} from "./_deps/AJORQ7CY.js";
import {
  c as V
} from "./_deps/Y2CE7CMW.js";
import {
  a as c,
  b as i
} from "./_deps/M2D6NT5W.js";

// node_modules/@convex-dev/aggregate/dist/client/positions.js
var h = [];
function q(n) {
  if (Array.isArray(n)) {
    let t = [""];
    for (let e of n)
      t.push(e), t.push("");
    return t;
  }
  return n;
}
c(q, "explodeKey");
function se(n) {
  if (Array.isArray(n)) {
    let t = [];
    for (let e = 1; e < n.length; e += 2)
      t.push(n[e]);
    return t;
  }
  return n;
}
c(se, "implodeKey");
function f(n, t) {
  return [q(n), t, ""];
}
c(f, "keyToPosition");
function j(n) {
  return { key: se(n[0]), id: n[1] };
}
c(j, "positionToKey");
function m(n) {
  if (n === void 0)
    return {};
  if ("eq" in n)
    return {
      k1: g("lower", { key: n.eq, inclusive: !0 }),
      k2: g("upper", { key: n.eq, inclusive: !0 })
    };
  if ("prefix" in n) {
    let t = n.prefix, e = [];
    for (let s of t)
      e.push(""), e.push(s);
    return {
      k1: [e.concat([null]), null, null],
      k2: [e.concat([h]), h, h]
    };
  }
  return {
    k1: g("lower", n.lower),
    k2: g("upper", n.upper)
  };
}
c(m, "boundsToPositions");
function g(n, t) {
  if (t !== void 0)
    return n === "lower" ? [
      q(t.key),
      t.id ?? (t.inclusive ? null : h),
      t.inclusive ? null : h
    ] : [
      q(t.key),
      t.id ?? (t.inclusive ? h : null),
      t.inclusive ? h : null
    ];
}
c(g, "boundToPosition");

// node_modules/@convex-dev/aggregate/dist/client/index.js
var O = class {
  static {
    c(this, "Aggregate");
  }
  component;
  constructor(t) {
    this.component = t;
  }
  /// Aggregate queries.
  /**
   * Counts items between the given bounds.
   */
  async count(t, ...e) {
    let { count: s } = await t.runQuery(this.component.btree.aggregateBetween, {
      ...m(e[0]?.bounds),
      namespace: d(e)
    });
    return s;
  }
  /**
   * Batch version of count() - counts items for multiple bounds in a single call.
   */
  async countBatch(t, e) {
    let s = e.map((o) => {
      if (!o)
        throw new Error("You must pass bounds and/or namespace");
      let u = v(o), { k1: l, k2: p } = m(o.bounds);
      return { k1: l, k2: p, namespace: u };
    });
    return (await t.runQuery(this.component.btree.aggregateBetweenBatch, {
      queries: s
    })).map((o) => o.count);
  }
  /**
   * Adds up the sumValue of items between the given bounds.
   */
  async sum(t, ...e) {
    let { sum: s } = await t.runQuery(this.component.btree.aggregateBetween, {
      ...m(e[0]?.bounds),
      namespace: d(e)
    });
    return s;
  }
  /**
   * Batch version of sum() - sums items for multiple bounds in a single call.
   */
  async sumBatch(t, e) {
    let s = e.map((o) => {
      if (!o)
        throw new Error("You must pass bounds and/or namespace");
      let u = v(o), { k1: l, k2: p } = m(o.bounds);
      return { k1: l, k2: p, namespace: u };
    });
    return (await t.runQuery(this.component.btree.aggregateBetweenBatch, {
      queries: s
    })).map((o) => o.sum);
  }
  /**
   * Returns the item at the given offset/index/rank in the order of key,
   * within the bounds. Zero-indexed, so at(0) is the smallest key within the
   * bounds.
   *
   * If offset is negative, it counts from the end of the list, so at(-1) is the
   * item with the largest key within the bounds.
   */
  async at(t, e, ...s) {
    if (e < 0) {
      let o = await t.runQuery(this.component.btree.atNegativeOffset, {
        offset: -e - 1,
        namespace: d(s),
        ...m(s[0]?.bounds)
      });
      return E(o);
    }
    let a = await t.runQuery(this.component.btree.atOffset, {
      offset: e,
      namespace: d(s),
      ...m(s[0]?.bounds)
    });
    return E(a);
  }
  /**
   * Batch version of at() - returns items at multiple offsets in a single call.
   */
  async atBatch(t, e) {
    let s = e.map((o) => ({
      offset: o.offset,
      ...m(o.bounds),
      namespace: v(o)
    }));
    return (await t.runQuery(this.component.btree.atOffsetBatch, {
      queries: s
    })).map(E);
  }
  /**
   * Returns the rank/offset/index of the given key, within the bounds.
   * Specifically, it returns the index of the first item with
   *
   * - key >= the given key if `order` is "asc" (default)
   * - key <= the given key if `order` is "desc"
   */
  async indexOf(t, e, ...s) {
    let { k1: a, k2: o } = m(s[0]?.bounds);
    return s[0]?.order === "desc" ? await t.runQuery(this.component.btree.offsetUntil, {
      key: g("upper", {
        key: e,
        id: s[0]?.id,
        inclusive: !0
      }),
      k2: o,
      namespace: d(s)
    }) : await t.runQuery(this.component.btree.offset, {
      key: g("lower", { key: e, id: s[0]?.id, inclusive: !0 }),
      k1: a,
      namespace: d(s)
    });
  }
  /**
   * @deprecated Use `indexOf` instead.
   */
  async offsetOf(t, e, s, a, o) {
    return this.indexOf(t, e, { id: a, bounds: o, order: "asc", namespace: s });
  }
  /**
   * @deprecated Use `indexOf` instead.
   */
  async offsetUntil(t, e, s, a, o) {
    return this.indexOf(t, e, { id: a, bounds: o, order: "desc", namespace: s });
  }
  /**
   * Gets the minimum item within the given bounds.
   */
  async min(t, ...e) {
    let { page: s } = await this.paginate(t, {
      namespace: d(e),
      bounds: e[0]?.bounds,
      order: "asc",
      pageSize: 1
    });
    return s[0] ?? null;
  }
  /**
   * Gets the maximum item within the given bounds.
   */
  async max(t, ...e) {
    let { page: s } = await this.paginate(t, {
      namespace: d(e),
      bounds: e[0]?.bounds,
      order: "desc",
      pageSize: 1
    });
    return s[0] ?? null;
  }
  /**
   * Gets a uniformly random item within the given bounds.
   */
  async random(t, ...e) {
    let s = await this.count(t, ...e);
    if (s === 0)
      return null;
    let a = Math.floor(Math.random() * s);
    return await this.at(t, a, ...e);
  }
  /**
   * Get a page of items between the given bounds, with a cursor to paginate.
   * Use `iter` to iterate over all items within the bounds.
   */
  async paginate(t, ...e) {
    let s = e[0]?.order ?? "asc", a = e[0]?.pageSize ?? 100, { page: o, cursor: u, isDone: l } = await t.runQuery(this.component.btree.paginate, {
      namespace: d(e),
      ...m(e[0]?.bounds),
      cursor: e[0]?.cursor,
      order: s,
      limit: a
    });
    return {
      page: o.map(E),
      cursor: u,
      isDone: l
    };
  }
  /**
   * Example usage:
   * ```ts
   * for await (const item of aggregate.iter(ctx, bounds)) {
   *   console.log(item);
   * }
   * ```
   */
  async *iter(t, ...e) {
    let s = e[0]?.order ?? "asc", a = e[0]?.pageSize ?? 100, o = e[0]?.bounds, u = d(e), l = !1, p;
    for (; !l; ) {
      let { page: w, cursor: P, isDone: I } = await this.paginate(t, {
        namespace: u,
        bounds: o,
        cursor: p,
        order: s,
        pageSize: a
      });
      for (let k of w)
        yield k;
      l = I, p = P;
    }
  }
  /** Write operations. See {@link DirectAggregate} for docstrings. */
  async _insert(t, e, s, a, o) {
    await t.runMutation(this.component.public.insert, {
      key: f(s, a),
      summand: o,
      value: a,
      namespace: e
    });
  }
  async _delete(t, e, s, a) {
    await t.runMutation(this.component.public.delete_, {
      key: f(s, a),
      namespace: e
    });
  }
  async _replace(t, e, s, a, o, u, l) {
    await t.runMutation(this.component.public.replace, {
      currentKey: f(s, u),
      newKey: f(o, u),
      summand: l,
      value: u,
      namespace: e,
      newNamespace: a
    });
  }
  async _insertIfDoesNotExist(t, e, s, a, o) {
    await this._replaceOrInsert(t, e, s, e, s, a, o);
  }
  async _deleteIfExists(t, e, s, a) {
    await t.runMutation(this.component.public.deleteIfExists, {
      key: f(s, a),
      namespace: e
    });
  }
  async _replaceOrInsert(t, e, s, a, o, u, l) {
    await t.runMutation(this.component.public.replaceOrInsert, {
      currentKey: f(s, u),
      newKey: f(o, u),
      summand: l,
      value: u,
      namespace: e,
      newNamespace: a
    });
  }
  /// Initialization and maintenance.
  /**
   * (re-)initialize the data structure, removing all items if it exists.
   *
   * Change the maxNodeSize if provided, otherwise keep it the same.
   *   maxNodeSize is how you tune the data structure's width and depth.
   *   Larger values can reduce write contention but increase read latency.
   *   Default is 16.
   * Set rootLazy = false to eagerly compute aggregates on the root node, which
   *   improves aggregation latency at the expense of making all writes contend
   *   with each other, so it's only recommended for read-heavy workloads.
   *   Default is true.
   */
  async clear(t, ...e) {
    await t.runMutation(this.component.public.clear, {
      maxNodeSize: e[0]?.maxNodeSize,
      rootLazy: e[0]?.rootLazy,
      namespace: d(e)
    });
  }
  /**
   * If rootLazy is false (the default is true but it can be set to false by
   * `clear`), the aggregates data structure writes to a single root node on
   * every insert/delete/replace, which can cause contention.
   *
   * If your data structure has frequent writes, you can reduce contention by
   * calling makeRootLazy, which removes the frequent writes to the root node.
   * With a lazy root node, updates will only contend with other updates to the
   * same shard of the tree. The number of shards is determined by maxNodeSize,
   * so larger maxNodeSize can also help.
   */
  async makeRootLazy(t, e) {
    await t.runMutation(this.component.public.makeRootLazy, { namespace: e });
  }
  async paginateNamespaces(t, e, s = 100) {
    let { page: a, cursor: o, isDone: u } = await t.runQuery(this.component.btree.paginateNamespaces, {
      cursor: e,
      limit: s
    });
    return {
      page: a,
      cursor: o,
      isDone: u
    };
  }
  async *iterNamespaces(t, e = 100) {
    let s = !1, a;
    for (; !s; ) {
      let { page: o, cursor: u, isDone: l } = await this.paginateNamespaces(t, a, e);
      for (let p of o)
        yield p ?? void 0;
      s = l, a = u;
    }
  }
  async clearAll(t, e) {
    for await (let s of this.iterNamespaces(t))
      await this.clear(t, { ...e, namespace: s });
    await this.clear(t, { ...e, namespace: void 0 });
  }
  async makeAllRootsLazy(t) {
    for await (let e of this.iterNamespaces(t))
      await this.makeRootLazy(t, e);
  }
};
var b = class extends O {
  static {
    c(this, "TableAggregate");
  }
  options;
  constructor(t, e) {
    super(t), this.options = e;
  }
  async insert(t, e) {
    await this._insert(t, this.options.namespace?.(e), this.options.sortKey(e), e._id, this.options.sumValue?.(e));
  }
  async delete(t, e) {
    await this._delete(t, this.options.namespace?.(e), this.options.sortKey(e), e._id);
  }
  async replace(t, e, s) {
    await this._replace(t, this.options.namespace?.(e), this.options.sortKey(e), this.options.namespace?.(s), this.options.sortKey(s), s._id, this.options.sumValue?.(s));
  }
  async insertIfDoesNotExist(t, e) {
    await this._insertIfDoesNotExist(t, this.options.namespace?.(e), this.options.sortKey(e), e._id, this.options.sumValue?.(e));
  }
  async deleteIfExists(t, e) {
    await this._deleteIfExists(t, this.options.namespace?.(e), this.options.sortKey(e), e._id);
  }
  async replaceOrInsert(t, e, s) {
    await this._replaceOrInsert(t, this.options.namespace?.(e), this.options.sortKey(e), this.options.namespace?.(s), this.options.sortKey(s), s._id, this.options.sumValue?.(s));
  }
  /**
   * Returns the rank/offset/index of the given document, within the bounds.
   * This differs from `indexOf` in that it take the document rather than key.
   * Specifically, it returns the index of the first item with
   *
   * - key >= the given doc's key if `order` is "asc" (default)
   * - key <= the given doc's key if `order` is "desc"
   */
  async indexOfDoc(t, e, s) {
    let a = this.options.sortKey(e);
    return this.indexOf(t, a, {
      namespace: this.options.namespace?.(e),
      ...s
    });
  }
  trigger() {
    return async (t, e) => {
      e.operation === "insert" ? await this.insert(t, e.newDoc) : e.operation === "update" ? await this.replace(t, e.oldDoc, e.newDoc) : e.operation === "delete" && await this.delete(t, e.oldDoc);
    };
  }
  idempotentTrigger() {
    return async (t, e) => {
      e.operation === "insert" ? await this.insertIfDoesNotExist(t, e.newDoc) : e.operation === "update" ? await this.replaceOrInsert(t, e.oldDoc, e.newDoc) : e.operation === "delete" && await this.deleteIfExists(t, e.oldDoc);
    };
  }
};
function E({ k: n, s: t }) {
  let { key: e, id: s } = j(n);
  return {
    key: e,
    id: s,
    sumValue: t
  };
}
c(E, "btreeItemToAggregateItem");
function v(n) {
  if ("namespace" in n)
    return n.namespace;
}
c(v, "namespaceFromArg");
function d(n) {
  if (n.length === 0)
    return;
  let [{ namespace: t }] = n;
  return t;
}
c(d, "namespaceFromOpts");

// convex/stats.ts
var ne = 1800 * 1e3, U = 120 * 1e3, ie = 20 * 1e3, N = new b(V.pageViewsByPath, {
  namespace: /* @__PURE__ */ c((n) => n.path, "namespace"),
  sortKey: /* @__PURE__ */ c((n) => n.timestamp, "sortKey")
}), L = new b(V.totalPageViews, {
  sortKey: /* @__PURE__ */ c(() => null, "sortKey")
}), B = new b(V.uniqueVisitors, {
  sortKey: /* @__PURE__ */ c((n) => n.sessionId, "sortKey")
}), fe = x({
  args: {
    path: i.string(),
    pageType: i.string(),
    sessionId: i.string()
  },
  returns: i.null(),
  handler: /* @__PURE__ */ c(async (n, t) => {
    let e = Date.now(), s = e - ne, a = await n.db.query("pageViews").withIndex(
      "by_session_path",
      (w) => w.eq("sessionId", t.sessionId).eq("path", t.path)
    ).order("desc").first();
    if (a && a.timestamp > s)
      return null;
    let u = !await n.db.query("pageViews").withIndex("by_session_path", (w) => w.eq("sessionId", t.sessionId)).first(), l = await n.db.insert("pageViews", {
      path: t.path,
      pageType: t.pageType,
      sessionId: t.sessionId,
      timestamp: e
    }), p = await n.db.get(l);
    return p && (await N.insertIfDoesNotExist(n, p), await L.insertIfDoesNotExist(n, p), u && await B.insertIfDoesNotExist(n, p)), null;
  }, "handler")
}), we = x({
  args: {
    sessionId: i.string(),
    currentPath: i.string(),
    // Optional geo data from Netlify geo headers
    city: i.optional(i.string()),
    country: i.optional(i.string()),
    latitude: i.optional(i.number()),
    longitude: i.optional(i.number())
  },
  returns: i.null(),
  handler: /* @__PURE__ */ c(async (n, t) => {
    let e = Date.now(), s = await n.db.query("activeSessions").withIndex("by_sessionId", (a) => a.eq("sessionId", t.sessionId)).first();
    return s ? (e - s.lastSeen < ie || await n.db.patch(s._id, {
      currentPath: t.currentPath,
      lastSeen: e,
      ...t.city !== void 0 && { city: t.city },
      ...t.country !== void 0 && { country: t.country },
      ...t.latitude !== void 0 && { latitude: t.latitude },
      ...t.longitude !== void 0 && { longitude: t.longitude }
    }), null) : (await n.db.insert("activeSessions", {
      sessionId: t.sessionId,
      currentPath: t.currentPath,
      lastSeen: e,
      ...t.city !== void 0 && { city: t.city },
      ...t.country !== void 0 && { country: t.country },
      ...t.latitude !== void 0 && { latitude: t.latitude },
      ...t.longitude !== void 0 && { longitude: t.longitude }
    }), null);
  }, "handler")
}), he = Q({
  args: {},
  returns: i.object({
    activeVisitors: i.number(),
    activeByPath: i.array(
      i.object({
        path: i.string(),
        count: i.number()
      })
    ),
    totalPageViews: i.number(),
    uniqueVisitors: i.number(),
    publishedPosts: i.number(),
    publishedPages: i.number(),
    trackingSince: i.union(i.number(), i.null()),
    pageStats: i.array(
      i.object({
        path: i.string(),
        title: i.string(),
        pageType: i.string(),
        views: i.number()
      })
    ),
    // Visitor locations for world map display
    visitorLocations: i.array(
      i.object({
        latitude: i.number(),
        longitude: i.number(),
        city: i.optional(i.string()),
        country: i.optional(i.string())
      })
    )
  }),
  handler: /* @__PURE__ */ c(async (n) => {
    let e = Date.now() - U, s = await n.db.query("activeSessions").withIndex("by_lastSeen", (r) => r.gt("lastSeen", e)).collect(), a = {};
    for (let r of s)
      a[r.currentPath] = (a[r.currentPath] || 0) + 1;
    let o = Object.entries(a).map(([r, y]) => ({ path: r, count: y })).sort((r, y) => y.count - r.count), u = await n.db.query("pageViews").withIndex("by_path").collect(), l = /* @__PURE__ */ new Set();
    for (let r of u)
      l.add(r.path);
    let p = Array.from(l), w = u.length, P = new Set(u.map((r) => r.sessionId)).size, I = {};
    for (let r of u)
      I[r.path] = (I[r.path] || 0) + 1;
    let k = await L.count(n), H = await B.count(n), M = {}, W = p.map(async (r) => {
      let y = await N.count(n, { namespace: r });
      M[r] = y;
    });
    await Promise.all(W);
    let Y = Math.max(
      k,
      w
    ), Z = Math.max(
      H,
      P
    ), T = await n.db.query("pageViews").withIndex("by_timestamp").order("asc").first(), G = T ? T.timestamp : null, K = await n.db.query("posts").withIndex("by_published", (r) => r.eq("published", !0)).collect(), C = await n.db.query("pages").withIndex("by_published", (r) => r.eq("published", !0)).collect(), J = p.map(async (r) => {
      let y = M[r] || 0, ee = I[r] || 0, te = Math.max(y, ee), z = r.startsWith("/") ? r.slice(1) : r, R = K.find((A) => A.slug === z), F = C.find((A) => A.slug === z), _ = r, S = "other";
      return r === "/" || r === "" ? (_ = "Home", S = "home") : r === "/stats" ? (_ = "Stats", S = "stats") : R ? (_ = R.title, S = "blog") : F && (_ = F.title, S = "page"), {
        path: r,
        title: _,
        pageType: S,
        views: te
      };
    }), X = (await Promise.all(J)).sort(
      (r, y) => y.views - r.views
    ), $ = s.filter(
      (r) => r.latitude !== void 0 && r.longitude !== void 0 && r.latitude !== null && r.longitude !== null
    ).map((r) => ({
      latitude: r.latitude,
      longitude: r.longitude,
      city: r.city,
      country: r.country
    }));
    return {
      activeVisitors: s.length,
      activeByPath: o,
      totalPageViews: Y,
      uniqueVisitors: Z,
      publishedPosts: K.length,
      publishedPages: C.length,
      trackingSince: G,
      pageStats: X,
      visitorLocations: $
    };
  }, "handler")
}), ge = D({
  args: {},
  returns: i.number(),
  handler: /* @__PURE__ */ c(async (n) => {
    let t = Date.now() - U, e = await n.db.query("activeSessions").withIndex("by_lastSeen", (s) => s.lt("lastSeen", t)).collect();
    return await Promise.all(
      e.map((s) => n.db.delete(s._id))
    ), e.length;
  }, "handler")
}), ae = 500, be = D({
  args: {
    cursor: i.union(i.string(), i.null()),
    totalProcessed: i.number(),
    seenSessionIds: i.array(i.string())
  },
  returns: i.object({
    status: i.union(i.literal("in_progress"), i.literal("complete")),
    processed: i.number(),
    uniqueSessions: i.number(),
    cursor: i.union(i.string(), i.null())
  }),
  handler: /* @__PURE__ */ c(async (n, t) => {
    let e = await n.db.query("pageViews").paginate({ numItems: ae, cursor: t.cursor }), s = new Set(t.seenSessionIds), a = 0;
    for (let u of e.page)
      await N.insertIfDoesNotExist(n, u), await L.insertIfDoesNotExist(n, u), s.has(u.sessionId) || (s.add(u.sessionId), await B.insertIfDoesNotExist(n, u), a++);
    let o = t.totalProcessed + e.page.length;
    if (!e.isDone) {
      let u = Array.from(s).slice(-1e4);
      return await n.scheduler.runAfter(
        0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await import("./_deps/MUJEMXKN.js")).internal.stats.backfillAggregatesChunk,
        {
          cursor: e.continueCursor,
          totalProcessed: o,
          seenSessionIds: u
        }
      ), {
        status: "in_progress",
        processed: o,
        uniqueSessions: s.size,
        cursor: e.continueCursor
      };
    }
    return {
      status: "complete",
      processed: o,
      uniqueSessions: s.size,
      cursor: null
    };
  }, "handler")
}), Ie = D({
  args: {},
  returns: i.object({
    message: i.string()
  }),
  handler: /* @__PURE__ */ c(async (n) => await n.db.query("pageViews").first() ? (await n.scheduler.runAfter(
    0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await import("./_deps/MUJEMXKN.js")).internal.stats.backfillAggregatesChunk,
    {
      cursor: null,
      totalProcessed: 0,
      seenSessionIds: []
    }
  ), { message: "Backfill started. Check logs for progress." }) : { message: "No pageViews to backfill" }, "handler")
});
export {
  Ie as backfillAggregates,
  be as backfillAggregatesChunk,
  ge as cleanupStaleSessions,
  he as getStats,
  we as heartbeat,
  fe as recordPageView
};
//# sourceMappingURL=stats.js.map
