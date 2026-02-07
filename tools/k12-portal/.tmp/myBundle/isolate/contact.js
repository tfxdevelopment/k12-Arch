import {
  c,
  d as i
} from "./_deps/AJORQ7CY.js";
import {
  b as m
} from "./_deps/Y2CE7CMW.js";
import {
  a as o,
  b as e
} from "./_deps/M2D6NT5W.js";

// convex/contact.ts
var A = c({
  args: {
    name: e.string(),
    email: e.string(),
    message: e.string(),
    source: e.string()
    // "page:slug" or "post:slug"
  },
  returns: e.object({
    success: e.boolean(),
    message: e.string()
  }),
  handler: /* @__PURE__ */ o(async (a, s) => {
    let n = s.name.trim(), t = s.email.toLowerCase().trim(), r = s.message.trim();
    if (!n)
      return { success: !1, message: "Please enter your name." };
    if (!t || !t.includes("@") || !t.includes("."))
      return { success: !1, message: "Please enter a valid email address." };
    if (!r)
      return { success: !1, message: "Please enter a message." };
    let u = await a.db.insert("contactMessages", {
      name: n,
      email: t,
      message: r,
      source: s.source,
      createdAt: Date.now()
    });
    return await a.scheduler.runAfter(0, m.contactActions.sendContactEmail, {
      messageId: u,
      name: n,
      email: t,
      message: r,
      source: s.source
    }), {
      success: !0,
      message: "Thanks for your message! We'll get back to you soon."
    };
  }, "handler")
}), f = i({
  args: {
    messageId: e.id("contactMessages")
  },
  returns: e.null(),
  handler: /* @__PURE__ */ o(async (a, s) => (await a.db.patch(s.messageId, {
    emailSentAt: Date.now()
  }), null), "handler")
});
export {
  f as markEmailSent,
  A as submitContact
};
//# sourceMappingURL=contact.js.map
