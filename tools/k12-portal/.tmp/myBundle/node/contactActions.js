"use node";
import {
  a as m
} from "./_deps/node/HBZJI64A.js";
import {
  a as s,
  f as t,
  h as l,
  j as d
} from "./_deps/node/27R56OS5.js";

// convex/contactActions.ts
var y = l({
  args: {
    messageId: t.id("contactMessages"),
    name: t.string(),
    email: t.string(),
    message: t.string(),
    source: t.string()
  },
  returns: t.null(),
  handler: /* @__PURE__ */ s(async (n, e) => {
    let a = process.env.AGENTMAIL_API_KEY, i = process.env.AGENTMAIL_INBOX, r = process.env.AGENTMAIL_CONTACT_EMAIL || i;
    if (!a || !i || !r)
      return null;
    let p = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 100px;">From:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${o(e.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${o(e.email)}">${o(e.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Source:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${o(e.source)}</td>
          </tr>
        </table>
        <h3 style="font-size: 16px; color: #1a1a1a; margin: 24px 0 8px 0;">Message:</h3>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${o(e.message)}</div>
      </div>
    `, c = `New Contact Form Submission

From: ${e.name}
Email: ${e.email}
Source: ${e.source}

Message:
${e.message}`;
    try {
      await new m({ apiKey: a }).inboxes.messages.send(i, {
        to: r,
        subject: `Contact: ${e.name} via ${e.source}`,
        text: c,
        html: p
      }), await n.runMutation(d.contact.markEmailSent, {
        messageId: e.messageId
      });
    } catch {
    }
    return null;
  }, "handler")
});
function o(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
s(o, "escapeHtml");
export {
  y as sendContactEmail
};
//# sourceMappingURL=contactActions.js.map
