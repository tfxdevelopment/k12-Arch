import {
  a as u,
  b as l
} from "./_deps/KNP7WMAT.js";
import {
  a,
  b as i,
  c as m
} from "./_deps/AJORQ7CY.js";
import {
  c as d
} from "./_deps/Y2CE7CMW.js";
import {
  a as o,
  b as t
} from "./_deps/M2D6NT5W.js";

// convex/askAI.ts
var c = new l(d.persistentTextStreaming), w = m({
  args: {
    question: t.string(),
    model: t.optional(t.string())
  },
  returns: t.object({
    sessionId: t.id("askAISessions"),
    streamId: t.string()
  }),
  handler: /* @__PURE__ */ o(async (e, { question: s, model: r }) => {
    let n = await c.createStream(e);
    return { sessionId: await e.db.insert("askAISessions", {
      question: s,
      streamId: n,
      model: r || "claude-sonnet-4-20250514",
      createdAt: Date.now()
    }), streamId: n };
  }, "handler")
}), f = a({
  args: {
    streamId: u
  },
  handler: /* @__PURE__ */ o(async (e, { streamId: s }) => await c.getStreamBody(e, s), "handler")
}), b = i({
  args: {
    streamId: t.string()
  },
  returns: t.union(
    t.object({
      question: t.string(),
      model: t.optional(t.string())
    }),
    t.null()
  ),
  handler: /* @__PURE__ */ o(async (e, { streamId: s }) => {
    let r = await e.db.query("askAISessions").withIndex("by_stream", (n) => n.eq("streamId", s)).first();
    return r ? { question: r.question, model: r.model } : null;
  }, "handler")
});
export {
  w as createSession,
  b as getSessionByStreamId,
  f as getStreamBody
};
//# sourceMappingURL=askAI.js.map
