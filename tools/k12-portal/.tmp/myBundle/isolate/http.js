import {
  a as Ci,
  b as ki
} from "./_deps/ITXHG73A.js";
import {
  b as Ii
} from "./_deps/KNP7WMAT.js";
import {
  e as Ri,
  f as ve
} from "./_deps/AJORQ7CY.js";
import {
  a as Ei,
  c as no
} from "./_deps/LFQTZ6CE.js";
import {
  a as me,
  b as Ys,
  c as Zs
} from "./_deps/Y2CE7CMW.js";
import {
  a as i,
  b as At,
  m as Si
} from "./_deps/M2D6NT5W.js";

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function _(s, e, t, r, n) {
  if (r === "m")
    throw new TypeError("Private method is not writable");
  if (r === "a" && !n)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}
i(_, "__classPrivateFieldSet");
function c(s, e, t, r) {
  if (t === "a" && !r)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}
i(c, "__classPrivateFieldGet");

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
var oo = /* @__PURE__ */ i(function() {
  let { crypto: s } = globalThis;
  if (s?.randomUUID)
    return oo = s.randomUUID.bind(s), s.randomUUID();
  let e = new Uint8Array(1), t = s ? () => s.getRandomValues(e)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (r) => (+r ^ t() & 15 >> +r / 4).toString(16));
}, "uuid4");

// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function Fe(s) {
  return typeof s == "object" && s !== null && // Spec-compliant fetch implementations
  ("name" in s && s.name === "AbortError" || // Expo fetch
  "message" in s && String(s.message).includes("FetchRequestCanceledException"));
}
i(Fe, "isAbortError");
var os = /* @__PURE__ */ i((s) => {
  if (s instanceof Error)
    return s;
  if (typeof s == "object" && s !== null) {
    try {
      if (Object.prototype.toString.call(s) === "[object Error]") {
        let e = new Error(s.message, s.cause ? { cause: s.cause } : {});
        return s.stack && (e.stack = s.stack), s.cause && !e.cause && (e.cause = s.cause), s.name && (e.name = s.name), e;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(s));
    } catch {
    }
  }
  return new Error(s);
}, "castToError");

