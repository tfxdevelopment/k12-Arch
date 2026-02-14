import {
  a as d,
  b as c,
  c as o,
  d as g
} from "./_deps/AJORQ7CY.js";
import {
  a as r,
  b as t
} from "./_deps/M2D6NT5W.js";

// convex/aiChats.ts
var l = t.object({
  role: t.union(t.literal("user"), t.literal("assistant")),
  content: t.string(),
  timestamp: t.number(),
  attachments: t.optional(
    t.array(
      t.object({
        type: t.union(t.literal("image"), t.literal("link")),
        storageId: t.optional(t.id("_storage")),
        url: t.optional(t.string()),
        scrapedContent: t.optional(t.string()),
        title: t.optional(t.string())
      })
    )
  )
}), I = d({
  args: {
    storageId: t.id("_storage")
  },
  returns: t.union(t.string(), t.null()),
  handler: /* @__PURE__ */ r(async (a, e) => await a.storage.getUrl(e.storageId), "handler")
}), m = d({
  args: {
    sessionId: t.string(),
    contextId: t.string()
  },
  returns: t.union(
    t.object({
      _id: t.id("aiChats"),
      _creationTime: t.number(),
      sessionId: t.string(),
      contextId: t.string(),
      messages: t.array(l),
      pageContext: t.optional(t.string()),
      lastMessageAt: t.optional(t.number())
    }),
    t.null()
  ),
  handler: /* @__PURE__ */ r(async (a, e) => await a.db.query("aiChats").withIndex(
    "by_session_and_context",
    (s) => s.eq("sessionId", e.sessionId).eq("contextId", e.contextId)
  ).first(), "handler")
}), p = c({
  args: {
    chatId: t.id("aiChats")
  },
  returns: t.union(
    t.object({
      _id: t.id("aiChats"),
      _creationTime: t.number(),
      sessionId: t.string(),
      contextId: t.string(),
      messages: t.array(l),
      pageContext: t.optional(t.string()),
      lastMessageAt: t.optional(t.number())
    }),
    t.null()
  ),
  handler: /* @__PURE__ */ r(async (a, e) => await a.db.get(e.chatId), "handler")
}), w = c({
  args: {
    storageId: t.id("_storage")
  },
  returns: t.union(t.string(), t.null()),
  handler: /* @__PURE__ */ r(async (a, e) => await a.storage.getUrl(e.storageId), "handler")
}), b = o({
  args: {
    sessionId: t.string(),
    contextId: t.string()
  },
  returns: t.id("aiChats"),
  handler: /* @__PURE__ */ r(async (a, e) => {
    let n = await a.db.query("aiChats").withIndex(
      "by_session_and_context",
      (i) => i.eq("sessionId", e.sessionId).eq("contextId", e.contextId)
    ).first();
    return n ? n._id : await a.db.insert("aiChats", {
      sessionId: e.sessionId,
      contextId: e.contextId,
      messages: [],
      lastMessageAt: Date.now()
    });
  }, "handler")
}), y = o({
  args: {
    chatId: t.id("aiChats"),
    content: t.string()
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => {
    let n = await a.db.get(e.chatId);
    if (!n)
      throw new Error("Chat not found");
    let s = Date.now(), i = {
      role: "user",
      content: e.content,
      timestamp: s
    };
    return await a.db.patch(e.chatId, {
      messages: [...n.messages, i],
      lastMessageAt: s
    }), null;
  }, "handler")
}), C = o({
  args: {
    chatId: t.id("aiChats"),
    content: t.string(),
    attachments: t.optional(
      t.array(
        t.object({
          type: t.union(t.literal("image"), t.literal("link")),
          storageId: t.optional(t.id("_storage")),
          url: t.optional(t.string()),
          scrapedContent: t.optional(t.string()),
          title: t.optional(t.string())
        })
      )
    )
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => {
    let n = await a.db.get(e.chatId);
    if (!n)
      throw new Error("Chat not found");
    let s = Date.now(), i = {
      role: "user",
      content: e.content,
      timestamp: s,
      attachments: e.attachments
    };
    return await a.db.patch(e.chatId, {
      messages: [...n.messages, i],
      lastMessageAt: s
    }), null;
  }, "handler")
}), x = o({
  args: {},
  returns: t.string(),
  handler: /* @__PURE__ */ r(async (a) => await a.storage.generateUploadUrl(), "handler")
}), _ = g({
  args: {
    chatId: t.id("aiChats"),
    content: t.string()
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => {
    let n = await a.db.get(e.chatId);
    if (!n)
      throw new Error("Chat not found");
    let s = Date.now(), i = {
      role: "assistant",
      content: e.content,
      timestamp: s
    };
    return await a.db.patch(e.chatId, {
      messages: [...n.messages, i],
      lastMessageAt: s
    }), null;
  }, "handler")
}), f = o({
  args: {
    chatId: t.id("aiChats")
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => (await a.db.get(e.chatId) && await a.db.patch(e.chatId, {
    messages: [],
    pageContext: void 0,
    lastMessageAt: Date.now()
  }), null), "handler")
}), A = o({
  args: {
    chatId: t.id("aiChats"),
    pageContext: t.string()
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => {
    if (!await a.db.get(e.chatId))
      throw new Error("Chat not found");
    return await a.db.patch(e.chatId, {
      pageContext: e.pageContext
    }), null;
  }, "handler")
}), M = o({
  args: {
    chatId: t.id("aiChats")
  },
  returns: t.null(),
  handler: /* @__PURE__ */ r(async (a, e) => (await a.db.get(e.chatId) && await a.db.delete(e.chatId), null), "handler")
}), q = d({
  args: {
    sessionId: t.string()
  },
  returns: t.array(
    t.object({
      _id: t.id("aiChats"),
      _creationTime: t.number(),
      sessionId: t.string(),
      contextId: t.string(),
      messages: t.array(l),
      pageContext: t.optional(t.string()),
      lastMessageAt: t.optional(t.number())
    })
  ),
  handler: /* @__PURE__ */ r(async (a, e) => await a.db.query("aiChats").withIndex("by_session", (s) => s.eq("sessionId", e.sessionId)).collect(), "handler")
}), U = g({
  args: {
    sessionId: t.string(),
    prompt: t.string(),
    model: t.string(),
    storageId: t.id("_storage"),
    mimeType: t.string()
  },
  returns: t.id("aiGeneratedImages"),
  handler: /* @__PURE__ */ r(async (a, e) => await a.db.insert("aiGeneratedImages", {
    sessionId: e.sessionId,
    prompt: e.prompt,
    model: e.model,
    storageId: e.storageId,
    mimeType: e.mimeType,
    createdAt: Date.now()
  }), "handler")
}), j = c({
  args: {
    sessionId: t.string(),
    limit: t.number()
  },
  returns: t.array(
    t.object({
      _id: t.id("aiGeneratedImages"),
      _creationTime: t.number(),
      sessionId: t.string(),
      prompt: t.string(),
      model: t.string(),
      storageId: t.id("_storage"),
      mimeType: t.string(),
      createdAt: t.number()
    })
  ),
  handler: /* @__PURE__ */ r(async (a, e) => await a.db.query("aiGeneratedImages").withIndex("by_session", (s) => s.eq("sessionId", e.sessionId)).order("desc").take(e.limit), "handler")
}), T = o({
  args: {
    storageId: t.id("_storage")
  },
  returns: t.object({ success: t.boolean() }),
  handler: /* @__PURE__ */ r(async (a, e) => {
    let n = await a.db.query("aiGeneratedImages").withIndex("by_storageId", (s) => s.eq("storageId", e.storageId)).first();
    return n && await a.db.delete(n._id), await a.storage.delete(e.storageId), { success: !0 };
  }, "handler")
});
export {
  _ as addAssistantMessage,
  y as addUserMessage,
  C as addUserMessageWithAttachments,
  f as clearChat,
  M as deleteChat,
  T as deleteGeneratedImage,
  x as generateUploadUrl,
  m as getAIChatByContext,
  p as getAIChatInternal,
  q as getChatsBySession,
  b as getOrCreateAIChat,
  j as getRecentImagesInternal,
  I as getStorageUrl,
  w as getStorageUrlInternal,
  U as saveGeneratedImage,
  A as setPageContext
};
//# sourceMappingURL=aiChats.js.map
