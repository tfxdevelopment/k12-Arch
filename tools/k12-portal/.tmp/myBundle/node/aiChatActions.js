"use node";
import {
  a as d,
  f as t,
  g as C,
  j as A
} from "./_deps/node/27R56OS5.js";

// convex/aiChatActions.ts
import I from "@anthropic-ai/sdk";
import P from "openai";
import { GoogleGenAI as w } from "@google/genai";
import k from "@mendable/firecrawl-js";
var v = t.union(
  t.literal("claude-sonnet-4-20250514"),
  t.literal("gpt-4o"),
  t.literal("gemini-2.0-flash")
), _ = `You are a helpful writing assistant. Help users write clearly and concisely.

Always apply the rule of one:
Focus on one person.
Address one specific problem they are facing.
Identify the single root cause of that problem.
Explain the one thing the solution does differently.
End by asking for one clear action.

Follow these guidelines:
Write in a clear and direct style.
Avoid jargon and unnecessary complexity.
Use short sentences and short paragraphs.
Be concise but thorough.
Do not use em dashes.
Format responses in markdown when appropriate.`;
function M() {
  let n = process.env.CLAUDE_PROMPT_STYLE || "", r = process.env.CLAUDE_PROMPT_COMMUNITY || "", a = process.env.CLAUDE_PROMPT_RULES || "", c = [n, r, a].filter((m) => m.trim());
  return c.length > 0 ? c.join(`

---

`) : process.env.CLAUDE_SYSTEM_PROMPT || _;
}
d(M, "buildSystemPrompt");
async function E(n) {
  let r = process.env.FIRECRAWL_API_KEY;
  if (!r)
    return null;
  try {
    let c = await new k({ apiKey: r }).scrapeUrl(n, {
      formats: ["markdown"]
    });
    return !c.success || !c.markdown ? null : {
      content: c.markdown,
      title: c.metadata?.title
    };
  } catch {
    return null;
  }
}
d(E, "scrapeUrl");
function T(n) {
  return n.startsWith("claude") ? "anthropic" : n.startsWith("gpt") ? "openai" : n.startsWith("gemini") ? "google" : "anthropic";
}
d(T, "getProviderFromModel");
function O(n) {
  switch (n) {
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY || null;
    case "openai":
      return process.env.OPENAI_API_KEY || null;
    case "google":
      return process.env.GOOGLE_AI_API_KEY || null;
  }
}
d(O, "getApiKeyForProvider");
function U(n) {
  let a = {
    anthropic: {
      name: "Claude (Anthropic)",
      envVar: "ANTHROPIC_API_KEY",
      consoleUrl: "https://console.anthropic.com/",
      consoleName: "Anthropic Console"
    },
    openai: {
      name: "GPT (OpenAI)",
      envVar: "OPENAI_API_KEY",
      consoleUrl: "https://platform.openai.com/api-keys",
      consoleName: "OpenAI Platform"
    },
    google: {
      name: "Gemini (Google)",
      envVar: "GOOGLE_AI_API_KEY",
      consoleUrl: "https://aistudio.google.com/apikey",
      consoleName: "Google AI Studio"
    }
  }[n];
  return `**${a.name} is not configured.**

To enable this model, add your \`${a.envVar}\` to the Convex environment variables.

**Setup steps:**
1. Get an API key from [${a.consoleName}](${a.consoleUrl})
2. Add it to Convex: \`npx convex env set ${a.envVar} your-key-here\`
3. For production, set it in the [Convex Dashboard](https://dashboard.convex.dev/)

See the [Convex environment variables docs](https://docs.convex.dev/production/environment-variables) for more details.`;
}
d(U, "getNotConfiguredMessage");
async function b(n, r, a, c) {
  let f = (await new I({ apiKey: n }).messages.create({
    model: r,
    max_tokens: 2048,
    system: a,
    messages: c
  })).content.find((h) => h.type === "text");
  if (!f || f.type !== "text")
    throw new Error("No text content in Claude response");
  return f.text;
}
d(b, "callAnthropicApi");
async function G(n, r, a, c) {
  let m = new P({ apiKey: n }), l = [
    { role: "system", content: a }
  ];
  for (let s of c)
    if (typeof s.content == "string")
      s.role === "user" ? l.push({ role: "user", content: s.content }) : l.push({ role: "assistant", content: s.content });
    else {
      let g = [];
      for (let i of s.content)
        i.type === "text" ? g.push({ type: "text", text: i.text }) : i.type === "image" && "source" in i && i.source.type === "url" && g.push({ type: "image_url", image_url: { url: i.source.url } });
      if (s.role === "user")
        l.push({
          role: "user",
          content: g.length === 1 && g[0].type === "text" ? g[0].text : g
        });
      else {
        let i = g.filter((p) => p.type === "text").map((p) => p.text).join(`
`);
        l.push({ role: "assistant", content: i });
      }
    }
  let h = (await m.chat.completions.create({
    model: r,
    max_tokens: 2048,
    messages: l
  })).choices[0]?.message?.content;
  if (!h)
    throw new Error("No text content in OpenAI response");
  return h;
}
d(G, "callOpenAIApi");
async function N(n, r, a, c) {
  let m = new w({ apiKey: n }), l = [];
  for (let s of c) {
    let g = s.role === "assistant" ? "model" : "user";
    if (typeof s.content == "string")
      l.push({
        role: g,
        parts: [{ text: s.content }]
      });
    else {
      let i = [];
      for (let p of s.content)
        p.type === "text" && i.push({ text: p.text });
      i.length > 0 && l.push({ role: g, parts: i });
    }
  }
  let h = (await m.models.generateContent({
    model: r,
    contents: l,
    config: {
      systemInstruction: a,
      maxOutputTokens: 2048
    }
  })).candidates?.[0]?.content?.parts?.find(
    (s) => s.text
  );
  if (!h || !("text" in h))
    throw new Error("No text content in Gemini response");
  return h.text;
}
d(N, "callGeminiApi");
var D = C({
  args: {
    chatId: t.id("aiChats"),
    userMessage: t.string(),
    model: t.optional(v),
    pageContext: t.optional(t.string()),
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
  returns: t.string(),
  handler: /* @__PURE__ */ d(async (n, r) => {
    let a = r.model || "claude-sonnet-4-20250514", c = T(a), m = O(c);
    if (!m) {
      let o = U(c);
      return await n.runMutation(A.aiChats.addAssistantMessage, {
        chatId: r.chatId,
        content: o
      }), o;
    }
    let l = await n.runQuery(A.aiChats.getAIChatInternal, {
      chatId: r.chatId
    });
    if (!l)
      throw new Error("Chat not found");
    let f = M(), h = r.pageContext || l.pageContext;
    h && (f += `

---

The user is viewing a page with the following content. Use this as context for your responses:

${h}`);
    let s = r.attachments;
    s && s.length > 0 && (s = await Promise.all(
      s.map(async (e) => {
        if (e.type === "link" && e.url && !e.scrapedContent) {
          let u = await E(e.url);
          if (u)
            return {
              ...e,
              scrapedContent: u.content,
              title: u.title || e.title
            };
        }
        return e;
      })
    ));
    let g = l.messages.slice(-20), i = [];
    for (let o of g)
      if (o.role === "assistant")
        i.push({
          role: "assistant",
          content: o.content
        });
      else {
        let e = [];
        if (o.content && e.push({
          type: "text",
          text: o.content
        }), o.attachments) {
          for (let u of o.attachments)
            if (u.type === "image" && u.storageId) {
              let x = await n.runQuery(
                A.aiChats.getStorageUrlInternal,
                { storageId: u.storageId }
              );
              x && e.push({
                type: "image",
                source: {
                  type: "url",
                  url: x
                }
              });
            } else if (u.type === "link") {
              let x = u.url || "";
              u.scrapedContent && (x += `

Content from ${u.url}:
${u.scrapedContent}`), x && e.push({
                type: "text",
                text: x
              });
            }
        }
        i.push({
          role: "user",
          content: e.length === 1 && e[0].type === "text" ? e[0].text : e
        });
      }
    let p = [];
    if (r.userMessage && p.push({
      type: "text",
      text: r.userMessage
    }), s && s.length > 0) {
      for (let o of s)
        if (o.type === "image" && o.storageId) {
          let e = await n.runQuery(
            A.aiChats.getStorageUrlInternal,
            { storageId: o.storageId }
          );
          e && p.push({
            type: "image",
            source: {
              type: "url",
              url: e
            }
          });
        } else if (o.type === "link") {
          let e = o.url || "";
          o.scrapedContent && (e += `

Content from ${o.url}:
${o.scrapedContent}`), e && p.push({
            type: "text",
            text: e
          });
        }
    }
    i.push({
      role: "user",
      content: p.length === 1 && p[0].type === "text" ? p[0].text : p
    });
    let y;
    try {
      switch (c) {
        case "anthropic":
          y = await b(m, a, f, i);
          break;
        case "openai":
          y = await G(m, a, f, i);
          break;
        case "google":
          y = await N(m, a, f, i);
          break;
      }
    } catch (o) {
      let e = o instanceof Error ? o.message : "Unknown error";
      y = `**Error from ${c}:** ${e}`;
    }
    return await n.runMutation(A.aiChats.addAssistantMessage, {
      chatId: r.chatId,
      content: y
    }), y;
  }, "handler")
});
export {
  D as generateResponse
};
//# sourceMappingURL=aiChatActions.js.map
