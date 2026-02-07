var Ge = Object.create;
var R = Object.defineProperty;
var Qe = Object.getOwnPropertyDescriptor;
var He = Object.getOwnPropertyNames;
var ze = Object.getPrototypeOf, We = Object.prototype.hasOwnProperty;
var n = (e, t) => R(e, "name", { value: t, configurable: !0 }), jt = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var Mt = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), Ut = (e, t) => {
  for (var r in t)
    R(e, r, { get: t[r], enumerable: !0 });
}, Ye = (e, t, r, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of He(t))
      !We.call(e, s) && s !== r && R(e, s, { get: () => t[s], enumerable: !(o = Qe(t, s)) || o.enumerable });
  return e;
};
var Jt = (e, t, r) => (r = e != null ? Ge(ze(e)) : {}, Ye(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? R(r, "default", { value: e, enumerable: !0 }) : r,
  e
));

// node_modules/convex/dist/esm/values/base64.js
var g = [], w = [], Xe = Uint8Array, te = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (A = 0, xe = te.length; A < xe; ++A)
  g[A] = te[A], w[te.charCodeAt(A)] = A;
var A, xe;
w[45] = 62;
w[95] = 63;
function Ke(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = e.indexOf("=");
  r === -1 && (r = t);
  var o = r === t ? 0 : 4 - r % 4;
  return [r, o];
}
n(Ke, "getLens");
function Ze(e, t, r) {
  return (t + r) * 3 / 4 - r;
}
n(Ze, "_byteLength");
function O(e) {
  var t, r = Ke(e), o = r[0], s = r[1], c = new Xe(Ze(e, o, s)), a = 0, d = s > 0 ? o - 4 : o, f;
  for (f = 0; f < d; f += 4)
    t = w[e.charCodeAt(f)] << 18 | w[e.charCodeAt(f + 1)] << 12 | w[e.charCodeAt(f + 2)] << 6 | w[e.charCodeAt(f + 3)], c[a++] = t >> 16 & 255, c[a++] = t >> 8 & 255, c[a++] = t & 255;
  return s === 2 && (t = w[e.charCodeAt(f)] << 2 | w[e.charCodeAt(f + 1)] >> 4, c[a++] = t & 255), s === 1 && (t = w[e.charCodeAt(f)] << 10 | w[e.charCodeAt(f + 1)] << 4 | w[e.charCodeAt(f + 2)] >> 2, c[a++] = t >> 8 & 255, c[a++] = t & 255), c;
}
n(O, "toByteArray");
function et(e) {
  return g[e >> 18 & 63] + g[e >> 12 & 63] + g[e >> 6 & 63] + g[e & 63];
}
n(et, "tripletToBase64");
function tt(e, t, r) {
  for (var o, s = [], c = t; c < r; c += 3)
    o = (e[c] << 16 & 16711680) + (e[c + 1] << 8 & 65280) + (e[c + 2] & 255), s.push(et(o));
  return s.join("");
}
n(tt, "encodeChunk");
function _(e) {
  for (var t, r = e.length, o = r % 3, s = [], c = 16383, a = 0, d = r - o; a < d; a += c)
    s.push(
      tt(
        e,
        a,
        a + c > d ? d : a + c
      )
    );
  return o === 1 ? (t = e[r - 1], s.push(g[t >> 2] + g[t << 4 & 63] + "==")) : o === 2 && (t = (e[r - 2] << 8) + e[r - 1], s.push(
    g[t >> 10] + g[t >> 4 & 63] + g[t << 2 & 63] + "="
  )), s.join("");
}
n(_, "fromByteArray");

// node_modules/convex/dist/esm/common/index.js
function E(e) {
  if (e === void 0)
    return {};
  if (!q(e))
    throw new Error(
      `The arguments to a Convex function must be an object. Received: ${e}`
    );
  return e;
}
n(E, "parseArgs");
function q(e) {
  let t = typeof e == "object", r = Object.getPrototypeOf(e), o = r === null || r === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  r?.constructor?.name === "Object";
  return t && o;
}
n(q, "isSimpleObject");

