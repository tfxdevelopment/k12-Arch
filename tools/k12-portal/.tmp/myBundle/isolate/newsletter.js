import {
  a as m,
  b as w,
  c as d,
  d as h
} from "./_deps/AJORQ7CY.js";
import {
  b as g
} from "./_deps/Y2CE7CMW.js";
import {
  a as o,
  b as e
} from "./_deps/M2D6NT5W.js";

// convex/newsletter.ts
function A() {
  let t = "abcdefghijklmnopqrstuvwxyz0123456789", s = "";
  for (let r = 0; r < 32; r++)
    s += t[Math.floor(Math.random() * t.length)];
  return s;
}
o(A, "generateToken");
var k = d({
  args: {
    email: e.string(),
    source: e.string()
    // "home", "blog-page", "post", or "post:slug-name"
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => {
    let r = s.email.toLowerCase().trim();
    if (!r || !r.includes("@") || !r.includes("."))
      return { success: !1, message: "Please enter a valid email address." };
    let u = await t.db.query("newsletterSubscribers").withIndex("by_email", (b) => b.eq("email", r)).first();
    if (u && u.subscribed)
      return { success: !1, message: "You're already subscribed!" };
    let n = A(), l = !u;
    return u ? await t.db.patch(u._id, {
      subscribed: !0,
      subscribedAt: Date.now(),
      source: s.source,
      unsubscribeToken: n,
      unsubscribedAt: void 0
    }) : await t.db.insert("newsletterSubscribers", {
      email: r,
      subscribed: !0,
      subscribedAt: Date.now(),
      source: s.source,
      unsubscribeToken: n
    }), l && await t.scheduler.runAfter(0, g.newsletterActions.notifyNewSubscriber, {
      email: r,
      source: s.source
    }), { success: !0, message: "Thanks for subscribing!" };
  }, "handler")
}), x = d({
  args: {
    email: e.string(),
    token: e.string()
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => {
    let r = s.email.toLowerCase().trim(), u = await t.db.query("newsletterSubscribers").withIndex("by_email", (n) => n.eq("email", r)).first();
    return u ? u.unsubscribeToken !== s.token ? { success: !1, message: "Invalid unsubscribe link." } : u.subscribed ? (await t.db.patch(u._id, {
      subscribed: !1,
      unsubscribedAt: Date.now()
    }), { success: !0, message: "You've been unsubscribed." }) : { success: !0, message: "You're already unsubscribed." } : { success: !1, message: "Email not found." };
  }, "handler")
}), P = m({
  args: {},
  returns: e.number(),
  handler: /* @__PURE__ */ o(async (t) => (await t.db.query("newsletterSubscribers").withIndex("by_subscribed", (r) => r.eq("subscribed", !0)).collect()).length, "handler")
}), I = w({
  args: {},
  returns: e.array(
    e.object({
      email: e.string(),
      unsubscribeToken: e.string()
    })
  ),
  handler: /* @__PURE__ */ o(async (t) => (await t.db.query("newsletterSubscribers").withIndex("by_subscribed", (r) => r.eq("subscribed", !0)).collect()).map((r) => ({
    email: r.email,
    unsubscribeToken: r.unsubscribeToken
  })), "handler")
}), T = h({
  args: {
    postSlug: e.string(),
    sentCount: e.number()
  },
  returns: e.null(),
  handler: /* @__PURE__ */ o(async (t, s) => (await t.db.insert("newsletterSentPosts", {
    postSlug: s.postSlug,
    sentAt: Date.now(),
    sentCount: s.sentCount,
    type: "post"
  }), null), "handler")
}), _ = h({
  args: {
    subject: e.string(),
    sentCount: e.number()
  },
  returns: e.null(),
  handler: /* @__PURE__ */ o(async (t, s) => {
    let r = `custom-${Date.now()}`;
    return await t.db.insert("newsletterSentPosts", {
      postSlug: r,
      sentAt: Date.now(),
      sentCount: s.sentCount,
      type: "custom",
      subject: s.subject
    }), null;
  }, "handler")
}), v = w({
  args: {
    postSlug: e.string()
  },
  returns: e.boolean(),
  handler: /* @__PURE__ */ o(async (t, s) => await t.db.query("newsletterSentPosts").withIndex("by_postSlug", (u) => u.eq("postSlug", s.postSlug)).first() !== null, "handler")
}), C = e.object({
  _id: e.id("newsletterSubscribers"),
  email: e.string(),
  subscribed: e.boolean(),
  subscribedAt: e.number(),
  unsubscribedAt: e.optional(e.number()),
  source: e.string()
}), D = m({
  args: {
    limit: e.optional(e.number()),
    cursor: e.optional(e.string()),
    filter: e.optional(e.union(e.literal("all"), e.literal("subscribed"), e.literal("unsubscribed"))),
    search: e.optional(e.string())
  },
  returns: e.object({
    subscribers: e.array(C),
    nextCursor: e.union(e.string(), e.null()),
    totalCount: e.number(),
    subscribedCount: e.number()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => {
    let r = s.limit ?? 50, u = s.filter ?? "all", n = s.search?.toLowerCase().trim(), l = await t.db.query("newsletterSubscribers").collect(), b = l;
    u === "subscribed" ? b = l.filter((c) => c.subscribed) : u === "unsubscribed" && (b = l.filter((c) => !c.subscribed)), n && (b = b.filter((c) => c.email.includes(n))), b.sort((c, S) => S.subscribedAt - c.subscribedAt);
    let i = 0;
    if (s.cursor) {
      let c = parseInt(s.cursor, 10);
      i = b.findIndex((S) => S.subscribedAt < c), i === -1 && (i = b.length);
    }
    let a = b.slice(i, i + r), p = i + r < b.length, f = a.map((c) => ({
      _id: c._id,
      email: c.email,
      subscribed: c.subscribed,
      subscribedAt: c.subscribedAt,
      unsubscribedAt: c.unsubscribedAt,
      source: c.source
    })), y = l.filter((c) => c.subscribed).length;
    return {
      subscribers: f,
      nextCursor: p ? String(a[a.length - 1].subscribedAt) : null,
      totalCount: b.length,
      subscribedCount: y
    };
  }, "handler")
}), U = d({
  args: {
    subscriberId: e.id("newsletterSubscribers")
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => await t.db.get(s.subscriberId) ? (await t.db.delete(s.subscriberId), { success: !0, message: "Subscriber deleted." }) : { success: !1, message: "Subscriber not found." }, "handler")
}), M = m({
  args: {},
  returns: e.object({
    totalSubscribers: e.number(),
    activeSubscribers: e.number(),
    unsubscribedCount: e.number(),
    totalNewslettersSent: e.number(),
    totalEmailsSent: e.number(),
    // Sum of all sentCount
    recentNewsletters: e.array(
      e.object({
        postSlug: e.string(),
        sentAt: e.number(),
        sentCount: e.number(),
        type: e.optional(e.string()),
        subject: e.optional(e.string())
      })
    )
  }),
  handler: /* @__PURE__ */ o(async (t) => {
    let s = await t.db.query("newsletterSubscribers").collect(), r = s.filter((i) => i.subscribed).length, u = s.length - r, n = await t.db.query("newsletterSentPosts").collect(), l = n.reduce((i, a) => i + a.sentCount, 0), b = n.sort((i, a) => a.sentAt - i.sentAt).slice(0, 10).map((i) => ({
      postSlug: i.postSlug,
      sentAt: i.sentAt,
      sentCount: i.sentCount,
      type: i.type,
      subject: i.subject
    }));
    return {
      totalSubscribers: s.length,
      activeSubscribers: r,
      unsubscribedCount: u,
      totalNewslettersSent: n.length,
      totalEmailsSent: l,
      recentNewsletters: b
    };
  }, "handler")
}), W = m({
  args: {},
  returns: e.array(
    e.object({
      slug: e.string(),
      title: e.string(),
      date: e.string(),
      wasSent: e.boolean()
    })
  ),
  handler: /* @__PURE__ */ o(async (t) => {
    let s = await t.db.query("posts").withIndex("by_published", (n) => n.eq("published", !0)).collect(), r = await t.db.query("newsletterSentPosts").collect(), u = new Set(r.map((n) => n.postSlug));
    return s.sort((n, l) => l.date.localeCompare(n.date)).map((n) => ({
      slug: n.slug,
      title: n.title,
      date: n.date,
      wasSent: u.has(n.slug)
    }));
  }, "handler")
}), E = w({
  args: {},
  returns: e.object({
    activeSubscribers: e.number(),
    totalSubscribers: e.number(),
    newThisWeek: e.number(),
    unsubscribedCount: e.number(),
    totalNewslettersSent: e.number()
  }),
  handler: /* @__PURE__ */ o(async (t) => {
    let s = await t.db.query("newsletterSubscribers").collect(), r = s.filter((i) => i.subscribed).length, u = s.length - r, n = Date.now() - 10080 * 60 * 1e3, l = s.filter(
      (i) => i.subscribedAt >= n && i.subscribed
    ).length, b = await t.db.query("newsletterSentPosts").collect();
    return {
      activeSubscribers: r,
      totalSubscribers: s.length,
      newThisWeek: l,
      unsubscribedCount: u,
      totalNewslettersSent: b.length
    };
  }, "handler")
}), L = d({
  args: {
    postSlug: e.string(),
    siteUrl: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => await t.db.query("newsletterSentPosts").withIndex("by_postSlug", (u) => u.eq("postSlug", s.postSlug)).first() ? {
    success: !1,
    message: "This post has already been sent as a newsletter."
  } : (await t.scheduler.runAfter(0, g.newsletterActions.sendPostNewsletter, {
    postSlug: s.postSlug,
    siteUrl: s.siteUrl,
    siteName: s.siteName
  }), {
    success: !0,
    message: "Newsletter is being sent. Check back in a moment for results."
  }), "handler")
}), Y = d({
  args: {
    subject: e.string(),
    content: e.string(),
    siteUrl: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => s.subject.trim() ? s.content.trim() ? (await t.scheduler.runAfter(0, g.newsletterActions.sendCustomNewsletter, {
    subject: s.subject,
    content: s.content,
    siteUrl: s.siteUrl,
    siteName: s.siteName
  }), {
    success: !0,
    message: "Newsletter is being sent. Check back in a moment for results."
  }) : { success: !1, message: "Content is required." } : { success: !1, message: "Subject is required." }, "handler")
}), F = d({
  args: {
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (t, s) => (await t.scheduler.runAfter(0, g.newsletterActions.sendWeeklyStatsSummary, {
    siteName: s.siteName
  }), {
    success: !0,
    message: "Stats summary is being sent. Check your inbox in a moment."
  }), "handler")
});
export {
  U as deleteSubscriber,
  I as getActiveSubscribers,
  D as getAllSubscribers,
  M as getNewsletterStats,
  W as getPostsForNewsletter,
  E as getStatsForSummary,
  P as getSubscriberCount,
  _ as recordCustomSent,
  T as recordPostSent,
  Y as scheduleSendCustomNewsletter,
  L as scheduleSendPostNewsletter,
  F as scheduleSendStatsSummary,
  k as subscribe,
  x as unsubscribe,
  v as wasPostSent
};
//# sourceMappingURL=newsletter.js.map