// node_modules/@anthropic-ai/sdk/core/error.mjs
var x = class extends Error {
  static {
    i(this, "AnthropicError");
  }
}, G = class s extends x {
  static {
    i(this, "APIError");
  }
  constructor(e, t, r, n) {
    super(`${s.makeMessage(e, t, r)}`), this.status = e, this.headers = n, this.requestID = n?.get("request-id"), this.error = t;
  }
  static makeMessage(e, t, r) {
    let n = t?.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : r;
    return e && n ? `${e} ${n}` : e ? `${e} status code (no body)` : n || "(no status code or body)";
  }
  static generate(e, t, r, n) {
    if (!e || !n)
      return new Ge({ message: r, cause: os(t) });
    let o = t;
    return e === 400 ? new sr(e, o, r, n) : e === 401 ? new nr(e, o, r, n) : e === 403 ? new or(e, o, r, n) : e === 404 ? new ir(e, o, r, n) : e === 409 ? new ar(e, o, r, n) : e === 422 ? new lr(e, o, r, n) : e === 429 ? new cr(e, o, r, n) : e >= 500 ? new ur(e, o, r, n) : new s(e, o, r, n);
  }
}, Y = class extends G {
  static {
    i(this, "APIUserAbortError");
  }
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, Ge = class extends G {
  static {
    i(this, "APIConnectionError");
  }
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, rr = class extends Ge {
  static {
    i(this, "APIConnectionTimeoutError");
  }
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, sr = class extends G {
  static {
    i(this, "BadRequestError");
  }
}, nr = class extends G {
  static {
    i(this, "AuthenticationError");
  }
}, or = class extends G {
  static {
    i(this, "PermissionDeniedError");
  }
}, ir = class extends G {
  static {
    i(this, "NotFoundError");
  }
}, ar = class extends G {
  static {
    i(this, "ConflictError");
  }
}, lr = class extends G {
  static {
    i(this, "UnprocessableEntityError");
  }
}, cr = class extends G {
  static {
    i(this, "RateLimitError");
  }
}, ur = class extends G {
  static {
    i(this, "InternalServerError");
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
var dl = /^[a-z][a-z0-9+.-]*:/i, Oi = /* @__PURE__ */ i((s) => dl.test(s), "isAbsoluteURL"), io = /* @__PURE__ */ i((s) => (io = Array.isArray, io(s)), "isArray"), ao = io;
function en(s) {
  return typeof s != "object" ? {} : s ?? {};
}
i(en, "maybeObj");
function Ti(s) {
  if (!s)
    return !0;
  for (let e in s)
    return !1;
  return !0;
}
i(Ti, "isEmptyObj");
function Mi(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
i(Mi, "hasOwn");
var $i = /* @__PURE__ */ i((s, e) => {
  if (typeof e != "number" || !Number.isInteger(e))
    throw new x(`${s} must be an integer`);
  if (e < 0)
    throw new x(`${s} must be a positive integer`);
  return e;
}, "validatePositiveInteger");
var tn = /* @__PURE__ */ i((s) => {
  try {
    return JSON.parse(s);
  } catch {
    return;
  }
}, "safeJSON");

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
var vi = /* @__PURE__ */ i((s) => new Promise((e) => setTimeout(e, s)), "sleep");

// node_modules/@anthropic-ai/sdk/version.mjs
var Qe = "0.71.2";

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
var Li = /* @__PURE__ */ i(() => (
  // @ts-ignore
  typeof window < "u" && // @ts-ignore
  typeof window.document < "u" && // @ts-ignore
  typeof navigator < "u"
), "isRunningInBrowser");
function pl() {
  return typeof Deno < "u" && Deno.build != null ? "deno" : typeof EdgeRuntime < "u" ? "edge" : Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]" ? "node" : "unknown";
}
i(pl, "getDetectedPlatform");
var ml = /* @__PURE__ */ i(() => {
  let s = pl();
  if (s === "deno")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Qe,
      "X-Stainless-OS": Ni(Deno.build.os),
      "X-Stainless-Arch": Fi(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  if (typeof EdgeRuntime < "u")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Qe,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
  if (s === "node")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Qe,
      "X-Stainless-OS": Ni(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": Fi(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
  let e = gl();
  return e ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Qe,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${e.browser}`,
    "X-Stainless-Runtime-Version": e.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Qe,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function gl() {
  if (typeof navigator > "u" || !navigator)
    return null;
  let s = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (let { key: e, pattern: t } of s) {
    let r = t.exec(navigator.userAgent);
    if (r) {
      let n = r[1] || 0, o = r[2] || 0, a = r[3] || 0;
      return { browser: e, version: `${n}.${o}.${a}` };
    }
  }
  return null;
}
i(gl, "getBrowserInfo");
var Fi = /* @__PURE__ */ i((s) => s === "x32" ? "x32" : s === "x86_64" || s === "x64" ? "x64" : s === "arm" ? "arm" : s === "aarch64" || s === "arm64" ? "arm64" : s ? `other:${s}` : "unknown", "normalizeArch"), Ni = /* @__PURE__ */ i((s) => (s = s.toLowerCase(), s.includes("ios") ? "iOS" : s === "android" ? "Android" : s === "darwin" ? "MacOS" : s === "win32" ? "Windows" : s === "freebsd" ? "FreeBSD" : s === "openbsd" ? "OpenBSD" : s === "linux" ? "Linux" : s ? `Other:${s}` : "Unknown"), "normalizePlatform"), Bi, ji = /* @__PURE__ */ i(() => Bi ?? (Bi = ml()), "getPlatformHeaders");

// node_modules/@anthropic-ai/sdk/internal/shims.mjs
function Ui() {
  if (typeof fetch < "u")
    return fetch;
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
i(Ui, "getDefaultFetch");
function lo(...s) {
  let e = globalThis.ReadableStream;
  if (typeof e > "u")
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new e(...s);
}
i(lo, "makeReadableStream");
function rn(s) {
  let e = Symbol.asyncIterator in s ? s[Symbol.asyncIterator]() : s[Symbol.iterator]();
  return lo({
    start() {
    },
    async pull(t) {
      let { done: r, value: n } = await e.next();
      r ? t.close() : t.enqueue(n);
    },
    async cancel() {
      await e.return?.();
    }
  });
}
i(rn, "ReadableStreamFrom");
function is(s) {
  if (s[Symbol.asyncIterator])
    return s;
  let e = s.getReader();
  return {
    async next() {
      try {
        let t = await e.read();
        return t?.done && e.releaseLock(), t;
      } catch (t) {
        throw e.releaseLock(), t;
      }
    },
    async return() {
      let t = e.cancel();
      return e.releaseLock(), await t, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
i(is, "ReadableStreamToAsyncIterable");
async function Di(s) {
  if (s === null || typeof s != "object")
    return;
  if (s[Symbol.asyncIterator]) {
    await s[Symbol.asyncIterator]().return?.();
    return;
  }
  let e = s.getReader(), t = e.cancel();
  e.releaseLock(), await t;
}
i(Di, "CancelReadableStream");

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
var qi = /* @__PURE__ */ i(({ headers: s, body: e }) => ({
  bodyHeaders: {
    "content-type": "application/json"
  },
  body: JSON.stringify(e)
}), "FallbackEncoder");

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function Ji(s) {
  let e = 0;
  for (let n of s)
    e += n.length;
  let t = new Uint8Array(e), r = 0;
  for (let n of s)
    t.set(n, r), r += n.length;
  return t;
}
i(Ji, "concatBytes");
var Wi;
function as(s) {
  let e;
  return (Wi ?? (e = new globalThis.TextEncoder(), Wi = e.encode.bind(e)))(s);
}
i(as, "encodeUTF8");
var Hi;
function co(s) {
  let e;
  return (Hi ?? (e = new globalThis.TextDecoder(), Hi = e.decode.bind(e)))(s);
}
i(co, "decodeUTF8");

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var se, ne, Ne = class {
  static {
    i(this, "LineDecoder");
  }
  constructor() {
    se.set(this, void 0), ne.set(this, void 0), _(this, se, new Uint8Array(), "f"), _(this, ne, null, "f");
  }
  decode(e) {
    if (e == null)
      return [];
    let t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? as(e) : e;
    _(this, se, Ji([c(this, se, "f"), t]), "f");
    let r = [], n;
    for (; (n = wl(c(this, se, "f"), c(this, ne, "f"))) != null; ) {
      if (n.carriage && c(this, ne, "f") == null) {
        _(this, ne, n.index, "f");
        continue;
      }
      if (c(this, ne, "f") != null && (n.index !== c(this, ne, "f") + 1 || n.carriage)) {
        r.push(co(c(this, se, "f").subarray(0, c(this, ne, "f") - 1))), _(this, se, c(this, se, "f").subarray(c(this, ne, "f")), "f"), _(this, ne, null, "f");
        continue;
      }
      let o = c(this, ne, "f") !== null ? n.preceding - 1 : n.preceding, a = co(c(this, se, "f").subarray(0, o));
      r.push(a), _(this, se, c(this, se, "f").subarray(n.index), "f"), _(this, ne, null, "f");
    }
    return r;
  }
  flush() {
    return c(this, se, "f").length ? this.decode(`
`) : [];
  }
};
se = /* @__PURE__ */ new WeakMap(), ne = /* @__PURE__ */ new WeakMap();
Ne.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
Ne.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function wl(s, e) {
  for (let n = e ?? 0; n < s.length; n++) {
    if (s[n] === 10)
      return { preceding: n, index: n + 1, carriage: !1 };
    if (s[n] === 13)
      return { preceding: n, index: n + 1, carriage: !0 };
  }
  return null;
}
i(wl, "findNewlineIndex");
function Xi(s) {
  for (let r = 0; r < s.length - 1; r++) {
    if (s[r] === 10 && s[r + 1] === 10 || s[r] === 13 && s[r + 1] === 13)
      return r + 2;
    if (s[r] === 13 && s[r + 1] === 10 && r + 3 < s.length && s[r + 2] === 13 && s[r + 3] === 10)
      return r + 4;
  }
  return -1;
}
i(Xi, "findDoubleNewlineIndex");

// node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
var nn = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
}, uo = /* @__PURE__ */ i((s, e, t) => {
  if (s) {
    if (Mi(nn, s))
      return s;
    Q(t).warn(`${e} was set to ${JSON.stringify(s)}, expected one of ${JSON.stringify(Object.keys(nn))}`);
  }
}, "parseLogLevel");
function ls() {
}
i(ls, "noop");
function sn(s, e, t) {
  return !e || nn[s] > nn[t] ? ls : e[s].bind(e);
}
i(sn, "makeLogFn");
var bl = {
  error: ls,
  warn: ls,
  info: ls,
  debug: ls
}, Vi = /* @__PURE__ */ new WeakMap();
function Q(s) {
  let e = s.logger, t = s.logLevel ?? "off";
  if (!e)
    return bl;
  let r = Vi.get(e);
  if (r && r[0] === t)
    return r[1];
  let n = {
    error: sn("error", e, t),
    warn: sn("warn", e, t),
    info: sn("info", e, t),
    debug: sn("debug", e, t)
  };
  return Vi.set(e, [t, n]), n;
}
i(Q, "loggerFor");
var Be = /* @__PURE__ */ i((s) => (s.options && (s.options = { ...s.options }, delete s.options.headers), s.headers && (s.headers = Object.fromEntries((s.headers instanceof Headers ? [...s.headers] : Object.entries(s.headers)).map(([e, t]) => [
  e,
  e.toLowerCase() === "x-api-key" || e.toLowerCase() === "authorization" || e.toLowerCase() === "cookie" || e.toLowerCase() === "set-cookie" ? "***" : t
]))), "retryOfRequestLogID" in s && (s.retryOfRequestLogID && (s.retryOf = s.retryOfRequestLogID), delete s.retryOfRequestLogID), s), "formatRequestDetails");

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
var cs, xe = class s {
  static {
    i(this, "Stream");
  }
  constructor(e, t, r) {
    this.iterator = e, cs.set(this, void 0), this.controller = t, _(this, cs, r, "f");
  }
  static fromSSEResponse(e, t, r) {
    let n = !1, o = r ? Q(r) : console;
    async function* a() {
      if (n)
        throw new x("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let l = !1;
      try {
        for await (let u of xl(e, t)) {
          if (u.event === "completion")
            try {
              yield JSON.parse(u.data);
            } catch (f) {
              throw o.error("Could not parse message into JSON:", u.data), o.error("From chunk:", u.raw), f;
            }
          if (u.event === "message_start" || u.event === "message_delta" || u.event === "message_stop" || u.event === "content_block_start" || u.event === "content_block_delta" || u.event === "content_block_stop")
            try {
              yield JSON.parse(u.data);
            } catch (f) {
              throw o.error("Could not parse message into JSON:", u.data), o.error("From chunk:", u.raw), f;
            }
          if (u.event !== "ping" && u.event === "error")
            throw new G(void 0, tn(u.data) ?? u.data, void 0, e.headers);
        }
        l = !0;
      } catch (u) {
        if (Fe(u))
          return;
        throw u;
      } finally {
        l || t.abort();
      }
    }
    return i(a, "iterator"), new s(a, t, r);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(e, t, r) {
    let n = !1;
    async function* o() {
      let l = new Ne(), u = is(e);
      for await (let f of u)
        for (let y of l.decode(f))
          yield y;
      for (let f of l.flush())
        yield f;
    }
    i(o, "iterLines");
    async function* a() {
      if (n)
        throw new x("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let l = !1;
      try {
        for await (let u of o())
          l || u && (yield JSON.parse(u));
        l = !0;
      } catch (u) {
        if (Fe(u))
          return;
        throw u;
      } finally {
        l || t.abort();
      }
    }
    return i(a, "iterator"), new s(a, t, r);
  }
  [(cs = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    let e = [], t = [], r = this.iterator(), n = /* @__PURE__ */ i((o) => ({
      next: /* @__PURE__ */ i(() => {
        if (o.length === 0) {
          let a = r.next();
          e.push(a), t.push(a);
        }
        return o.shift();
      }, "next")
    }), "teeIterator");
    return [
      new s(() => n(e), this.controller, c(this, cs, "f")),
      new s(() => n(t), this.controller, c(this, cs, "f"))
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    let e = this, t;
    return lo({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          let { value: n, done: o } = await t.next();
          if (o)
            return r.close();
          let a = as(JSON.stringify(n) + `
`);
          r.enqueue(a);
        } catch (n) {
          r.error(n);
        }
      },
      async cancel() {
        await t.return?.();
      }
    });
  }
};
async function* xl(s, e) {
  if (!s.body)
    throw e.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new x("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new x("Attempted to iterate over a response with no body");
  let t = new fo(), r = new Ne(), n = is(s.body);
  for await (let o of Al(n))
    for (let a of r.decode(o)) {
      let l = t.decode(a);
      l && (yield l);
    }
  for (let o of r.flush()) {
    let a = t.decode(o);
    a && (yield a);
  }
}
i(xl, "_iterSSEMessages");
async function* Al(s) {
  let e = new Uint8Array();
  for await (let t of s) {
    if (t == null)
      continue;
    let r = t instanceof ArrayBuffer ? new Uint8Array(t) : typeof t == "string" ? as(t) : t, n = new Uint8Array(e.length + r.length);
    n.set(e), n.set(r, e.length), e = n;
    let o;
    for (; (o = Xi(e)) !== -1; )
      yield e.slice(0, o), e = e.slice(o);
  }
  e.length > 0 && (yield e);
}
i(Al, "iterSSEChunks");
var fo = class {
  static {
    i(this, "SSEDecoder");
  }
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length)
        return null;
      let o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":"))
      return null;
    let [t, r, n] = Pl(e, ":");
    return n.startsWith(" ") && (n = n.substring(1)), t === "event" ? this.event = n : t === "data" && this.data.push(n), null;
  }
};
function Pl(s, e) {
  let t = s.indexOf(e);
  return t !== -1 ? [s.substring(0, t), e, s.substring(t + e.length)] : [s, "", ""];
}
i(Pl, "partition");

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function on(s, e) {
  let { response: t, requestLogID: r, retryOfRequestLogID: n, startTime: o } = e, a = await (async () => {
    if (e.options.stream)
      return Q(s).debug("response", t.status, t.url, t.headers, t.body), e.options.__streamClass ? e.options.__streamClass.fromSSEResponse(t, e.controller) : xe.fromSSEResponse(t, e.controller);
    if (t.status === 204)
      return null;
    if (e.options.__binaryResponse)
      return t;
    let u = t.headers.get("content-type")?.split(";")[0]?.trim();
    if (u?.includes("application/json") || u?.endsWith("+json")) {
      let h = await t.json();
      return ho(h, t);
    }
    return await t.text();
  })();
  return Q(s).debug(`[${r}] response parsed`, Be({
    retryOfRequestLogID: n,
    url: t.url,
    status: t.status,
    body: a,
    durationMs: Date.now() - o
  })), a;
}
i(on, "defaultParseResponse");
function ho(s, e) {
  return !s || typeof s != "object" || Array.isArray(s) ? s : Object.defineProperty(s, "_request_id", {
    value: e.headers.get("request-id"),
    enumerable: !1
  });
}
i(ho, "addRequestID");

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var us, Pt = class s extends Promise {
  static {
    i(this, "APIPromise");
  }
  constructor(e, t, r = on) {
    super((n) => {
      n(null);
    }), this.responsePromise = t, this.parseResponse = r, us.set(this, void 0), _(this, us, e, "f");
  }
  _thenUnwrap(e) {
    return new s(c(this, us, "f"), this.responsePromise, async (t, r) => ho(e(await this.parseResponse(t, r), r), r.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  asResponse() {
    return this.responsePromise.then((e) => e.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  async withResponse() {
    let [e, t] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: e, response: t, request_id: t.headers.get("request-id") };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then((e) => this.parseResponse(c(this, us, "f"), e))), this.parsedPromise;
  }
  then(e, t) {
    return this.parse().then(e, t);
  }
  catch(e) {
    return this.parse().catch(e);
  }
  finally(e) {
    return this.parse().finally(e);
  }
};
us = /* @__PURE__ */ new WeakMap();

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var an, ln = class {
  static {
    i(this, "AbstractPage");
  }
  constructor(e, t, r, n) {
    an.set(this, void 0), _(this, an, e, "f"), this.options = n, this.response = t, this.body = r;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
  }
  async getNextPage() {
    let e = this.nextPageRequestOptions();
    if (!e)
      throw new x("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    return await c(this, an, "f").requestAPIList(this.constructor, e);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(an = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (let e of this.iterPages())
      for (let t of e.getPaginatedItems())
        yield t;
  }
}, fs = class extends Pt {
  static {
    i(this, "PagePromise");
  }
  constructor(e, t, r) {
    super(e, t, async (n, o) => new r(n, o.response, await on(n, o), o.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    let e = await this;
    for await (let t of e)
      yield t;
  }
}, fe = class extends ln {
  static {
    i(this, "Page");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.has_more = r.has_more || !1, this.first_id = r.first_id || null, this.last_id = r.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    if (this.options.query?.before_id) {
      let t = this.first_id;
      return t ? {
        ...this.options,
        query: {
          ...en(this.options.query),
          before_id: t
        }
      } : null;
    }
    let e = this.last_id;
    return e ? {
      ...this.options,
      query: {
        ...en(this.options.query),
        after_id: e
      }
    } : null;
  }
};
var fr = class extends ln {
  static {
    i(this, "PageCursor");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.has_more = r.has_more || !1, this.next_page = r.next_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  nextPageRequestOptions() {
    let e = this.next_page;
    return e ? {
      ...this.options,
      query: {
        ...en(this.options.query),
        page: e
      }
    } : null;
  }
};

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
var mo = /* @__PURE__ */ i(() => {
  if (typeof File > "u") {
    let { process: s } = globalThis, e = typeof s?.versions?.node == "string" && parseInt(s.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (e ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
}, "checkFileSupport");
function St(s, e, t) {
  return mo(), new File(s, e ?? "unknown_file", t);
}
i(St, "makeFile");
function hs(s) {
  return (typeof s == "object" && s !== null && ("name" in s && s.name && String(s.name) || "url" in s && s.url && String(s.url) || "filename" in s && s.filename && String(s.filename) || "path" in s && s.path && String(s.path)) || "").split(/[\\/]/).pop() || void 0;
}
i(hs, "getName");
var go = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s[Symbol.asyncIterator] == "function", "isAsyncIterable");
var hr = /* @__PURE__ */ i(async (s, e) => ({ ...s, body: await Il(s.body, e) }), "multipartFormRequestOptions"), Ki = /* @__PURE__ */ new WeakMap();
function Rl(s) {
  let e = typeof s == "function" ? s : s.fetch, t = Ki.get(e);
  if (t)
    return t;
  let r = (async () => {
    try {
      let n = "Response" in e ? e.Response : (await e("data:,")).constructor, o = new FormData();
      return o.toString() !== await new n(o).text();
    } catch {
      return !0;
    }
  })();
  return Ki.set(e, r), r;
}
i(Rl, "supportsFormData");
var Il = /* @__PURE__ */ i(async (s, e) => {
  if (!await Rl(e))
    throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  let t = new FormData();
  return await Promise.all(Object.entries(s || {}).map(([r, n]) => po(t, r, n))), t;
}, "createForm"), El = /* @__PURE__ */ i((s) => s instanceof Blob && "name" in s, "isNamedBlob");
var po = /* @__PURE__ */ i(async (s, e, t) => {
  if (t !== void 0) {
    if (t == null)
      throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
      s.append(e, String(t));
    else if (t instanceof Response) {
      let r = {}, n = t.headers.get("Content-Type");
      n && (r = { type: n }), s.append(e, St([await t.blob()], hs(t), r));
    } else if (go(t))
      s.append(e, St([await new Response(rn(t)).blob()], hs(t)));
    else if (El(t))
      s.append(e, St([t], hs(t), { type: t.type }));
    else if (Array.isArray(t))
      await Promise.all(t.map((r) => po(s, e + "[]", r)));
    else if (typeof t == "object")
      await Promise.all(Object.entries(t).map(([r, n]) => po(s, `${e}[${r}]`, n)));
    else
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`);
  }
}, "addFormValue");

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
var Gi = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.size == "number" && typeof s.type == "string" && typeof s.text == "function" && typeof s.slice == "function" && typeof s.arrayBuffer == "function", "isBlobLike"), Cl = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.name == "string" && typeof s.lastModified == "number" && Gi(s), "isFileLike"), kl = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.url == "string" && typeof s.blob == "function", "isResponseLike");
async function cn(s, e, t) {
  if (mo(), s = await s, e || (e = hs(s)), Cl(s))
    return s instanceof File && e == null && t == null ? s : St([await s.arrayBuffer()], e ?? s.name, {
      type: s.type,
      lastModified: s.lastModified,
      ...t
    });
  if (kl(s)) {
    let n = await s.blob();
    return e || (e = new URL(s.url).pathname.split(/[\\/]/).pop()), St(await _o(n), e, t);
  }
  let r = await _o(s);
  if (!t?.type) {
    let n = r.find((o) => typeof o == "object" && "type" in o && o.type);
    typeof n == "string" && (t = { ...t, type: n });
  }
  return St(r, e, t);
}
i(cn, "toFile");
async function _o(s) {
  let e = [];
  if (typeof s == "string" || ArrayBuffer.isView(s) || // includes Uint8Array, Buffer, etc.
  s instanceof ArrayBuffer)
    e.push(s);
  else if (Gi(s))
    e.push(s instanceof Blob ? s : await s.arrayBuffer());
  else if (go(s))
    for await (let t of s)
      e.push(...await _o(t));
  else {
    let t = s?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof s}${t ? `; constructor: ${t}` : ""}${Ol(s)}`);
  }
  return e;
}
i(_o, "getBytes");
function Ol(s) {
  return typeof s != "object" || s === null ? "" : `; props: [${Object.getOwnPropertyNames(s).map((t) => `"${t}"`).join(", ")}]`;
}
i(Ol, "propsForError");

// node_modules/@anthropic-ai/sdk/core/resource.mjs
var F = class {
  static {
    i(this, "APIResource");
  }
  constructor(e) {
    this._client = e;
  }
};

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
var Qi = Symbol.for("brand.privateNullableHeaders");
function* Ml(s) {
  if (!s)
    return;
  if (Qi in s) {
    let { values: r, nulls: n } = s;
    yield* r.entries();
    for (let o of n)
      yield [o, null];
    return;
  }
  let e = !1, t;
  s instanceof Headers ? t = s.entries() : ao(s) ? t = s : (e = !0, t = Object.entries(s ?? {}));
  for (let r of t) {
    let n = r[0];
    if (typeof n != "string")
      throw new TypeError("expected header name to be a string");
    let o = ao(r[1]) ? r[1] : [r[1]], a = !1;
    for (let l of o)
      l !== void 0 && (e && !a && (a = !0, yield [n, null]), yield [n, l]);
  }
}
i(Ml, "iterateHeaders");
var I = /* @__PURE__ */ i((s) => {
  let e = new Headers(), t = /* @__PURE__ */ new Set();
  for (let r of s) {
    let n = /* @__PURE__ */ new Set();
    for (let [o, a] of Ml(r)) {
      let l = o.toLowerCase();
      n.has(l) || (e.delete(o), n.add(l)), a === null ? (e.delete(o), t.add(l)) : (e.append(o, a), t.delete(l));
    }
  }
  return { [Qi]: !0, values: e, nulls: t };
}, "buildHeaders");

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
function Yi(s) {
  return s.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
i(Yi, "encodeURIPath");
var zi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), $l = /* @__PURE__ */ i((s = Yi) => /* @__PURE__ */ i(function(t, ...r) {
  if (t.length === 1)
    return t[0];
  let n = !1, o = [], a = t.reduce((y, h, m) => {
    /[?#]/.test(h) && (n = !0);
    let d = r[m], A = (n ? encodeURIComponent : s)("" + d);
    return m !== r.length && (d == null || typeof d == "object" && // handle values from other realms
    d.toString === Object.getPrototypeOf(Object.getPrototypeOf(d.hasOwnProperty ?? zi) ?? zi)?.toString) && (A = d + "", o.push({
      start: y.length + h.length,
      length: A.length,
      error: `Value of type ${Object.prototype.toString.call(d).slice(8, -1)} is not a valid path parameter`
    })), y + h + (m === r.length ? "" : A);
  }, ""), l = a.split(/[?#]/, 1)[0], u = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi, f;
  for (; (f = u.exec(l)) !== null; )
    o.push({
      start: f.index,
      length: f[0].length,
      error: `Value "${f[0]}" can't be safely passed as a path parameter`
    });
  if (o.sort((y, h) => y.start - h.start), o.length > 0) {
    let y = 0, h = o.reduce((m, d) => {
      let A = " ".repeat(d.start - y), w = "^".repeat(d.length);
      return y = d.start + d.length, m + A + w;
    }, "");
    throw new x(`Path parameters result in path with invalid segments:
${o.map((m) => m.error).join(`
`)}
${a}
${h}`);
  }
  return a;
}, "path"), "createPathTagFunction"), N = /* @__PURE__ */ $l(Yi);

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var dr = class extends F {
  static {
    i(this, "Files");
  }
  /**
   * List Files
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const fileMetadata of client.beta.files.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/files", fe, {
      query: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete File
   *
   * @example
   * ```ts
   * const deletedFile = await client.beta.files.delete(
   *   'file_id',
   * );
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(N`/v1/files/${e}`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Download File
   *
   * @example
   * ```ts
   * const response = await client.beta.files.download(
   *   'file_id',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/files/${e}/content`, {
      ...r,
      headers: I([
        {
          "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString(),
          Accept: "application/binary"
        },
        r?.headers
      ]),
      __binaryResponse: !0
    });
  }
  /**
   * Get File Metadata
   *
   * @example
   * ```ts
   * const fileMetadata =
   *   await client.beta.files.retrieveMetadata('file_id');
   * ```
   */
  retrieveMetadata(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/files/${e}`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "files-api-2025-04-14"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Upload File
   *
   * @example
   * ```ts
   * const fileMetadata = await client.beta.files.upload({
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  upload(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/files", hr({
      body: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "files-api-2025-04-14"].toString() },
        t?.headers
      ])
    }, this._client));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var pr = class extends F {
  static {
    i(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   *
   * @example
   * ```ts
   * const betaModelInfo = await client.beta.models.retrieve(
   *   'model_id',
   * );
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/models/${e}?beta=true`, {
      ...r,
      headers: I([
        { ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 },
        r?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaModelInfo of client.beta.models.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/models?beta=true", fe, {
      query: n,
      ...t,
      headers: I([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
var un = {
  "claude-opus-4-20250514": 8192,
  "claude-opus-4-0": 8192,
  "claude-4-opus-20250514": 8192,
  "anthropic.claude-opus-4-20250514-v1:0": 8192,
  "claude-opus-4@20250514": 8192,
  "claude-opus-4-1-20250805": 8192,
  "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
  "claude-opus-4-1@20250805": 8192
};

// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
function yo(s, e, t) {
  return !e || !("parse" in (e.output_format ?? {})) ? {
    ...s,
    content: s.content.map((r) => {
      if (r.type === "text") {
        let n = Object.defineProperty({ ...r }, "parsed_output", {
          value: null,
          enumerable: !1
        });
        return Object.defineProperty(n, "parsed", {
          get() {
            return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null;
          },
          enumerable: !1
        });
      }
      return r;
    }),
    parsed_output: null
  } : wo(s, e, t);
}
i(yo, "maybeParseBetaMessage");
function wo(s, e, t) {
  let r = null, n = s.content.map((o) => {
    if (o.type === "text") {
      let a = Nl(e, o.text);
      r === null && (r = a);
      let l = Object.defineProperty({ ...o }, "parsed_output", {
        value: a,
        enumerable: !1
      });
      return Object.defineProperty(l, "parsed", {
        get() {
          return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), a;
        },
        enumerable: !1
      });
    }
    return o;
  });
  return {
    ...s,
    content: n,
    parsed_output: r
  };
}
i(wo, "parseBetaMessage");
function Nl(s, e) {
  if (s.output_format?.type !== "json_schema")
    return null;
  try {
    return "parse" in s.output_format ? s.output_format.parse(e) : JSON.parse(e);
  } catch (t) {
    throw new x(`Failed to parse structured output: ${t}`);
  }
}
i(Nl, "parseBetaOutputFormat");

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var Bl = /* @__PURE__ */ i((s) => {
  let e = 0, t = [];
  for (; e < s.length; ) {
    let r = s[e];
    if (r === "\\") {
      e++;
      continue;
    }
    if (r === "{") {
      t.push({
        type: "brace",
        value: "{"
      }), e++;
      continue;
    }
    if (r === "}") {
      t.push({
        type: "brace",
        value: "}"
      }), e++;
      continue;
    }
    if (r === "[") {
      t.push({
        type: "paren",
        value: "["
      }), e++;
      continue;
    }
    if (r === "]") {
      t.push({
        type: "paren",
        value: "]"
      }), e++;
      continue;
    }
    if (r === ":") {
      t.push({
        type: "separator",
        value: ":"
      }), e++;
      continue;
    }
    if (r === ",") {
      t.push({
        type: "delimiter",
        value: ","
      }), e++;
      continue;
    }
    if (r === '"') {
      let l = "", u = !1;
      for (r = s[++e]; r !== '"'; ) {
        if (e === s.length) {
          u = !0;
          break;
        }
        if (r === "\\") {
          if (e++, e === s.length) {
            u = !0;
            break;
          }
          l += r + s[e], r = s[++e];
        } else
          l += r, r = s[++e];
      }
      r = s[++e], u || t.push({
        type: "string",
        value: l
      });
      continue;
    }
    if (r && /\s/.test(r)) {
      e++;
      continue;
    }
    let o = /[0-9]/;
    if (r && o.test(r) || r === "-" || r === ".") {
      let l = "";
      for (r === "-" && (l += r, r = s[++e]); r && o.test(r) || r === "."; )
        l += r, r = s[++e];
      t.push({
        type: "number",
        value: l
      });
      continue;
    }
    let a = /[a-z]/i;
    if (r && a.test(r)) {
      let l = "";
      for (; r && a.test(r) && e !== s.length; )
        l += r, r = s[++e];
      if (l == "true" || l == "false" || l === "null")
        t.push({
          type: "name",
          value: l
        });
      else {
        e++;
        continue;
      }
      continue;
    }
    e++;
  }
  return t;
}, "tokenize"), mr = /* @__PURE__ */ i((s) => {
  if (s.length === 0)
    return s;
  let e = s[s.length - 1];
  switch (e.type) {
    case "separator":
      return s = s.slice(0, s.length - 1), mr(s);
      break;
    case "number":
      let t = e.value[e.value.length - 1];
      if (t === "." || t === "-")
        return s = s.slice(0, s.length - 1), mr(s);
    case "string":
      let r = s[s.length - 2];
      if (r?.type === "delimiter")
        return s = s.slice(0, s.length - 1), mr(s);
      if (r?.type === "brace" && r.value === "{")
        return s = s.slice(0, s.length - 1), mr(s);
      break;
    case "delimiter":
      return s = s.slice(0, s.length - 1), mr(s);
      break;
  }
  return s;
}, "strip"), Ll = /* @__PURE__ */ i((s) => {
  let e = [];
  return s.map((t) => {
    t.type === "brace" && (t.value === "{" ? e.push("}") : e.splice(e.lastIndexOf("}"), 1)), t.type === "paren" && (t.value === "[" ? e.push("]") : e.splice(e.lastIndexOf("]"), 1));
  }), e.length > 0 && e.reverse().map((t) => {
    t === "}" ? s.push({
      type: "brace",
      value: "}"
    }) : t === "]" && s.push({
      type: "paren",
      value: "]"
    });
  }), s;
}, "unstrip"), jl = /* @__PURE__ */ i((s) => {
  let e = "";
  return s.map((t) => {
    switch (t.type) {
      case "string":
        e += '"' + t.value + '"';
        break;
      default:
        e += t.value;
        break;
    }
  }), e;
}, "generate"), fn = /* @__PURE__ */ i((s) => JSON.parse(jl(Ll(mr(Bl(s))))), "partialParse");

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var he, ze, gr, ds, hn, ps, ms, dn, gs, Le, _s, pn, mn, Rt, gn, _n, ys, bo, Zi, yn, xo, Ao, Po, ea, ta = "__json_buf";
function ra(s) {
  return s.type === "tool_use" || s.type === "server_tool_use" || s.type === "mcp_tool_use";
}
i(ra, "tracksToolInput");
var wn = class s {
  static {
    i(this, "BetaMessageStream");
  }
  constructor(e, t) {
    he.add(this), this.messages = [], this.receivedMessages = [], ze.set(this, void 0), gr.set(this, null), this.controller = new AbortController(), ds.set(this, void 0), hn.set(this, () => {
    }), ps.set(this, () => {
    }), ms.set(this, void 0), dn.set(this, () => {
    }), gs.set(this, () => {
    }), Le.set(this, {}), _s.set(this, !1), pn.set(this, !1), mn.set(this, !1), Rt.set(this, !1), gn.set(this, void 0), _n.set(this, void 0), ys.set(this, void 0), yn.set(this, (r) => {
      if (_(this, pn, !0, "f"), Fe(r) && (r = new Y()), r instanceof Y)
        return _(this, mn, !0, "f"), this._emit("abort", r);
      if (r instanceof x)
        return this._emit("error", r);
      if (r instanceof Error) {
        let n = new x(r.message);
        return n.cause = r, this._emit("error", n);
      }
      return this._emit("error", new x(String(r)));
    }), _(this, ds, new Promise((r, n) => {
      _(this, hn, r, "f"), _(this, ps, n, "f");
    }), "f"), _(this, ms, new Promise((r, n) => {
      _(this, dn, r, "f"), _(this, gs, n, "f");
    }), "f"), c(this, ds, "f").catch(() => {
    }), c(this, ms, "f").catch(() => {
    }), _(this, gr, e, "f"), _(this, ys, t?.logger ?? console, "f");
  }
  get response() {
    return c(this, gn, "f");
  }
  get request_id() {
    return c(this, _n, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    _(this, Rt, !0, "f");
    let e = await c(this, ds, "f");
    if (!e)
      throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: e,
      request_id: e.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    let t = new s(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createMessage(e, t, r, { logger: n } = {}) {
    let o = new s(t, { logger: n });
    for (let a of t.messages)
      o._addMessageParam(a);
    return _(o, gr, { ...t, stream: !0 }, "f"), o._run(() => o._createMessage(e, { ...t, stream: !0 }, { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" } })), o;
  }
  _run(e) {
    e().then(() => {
      this._emitFinal(), this._emit("end");
    }, c(this, yn, "f"));
  }
  _addMessageParam(e) {
    this.messages.push(e);
  }
  _addMessage(e, t = !0) {
    this.receivedMessages.push(e), t && this._emit("message", e);
  }
  async _createMessage(e, t, r) {
    let n = r?.signal, o;
    n && (n.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), n.addEventListener("abort", o));
    try {
      c(this, he, "m", xo).call(this);
      let { response: a, data: l } = await e.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal }).withResponse();
      this._connected(a);
      for await (let u of l)
        c(this, he, "m", Ao).call(this, u);
      if (l.controller.signal?.aborted)
        throw new Y();
      c(this, he, "m", Po).call(this);
    } finally {
      n && o && n.removeEventListener("abort", o);
    }
  }
  _connected(e) {
    this.ended || (_(this, gn, e, "f"), _(this, _n, e?.headers.get("request-id"), "f"), c(this, hn, "f").call(this, e), this._emit("connect"));
  }
  get ended() {
    return c(this, _s, "f");
  }
  get errored() {
    return c(this, pn, "f");
  }
  get aborted() {
    return c(this, mn, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(e, t) {
    return (c(this, Le, "f")[e] || (c(this, Le, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(e, t) {
    let r = c(this, Le, "f")[e];
    if (!r)
      return this;
    let n = r.findIndex((o) => o.listener === t);
    return n >= 0 && r.splice(n, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(e, t) {
    return (c(this, Le, "f")[e] || (c(this, Le, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, r) => {
      _(this, Rt, !0, "f"), e !== "error" && this.once("error", r), this.once(e, t);
    });
  }
  async done() {
    _(this, Rt, !0, "f"), await c(this, ms, "f");
  }
  get currentMessage() {
    return c(this, ze, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   * If structured outputs were used, this will be a ParsedMessage with a `parsed` field.
   */
  async finalMessage() {
    return await this.done(), c(this, he, "m", bo).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    return await this.done(), c(this, he, "m", Zi).call(this);
  }
  _emit(e, ...t) {
    if (c(this, _s, "f"))
      return;
    e === "end" && (_(this, _s, !0, "f"), c(this, dn, "f").call(this));
    let r = c(this, Le, "f")[e];
    if (r && (c(this, Le, "f")[e] = r.filter((n) => !n.once), r.forEach(({ listener: n }) => n(...t))), e === "abort") {
      let n = t[0];
      !c(this, Rt, "f") && !r?.length && Promise.reject(n), c(this, ps, "f").call(this, n), c(this, gs, "f").call(this, n), this._emit("end");
      return;
    }
    if (e === "error") {
      let n = t[0];
      !c(this, Rt, "f") && !r?.length && Promise.reject(n), c(this, ps, "f").call(this, n), c(this, gs, "f").call(this, n), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", c(this, he, "m", bo).call(this));
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal, n;
    r && (r.aborted && this.controller.abort(), n = this.controller.abort.bind(this.controller), r.addEventListener("abort", n));
    try {
      c(this, he, "m", xo).call(this), this._connected(null);
      let o = xe.fromReadableStream(e, this.controller);
      for await (let a of o)
        c(this, he, "m", Ao).call(this, a);
      if (o.controller.signal?.aborted)
        throw new Y();
      c(this, he, "m", Po).call(this);
    } finally {
      r && n && r.removeEventListener("abort", n);
    }
  }
  [(ze = /* @__PURE__ */ new WeakMap(), gr = /* @__PURE__ */ new WeakMap(), ds = /* @__PURE__ */ new WeakMap(), hn = /* @__PURE__ */ new WeakMap(), ps = /* @__PURE__ */ new WeakMap(), ms = /* @__PURE__ */ new WeakMap(), dn = /* @__PURE__ */ new WeakMap(), gs = /* @__PURE__ */ new WeakMap(), Le = /* @__PURE__ */ new WeakMap(), _s = /* @__PURE__ */ new WeakMap(), pn = /* @__PURE__ */ new WeakMap(), mn = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap(), gn = /* @__PURE__ */ new WeakMap(), _n = /* @__PURE__ */ new WeakMap(), ys = /* @__PURE__ */ new WeakMap(), yn = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakSet(), bo = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new x("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, "_BetaMessageStream_getFinalMessage"), Zi = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new x("stream ended without producing a Message with role=assistant");
    let t = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (t.length === 0)
      throw new x("stream ended without producing a content block with type=text");
    return t.join(" ");
  }, "_BetaMessageStream_getFinalText"), xo = /* @__PURE__ */ i(function() {
    this.ended || _(this, ze, void 0, "f");
  }, "_BetaMessageStream_beginRequest"), Ao = /* @__PURE__ */ i(function(t) {
    if (this.ended)
      return;
    let r = c(this, he, "m", ea).call(this, t);
    switch (this._emit("streamEvent", t, r), t.type) {
      case "content_block_delta": {
        let n = r.content.at(-1);
        switch (t.delta.type) {
          case "text_delta": {
            n.type === "text" && this._emit("text", t.delta.text, n.text || "");
            break;
          }
          case "citations_delta": {
            n.type === "text" && this._emit("citation", t.delta.citation, n.citations ?? []);
            break;
          }
          case "input_json_delta": {
            ra(n) && n.input && this._emit("inputJson", t.delta.partial_json, n.input);
            break;
          }
          case "thinking_delta": {
            n.type === "thinking" && this._emit("thinking", t.delta.thinking, n.thinking);
            break;
          }
          case "signature_delta": {
            n.type === "thinking" && this._emit("signature", n.signature);
            break;
          }
          default:
            t.delta;
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(r), this._addMessage(yo(r, c(this, gr, "f"), { logger: c(this, ys, "f") }), !0);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", r.content.at(-1));
        break;
      }
      case "message_start": {
        _(this, ze, r, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_BetaMessageStream_addStreamEvent"), Po = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new x("stream has ended, this shouldn't happen");
    let t = c(this, ze, "f");
    if (!t)
      throw new x("request ended without sending any chunks");
    return _(this, ze, void 0, "f"), yo(t, c(this, gr, "f"), { logger: c(this, ys, "f") });
  }, "_BetaMessageStream_endRequest"), ea = /* @__PURE__ */ i(function(t) {
    let r = c(this, ze, "f");
    if (t.type === "message_start") {
      if (r)
        throw new x(`Unexpected event order, got ${t.type} before receiving "message_stop"`);
      return t.message;
    }
    if (!r)
      throw new x(`Unexpected event order, got ${t.type} before "message_start"`);
    switch (t.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.container = t.delta.container, r.stop_reason = t.delta.stop_reason, r.stop_sequence = t.delta.stop_sequence, r.usage.output_tokens = t.usage.output_tokens, r.context_management = t.context_management, t.usage.input_tokens != null && (r.usage.input_tokens = t.usage.input_tokens), t.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = t.usage.cache_creation_input_tokens), t.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = t.usage.cache_read_input_tokens), t.usage.server_tool_use != null && (r.usage.server_tool_use = t.usage.server_tool_use), r;
      case "content_block_start":
        return r.content.push(t.content_block), r;
      case "content_block_delta": {
        let n = r.content.at(t.index);
        switch (t.delta.type) {
          case "text_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              text: (n.text || "") + t.delta.text
            });
            break;
          }
          case "citations_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              citations: [...n.citations ?? [], t.delta.citation]
            });
            break;
          }
          case "input_json_delta": {
            if (n && ra(n)) {
              let o = n[ta] || "";
              o += t.delta.partial_json;
              let a = { ...n };
              if (Object.defineProperty(a, ta, {
                value: o,
                enumerable: !1,
                writable: !0
              }), o)
                try {
                  a.input = fn(o);
                } catch (l) {
                  let u = new x(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${l}. JSON: ${o}`);
                  c(this, yn, "f").call(this, u);
                }
              r.content[t.index] = a;
            }
            break;
          }
          case "thinking_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              thinking: n.thinking + t.delta.thinking
            });
            break;
          }
          case "signature_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              signature: t.delta.signature
            });
            break;
          }
          default:
            t.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, "_BetaMessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("streamEvent", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, a) => t.push({ resolve: o, reject: a })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  toReadableStream() {
    return new xe(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs
var sa = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete\u2014err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
var ws, _r, It, W, bs, oe, je, Ye, xs, na, So;
function oa() {
  let s, e;
  return { promise: new Promise((r, n) => {
    s = r, e = n;
  }), resolve: s, reject: e };
}
i(oa, "promiseWithResolvers");
var yr = class {
  static {
    i(this, "BetaToolRunner");
  }
  constructor(e, t, r) {
    ws.add(this), this.client = e, _r.set(this, !1), It.set(this, !1), W.set(this, void 0), bs.set(this, void 0), oe.set(this, void 0), je.set(this, void 0), Ye.set(this, void 0), xs.set(this, 0), _(this, W, {
      params: {
        // You can't clone the entire params since there are functions as handlers.
        // You also don't really need to clone params.messages, but it probably will prevent a foot gun
        // somewhere.
        ...t,
        messages: structuredClone(t.messages)
      }
    }, "f"), _(this, bs, {
      ...r,
      headers: I([{ "x-stainless-helper": "BetaToolRunner" }, r?.headers])
    }, "f"), _(this, Ye, oa(), "f");
  }
  async *[(_r = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), bs = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), xs = /* @__PURE__ */ new WeakMap(), ws = /* @__PURE__ */ new WeakSet(), na = /* @__PURE__ */ i(async function() {
    let t = c(this, W, "f").params.compactionControl;
    if (!t || !t.enabled)
      return !1;
    let r = 0;
    if (c(this, oe, "f") !== void 0)
      try {
        let f = await c(this, oe, "f");
        r = f.usage.input_tokens + (f.usage.cache_creation_input_tokens ?? 0) + (f.usage.cache_read_input_tokens ?? 0) + f.usage.output_tokens;
      } catch {
        return !1;
      }
    let n = t.contextTokenThreshold ?? 1e5;
    if (r < n)
      return !1;
    let o = t.model ?? c(this, W, "f").params.model, a = t.summaryPrompt ?? sa, l = c(this, W, "f").params.messages;
    if (l[l.length - 1].role === "assistant") {
      let f = l[l.length - 1];
      if (Array.isArray(f.content)) {
        let y = f.content.filter((h) => h.type !== "tool_use");
        y.length === 0 ? l.pop() : f.content = y;
      }
    }
    let u = await this.client.beta.messages.create({
      model: o,
      messages: [
        ...l,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: a
            }
          ]
        }
      ],
      max_tokens: c(this, W, "f").params.max_tokens
    }, {
      headers: { "x-stainless-helper": "compaction" }
    });
    if (u.content[0]?.type !== "text")
      throw new x("Expected text response for compaction");
    return c(this, W, "f").params.messages = [
      {
        role: "user",
        content: u.content
      }
    ], !0;
  }, "_BetaToolRunner_checkAndCompact"), Symbol.asyncIterator)]() {
    var e;
    if (c(this, _r, "f"))
      throw new x("Cannot iterate over a consumed stream");
    _(this, _r, !0, "f"), _(this, It, !0, "f"), _(this, je, void 0, "f");
    try {
      for (; ; ) {
        let t;
        try {
          if (c(this, W, "f").params.max_iterations && c(this, xs, "f") >= c(this, W, "f").params.max_iterations)
            break;
          _(this, It, !1, "f"), _(this, je, void 0, "f"), _(this, xs, (e = c(this, xs, "f"), e++, e), "f"), _(this, oe, void 0, "f");
          let { max_iterations: r, compactionControl: n, ...o } = c(this, W, "f").params;
          if (o.stream ? (t = this.client.beta.messages.stream({ ...o }, c(this, bs, "f")), _(this, oe, t.finalMessage(), "f"), c(this, oe, "f").catch(() => {
          }), yield t) : (_(this, oe, this.client.beta.messages.create({ ...o, stream: !1 }, c(this, bs, "f")), "f"), yield c(this, oe, "f")), !await c(this, ws, "m", na).call(this)) {
            if (!c(this, It, "f")) {
              let { role: u, content: f } = await c(this, oe, "f");
              c(this, W, "f").params.messages.push({ role: u, content: f });
            }
            let l = await c(this, ws, "m", So).call(this, c(this, W, "f").params.messages.at(-1));
            if (l)
              c(this, W, "f").params.messages.push(l);
            else if (!c(this, It, "f"))
              break;
          }
        } finally {
          t && t.abort();
        }
      }
      if (!c(this, oe, "f"))
        throw new x("ToolRunner concluded without a message from the server");
      c(this, Ye, "f").resolve(await c(this, oe, "f"));
    } catch (t) {
      throw _(this, _r, !1, "f"), c(this, Ye, "f").promise.catch(() => {
      }), c(this, Ye, "f").reject(t), _(this, Ye, oa(), "f"), t;
    }
  }
  setMessagesParams(e) {
    typeof e == "function" ? c(this, W, "f").params = e(c(this, W, "f").params) : c(this, W, "f").params = e, _(this, It, !0, "f"), _(this, je, void 0, "f");
  }
  /**
   * Get the tool response for the last message from the assistant.
   * Avoids redundant tool executions by caching results.
   *
   * @returns A promise that resolves to a BetaMessageParam containing tool results, or null if no tools need to be executed
   *
   * @example
   * const toolResponse = await runner.generateToolResponse();
   * if (toolResponse) {
   *   console.log('Tool results:', toolResponse.content);
   * }
   */
  async generateToolResponse() {
    let e = await c(this, oe, "f") ?? this.params.messages.at(-1);
    return e ? c(this, ws, "m", So).call(this, e) : null;
  }
  /**
   * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
   * will wait for an instance to start and go to completion.
   *
   * @returns A promise that resolves to the final BetaMessage when the iterator completes
   *
   * @example
   * // Start consuming the iterator
   * for await (const message of runner) {
   *   console.log('Message:', message.content);
   * }
   *
   * // Meanwhile, wait for completion from another part of the code
   * const finalMessage = await runner.done();
   * console.log('Final response:', finalMessage.content);
   */
  done() {
    return c(this, Ye, "f").promise;
  }
  /**
   * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
   * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
   * assistant.
   * * If the iterator has been consumed, waits for it to complete and returns the final message.
   *
   * @returns A promise that resolves to the final BetaMessage from the conversation
   * @throws {AnthropicError} If no messages were processed during the conversation
   *
   * @example
   * const finalMessage = await runner.runUntilDone();
   * console.log('Final response:', finalMessage.content);
   */
  async runUntilDone() {
    if (!c(this, _r, "f"))
      for await (let e of this)
        ;
    return this.done();
  }
  /**
   * Get the current parameters being used by the ToolRunner.
   *
   * @returns A readonly view of the current ToolRunnerParams
   *
   * @example
   * const currentParams = runner.params;
   * console.log('Current model:', currentParams.model);
   * console.log('Message count:', currentParams.messages.length);
   */
  get params() {
    return c(this, W, "f").params;
  }
  /**
   * Add one or more messages to the conversation history.
   *
   * @param messages - One or more BetaMessageParam objects to add to the conversation
   *
   * @example
   * runner.pushMessages(
   *   { role: 'user', content: 'Also, what about the weather in NYC?' }
   * );
   *
   * @example
   * // Adding multiple messages
   * runner.pushMessages(
   *   { role: 'user', content: 'What about NYC?' },
   *   { role: 'user', content: 'And Boston?' }
   * );
   */
  pushMessages(...e) {
    this.setMessagesParams((t) => ({
      ...t,
      messages: [...t.messages, ...e]
    }));
  }
  /**
   * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
   * This allows using `await runner` instead of `await runner.runUntilDone()`
   */
  then(e, t) {
    return this.runUntilDone().then(e, t);
  }
};
So = /* @__PURE__ */ i(async function(e) {
  return c(this, je, "f") !== void 0 ? c(this, je, "f") : (_(this, je, Dl(c(this, W, "f").params, e), "f"), c(this, je, "f"));
}, "_BetaToolRunner_generateToolResponse");
async function Dl(s, e = s.messages.at(-1)) {
  if (!e || e.role !== "assistant" || !e.content || typeof e.content == "string")
    return null;
  let t = e.content.filter((n) => n.type === "tool_use");
  return t.length === 0 ? null : {
    role: "user",
    content: await Promise.all(t.map(async (n) => {
      let o = s.tools.find((a) => ("name" in a ? a.name : a.mcp_server_name) === n.name);
      if (!o || !("run" in o))
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: `Error: Tool '${n.name}' not found`,
          is_error: !0
        };
      try {
        let a = n.input;
        "parse" in o && o.parse && (a = o.parse(a));
        let l = await o.run(a);
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: l
        };
      } catch (a) {
        return {
          type: "tool_result",
          tool_use_id: n.id,
          content: `Error: ${a instanceof Error ? a.message : String(a)}`,
          is_error: !0
        };
      }
    }))
  };
}
i(Dl, "generateToolResponse");

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var wr = class s {
  static {
    i(this, "JSONLDecoder");
  }
  constructor(e, t) {
    this.iterator = e, this.controller = t;
  }
  async *decoder() {
    let e = new Ne();
    for await (let t of this.iterator)
      for (let r of e.decode(t))
        yield JSON.parse(r);
    for (let t of e.flush())
      yield JSON.parse(t);
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(e, t) {
    if (!e.body)
      throw t.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative" ? new x("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new x("Attempted to iterate over a response with no body");
    return new s(is(e.body), t);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var br = class extends F {
  static {
    i(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.create({
   *     requests: [
   *       {
   *         custom_id: 'my-custom-id-1',
   *         params: {
   *           max_tokens: 1024,
   *           messages: [
   *             { content: 'Hello, world', role: 'user' },
   *           ],
   *           model: 'claude-sonnet-4-5-20250929',
   *         },
   *       },
   *     ],
   *   });
   * ```
   */
  create(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/messages/batches?beta=true", {
      body: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.retrieve(
   *     'message_batch_id',
   *   );
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/messages/batches/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaMessageBatch of client.beta.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/messages/batches?beta=true", fe, {
      query: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaDeletedMessageBatch =
   *   await client.beta.messages.batches.delete(
   *     'message_batch_id',
   *   );
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(N`/v1/messages/batches/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.cancel(
   *     'message_batch_id',
   *   );
   * ```
   */
  cancel(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.post(N`/v1/messages/batches/${e}/cancel?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatchIndividualResponse =
   *   await client.beta.messages.batches.results(
   *     'message_batch_id',
   *   );
   * ```
   */
  async results(e, t = {}, r) {
    let n = await this.retrieve(e);
    if (!n.results_url)
      throw new x(`No batch \`results_url\`; Has it finished processing? ${n.processing_status} - ${n.id}`);
    let { betas: o } = t ?? {};
    return this._client.get(n.results_url, {
      ...r,
      headers: I([
        {
          "anthropic-beta": [...o ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        },
        r?.headers
      ]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((a, l) => wr.fromResponse(l.response, l.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var ia = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
}, Ze = class extends F {
  static {
    i(this, "Messages");
  }
  constructor() {
    super(...arguments), this.batches = new br(this._client);
  }
  create(e, t) {
    let { betas: r, ...n } = e;
    n.model in ia && console.warn(`The model '${n.model}' is deprecated and will reach end-of-life on ${ia[n.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    let o = this._client._options.timeout;
    if (!n.stream && o == null) {
      let a = un[n.model] ?? void 0;
      o = this._client.calculateNonstreamingTimeout(n.max_tokens, a);
    }
    return this._client.post("/v1/messages?beta=true", {
      body: n,
      timeout: o ?? 6e5,
      ...t,
      headers: I([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ]),
      stream: e.stream ?? !1
    });
  }
  /**
   * Send a structured list of input messages with text and/or image content, along with an expected `output_format` and
   * the response will be automatically parsed and available in the `parsed_output` property of the message.
   *
   * @example
   * ```ts
   * const message = await client.beta.messages.parse({
   *   model: 'claude-3-5-sonnet-20241022',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_format: zodOutputFormat(z.object({ answer: z.number() }), 'math'),
   * });
   *
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  parse(e, t) {
    return t = {
      ...t,
      headers: I([
        { "anthropic-beta": [...e.betas ?? [], "structured-outputs-2025-11-13"].toString() },
        t?.headers
      ])
    }, this.create(e, t).then((r) => wo(r, e, { logger: this._client.logger ?? console }));
  }
  /**
   * Create a Message stream
   */
  stream(e, t) {
    return wn.createMessage(this, e, t);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const betaMessageTokensCount =
   *   await client.beta.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/messages/count_tokens?beta=true", {
      body: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "token-counting-2024-11-01"].toString() },
        t?.headers
      ])
    });
  }
  toolRunner(e, t) {
    return new yr(this._client, e, t);
  }
};
Ze.Batches = br;
Ze.BetaToolRunner = yr;

// node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs
var xr = class extends F {
  static {
    i(this, "Versions");
  }
  /**
   * Create Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.create(
   *   'skill_id',
   * );
   * ```
   */
  create(e, t = {}, r) {
    let { betas: n, ...o } = t ?? {};
    return this._client.post(N`/v1/skills/${e}/versions?beta=true`, hr({
      body: o,
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.retrieve(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  retrieve(e, t, r) {
    let { skill_id: n, betas: o } = t;
    return this._client.get(N`/v1/skills/${n}/versions/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List Skill Versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const versionListResponse of client.beta.skills.versions.list(
   *   'skill_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(e, t = {}, r) {
    let { betas: n, ...o } = t ?? {};
    return this._client.getAPIList(N`/v1/skills/${e}/versions?beta=true`, fr, {
      query: o,
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * Delete Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.delete(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  delete(e, t, r) {
    let { skill_id: n, betas: o } = t;
    return this._client.delete(N`/v1/skills/${n}/versions/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...o ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
var Et = class extends F {
  static {
    i(this, "Skills");
  }
  constructor() {
    super(...arguments), this.versions = new xr(this._client);
  }
  /**
   * Create Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.create();
   * ```
   */
  create(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.post("/v1/skills?beta=true", hr({
      body: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() },
        t?.headers
      ])
    }, this._client));
  }
  /**
   * Get Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.retrieve('skill_id');
   * ```
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/skills/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
  /**
   * List Skills
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const skillListResponse of client.beta.skills.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/skills?beta=true", fr, {
      query: n,
      ...t,
      headers: I([
        { "anthropic-beta": [...r ?? [], "skills-2025-10-02"].toString() },
        t?.headers
      ])
    });
  }
  /**
   * Delete Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.delete('skill_id');
   * ```
   */
  delete(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.delete(N`/v1/skills/${e}?beta=true`, {
      ...r,
      headers: I([
        { "anthropic-beta": [...n ?? [], "skills-2025-10-02"].toString() },
        r?.headers
      ])
    });
  }
};
Et.Versions = xr;

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var ge = class extends F {
  static {
    i(this, "Beta");
  }
  constructor() {
    super(...arguments), this.models = new pr(this._client), this.messages = new Ze(this._client), this.files = new dr(this._client), this.skills = new Et(this._client);
  }
};
ge.Models = pr;
ge.Messages = Ze;
ge.Files = dr;
ge.Skills = Et;

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Ct = class extends F {
  static {
    i(this, "Completions");
  }
  create(e, t) {
    let { betas: r, ...n } = e;
    return this._client.post("/v1/complete", {
      body: n,
      timeout: this._client._options.timeout ?? 6e5,
      ...t,
      headers: I([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ]),
      stream: e.stream ?? !1
    });
  }
};

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var de, et, As, bn, Ps, Ss, xn, Rs, Ue, Is, An, Pn, kt, Sn, Rn, Ro, aa, Io, Eo, Co, ko, la, ca = "__json_buf";
function ua(s) {
  return s.type === "tool_use" || s.type === "server_tool_use";
}
i(ua, "tracksToolInput");
var In = class s {
  static {
    i(this, "MessageStream");
  }
  constructor() {
    de.add(this), this.messages = [], this.receivedMessages = [], et.set(this, void 0), this.controller = new AbortController(), As.set(this, void 0), bn.set(this, () => {
    }), Ps.set(this, () => {
    }), Ss.set(this, void 0), xn.set(this, () => {
    }), Rs.set(this, () => {
    }), Ue.set(this, {}), Is.set(this, !1), An.set(this, !1), Pn.set(this, !1), kt.set(this, !1), Sn.set(this, void 0), Rn.set(this, void 0), Io.set(this, (e) => {
      if (_(this, An, !0, "f"), Fe(e) && (e = new Y()), e instanceof Y)
        return _(this, Pn, !0, "f"), this._emit("abort", e);
      if (e instanceof x)
        return this._emit("error", e);
      if (e instanceof Error) {
        let t = new x(e.message);
        return t.cause = e, this._emit("error", t);
      }
      return this._emit("error", new x(String(e)));
    }), _(this, As, new Promise((e, t) => {
      _(this, bn, e, "f"), _(this, Ps, t, "f");
    }), "f"), _(this, Ss, new Promise((e, t) => {
      _(this, xn, e, "f"), _(this, Rs, t, "f");
    }), "f"), c(this, As, "f").catch(() => {
    }), c(this, Ss, "f").catch(() => {
    });
  }
  get response() {
    return c(this, Sn, "f");
  }
  get request_id() {
    return c(this, Rn, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    _(this, kt, !0, "f");
    let e = await c(this, As, "f");
    if (!e)
      throw new Error("Could not resolve a `Response` object");
    return {
      data: this,
      response: e,
      request_id: e.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    let t = new s();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createMessage(e, t, r) {
    let n = new s();
    for (let o of t.messages)
      n._addMessageParam(o);
    return n._run(() => n._createMessage(e, { ...t, stream: !0 }, { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" } })), n;
  }
  _run(e) {
    e().then(() => {
      this._emitFinal(), this._emit("end");
    }, c(this, Io, "f"));
  }
  _addMessageParam(e) {
    this.messages.push(e);
  }
  _addMessage(e, t = !0) {
    this.receivedMessages.push(e), t && this._emit("message", e);
  }
  async _createMessage(e, t, r) {
    let n = r?.signal, o;
    n && (n.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), n.addEventListener("abort", o));
    try {
      c(this, de, "m", Eo).call(this);
      let { response: a, data: l } = await e.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal }).withResponse();
      this._connected(a);
      for await (let u of l)
        c(this, de, "m", Co).call(this, u);
      if (l.controller.signal?.aborted)
        throw new Y();
      c(this, de, "m", ko).call(this);
    } finally {
      n && o && n.removeEventListener("abort", o);
    }
  }
  _connected(e) {
    this.ended || (_(this, Sn, e, "f"), _(this, Rn, e?.headers.get("request-id"), "f"), c(this, bn, "f").call(this, e), this._emit("connect"));
  }
  get ended() {
    return c(this, Is, "f");
  }
  get errored() {
    return c(this, An, "f");
  }
  get aborted() {
    return c(this, Pn, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(e, t) {
    return (c(this, Ue, "f")[e] || (c(this, Ue, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(e, t) {
    let r = c(this, Ue, "f")[e];
    if (!r)
      return this;
    let n = r.findIndex((o) => o.listener === t);
    return n >= 0 && r.splice(n, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(e, t) {
    return (c(this, Ue, "f")[e] || (c(this, Ue, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, r) => {
      _(this, kt, !0, "f"), e !== "error" && this.once("error", r), this.once(e, t);
    });
  }
  async done() {
    _(this, kt, !0, "f"), await c(this, Ss, "f");
  }
  get currentMessage() {
    return c(this, et, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalMessage() {
    return await this.done(), c(this, de, "m", Ro).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    return await this.done(), c(this, de, "m", aa).call(this);
  }
  _emit(e, ...t) {
    if (c(this, Is, "f"))
      return;
    e === "end" && (_(this, Is, !0, "f"), c(this, xn, "f").call(this));
    let r = c(this, Ue, "f")[e];
    if (r && (c(this, Ue, "f")[e] = r.filter((n) => !n.once), r.forEach(({ listener: n }) => n(...t))), e === "abort") {
      let n = t[0];
      !c(this, kt, "f") && !r?.length && Promise.reject(n), c(this, Ps, "f").call(this, n), c(this, Rs, "f").call(this, n), this._emit("end");
      return;
    }
    if (e === "error") {
      let n = t[0];
      !c(this, kt, "f") && !r?.length && Promise.reject(n), c(this, Ps, "f").call(this, n), c(this, Rs, "f").call(this, n), this._emit("end");
    }
  }
  _emitFinal() {
    this.receivedMessages.at(-1) && this._emit("finalMessage", c(this, de, "m", Ro).call(this));
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal, n;
    r && (r.aborted && this.controller.abort(), n = this.controller.abort.bind(this.controller), r.addEventListener("abort", n));
    try {
      c(this, de, "m", Eo).call(this), this._connected(null);
      let o = xe.fromReadableStream(e, this.controller);
      for await (let a of o)
        c(this, de, "m", Co).call(this, a);
      if (o.controller.signal?.aborted)
        throw new Y();
      c(this, de, "m", ko).call(this);
    } finally {
      r && n && r.removeEventListener("abort", n);
    }
  }
  [(et = /* @__PURE__ */ new WeakMap(), As = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new WeakMap(), Ps = /* @__PURE__ */ new WeakMap(), Ss = /* @__PURE__ */ new WeakMap(), xn = /* @__PURE__ */ new WeakMap(), Rs = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ new WeakMap(), Is = /* @__PURE__ */ new WeakMap(), An = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), Rn = /* @__PURE__ */ new WeakMap(), Io = /* @__PURE__ */ new WeakMap(), de = /* @__PURE__ */ new WeakSet(), Ro = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new x("stream ended without producing a Message with role=assistant");
    return this.receivedMessages.at(-1);
  }, "_MessageStream_getFinalMessage"), aa = /* @__PURE__ */ i(function() {
    if (this.receivedMessages.length === 0)
      throw new x("stream ended without producing a Message with role=assistant");
    let t = this.receivedMessages.at(-1).content.filter((r) => r.type === "text").map((r) => r.text);
    if (t.length === 0)
      throw new x("stream ended without producing a content block with type=text");
    return t.join(" ");
  }, "_MessageStream_getFinalText"), Eo = /* @__PURE__ */ i(function() {
    this.ended || _(this, et, void 0, "f");
  }, "_MessageStream_beginRequest"), Co = /* @__PURE__ */ i(function(t) {
    if (this.ended)
      return;
    let r = c(this, de, "m", la).call(this, t);
    switch (this._emit("streamEvent", t, r), t.type) {
      case "content_block_delta": {
        let n = r.content.at(-1);
        switch (t.delta.type) {
          case "text_delta": {
            n.type === "text" && this._emit("text", t.delta.text, n.text || "");
            break;
          }
          case "citations_delta": {
            n.type === "text" && this._emit("citation", t.delta.citation, n.citations ?? []);
            break;
          }
          case "input_json_delta": {
            ua(n) && n.input && this._emit("inputJson", t.delta.partial_json, n.input);
            break;
          }
          case "thinking_delta": {
            n.type === "thinking" && this._emit("thinking", t.delta.thinking, n.thinking);
            break;
          }
          case "signature_delta": {
            n.type === "thinking" && this._emit("signature", n.signature);
            break;
          }
          default:
            t.delta;
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(r), this._addMessage(r, !0);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", r.content.at(-1));
        break;
      }
      case "message_start": {
        _(this, et, r, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_MessageStream_addStreamEvent"), ko = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new x("stream has ended, this shouldn't happen");
    let t = c(this, et, "f");
    if (!t)
      throw new x("request ended without sending any chunks");
    return _(this, et, void 0, "f"), t;
  }, "_MessageStream_endRequest"), la = /* @__PURE__ */ i(function(t) {
    let r = c(this, et, "f");
    if (t.type === "message_start") {
      if (r)
        throw new x(`Unexpected event order, got ${t.type} before receiving "message_stop"`);
      return t.message;
    }
    if (!r)
      throw new x(`Unexpected event order, got ${t.type} before "message_start"`);
    switch (t.type) {
      case "message_stop":
        return r;
      case "message_delta":
        return r.stop_reason = t.delta.stop_reason, r.stop_sequence = t.delta.stop_sequence, r.usage.output_tokens = t.usage.output_tokens, t.usage.input_tokens != null && (r.usage.input_tokens = t.usage.input_tokens), t.usage.cache_creation_input_tokens != null && (r.usage.cache_creation_input_tokens = t.usage.cache_creation_input_tokens), t.usage.cache_read_input_tokens != null && (r.usage.cache_read_input_tokens = t.usage.cache_read_input_tokens), t.usage.server_tool_use != null && (r.usage.server_tool_use = t.usage.server_tool_use), r;
      case "content_block_start":
        return r.content.push({ ...t.content_block }), r;
      case "content_block_delta": {
        let n = r.content.at(t.index);
        switch (t.delta.type) {
          case "text_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              text: (n.text || "") + t.delta.text
            });
            break;
          }
          case "citations_delta": {
            n?.type === "text" && (r.content[t.index] = {
              ...n,
              citations: [...n.citations ?? [], t.delta.citation]
            });
            break;
          }
          case "input_json_delta": {
            if (n && ua(n)) {
              let o = n[ca] || "";
              o += t.delta.partial_json;
              let a = { ...n };
              Object.defineProperty(a, ca, {
                value: o,
                enumerable: !1,
                writable: !0
              }), o && (a.input = fn(o)), r.content[t.index] = a;
            }
            break;
          }
          case "thinking_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              thinking: n.thinking + t.delta.thinking
            });
            break;
          }
          case "signature_delta": {
            n?.type === "thinking" && (r.content[t.index] = {
              ...n,
              signature: t.delta.signature
            });
            break;
          }
          default:
            t.delta;
        }
        return r;
      }
      case "content_block_stop":
        return r;
    }
  }, "_MessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("streamEvent", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, a) => t.push({ resolve: o, reject: a })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  toReadableStream() {
    return new xe(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Ar = class extends F {
  static {
    i(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.create({
   *   requests: [
   *     {
   *       custom_id: 'my-custom-id-1',
   *       params: {
   *         max_tokens: 1024,
   *         messages: [
   *           { content: 'Hello, world', role: 'user' },
   *         ],
   *         model: 'claude-sonnet-4-5-20250929',
   *       },
   *     },
   *   ],
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/v1/messages/batches", { body: e, ...t });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.retrieve(
   *   'message_batch_id',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(N`/v1/messages/batches/${e}`, t);
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const messageBatch of client.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(e = {}, t) {
    return this._client.getAPIList("/v1/messages/batches", fe, { query: e, ...t });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const deletedMessageBatch =
   *   await client.messages.batches.delete('message_batch_id');
   * ```
   */
  delete(e, t) {
    return this._client.delete(N`/v1/messages/batches/${e}`, t);
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.cancel(
   *   'message_batch_id',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(N`/v1/messages/batches/${e}/cancel`, t);
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatchIndividualResponse =
   *   await client.messages.batches.results('message_batch_id');
   * ```
   */
  async results(e, t) {
    let r = await this.retrieve(e);
    if (!r.results_url)
      throw new x(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);
    return this._client.get(r.results_url, {
      ...t,
      headers: I([{ Accept: "application/binary" }, t?.headers]),
      stream: !0,
      __binaryResponse: !0
    })._thenUnwrap((n, o) => wr.fromResponse(o.response, o.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var tt = class extends F {
  static {
    i(this, "Messages");
  }
  constructor() {
    super(...arguments), this.batches = new Ar(this._client);
  }
  create(e, t) {
    e.model in fa && console.warn(`The model '${e.model}' is deprecated and will reach end-of-life on ${fa[e.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    let r = this._client._options.timeout;
    if (!e.stream && r == null) {
      let n = un[e.model] ?? void 0;
      r = this._client.calculateNonstreamingTimeout(e.max_tokens, n);
    }
    return this._client.post("/v1/messages", {
      body: e,
      timeout: r ?? 6e5,
      ...t,
      stream: e.stream ?? !1
    });
  }
  /**
   * Create a Message stream
   */
  stream(e, t) {
    return In.createMessage(this, e, t);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const messageTokensCount =
   *   await client.messages.countTokens({
   *     messages: [{ content: 'string', role: 'user' }],
   *     model: 'claude-opus-4-5-20251101',
   *   });
   * ```
   */
  countTokens(e, t) {
    return this._client.post("/v1/messages/count_tokens", { body: e, ...t });
  }
}, fa = {
  "claude-1.3": "November 6th, 2024",
  "claude-1.3-100k": "November 6th, 2024",
  "claude-instant-1.1": "November 6th, 2024",
  "claude-instant-1.1-100k": "November 6th, 2024",
  "claude-instant-1.2": "November 6th, 2024",
  "claude-3-sonnet-20240229": "July 21st, 2025",
  "claude-3-opus-20240229": "January 5th, 2026",
  "claude-2.1": "July 21st, 2025",
  "claude-2.0": "July 21st, 2025",
  "claude-3-7-sonnet-latest": "February 19th, 2026",
  "claude-3-7-sonnet-20250219": "February 19th, 2026"
};
tt.Batches = Ar;

// node_modules/@anthropic-ai/sdk/resources/models.mjs
var Ot = class extends F {
  static {
    i(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   */
  retrieve(e, t = {}, r) {
    let { betas: n } = t ?? {};
    return this._client.get(N`/v1/models/${e}`, {
      ...r,
      headers: I([
        { ...n?.toString() != null ? { "anthropic-beta": n?.toString() } : void 0 },
        r?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   */
  list(e = {}, t) {
    let { betas: r, ...n } = e ?? {};
    return this._client.getAPIList("/v1/models", fe, {
      query: n,
      ...t,
      headers: I([
        { ...r?.toString() != null ? { "anthropic-beta": r?.toString() } : void 0 },
        t?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
var Es = /* @__PURE__ */ i((s) => {
  if (typeof globalThis.process < "u")
    return globalThis.process.env?.[s]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u")
    return globalThis.Deno.env?.get?.(s)?.trim();
}, "readEnv");

// node_modules/@anthropic-ai/sdk/client.mjs
var Oo, To, En, ha, da = "\\n\\nHuman:", pa = "\\n\\nAssistant:", L = class {
  static {
    i(this, "BaseAnthropic");
  }
  /**
   * API Client for interfacing with the Anthropic API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
   * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL: e = Es("ANTHROPIC_BASE_URL"), apiKey: t = Es("ANTHROPIC_API_KEY") ?? null, authToken: r = Es("ANTHROPIC_AUTH_TOKEN") ?? null, ...n } = {}) {
    Oo.add(this), En.set(this, void 0);
    let o = {
      apiKey: t,
      authToken: r,
      ...n,
      baseURL: e || "https://api.anthropic.com"
    };
    if (!o.dangerouslyAllowBrowser && Li())
      throw new x(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = o.baseURL, this.timeout = o.timeout ?? To.DEFAULT_TIMEOUT, this.logger = o.logger ?? console;
    let a = "warn";
    this.logLevel = a, this.logLevel = uo(o.logLevel, "ClientOptions.logLevel", this) ?? uo(Es("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? a, this.fetchOptions = o.fetchOptions, this.maxRetries = o.maxRetries ?? 2, this.fetch = o.fetch ?? Ui(), _(this, En, qi, "f"), this._options = o, this.apiKey = typeof t == "string" ? t : null, this.authToken = r;
  }
  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(e) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...e
    });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values: e, nulls: t }) {
    if (!(e.get("x-api-key") || e.get("authorization")) && !(this.apiKey && e.get("x-api-key")) && !t.has("x-api-key") && !(this.authToken && e.get("authorization")) && !t.has("authorization"))
      throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  async authHeaders(e) {
    return I([await this.apiKeyAuth(e), await this.bearerAuth(e)]);
  }
  async apiKeyAuth(e) {
    if (this.apiKey != null)
      return I([{ "X-Api-Key": this.apiKey }]);
  }
  async bearerAuth(e) {
    if (this.authToken != null)
      return I([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  /**
   * Basic re-implementation of `qs.stringify` for primitive types.
   */
  stringifyQuery(e) {
    return Object.entries(e).filter(([t, r]) => typeof r < "u").map(([t, r]) => {
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean")
        return `${encodeURIComponent(t)}=${encodeURIComponent(r)}`;
      if (r === null)
        return `${encodeURIComponent(t)}=`;
      throw new x(`Cannot stringify type ${typeof r}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${Qe}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${oo()}`;
  }
  makeStatusError(e, t, r, n) {
    return G.generate(e, t, r, n);
  }
  buildURL(e, t, r) {
    let n = !c(this, Oo, "m", ha).call(this) && r || this.baseURL, o = Oi(e) ? new URL(e) : new URL(n + (n.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), a = this.defaultQuery();
    return Ti(a) || (t = { ...a, ...t }), typeof t == "object" && t && !Array.isArray(t) && (o.search = this.stringifyQuery(t)), o.toString();
  }
  _calculateNonstreamingTimeout(e) {
    if (3600 * e / 128e3 > 600)
      throw new x("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    return 600 * 1e3;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(e) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(e, { url: t, options: r }) {
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, r) {
    return this.request(Promise.resolve(r).then((n) => ({ method: e, path: t, ...n })));
  }
  request(e, t = null) {
    return new Pt(this, this.makeRequest(e, t, void 0));
  }
  async makeRequest(e, t, r) {
    let n = await e, o = n.maxRetries ?? this.maxRetries;
    t == null && (t = o), await this.prepareOptions(n);
    let { req: a, url: l, timeout: u } = await this.buildRequest(n, {
      retryCount: o - t
    });
    await this.prepareRequest(a, { url: l, options: n });
    let f = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), y = r === void 0 ? "" : `, retryOf: ${r}`, h = Date.now();
    if (Q(this).debug(`[${f}] sending request`, Be({
      retryOfRequestLogID: r,
      method: n.method,
      url: l,
      options: n,
      headers: a.headers
    })), n.signal?.aborted)
      throw new Y();
    let m = new AbortController(), d = await this.fetchWithTimeout(l, a, u, m).catch(os), A = Date.now();
    if (d instanceof globalThis.Error) {
      let O = `retrying, ${t} attempts remaining`;
      if (n.signal?.aborted)
        throw new Y();
      let g = Fe(d) || /timed? ?out/i.test(String(d) + ("cause" in d ? String(d.cause) : ""));
      if (t)
        return Q(this).info(`[${f}] connection ${g ? "timed out" : "failed"} - ${O}`), Q(this).debug(`[${f}] connection ${g ? "timed out" : "failed"} (${O})`, Be({
          retryOfRequestLogID: r,
          url: l,
          durationMs: A - h,
          message: d.message
        })), this.retryRequest(n, t, r ?? f);
      throw Q(this).info(`[${f}] connection ${g ? "timed out" : "failed"} - error; no more retries left`), Q(this).debug(`[${f}] connection ${g ? "timed out" : "failed"} (error; no more retries left)`, Be({
        retryOfRequestLogID: r,
        url: l,
        durationMs: A - h,
        message: d.message
      })), g ? new rr() : new Ge({ cause: d });
    }
    let w = [...d.headers.entries()].filter(([O]) => O === "request-id").map(([O, g]) => ", " + O + ": " + JSON.stringify(g)).join(""), T = `[${f}${y}${w}] ${a.method} ${l} ${d.ok ? "succeeded" : "failed"} with status ${d.status} in ${A - h}ms`;
    if (!d.ok) {
      let O = await this.shouldRetry(d);
      if (t && O) {
        let B = `retrying, ${t} attempts remaining`;
        return await Di(d.body), Q(this).info(`${T} - ${B}`), Q(this).debug(`[${f}] response error (${B})`, Be({
          retryOfRequestLogID: r,
          url: d.url,
          status: d.status,
          headers: d.headers,
          durationMs: A - h
        })), this.retryRequest(n, t, r ?? f, d.headers);
      }
      let g = O ? "error; no more retries left" : "error; not retryable";
      Q(this).info(`${T} - ${g}`);
      let $ = await d.text().catch((B) => os(B).message), R = tn($), C = R ? void 0 : $;
      throw Q(this).debug(`[${f}] response error (${g})`, Be({
        retryOfRequestLogID: r,
        url: d.url,
        status: d.status,
        headers: d.headers,
        message: C,
        durationMs: Date.now() - h
      })), this.makeStatusError(d.status, R, C, d.headers);
    }
    return Q(this).info(T), Q(this).debug(`[${f}] response start`, Be({
      retryOfRequestLogID: r,
      url: d.url,
      status: d.status,
      headers: d.headers,
      durationMs: A - h
    })), { response: d, options: n, controller: m, requestLogID: f, retryOfRequestLogID: r, startTime: h };
  }
  getAPIList(e, t, r) {
    return this.requestAPIList(t, { method: "get", path: e, ...r });
  }
  requestAPIList(e, t) {
    let r = this.makeRequest(t, null, void 0);
    return new fs(this, r, e);
  }
  async fetchWithTimeout(e, t, r, n) {
    let { signal: o, method: a, ...l } = t || {};
    o && o.addEventListener("abort", () => n.abort());
    let u = setTimeout(() => n.abort(), r), f = globalThis.ReadableStream && l.body instanceof globalThis.ReadableStream || typeof l.body == "object" && l.body !== null && Symbol.asyncIterator in l.body, y = {
      signal: n.signal,
      ...f ? { duplex: "half" } : {},
      method: "GET",
      ...l
    };
    a && (y.method = a.toUpperCase());
    try {
      return await this.fetch.call(void 0, e, y);
    } finally {
      clearTimeout(u);
    }
  }
  async shouldRetry(e) {
    let t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, r, n) {
    let o, a = n?.get("retry-after-ms");
    if (a) {
      let u = parseFloat(a);
      Number.isNaN(u) || (o = u);
    }
    let l = n?.get("retry-after");
    if (l && !o) {
      let u = parseFloat(l);
      Number.isNaN(u) ? o = Date.parse(l) - Date.now() : o = u * 1e3;
    }
    if (!(o && 0 <= o && o < 60 * 1e3)) {
      let u = e.maxRetries ?? this.maxRetries;
      o = this.calculateDefaultRetryTimeoutMillis(t, u);
    }
    return await vi(o), this.makeRequest(e, t - 1, r);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    let o = t - e, a = Math.min(0.5 * Math.pow(2, o), 8), l = 1 - Math.random() * 0.25;
    return a * l * 1e3;
  }
  calculateNonstreamingTimeout(e, t) {
    if (36e5 * e / 128e3 > 6e5 || t != null && e > t)
      throw new x("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 6e5;
  }
  async buildRequest(e, { retryCount: t = 0 } = {}) {
    let r = { ...e }, { method: n, path: o, query: a, defaultBaseURL: l } = r, u = this.buildURL(o, a, l);
    "timeout" in r && $i("timeout", r.timeout), r.timeout = r.timeout ?? this.timeout;
    let { bodyHeaders: f, body: y } = this.buildBody({ options: r }), h = await this.buildHeaders({ options: e, method: n, bodyHeaders: f, retryCount: t });
    return { req: {
      method: n,
      headers: h,
      ...r.signal && { signal: r.signal },
      ...globalThis.ReadableStream && y instanceof globalThis.ReadableStream && { duplex: "half" },
      ...y && { body: y },
      ...this.fetchOptions ?? {},
      ...r.fetchOptions ?? {}
    }, url: u, timeout: r.timeout };
  }
  async buildHeaders({ options: e, method: t, bodyHeaders: r, retryCount: n }) {
    let o = {};
    this.idempotencyHeader && t !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), o[this.idempotencyHeader] = e.idempotencyKey);
    let a = I([
      o,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(n),
        ...e.timeout ? { "X-Stainless-Timeout": String(Math.trunc(e.timeout / 1e3)) } : {},
        ...ji(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      await this.authHeaders(e),
      this._options.defaultHeaders,
      r,
      e.headers
    ]);
    return this.validateHeaders(a), a.values;
  }
  buildBody({ options: { body: e, headers: t } }) {
    if (!e)
      return { bodyHeaders: void 0, body: void 0 };
    let r = I([t]);
    return (
      // Pass raw type verbatim
      ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof DataView || typeof e == "string" && // Preserve legacy string encoding behavior for now
      r.values.has("content-type") || // `Blob` is superset of `File`
      globalThis.Blob && e instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
      e instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
      e instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
      globalThis.ReadableStream && e instanceof globalThis.ReadableStream ? { bodyHeaders: void 0, body: e } : typeof e == "object" && (Symbol.asyncIterator in e || Symbol.iterator in e && "next" in e && typeof e.next == "function") ? { bodyHeaders: void 0, body: rn(e) } : c(this, En, "f").call(this, { body: e, headers: r })
    );
  }
};
To = L, En = /* @__PURE__ */ new WeakMap(), Oo = /* @__PURE__ */ new WeakSet(), ha = /* @__PURE__ */ i(function() {
  return this.baseURL !== "https://api.anthropic.com";
}, "_BaseAnthropic_baseURLOverridden");
L.Anthropic = To;
L.HUMAN_PROMPT = da;
L.AI_PROMPT = pa;
L.DEFAULT_TIMEOUT = 6e5;
L.AnthropicError = x;
L.APIError = G;
L.APIConnectionError = Ge;
L.APIConnectionTimeoutError = rr;
L.APIUserAbortError = Y;
L.NotFoundError = ir;
L.ConflictError = ar;
L.RateLimitError = cr;
L.BadRequestError = sr;
L.AuthenticationError = nr;
L.InternalServerError = ur;
L.PermissionDeniedError = or;
L.UnprocessableEntityError = lr;
L.toFile = cn;
var Ae = class extends L {
  static {
    i(this, "Anthropic");
  }
  constructor() {
    super(...arguments), this.completions = new Ct(this), this.messages = new tt(this), this.models = new Ot(this), this.beta = new ge(this);
  }
};
Ae.Completions = Ct;
Ae.Messages = tt;
Ae.Models = Ot;
Ae.Beta = ge;

// node_modules/openai/internal/qs/formats.mjs
var Cn = "RFC3986", kn = {
  RFC1738: /* @__PURE__ */ i((s) => String(s).replace(/%20/g, "+"), "RFC1738"),
  RFC3986: /* @__PURE__ */ i((s) => String(s), "RFC3986")
}, ma = "RFC1738";

// node_modules/openai/internal/qs/utils.mjs
var Kl = Array.isArray, Pe = (() => {
  let s = [];
  for (let e = 0; e < 256; ++e)
    s.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return s;
})();
var Mo = 1024, ga = /* @__PURE__ */ i((s, e, t, r, n) => {
  if (s.length === 0)
    return s;
  let o = s;
  if (typeof s == "symbol" ? o = Symbol.prototype.toString.call(s) : typeof s != "string" && (o = String(s)), t === "iso-8859-1")
    return escape(o).replace(/%u[0-9a-f]{4}/gi, function(l) {
      return "%26%23" + parseInt(l.slice(2), 16) + "%3B";
    });
  let a = "";
  for (let l = 0; l < o.length; l += Mo) {
    let u = o.length >= Mo ? o.slice(l, l + Mo) : o, f = [];
    for (let y = 0; y < u.length; ++y) {
      let h = u.charCodeAt(y);
      if (h === 45 || // -
      h === 46 || // .
      h === 95 || // _
      h === 126 || // ~
      h >= 48 && h <= 57 || // 0-9
      h >= 65 && h <= 90 || // a-z
      h >= 97 && h <= 122 || // A-Z
      n === ma && (h === 40 || h === 41)) {
        f[f.length] = u.charAt(y);
        continue;
      }
      if (h < 128) {
        f[f.length] = Pe[h];
        continue;
      }
      if (h < 2048) {
        f[f.length] = Pe[192 | h >> 6] + Pe[128 | h & 63];
        continue;
      }
      if (h < 55296 || h >= 57344) {
        f[f.length] = Pe[224 | h >> 12] + Pe[128 | h >> 6 & 63] + Pe[128 | h & 63];
        continue;
      }
      y += 1, h = 65536 + ((h & 1023) << 10 | u.charCodeAt(y) & 1023), f[f.length] = Pe[240 | h >> 18] + Pe[128 | h >> 12 & 63] + Pe[128 | h >> 6 & 63] + Pe[128 | h & 63];
    }
    a += f.join("");
  }
  return a;
}, "encode");
function _a(s) {
  return !s || typeof s != "object" ? !1 : !!(s.constructor && s.constructor.isBuffer && s.constructor.isBuffer(s));
}
i(_a, "is_buffer");
function $o(s, e) {
  if (Kl(s)) {
    let t = [];
    for (let r = 0; r < s.length; r += 1)
      t.push(e(s[r]));
    return t;
  }
  return e(s);
}
i($o, "maybe_map");

// node_modules/openai/internal/qs/stringify.mjs
var Gl = Object.prototype.hasOwnProperty, ya = {
  brackets(s) {
    return String(s) + "[]";
  },
  comma: "comma",
  indices(s, e) {
    return String(s) + "[" + e + "]";
  },
  repeat(s) {
    return String(s);
  }
}, Se = Array.isArray, Ql = Array.prototype.push, wa = /* @__PURE__ */ i(function(s, e) {
  Ql.apply(s, Se(e) ? e : [e]);
}, "push_to_array"), zl = Date.prototype.toISOString, H = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: ga,
  encodeValuesOnly: !1,
  format: Cn,
  formatter: kn[Cn],
  /** @deprecated */
  indices: !1,
  serializeDate(s) {
    return zl.call(s);
  },
  skipNulls: !1,
  strictNullHandling: !1
};
function Yl(s) {
  return typeof s == "string" || typeof s == "number" || typeof s == "boolean" || typeof s == "symbol" || typeof s == "bigint";
}
i(Yl, "is_non_nullish_primitive");
var vo = {};
function ba(s, e, t, r, n, o, a, l, u, f, y, h, m, d, A, w, T, O) {
  let g = s, $ = O, R = 0, C = !1;
  for (; ($ = $.get(vo)) !== void 0 && !C; ) {
    let U = $.get(s);
    if (R += 1, typeof U < "u") {
      if (U === R)
        throw new RangeError("Cyclic object value");
      C = !0;
    }
    typeof $.get(vo) > "u" && (R = 0);
  }
  if (typeof f == "function" ? g = f(e, g) : g instanceof Date ? g = m?.(g) : t === "comma" && Se(g) && (g = $o(g, function(U) {
    return U instanceof Date ? m?.(U) : U;
  })), g === null) {
    if (o)
      return u && !w ? (
        // @ts-expect-error
        u(e, H.encoder, T, "key", d)
      ) : e;
    g = "";
  }
  if (Yl(g) || _a(g)) {
    if (u) {
      let U = w ? e : u(e, H.encoder, T, "key", d);
      return [
        A?.(U) + "=" + // @ts-expect-error
        A?.(u(g, H.encoder, T, "value", d))
      ];
    }
    return [A?.(e) + "=" + A?.(String(g))];
  }
  let v = [];
  if (typeof g > "u")
    return v;
  let B;
  if (t === "comma" && Se(g))
    w && u && (g = $o(g, u)), B = [{ value: g.length > 0 ? g.join(",") || null : void 0 }];
  else if (Se(f))
    B = f;
  else {
    let U = Object.keys(g);
    B = y ? U.sort(y) : U;
  }
  let V = l ? String(e).replace(/\./g, "%2E") : String(e), K = r && Se(g) && g.length === 1 ? V + "[]" : V;
  if (n && Se(g) && g.length === 0)
    return K + "[]";
  for (let U = 0; U < B.length; ++U) {
    let q = B[U], Ai = (
      // @ts-ignore
      typeof q == "object" && typeof q.value < "u" ? q.value : g[q]
    );
    if (a && Ai === null)
      continue;
    let so = h && l ? q.replace(/\./g, "%2E") : q, fl = Se(g) ? typeof t == "function" ? t(K, so) : K : K + (h ? "." + so : "[" + so + "]");
    O.set(s, R);
    let Pi = /* @__PURE__ */ new WeakMap();
    Pi.set(vo, O), wa(v, ba(
      Ai,
      fl,
      t,
      r,
      n,
      o,
      a,
      l,
      // @ts-ignore
      t === "comma" && w && Se(g) ? null : u,
      f,
      y,
      h,
      m,
      d,
      A,
      w,
      T,
      Pi
    ));
  }
  return v;
}
i(ba, "inner_stringify");
function Zl(s = H) {
  if (typeof s.allowEmptyArrays < "u" && typeof s.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof s.encodeDotInKeys < "u" && typeof s.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (s.encoder !== null && typeof s.encoder < "u" && typeof s.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  let e = s.charset || H.charset;
  if (typeof s.charset < "u" && s.charset !== "utf-8" && s.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  let t = Cn;
  if (typeof s.format < "u") {
    if (!Gl.call(kn, s.format))
      throw new TypeError("Unknown format option provided.");
    t = s.format;
  }
  let r = kn[t], n = H.filter;
  (typeof s.filter == "function" || Se(s.filter)) && (n = s.filter);
  let o;
  if (s.arrayFormat && s.arrayFormat in ya ? o = s.arrayFormat : "indices" in s ? o = s.indices ? "indices" : "repeat" : o = H.arrayFormat, "commaRoundTrip" in s && typeof s.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  let a = typeof s.allowDots > "u" ? s.encodeDotInKeys ? !0 : H.allowDots : !!s.allowDots;
  return {
    addQueryPrefix: typeof s.addQueryPrefix == "boolean" ? s.addQueryPrefix : H.addQueryPrefix,
    // @ts-ignore
    allowDots: a,
    allowEmptyArrays: typeof s.allowEmptyArrays == "boolean" ? !!s.allowEmptyArrays : H.allowEmptyArrays,
    arrayFormat: o,
    charset: e,
    charsetSentinel: typeof s.charsetSentinel == "boolean" ? s.charsetSentinel : H.charsetSentinel,
    commaRoundTrip: !!s.commaRoundTrip,
    delimiter: typeof s.delimiter > "u" ? H.delimiter : s.delimiter,
    encode: typeof s.encode == "boolean" ? s.encode : H.encode,
    encodeDotInKeys: typeof s.encodeDotInKeys == "boolean" ? s.encodeDotInKeys : H.encodeDotInKeys,
    encoder: typeof s.encoder == "function" ? s.encoder : H.encoder,
    encodeValuesOnly: typeof s.encodeValuesOnly == "boolean" ? s.encodeValuesOnly : H.encodeValuesOnly,
    filter: n,
    format: t,
    formatter: r,
    serializeDate: typeof s.serializeDate == "function" ? s.serializeDate : H.serializeDate,
    skipNulls: typeof s.skipNulls == "boolean" ? s.skipNulls : H.skipNulls,
    // @ts-ignore
    sort: typeof s.sort == "function" ? s.sort : null,
    strictNullHandling: typeof s.strictNullHandling == "boolean" ? s.strictNullHandling : H.strictNullHandling
  };
}
i(Zl, "normalize_stringify_options");
function Fo(s, e = {}) {
  let t = s, r = Zl(e), n, o;
  typeof r.filter == "function" ? (o = r.filter, t = o("", t)) : Se(r.filter) && (o = r.filter, n = o);
  let a = [];
  if (typeof t != "object" || t === null)
    return "";
  let l = ya[r.arrayFormat], u = l === "comma" && r.commaRoundTrip;
  n || (n = Object.keys(t)), r.sort && n.sort(r.sort);
  let f = /* @__PURE__ */ new WeakMap();
  for (let m = 0; m < n.length; ++m) {
    let d = n[m];
    r.skipNulls && t[d] === null || wa(a, ba(
      t[d],
      d,
      // @ts-expect-error
      l,
      u,
      r.allowEmptyArrays,
      r.strictNullHandling,
      r.skipNulls,
      r.encodeDotInKeys,
      r.encode ? r.encoder : null,
      r.filter,
      r.sort,
      r.allowDots,
      r.serializeDate,
      r.format,
      r.formatter,
      r.encodeValuesOnly,
      r.charset,
      f
    ));
  }
  let y = a.join(r.delimiter), h = r.addQueryPrefix === !0 ? "?" : "";
  return r.charsetSentinel && (r.charset === "iso-8859-1" ? h += "utf8=%26%2310003%3B&" : h += "utf8=%E2%9C%93&"), y.length > 0 ? h + y : "";
}
i(Fo, "stringify");

// node_modules/openai/version.mjs
var Tt = "4.104.0";

// node_modules/openai/_shims/registry.mjs
var xa = !1, Mt, No, tc, rc, sc, Bo, nc, On, Lo, jo, Uo, Tn, Do;
function Aa(s, e = { auto: !1 }) {
  if (xa)
    throw new Error(`you must \`import 'openai/shims/${s.kind}'\` before importing anything else from openai`);
  if (Mt)
    throw new Error(`can't \`import 'openai/shims/${s.kind}'\` after \`import 'openai/shims/${Mt}'\``);
  xa = e.auto, Mt = s.kind, No = s.fetch, tc = s.Request, rc = s.Response, sc = s.Headers, Bo = s.FormData, nc = s.Blob, On = s.File, Lo = s.ReadableStream, jo = s.getMultipartRequestOptions, Uo = s.getDefaultAgent, Tn = s.fileFromPath, Do = s.isFsReadStream;
}
i(Aa, "setShims");

// node_modules/openai/_shims/MultipartBody.mjs
var Mn = class {
  static {
    i(this, "MultipartBody");
  }
  constructor(e) {
    this.body = e;
  }
  get [Symbol.toStringTag]() {
    return "MultipartBody";
  }
};

// node_modules/openai/_shims/web-runtime.mjs
function Pa({ manuallyImported: s } = {}) {
  let e = s ? "You may need to use polyfills" : "Add one of these imports before your first `import \u2026 from 'openai'`:\n- `import 'openai/shims/node'` (if you're running on Node)\n- `import 'openai/shims/web'` (otherwise)\n", t, r, n, o;
  try {
    t = fetch, r = Request, n = Response, o = Headers;
  } catch (a) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${a.message}. ${e}`);
  }
  return {
    kind: "web",
    fetch: t,
    Request: r,
    Response: n,
    Headers: o,
    FormData: (
      // @ts-ignore
      typeof FormData < "u" ? FormData : class {
        static {
          i(this, "FormData");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${e}`);
        }
      }
    ),
    Blob: typeof Blob < "u" ? Blob : class {
      static {
        i(this, "Blob");
      }
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${e}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File < "u" ? File : class {
        static {
          i(this, "File");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${e}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream < "u" ? ReadableStream : class {
        static {
          i(this, "ReadableStream");
        }
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${e}`);
        }
      }
    ),
    getMultipartRequestOptions: /* @__PURE__ */ i(async (a, l) => ({
      ...l,
      body: new Mn(a)
    }), "getMultipartRequestOptions"),
    getDefaultAgent: /* @__PURE__ */ i((a) => {
    }, "getDefaultAgent"),
    fileFromPath: /* @__PURE__ */ i(() => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
    }, "fileFromPath"),
    isFsReadStream: /* @__PURE__ */ i((a) => !1, "isFsReadStream")
  };
}
i(Pa, "getRuntime");

// node_modules/openai/_shims/index.mjs
var qo = /* @__PURE__ */ i(() => {
  Mt || Aa(Pa(), { auto: !0 });
}, "init");
qo();

// node_modules/openai/error.mjs
var b = class extends Error {
  static {
    i(this, "OpenAIError");
  }
}, J = class s extends b {
  static {
    i(this, "APIError");
  }
  constructor(e, t, r, n) {
    super(`${s.makeMessage(e, t, r)}`), this.status = e, this.headers = n, this.request_id = n?.["x-request-id"], this.error = t;
    let o = t;
    this.code = o?.code, this.param = o?.param, this.type = o?.type;
  }
  static makeMessage(e, t, r) {
    let n = t?.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : r;
    return e && n ? `${e} ${n}` : e ? `${e} status code (no body)` : n || "(no status code or body)";
  }
  static generate(e, t, r, n) {
    if (!e || !n)
      return new rt({ message: r, cause: $n(t) });
    let o = t?.error;
    return e === 400 ? new Cs(e, o, r, n) : e === 401 ? new ks(e, o, r, n) : e === 403 ? new Os(e, o, r, n) : e === 404 ? new Ts(e, o, r, n) : e === 409 ? new Ms(e, o, r, n) : e === 422 ? new $s(e, o, r, n) : e === 429 ? new vs(e, o, r, n) : e >= 500 ? new Fs(e, o, r, n) : new s(e, o, r, n);
  }
}, D = class extends J {
  static {
    i(this, "APIUserAbortError");
  }
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}, rt = class extends J {
  static {
    i(this, "APIConnectionError");
  }
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}, st = class extends rt {
  static {
    i(this, "APIConnectionTimeoutError");
  }
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}, Cs = class extends J {
  static {
    i(this, "BadRequestError");
  }
}, ks = class extends J {
  static {
    i(this, "AuthenticationError");
  }
}, Os = class extends J {
  static {
    i(this, "PermissionDeniedError");
  }
}, Ts = class extends J {
  static {
    i(this, "NotFoundError");
  }
}, Ms = class extends J {
  static {
    i(this, "ConflictError");
  }
}, $s = class extends J {
  static {
    i(this, "UnprocessableEntityError");
  }
}, vs = class extends J {
  static {
    i(this, "RateLimitError");
  }
}, Fs = class extends J {
  static {
    i(this, "InternalServerError");
  }
}, Pr = class extends b {
  static {
    i(this, "LengthFinishReasonError");
  }
  constructor() {
    super("Could not parse response content as the length limit was reached");
  }
}, Sr = class extends b {
  static {
    i(this, "ContentFilterFinishReasonError");
  }
  constructor() {
    super("Could not parse response content as the request was rejected by the content filter");
  }
};

// node_modules/openai/internal/decoders/line.mjs
var vn = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, $t = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, ie, vt = class {
  static {
    i(this, "LineDecoder");
  }
  constructor() {
    ie.set(this, void 0), this.buffer = new Uint8Array(), vn(this, ie, null, "f");
  }
  decode(e) {
    if (e == null)
      return [];
    let t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? new TextEncoder().encode(e) : e, r = new Uint8Array(this.buffer.length + t.length);
    r.set(this.buffer), r.set(t, this.buffer.length), this.buffer = r;
    let n = [], o;
    for (; (o = ac(this.buffer, $t(this, ie, "f"))) != null; ) {
      if (o.carriage && $t(this, ie, "f") == null) {
        vn(this, ie, o.index, "f");
        continue;
      }
      if ($t(this, ie, "f") != null && (o.index !== $t(this, ie, "f") + 1 || o.carriage)) {
        n.push(this.decodeText(this.buffer.slice(0, $t(this, ie, "f") - 1))), this.buffer = this.buffer.slice($t(this, ie, "f")), vn(this, ie, null, "f");
        continue;
      }
      let a = $t(this, ie, "f") !== null ? o.preceding - 1 : o.preceding, l = this.decodeText(this.buffer.slice(0, a));
      n.push(l), this.buffer = this.buffer.slice(o.index), vn(this, ie, null, "f");
    }
    return n;
  }
  decodeText(e) {
    if (e == null)
      return "";
    if (typeof e == "string")
      return e;
    if (typeof Buffer < "u") {
      if (e instanceof Buffer)
        return e.toString();
      if (e instanceof Uint8Array)
        return Buffer.from(e).toString();
      throw new b(`Unexpected: received non-Uint8Array (${e.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder < "u") {
      if (e instanceof Uint8Array || e instanceof ArrayBuffer)
        return this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8")), this.textDecoder.decode(e);
      throw new b(`Unexpected: received non-Uint8Array/ArrayBuffer (${e.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new b("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.");
  }
  flush() {
    return this.buffer.length ? this.decode(`
`) : [];
  }
};
ie = /* @__PURE__ */ new WeakMap();
vt.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
vt.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function ac(s, e) {
  for (let n = e ?? 0; n < s.length; n++) {
    if (s[n] === 10)
      return { preceding: n, index: n + 1, carriage: !1 };
    if (s[n] === 13)
      return { preceding: n, index: n + 1, carriage: !0 };
  }
  return null;
}
i(ac, "findNewlineIndex");
function Sa(s) {
  for (let r = 0; r < s.length - 1; r++) {
    if (s[r] === 10 && s[r + 1] === 10 || s[r] === 13 && s[r + 1] === 13)
      return r + 2;
    if (s[r] === 13 && s[r + 1] === 10 && r + 3 < s.length && s[r + 2] === 13 && s[r + 3] === 10)
      return r + 4;
  }
  return -1;
}
i(Sa, "findDoubleNewlineIndex");

// node_modules/openai/internal/stream-utils.mjs
function Wo(s) {
  if (s[Symbol.asyncIterator])
    return s;
  let e = s.getReader();
  return {
    async next() {
      try {
        let t = await e.read();
        return t?.done && e.releaseLock(), t;
      } catch (t) {
        throw e.releaseLock(), t;
      }
    },
    async return() {
      let t = e.cancel();
      return e.releaseLock(), await t, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
i(Wo, "ReadableStreamToAsyncIterable");

// node_modules/openai/streaming.mjs
var Re = class s {
  static {
    i(this, "Stream");
  }
  constructor(e, t) {
    this.iterator = e, this.controller = t;
  }
  static fromSSEResponse(e, t) {
    let r = !1;
    async function* n() {
      if (r)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      r = !0;
      let o = !1;
      try {
        for await (let a of lc(e, t))
          if (!o) {
            if (a.data.startsWith("[DONE]")) {
              o = !0;
              continue;
            }
            if (a.event === null || a.event.startsWith("response.") || a.event.startsWith("transcript.")) {
              let l;
              try {
                l = JSON.parse(a.data);
              } catch (u) {
                throw console.error("Could not parse message into JSON:", a.data), console.error("From chunk:", a.raw), u;
              }
              if (l && l.error)
                throw new J(void 0, l.error, void 0, Jo(e.headers));
              yield l;
            } else {
              let l;
              try {
                l = JSON.parse(a.data);
              } catch (u) {
                throw console.error("Could not parse message into JSON:", a.data), console.error("From chunk:", a.raw), u;
              }
              if (a.event == "error")
                throw new J(void 0, l.error, l.message, void 0);
              yield { event: a.event, data: l };
            }
          }
        o = !0;
      } catch (a) {
        if (a instanceof Error && a.name === "AbortError")
          return;
        throw a;
      } finally {
        o || t.abort();
      }
    }
    return i(n, "iterator"), new s(n, t);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(e, t) {
    let r = !1;
    async function* n() {
      let a = new vt(), l = Wo(e);
      for await (let u of l)
        for (let f of a.decode(u))
          yield f;
      for (let u of a.flush())
        yield u;
    }
    i(n, "iterLines");
    async function* o() {
      if (r)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      r = !0;
      let a = !1;
      try {
        for await (let l of n())
          a || l && (yield JSON.parse(l));
        a = !0;
      } catch (l) {
        if (l instanceof Error && l.name === "AbortError")
          return;
        throw l;
      } finally {
        a || t.abort();
      }
    }
    return i(o, "iterator"), new s(o, t);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    let e = [], t = [], r = this.iterator(), n = /* @__PURE__ */ i((o) => ({
      next: /* @__PURE__ */ i(() => {
        if (o.length === 0) {
          let a = r.next();
          e.push(a), t.push(a);
        }
        return o.shift();
      }, "next")
    }), "teeIterator");
    return [
      new s(() => n(e), this.controller),
      new s(() => n(t), this.controller)
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    let e = this, t, r = new TextEncoder();
    return new Lo({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(n) {
        try {
          let { value: o, done: a } = await t.next();
          if (a)
            return n.close();
          let l = r.encode(JSON.stringify(o) + `
`);
          n.enqueue(l);
        } catch (o) {
          n.error(o);
        }
      },
      async cancel() {
        await t.return?.();
      }
    });
  }
};
async function* lc(s, e) {
  if (!s.body)
    throw e.abort(), new b("Attempted to iterate over a response with no body");
  let t = new Ho(), r = new vt(), n = Wo(s.body);
  for await (let o of cc(n))
    for (let a of r.decode(o)) {
      let l = t.decode(a);
      l && (yield l);
    }
  for (let o of r.flush()) {
    let a = t.decode(o);
    a && (yield a);
  }
}
i(lc, "_iterSSEMessages");
async function* cc(s) {
  let e = new Uint8Array();
  for await (let t of s) {
    if (t == null)
      continue;
    let r = t instanceof ArrayBuffer ? new Uint8Array(t) : typeof t == "string" ? new TextEncoder().encode(t) : t, n = new Uint8Array(e.length + r.length);
    n.set(e), n.set(r, e.length), e = n;
    let o;
    for (; (o = Sa(e)) !== -1; )
      yield e.slice(0, o), e = e.slice(o);
  }
  e.length > 0 && (yield e);
}
i(cc, "iterSSEChunks");
var Ho = class {
  static {
    i(this, "SSEDecoder");
  }
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length)
        return null;
      let o = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], o;
    }
    if (this.chunks.push(e), e.startsWith(":"))
      return null;
    let [t, r, n] = uc(e, ":");
    return n.startsWith(" ") && (n = n.substring(1)), t === "event" ? this.event = n : t === "data" && this.data.push(n), null;
  }
};
function uc(s, e) {
  let t = s.indexOf(e);
  return t !== -1 ? [s.substring(0, t), e, s.substring(t + e.length)] : [s, "", ""];
}
i(uc, "partition");

// node_modules/openai/uploads.mjs
var Ra = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.url == "string" && typeof s.blob == "function", "isResponseLike"), Ia = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.name == "string" && typeof s.lastModified == "number" && Ns(s), "isFileLike"), Ns = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s.size == "number" && typeof s.type == "string" && typeof s.text == "function" && typeof s.slice == "function" && typeof s.arrayBuffer == "function", "isBlobLike"), fc = /* @__PURE__ */ i((s) => Ia(s) || Ra(s) || Do(s), "isUploadable");
async function Ko(s, e, t) {
  if (s = await s, Ia(s))
    return s;
  if (Ra(s)) {
    let n = await s.blob();
    e || (e = new URL(s.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
    let o = Ns(n) ? [await n.arrayBuffer()] : [n];
    return new On(o, e, t);
  }
  let r = await hc(s);
  if (e || (e = pc(s) ?? "unknown_file"), !t?.type) {
    let n = r[0]?.type;
    typeof n == "string" && (t = { ...t, type: n });
  }
  return new On(r, e, t);
}
i(Ko, "toFile");
async function hc(s) {
  let e = [];
  if (typeof s == "string" || ArrayBuffer.isView(s) || // includes Uint8Array, Buffer, etc.
  s instanceof ArrayBuffer)
    e.push(s);
  else if (Ns(s))
    e.push(await s.arrayBuffer());
  else if (mc(s))
    for await (let t of s)
      e.push(t);
  else
    throw new Error(`Unexpected data type: ${typeof s}; constructor: ${s?.constructor?.name}; props: ${dc(s)}`);
  return e;
}
i(hc, "getBytes");
function dc(s) {
  return `[${Object.getOwnPropertyNames(s).map((t) => `"${t}"`).join(", ")}]`;
}
i(dc, "propsForError");
function pc(s) {
  return Xo(s.name) || Xo(s.filename) || // For fs.ReadStream
  Xo(s.path)?.split(/[\\/]/).pop();
}
i(pc, "getName");
var Xo = /* @__PURE__ */ i((s) => {
  if (typeof s == "string")
    return s;
  if (typeof Buffer < "u" && s instanceof Buffer)
    return String(s);
}, "getStringFromMaybeBuffer"), mc = /* @__PURE__ */ i((s) => s != null && typeof s == "object" && typeof s[Symbol.asyncIterator] == "function", "isAsyncIterableIterator"), Go = /* @__PURE__ */ i((s) => s && typeof s == "object" && s.body && s[Symbol.toStringTag] === "MultipartBody", "isMultipartBody");
var te = /* @__PURE__ */ i(async (s) => {
  let e = await Ea(s.body);
  return jo(e, s);
}, "multipartFormRequestOptions"), Ea = /* @__PURE__ */ i(async (s) => {
  let e = new Bo();
  return await Promise.all(Object.entries(s || {}).map(([t, r]) => Vo(e, t, r))), e;
}, "createForm");
var Vo = /* @__PURE__ */ i(async (s, e, t) => {
  if (t !== void 0) {
    if (t == null)
      throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
      s.append(e, String(t));
    else if (fc(t)) {
      let r = await Ko(t);
      s.append(e, r);
    } else if (Array.isArray(t))
      await Promise.all(t.map((r) => Vo(s, e + "[]", r)));
    else if (typeof t == "object")
      await Promise.all(Object.entries(t).map(([r, n]) => Vo(s, `${e}[${r}]`, n)));
    else
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`);
  }
}, "addFormValue");

// node_modules/openai/core.mjs
var _c = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, yc = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, Fn;
qo();
async function $a(s) {
  let { response: e } = s;
  if (s.options.stream)
    return De("response", e.status, e.url, e.headers, e.body), s.options.__streamClass ? s.options.__streamClass.fromSSEResponse(e, s.controller) : Re.fromSSEResponse(e, s.controller);
  if (e.status === 204)
    return null;
  if (s.options.__binaryResponse)
    return e;
  let r = e.headers.get("content-type")?.split(";")[0]?.trim();
  if (r?.includes("application/json") || r?.endsWith("+json")) {
    let a = await e.json();
    return De("response", e.status, e.url, e.headers, a), va(a, e);
  }
  let o = await e.text();
  return De("response", e.status, e.url, e.headers, o), o;
}
i($a, "defaultParseResponse");
function va(s, e) {
  return !s || typeof s != "object" || Array.isArray(s) ? s : Object.defineProperty(s, "_request_id", {
    value: e.headers.get("x-request-id"),
    enumerable: !1
  });
}
i(va, "_addRequestID");
var Bn = class s extends Promise {
  static {
    i(this, "APIPromise");
  }
  constructor(e, t = $a) {
    super((r) => {
      r(null);
    }), this.responsePromise = e, this.parseResponse = t;
  }
  _thenUnwrap(e) {
    return new s(this.responsePromise, async (t) => va(e(await this.parseResponse(t), t), t.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  asResponse() {
    return this.responsePromise.then((e) => e.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the X-Request-ID header which is useful for debugging requests and reporting
   * issues to OpenAI.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  async withResponse() {
    let [e, t] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: e, response: t, request_id: t.headers.get("x-request-id") };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then(this.parseResponse)), this.parsedPromise;
  }
  then(e, t) {
    return this.parse().then(e, t);
  }
  catch(e) {
    return this.parse().catch(e);
  }
  finally(e) {
    return this.parse().finally(e);
  }
}, Ln = class {
  static {
    i(this, "APIClient");
  }
  constructor({
    baseURL: e,
    maxRetries: t = 2,
    timeout: r = 6e5,
    // 10 minutes
    httpAgent: n,
    fetch: o
  }) {
    this.baseURL = e, this.maxRetries = Qo("maxRetries", t), this.timeout = Qo("timeout", r), this.httpAgent = n, this.fetch = o ?? No;
  }
  authHeaders(e) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(e) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.getUserAgent(),
      ...Ac(),
      ...this.authHeaders(e)
    };
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(e, t) {
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${Ic()}`;
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, r) {
    return this.request(Promise.resolve(r).then(async (n) => {
      let o = n && Ns(n?.body) ? new DataView(await n.body.arrayBuffer()) : n?.body instanceof DataView ? n.body : n?.body instanceof ArrayBuffer ? new DataView(n.body) : n && ArrayBuffer.isView(n?.body) ? new DataView(n.body.buffer) : n?.body;
      return { method: e, path: t, ...n, body: o };
    }));
  }
  getAPIList(e, t, r) {
    return this.requestAPIList(t, { method: "get", path: e, ...r });
  }
  calculateContentLength(e) {
    if (typeof e == "string") {
      if (typeof Buffer < "u")
        return Buffer.byteLength(e, "utf8").toString();
      if (typeof TextEncoder < "u")
        return new TextEncoder().encode(e).length.toString();
    } else if (ArrayBuffer.isView(e))
      return e.byteLength.toString();
    return null;
  }
  buildRequest(e, { retryCount: t = 0 } = {}) {
    let r = { ...e }, { method: n, path: o, query: a, headers: l = {} } = r, u = ArrayBuffer.isView(r.body) || r.__binaryRequest && typeof r.body == "string" ? r.body : Go(r.body) ? r.body.body : r.body ? JSON.stringify(r.body, null, 2) : null, f = this.calculateContentLength(u), y = this.buildURL(o, a);
    "timeout" in r && Qo("timeout", r.timeout), r.timeout = r.timeout ?? this.timeout;
    let h = r.httpAgent ?? this.httpAgent ?? Uo(y), m = r.timeout + 1e3;
    typeof h?.options?.timeout == "number" && m > (h.options.timeout ?? 0) && (h.options.timeout = m), this.idempotencyHeader && n !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), l[this.idempotencyHeader] = e.idempotencyKey);
    let d = this.buildHeaders({ options: r, headers: l, contentLength: f, retryCount: t });
    return { req: {
      method: n,
      ...u && { body: u },
      headers: d,
      ...h && { agent: h },
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: r.signal ?? null
    }, url: y, timeout: r.timeout };
  }
  buildHeaders({ options: e, headers: t, contentLength: r, retryCount: n }) {
    let o = {};
    r && (o["content-length"] = r);
    let a = this.defaultHeaders(e);
    return Ta(o, a), Ta(o, t), Go(e.body) && Mt !== "node" && delete o["content-type"], Nn(a, "x-stainless-retry-count") === void 0 && Nn(t, "x-stainless-retry-count") === void 0 && (o["x-stainless-retry-count"] = String(n)), Nn(a, "x-stainless-timeout") === void 0 && Nn(t, "x-stainless-timeout") === void 0 && e.timeout && (o["x-stainless-timeout"] = String(Math.trunc(e.timeout / 1e3))), this.validateHeaders(o, t), o;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(e) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(e, { url: t, options: r }) {
  }
  parseHeaders(e) {
    return e ? Symbol.iterator in e ? Object.fromEntries(Array.from(e).map((t) => [...t])) : { ...e } : {};
  }
  makeStatusError(e, t, r, n) {
    return J.generate(e, t, r, n);
  }
  request(e, t = null) {
    return new Bn(this.makeRequest(e, t));
  }
  async makeRequest(e, t) {
    let r = await e, n = r.maxRetries ?? this.maxRetries;
    t == null && (t = n), await this.prepareOptions(r);
    let { req: o, url: a, timeout: l } = this.buildRequest(r, { retryCount: n - t });
    if (await this.prepareRequest(o, { url: a, options: r }), De("request", a, r, o.headers), r.signal?.aborted)
      throw new D();
    let u = new AbortController(), f = await this.fetchWithTimeout(a, o, l, u).catch($n);
    if (f instanceof Error) {
      if (r.signal?.aborted)
        throw new D();
      if (t)
        return this.retryRequest(r, t);
      throw f.name === "AbortError" ? new st() : new rt({ cause: f });
    }
    let y = Jo(f.headers);
    if (!f.ok) {
      if (t && this.shouldRetry(f)) {
        let T = `retrying, ${t} attempts remaining`;
        return De(`response (error; ${T})`, f.status, a, y), this.retryRequest(r, t, y);
      }
      let h = await f.text().catch((T) => $n(T).message), m = Pc(h), d = m ? void 0 : h;
      throw De(`response (error; ${t ? "(error; no more retries left)" : "(error; not retryable)"})`, f.status, a, y, d), this.makeStatusError(f.status, m, d, y);
    }
    return { response: f, options: r, controller: u };
  }
  requestAPIList(e, t) {
    let r = this.makeRequest(t, null);
    return new zo(this, r, e);
  }
  buildURL(e, t) {
    let r = Rc(e) ? new URL(e) : new URL(this.baseURL + (this.baseURL.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), n = this.defaultQuery();
    return Fa(n) || (t = { ...n, ...t }), typeof t == "object" && t && !Array.isArray(t) && (r.search = this.stringifyQuery(t)), r.toString();
  }
  stringifyQuery(e) {
    return Object.entries(e).filter(([t, r]) => typeof r < "u").map(([t, r]) => {
      if (typeof r == "string" || typeof r == "number" || typeof r == "boolean")
        return `${encodeURIComponent(t)}=${encodeURIComponent(r)}`;
      if (r === null)
        return `${encodeURIComponent(t)}=`;
      throw new b(`Cannot stringify type ${typeof r}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  async fetchWithTimeout(e, t, r, n) {
    let { signal: o, ...a } = t || {};
    o && o.addEventListener("abort", () => n.abort());
    let l = setTimeout(() => n.abort(), r), u = {
      signal: n.signal,
      ...a
    };
    return u.method && (u.method = u.method.toUpperCase()), // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
    this.fetch.call(void 0, e, u).finally(() => {
      clearTimeout(l);
    });
  }
  shouldRetry(e) {
    let t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, r) {
    let n, o = r?.["retry-after-ms"];
    if (o) {
      let l = parseFloat(o);
      Number.isNaN(l) || (n = l);
    }
    let a = r?.["retry-after"];
    if (a && !n) {
      let l = parseFloat(a);
      Number.isNaN(l) ? n = Date.parse(a) - Date.now() : n = l * 1e3;
    }
    if (!(n && 0 <= n && n < 60 * 1e3)) {
      let l = e.maxRetries ?? this.maxRetries;
      n = this.calculateDefaultRetryTimeoutMillis(t, l);
    }
    return await qe(n), this.makeRequest(e, t - 1);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    let o = t - e, a = Math.min(0.5 * Math.pow(2, o), 8), l = 1 - Math.random() * 0.25;
    return a * l * 1e3;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${Tt}`;
  }
}, Bs = class {
  static {
    i(this, "AbstractPage");
  }
  constructor(e, t, r, n) {
    Fn.set(this, void 0), _c(this, Fn, e, "f"), this.options = n, this.response = t, this.body = r;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageInfo() != null : !1;
  }
  async getNextPage() {
    let e = this.nextPageInfo();
    if (!e)
      throw new b("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    let t = { ...this.options };
    if ("params" in e && typeof t.query == "object")
      t.query = { ...t.query, ...e.params };
    else if ("url" in e) {
      let r = [...Object.entries(t.query || {}), ...e.url.searchParams.entries()];
      for (let [n, o] of r)
        e.url.searchParams.set(n, o);
      t.query = void 0, t.path = e.url.toString();
    }
    return await yc(this, Fn, "f").requestAPIList(this.constructor, t);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(Fn = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (let e of this.iterPages())
      for (let t of e.getPaginatedItems())
        yield t;
  }
}, zo = class extends Bn {
  static {
    i(this, "PagePromise");
  }
  constructor(e, t, r) {
    super(t, async (n) => new r(e, n.response, await $a(n), n.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    let e = await this;
    for await (let t of e)
      yield t;
  }
}, Jo = /* @__PURE__ */ i((s) => new Proxy(Object.fromEntries(
  // @ts-ignore
  s.entries()
), {
  get(e, t) {
    let r = t.toString();
    return e[r.toLowerCase()] || e[r];
  }
}), "createResponseHeaders"), wc = {
  method: !0,
  path: !0,
  query: !0,
  body: !0,
  headers: !0,
  maxRetries: !0,
  stream: !0,
  timeout: !0,
  httpAgent: !0,
  signal: !0,
  idempotencyKey: !0,
  __metadata: !0,
  __binaryRequest: !0,
  __binaryResponse: !0,
  __streamClass: !0
}, E = /* @__PURE__ */ i((s) => typeof s == "object" && s !== null && !Fa(s) && Object.keys(s).every((e) => Na(wc, e)), "isRequestOptions"), bc = /* @__PURE__ */ i(() => {
  if (typeof Deno < "u" && Deno.build != null)
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Tt,
      "X-Stainless-OS": ka(Deno.build.os),
      "X-Stainless-Arch": Ca(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  if (typeof EdgeRuntime < "u")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Tt,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": process.version
    };
  if (Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Tt,
      "X-Stainless-OS": ka(process.platform),
      "X-Stainless-Arch": Ca(process.arch),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": process.version
    };
  let s = xc();
  return s ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Tt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${s.browser}`,
    "X-Stainless-Runtime-Version": s.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Tt,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function xc() {
  if (typeof navigator > "u" || !navigator)
    return null;
  let s = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (let { key: e, pattern: t } of s) {
    let r = t.exec(navigator.userAgent);
    if (r) {
      let n = r[1] || 0, o = r[2] || 0, a = r[3] || 0;
      return { browser: e, version: `${n}.${o}.${a}` };
    }
  }
  return null;
}
i(xc, "getBrowserInfo");
var Ca = /* @__PURE__ */ i((s) => s === "x32" ? "x32" : s === "x86_64" || s === "x64" ? "x64" : s === "arm" ? "arm" : s === "aarch64" || s === "arm64" ? "arm64" : s ? `other:${s}` : "unknown", "normalizeArch"), ka = /* @__PURE__ */ i((s) => (s = s.toLowerCase(), s.includes("ios") ? "iOS" : s === "android" ? "Android" : s === "darwin" ? "MacOS" : s === "win32" ? "Windows" : s === "freebsd" ? "FreeBSD" : s === "openbsd" ? "OpenBSD" : s === "linux" ? "Linux" : s ? `Other:${s}` : "Unknown"), "normalizePlatform"), Oa, Ac = /* @__PURE__ */ i(() => Oa ?? (Oa = bc()), "getPlatformHeaders"), Pc = /* @__PURE__ */ i((s) => {
  try {
    return JSON.parse(s);
  } catch {
    return;
  }
}, "safeJSON"), Sc = /^[a-z][a-z0-9+.-]*:/i, Rc = /* @__PURE__ */ i((s) => Sc.test(s), "isAbsoluteURL"), qe = /* @__PURE__ */ i((s) => new Promise((e) => setTimeout(e, s)), "sleep"), Qo = /* @__PURE__ */ i((s, e) => {
  if (typeof e != "number" || !Number.isInteger(e))
    throw new b(`${s} must be an integer`);
  if (e < 0)
    throw new b(`${s} must be a positive integer`);
  return e;
}, "validatePositiveInteger"), $n = /* @__PURE__ */ i((s) => {
  if (s instanceof Error)
    return s;
  if (typeof s == "object" && s !== null)
    try {
      return new Error(JSON.stringify(s));
    } catch {
    }
  return new Error(s);
}, "castToError");
var Ls = /* @__PURE__ */ i((s) => {
  if (typeof process < "u")
    return process.env?.[s]?.trim() ?? void 0;
  if (typeof Deno < "u")
    return Deno.env?.get?.(s)?.trim();
}, "readEnv");
function Fa(s) {
  if (!s)
    return !0;
  for (let e in s)
    return !1;
  return !0;
}
i(Fa, "isEmptyObj");
function Na(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
i(Na, "hasOwn");
function Ta(s, e) {
  for (let t in e) {
    if (!Na(e, t))
      continue;
    let r = t.toLowerCase();
    if (!r)
      continue;
    let n = e[t];
    n === null ? delete s[r] : n !== void 0 && (s[r] = n);
  }
}
i(Ta, "applyHeadersMut");
var Ma = /* @__PURE__ */ new Set(["authorization", "api-key"]);
function De(s, ...e) {
  if (typeof process < "u" && process?.env?.DEBUG === "true") {
    let t = e.map((r) => {
      if (!r)
        return r;
      if (r.headers) {
        let o = { ...r, headers: { ...r.headers } };
        for (let a in r.headers)
          Ma.has(a.toLowerCase()) && (o.headers[a] = "REDACTED");
        return o;
      }
      let n = null;
      for (let o in r)
        Ma.has(o.toLowerCase()) && (n ?? (n = { ...r }), n[o] = "REDACTED");
      return n ?? r;
    });
    console.log(`OpenAI:DEBUG:${s}`, ...t);
  }
}
i(De, "debug");
var Ic = /* @__PURE__ */ i(() => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
  let e = Math.random() * 16 | 0;
  return (s === "x" ? e : e & 3 | 8).toString(16);
}), "uuid4"), Ba = /* @__PURE__ */ i(() => (
  // @ts-ignore
  typeof window < "u" && // @ts-ignore
  typeof window.document < "u" && // @ts-ignore
  typeof navigator < "u"
), "isRunningInBrowser"), Ec = /* @__PURE__ */ i((s) => typeof s?.get == "function", "isHeadersProtocol");
var Nn = /* @__PURE__ */ i((s, e) => {
  let t = e.toLowerCase();
  if (Ec(s)) {
    let r = e[0]?.toUpperCase() + e.substring(1).replace(/([^\w])(\w)/g, (n, o, a) => o + a.toUpperCase());
    for (let n of [e, t, e.toUpperCase(), r]) {
      let o = s.get(n);
      if (o)
        return o;
    }
  }
  for (let [r, n] of Object.entries(s))
    if (r.toLowerCase() === t)
      return Array.isArray(n) ? (n.length <= 1 || console.warn(`Received ${n.length} entries for the ${e} header, using the first entry.`), n[0]) : n;
}, "getHeader");
var La = /* @__PURE__ */ i((s) => {
  if (typeof Buffer < "u") {
    let e = Buffer.from(s, "base64");
    return Array.from(new Float32Array(e.buffer, e.byteOffset, e.length / Float32Array.BYTES_PER_ELEMENT));
  } else {
    let e = atob(s), t = e.length, r = new Uint8Array(t);
    for (let n = 0; n < t; n++)
      r[n] = e.charCodeAt(n);
    return Array.from(new Float32Array(r.buffer));
  }
}, "toFloat32Array");
function js(s) {
  return s != null && typeof s == "object" && !Array.isArray(s);
}
i(js, "isObj");

// node_modules/openai/pagination.mjs
var Ie = class extends Bs {
  static {
    i(this, "Page");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.object = r.object;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  // @deprecated Please use `nextPageInfo()` instead
  /**
   * This page represents a response that isn't actually paginated at the API level
   * so there will never be any next page params.
   */
  nextPageParams() {
    return null;
  }
  nextPageInfo() {
    return null;
  }
}, k = class extends Bs {
  static {
    i(this, "CursorPage");
  }
  constructor(e, t, r, n) {
    super(e, t, r, n), this.data = r.data || [], this.has_more = r.has_more || !1;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    let e = this.nextPageInfo();
    if (!e)
      return null;
    if ("params" in e)
      return e.params;
    let t = Object.fromEntries(e.url.searchParams);
    return Object.keys(t).length ? t : null;
  }
  nextPageInfo() {
    let e = this.getPaginatedItems();
    if (!e.length)
      return null;
    let t = e[e.length - 1]?.id;
    return t ? { params: { after: t } } : null;
  }
};

// node_modules/openai/resource.mjs
var p = class {
  static {
    i(this, "APIResource");
  }
  constructor(e) {
    this._client = e;
  }
};

// node_modules/openai/resources/chat/completions/messages.mjs
var Rr = class extends p {
  static {
    i(this, "Messages");
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/chat/completions/${e}/messages`, jn, { query: t, ...r });
  }
};

// node_modules/openai/resources/chat/completions/completions.mjs
var nt = class extends p {
  static {
    i(this, "Completions");
  }
  constructor() {
    super(...arguments), this.messages = new Rr(this._client);
  }
  create(e, t) {
    return this._client.post("/chat/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
  /**
   * Get a stored chat completion. Only Chat Completions that have been created with
   * the `store` parameter set to `true` will be returned.
   *
   * @example
   * ```ts
   * const chatCompletion =
   *   await client.chat.completions.retrieve('completion_id');
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/chat/completions/${e}`, t);
  }
  /**
   * Modify a stored chat completion. Only Chat Completions that have been created
   * with the `store` parameter set to `true` can be modified. Currently, the only
   * supported modification is to update the `metadata` field.
   *
   * @example
   * ```ts
   * const chatCompletion = await client.chat.completions.update(
   *   'completion_id',
   *   { metadata: { foo: 'string' } },
   * );
   * ```
   */
  update(e, t, r) {
    return this._client.post(`/chat/completions/${e}`, { body: t, ...r });
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/chat/completions", ot, { query: e, ...t });
  }
  /**
   * Delete a stored chat completion. Only Chat Completions that have been created
   * with the `store` parameter set to `true` can be deleted.
   *
   * @example
   * ```ts
   * const chatCompletionDeleted =
   *   await client.chat.completions.del('completion_id');
   * ```
   */
  del(e, t) {
    return this._client.delete(`/chat/completions/${e}`, t);
  }
}, ot = class extends k {
  static {
    i(this, "ChatCompletionsPage");
  }
}, jn = class extends k {
  static {
    i(this, "ChatCompletionStoreMessagesPage");
  }
};
nt.ChatCompletionsPage = ot;
nt.Messages = Rr;

// node_modules/openai/resources/chat/chat.mjs
var He = class extends p {
  static {
    i(this, "Chat");
  }
  constructor() {
    super(...arguments), this.completions = new nt(this._client);
  }
};
He.Completions = nt;
He.ChatCompletionsPage = ot;

// node_modules/openai/resources/audio/speech.mjs
var Ir = class extends p {
  static {
    i(this, "Speech");
  }
  /**
   * Generates audio from the input text.
   *
   * @example
   * ```ts
   * const speech = await client.audio.speech.create({
   *   input: 'input',
   *   model: 'string',
   *   voice: 'ash',
   * });
   *
   * const content = await speech.blob();
   * console.log(content);
   * ```
   */
  create(e, t) {
    return this._client.post("/audio/speech", {
      body: e,
      ...t,
      headers: { Accept: "application/octet-stream", ...t?.headers },
      __binaryResponse: !0
    });
  }
};

// node_modules/openai/resources/audio/transcriptions.mjs
var Er = class extends p {
  static {
    i(this, "Transcriptions");
  }
  create(e, t) {
    return this._client.post("/audio/transcriptions", te({
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __metadata: { model: e.model }
    }));
  }
};

// node_modules/openai/resources/audio/translations.mjs
var Cr = class extends p {
  static {
    i(this, "Translations");
  }
  create(e, t) {
    return this._client.post("/audio/translations", te({ body: e, ...t, __metadata: { model: e.model } }));
  }
};

// node_modules/openai/resources/audio/audio.mjs
var Ee = class extends p {
  static {
    i(this, "Audio");
  }
  constructor() {
    super(...arguments), this.transcriptions = new Er(this._client), this.translations = new Cr(this._client), this.speech = new Ir(this._client);
  }
};
Ee.Transcriptions = Er;
Ee.Translations = Cr;
Ee.Speech = Ir;

// node_modules/openai/resources/batches.mjs
var it = class extends p {
  static {
    i(this, "Batches");
  }
  /**
   * Creates and executes a batch from an uploaded file of requests
   */
  create(e, t) {
    return this._client.post("/batches", { body: e, ...t });
  }
  /**
   * Retrieves a batch.
   */
  retrieve(e, t) {
    return this._client.get(`/batches/${e}`, t);
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/batches", Ft, { query: e, ...t });
  }
  /**
   * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
   * 10 minutes, before changing to `cancelled`, where it will have partial results
   * (if any) available in the output file.
   */
  cancel(e, t) {
    return this._client.post(`/batches/${e}/cancel`, t);
  }
}, Ft = class extends k {
  static {
    i(this, "BatchesPage");
  }
};
it.BatchesPage = Ft;

// node_modules/openai/lib/EventStream.mjs
var _e = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, j = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, Yo, Un, Dn, Us, Ds, qn, qs, Je, Ws, Wn, Hn, kr, ja, at = class {
  static {
    i(this, "EventStream");
  }
  constructor() {
    Yo.add(this), this.controller = new AbortController(), Un.set(this, void 0), Dn.set(this, () => {
    }), Us.set(this, () => {
    }), Ds.set(this, void 0), qn.set(this, () => {
    }), qs.set(this, () => {
    }), Je.set(this, {}), Ws.set(this, !1), Wn.set(this, !1), Hn.set(this, !1), kr.set(this, !1), _e(this, Un, new Promise((e, t) => {
      _e(this, Dn, e, "f"), _e(this, Us, t, "f");
    }), "f"), _e(this, Ds, new Promise((e, t) => {
      _e(this, qn, e, "f"), _e(this, qs, t, "f");
    }), "f"), j(this, Un, "f").catch(() => {
    }), j(this, Ds, "f").catch(() => {
    });
  }
  _run(e) {
    setTimeout(() => {
      e().then(() => {
        this._emitFinal(), this._emit("end");
      }, j(this, Yo, "m", ja).bind(this));
    }, 0);
  }
  _connected() {
    this.ended || (j(this, Dn, "f").call(this), this._emit("connect"));
  }
  get ended() {
    return j(this, Ws, "f");
  }
  get errored() {
    return j(this, Wn, "f");
  }
  get aborted() {
    return j(this, Hn, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  on(e, t) {
    return (j(this, Je, "f")[e] || (j(this, Je, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  off(e, t) {
    let r = j(this, Je, "f")[e];
    if (!r)
      return this;
    let n = r.findIndex((o) => o.listener === t);
    return n >= 0 && r.splice(n, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  once(e, t) {
    return (j(this, Je, "f")[e] || (j(this, Je, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, r) => {
      _e(this, kr, !0, "f"), e !== "error" && this.once("error", r), this.once(e, t);
    });
  }
  async done() {
    _e(this, kr, !0, "f"), await j(this, Ds, "f");
  }
  _emit(e, ...t) {
    if (j(this, Ws, "f"))
      return;
    e === "end" && (_e(this, Ws, !0, "f"), j(this, qn, "f").call(this));
    let r = j(this, Je, "f")[e];
    if (r && (j(this, Je, "f")[e] = r.filter((n) => !n.once), r.forEach(({ listener: n }) => n(...t))), e === "abort") {
      let n = t[0];
      !j(this, kr, "f") && !r?.length && Promise.reject(n), j(this, Us, "f").call(this, n), j(this, qs, "f").call(this, n), this._emit("end");
      return;
    }
    if (e === "error") {
      let n = t[0];
      !j(this, kr, "f") && !r?.length && Promise.reject(n), j(this, Us, "f").call(this, n), j(this, qs, "f").call(this, n), this._emit("end");
    }
  }
  _emitFinal() {
  }
};
Un = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), Us = /* @__PURE__ */ new WeakMap(), Ds = /* @__PURE__ */ new WeakMap(), qn = /* @__PURE__ */ new WeakMap(), qs = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakMap(), Ws = /* @__PURE__ */ new WeakMap(), Wn = /* @__PURE__ */ new WeakMap(), Hn = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), Yo = /* @__PURE__ */ new WeakSet(), ja = /* @__PURE__ */ i(function(e) {
  if (_e(this, Wn, !0, "f"), e instanceof Error && e.name === "AbortError" && (e = new D()), e instanceof D)
    return _e(this, Hn, !0, "f"), this._emit("abort", e);
  if (e instanceof b)
    return this._emit("error", e);
  if (e instanceof Error) {
    let t = new b(e.message);
    return t.cause = e, this._emit("error", t);
  }
  return this._emit("error", new b(String(e)));
}, "_EventStream_handleError");

// node_modules/openai/lib/AssistantStream.mjs
var P = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, ae = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, Z, Zo, Ce, Jn, ye, Bt, Or, Nt, Kn, le, Xn, Vn, Xs, Hs, Js, Ua, Da, qa, Wa, Ha, Ja, Xa, ke = class s extends at {
  static {
    i(this, "AssistantStream");
  }
  constructor() {
    super(...arguments), Z.add(this), Zo.set(this, []), Ce.set(this, {}), Jn.set(this, {}), ye.set(this, void 0), Bt.set(this, void 0), Or.set(this, void 0), Nt.set(this, void 0), Kn.set(this, void 0), le.set(this, void 0), Xn.set(this, void 0), Vn.set(this, void 0), Xs.set(this, void 0);
  }
  [(Zo = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap(), Jn = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Or = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap(), Kn = /* @__PURE__ */ new WeakMap(), le = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Vn = /* @__PURE__ */ new WeakMap(), Xs = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("event", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, a) => t.push({ resolve: o, reject: a })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  static fromReadableStream(e) {
    let t = new s();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), this._connected();
    let n = Re.fromReadableStream(e, this.controller);
    for await (let o of n)
      P(this, Z, "m", Hs).call(this, o);
    if (n.controller.signal?.aborted)
      throw new D();
    return this._addRun(P(this, Z, "m", Js).call(this));
  }
  toReadableStream() {
    return new Re(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
  static createToolAssistantStream(e, t, r, n, o) {
    let a = new s();
    return a._run(() => a._runToolAssistantStream(e, t, r, n, {
      ...o,
      headers: { ...o?.headers, "X-Stainless-Helper-Method": "stream" }
    })), a;
  }
  async _createToolAssistantStream(e, t, r, n, o) {
    let a = o?.signal;
    a && (a.aborted && this.controller.abort(), a.addEventListener("abort", () => this.controller.abort()));
    let l = { ...n, stream: !0 }, u = await e.submitToolOutputs(t, r, l, {
      ...o,
      signal: this.controller.signal
    });
    this._connected();
    for await (let f of u)
      P(this, Z, "m", Hs).call(this, f);
    if (u.controller.signal?.aborted)
      throw new D();
    return this._addRun(P(this, Z, "m", Js).call(this));
  }
  static createThreadAssistantStream(e, t, r) {
    let n = new s();
    return n._run(() => n._threadAssistantStream(e, t, {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" }
    })), n;
  }
  static createAssistantStream(e, t, r, n) {
    let o = new s();
    return o._run(() => o._runAssistantStream(e, t, r, {
      ...n,
      headers: { ...n?.headers, "X-Stainless-Helper-Method": "stream" }
    })), o;
  }
  currentEvent() {
    return P(this, Xn, "f");
  }
  currentRun() {
    return P(this, Vn, "f");
  }
  currentMessageSnapshot() {
    return P(this, ye, "f");
  }
  currentRunStepSnapshot() {
    return P(this, Xs, "f");
  }
  async finalRunSteps() {
    return await this.done(), Object.values(P(this, Ce, "f"));
  }
  async finalMessages() {
    return await this.done(), Object.values(P(this, Jn, "f"));
  }
  async finalRun() {
    if (await this.done(), !P(this, Bt, "f"))
      throw Error("Final run was not received.");
    return P(this, Bt, "f");
  }
  async _createThreadAssistantStream(e, t, r) {
    let n = r?.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort()));
    let o = { ...t, stream: !0 }, a = await e.createAndRun(o, { ...r, signal: this.controller.signal });
    this._connected();
    for await (let l of a)
      P(this, Z, "m", Hs).call(this, l);
    if (a.controller.signal?.aborted)
      throw new D();
    return this._addRun(P(this, Z, "m", Js).call(this));
  }
  async _createAssistantStream(e, t, r, n) {
    let o = n?.signal;
    o && (o.aborted && this.controller.abort(), o.addEventListener("abort", () => this.controller.abort()));
    let a = { ...r, stream: !0 }, l = await e.create(t, a, { ...n, signal: this.controller.signal });
    this._connected();
    for await (let u of l)
      P(this, Z, "m", Hs).call(this, u);
    if (l.controller.signal?.aborted)
      throw new D();
    return this._addRun(P(this, Z, "m", Js).call(this));
  }
  static accumulateDelta(e, t) {
    for (let [r, n] of Object.entries(t)) {
      if (!e.hasOwnProperty(r)) {
        e[r] = n;
        continue;
      }
      let o = e[r];
      if (o == null) {
        e[r] = n;
        continue;
      }
      if (r === "index" || r === "type") {
        e[r] = n;
        continue;
      }
      if (typeof o == "string" && typeof n == "string")
        o += n;
      else if (typeof o == "number" && typeof n == "number")
        o += n;
      else if (js(o) && js(n))
        o = this.accumulateDelta(o, n);
      else if (Array.isArray(o) && Array.isArray(n)) {
        if (o.every((a) => typeof a == "string" || typeof a == "number")) {
          o.push(...n);
          continue;
        }
        for (let a of n) {
          if (!js(a))
            throw new Error(`Expected array delta entry to be an object but got: ${a}`);
          let l = a.index;
          if (l == null)
            throw console.error(a), new Error("Expected array delta entry to have an `index` property");
          if (typeof l != "number")
            throw new Error(`Expected array delta entry \`index\` property to be a number but got ${l}`);
          let u = o[l];
          u == null ? o.push(a) : o[l] = this.accumulateDelta(u, a);
        }
        continue;
      } else
        throw Error(`Unhandled record type: ${r}, deltaValue: ${n}, accValue: ${o}`);
      e[r] = o;
    }
    return e;
  }
  _addRun(e) {
    return e;
  }
  async _threadAssistantStream(e, t, r) {
    return await this._createThreadAssistantStream(t, e, r);
  }
  async _runAssistantStream(e, t, r, n) {
    return await this._createAssistantStream(t, e, r, n);
  }
  async _runToolAssistantStream(e, t, r, n, o) {
    return await this._createToolAssistantStream(r, e, t, n, o);
  }
};
Hs = /* @__PURE__ */ i(function(e) {
  if (!this.ended)
    switch (ae(this, Xn, e, "f"), P(this, Z, "m", qa).call(this, e), e.event) {
      case "thread.created":
        break;
      case "thread.run.created":
      case "thread.run.queued":
      case "thread.run.in_progress":
      case "thread.run.requires_action":
      case "thread.run.completed":
      case "thread.run.incomplete":
      case "thread.run.failed":
      case "thread.run.cancelling":
      case "thread.run.cancelled":
      case "thread.run.expired":
        P(this, Z, "m", Xa).call(this, e);
        break;
      case "thread.run.step.created":
      case "thread.run.step.in_progress":
      case "thread.run.step.delta":
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        P(this, Z, "m", Da).call(this, e);
        break;
      case "thread.message.created":
      case "thread.message.in_progress":
      case "thread.message.delta":
      case "thread.message.completed":
      case "thread.message.incomplete":
        P(this, Z, "m", Ua).call(this, e);
        break;
      case "error":
        throw new Error("Encountered an error event in event processing - errors should be processed earlier");
      default:
    }
}, "_AssistantStream_addEvent"), Js = /* @__PURE__ */ i(function() {
  if (this.ended)
    throw new b("stream has ended, this shouldn't happen");
  if (!P(this, Bt, "f"))
    throw Error("Final run has not been received");
  return P(this, Bt, "f");
}, "_AssistantStream_endRequest"), Ua = /* @__PURE__ */ i(function(e) {
  let [t, r] = P(this, Z, "m", Ha).call(this, e, P(this, ye, "f"));
  ae(this, ye, t, "f"), P(this, Jn, "f")[t.id] = t;
  for (let n of r) {
    let o = t.content[n.index];
    o?.type == "text" && this._emit("textCreated", o.text);
  }
  switch (e.event) {
    case "thread.message.created":
      this._emit("messageCreated", e.data);
      break;
    case "thread.message.in_progress":
      break;
    case "thread.message.delta":
      if (this._emit("messageDelta", e.data.delta, t), e.data.delta.content)
        for (let n of e.data.delta.content) {
          if (n.type == "text" && n.text) {
            let o = n.text, a = t.content[n.index];
            if (a && a.type == "text")
              this._emit("textDelta", o, a.text);
            else
              throw Error("The snapshot associated with this text delta is not text or missing");
          }
          if (n.index != P(this, Or, "f")) {
            if (P(this, Nt, "f"))
              switch (P(this, Nt, "f").type) {
                case "text":
                  this._emit("textDone", P(this, Nt, "f").text, P(this, ye, "f"));
                  break;
                case "image_file":
                  this._emit("imageFileDone", P(this, Nt, "f").image_file, P(this, ye, "f"));
                  break;
              }
            ae(this, Or, n.index, "f");
          }
          ae(this, Nt, t.content[n.index], "f");
        }
      break;
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (P(this, Or, "f") !== void 0) {
        let n = e.data.content[P(this, Or, "f")];
        if (n)
          switch (n.type) {
            case "image_file":
              this._emit("imageFileDone", n.image_file, P(this, ye, "f"));
              break;
            case "text":
              this._emit("textDone", n.text, P(this, ye, "f"));
              break;
          }
      }
      P(this, ye, "f") && this._emit("messageDone", e.data), ae(this, ye, void 0, "f");
  }
}, "_AssistantStream_handleMessage"), Da = /* @__PURE__ */ i(function(e) {
  let t = P(this, Z, "m", Wa).call(this, e);
  switch (ae(this, Xs, t, "f"), e.event) {
    case "thread.run.step.created":
      this._emit("runStepCreated", e.data);
      break;
    case "thread.run.step.delta":
      let r = e.data.delta;
      if (r.step_details && r.step_details.type == "tool_calls" && r.step_details.tool_calls && t.step_details.type == "tool_calls")
        for (let o of r.step_details.tool_calls)
          o.index == P(this, Kn, "f") ? this._emit("toolCallDelta", o, t.step_details.tool_calls[o.index]) : (P(this, le, "f") && this._emit("toolCallDone", P(this, le, "f")), ae(this, Kn, o.index, "f"), ae(this, le, t.step_details.tool_calls[o.index], "f"), P(this, le, "f") && this._emit("toolCallCreated", P(this, le, "f")));
      this._emit("runStepDelta", e.data.delta, t);
      break;
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
      ae(this, Xs, void 0, "f"), e.data.step_details.type == "tool_calls" && P(this, le, "f") && (this._emit("toolCallDone", P(this, le, "f")), ae(this, le, void 0, "f")), this._emit("runStepDone", e.data, t);
      break;
    case "thread.run.step.in_progress":
      break;
  }
}, "_AssistantStream_handleRunStep"), qa = /* @__PURE__ */ i(function(e) {
  P(this, Zo, "f").push(e), this._emit("event", e);
}, "_AssistantStream_handleEvent"), Wa = /* @__PURE__ */ i(function(e) {
  switch (e.event) {
    case "thread.run.step.created":
      return P(this, Ce, "f")[e.data.id] = e.data, e.data;
    case "thread.run.step.delta":
      let t = P(this, Ce, "f")[e.data.id];
      if (!t)
        throw Error("Received a RunStepDelta before creation of a snapshot");
      let r = e.data;
      if (r.delta) {
        let n = ke.accumulateDelta(t, r.delta);
        P(this, Ce, "f")[e.data.id] = n;
      }
      return P(this, Ce, "f")[e.data.id];
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
    case "thread.run.step.in_progress":
      P(this, Ce, "f")[e.data.id] = e.data;
      break;
  }
  if (P(this, Ce, "f")[e.data.id])
    return P(this, Ce, "f")[e.data.id];
  throw new Error("No snapshot available");
}, "_AssistantStream_accumulateRunStep"), Ha = /* @__PURE__ */ i(function(e, t) {
  let r = [];
  switch (e.event) {
    case "thread.message.created":
      return [e.data, r];
    case "thread.message.delta":
      if (!t)
        throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
      let n = e.data;
      if (n.delta.content)
        for (let o of n.delta.content)
          if (o.index in t.content) {
            let a = t.content[o.index];
            t.content[o.index] = P(this, Z, "m", Ja).call(this, o, a);
          } else
            t.content[o.index] = o, r.push(o);
      return [t, r];
    case "thread.message.in_progress":
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (t)
        return [t, r];
      throw Error("Received thread message event with no existing snapshot");
  }
  throw Error("Tried to accumulate a non-message event");
}, "_AssistantStream_accumulateMessage"), Ja = /* @__PURE__ */ i(function(e, t) {
  return ke.accumulateDelta(t, e);
}, "_AssistantStream_accumulateContent"), Xa = /* @__PURE__ */ i(function(e) {
  switch (ae(this, Vn, e.data, "f"), e.event) {
    case "thread.run.created":
      break;
    case "thread.run.queued":
      break;
    case "thread.run.in_progress":
      break;
    case "thread.run.requires_action":
    case "thread.run.cancelled":
    case "thread.run.failed":
    case "thread.run.completed":
    case "thread.run.expired":
      ae(this, Bt, e.data, "f"), P(this, le, "f") && (this._emit("toolCallDone", P(this, le, "f")), ae(this, le, void 0, "f"));
      break;
    case "thread.run.cancelling":
      break;
  }
}, "_AssistantStream_handleRun");

// node_modules/openai/resources/beta/assistants.mjs
var Lt = class extends p {
  static {
    i(this, "Assistants");
  }
  /**
   * Create an assistant with a model and instructions.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.create({
   *   model: 'gpt-4o',
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/assistants", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Retrieves an assistant.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.retrieve(
   *   'assistant_id',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Modifies an assistant.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.update(
   *   'assistant_id',
   * );
   * ```
   */
  update(e, t, r) {
    return this._client.post(`/assistants/${e}`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/assistants", Tr, {
      query: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Delete an assistant.
   *
   * @example
   * ```ts
   * const assistantDeleted = await client.beta.assistants.del(
   *   'assistant_id',
   * );
   * ```
   */
  del(e, t) {
    return this._client.delete(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
}, Tr = class extends k {
  static {
    i(this, "AssistantsPage");
  }
};
Lt.AssistantsPage = Tr;

// node_modules/openai/lib/RunnableFunction.mjs
function ei(s) {
  return typeof s.parse == "function";
}
i(ei, "isRunnableFunctionWithParse");

// node_modules/openai/lib/chatCompletionUtils.mjs
var lt = /* @__PURE__ */ i((s) => s?.role === "assistant", "isAssistantMessage"), ti = /* @__PURE__ */ i((s) => s?.role === "function", "isFunctionMessage"), ri = /* @__PURE__ */ i((s) => s?.role === "tool", "isToolMessage");

// node_modules/openai/lib/parser.mjs
function Vs(s) {
  return s?.$brand === "auto-parseable-response-format";
}
i(Vs, "isAutoParsableResponseFormat");
function jt(s) {
  return s?.$brand === "auto-parseable-tool";
}
i(jt, "isAutoParsableTool");
function Va(s, e) {
  return !e || !si(e) ? {
    ...s,
    choices: s.choices.map((t) => ({
      ...t,
      message: {
        ...t.message,
        parsed: null,
        ...t.message.tool_calls ? {
          tool_calls: t.message.tool_calls
        } : void 0
      }
    }))
  } : Ks(s, e);
}
i(Va, "maybeParseChatCompletion");
function Ks(s, e) {
  let t = s.choices.map((r) => {
    if (r.finish_reason === "length")
      throw new Pr();
    if (r.finish_reason === "content_filter")
      throw new Sr();
    return {
      ...r,
      message: {
        ...r.message,
        ...r.message.tool_calls ? {
          tool_calls: r.message.tool_calls?.map((n) => Fc(e, n)) ?? void 0
        } : void 0,
        parsed: r.message.content && !r.message.refusal ? vc(e, r.message.content) : null
      }
    };
  });
  return { ...s, choices: t };
}
i(Ks, "parseChatCompletion");
function vc(s, e) {
  return s.response_format?.type !== "json_schema" ? null : s.response_format?.type === "json_schema" ? "$parseRaw" in s.response_format ? s.response_format.$parseRaw(e) : JSON.parse(e) : null;
}
i(vc, "parseResponseFormat");
function Fc(s, e) {
  let t = s.tools?.find((r) => r.function?.name === e.function.name);
  return {
    ...e,
    function: {
      ...e.function,
      parsed_arguments: jt(t) ? t.$parseRaw(e.function.arguments) : t?.function.strict ? JSON.parse(e.function.arguments) : null
    }
  };
}
i(Fc, "parseToolCall");
function Ka(s, e) {
  if (!s)
    return !1;
  let t = s.tools?.find((r) => r.function?.name === e.function.name);
  return jt(t) || t?.function.strict || !1;
}
i(Ka, "shouldParseToolCall");
function si(s) {
  return Vs(s.response_format) ? !0 : s.tools?.some((e) => jt(e) || e.type === "function" && e.function.strict === !0) ?? !1;
}
i(si, "hasAutoParseableInput");
function Ga(s) {
  for (let e of s ?? []) {
    if (e.type !== "function")
      throw new b(`Currently only \`function\` tool types support auto-parsing; Received \`${e.type}\``);
    if (e.function.strict !== !0)
      throw new b(`The \`${e.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
  }
}
i(Ga, "validateInputTools");

// node_modules/openai/lib/AbstractChatCompletionRunner.mjs
var re = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, ee, ni, Gn, oi, ii, ai, za, li, Qa = 10, Mr = class extends at {
  static {
    i(this, "AbstractChatCompletionRunner");
  }
  constructor() {
    super(...arguments), ee.add(this), this._chatCompletions = [], this.messages = [];
  }
  _addChatCompletion(e) {
    this._chatCompletions.push(e), this._emit("chatCompletion", e);
    let t = e.choices[0]?.message;
    return t && this._addMessage(t), e;
  }
  _addMessage(e, t = !0) {
    if ("content" in e || (e.content = null), this.messages.push(e), t) {
      if (this._emit("message", e), (ti(e) || ri(e)) && e.content)
        this._emit("functionCallResult", e.content);
      else if (lt(e) && e.function_call)
        this._emit("functionCall", e.function_call);
      else if (lt(e) && e.tool_calls)
        for (let r of e.tool_calls)
          r.type === "function" && this._emit("functionCall", r.function);
    }
  }
  /**
   * @returns a promise that resolves with the final ChatCompletion, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
   */
  async finalChatCompletion() {
    await this.done();
    let e = this._chatCompletions[this._chatCompletions.length - 1];
    if (!e)
      throw new b("stream ended without producing a ChatCompletion");
    return e;
  }
  /**
   * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalContent() {
    return await this.done(), re(this, ee, "m", ni).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalMessage() {
    return await this.done(), re(this, ee, "m", Gn).call(this);
  }
  /**
   * @returns a promise that resolves with the content of the final FunctionCall, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalFunctionCall() {
    return await this.done(), re(this, ee, "m", oi).call(this);
  }
  async finalFunctionCallResult() {
    return await this.done(), re(this, ee, "m", ii).call(this);
  }
  async totalUsage() {
    return await this.done(), re(this, ee, "m", ai).call(this);
  }
  allChatCompletions() {
    return [...this._chatCompletions];
  }
  _emitFinal() {
    let e = this._chatCompletions[this._chatCompletions.length - 1];
    e && this._emit("finalChatCompletion", e);
    let t = re(this, ee, "m", Gn).call(this);
    t && this._emit("finalMessage", t);
    let r = re(this, ee, "m", ni).call(this);
    r && this._emit("finalContent", r);
    let n = re(this, ee, "m", oi).call(this);
    n && this._emit("finalFunctionCall", n);
    let o = re(this, ee, "m", ii).call(this);
    o != null && this._emit("finalFunctionCallResult", o), this._chatCompletions.some((a) => a.usage) && this._emit("totalUsage", re(this, ee, "m", ai).call(this));
  }
  async _createChatCompletion(e, t, r) {
    let n = r?.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), re(this, ee, "m", za).call(this, t);
    let o = await e.chat.completions.create({ ...t, stream: !1 }, { ...r, signal: this.controller.signal });
    return this._connected(), this._addChatCompletion(Ks(o, t));
  }
  async _runChatCompletion(e, t, r) {
    for (let n of t.messages)
      this._addMessage(n, !1);
    return await this._createChatCompletion(e, t, r);
  }
  async _runFunctions(e, t, r) {
    let n = "function", { function_call: o = "auto", stream: a, ...l } = t, u = typeof o != "string" && o?.name, { maxChatCompletions: f = Qa } = r || {}, y = {};
    for (let m of t.functions)
      y[m.name || m.function.name] = m;
    let h = t.functions.map((m) => ({
      name: m.name || m.function.name,
      parameters: m.parameters,
      description: m.description
    }));
    for (let m of t.messages)
      this._addMessage(m, !1);
    for (let m = 0; m < f; ++m) {
      let A = (await this._createChatCompletion(e, {
        ...l,
        function_call: o,
        functions: h,
        messages: [...this.messages]
      }, r)).choices[0]?.message;
      if (!A)
        throw new b("missing message in ChatCompletion response");
      if (!A.function_call)
        return;
      let { name: w, arguments: T } = A.function_call, O = y[w];
      if (O) {
        if (u && u !== w) {
          let C = `Invalid function_call: ${JSON.stringify(w)}. ${JSON.stringify(u)} requested. Please try again`;
          this._addMessage({ role: n, name: w, content: C });
          continue;
        }
      } else {
        let C = `Invalid function_call: ${JSON.stringify(w)}. Available options are: ${h.map((v) => JSON.stringify(v.name)).join(", ")}. Please try again`;
        this._addMessage({ role: n, name: w, content: C });
        continue;
      }
      let g;
      try {
        g = ei(O) ? await O.parse(T) : T;
      } catch (C) {
        this._addMessage({
          role: n,
          name: w,
          content: C instanceof Error ? C.message : String(C)
        });
        continue;
      }
      let $ = await O.function(g, this), R = re(this, ee, "m", li).call(this, $);
      if (this._addMessage({ role: n, name: w, content: R }), u)
        return;
    }
  }
  async _runTools(e, t, r) {
    let n = "tool", { tool_choice: o = "auto", stream: a, ...l } = t, u = typeof o != "string" && o?.function?.name, { maxChatCompletions: f = Qa } = r || {}, y = t.tools.map((d) => {
      if (jt(d)) {
        if (!d.$callback)
          throw new b("Tool given to `.runTools()` that does not have an associated function");
        return {
          type: "function",
          function: {
            function: d.$callback,
            name: d.function.name,
            description: d.function.description || "",
            parameters: d.function.parameters,
            parse: d.$parseRaw,
            strict: !0
          }
        };
      }
      return d;
    }), h = {};
    for (let d of y)
      d.type === "function" && (h[d.function.name || d.function.function.name] = d.function);
    let m = "tools" in t ? y.map((d) => d.type === "function" ? {
      type: "function",
      function: {
        name: d.function.name || d.function.function.name,
        parameters: d.function.parameters,
        description: d.function.description,
        strict: d.function.strict
      }
    } : d) : void 0;
    for (let d of t.messages)
      this._addMessage(d, !1);
    for (let d = 0; d < f; ++d) {
      let w = (await this._createChatCompletion(e, {
        ...l,
        tool_choice: o,
        tools: m,
        messages: [...this.messages]
      }, r)).choices[0]?.message;
      if (!w)
        throw new b("missing message in ChatCompletion response");
      if (!w.tool_calls?.length)
        return;
      for (let T of w.tool_calls) {
        if (T.type !== "function")
          continue;
        let O = T.id, { name: g, arguments: $ } = T.function, R = h[g];
        if (R) {
          if (u && u !== g) {
            let V = `Invalid tool_call: ${JSON.stringify(g)}. ${JSON.stringify(u)} requested. Please try again`;
            this._addMessage({ role: n, tool_call_id: O, content: V });
            continue;
          }
        } else {
          let V = `Invalid tool_call: ${JSON.stringify(g)}. Available options are: ${Object.keys(h).map((K) => JSON.stringify(K)).join(", ")}. Please try again`;
          this._addMessage({ role: n, tool_call_id: O, content: V });
          continue;
        }
        let C;
        try {
          C = ei(R) ? await R.parse($) : $;
        } catch (V) {
          let K = V instanceof Error ? V.message : String(V);
          this._addMessage({ role: n, tool_call_id: O, content: K });
          continue;
        }
        let v = await R.function(C, this), B = re(this, ee, "m", li).call(this, v);
        if (this._addMessage({ role: n, tool_call_id: O, content: B }), u)
          return;
      }
    }
  }
};
ee = /* @__PURE__ */ new WeakSet(), ni = /* @__PURE__ */ i(function() {
  return re(this, ee, "m", Gn).call(this).content ?? null;
}, "_AbstractChatCompletionRunner_getFinalContent"), Gn = /* @__PURE__ */ i(function() {
  let e = this.messages.length;
  for (; e-- > 0; ) {
    let t = this.messages[e];
    if (lt(t)) {
      let { function_call: r, ...n } = t, o = {
        ...n,
        content: t.content ?? null,
        refusal: t.refusal ?? null
      };
      return r && (o.function_call = r), o;
    }
  }
  throw new b("stream ended without producing a ChatCompletionMessage with role=assistant");
}, "_AbstractChatCompletionRunner_getFinalMessage"), oi = /* @__PURE__ */ i(function() {
  for (let e = this.messages.length - 1; e >= 0; e--) {
    let t = this.messages[e];
    if (lt(t) && t?.function_call)
      return t.function_call;
    if (lt(t) && t?.tool_calls?.length)
      return t.tool_calls.at(-1)?.function;
  }
}, "_AbstractChatCompletionRunner_getFinalFunctionCall"), ii = /* @__PURE__ */ i(function() {
  for (let e = this.messages.length - 1; e >= 0; e--) {
    let t = this.messages[e];
    if (ti(t) && t.content != null || ri(t) && t.content != null && typeof t.content == "string" && this.messages.some((r) => r.role === "assistant" && r.tool_calls?.some((n) => n.type === "function" && n.id === t.tool_call_id)))
      return t.content;
  }
}, "_AbstractChatCompletionRunner_getFinalFunctionCallResult"), ai = /* @__PURE__ */ i(function() {
  let e = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  for (let { usage: t } of this._chatCompletions)
    t && (e.completion_tokens += t.completion_tokens, e.prompt_tokens += t.prompt_tokens, e.total_tokens += t.total_tokens);
  return e;
}, "_AbstractChatCompletionRunner_calculateTotalUsage"), za = /* @__PURE__ */ i(function(e) {
  if (e.n != null && e.n > 1)
    throw new b("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, "_AbstractChatCompletionRunner_validateParams"), li = /* @__PURE__ */ i(function(e) {
  return typeof e == "string" ? e : e === void 0 ? "undefined" : JSON.stringify(e);
}, "_AbstractChatCompletionRunner_stringifyFunctionCallResult");

// node_modules/openai/lib/ChatCompletionRunner.mjs
var Gs = class s extends Mr {
  static {
    i(this, "ChatCompletionRunner");
  }
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(e, t, r) {
    let n = new s(), o = {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "runFunctions" }
    };
    return n._run(() => n._runFunctions(e, t, o)), n;
  }
  static runTools(e, t, r) {
    let n = new s(), o = {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "runTools" }
    };
    return n._run(() => n._runTools(e, t, o)), n;
  }
  _addMessage(e, t = !0) {
    super._addMessage(e, t), lt(e) && e.content && this._emit("content", e.content);
  }
};

// node_modules/openai/_vendor/partial-json-parser/parser.mjs
var z = {
  STR: 1,
  NUM: 2,
  ARR: 4,
  OBJ: 8,
  NULL: 16,
  BOOL: 32,
  NAN: 64,
  INFINITY: 128,
  MINUS_INFINITY: 256,
  INF: 384,
  SPECIAL: 496,
  ATOM: 499,
  COLLECTION: 12,
  ALL: 511
}, ci = class extends Error {
  static {
    i(this, "PartialJSON");
  }
}, ui = class extends Error {
  static {
    i(this, "MalformedJSON");
  }
};
function Nc(s, e = z.ALL) {
  if (typeof s != "string")
    throw new TypeError(`expecting str, got ${typeof s}`);
  if (!s.trim())
    throw new Error(`${s} is empty`);
  return Bc(s.trim(), e);
}
i(Nc, "parseJSON");
var Bc = /* @__PURE__ */ i((s, e) => {
  let t = s.length, r = 0, n = /* @__PURE__ */ i((m) => {
    throw new ci(`${m} at position ${r}`);
  }, "markPartialJSON"), o = /* @__PURE__ */ i((m) => {
    throw new ui(`${m} at position ${r}`);
  }, "throwMalformedError"), a = /* @__PURE__ */ i(() => (h(), r >= t && n("Unexpected end of input"), s[r] === '"' ? l() : s[r] === "{" ? u() : s[r] === "[" ? f() : s.substring(r, r + 4) === "null" || z.NULL & e && t - r < 4 && "null".startsWith(s.substring(r)) ? (r += 4, null) : s.substring(r, r + 4) === "true" || z.BOOL & e && t - r < 4 && "true".startsWith(s.substring(r)) ? (r += 4, !0) : s.substring(r, r + 5) === "false" || z.BOOL & e && t - r < 5 && "false".startsWith(s.substring(r)) ? (r += 5, !1) : s.substring(r, r + 8) === "Infinity" || z.INFINITY & e && t - r < 8 && "Infinity".startsWith(s.substring(r)) ? (r += 8, 1 / 0) : s.substring(r, r + 9) === "-Infinity" || z.MINUS_INFINITY & e && 1 < t - r && t - r < 9 && "-Infinity".startsWith(s.substring(r)) ? (r += 9, -1 / 0) : s.substring(r, r + 3) === "NaN" || z.NAN & e && t - r < 3 && "NaN".startsWith(s.substring(r)) ? (r += 3, NaN) : y()), "parseAny"), l = /* @__PURE__ */ i(() => {
    let m = r, d = !1;
    for (r++; r < t && (s[r] !== '"' || d && s[r - 1] === "\\"); )
      d = s[r] === "\\" ? !d : !1, r++;
    if (s.charAt(r) == '"')
      try {
        return JSON.parse(s.substring(m, ++r - Number(d)));
      } catch (A) {
        o(String(A));
      }
    else if (z.STR & e)
      try {
        return JSON.parse(s.substring(m, r - Number(d)) + '"');
      } catch {
        return JSON.parse(s.substring(m, s.lastIndexOf("\\")) + '"');
      }
    n("Unterminated string literal");
  }, "parseStr"), u = /* @__PURE__ */ i(() => {
    r++, h();
    let m = {};
    try {
      for (; s[r] !== "}"; ) {
        if (h(), r >= t && z.OBJ & e)
          return m;
        let d = l();
        h(), r++;
        try {
          let A = a();
          Object.defineProperty(m, d, { value: A, writable: !0, enumerable: !0, configurable: !0 });
        } catch (A) {
          if (z.OBJ & e)
            return m;
          throw A;
        }
        h(), s[r] === "," && r++;
      }
    } catch {
      if (z.OBJ & e)
        return m;
      n("Expected '}' at end of object");
    }
    return r++, m;
  }, "parseObj"), f = /* @__PURE__ */ i(() => {
    r++;
    let m = [];
    try {
      for (; s[r] !== "]"; )
        m.push(a()), h(), s[r] === "," && r++;
    } catch {
      if (z.ARR & e)
        return m;
      n("Expected ']' at end of array");
    }
    return r++, m;
  }, "parseArr"), y = /* @__PURE__ */ i(() => {
    if (r === 0) {
      s === "-" && z.NUM & e && n("Not sure what '-' is");
      try {
        return JSON.parse(s);
      } catch (d) {
        if (z.NUM & e)
          try {
            return s[s.length - 1] === "." ? JSON.parse(s.substring(0, s.lastIndexOf("."))) : JSON.parse(s.substring(0, s.lastIndexOf("e")));
          } catch {
          }
        o(String(d));
      }
    }
    let m = r;
    for (s[r] === "-" && r++; s[r] && !",]}".includes(s[r]); )
      r++;
    r == t && !(z.NUM & e) && n("Unterminated number literal");
    try {
      return JSON.parse(s.substring(m, r));
    } catch {
      s.substring(m, r) === "-" && z.NUM & e && n("Not sure what '-' is");
      try {
        return JSON.parse(s.substring(m, s.lastIndexOf("e")));
      } catch (A) {
        o(String(A));
      }
    }
  }, "parseNum"), h = /* @__PURE__ */ i(() => {
    for (; r < t && ` 
\r	`.includes(s[r]); )
      r++;
  }, "skipBlank");
  return a();
}, "_parseJSON"), fi = /* @__PURE__ */ i((s) => Nc(s, z.ALL ^ z.NUM), "partialParse");

// node_modules/openai/lib/ChatCompletionStream.mjs
var $r = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, M = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, X, Xe, vr, ct, hi, Qn, di, pi, mi, zn, gi, Ya, Fr = class s extends Mr {
  static {
    i(this, "ChatCompletionStream");
  }
  constructor(e) {
    super(), X.add(this), Xe.set(this, void 0), vr.set(this, void 0), ct.set(this, void 0), $r(this, Xe, e, "f"), $r(this, vr, [], "f");
  }
  get currentChatCompletionSnapshot() {
    return M(this, ct, "f");
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    let t = new s(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createChatCompletion(e, t, r) {
    let n = new s(t);
    return n._run(() => n._runChatCompletion(e, { ...t, stream: !0 }, { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" } })), n;
  }
  async _createChatCompletion(e, t, r) {
    super._createChatCompletion;
    let n = r?.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), M(this, X, "m", hi).call(this);
    let o = await e.chat.completions.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal });
    this._connected();
    for await (let a of o)
      M(this, X, "m", di).call(this, a);
    if (o.controller.signal?.aborted)
      throw new D();
    return this._addChatCompletion(M(this, X, "m", zn).call(this));
  }
  async _fromReadableStream(e, t) {
    let r = t?.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), M(this, X, "m", hi).call(this), this._connected();
    let n = Re.fromReadableStream(e, this.controller), o;
    for await (let a of n)
      o && o !== a.id && this._addChatCompletion(M(this, X, "m", zn).call(this)), M(this, X, "m", di).call(this, a), o = a.id;
    if (n.controller.signal?.aborted)
      throw new D();
    return this._addChatCompletion(M(this, X, "m", zn).call(this));
  }
  [(Xe = /* @__PURE__ */ new WeakMap(), vr = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakSet(), hi = /* @__PURE__ */ i(function() {
    this.ended || $r(this, ct, void 0, "f");
  }, "_ChatCompletionStream_beginRequest"), Qn = /* @__PURE__ */ i(function(t) {
    let r = M(this, vr, "f")[t.index];
    return r || (r = {
      content_done: !1,
      refusal_done: !1,
      logprobs_content_done: !1,
      logprobs_refusal_done: !1,
      done_tool_calls: /* @__PURE__ */ new Set(),
      current_tool_call_index: null
    }, M(this, vr, "f")[t.index] = r, r);
  }, "_ChatCompletionStream_getChoiceEventState"), di = /* @__PURE__ */ i(function(t) {
    if (this.ended)
      return;
    let r = M(this, X, "m", Ya).call(this, t);
    this._emit("chunk", t, r);
    for (let n of t.choices) {
      let o = r.choices[n.index];
      n.delta.content != null && o.message?.role === "assistant" && o.message?.content && (this._emit("content", n.delta.content, o.message.content), this._emit("content.delta", {
        delta: n.delta.content,
        snapshot: o.message.content,
        parsed: o.message.parsed
      })), n.delta.refusal != null && o.message?.role === "assistant" && o.message?.refusal && this._emit("refusal.delta", {
        delta: n.delta.refusal,
        snapshot: o.message.refusal
      }), n.logprobs?.content != null && o.message?.role === "assistant" && this._emit("logprobs.content.delta", {
        content: n.logprobs?.content,
        snapshot: o.logprobs?.content ?? []
      }), n.logprobs?.refusal != null && o.message?.role === "assistant" && this._emit("logprobs.refusal.delta", {
        refusal: n.logprobs?.refusal,
        snapshot: o.logprobs?.refusal ?? []
      });
      let a = M(this, X, "m", Qn).call(this, o);
      o.finish_reason && (M(this, X, "m", mi).call(this, o), a.current_tool_call_index != null && M(this, X, "m", pi).call(this, o, a.current_tool_call_index));
      for (let l of n.delta.tool_calls ?? [])
        a.current_tool_call_index !== l.index && (M(this, X, "m", mi).call(this, o), a.current_tool_call_index != null && M(this, X, "m", pi).call(this, o, a.current_tool_call_index)), a.current_tool_call_index = l.index;
      for (let l of n.delta.tool_calls ?? []) {
        let u = o.message.tool_calls?.[l.index];
        u?.type && (u?.type === "function" ? this._emit("tool_calls.function.arguments.delta", {
          name: u.function?.name,
          index: l.index,
          arguments: u.function.arguments,
          parsed_arguments: u.function.parsed_arguments,
          arguments_delta: l.function?.arguments ?? ""
        }) : (u?.type, void 0));
      }
    }
  }, "_ChatCompletionStream_addChunk"), pi = /* @__PURE__ */ i(function(t, r) {
    if (M(this, X, "m", Qn).call(this, t).done_tool_calls.has(r))
      return;
    let o = t.message.tool_calls?.[r];
    if (!o)
      throw new Error("no tool call snapshot");
    if (!o.type)
      throw new Error("tool call snapshot missing `type`");
    if (o.type === "function") {
      let a = M(this, Xe, "f")?.tools?.find((l) => l.type === "function" && l.function.name === o.function.name);
      this._emit("tool_calls.function.arguments.done", {
        name: o.function.name,
        index: r,
        arguments: o.function.arguments,
        parsed_arguments: jt(a) ? a.$parseRaw(o.function.arguments) : a?.function.strict ? JSON.parse(o.function.arguments) : null
      });
    } else
      o.type;
  }, "_ChatCompletionStream_emitToolCallDoneEvent"), mi = /* @__PURE__ */ i(function(t) {
    let r = M(this, X, "m", Qn).call(this, t);
    if (t.message.content && !r.content_done) {
      r.content_done = !0;
      let n = M(this, X, "m", gi).call(this);
      this._emit("content.done", {
        content: t.message.content,
        parsed: n ? n.$parseRaw(t.message.content) : null
      });
    }
    t.message.refusal && !r.refusal_done && (r.refusal_done = !0, this._emit("refusal.done", { refusal: t.message.refusal })), t.logprobs?.content && !r.logprobs_content_done && (r.logprobs_content_done = !0, this._emit("logprobs.content.done", { content: t.logprobs.content })), t.logprobs?.refusal && !r.logprobs_refusal_done && (r.logprobs_refusal_done = !0, this._emit("logprobs.refusal.done", { refusal: t.logprobs.refusal }));
  }, "_ChatCompletionStream_emitContentDoneEvents"), zn = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new b("stream has ended, this shouldn't happen");
    let t = M(this, ct, "f");
    if (!t)
      throw new b("request ended without sending any chunks");
    return $r(this, ct, void 0, "f"), $r(this, vr, [], "f"), Lc(t, M(this, Xe, "f"));
  }, "_ChatCompletionStream_endRequest"), gi = /* @__PURE__ */ i(function() {
    let t = M(this, Xe, "f")?.response_format;
    return Vs(t) ? t : null;
  }, "_ChatCompletionStream_getAutoParseableResponseFormat"), Ya = /* @__PURE__ */ i(function(t) {
    var r, n, o, a;
    let l = M(this, ct, "f"), { choices: u, ...f } = t;
    l ? Object.assign(l, f) : l = $r(this, ct, {
      ...f,
      choices: []
    }, "f");
    for (let { delta: y, finish_reason: h, index: m, logprobs: d = null, ...A } of t.choices) {
      let w = l.choices[m];
      if (w || (w = l.choices[m] = { finish_reason: h, index: m, message: {}, logprobs: d, ...A }), d)
        if (!w.logprobs)
          w.logprobs = Object.assign({}, d);
        else {
          let { content: v, refusal: B, ...V } = d;
          Object.assign(w.logprobs, V), v && ((r = w.logprobs).content ?? (r.content = []), w.logprobs.content.push(...v)), B && ((n = w.logprobs).refusal ?? (n.refusal = []), w.logprobs.refusal.push(...B));
        }
      if (h && (w.finish_reason = h, M(this, Xe, "f") && si(M(this, Xe, "f")))) {
        if (h === "length")
          throw new Pr();
        if (h === "content_filter")
          throw new Sr();
      }
      if (Object.assign(w, A), !y)
        continue;
      let { content: T, refusal: O, function_call: g, role: $, tool_calls: R, ...C } = y;
      if (Object.assign(w.message, C), O && (w.message.refusal = (w.message.refusal || "") + O), $ && (w.message.role = $), g && (w.message.function_call ? (g.name && (w.message.function_call.name = g.name), g.arguments && ((o = w.message.function_call).arguments ?? (o.arguments = ""), w.message.function_call.arguments += g.arguments)) : w.message.function_call = g), T && (w.message.content = (w.message.content || "") + T, !w.message.refusal && M(this, X, "m", gi).call(this) && (w.message.parsed = fi(w.message.content))), R) {
        w.message.tool_calls || (w.message.tool_calls = []);
        for (let { index: v, id: B, type: V, function: K, ...U } of R) {
          let q = (a = w.message.tool_calls)[v] ?? (a[v] = {});
          Object.assign(q, U), B && (q.id = B), V && (q.type = V), K && (q.function ?? (q.function = { name: K.name ?? "", arguments: "" })), K?.name && (q.function.name = K.name), K?.arguments && (q.function.arguments += K.arguments, Ka(M(this, Xe, "f"), q) && (q.function.parsed_arguments = fi(q.function.arguments)));
        }
      }
    }
    return l;
  }, "_ChatCompletionStream_accumulateChatCompletion"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("chunk", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, a) => t.push({ resolve: o, reject: a })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  toReadableStream() {
    return new Re(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
};
function Lc(s, e) {
  let { id: t, choices: r, created: n, model: o, system_fingerprint: a, ...l } = s, u = {
    ...l,
    id: t,
    choices: r.map(({ message: f, finish_reason: y, index: h, logprobs: m, ...d }) => {
      if (!y)
        throw new b(`missing finish_reason for choice ${h}`);
      let { content: A = null, function_call: w, tool_calls: T, ...O } = f, g = f.role;
      if (!g)
        throw new b(`missing role for choice ${h}`);
      if (w) {
        let { arguments: $, name: R } = w;
        if ($ == null)
          throw new b(`missing function_call.arguments for choice ${h}`);
        if (!R)
          throw new b(`missing function_call.name for choice ${h}`);
        return {
          ...d,
          message: {
            content: A,
            function_call: { arguments: $, name: R },
            role: g,
            refusal: f.refusal ?? null
          },
          finish_reason: y,
          index: h,
          logprobs: m
        };
      }
      return T ? {
        ...d,
        index: h,
        finish_reason: y,
        logprobs: m,
        message: {
          ...O,
          role: g,
          content: A,
          refusal: f.refusal ?? null,
          tool_calls: T.map(($, R) => {
            let { function: C, type: v, id: B, ...V } = $, { arguments: K, name: U, ...q } = C || {};
            if (B == null)
              throw new b(`missing choices[${h}].tool_calls[${R}].id
${Yn(s)}`);
            if (v == null)
              throw new b(`missing choices[${h}].tool_calls[${R}].type
${Yn(s)}`);
            if (U == null)
              throw new b(`missing choices[${h}].tool_calls[${R}].function.name
${Yn(s)}`);
            if (K == null)
              throw new b(`missing choices[${h}].tool_calls[${R}].function.arguments
${Yn(s)}`);
            return { ...V, id: B, type: v, function: { ...q, name: U, arguments: K } };
          })
        }
      } : {
        ...d,
        message: { ...O, content: A, role: g, refusal: f.refusal ?? null },
        finish_reason: y,
        index: h,
        logprobs: m
      };
    }),
    created: n,
    model: o,
    object: "chat.completion",
    ...a ? { system_fingerprint: a } : {}
  };
  return Va(u, e);
}
i(Lc, "finalizeChatCompletion");
function Yn(s) {
  return JSON.stringify(s);
}
i(Yn, "str");

// node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
var Qs = class s extends Fr {
  static {
    i(this, "ChatCompletionStreamingRunner");
  }
  static fromReadableStream(e) {
    let t = new s(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(e, t, r) {
    let n = new s(null), o = {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "runFunctions" }
    };
    return n._run(() => n._runFunctions(e, t, o)), n;
  }
  static runTools(e, t, r) {
    let n = new s(
      // @ts-expect-error TODO these types are incompatible
      t
    ), o = {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "runTools" }
    };
    return n._run(() => n._runTools(e, t, o)), n;
  }
};

// node_modules/openai/resources/beta/chat/completions.mjs
var zs = class extends p {
  static {
    i(this, "Completions");
  }
  parse(e, t) {
    return Ga(e.tools), this._client.chat.completions.create(e, {
      ...t,
      headers: {
        ...t?.headers,
        "X-Stainless-Helper-Method": "beta.chat.completions.parse"
      }
    })._thenUnwrap((r) => Ks(r, e));
  }
  runFunctions(e, t) {
    return e.stream ? Qs.runFunctions(this._client, e, t) : Gs.runFunctions(this._client, e, t);
  }
  runTools(e, t) {
    return e.stream ? Qs.runTools(this._client, e, t) : Gs.runTools(this._client, e, t);
  }
  /**
   * Creates a chat completion stream
   */
  stream(e, t) {
    return Fr.createChatCompletion(this._client, e, t);
  }
};

// node_modules/openai/resources/beta/chat/chat.mjs
var Nr = class extends p {
  static {
    i(this, "Chat");
  }
  constructor() {
    super(...arguments), this.completions = new zs(this._client);
  }
};
(function(s) {
  s.Completions = zs;
})(Nr || (Nr = {}));

// node_modules/openai/resources/beta/realtime/sessions.mjs
var Br = class extends p {
  static {
    i(this, "Sessions");
  }
  /**
   * Create an ephemeral API token for use in client-side applications with the
   * Realtime API. Can be configured with the same session parameters as the
   * `session.update` client event.
   *
   * It responds with a session object, plus a `client_secret` key which contains a
   * usable ephemeral API token that can be used to authenticate browser clients for
   * the Realtime API.
   *
   * @example
   * ```ts
   * const session =
   *   await client.beta.realtime.sessions.create();
   * ```
   */
  create(e, t) {
    return this._client.post("/realtime/sessions", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
};

// node_modules/openai/resources/beta/realtime/transcription-sessions.mjs
var Lr = class extends p {
  static {
    i(this, "TranscriptionSessions");
  }
  /**
   * Create an ephemeral API token for use in client-side applications with the
   * Realtime API specifically for realtime transcriptions. Can be configured with
   * the same session parameters as the `transcription_session.update` client event.
   *
   * It responds with a session object, plus a `client_secret` key which contains a
   * usable ephemeral API token that can be used to authenticate browser clients for
   * the Realtime API.
   *
   * @example
   * ```ts
   * const transcriptionSession =
   *   await client.beta.realtime.transcriptionSessions.create();
   * ```
   */
  create(e, t) {
    return this._client.post("/realtime/transcription_sessions", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
};

// node_modules/openai/resources/beta/realtime/realtime.mjs
var ut = class extends p {
  static {
    i(this, "Realtime");
  }
  constructor() {
    super(...arguments), this.sessions = new Br(this._client), this.transcriptionSessions = new Lr(this._client);
  }
};
ut.Sessions = Br;
ut.TranscriptionSessions = Lr;

// node_modules/openai/resources/beta/threads/messages.mjs
var Ut = class extends p {
  static {
    i(this, "Messages");
  }
  /**
   * Create a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  create(e, t, r) {
    return this._client.post(`/threads/${e}/messages`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Retrieve a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t, r) {
    return this._client.get(`/threads/${e}/messages/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Modifies a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, r, n) {
    return this._client.post(`/threads/${e}/messages/${t}`, {
      body: r,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers }
    });
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/threads/${e}/messages`, jr, {
      query: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Deletes a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  del(e, t, r) {
    return this._client.delete(`/threads/${e}/messages/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
}, jr = class extends k {
  static {
    i(this, "MessagesPage");
  }
};
Ut.MessagesPage = jr;

// node_modules/openai/resources/beta/threads/runs/steps.mjs
var Dt = class extends p {
  static {
    i(this, "Steps");
  }
  retrieve(e, t, r, n = {}, o) {
    return E(n) ? this.retrieve(e, t, r, {}, n) : this._client.get(`/threads/${e}/runs/${t}/steps/${r}`, {
      query: n,
      ...o,
      headers: { "OpenAI-Beta": "assistants=v2", ...o?.headers }
    });
  }
  list(e, t, r = {}, n) {
    return E(r) ? this.list(e, t, {}, r) : this._client.getAPIList(`/threads/${e}/runs/${t}/steps`, Ur, {
      query: r,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers }
    });
  }
}, Ur = class extends k {
  static {
    i(this, "RunStepsPage");
  }
};
Dt.RunStepsPage = Ur;

// node_modules/openai/resources/beta/threads/runs/runs.mjs
var Ve = class extends p {
  static {
    i(this, "Runs");
  }
  constructor() {
    super(...arguments), this.steps = new Dt(this._client);
  }
  create(e, t, r) {
    let { include: n, ...o } = t;
    return this._client.post(`/threads/${e}/runs`, {
      query: { include: n },
      body: o,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers },
      stream: t.stream ?? !1
    });
  }
  /**
   * Retrieves a run.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t, r) {
    return this._client.get(`/threads/${e}/runs/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Modifies a run.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, r, n) {
    return this._client.post(`/threads/${e}/runs/${t}`, {
      body: r,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers }
    });
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/threads/${e}/runs`, Dr, {
      query: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Cancels a run that is `in_progress`.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  cancel(e, t, r) {
    return this._client.post(`/threads/${e}/runs/${t}/cancel`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * A helper to create a run an poll for a terminal state. More information on Run
   * lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndPoll(e, t, r) {
    let n = await this.create(e, t, r);
    return await this.poll(e, n.id, r);
  }
  /**
   * Create a Run stream
   *
   * @deprecated use `stream` instead
   */
  createAndStream(e, t, r) {
    return ke.createAssistantStream(e, this._client.beta.threads.runs, t, r);
  }
  /**
   * A helper to poll a run status until it reaches a terminal state. More
   * information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async poll(e, t, r) {
    let n = { ...r?.headers, "X-Stainless-Poll-Helper": "true" };
    for (r?.pollIntervalMs && (n["X-Stainless-Custom-Poll-Interval"] = r.pollIntervalMs.toString()); ; ) {
      let { data: o, response: a } = await this.retrieve(e, t, {
        ...r,
        headers: { ...r?.headers, ...n }
      }).withResponse();
      switch (o.status) {
        //If we are in any sort of intermediate state we poll
        case "queued":
        case "in_progress":
        case "cancelling":
          let l = 5e3;
          if (r?.pollIntervalMs)
            l = r.pollIntervalMs;
          else {
            let u = a.headers.get("openai-poll-after-ms");
            if (u) {
              let f = parseInt(u);
              isNaN(f) || (l = f);
            }
          }
          await qe(l);
          break;
        //We return the run in any terminal state.
        case "requires_action":
        case "incomplete":
        case "cancelled":
        case "completed":
        case "failed":
        case "expired":
          return o;
      }
    }
  }
  /**
   * Create a Run stream
   */
  stream(e, t, r) {
    return ke.createAssistantStream(e, this._client.beta.threads.runs, t, r);
  }
  submitToolOutputs(e, t, r, n) {
    return this._client.post(`/threads/${e}/runs/${t}/submit_tool_outputs`, {
      body: r,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers },
      stream: r.stream ?? !1
    });
  }
  /**
   * A helper to submit a tool output to a run and poll for a terminal run state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async submitToolOutputsAndPoll(e, t, r, n) {
    let o = await this.submitToolOutputs(e, t, r, n);
    return await this.poll(e, o.id, n);
  }
  /**
   * Submit the tool outputs from a previous run and stream the run to a terminal
   * state. More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  submitToolOutputsStream(e, t, r, n) {
    return ke.createToolAssistantStream(e, t, this._client.beta.threads.runs, r, n);
  }
}, Dr = class extends k {
  static {
    i(this, "RunsPage");
  }
};
Ve.RunsPage = Dr;
Ve.Steps = Dt;
Ve.RunStepsPage = Ur;

// node_modules/openai/resources/beta/threads/threads.mjs
var Oe = class extends p {
  static {
    i(this, "Threads");
  }
  constructor() {
    super(...arguments), this.runs = new Ve(this._client), this.messages = new Ut(this._client);
  }
  create(e = {}, t) {
    return E(e) ? this.create({}, e) : this._client.post("/threads", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Retrieves a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t) {
    return this._client.get(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Modifies a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, r) {
    return this._client.post(`/threads/${e}`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Delete a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  del(e, t) {
    return this._client.delete(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  createAndRun(e, t) {
    return this._client.post("/threads/runs", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers },
      stream: e.stream ?? !1
    });
  }
  /**
   * A helper to create a thread, start a run and then poll for a terminal state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndRunPoll(e, t) {
    let r = await this.createAndRun(e, t);
    return await this.runs.poll(r.thread_id, r.id, t);
  }
  /**
   * Create a thread and stream the run back
   */
  createAndRunStream(e, t) {
    return ke.createThreadAssistantStream(e, this._client.beta.threads, t);
  }
};
Oe.Runs = Ve;
Oe.RunsPage = Dr;
Oe.Messages = Ut;
Oe.MessagesPage = jr;

// node_modules/openai/resources/beta/beta.mjs
var we = class extends p {
  static {
    i(this, "Beta");
  }
  constructor() {
    super(...arguments), this.realtime = new ut(this._client), this.chat = new Nr(this._client), this.assistants = new Lt(this._client), this.threads = new Oe(this._client);
  }
};
we.Realtime = ut;
we.Assistants = Lt;
we.AssistantsPage = Tr;
we.Threads = Oe;

// node_modules/openai/resources/completions.mjs
var qt = class extends p {
  static {
    i(this, "Completions");
  }
  create(e, t) {
    return this._client.post("/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
};

// node_modules/openai/resources/containers/files/content.mjs
var qr = class extends p {
  static {
    i(this, "Content");
  }
  /**
   * Retrieve Container File Content
   */
  retrieve(e, t, r) {
    return this._client.get(`/containers/${e}/files/${t}/content`, {
      ...r,
      headers: { Accept: "application/binary", ...r?.headers },
      __binaryResponse: !0
    });
  }
};

// node_modules/openai/resources/containers/files/files.mjs
var ft = class extends p {
  static {
    i(this, "Files");
  }
  constructor() {
    super(...arguments), this.content = new qr(this._client);
  }
  /**
   * Create a Container File
   *
   * You can send either a multipart/form-data request with the raw file content, or
   * a JSON request with a file ID.
   */
  create(e, t, r) {
    return this._client.post(`/containers/${e}/files`, te({ body: t, ...r }));
  }
  /**
   * Retrieve Container File
   */
  retrieve(e, t, r) {
    return this._client.get(`/containers/${e}/files/${t}`, r);
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/containers/${e}/files`, Wr, {
      query: t,
      ...r
    });
  }
  /**
   * Delete Container File
   */
  del(e, t, r) {
    return this._client.delete(`/containers/${e}/files/${t}`, {
      ...r,
      headers: { Accept: "*/*", ...r?.headers }
    });
  }
}, Wr = class extends k {
  static {
    i(this, "FileListResponsesPage");
  }
};
ft.FileListResponsesPage = Wr;
ft.Content = qr;

// node_modules/openai/resources/containers/containers.mjs
var Te = class extends p {
  static {
    i(this, "Containers");
  }
  constructor() {
    super(...arguments), this.files = new ft(this._client);
  }
  /**
   * Create Container
   */
  create(e, t) {
    return this._client.post("/containers", { body: e, ...t });
  }
  /**
   * Retrieve Container
   */
  retrieve(e, t) {
    return this._client.get(`/containers/${e}`, t);
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/containers", Wt, { query: e, ...t });
  }
  /**
   * Delete Container
   */
  del(e, t) {
    return this._client.delete(`/containers/${e}`, {
      ...t,
      headers: { Accept: "*/*", ...t?.headers }
    });
  }
}, Wt = class extends k {
  static {
    i(this, "ContainerListResponsesPage");
  }
};
Te.ContainerListResponsesPage = Wt;
Te.Files = ft;
Te.FileListResponsesPage = Wr;

// node_modules/openai/resources/embeddings.mjs
var Ht = class extends p {
  static {
    i(this, "Embeddings");
  }
  /**
   * Creates an embedding vector representing the input text.
   *
   * @example
   * ```ts
   * const createEmbeddingResponse =
   *   await client.embeddings.create({
   *     input: 'The quick brown fox jumped over the lazy dog',
   *     model: 'text-embedding-3-small',
   *   });
   * ```
   */
  create(e, t) {
    let r = !!e.encoding_format, n = r ? e.encoding_format : "base64";
    r && De("Request", "User defined encoding_format:", e.encoding_format);
    let o = this._client.post("/embeddings", {
      body: {
        ...e,
        encoding_format: n
      },
      ...t
    });
    return r ? o : (De("response", "Decoding base64 embeddings to float32 array"), o._thenUnwrap((a) => (a && a.data && a.data.forEach((l) => {
      let u = l.embedding;
      l.embedding = La(u);
    }), a)));
  }
};

// node_modules/openai/resources/evals/runs/output-items.mjs
var Jt = class extends p {
  static {
    i(this, "OutputItems");
  }
  /**
   * Get an evaluation run output item by ID.
   */
  retrieve(e, t, r, n) {
    return this._client.get(`/evals/${e}/runs/${t}/output_items/${r}`, n);
  }
  list(e, t, r = {}, n) {
    return E(r) ? this.list(e, t, {}, r) : this._client.getAPIList(`/evals/${e}/runs/${t}/output_items`, Hr, { query: r, ...n });
  }
}, Hr = class extends k {
  static {
    i(this, "OutputItemListResponsesPage");
  }
};
Jt.OutputItemListResponsesPage = Hr;

// node_modules/openai/resources/evals/runs/runs.mjs
var Ke = class extends p {
  static {
    i(this, "Runs");
  }
  constructor() {
    super(...arguments), this.outputItems = new Jt(this._client);
  }
  /**
   * Kicks off a new run for a given evaluation, specifying the data source, and what
   * model configuration to use to test. The datasource will be validated against the
   * schema specified in the config of the evaluation.
   */
  create(e, t, r) {
    return this._client.post(`/evals/${e}/runs`, { body: t, ...r });
  }
  /**
   * Get an evaluation run by ID.
   */
  retrieve(e, t, r) {
    return this._client.get(`/evals/${e}/runs/${t}`, r);
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/evals/${e}/runs`, Jr, { query: t, ...r });
  }
  /**
   * Delete an eval run.
   */
  del(e, t, r) {
    return this._client.delete(`/evals/${e}/runs/${t}`, r);
  }
  /**
   * Cancel an ongoing evaluation run.
   */
  cancel(e, t, r) {
    return this._client.post(`/evals/${e}/runs/${t}`, r);
  }
}, Jr = class extends k {
  static {
    i(this, "RunListResponsesPage");
  }
};
Ke.RunListResponsesPage = Jr;
Ke.OutputItems = Jt;
Ke.OutputItemListResponsesPage = Hr;

// node_modules/openai/resources/evals/evals.mjs
var Me = class extends p {
  static {
    i(this, "Evals");
  }
  constructor() {
    super(...arguments), this.runs = new Ke(this._client);
  }
  /**
   * Create the structure of an evaluation that can be used to test a model's
   * performance. An evaluation is a set of testing criteria and the config for a
   * data source, which dictates the schema of the data used in the evaluation. After
   * creating an evaluation, you can run it on different models and model parameters.
   * We support several types of graders and datasources. For more information, see
   * the [Evals guide](https://platform.openai.com/docs/guides/evals).
   */
  create(e, t) {
    return this._client.post("/evals", { body: e, ...t });
  }
  /**
   * Get an evaluation by ID.
   */
  retrieve(e, t) {
    return this._client.get(`/evals/${e}`, t);
  }
  /**
   * Update certain properties of an evaluation.
   */
  update(e, t, r) {
    return this._client.post(`/evals/${e}`, { body: t, ...r });
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/evals", Xt, { query: e, ...t });
  }
  /**
   * Delete an evaluation.
   */
  del(e, t) {
    return this._client.delete(`/evals/${e}`, t);
  }
}, Xt = class extends k {
  static {
    i(this, "EvalListResponsesPage");
  }
};
Me.EvalListResponsesPage = Xt;
Me.Runs = Ke;
Me.RunListResponsesPage = Jr;

// node_modules/openai/resources/files.mjs
var ht = class extends p {
  static {
    i(this, "Files");
  }
  /**
   * Upload a file that can be used across various endpoints. Individual files can be
   * up to 512 MB, and the size of all files uploaded by one organization can be up
   * to 100 GB.
   *
   * The Assistants API supports files up to 2 million tokens and of specific file
   * types. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for
   * details.
   *
   * The Fine-tuning API only supports `.jsonl` files. The input also has certain
   * required formats for fine-tuning
   * [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or
   * [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
   * models.
   *
   * The Batch API only supports `.jsonl` files up to 200 MB in size. The input also
   * has a specific required
   * [format](https://platform.openai.com/docs/api-reference/batch/request-input).
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  create(e, t) {
    return this._client.post("/files", te({ body: e, ...t }));
  }
  /**
   * Returns information about a specific file.
   */
  retrieve(e, t) {
    return this._client.get(`/files/${e}`, t);
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/files", Vt, { query: e, ...t });
  }
  /**
   * Delete a file.
   */
  del(e, t) {
    return this._client.delete(`/files/${e}`, t);
  }
  /**
   * Returns the contents of the specified file.
   */
  content(e, t) {
    return this._client.get(`/files/${e}/content`, {
      ...t,
      headers: { Accept: "application/binary", ...t?.headers },
      __binaryResponse: !0
    });
  }
  /**
   * Returns the contents of the specified file.
   *
   * @deprecated The `.content()` method should be used instead
   */
  retrieveContent(e, t) {
    return this._client.get(`/files/${e}/content`, t);
  }
  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  async waitForProcessing(e, { pollInterval: t = 5e3, maxWait: r = 1800 * 1e3 } = {}) {
    let n = /* @__PURE__ */ new Set(["processed", "error", "deleted"]), o = Date.now(), a = await this.retrieve(e);
    for (; !a.status || !n.has(a.status); )
      if (await qe(t), a = await this.retrieve(e), Date.now() - o > r)
        throw new st({
          message: `Giving up on waiting for file ${e} to finish processing after ${r} milliseconds.`
        });
    return a;
  }
}, Vt = class extends k {
  static {
    i(this, "FileObjectsPage");
  }
};
ht.FileObjectsPage = Vt;

// node_modules/openai/resources/fine-tuning/methods.mjs
var Xr = class extends p {
  static {
    i(this, "Methods");
  }
};

// node_modules/openai/resources/fine-tuning/alpha/graders.mjs
var Vr = class extends p {
  static {
    i(this, "Graders");
  }
  /**
   * Run a grader.
   *
   * @example
   * ```ts
   * const response = await client.fineTuning.alpha.graders.run({
   *   grader: {
   *     input: 'input',
   *     name: 'name',
   *     operation: 'eq',
   *     reference: 'reference',
   *     type: 'string_check',
   *   },
   *   model_sample: 'model_sample',
   *   reference_answer: 'string',
   * });
   * ```
   */
  run(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/run", { body: e, ...t });
  }
  /**
   * Validate a grader.
   *
   * @example
   * ```ts
   * const response =
   *   await client.fineTuning.alpha.graders.validate({
   *     grader: {
   *       input: 'input',
   *       name: 'name',
   *       operation: 'eq',
   *       reference: 'reference',
   *       type: 'string_check',
   *     },
   *   });
   * ```
   */
  validate(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/validate", { body: e, ...t });
  }
};

// node_modules/openai/resources/fine-tuning/alpha/alpha.mjs
var Kt = class extends p {
  static {
    i(this, "Alpha");
  }
  constructor() {
    super(...arguments), this.graders = new Vr(this._client);
  }
};
Kt.Graders = Vr;

// node_modules/openai/resources/fine-tuning/checkpoints/permissions.mjs
var Gt = class extends p {
  static {
    i(this, "Permissions");
  }
  /**
   * **NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).
   *
   * This enables organization owners to share fine-tuned models with other projects
   * in their organization.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
   *   'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
   *   { project_ids: ['string'] },
   * )) {
   *   // ...
   * }
   * ```
   */
  create(e, t, r) {
    return this._client.getAPIList(`/fine_tuning/checkpoints/${e}/permissions`, Kr, { body: t, method: "post", ...r });
  }
  retrieve(e, t = {}, r) {
    return E(t) ? this.retrieve(e, {}, t) : this._client.get(`/fine_tuning/checkpoints/${e}/permissions`, {
      query: t,
      ...r
    });
  }
  /**
   * **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
   *
   * Organization owners can use this endpoint to delete a permission for a
   * fine-tuned model checkpoint.
   *
   * @example
   * ```ts
   * const permission =
   *   await client.fineTuning.checkpoints.permissions.del(
   *     'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
   *     'cp_zc4Q7MP6XxulcVzj4MZdwsAB',
   *   );
   * ```
   */
  del(e, t, r) {
    return this._client.delete(`/fine_tuning/checkpoints/${e}/permissions/${t}`, r);
  }
}, Kr = class extends Ie {
  static {
    i(this, "PermissionCreateResponsesPage");
  }
};
Gt.PermissionCreateResponsesPage = Kr;

// node_modules/openai/resources/fine-tuning/checkpoints/checkpoints.mjs
var dt = class extends p {
  static {
    i(this, "Checkpoints");
  }
  constructor() {
    super(...arguments), this.permissions = new Gt(this._client);
  }
};
dt.Permissions = Gt;
dt.PermissionCreateResponsesPage = Kr;

// node_modules/openai/resources/fine-tuning/jobs/checkpoints.mjs
var Qt = class extends p {
  static {
    i(this, "Checkpoints");
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/fine_tuning/jobs/${e}/checkpoints`, Gr, { query: t, ...r });
  }
}, Gr = class extends k {
  static {
    i(this, "FineTuningJobCheckpointsPage");
  }
};
Qt.FineTuningJobCheckpointsPage = Gr;

// node_modules/openai/resources/fine-tuning/jobs/jobs.mjs
var $e = class extends p {
  static {
    i(this, "Jobs");
  }
  constructor() {
    super(...arguments), this.checkpoints = new Qt(this._client);
  }
  /**
   * Creates a fine-tuning job which begins the process of creating a new model from
   * a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.create({
   *   model: 'gpt-4o-mini',
   *   training_file: 'file-abc123',
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/fine_tuning/jobs", { body: e, ...t });
  }
  /**
   * Get info about a fine-tuning job.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.retrieve(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/fine_tuning/jobs/${e}`, t);
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/fine_tuning/jobs", Qr, { query: e, ...t });
  }
  /**
   * Immediately cancel a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.cancel(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/cancel`, t);
  }
  listEvents(e, t = {}, r) {
    return E(t) ? this.listEvents(e, {}, t) : this._client.getAPIList(`/fine_tuning/jobs/${e}/events`, zr, {
      query: t,
      ...r
    });
  }
  /**
   * Pause a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.pause(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  pause(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/pause`, t);
  }
  /**
   * Resume a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.resume(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  resume(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/resume`, t);
  }
}, Qr = class extends k {
  static {
    i(this, "FineTuningJobsPage");
  }
}, zr = class extends k {
  static {
    i(this, "FineTuningJobEventsPage");
  }
};
$e.FineTuningJobsPage = Qr;
$e.FineTuningJobEventsPage = zr;
$e.Checkpoints = Qt;
$e.FineTuningJobCheckpointsPage = Gr;

// node_modules/openai/resources/fine-tuning/fine-tuning.mjs
var ce = class extends p {
  static {
    i(this, "FineTuning");
  }
  constructor() {
    super(...arguments), this.methods = new Xr(this._client), this.jobs = new $e(this._client), this.checkpoints = new dt(this._client), this.alpha = new Kt(this._client);
  }
};
ce.Methods = Xr;
ce.Jobs = $e;
ce.FineTuningJobsPage = Qr;
ce.FineTuningJobEventsPage = zr;
ce.Checkpoints = dt;
ce.Alpha = Kt;

// node_modules/openai/resources/graders/grader-models.mjs
var Yr = class extends p {
  static {
    i(this, "GraderModels");
  }
};

// node_modules/openai/resources/graders/graders.mjs
var pt = class extends p {
  static {
    i(this, "Graders");
  }
  constructor() {
    super(...arguments), this.graderModels = new Yr(this._client);
  }
};
pt.GraderModels = Yr;

// node_modules/openai/resources/images.mjs
var zt = class extends p {
  static {
    i(this, "Images");
  }
  /**
   * Creates a variation of a given image. This endpoint only supports `dall-e-2`.
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.createVariation({
   *   image: fs.createReadStream('otter.png'),
   * });
   * ```
   */
  createVariation(e, t) {
    return this._client.post("/images/variations", te({ body: e, ...t }));
  }
  /**
   * Creates an edited or extended image given one or more source images and a
   * prompt. This endpoint only supports `gpt-image-1` and `dall-e-2`.
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.edit({
   *   image: fs.createReadStream('path/to/file'),
   *   prompt: 'A cute baby sea otter wearing a beret',
   * });
   * ```
   */
  edit(e, t) {
    return this._client.post("/images/edits", te({ body: e, ...t }));
  }
  /**
   * Creates an image given a prompt.
   * [Learn more](https://platform.openai.com/docs/guides/images).
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.generate({
   *   prompt: 'A cute baby sea otter',
   * });
   * ```
   */
  generate(e, t) {
    return this._client.post("/images/generations", { body: e, ...t });
  }
};

// node_modules/openai/resources/models.mjs
var mt = class extends p {
  static {
    i(this, "Models");
  }
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(e, t) {
    return this._client.get(`/models/${e}`, t);
  }
  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(e) {
    return this._client.getAPIList("/models", Yt, e);
  }
  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(e, t) {
    return this._client.delete(`/models/${e}`, t);
  }
}, Yt = class extends Ie {
  static {
    i(this, "ModelsPage");
  }
};
mt.ModelsPage = Yt;

// node_modules/openai/resources/moderations.mjs
var Zt = class extends p {
  static {
    i(this, "Moderations");
  }
  /**
   * Classifies if text and/or image inputs are potentially harmful. Learn more in
   * the [moderation guide](https://platform.openai.com/docs/guides/moderation).
   */
  create(e, t) {
    return this._client.post("/moderations", { body: e, ...t });
  }
};

// node_modules/openai/lib/ResponsesParser.mjs
function Za(s, e) {
  return !e || !au(e) ? {
    ...s,
    output_parsed: null,
    output: s.output.map((t) => t.type === "function_call" ? {
      ...t,
      parsed_arguments: null
    } : t.type === "message" ? {
      ...t,
      content: t.content.map((r) => ({
        ...r,
        parsed: null
      }))
    } : t)
  } : _i(s, e);
}
i(Za, "maybeParseResponse");
function _i(s, e) {
  let t = s.output.map((n) => {
    if (n.type === "function_call")
      return {
        ...n,
        parsed_arguments: uu(e, n)
      };
    if (n.type === "message") {
      let o = n.content.map((a) => a.type === "output_text" ? {
        ...a,
        parsed: iu(e, a.text)
      } : a);
      return {
        ...n,
        content: o
      };
    }
    return n;
  }), r = Object.assign({}, s, { output: t });
  return Object.getOwnPropertyDescriptor(s, "output_text") || yi(r), Object.defineProperty(r, "output_parsed", {
    enumerable: !0,
    get() {
      for (let n of r.output)
        if (n.type === "message") {
          for (let o of n.content)
            if (o.type === "output_text" && o.parsed !== null)
              return o.parsed;
        }
      return null;
    }
  }), r;
}
i(_i, "parseResponse");
function iu(s, e) {
  return s.text?.format?.type !== "json_schema" ? null : "$parseRaw" in s.text?.format ? (s.text?.format).$parseRaw(e) : JSON.parse(e);
}
i(iu, "parseTextFormat");
function au(s) {
  return !!Vs(s.text?.format);
}
i(au, "hasAutoParseableInput");
function lu(s) {
  return s?.$brand === "auto-parseable-tool";
}
i(lu, "isAutoParsableTool");
function cu(s, e) {
  return s.find((t) => t.type === "function" && t.name === e);
}
i(cu, "getInputToolByName");
function uu(s, e) {
  let t = cu(s.tools ?? [], e.name);
  return {
    ...e,
    ...e,
    parsed_arguments: lu(t) ? t.$parseRaw(e.arguments) : t?.strict ? JSON.parse(e.arguments) : null
  };
}
i(uu, "parseToolCall");
function yi(s) {
  let e = [];
  for (let t of s.output)
    if (t.type === "message")
      for (let r of t.content)
        r.type === "output_text" && e.push(r.text);
  s.output_text = e.join("");
}
i(yi, "addOutputText");

// node_modules/openai/resources/responses/input-items.mjs
var Zr = class extends p {
  static {
    i(this, "InputItems");
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/responses/${e}/input_items`, Zn, {
      query: t,
      ...r
    });
  }
};

// node_modules/openai/lib/responses/ResponseStream.mjs
var es = function(s, e, t, r, n) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? n.call(s, t) : n ? n.value = t : e.set(s, t), t;
}, gt = function(s, e, t, r) {
  if (t === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? r : t === "a" ? r.call(s) : r ? r.value : e.get(s);
}, ts, eo, _t, to, el, tl, rl, sl, ro = class s extends at {
  static {
    i(this, "ResponseStream");
  }
  constructor(e) {
    super(), ts.add(this), eo.set(this, void 0), _t.set(this, void 0), to.set(this, void 0), es(this, eo, e, "f");
  }
  static createResponse(e, t, r) {
    let n = new s(t);
    return n._run(() => n._createOrRetrieveResponse(e, t, {
      ...r,
      headers: { ...r?.headers, "X-Stainless-Helper-Method": "stream" }
    })), n;
  }
  async _createOrRetrieveResponse(e, t, r) {
    let n = r?.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), gt(this, ts, "m", el).call(this);
    let o, a = null;
    "response_id" in t ? (o = await e.responses.retrieve(t.response_id, { stream: !0 }, { ...r, signal: this.controller.signal, stream: !0 }), a = t.starting_after ?? null) : o = await e.responses.create({ ...t, stream: !0 }, { ...r, signal: this.controller.signal }), this._connected();
    for await (let l of o)
      gt(this, ts, "m", tl).call(this, l, a);
    if (o.controller.signal?.aborted)
      throw new D();
    return gt(this, ts, "m", rl).call(this);
  }
  [(eo = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), ts = /* @__PURE__ */ new WeakSet(), el = /* @__PURE__ */ i(function() {
    this.ended || es(this, _t, void 0, "f");
  }, "_ResponseStream_beginRequest"), tl = /* @__PURE__ */ i(function(t, r) {
    if (this.ended)
      return;
    let n = /* @__PURE__ */ i((a, l) => {
      (r == null || l.sequence_number > r) && this._emit(a, l);
    }, "maybeEmit"), o = gt(this, ts, "m", sl).call(this, t);
    switch (n("event", t), t.type) {
      case "response.output_text.delta": {
        let a = o.output[t.output_index];
        if (!a)
          throw new b(`missing output at index ${t.output_index}`);
        if (a.type === "message") {
          let l = a.content[t.content_index];
          if (!l)
            throw new b(`missing content at index ${t.content_index}`);
          if (l.type !== "output_text")
            throw new b(`expected content to be 'output_text', got ${l.type}`);
          n("response.output_text.delta", {
            ...t,
            snapshot: l.text
          });
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        let a = o.output[t.output_index];
        if (!a)
          throw new b(`missing output at index ${t.output_index}`);
        a.type === "function_call" && n("response.function_call_arguments.delta", {
          ...t,
          snapshot: a.arguments
        });
        break;
      }
      default:
        n(t.type, t);
        break;
    }
  }, "_ResponseStream_addEvent"), rl = /* @__PURE__ */ i(function() {
    if (this.ended)
      throw new b("stream has ended, this shouldn't happen");
    let t = gt(this, _t, "f");
    if (!t)
      throw new b("request ended without sending any events");
    es(this, _t, void 0, "f");
    let r = hu(t, gt(this, eo, "f"));
    return es(this, to, r, "f"), r;
  }, "_ResponseStream_endRequest"), sl = /* @__PURE__ */ i(function(t) {
    let r = gt(this, _t, "f");
    if (!r) {
      if (t.type !== "response.created")
        throw new b(`When snapshot hasn't been set yet, expected 'response.created' event, got ${t.type}`);
      return r = es(this, _t, t.response, "f"), r;
    }
    switch (t.type) {
      case "response.output_item.added": {
        r.output.push(t.item);
        break;
      }
      case "response.content_part.added": {
        let n = r.output[t.output_index];
        if (!n)
          throw new b(`missing output at index ${t.output_index}`);
        n.type === "message" && n.content.push(t.part);
        break;
      }
      case "response.output_text.delta": {
        let n = r.output[t.output_index];
        if (!n)
          throw new b(`missing output at index ${t.output_index}`);
        if (n.type === "message") {
          let o = n.content[t.content_index];
          if (!o)
            throw new b(`missing content at index ${t.content_index}`);
          if (o.type !== "output_text")
            throw new b(`expected content to be 'output_text', got ${o.type}`);
          o.text += t.delta;
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        let n = r.output[t.output_index];
        if (!n)
          throw new b(`missing output at index ${t.output_index}`);
        n.type === "function_call" && (n.arguments += t.delta);
        break;
      }
      case "response.completed": {
        es(this, _t, t.response, "f");
        break;
      }
    }
    return r;
  }, "_ResponseStream_accumulateResponse"), Symbol.asyncIterator)]() {
    let e = [], t = [], r = !1;
    return this.on("event", (n) => {
      let o = t.shift();
      o ? o.resolve(n) : e.push(n);
    }), this.on("end", () => {
      r = !0;
      for (let n of t)
        n.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), this.on("error", (n) => {
      r = !0;
      for (let o of t)
        o.reject(n);
      t.length = 0;
    }), {
      next: /* @__PURE__ */ i(async () => e.length ? { value: e.shift(), done: !1 } : r ? { value: void 0, done: !0 } : new Promise((o, a) => t.push({ resolve: o, reject: a })).then((o) => o ? { value: o, done: !1 } : { value: void 0, done: !0 }), "next"),
      return: /* @__PURE__ */ i(async () => (this.abort(), { value: void 0, done: !0 }), "return")
    };
  }
  /**
   * @returns a promise that resolves with the final Response, or rejects
   * if an error occurred or the stream ended prematurely without producing a REsponse.
   */
  async finalResponse() {
    await this.done();
    let e = gt(this, to, "f");
    if (!e)
      throw new b("stream ended without producing a ChatCompletion");
    return e;
  }
};
function hu(s, e) {
  return Za(s, e);
}
i(hu, "finalizeResponse");

// node_modules/openai/resources/responses/responses.mjs
var yt = class extends p {
  static {
    i(this, "Responses");
  }
  constructor() {
    super(...arguments), this.inputItems = new Zr(this._client);
  }
  create(e, t) {
    return this._client.post("/responses", { body: e, ...t, stream: e.stream ?? !1 })._thenUnwrap((r) => ("object" in r && r.object === "response" && yi(r), r));
  }
  retrieve(e, t = {}, r) {
    return this._client.get(`/responses/${e}`, {
      query: t,
      ...r,
      stream: t?.stream ?? !1
    });
  }
  /**
   * Deletes a model response with the given ID.
   *
   * @example
   * ```ts
   * await client.responses.del(
   *   'resp_677efb5139a88190b512bc3fef8e535d',
   * );
   * ```
   */
  del(e, t) {
    return this._client.delete(`/responses/${e}`, {
      ...t,
      headers: { Accept: "*/*", ...t?.headers }
    });
  }
  parse(e, t) {
    return this._client.responses.create(e, t)._thenUnwrap((r) => _i(r, e));
  }
  /**
   * Creates a model response stream
   */
  stream(e, t) {
    return ro.createResponse(this._client, e, t);
  }
  /**
   * Cancels a model response with the given ID. Only responses created with the
   * `background` parameter set to `true` can be cancelled.
   * [Learn more](https://platform.openai.com/docs/guides/background).
   *
   * @example
   * ```ts
   * await client.responses.cancel(
   *   'resp_677efb5139a88190b512bc3fef8e535d',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(`/responses/${e}/cancel`, {
      ...t,
      headers: { Accept: "*/*", ...t?.headers }
    });
  }
}, Zn = class extends k {
  static {
    i(this, "ResponseItemsPage");
  }
};
yt.InputItems = Zr;

// node_modules/openai/resources/uploads/parts.mjs
var rs = class extends p {
  static {
    i(this, "Parts");
  }
  /**
   * Adds a
   * [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
   * A Part represents a chunk of bytes from the file you are trying to upload.
   *
   * Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
   * maximum of 8 GB.
   *
   * It is possible to add multiple Parts in parallel. You can decide the intended
   * order of the Parts when you
   * [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
   */
  create(e, t, r) {
    return this._client.post(`/uploads/${e}/parts`, te({ body: t, ...r }));
  }
};

// node_modules/openai/resources/uploads/uploads.mjs
var wt = class extends p {
  static {
    i(this, "Uploads");
  }
  constructor() {
    super(...arguments), this.parts = new rs(this._client);
  }
  /**
   * Creates an intermediate
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
   * that you can add
   * [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
   * Currently, an Upload can accept at most 8 GB in total and expires after an hour
   * after you create it.
   *
   * Once you complete the Upload, we will create a
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * contains all the parts you uploaded. This File is usable in the rest of our
   * platform as a regular File object.
   *
   * For certain `purpose` values, the correct `mime_type` must be specified. Please
   * refer to documentation for the
   * [supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).
   *
   * For guidance on the proper filename extensions for each purpose, please follow
   * the documentation on
   * [creating a File](https://platform.openai.com/docs/api-reference/files/create).
   */
  create(e, t) {
    return this._client.post("/uploads", { body: e, ...t });
  }
  /**
   * Cancels the Upload. No Parts may be added after an Upload is cancelled.
   */
  cancel(e, t) {
    return this._client.post(`/uploads/${e}/cancel`, t);
  }
  /**
   * Completes the
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
   *
   * Within the returned Upload object, there is a nested
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * is ready to use in the rest of the platform.
   *
   * You can specify the order of the Parts by passing in an ordered list of the Part
   * IDs.
   *
   * The number of bytes uploaded upon completion must match the number of bytes
   * initially specified when creating the Upload object. No Parts may be added after
   * an Upload is completed.
   */
  complete(e, t, r) {
    return this._client.post(`/uploads/${e}/complete`, { body: t, ...r });
  }
};
wt.Parts = rs;

// node_modules/openai/lib/Util.mjs
var nl = /* @__PURE__ */ i(async (s) => {
  let e = await Promise.allSettled(s), t = e.filter((n) => n.status === "rejected");
  if (t.length) {
    for (let n of t)
      console.error(n.reason);
    throw new Error(`${t.length} promise(s) failed - see the above errors`);
  }
  let r = [];
  for (let n of e)
    n.status === "fulfilled" && r.push(n.value);
  return r;
}, "allSettledWithThrow");

// node_modules/openai/resources/vector-stores/files.mjs
var bt = class extends p {
  static {
    i(this, "Files");
  }
  /**
   * Create a vector store file by attaching a
   * [File](https://platform.openai.com/docs/api-reference/files) to a
   * [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
   */
  create(e, t, r) {
    return this._client.post(`/vector_stores/${e}/files`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Retrieves a vector store file.
   */
  retrieve(e, t, r) {
    return this._client.get(`/vector_stores/${e}/files/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Update attributes on a vector store file.
   */
  update(e, t, r, n) {
    return this._client.post(`/vector_stores/${e}/files/${t}`, {
      body: r,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers }
    });
  }
  list(e, t = {}, r) {
    return E(t) ? this.list(e, {}, t) : this._client.getAPIList(`/vector_stores/${e}/files`, xt, {
      query: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Delete a vector store file. This will remove the file from the vector store but
   * the file itself will not be deleted. To delete the file, use the
   * [delete file](https://platform.openai.com/docs/api-reference/files/delete)
   * endpoint.
   */
  del(e, t, r) {
    return this._client.delete(`/vector_stores/${e}/files/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Attach a file to the given vector store and wait for it to be processed.
   */
  async createAndPoll(e, t, r) {
    let n = await this.create(e, t, r);
    return await this.poll(e, n.id, r);
  }
  /**
   * Wait for the vector store file to finish processing.
   *
   * Note: this will return even if the file failed to process, you need to check
   * file.last_error and file.status to handle these cases
   */
  async poll(e, t, r) {
    let n = { ...r?.headers, "X-Stainless-Poll-Helper": "true" };
    for (r?.pollIntervalMs && (n["X-Stainless-Custom-Poll-Interval"] = r.pollIntervalMs.toString()); ; ) {
      let o = await this.retrieve(e, t, {
        ...r,
        headers: n
      }).withResponse(), a = o.data;
      switch (a.status) {
        case "in_progress":
          let l = 5e3;
          if (r?.pollIntervalMs)
            l = r.pollIntervalMs;
          else {
            let u = o.response.headers.get("openai-poll-after-ms");
            if (u) {
              let f = parseInt(u);
              isNaN(f) || (l = f);
            }
          }
          await qe(l);
          break;
        case "failed":
        case "completed":
          return a;
      }
    }
  }
  /**
   * Upload a file to the `files` API and then attach it to the given vector store.
   *
   * Note the file will be asynchronously processed (you can use the alternative
   * polling helper method to wait for processing to complete).
   */
  async upload(e, t, r) {
    let n = await this._client.files.create({ file: t, purpose: "assistants" }, r);
    return this.create(e, { file_id: n.id }, r);
  }
  /**
   * Add a file to a vector store and poll until processing is complete.
   */
  async uploadAndPoll(e, t, r) {
    let n = await this.upload(e, t, r);
    return await this.poll(e, n.id, r);
  }
  /**
   * Retrieve the parsed contents of a vector store file.
   */
  content(e, t, r) {
    return this._client.getAPIList(`/vector_stores/${e}/files/${t}/content`, ss, { ...r, headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers } });
  }
}, xt = class extends k {
  static {
    i(this, "VectorStoreFilesPage");
  }
}, ss = class extends Ie {
  static {
    i(this, "FileContentResponsesPage");
  }
};
bt.VectorStoreFilesPage = xt;
bt.FileContentResponsesPage = ss;

// node_modules/openai/resources/vector-stores/file-batches.mjs
var ns = class extends p {
  static {
    i(this, "FileBatches");
  }
  /**
   * Create a vector store file batch.
   */
  create(e, t, r) {
    return this._client.post(`/vector_stores/${e}/file_batches`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Retrieves a vector store file batch.
   */
  retrieve(e, t, r) {
    return this._client.get(`/vector_stores/${e}/file_batches/${t}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Cancel a vector store file batch. This attempts to cancel the processing of
   * files in this batch as soon as possible.
   */
  cancel(e, t, r) {
    return this._client.post(`/vector_stores/${e}/file_batches/${t}/cancel`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  /**
   * Create a vector store batch and poll until all files have been processed.
   */
  async createAndPoll(e, t, r) {
    let n = await this.create(e, t);
    return await this.poll(e, n.id, r);
  }
  listFiles(e, t, r = {}, n) {
    return E(r) ? this.listFiles(e, t, {}, r) : this._client.getAPIList(`/vector_stores/${e}/file_batches/${t}/files`, xt, { query: r, ...n, headers: { "OpenAI-Beta": "assistants=v2", ...n?.headers } });
  }
  /**
   * Wait for the given file batch to be processed.
   *
   * Note: this will return even if one of the files failed to process, you need to
   * check batch.file_counts.failed_count to handle this case.
   */
  async poll(e, t, r) {
    let n = { ...r?.headers, "X-Stainless-Poll-Helper": "true" };
    for (r?.pollIntervalMs && (n["X-Stainless-Custom-Poll-Interval"] = r.pollIntervalMs.toString()); ; ) {
      let { data: o, response: a } = await this.retrieve(e, t, {
        ...r,
        headers: n
      }).withResponse();
      switch (o.status) {
        case "in_progress":
          let l = 5e3;
          if (r?.pollIntervalMs)
            l = r.pollIntervalMs;
          else {
            let u = a.headers.get("openai-poll-after-ms");
            if (u) {
              let f = parseInt(u);
              isNaN(f) || (l = f);
            }
          }
          await qe(l);
          break;
        case "failed":
        case "cancelled":
        case "completed":
          return o;
      }
    }
  }
  /**
   * Uploads the given files concurrently and then creates a vector store file batch.
   *
   * The concurrency limit is configurable using the `maxConcurrency` parameter.
   */
  async uploadAndPoll(e, { files: t, fileIds: r = [] }, n) {
    if (t == null || t.length == 0)
      throw new Error("No `files` provided to process. If you've already uploaded files you should use `.createAndPoll()` instead");
    let o = n?.maxConcurrency ?? 5, a = Math.min(o, t.length), l = this._client, u = t.values(), f = [...r];
    async function y(m) {
      for (let d of m) {
        let A = await l.files.create({ file: d, purpose: "assistants" }, n);
        f.push(A.id);
      }
    }
    i(y, "processFiles");
    let h = Array(a).fill(u).map(y);
    return await nl(h), await this.createAndPoll(e, {
      file_ids: f
    });
  }
};

// node_modules/openai/resources/vector-stores/vector-stores.mjs
var ue = class extends p {
  static {
    i(this, "VectorStores");
  }
  constructor() {
    super(...arguments), this.files = new bt(this._client), this.fileBatches = new ns(this._client);
  }
  /**
   * Create a vector store.
   */
  create(e, t) {
    return this._client.post("/vector_stores", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Retrieves a vector store.
   */
  retrieve(e, t) {
    return this._client.get(`/vector_stores/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Modifies a vector store.
   */
  update(e, t, r) {
    return this._client.post(`/vector_stores/${e}`, {
      body: t,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
  list(e = {}, t) {
    return E(e) ? this.list({}, e) : this._client.getAPIList("/vector_stores", er, {
      query: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Delete a vector store.
   */
  del(e, t) {
    return this._client.delete(`/vector_stores/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t?.headers }
    });
  }
  /**
   * Search a vector store for relevant chunks based on a query and file attributes
   * filter.
   */
  search(e, t, r) {
    return this._client.getAPIList(`/vector_stores/${e}/search`, tr, {
      body: t,
      method: "post",
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r?.headers }
    });
  }
}, er = class extends k {
  static {
    i(this, "VectorStoresPage");
  }
}, tr = class extends Ie {
  static {
    i(this, "VectorStoreSearchResponsesPage");
  }
};
ue.VectorStoresPage = er;
ue.VectorStoreSearchResponsesPage = tr;
ue.Files = bt;
ue.VectorStoreFilesPage = xt;
ue.FileContentResponsesPage = ss;
ue.FileBatches = ns;

// node_modules/openai/index.mjs
var ol, S = class extends Ln {
  static {
    i(this, "OpenAI");
  }
  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL: e = Ls("OPENAI_BASE_URL"), apiKey: t = Ls("OPENAI_API_KEY"), organization: r = Ls("OPENAI_ORG_ID") ?? null, project: n = Ls("OPENAI_PROJECT_ID") ?? null, ...o } = {}) {
    if (t === void 0)
      throw new b("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
    let a = {
      apiKey: t,
      organization: r,
      project: n,
      ...o,
      baseURL: e || "https://api.openai.com/v1"
    };
    if (!a.dangerouslyAllowBrowser && Ba())
      throw new b(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
`);
    super({
      baseURL: a.baseURL,
      timeout: a.timeout ?? 6e5,
      httpAgent: a.httpAgent,
      maxRetries: a.maxRetries,
      fetch: a.fetch
    }), this.completions = new qt(this), this.chat = new He(this), this.embeddings = new Ht(this), this.files = new ht(this), this.images = new zt(this), this.audio = new Ee(this), this.moderations = new Zt(this), this.models = new mt(this), this.fineTuning = new ce(this), this.graders = new pt(this), this.vectorStores = new ue(this), this.beta = new we(this), this.batches = new it(this), this.uploads = new wt(this), this.responses = new yt(this), this.evals = new Me(this), this.containers = new Te(this), this._options = a, this.apiKey = t, this.organization = r, this.project = n;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(e) {
    return {
      ...super.defaultHeaders(e),
      "OpenAI-Organization": this.organization,
      "OpenAI-Project": this.project,
      ...this._options.defaultHeaders
    };
  }
  authHeaders(e) {
    return { Authorization: `Bearer ${this.apiKey}` };
  }
  stringifyQuery(e) {
    return Fo(e, { arrayFormat: "brackets" });
  }
};
ol = S;
S.OpenAI = ol;
S.DEFAULT_TIMEOUT = 6e5;
S.OpenAIError = b;
S.APIError = J;
S.APIConnectionError = rt;
S.APIConnectionTimeoutError = st;
S.APIUserAbortError = D;
S.NotFoundError = Ts;
S.ConflictError = Ms;
S.RateLimitError = vs;
S.BadRequestError = Cs;
S.AuthenticationError = ks;
S.InternalServerError = Fs;
S.PermissionDeniedError = Os;
S.UnprocessableEntityError = $s;
S.toFile = Ko;
S.fileFromPath = Tn;
S.Completions = qt;
S.Chat = He;
S.ChatCompletionsPage = ot;
S.Embeddings = Ht;
S.Files = ht;
S.FileObjectsPage = Vt;
S.Images = zt;
S.Audio = Ee;
S.Moderations = Zt;
S.Models = mt;
S.ModelsPage = Yt;
S.FineTuning = ce;
S.Graders = pt;
S.VectorStores = ue;
S.VectorStoresPage = er;
S.VectorStoreSearchResponsesPage = tr;
S.Beta = we;
S.Batches = it;
S.BatchesPage = Ft;
S.Uploads = wt;
S.Responses = yt;
S.Evals = Me;
S.EvalListResponsesPage = Xt;
S.Containers = Te;
S.ContainerListResponsesPage = Wt;
var wi = S;

// convex/askAI.node.ts
var _u = new Ii(Zs.persistentTextStreaming), il = `You are a helpful assistant that answers questions about this website's content.

Guidelines:
- Answer questions based ONLY on the provided context
- If the context doesn't contain relevant information, say so honestly
- Cite sources by mentioning the page/post title when referencing specific content
- Be concise but thorough
- Format responses in markdown when appropriate
- Do not make up information not present in the context`, bi = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}, al = ve(async (s, e) => {
  let t;
  try {
    t = await e.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...bi }
    });
  }
  let { streamId: r } = t;
  if (!r)
    return new Response(JSON.stringify({ error: "Missing streamId" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...bi }
    });
  let n = await s.runQuery(Ys.askAI.getSessionByStreamId, { streamId: r });
  if (!n)
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...bi }
    });
  let { question: o, model: a } = n;
  console.log("Ask AI received:", {
    streamId: r.slice(0, 20),
    question: o.slice(0, 50),
    model: a
  });
  let l = [], u = null;
  try {
    let h = process.env.OPENAI_API_KEY;
    if (!h)
      u = "OPENAI_API_KEY not configured. Please add it to your Convex dashboard environment variables.";
    else {
      let m = new wi({ apiKey: h });
      console.log("Generating embedding for query:", o.trim().slice(0, 50));
      let A = (await m.embeddings.create({
        model: "text-embedding-ada-002",
        input: o.trim()
      })).data[0].embedding;
      console.log("Embedding generated, searching...");
      let w = await s.vectorSearch("posts", "by_embedding", {
        vector: A,
        limit: 5,
        filter: /* @__PURE__ */ i((R) => R.eq("published", !0), "filter")
      }), T = await s.vectorSearch("pages", "by_embedding", {
        vector: A,
        limit: 5,
        filter: /* @__PURE__ */ i((R) => R.eq("published", !0), "filter")
      });
      console.log("Found:", w.length, "posts,", T.length, "pages");
      let O = await s.runQuery(Ys.semanticSearchQueries.fetchPostsByIds, {
        ids: w.map((R) => R._id)
      }), g = await s.runQuery(Ys.semanticSearchQueries.fetchPagesByIds, {
        ids: T.map((R) => R._id)
      }), $ = [];
      for (let R of w) {
        let C = O.find((v) => v._id === R._id);
        C && $.push({
          title: C.title,
          slug: C.slug,
          type: "post",
          content: C.content,
          score: R._score
        });
      }
      for (let R of T) {
        let C = g.find((v) => v._id === R._id);
        C && $.push({
          title: C.title,
          slug: C.slug,
          type: "page",
          content: C.content,
          score: R._score
        });
      }
      $.sort((R, C) => C.score - R.score), l = $.slice(0, 5), console.log("Search completed, found", l.length, "relevant results");
    }
  } catch (h) {
    console.error("Search error:", h), u = h instanceof Error ? h.message : "Search failed";
  }
  let f = /* @__PURE__ */ i(async (h, m, d, A) => {
    try {
      if (u) {
        await A(`**Error:** ${u}`);
        return;
      }
      if (l.length === 0) {
        await A(`I couldn't find any relevant content to answer your question. Please make sure:

1. Semantic search is enabled in siteConfig.ts
2. Content has been synced with \`npm run sync\`
3. OPENAI_API_KEY is configured in Convex dashboard`);
        return;
      }
      let T = l.map(
        (g) => `## ${g.title}
URL: /${g.slug}

${g.content.slice(0, 2e3)}`
      ).join(`

---

`), O = `Based on the following content from the website, answer this question: "${o}"

CONTEXT:
${T}

Please provide a helpful answer based on the context above.`;
      if (a === "gpt-4o") {
        let g = process.env.OPENAI_API_KEY;
        if (!g) {
          await A("**Error:** OPENAI_API_KEY not configured.");
          return;
        }
        let R = await new wi({ apiKey: g }).chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: il },
            { role: "user", content: O }
          ],
          stream: !0
        });
        for await (let C of R) {
          let v = C.choices[0]?.delta?.content;
          v && await A(v);
        }
      } else {
        let g = process.env.ANTHROPIC_API_KEY;
        if (!g) {
          await A("**Error:** ANTHROPIC_API_KEY not configured in Convex dashboard.");
          return;
        }
        let R = await new Ae({ apiKey: g }).messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: il,
          messages: [{ role: "user", content: O }]
        });
        for (let C of R.content)
          if (C.type === "text") {
            let v = C.text.split(/(\s+)/);
            for (let B of v)
              await A(B);
          }
      }
      await A(`

---

**Sources:**
`);
      for (let g of l)
        await A(`- [${g.title}](/${g.slug})
`);
    } catch (w) {
      let T = w instanceof Error ? w.message : "Unknown error";
      console.error("Generation error:", w);
      try {
        await A(`

**Error:** ${T}`);
      } catch {
      }
    }
  }, "generateAnswer"), y = await _u.stream(
    s,
    e,
    r,
    f
  );
  return y.headers.set("Access-Control-Allow-Origin", "*"), y.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS"), y.headers.set("Access-Control-Allow-Headers", "Content-Type"), y.headers.set("Vary", "Origin"), y;
}), ll = ve(async () => new Response(null, {
  status: 204,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  }
})), jb = Ri({
  args: {},
  returns: At.object({
    configured: At.boolean(),
    hasOpenAI: At.boolean(),
    hasAnthropic: At.boolean(),
    missingKeys: At.array(At.string())
  }),
  handler: /* @__PURE__ */ i(async () => {
    let s = !!process.env.OPENAI_API_KEY, e = !!process.env.ANTHROPIC_API_KEY, t = [];
    return s || t.push("OPENAI_API_KEY"), e || t.push("ANTHROPIC_API_KEY"), {
      configured: s && (e || s),
      hasOpenAI: s,
      hasAnthropic: e,
      missingKeys: t
    };
  }, "handler")
});

// convex/http.ts
var be = Si(), pe = process.env.SITE_URL || "http://localhost:5173", xi = "K12 portal";
be.route({
  path: "/rss.xml",
  method: "GET",
  handler: Ci
});
be.route({
  path: "/rss-full.xml",
  method: "GET",
  handler: ki
});
be.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: ve(async (s) => {
    let e = await s.runQuery(me.posts.getAllPosts), t = await s.runQuery(me.pages.getAllPages), r = await s.runQuery(me.posts.getAllTags), n = await s.runQuery(me.posts.getAllAuthors), a = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
      // Homepage
      `  <url>
    <loc>${pe}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
      // All posts
      ...e.map(
        (l) => `  <url>
    <loc>${pe}/${l.slug}</loc>
    <lastmod>${l.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      ),
      // All pages
      ...t.map(
        (l) => `  <url>
    <loc>${pe}/${l.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      ),
      // All tag pages
      ...r.map(
        (l) => `  <url>
    <loc>${pe}/tags/${encodeURIComponent(l.tag.toLowerCase())}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      ),
      // All author pages
      ...n.map(
        (l) => `  <url>
    <loc>${pe}/author/${encodeURIComponent(l.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
    ].join(`
`)}
</urlset>`;
    return new Response(a, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=7200"
      }
    });
  })
});
be.route({
  path: "/api/posts",
  method: "GET",
  handler: ve(async (s) => {
    let e = await s.runQuery(me.posts.getAllPosts), t = {
      site: xi,
      url: pe,
      description: "A site built with markdown-sync framework.",
      posts: e.map((r) => ({
        title: r.title,
        slug: r.slug,
        description: r.description,
        date: r.date,
        readTime: r.readTime,
        tags: r.tags,
        url: `${pe}/${r.slug}`,
        markdownUrl: `${pe}/api/post?slug=${r.slug}`
      }))
    };
    return new Response(JSON.stringify(t, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  })
});
be.route({
  path: "/api/post",
  method: "GET",
  handler: ve(async (s, e) => {
    let t = new URL(e.url), r = t.searchParams.get("slug"), n = t.searchParams.get("format") || "json";
    if (!r)
      return new Response(JSON.stringify({ error: "Missing slug parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    let o = await s.runQuery(me.posts.getPostBySlug, { slug: r });
    if (!o)
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    if (n === "markdown" || n === "md") {
      let l = `# ${o.title}

> ${o.description}

**Published:** ${o.date}${o.readTime ? ` | **Read time:** ${o.readTime}` : ""}
**Tags:** ${o.tags.join(", ")}
**URL:** ${pe}/${o.slug}

---

${o.content}`;
      return new Response(l, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=600",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    let a = {
      title: o.title,
      slug: o.slug,
      description: o.description,
      date: o.date,
      readTime: o.readTime,
      tags: o.tags,
      url: `${pe}/${o.slug}`,
      content: o.content
    };
    return new Response(JSON.stringify(a, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  })
});
be.route({
  path: "/api/export",
  method: "GET",
  handler: ve(async (s) => {
    let e = await s.runQuery(me.posts.getAllPosts), t = await Promise.all(
      e.map(async (n) => {
        let o = await s.runQuery(me.posts.getPostBySlug, {
          slug: n.slug
        });
        return {
          title: n.title,
          slug: n.slug,
          description: n.description,
          date: n.date,
          readTime: n.readTime,
          tags: n.tags,
          url: `${pe}/${n.slug}`,
          content: o?.content || ""
        };
      })
    ), r = {
      site: xi,
      url: pe,
      description: "A site built with markdown-sync framework.",
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      totalPosts: t.length,
      posts: t
    };
    return new Response(JSON.stringify(r, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  })
});
function cl(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
i(cl, "escapeHtml");
function ul(s) {
  let e = process.env.SITE_URL || "http://localhost:5173", t = "K12 portal", r = `${e}/images/og-default.svg`, n = `${e}/${s.slug}`, o = r;
  s.image && (o = s.image.startsWith("http") ? s.image : `${e}${s.image}`);
  let a = cl(s.title), l = cl(s.description), u = s.type || "post";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic SEO -->
  <title>${a} | ${t}</title>
  <meta name="description" content="${l}">
  <link rel="canonical" href="${n}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${a}">
  <meta property="og:description" content="${l}">
  <meta property="og:image" content="${o}">
  <meta property="og:url" content="${n}">
  <meta property="og:type" content="${u === "post" ? "article" : "website"}">
  <meta property="og:site_name" content="${t}">${s.date ? `
  <meta property="article:published_time" content="${s.date}">` : ""}
  
  <!-- Hreflang for language/region targeting -->
  <link rel="alternate" hreflang="en" href="${n}">
  <link rel="alternate" hreflang="x-default" href="${n}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${a}">
  <meta name="twitter:description" content="${l}">
  <meta name="twitter:image" content="${o}">
  <meta name="twitter:site" content="">
  <meta name="twitter:creator" content="">

  <!-- Redirect to actual page after a brief delay for crawlers -->
  <script>
    setTimeout(() => {
      window.location.href = "${n}";
    }, 100);
  <\/script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 50px auto; padding: 20px; color: #111;">
  <h1 style="font-size: 32px; margin-bottom: 16px;">${a}</h1>
  <p style="color: #666; margin-bottom: 24px;">${l}</p>${s.date ? `
  <p style="font-size: 14px; color: #999;">${s.date}${s.readTime ? ` \xB7 ${s.readTime}` : ""}</p>` : ""}
  <p style="margin-top: 24px;"><small>Redirecting to full ${u}...</small></p>
</body>
</html>`;
}
i(ul, "generateMetaHtml");
be.route({
  path: "/meta/post",
  method: "GET",
  handler: ve(async (s, e) => {
    let r = new URL(e.url).searchParams.get("slug");
    if (!r)
      return new Response("Missing slug parameter", { status: 400 });
    try {
      let n = await s.runQuery(me.posts.getPostBySlug, { slug: r });
      if (n) {
        let a = ul({
          title: n.title,
          description: n.description,
          slug: n.slug,
          date: n.date,
          readTime: n.readTime,
          image: n.image,
          type: "post"
        });
        return new Response(a, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
          }
        });
      }
      let o = await s.runQuery(me.pages.getPageBySlug, { slug: r });
      if (o) {
        let a = ul({
          title: o.title,
          description: o.excerpt || `${o.title} - ${xi}`,
          slug: o.slug,
          image: o.image,
          type: "page"
        });
        return new Response(a, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
          }
        });
      }
      return new Response("Content not found", { status: 404 });
    } catch {
      return new Response("Internal server error", { status: 500 });
    }
  })
});
be.route({
  path: "/ask-ai-stream",
  method: "POST",
  handler: al
});
be.route({
  path: "/ask-ai-stream",
  method: "OPTIONS",
  handler: ll
});
no && Ei(be, Zs.fs, no, {
  pathPrefix: "/fs",
  uploadAuth: /* @__PURE__ */ i(async () => !0, "uploadAuth"),
  downloadAuth: /* @__PURE__ */ i(async () => !0, "downloadAuth")
});
var Gb = be;
export {
  Gb as default
};
//# sourceMappingURL=http.js.map