// node_modules/convex/dist/esm/values/value.js
var Ae = !0, I = BigInt("-9223372036854775808"), se = BigInt("9223372036854775807"), ne = BigInt("0"), rt = BigInt("8"), nt = BigInt("256");
function Ee(e) {
  return Number.isNaN(e) || !Number.isFinite(e) || Object.is(e, -0);
}
n(Ee, "isSpecial");
function ot(e) {
  e < ne && (e -= I + I);
  let t = e.toString(16);
  t.length % 2 === 1 && (t = "0" + t);
  let r = new Uint8Array(new ArrayBuffer(8)), o = 0;
  for (let s of t.match(/.{2}/g).reverse())
    r.set([parseInt(s, 16)], o++), e >>= rt;
  return _(r);
}
n(ot, "slowBigIntToBase64");
function st(e) {
  let t = O(e);
  if (t.byteLength !== 8)
    throw new Error(
      `Received ${t.byteLength} bytes, expected 8 for $integer`
    );
  let r = ne, o = ne;
  for (let s of t)
    r += BigInt(s) * nt ** o, o++;
  return r > se && (r += I + I), r;
}
n(st, "slowBase64ToBigInt");
function it(e) {
  if (e < I || se < e)
    throw new Error(
      `BigInt ${e} does not fit into a 64-bit signed integer.`
    );
  let t = new ArrayBuffer(8);
  return new DataView(t).setBigInt64(0, e, !0), _(new Uint8Array(t));
}
n(it, "modernBigIntToBase64");
function at(e) {
  let t = O(e);
  if (t.byteLength !== 8)
    throw new Error(
      `Received ${t.byteLength} bytes, expected 8 for $integer`
    );
  return new DataView(t.buffer).getBigInt64(0, !0);
}
n(at, "modernBase64ToBigInt");
var ct = DataView.prototype.setBigInt64 ? it : ot, ut = DataView.prototype.getBigInt64 ? at : st, be = 1024;
function oe(e) {
  if (e.length > be)
    throw new Error(
      `Field name ${e} exceeds maximum field name length ${be}.`
    );
  if (e.startsWith("$"))
    throw new Error(`Field name ${e} starts with a '$', which is reserved.`);
  for (let t = 0; t < e.length; t += 1) {
    let r = e.charCodeAt(t);
    if (r < 32 || r >= 127)
      throw new Error(
        `Field name ${e} has invalid character '${e[t]}': Field names can only contain non-control ASCII characters`
      );
  }
}
n(oe, "validateObjectField");
function y(e) {
  if (e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string")
    return e;
  if (Array.isArray(e))
    return e.map((o) => y(o));
  if (typeof e != "object")
    throw new Error(`Unexpected type of ${e}`);
  let t = Object.entries(e);
  if (t.length === 1) {
    let o = t[0][0];
    if (o === "$bytes") {
      if (typeof e.$bytes != "string")
        throw new Error(`Malformed $bytes field on ${e}`);
      return O(e.$bytes).buffer;
    }
    if (o === "$integer") {
      if (typeof e.$integer != "string")
        throw new Error(`Malformed $integer field on ${e}`);
      return ut(e.$integer);
    }
    if (o === "$float") {
      if (typeof e.$float != "string")
        throw new Error(`Malformed $float field on ${e}`);
      let s = O(e.$float);
      if (s.byteLength !== 8)
        throw new Error(
          `Received ${s.byteLength} bytes, expected 8 for $float`
        );
      let a = new DataView(s.buffer).getFloat64(0, Ae);
      if (!Ee(a))
        throw new Error(`Float ${a} should be encoded as a number`);
      return a;
    }
    if (o === "$set")
      throw new Error(
        "Received a Set which is no longer supported as a Convex type."
      );
    if (o === "$map")
      throw new Error(
        "Received a Map which is no longer supported as a Convex type."
      );
  }
  let r = {};
  for (let [o, s] of Object.entries(e))
    oe(o), r[o] = y(s);
  return r;
}
n(y, "jsonToConvex");
var ve = 16384;
function S(e) {
  let t = JSON.stringify(e, (r, o) => o === void 0 ? "undefined" : typeof o == "bigint" ? `${o.toString()}n` : o);
  if (t.length > ve) {
    let r = "[...truncated]", o = ve - r.length, s = t.codePointAt(o - 1);
    return s !== void 0 && s > 65535 && (o -= 1), t.substring(0, o) + r;
  }
  return t;
}
n(S, "stringifyValueForError");
function B(e, t, r, o) {
  if (e === void 0) {
    let a = r && ` (present at path ${r} in original object ${S(
      t
    )})`;
    throw new Error(
      `undefined is not a valid Convex value${a}. To learn about Convex's supported types, see https://docs.convex.dev/using/types.`
    );
  }
  if (e === null)
    return e;
  if (typeof e == "bigint") {
    if (e < I || se < e)
      throw new Error(
        `BigInt ${e} does not fit into a 64-bit signed integer.`
      );
    return { $integer: ct(e) };
  }
  if (typeof e == "number")
    if (Ee(e)) {
      let a = new ArrayBuffer(8);
      return new DataView(a).setFloat64(0, e, Ae), { $float: _(new Uint8Array(a)) };
    } else
      return e;
  if (typeof e == "boolean" || typeof e == "string")
    return e;
  if (e instanceof ArrayBuffer)
    return { $bytes: _(new Uint8Array(e)) };
  if (Array.isArray(e))
    return e.map(
      (a, d) => B(a, t, r + `[${d}]`, !1)
    );
  if (e instanceof Set)
    throw new Error(
      re(r, "Set", [...e], t)
    );
  if (e instanceof Map)
    throw new Error(
      re(r, "Map", [...e], t)
    );
  if (!q(e)) {
    let a = e?.constructor?.name, d = a ? `${a} ` : "";
    throw new Error(
      re(r, d, e, t)
    );
  }
  let s = {}, c = Object.entries(e);
  c.sort(([a, d], [f, we]) => a === f ? 0 : a < f ? -1 : 1);
  for (let [a, d] of c)
    d !== void 0 ? (oe(a), s[a] = B(d, t, r + `.${a}`, !1)) : o && (oe(a), s[a] = Se(
      d,
      t,
      r + `.${a}`
    ));
  return s;
}
n(B, "convexToJsonInternal");
function re(e, t, r, o) {
  return e ? `${t}${S(
    r
  )} is not a supported Convex type (present at path ${e} in original object ${S(
    o
  )}). To learn about Convex's supported types, see https://docs.convex.dev/using/types.` : `${t}${S(
    r
  )} is not a supported Convex type.`;
}
n(re, "errorMessageForUnsupportedType");
function Se(e, t, r) {
  if (e === void 0)
    return { $undefined: null };
  if (t === void 0)
    throw new Error(
      `Programming error. Current value is ${S(
        e
      )} but original value is undefined`
    );
  return B(e, t, r, !1);
}
n(Se, "convexOrUndefinedToJsonInternal");
function h(e) {
  return B(e, e, "", !1);
}
n(h, "convexToJson");
function C(e) {
  return Se(e, e, "");
}
n(C, "convexOrUndefinedToJson");

// node_modules/convex/dist/esm/values/validators.js
var lt = Object.defineProperty, ft = /* @__PURE__ */ n((e, t, r) => t in e ? lt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, "__defNormalProp"), u = /* @__PURE__ */ n((e, t, r) => ft(e, typeof t != "symbol" ? t + "" : t, r), "__publicField"), pt = "https://docs.convex.dev/error#undefined-validator";
function $(e, t) {
  let r = t !== void 0 ? ` for field "${t}"` : "";
  throw new Error(
    `A validator is undefined${r} in ${e}. This is often caused by circular imports. See ${pt} for details.`
  );
}
n($, "throwUndefinedValidatorError");
var m = class {
  static {
    n(this, "BaseValidator");
  }
  constructor({ isOptional: t }) {
    u(this, "type"), u(this, "fieldPaths"), u(this, "isOptional"), u(this, "isConvexValidator"), this.isOptional = t, this.isConvexValidator = !0;
  }
}, j = class e extends m {
  static {
    n(this, "VId");
  }
  /**
   * Usually you'd use `v.id(tableName)` instead.
   */
  constructor({
    isOptional: t,
    tableName: r
  }) {
    if (super({ isOptional: t }), u(this, "tableName"), u(this, "kind", "id"), typeof r != "string")
      throw new Error("v.id(tableName) requires a string");
    this.tableName = r;
  }
  /** @internal */
  get json() {
    return { type: "id", tableName: this.tableName };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      tableName: this.tableName
    });
  }
}, N = class e extends m {
  static {
    n(this, "VFloat64");
  }
  constructor() {
    super(...arguments), u(this, "kind", "float64");
  }
  /** @internal */
  get json() {
    return { type: "number" };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional"
    });
  }
}, P = class e extends m {
  static {
    n(this, "VInt64");
  }
  constructor() {
    super(...arguments), u(this, "kind", "int64");
  }
  /** @internal */
  get json() {
    return { type: "bigint" };
  }
  /** @internal */
  asOptional() {
    return new e({ isOptional: "optional" });
  }
}, M = class e extends m {
  static {
    n(this, "VBoolean");
  }
  constructor() {
    super(...arguments), u(this, "kind", "boolean");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional"
    });
  }
}, U = class e extends m {
  static {
    n(this, "VBytes");
  }
  constructor() {
    super(...arguments), u(this, "kind", "bytes");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new e({ isOptional: "optional" });
  }
}, J = class e extends m {
  static {
    n(this, "VString");
  }
  constructor() {
    super(...arguments), u(this, "kind", "string");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional"
    });
  }
}, V = class e extends m {
  static {
    n(this, "VNull");
  }
  constructor() {
    super(...arguments), u(this, "kind", "null");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new e({ isOptional: "optional" });
  }
}, L = class e extends m {
  static {
    n(this, "VAny");
  }
  constructor() {
    super(...arguments), u(this, "kind", "any");
  }
  /** @internal */
  get json() {
    return {
      type: this.kind
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional"
    });
  }
}, k = class e extends m {
  static {
    n(this, "VObject");
  }
  /**
   * Usually you'd use `v.object({ ... })` instead.
   */
  constructor({
    isOptional: t,
    fields: r
  }) {
    super({ isOptional: t }), u(this, "fields"), u(this, "kind", "object"), globalThis.Object.entries(r).forEach(([o, s]) => {
      if (s === void 0 && $("v.object()", o), !s.isConvexValidator)
        throw new Error("v.object() entries must be validators");
    }), this.fields = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: globalThis.Object.fromEntries(
        globalThis.Object.entries(this.fields).map(([t, r]) => [
          t,
          {
            fieldType: r.json,
            optional: r.isOptional === "optional"
          }
        ])
      )
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      fields: this.fields
    });
  }
  /**
   * Create a new VObject with the specified fields omitted.
   * @param fields The field names to omit from this VObject.
   */
  omit(...t) {
    let r = { ...this.fields };
    for (let o of t)
      delete r[o];
    return new e({
      isOptional: this.isOptional,
      fields: r
    });
  }
  /**
   * Create a new VObject with only the specified fields.
   * @param fields The field names to pick from this VObject.
   */
  pick(...t) {
    let r = {};
    for (let o of t)
      r[o] = this.fields[o];
    return new e({
      isOptional: this.isOptional,
      fields: r
    });
  }
  /**
   * Create a new VObject with all fields marked as optional.
   */
  partial() {
    let t = {};
    for (let [r, o] of globalThis.Object.entries(this.fields))
      t[r] = o.asOptional();
    return new e({
      isOptional: this.isOptional,
      fields: t
    });
  }
  /**
   * Create a new VObject with additional fields merged in.
   * @param fields An object with additional validators to merge into this VObject.
   */
  extend(t) {
    return new e({
      isOptional: this.isOptional,
      fields: { ...this.fields, ...t }
    });
  }
}, D = class e extends m {
  static {
    n(this, "VLiteral");
  }
  /**
   * Usually you'd use `v.literal(value)` instead.
   */
  constructor({ isOptional: t, value: r }) {
    if (super({ isOptional: t }), u(this, "value"), u(this, "kind", "literal"), typeof r != "string" && typeof r != "boolean" && typeof r != "number" && typeof r != "bigint")
      throw new Error("v.literal(value) must be a string, number, or boolean");
    this.value = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: h(this.value)
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      value: this.value
    });
  }
}, G = class e extends m {
  static {
    n(this, "VArray");
  }
  /**
   * Usually you'd use `v.array(element)` instead.
   */
  constructor({
    isOptional: t,
    element: r
  }) {
    super({ isOptional: t }), u(this, "element"), u(this, "kind", "array"), r === void 0 && $("v.array()"), this.element = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: this.element.json
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      element: this.element
    });
  }
}, Q = class e extends m {
  static {
    n(this, "VRecord");
  }
  /**
   * Usually you'd use `v.record(key, value)` instead.
   */
  constructor({
    isOptional: t,
    key: r,
    value: o
  }) {
    if (super({ isOptional: t }), u(this, "key"), u(this, "value"), u(this, "kind", "record"), r === void 0 && $("v.record()", "key"), o === void 0 && $("v.record()", "value"), r.isOptional === "optional")
      throw new Error("Record validator cannot have optional keys");
    if (o.isOptional === "optional")
      throw new Error("Record validator cannot have optional values");
    if (!r.isConvexValidator || !o.isConvexValidator)
      throw new Error("Key and value of v.record() but be validators");
    this.key = r, this.value = o;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      // This cast is needed because TypeScript thinks the key type is too wide
      keys: this.key.json,
      values: {
        fieldType: this.value.json,
        optional: !1
      }
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      key: this.key,
      value: this.value
    });
  }
}, H = class e extends m {
  static {
    n(this, "VUnion");
  }
  /**
   * Usually you'd use `v.union(...members)` instead.
   */
  constructor({ isOptional: t, members: r }) {
    super({ isOptional: t }), u(this, "members"), u(this, "kind", "union"), r.forEach((o, s) => {
      if (o === void 0 && $("v.union()", `member at index ${s}`), !o.isConvexValidator)
        throw new Error("All members of v.union() must be validators");
    }), this.members = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: this.members.map((t) => t.json)
    };
  }
  /** @internal */
  asOptional() {
    return new e({
      isOptional: "optional",
      members: this.members
    });
  }
};

