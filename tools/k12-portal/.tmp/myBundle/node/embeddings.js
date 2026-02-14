"use node";
import {
  a as d,
  f as e,
  g as c,
  h as a,
  j as t
} from "./_deps/node/27R56OS5.js";

// convex/embeddings.ts
import u from "openai";
var P = a({
  args: { text: e.string() },
  returns: e.array(e.float64()),
  handler: /* @__PURE__ */ d(async (s, { text: i }) => {
    let n = process.env.OPENAI_API_KEY;
    if (!n)
      throw new Error("OPENAI_API_KEY not configured in Convex environment");
    return (await new u({ apiKey: n }).embeddings.create({
      model: "text-embedding-ada-002",
      input: i.slice(0, 8e3)
      // Truncate to stay within token limit
    })).data[0].embedding;
  }, "handler")
}), E = a({
  args: {},
  returns: e.object({ processed: e.number() }),
  handler: /* @__PURE__ */ d(async (s) => {
    let i = await s.runQuery(
      t.embeddingsQueries.getPostsWithoutEmbeddings,
      { limit: 10 }
    ), n = 0;
    for (let r of i)
      try {
        let o = `${r.title}

${r.content}`, g = await s.runAction(t.embeddings.generateEmbedding, {
          text: o
        });
        await s.runMutation(t.embeddingsQueries.savePostEmbedding, {
          id: r._id,
          embedding: g
        }), n++;
      } catch (o) {
        console.error(`Failed to generate embedding for post ${r._id}:`, o);
      }
    return { processed: n };
  }, "handler")
}), f = a({
  args: {},
  returns: e.object({ processed: e.number() }),
  handler: /* @__PURE__ */ d(async (s) => {
    let i = await s.runQuery(
      t.embeddingsQueries.getPagesWithoutEmbeddings,
      { limit: 10 }
    ), n = 0;
    for (let r of i)
      try {
        let o = `${r.title}

${r.content}`, g = await s.runAction(t.embeddings.generateEmbedding, {
          text: o
        });
        await s.runMutation(t.embeddingsQueries.savePageEmbedding, {
          id: r._id,
          embedding: g
        }), n++;
      } catch (o) {
        console.error(`Failed to generate embedding for page ${r._id}:`, o);
      }
    return { processed: n };
  }, "handler")
}), A = c({
  args: {},
  returns: e.object({
    postsProcessed: e.number(),
    pagesProcessed: e.number(),
    skipped: e.boolean()
  }),
  handler: /* @__PURE__ */ d(async (s) => {
    if (!process.env.OPENAI_API_KEY)
      return console.log("OPENAI_API_KEY not set, skipping embedding generation"), { postsProcessed: 0, pagesProcessed: 0, skipped: !0 };
    let i = await s.runAction(
      t.embeddings.generatePostEmbeddings,
      {}
    ), n = await s.runAction(
      t.embeddings.generatePageEmbeddings,
      {}
    );
    return {
      postsProcessed: i.processed,
      pagesProcessed: n.processed,
      skipped: !1
    };
  }, "handler")
}), _ = c({
  args: { slug: e.string() },
  returns: e.object({ success: e.boolean(), error: e.optional(e.string()) }),
  handler: /* @__PURE__ */ d(async (s, i) => {
    if (!process.env.OPENAI_API_KEY)
      return { success: !1, error: "OPENAI_API_KEY not configured" };
    let n = await s.runQuery(t.embeddingsQueries.getPostBySlug, {
      slug: i.slug
    });
    if (!n)
      return { success: !1, error: "Post not found" };
    try {
      let r = `${n.title}

${n.content}`, o = await s.runAction(t.embeddings.generateEmbedding, {
        text: r
      });
      return await s.runMutation(t.embeddingsQueries.savePostEmbedding, {
        id: n._id,
        embedding: o
      }), { success: !0 };
    } catch (r) {
      return { success: !1, error: String(r) };
    }
  }, "handler")
});
export {
  P as generateEmbedding,
  A as generateMissingEmbeddings,
  f as generatePageEmbeddings,
  E as generatePostEmbeddings,
  _ as regeneratePostEmbedding
};
//# sourceMappingURL=embeddings.js.map
