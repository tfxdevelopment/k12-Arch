"use node";
import {
  a as N
} from "./_deps/node/HBZJI64A.js";
import {
  a as f,
  f as e,
  h as S,
  j as b
} from "./_deps/node/27R56OS5.js";

// convex/newsletterActions.ts
function k(o) {
  let s = o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; color: #1a1a1a; margin: 16px 0 8px;">$1</h3>').replace(/^## (.+)$/gm, '<h2 style="font-size: 20px; color: #1a1a1a; margin: 20px 0 10px;">$1</h2>').replace(/^# (.+)$/gm, '<h1 style="font-size: 24px; color: #1a1a1a; margin: 24px 0 12px;">$1</h1>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/__(.+?)__/g, "<strong>$1</strong>").replace(/_(.+?)_/g, "<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #1a73e8; text-decoration: none;">$1</a>').replace(/^- (.+)$/gm, '<li style="margin: 4px 0;">$1</li>').replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left: 20px; margin: 12px 0;">$&</ul>').replace(/\n\n/g, '</p><p style="margin: 12px 0; line-height: 1.6;">').replace(/\n/g, "<br />");
  return !s.startsWith("<h") && !s.startsWith("<ul") && (s = `<p style="margin: 12px 0; line-height: 1.6;">${s}</p>`), s;
}
f(k, "markdownToHtml");
function _(o) {
  return o.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/_(.+?)_/g, "$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").replace(/^#{1,3} /gm, "").replace(/^- /gm, "* ");
}
f(_, "markdownToText");
var A = "AgentMail Environment Variables are not configured in production. Please set AGENTMAIL_API_KEY and AGENTMAIL_INBOX.", z = S({
  args: {
    postSlug: e.string(),
    siteUrl: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    sentCount: e.number(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ f(async (o, s) => {
    if (await o.runQuery(
      b.newsletter.wasPostSent,
      { postSlug: s.postSlug }
    ))
      return {
        success: !1,
        sentCount: 0,
        message: "This post has already been sent as a newsletter."
      };
    let c = await o.runQuery(b.newsletter.getActiveSubscribers);
    if (c.length === 0)
      return { success: !1, sentCount: 0, message: "No subscribers." };
    let r = await o.runQuery(b.posts.getPostBySlugInternal, {
      slug: s.postSlug
    });
    if (!r)
      return { success: !1, sentCount: 0, message: "Post not found." };
    let n = process.env.AGENTMAIL_API_KEY, t = process.env.AGENTMAIL_INBOX;
    if (!n || !t)
      return {
        success: !1,
        sentCount: 0,
        message: A
      };
    let g = s.siteName || "Newsletter", a = 0, p = [], y = new N({ apiKey: n });
    for (let m of c) {
      let $ = `${s.siteUrl}/unsubscribe?email=${encodeURIComponent(m.email)}&token=${m.unsubscribeToken}`, h = `${s.siteUrl}/${r.slug}`, i = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 16px;">${u(r.title)}</h1>
          <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 24px;">${u(r.description)}</p>
          ${r.excerpt ? `<p style="font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 24px;">${u(r.excerpt)}</p>` : ""}
          <p style="margin-bottom: 32px;">
            <a href="${h}" style="display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500;">Read more</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #888;">
            You received this email because you subscribed to ${u(g)}.<br />
            <a href="${$}" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      `, x = `${r.title}

${r.description}

Read more: ${h}

---
Unsubscribe: ${$}`;
      try {
        await y.inboxes.messages.send(t, {
          to: m.email,
          subject: `New: ${r.title}`,
          html: i,
          text: x
        }), a++;
      } catch (w) {
        let T = w instanceof Error ? w.message : "Unknown error";
        p.push(`${m.email}: ${T}`);
      }
    }
    a > 0 && await o.runMutation(b.newsletter.recordPostSent, {
      postSlug: s.postSlug,
      sentCount: a
    });
    let d = `Sent to ${a} of ${c.length} subscribers.`;
    return p.length > 0 && (d += ` ${p.length} failed.`), { success: a > 0, sentCount: a, message: d };
  }, "handler")
});
function u(o) {
  return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
f(u, "escapeHtml");
var L = S({
  args: {
    siteUrl: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    sentCount: e.number(),
    postCount: e.number(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ f(async (o, s) => {
    let l = await o.runQuery(b.newsletter.getActiveSubscribers);
    if (l.length === 0)
      return {
        success: !1,
        sentCount: 0,
        postCount: 0,
        message: "No subscribers."
      };
    let c = /* @__PURE__ */ new Date();
    c.setDate(c.getDate() - 7);
    let r = c.toISOString().split("T")[0], n = await o.runQuery(b.posts.getRecentPostsInternal, {
      since: r
    });
    if (n.length === 0)
      return {
        success: !0,
        sentCount: 0,
        postCount: 0,
        message: "No new posts in the last 7 days."
      };
    let t = process.env.AGENTMAIL_API_KEY, g = process.env.AGENTMAIL_INBOX;
    if (!t || !g)
      return {
        success: !1,
        sentCount: 0,
        postCount: 0,
        message: A
      };
    let a = s.siteName || "Newsletter", p = 0, y = [], d = new N({ apiKey: t }), m = n.map(
      (i) => `
        <div style="margin-bottom: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
          <h3 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0;">
            <a href="${s.siteUrl}/${i.slug}" style="color: #1a1a1a; text-decoration: none;">${u(i.title)}</a>
          </h3>
          <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">${u(i.description)}</p>
          <p style="font-size: 12px; color: #888; margin: 0;">${i.date}</p>
        </div>
      `
    ).join(""), $ = n.map(
      (i) => `${i.title}
${i.description}
${s.siteUrl}/${i.slug}
${i.date}`
    ).join(`

`);
    for (let i of l) {
      let x = `${s.siteUrl}/unsubscribe?email=${encodeURIComponent(i.email)}&token=${i.unsubscribeToken}`, w = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 8px;">Weekly Digest</h1>
          <p style="font-size: 14px; color: #666; margin-bottom: 24px;">${n.length} new post${n.length > 1 ? "s" : ""} from ${u(a)}</p>
          ${m}
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #888;">
            You received this email because you subscribed to ${u(a)}.<br />
            <a href="${x}" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      `, T = `Weekly Digest - ${n.length} new post${n.length > 1 ? "s" : ""}

${$}

---
Unsubscribe: ${x}`;
      try {
        await d.inboxes.messages.send(g, {
          to: i.email,
          subject: `Weekly Digest: ${n.length} new post${n.length > 1 ? "s" : ""}`,
          html: w,
          text: T
        }), p++;
      } catch (v) {
        let I = v instanceof Error ? v.message : "Unknown error";
        y.push(`${i.email}: ${I}`);
      }
    }
    let h = `Sent ${n.length} post${n.length > 1 ? "s" : ""} to ${p} of ${l.length} subscribers.`;
    return y.length > 0 && (h += ` ${y.length} failed.`), {
      success: p > 0,
      sentCount: p,
      postCount: n.length,
      message: h
    };
  }, "handler")
}), j = S({
  args: {
    email: e.string(),
    source: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ f(async (o, s) => {
    let l = process.env.AGENTMAIL_API_KEY, c = process.env.AGENTMAIL_INBOX, r = process.env.AGENTMAIL_CONTACT_EMAIL || c;
    if (!l || !r)
      return {
        success: !1,
        message: A
      };
    let n = s.siteName || "Your Site", t = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }), g = new N({ apiKey: l });
    try {
      return await g.inboxes.messages.send(c, {
        to: r,
        subject: `New subscriber: ${s.email}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">New Newsletter Subscriber</h2>
            <p style="font-size: 14px; color: #444; line-height: 1.6;">
              <strong>Email:</strong> ${u(s.email)}<br />
              <strong>Source:</strong> ${u(s.source)}<br />
              <strong>Time:</strong> ${t}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #888;">
              This is an automated notification from ${u(n)}.
            </p>
          </div>
        `,
        text: `New Newsletter Subscriber

Email: ${s.email}
Source: ${s.source}
Time: ${t}`
      }), { success: !0, message: "Notification sent." };
    } catch (a) {
      return { success: !1, message: a instanceof Error ? a.message : "Unknown error" };
    }
  }, "handler")
}), G = S({
  args: {
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ f(async (o, s) => {
    let l = process.env.AGENTMAIL_API_KEY, c = process.env.AGENTMAIL_INBOX, r = process.env.AGENTMAIL_CONTACT_EMAIL || c;
    if (!l || !r)
      return { success: !1, message: A };
    let n = s.siteName || "Your Site", t = await o.runQuery(b.newsletter.getStatsForSummary), g = new N({ apiKey: l });
    try {
      return await g.inboxes.messages.send(c, {
        to: r,
        subject: `Weekly Stats: ${t.activeSubscribers} subscribers`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Weekly Newsletter Stats</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
              <p style="font-size: 14px; color: #444; line-height: 1.8; margin: 0;">
                <strong>Active Subscribers:</strong> ${t.activeSubscribers}<br />
                <strong>Total Subscribers:</strong> ${t.totalSubscribers}<br />
                <strong>New This Week:</strong> ${t.newThisWeek}<br />
                <strong>Unsubscribed:</strong> ${t.unsubscribedCount}<br />
                <strong>Newsletters Sent:</strong> ${t.totalNewslettersSent}
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #888;">
              This is an automated weekly summary from ${u(n)}.
            </p>
          </div>
        `,
        text: `Weekly Newsletter Stats

Active Subscribers: ${t.activeSubscribers}
Total Subscribers: ${t.totalSubscribers}
New This Week: ${t.newThisWeek}
Unsubscribed: ${t.unsubscribedCount}
Newsletters Sent: ${t.totalNewslettersSent}`
      }), { success: !0, message: "Stats summary sent." };
    } catch (a) {
      return { success: !1, message: a instanceof Error ? a.message : "Unknown error" };
    }
  }, "handler")
}), R = S({
  args: {
    subject: e.string(),
    content: e.string(),
    // Markdown content
    siteUrl: e.string(),
    siteName: e.optional(e.string())
  },
  returns: e.object({
    success: e.boolean(),
    sentCount: e.number(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ f(async (o, s) => {
    let l = await o.runQuery(b.newsletter.getActiveSubscribers);
    if (l.length === 0)
      return { success: !1, sentCount: 0, message: "No subscribers." };
    let c = process.env.AGENTMAIL_API_KEY, r = process.env.AGENTMAIL_INBOX;
    if (!c || !r)
      return {
        success: !1,
        sentCount: 0,
        message: A
      };
    let n = s.siteName || "Newsletter", t = 0, g = [], a = k(s.content), p = _(s.content), y = new N({ apiKey: c });
    for (let m of l) {
      let $ = `${s.siteUrl}/unsubscribe?email=${encodeURIComponent(m.email)}&token=${m.unsubscribeToken}`, h = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          ${a}
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #888;">
            You received this email because you subscribed to ${u(n)}.<br />
            <a href="${$}" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      `, i = `${p}

---
Unsubscribe: ${$}`;
      try {
        await y.inboxes.messages.send(r, {
          to: m.email,
          subject: s.subject,
          html: h,
          text: i
        }), t++;
      } catch (x) {
        let w = x instanceof Error ? x.message : "Unknown error";
        g.push(`${m.email}: ${w}`);
      }
    }
    t > 0 && await o.runMutation(b.newsletter.recordCustomSent, {
      subject: s.subject,
      sentCount: t
    });
    let d = `Sent to ${t} of ${l.length} subscribers.`;
    return g.length > 0 && (d += ` ${g.length} failed.`), { success: t > 0, sentCount: t, message: d };
  }, "handler")
});
export {
  j as notifyNewSubscriber,
  R as sendCustomNewsletter,
  z as sendPostNewsletter,
  L as sendWeeklyDigest,
  G as sendWeeklyStatsSummary
};
//# sourceMappingURL=newsletterActions.js.map