// node_modules/convex/dist/esm/values/validator.js
function ie(e) {
  return !!e.isConvexValidator;
}
n(ie, "isValidator");
function z(e) {
  return ie(e) ? e : i.object(e);
}
n(z, "asObjectValidator");
var i = {
  /**
   * Validates that the value corresponds to an ID of a document in given table.
   * @param tableName The name of the table.
   */
  id: /* @__PURE__ */ n((e) => new j({
    isOptional: "required",
    tableName: e
  }), "id"),
  /**
   * Validates that the value is of type Null.
   */
  null: /* @__PURE__ */ n(() => new V({ isOptional: "required" }), "null"),
  /**
   * Validates that the value is of Convex type Float64 (Number in JS).
   *
   * Alias for `v.float64()`
   */
  number: /* @__PURE__ */ n(() => new N({ isOptional: "required" }), "number"),
  /**
   * Validates that the value is of Convex type Float64 (Number in JS).
   */
  float64: /* @__PURE__ */ n(() => new N({ isOptional: "required" }), "float64"),
  /**
   * @deprecated Use `v.int64()` instead
   */
  bigint: /* @__PURE__ */ n(() => new P({ isOptional: "required" }), "bigint"),
  /**
   * Validates that the value is of Convex type Int64 (BigInt in JS).
   */
  int64: /* @__PURE__ */ n(() => new P({ isOptional: "required" }), "int64"),
  /**
   * Validates that the value is of type Boolean.
   */
  boolean: /* @__PURE__ */ n(() => new M({ isOptional: "required" }), "boolean"),
  /**
   * Validates that the value is of type String.
   */
  string: /* @__PURE__ */ n(() => new J({ isOptional: "required" }), "string"),
  /**
   * Validates that the value is of Convex type Bytes (constructed in JS via `ArrayBuffer`).
   */
  bytes: /* @__PURE__ */ n(() => new U({ isOptional: "required" }), "bytes"),
  /**
   * Validates that the value is equal to the given literal value.
   * @param literal The literal value to compare against.
   */
  literal: /* @__PURE__ */ n((e) => new D({ isOptional: "required", value: e }), "literal"),
  /**
   * Validates that the value is an Array of the given element type.
   * @param element The validator for the elements of the array.
   */
  array: /* @__PURE__ */ n((e) => new G({ isOptional: "required", element: e }), "array"),
  /**
   * Validates that the value is an Object with the given properties.
   * @param fields An object specifying the validator for each property.
   */
  object: /* @__PURE__ */ n((e) => new k({ isOptional: "required", fields: e }), "object"),
  /**
   * Validates that the value is a Record with keys and values that match the given types.
   * @param keys The validator for the keys of the record. This cannot contain string literals.
   * @param values The validator for the values of the record.
   */
  record: /* @__PURE__ */ n((e, t) => new Q({
    isOptional: "required",
    key: e,
    value: t
  }), "record"),
  /**
   * Validates that the value matches one of the given validators.
   * @param members The validators to match against.
   */
  union: /* @__PURE__ */ n((...e) => new H({
    isOptional: "required",
    members: e
  }), "union"),
  /**
   * Does not validate the value.
   */
  any: /* @__PURE__ */ n(() => new L({ isOptional: "required" }), "any"),
  /**
   * Allows not specifying a value for a property in an Object.
   * @param value The property value validator to make optional.
   *
   * ```typescript
   * const objectWithOptionalFields = v.object({
   *   requiredField: v.string(),
   *   optionalField: v.optional(v.string()),
   * });
   * ```
   */
  optional: /* @__PURE__ */ n((e) => e.asOptional(), "optional"),
  /**
   * Allows specifying a value or null.
   */
  nullable: /* @__PURE__ */ n((e) => i.union(e, i.null()), "nullable")
};

