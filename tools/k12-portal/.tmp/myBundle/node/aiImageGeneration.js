"use node";
import {
  a as d,
  f as e,
  g,
  j as c
} from "./_deps/node/27R56OS5.js";

// convex/aiImageGeneration.ts
import { GoogleGenAI as b } from "@google/genai";
var v = e.union(
  e.literal("gemini-2.0-flash-exp-image-generation"),
  e.literal("imagen-3.0-generate-002")
), A = e.union(
  e.literal("1:1"),
  e.literal("16:9"),
  e.literal("9:16"),
  e.literal("4:3"),
  e.literal("3:4")
), R = g({
  args: {
    sessionId: e.string(),
    prompt: e.string(),
    model: v,
    aspectRatio: e.optional(A)
  },
  returns: e.object({
    success: e.boolean(),
    storageId: e.optional(e.id("_storage")),
    url: e.optional(e.string()),
    error: e.optional(e.string())
  }),
  handler: /* @__PURE__ */ d(async (a, t) => {
    let o = process.env.GOOGLE_AI_API_KEY;
    if (!o)
      return {
        success: !1,
        error: `**Gemini Image Generation is not configured.**

To use image generation, add your \`GOOGLE_AI_API_KEY\` to the Convex environment variables.

**Setup steps:**
1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Add it to Convex: \`npx convex env set GOOGLE_AI_API_KEY your-key-here\`
3. For production, set it in the [Convex Dashboard](https://dashboard.convex.dev/)

See the [Convex environment variables docs](https://docs.convex.dev/production/environment-variables) for more details.`
      };
    try {
      let n = new b({ apiKey: o }), r, i = "image/png";
      if (t.model === "gemini-2.0-flash-exp-image-generation") {
        let p = (await n.models.generateContent({
          model: t.model,
          contents: [{ role: "user", parts: [{ text: t.prompt }] }],
          config: {
            responseModalities: ["image", "text"]
          }
        })).candidates?.[0]?.content?.parts?.find(
          (h) => h.inlineData?.mimeType?.startsWith("image/")
        ), s = p?.inlineData;
        if (!p || !s || !s.mimeType || !s.data)
          return {
            success: !1,
            error: "No image was generated. Try a different prompt."
          };
        i = s.mimeType, r = u(s.data);
      } else {
        let m = (await n.models.generateImages({
          model: t.model,
          prompt: t.prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: t.aspectRatio || "1:1"
          }
        })).generatedImages?.[0];
        if (!m || !m.image?.imageBytes)
          return {
            success: !1,
            error: "No image was generated. Try a different prompt."
          };
        i = "image/png", r = u(m.image.imageBytes);
      }
      let f = new Blob([r], { type: i }), l = await a.storage.store(f), I = await a.storage.getUrl(l);
      return await a.runMutation(c.aiChats.saveGeneratedImage, {
        sessionId: t.sessionId,
        prompt: t.prompt,
        model: t.model,
        storageId: l,
        mimeType: i
      }), {
        success: !0,
        storageId: l,
        url: I || void 0
      };
    } catch (n) {
      let r = n instanceof Error ? n.message : "Unknown error";
      return r.includes("quota") || r.includes("rate") ? {
        success: !1,
        error: "**Rate limit exceeded.** Please try again in a few moments."
      } : r.includes("safety") || r.includes("blocked") ? {
        success: !1,
        error: "**Image generation blocked.** The prompt may have triggered content safety filters. Try rephrasing your prompt."
      } : {
        success: !1,
        error: `**Image generation failed:** ${r}`
      };
    }
  }, "handler")
}), P = g({
  args: {
    sessionId: e.string(),
    limit: e.optional(e.number())
  },
  returns: e.array(
    e.object({
      _id: e.id("aiGeneratedImages"),
      prompt: e.string(),
      model: e.string(),
      url: e.union(e.string(), e.null()),
      createdAt: e.number()
    })
  ),
  handler: /* @__PURE__ */ d(async (a, t) => {
    let o = await a.runQuery(c.aiChats.getRecentImagesInternal, {
      sessionId: t.sessionId,
      limit: t.limit || 10
    });
    return await Promise.all(
      o.map(async (r) => ({
        _id: r._id,
        prompt: r.prompt,
        model: r.model,
        url: await a.storage.getUrl(r.storageId),
        createdAt: r.createdAt
      }))
    );
  }, "handler")
});
function u(a) {
  let t = atob(a), o = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++)
    o[n] = t.charCodeAt(n);
  return o;
}
d(u, "base64ToBytes");
export {
  R as generateImage,
  P as getRecentImages
};
//# sourceMappingURL=aiImageGeneration.js.map
