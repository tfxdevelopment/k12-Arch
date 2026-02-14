import {
  a as s,
  b as u,
  n as p
} from "./M2D6NT5W.js";

// node_modules/@convex-dev/persistent-text-streaming/dist/component/_generated/api.js
var C = p();

// node_modules/@convex-dev/persistent-text-streaming/dist/client/index.js
var Q = u.string(), y = /* @__PURE__ */ s((i) => i.includes(".") || i.includes("!") || i.includes("?"), "hasDelimeter"), l = class {
  static {
    s(this, "PersistentTextStreaming");
  }
  component;
  options;
  constructor(t, n) {
    this.component = t, this.options = n;
  }
  /**
   * Create a new stream. This will return a stream ID that can be used
   * in an HTTP action to stream data back out to the client while also
   * permanently persisting the final stream in the database.
   *
   * @param ctx - A convex context capable of running mutations.
   * @returns The ID of the new stream.
   * @example
   * ```ts
   * const streaming = new PersistentTextStreaming(api);
   * const streamId = await streaming.createStream(ctx);
   * await streaming.stream(ctx, request, streamId, async (ctx, req, id, append) => {
   *   await append("Hello ");
   *   await append("World!");
   * });
   * ```
   */
  async createStream(t) {
    return await t.runMutation(this.component.lib.createStream);
  }
  /**
   * Get the body of a stream. This will return the full text of the stream
   * and the status of the stream.
   *
   * @param ctx - A convex context capable of running queries.
   * @param streamId - The ID of the stream to get the body of.
   * @returns The body of the stream and the status of the stream.
   * @example
   * ```ts
   * const streaming = new PersistentTextStreaming(api);
   * const { text, status } = await streaming.getStreamBody(ctx, streamId);
   * ```
   */
  async getStreamBody(t, n) {
    let { text: e, status: r } = await t.runQuery(this.component.lib.getStreamText, { streamId: n });
    return { text: e, status: r };
  }
  /**
   * Inside an HTTP action, this will stream data back to the client while
   * also persisting the final stream in the database.
   *
   * @param ctx - A convex context capable of running actions.
   * @param request - The HTTP request object.
   * @param streamId - The ID of the stream.
   * @param streamWriter - A function that generates chunks and writes them
   * to the stream with the given `StreamWriter`.
   * @returns A promise that resolves to an HTTP response. You may need to adjust
   * the headers of this response for CORS, etc.
   * @example
   * ```ts
   * const streaming = new PersistentTextStreaming(api);
   * const streamId = await streaming.createStream(ctx);
   * const response = await streaming.stream(ctx, request, streamId, async (ctx, req, id, append) => {
   *   await append("Hello ");
   *   await append("World!");
   * });
   * ```
   */
  async stream(t, n, e, r) {
    if (await t.runQuery(this.component.lib.getStreamStatus, {
      streamId: e
    }) !== "pending")
      return console.log("Stream was already started"), new Response("", {
        status: 205
      });
    let { readable: m, writable: d } = new TransformStream(), a = d.getWriter(), w = new TextEncoder(), c = "";
    return (/* @__PURE__ */ s(async () => {
      let h = /* @__PURE__ */ s(async (o) => {
        if (a)
          try {
            await a.write(w.encode(o));
          } catch (S) {
            console.error("Error writing to stream", S), console.error("Will skip writing to stream but continue database updates"), a = null;
          }
        c += o, y(o) && (await this.addChunk(t, e, c, !1), c = "");
      }, "chunkAppender");
      try {
        await r(t, n, e, h);
      } catch (o) {
        throw await this.setStreamStatus(t, e, "error"), a && await a.close(), o;
      }
      await this.addChunk(t, e, c, !0), a && await a.close();
    }, "doStream"))(), new Response(m);
  }
  // Internal helper -- add a chunk to the stream.
  async addChunk(t, n, e, r) {
    await t.runMutation(this.component.lib.addChunk, {
      streamId: n,
      text: e,
      final: r
    });
  }
  // Internal helper -- set the status of a stream.
  async setStreamStatus(t, n, e) {
    await t.runMutation(this.component.lib.setStreamStatus, {
      streamId: n,
      status: e
    });
  }
};

export {
  Q as a,
  l as b
};
//# sourceMappingURL=KNP7WMAT.js.map