// node_modules/convex/dist/esm/values/errors.js
var dt = Object.defineProperty, ht = /* @__PURE__ */ n((e, t, r) => t in e ? dt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, "__defNormalProp"), ae = /* @__PURE__ */ n((e, t, r) => ht(e, typeof t != "symbol" ? t + "" : t, r), "__publicField"), Ie, Te, mt = Symbol.for("ConvexError"), W = class extends (Te = Error, Ie = mt, Te) {
  static {
    n(this, "ConvexError");
  }
  constructor(t) {
    super(typeof t == "string" ? t : S(t)), ae(this, "name", "ConvexError"), ae(this, "data"), ae(this, Ie, !0), this.data = t;
  }
};

// node_modules/convex/dist/esm/values/compare_utf8.js
var Oe = /* @__PURE__ */ n(() => Array.from({ length: 4 }, () => 0), "arr"), nr = Oe(), or = Oe();

// node_modules/convex/dist/esm/index.js
var p = "1.31.7";

// node_modules/convex/dist/esm/server/impl/syscall.js
async function l(e, t) {
  if (typeof Convex > "u" || Convex.asyncSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  let r;
  try {
    r = await Convex.asyncSyscall(e, JSON.stringify(t));
  } catch (o) {
    if (o.data !== void 0) {
      let s = new W(o.message);
      throw s.data = y(o.data), s;
    }
    throw new Error(o.message);
  }
  return JSON.parse(r);
}
n(l, "performAsyncSyscall");
function Y(e, t) {
  if (typeof Convex > "u" || Convex.jsSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  return Convex.jsSyscall(e, t);
}
n(Y, "performJsSyscall");

// node_modules/convex/dist/esm/server/functionName.js
var F = Symbol.for("functionName");

// node_modules/convex/dist/esm/server/components/paths.js
var ce = Symbol.for("toReferencePath");
function yt(e) {
  return e[ce] ?? null;
}
n(yt, "extractReferencePath");
function wt(e) {
  return e.startsWith("function://");
}
n(wt, "isFunctionHandle");
function b(e) {
  let t;
  if (typeof e == "string")
    wt(e) ? t = { functionHandle: e } : t = { name: e };
  else if (e[F])
    t = { name: e[F] };
  else {
    let r = yt(e);
    if (!r)
      throw new Error(`${e} is not a functionReference`);
    t = { reference: r };
  }
  return t;
}
n(b, "getFunctionAddress");

// node_modules/convex/dist/esm/server/impl/actions_impl.js
function ue(e, t, r) {
  return {
    ...b(t),
    args: h(E(r)),
    version: p,
    requestId: e
  };
}
n(ue, "syscallArgs");
function _e(e) {
  return {
    runQuery: /* @__PURE__ */ n(async (t, r) => {
      let o = await l(
        "1.0/actions/query",
        ue(e, t, r)
      );
      return y(o);
    }, "runQuery"),
    runMutation: /* @__PURE__ */ n(async (t, r) => {
      let o = await l(
        "1.0/actions/mutation",
        ue(e, t, r)
      );
      return y(o);
    }, "runMutation"),
    runAction: /* @__PURE__ */ n(async (t, r) => {
      let o = await l(
        "1.0/actions/action",
        ue(e, t, r)
      );
      return y(o);
    }, "runAction")
  };
}
n(_e, "setupActionCalls");

// node_modules/convex/dist/esm/server/vector_search.js
var xt = Object.defineProperty, gt = /* @__PURE__ */ n((e, t, r) => t in e ? xt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, "__defNormalProp"), Ce = /* @__PURE__ */ n((e, t, r) => gt(e, typeof t != "symbol" ? t + "" : t, r), "__publicField"), X = class {
  static {
    n(this, "FilterExpression");
  }
  /**
   * @internal
   */
  constructor() {
    Ce(this, "_isExpression"), Ce(this, "_value");
  }
};

// node_modules/convex/dist/esm/server/impl/validate.js
function x(e, t, r, o) {
  if (e === void 0)
    throw new TypeError(
      `Must provide arg ${t} \`${o}\` to \`${r}\``
    );
}
n(x, "validateArg");

// node_modules/convex/dist/esm/server/impl/vector_search_impl.js
var bt = Object.defineProperty, vt = /* @__PURE__ */ n((e, t, r) => t in e ? bt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, "__defNormalProp"), le = /* @__PURE__ */ n((e, t, r) => vt(e, typeof t != "symbol" ? t + "" : t, r), "__publicField");
function $e(e) {
  return async (t, r, o) => {
    if (x(t, 1, "vectorSearch", "tableName"), x(r, 2, "vectorSearch", "indexName"), x(o, 3, "vectorSearch", "query"), !o.vector || !Array.isArray(o.vector) || o.vector.length === 0)
      throw Error("`vector` must be a non-empty Array in vectorSearch");
    return await new fe(
      e,
      t + "." + r,
      o
    ).collect();
  };
}
n($e, "setupActionVectorSearch");
var fe = class {
  static {
    n(this, "VectorQueryImpl");
  }
  constructor(t, r, o) {
    le(this, "requestId"), le(this, "state"), this.requestId = t;
    let s = o.filter ? K(o.filter(At)) : null;
    this.state = {
      type: "preparing",
      query: {
        indexName: r,
        limit: o.limit,
        vector: o.vector,
        expressions: s
      }
    };
  }
  async collect() {
    if (this.state.type === "consumed")
      throw new Error("This query is closed and can't emit any more values.");
    let t = this.state.query;
    this.state = { type: "consumed" };
    let { results: r } = await l("1.0/actions/vectorSearch", {
      requestId: this.requestId,
      version: p,
      query: t
    });
    return r;
  }
}, T = class extends X {
  static {
    n(this, "ExpressionImpl");
  }
  constructor(t) {
    super(), le(this, "inner"), this.inner = t;
  }
  serialize() {
    return this.inner;
  }
};
function K(e) {
  return e instanceof T ? e.serialize() : { $literal: C(e) };
}
n(K, "serializeExpression");
var At = {
  //  Comparisons  /////////////////////////////////////////////////////////////
  eq(e, t) {
    if (typeof e != "string")
      throw new Error("The first argument to `q.eq` must be a field name.");
    return new T({
      $eq: [
        K(new T({ $field: e })),
        K(t)
      ]
    });
  },
  //  Logic  ///////////////////////////////////////////////////////////////////
  or(...e) {
    return new T({ $or: e.map(K) });
  }
};

// node_modules/convex/dist/esm/server/impl/authentication_impl.js
function Ne(e) {
  return {
    getUserIdentity: /* @__PURE__ */ n(async () => await l("1.0/getUserIdentity", {
      requestId: e
    }), "getUserIdentity")
  };
}
n(Ne, "setupAuth");

// node_modules/convex/dist/esm/server/impl/scheduler_impl.js
function Pe(e) {
  return {
    runAfter: /* @__PURE__ */ n(async (t, r, o) => {
      let s = {
        requestId: e,
        ...It(t, r, o)
      };
      return await l("1.0/actions/schedule", s);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (t, r, o) => {
      let s = {
        requestId: e,
        ...Tt(t, r, o)
      };
      return await l("1.0/actions/schedule", s);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (t) => {
      x(t, 1, "cancel", "id");
      let r = { id: h(t) };
      return await l("1.0/actions/cancel_job", r);
    }, "cancel")
  };
}
n(Pe, "setupActionScheduler");
function It(e, t, r) {
  if (typeof e != "number")
    throw new Error("`delayMs` must be a number");
  if (!isFinite(e))
    throw new Error("`delayMs` must be a finite number");
  if (e < 0)
    throw new Error("`delayMs` must be non-negative");
  let o = E(r), s = b(t), c = (Date.now() + e) / 1e3;
  return {
    ...s,
    ts: c,
    args: h(o),
    version: p
  };
}
n(It, "runAfterSyscallArgs");
function Tt(e, t, r) {
  let o;
  if (e instanceof Date)
    o = e.valueOf() / 1e3;
  else if (typeof e == "number")
    o = e / 1e3;
  else
    throw new Error("The invoke time must a Date or a timestamp");
  let s = b(t), c = E(r);
  return {
    ...s,
    ts: o,
    args: h(c),
    version: p
  };
}
n(Tt, "runAtSyscallArgs");

// node_modules/convex/dist/esm/server/impl/storage_impl.js
function Fe(e) {
  return {
    getUrl: /* @__PURE__ */ n(async (t) => (x(t, 1, "getUrl", "storageId"), await l("1.0/storageGetUrl", {
      requestId: e,
      version: p,
      storageId: t
    })), "getUrl"),
    getMetadata: /* @__PURE__ */ n(async (t) => await l("1.0/storageGetMetadata", {
      requestId: e,
      version: p,
      storageId: t
    }), "getMetadata")
  };
}
n(Fe, "setupStorageReader");
function Re(e) {
  let t = Fe(e);
  return {
    generateUploadUrl: /* @__PURE__ */ n(async () => await l("1.0/storageGenerateUploadUrl", {
      requestId: e,
      version: p
    }), "generateUploadUrl"),
    delete: /* @__PURE__ */ n(async (r) => {
      await l("1.0/storageDelete", {
        requestId: e,
        version: p,
        storageId: r
      });
    }, "delete"),
    getUrl: t.getUrl,
    getMetadata: t.getMetadata
  };
}
n(Re, "setupStorageWriter");
function qe(e) {
  return {
    ...Re(e),
    store: /* @__PURE__ */ n(async (r, o) => await Y("storage/storeBlob", {
      requestId: e,
      version: p,
      blob: r,
      options: o
    }), "store"),
    get: /* @__PURE__ */ n(async (r) => await Y("storage/getBlob", {
      requestId: e,
      version: p,
      storageId: r
    }), "get")
  };
}
n(qe, "setupStorageActionWriter");

// node_modules/convex/dist/esm/server/impl/registration_impl.js
async function Ot(e, t, r) {
  let o;
  try {
    o = await Promise.resolve(e(t, ...r));
  } catch (s) {
    throw _t(s);
  }
  return o;
}
n(Ot, "invokeFunction");
function Be(e, t) {
  return (r, o) => (globalThis.console.warn(
    `Convex functions should not directly call other Convex functions. Consider calling a helper function instead. e.g. \`export const foo = ${e}(...); await foo(ctx);\` is not supported. See https://docs.convex.dev/production/best-practices/#use-helper-functions-to-write-shared-code`
  ), t(r, o));
}
n(Be, "dontCallDirectly");
function _t(e) {
  if (typeof e == "object" && e !== null && Symbol.for("ConvexError") in e) {
    let t = e;
    return t.data = JSON.stringify(
      h(t.data === void 0 ? null : t.data)
    ), t.ConvexErrorSymbol = Symbol.for("ConvexError"), t;
  } else
    return e;
}
n(_t, "serializeConvexErrorData");
function je() {
  if (typeof window > "u" || window.__convexAllowFunctionsInBrowser)
    return;
  (Object.getOwnPropertyDescriptor(globalThis, "window")?.get?.toString().includes("[native code]") ?? !1) && console.error(
    "Convex functions should not be imported in the browser. This will throw an error in future versions of `convex`. If this is a false negative, please report it to Convex support."
  );
}
n(je, "assertNotBrowser");
function Me(e, t) {
  if (t === void 0)
    throw new Error(
      `A validator is undefined for field "${e}". This is often caused by circular imports. See https://docs.convex.dev/error#undefined-validator for details.`
    );
  return t;
}
n(Me, "strictReplacer");
function Ue(e) {
  return () => {
    let t = i.any();
    return typeof e == "object" && e.args !== void 0 && (t = z(e.args)), JSON.stringify(t.json, Me);
  };
}
n(Ue, "exportArgs");
function Je(e) {
  return () => {
    let t;
    return typeof e == "object" && e.returns !== void 0 && (t = z(e.returns)), JSON.stringify(t ? t.json : null, Me);
  };
}
n(Je, "exportReturns");
async function Ve(e, t, r) {
  let o = y(JSON.parse(r)), c = {
    ..._e(t),
    auth: Ne(t),
    scheduler: Pe(t),
    storage: qe(t),
    vectorSearch: $e(t)
  }, a = await Ot(e, c, o);
  return JSON.stringify(h(a === void 0 ? null : a));
}
n(Ve, "invokeAction");
var pe = /* @__PURE__ */ n(((e) => {
  let t = typeof e == "function" ? e : e.handler, r = Be("action", t);
  return je(), r.isAction = !0, r.isPublic = !0, r.invokeAction = (o, s) => Ve(t, o, s), r.exportArgs = Ue(e), r.exportReturns = Je(e), r._handler = t, r;
}), "actionGeneric"), de = /* @__PURE__ */ n(((e) => {
  let t = typeof e == "function" ? e : e.handler, r = Be("internalAction", t);
  return je(), r.isAction = !0, r.isInternal = !0, r.invokeAction = (o, s) => Ve(t, o, s), r.exportArgs = Ue(e), r.exportReturns = Je(e), r._handler = t, r;
}), "internalActionGeneric");

// node_modules/convex/dist/esm/server/pagination.js
var So = i.object({
  numItems: i.number(),
  cursor: i.union(i.string(), i.null()),
  endCursor: i.optional(i.union(i.string(), i.null())),
  id: i.optional(i.number()),
  maximumRowsRead: i.optional(i.number()),
  maximumBytesRead: i.optional(i.number())
});

// node_modules/convex/dist/esm/server/api.js
function Le(e = []) {
  let t = {
    get(r, o) {
      if (typeof o == "string") {
        let s = [...e, o];
        return Le(s);
      } else if (o === F) {
        if (e.length < 2) {
          let a = ["api", ...e].join(".");
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${a}\``
          );
        }
        let s = e.slice(0, -1).join("/"), c = e[e.length - 1];
        return c === "default" ? s : s + ":" + c;
      } else return o === Symbol.toStringTag ? "FunctionReference" : void 0;
    }
  };
  return new Proxy({}, t);
}
n(Le, "createApi");
var Z = Le();

// node_modules/convex/dist/esm/server/components/index.js
function ke(e, t) {
  let r = {
    get(o, s) {
      if (typeof s == "string") {
        let c = [...t, s];
        return ke(e, c);
      } else if (s === ce) {
        if (t.length < 1) {
          let c = [e, ...t].join(".");
          throw new Error(
            `API path is expected to be of the form \`${e}.childComponent.functionName\`. Found: \`${c}\``
          );
        }
        return "_reference/childComponent/" + t.join("/");
      } else
        return;
    }
  };
  return new Proxy({}, r);
}
n(ke, "createChildComponents");
var he = /* @__PURE__ */ n(() => ke("components", []), "componentsGeneric");

// node_modules/convex/dist/esm/server/schema.js
var $t = Object.defineProperty, Nt = /* @__PURE__ */ n((e, t, r) => t in e ? $t(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, "__defNormalProp"), v = /* @__PURE__ */ n((e, t, r) => Nt(e, typeof t != "symbol" ? t + "" : t, r), "__publicField"), ee = class {
  static {
    n(this, "TableDefinition");
  }
  /**
   * @internal
   */
  constructor(t) {
    v(this, "indexes"), v(this, "stagedDbIndexes"), v(this, "searchIndexes"), v(this, "stagedSearchIndexes"), v(this, "vectorIndexes"), v(this, "stagedVectorIndexes"), v(this, "validator"), this.indexes = [], this.stagedDbIndexes = [], this.searchIndexes = [], this.stagedSearchIndexes = [], this.vectorIndexes = [], this.stagedVectorIndexes = [], this.validator = t;
  }
  /**
   * This API is experimental: it may change or disappear.
   *
   * Returns indexes defined on this table.
   * Intended for the advanced use cases of dynamically deciding which index to use for a query.
   * If you think you need this, please chime in on ths issue in the Convex JS GitHub repo.
   * https://github.com/get-convex/convex-js/issues/49
   */
  " indexes"() {
    return this.indexes;
  }
  index(t, r) {
    return Array.isArray(r) ? this.indexes.push({
      indexDescriptor: t,
      fields: r
    }) : r.staged ? this.stagedDbIndexes.push({
      indexDescriptor: t,
      fields: r.fields
    }) : this.indexes.push({
      indexDescriptor: t,
      fields: r.fields
    }), this;
  }
  searchIndex(t, r) {
    return r.staged ? this.stagedSearchIndexes.push({
      indexDescriptor: t,
      searchField: r.searchField,
      filterFields: r.filterFields || []
    }) : this.searchIndexes.push({
      indexDescriptor: t,
      searchField: r.searchField,
      filterFields: r.filterFields || []
    }), this;
  }
  vectorIndex(t, r) {
    return r.staged ? this.stagedVectorIndexes.push({
      indexDescriptor: t,
      vectorField: r.vectorField,
      dimensions: r.dimensions,
      filterFields: r.filterFields || []
    }) : this.vectorIndexes.push({
      indexDescriptor: t,
      vectorField: r.vectorField,
      dimensions: r.dimensions,
      filterFields: r.filterFields || []
    }), this;
  }
  /**
   * Work around for https://github.com/microsoft/TypeScript/issues/57035
   */
  self() {
    return this;
  }
  /**
   * Export the contents of this definition.
   *
   * This is called internally by the Convex framework.
   * @internal
   */
  export() {
    let t = this.validator.json;
    if (typeof t != "object")
      throw new Error(
        "Invalid validator: please make sure that the parameter of `defineTable` is valid (see https://docs.convex.dev/database/schemas)"
      );
    return {
      indexes: this.indexes,
      stagedDbIndexes: this.stagedDbIndexes,
      searchIndexes: this.searchIndexes,
      stagedSearchIndexes: this.stagedSearchIndexes,
      vectorIndexes: this.vectorIndexes,
      stagedVectorIndexes: this.stagedVectorIndexes,
      documentType: t
    };
  }
};
function me(e) {
  return ie(e) ? new ee(e) : new ee(i.object(e));
}
n(me, "defineTable");
var ye = class {
  static {
    n(this, "SchemaDefinition");
  }
  /**
   * @internal
   */
  constructor(t, r) {
    v(this, "tables"), v(this, "strictTableNameTypes"), v(this, "schemaValidation"), this.tables = t, this.schemaValidation = r?.schemaValidation === void 0 ? !0 : r.schemaValidation;
  }
  /**
   * Export the contents of this definition.
   *
   * This is called internally by the Convex framework.
   * @internal
   */
  export() {
    return JSON.stringify({
      tables: Object.entries(this.tables).map(([t, r]) => {
        let {
          indexes: o,
          stagedDbIndexes: s,
          searchIndexes: c,
          stagedSearchIndexes: a,
          vectorIndexes: d,
          stagedVectorIndexes: f,
          documentType: we
        } = r.export();
        return {
          tableName: t,
          indexes: o,
          stagedDbIndexes: s,
          searchIndexes: c,
          stagedSearchIndexes: a,
          vectorIndexes: d,
          stagedVectorIndexes: f,
          documentType: we
        };
      }),
      schemaValidation: this.schemaValidation
    });
  }
};
function De(e, t) {
  return new ye(e, t);
}
n(De, "defineSchema");
var zo = De({
  _scheduled_functions: me({
    name: i.string(),
    args: i.array(i.any()),
    scheduledTime: i.float64(),
    completedTime: i.optional(i.float64()),
    state: i.union(
      i.object({ kind: i.literal("pending") }),
      i.object({ kind: i.literal("inProgress") }),
      i.object({ kind: i.literal("success") }),
      i.object({ kind: i.literal("failed"), error: i.string() }),
      i.object({ kind: i.literal("canceled") })
    )
  }),
  _storage: me({
    sha256: i.string(),
    size: i.float64(),
    contentType: i.optional(i.string())
  })
});

// convex/_generated/server.js
var vs = pe, As = de;

// convex/_generated/api.js
var Is = Z, Ts = Z, Os = he();

export {
  n as a,
  jt as b,
  Mt as c,
  Ut as d,
  Jt as e,
  i as f,
  vs as g,
  As as h,
  Is as i,
  Ts as j
};
//# sourceMappingURL=27R56OS5.js.map
