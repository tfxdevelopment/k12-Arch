var Ft = Object.defineProperty;
var n = (t, e) => Ft(t, "name", { value: e, configurable: !0 });

// node_modules/convex/dist/esm/values/base64.js
var E = [], b = [], Rt = Uint8Array, Ae = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (O = 0, Ze = Ae.length; O < Ze; ++O)
  E[O] = Ae[O], b[Ae.charCodeAt(O)] = O;
var O, Ze;
b[45] = 62;
b[95] = 63;
function Bt(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = t.indexOf("=");
  r === -1 && (r = e);
  var o = r === e ? 0 : 4 - r % 4;
  return [r, o];
}
n(Bt, "getLens");
function qt(t, e, r) {
  return (e + r) * 3 / 4 - r;
}
n(qt, "_byteLength");
function M(t) {
  var e, r = Bt(t), o = r[0], s = r[1], i = new Rt(qt(t, o, s)), a = 0, c = s > 0 ? o - 4 : o, d;
  for (d = 0; d < c; d += 4)
    e = b[t.charCodeAt(d)] << 18 | b[t.charCodeAt(d + 1)] << 12 | b[t.charCodeAt(d + 2)] << 6 | b[t.charCodeAt(d + 3)], i[a++] = e >> 16 & 255, i[a++] = e >> 8 & 255, i[a++] = e & 255;
  return s === 2 && (e = b[t.charCodeAt(d)] << 2 | b[t.charCodeAt(d + 1)] >> 4, i[a++] = e & 255), s === 1 && (e = b[t.charCodeAt(d)] << 10 | b[t.charCodeAt(d + 1)] << 4 | b[t.charCodeAt(d + 2)] >> 2, i[a++] = e >> 8 & 255, i[a++] = e & 255), i;
}
n(M, "toByteArray");
function jt(t) {
  return E[t >> 18 & 63] + E[t >> 12 & 63] + E[t >> 6 & 63] + E[t & 63];
}
n(jt, "tripletToBase64");
function Mt(t, e, r) {
  for (var o, s = [], i = e; i < r; i += 3)
    o = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(jt(o));
  return s.join("");
}
n(Mt, "encodeChunk");
function U(t) {
  for (var e, r = t.length, o = r % 3, s = [], i = 16383, a = 0, c = r - o; a < c; a += i)
    s.push(
      Mt(
        t,
        a,
        a + i > c ? c : a + i
      )
    );
  return o === 1 ? (e = t[r - 1], s.push(E[e >> 2] + E[e << 4 & 63] + "==")) : o === 2 && (e = (t[r - 2] << 8) + t[r - 1], s.push(
    E[e >> 10] + E[e >> 4 & 63] + E[e << 2 & 63] + "="
  )), s.join("");
}
n(U, "fromByteArray");

// node_modules/convex/dist/esm/common/index.js
function I(t) {
  if (t === void 0)
    return {};
  if (!W(t))
    throw new Error(
      `The arguments to a Convex function must be an object. Received: ${t}`
    );
  return t;
}
n(I, "parseArgs");
function W(t) {
  let e = typeof t == "object", r = Object.getPrototypeOf(t), o = r === null || r === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  r?.constructor?.name === "Object";
  return e && o;
}
n(W, "isSimpleObject");

// node_modules/convex/dist/esm/values/value.js
var nt = !0, P = BigInt("-9223372036854775808"), Te = BigInt("9223372036854775807"), Se = BigInt("0"), Ut = BigInt("8"), Jt = BigInt("256");
function ot(t) {
  return Number.isNaN(t) || !Number.isFinite(t) || Object.is(t, -0);
}
n(ot, "isSpecial");
function Vt(t) {
  t < Se && (t -= P + P);
  let e = t.toString(16);
  e.length % 2 === 1 && (e = "0" + e);
  let r = new Uint8Array(new ArrayBuffer(8)), o = 0;
  for (let s of e.match(/.{2}/g).reverse())
    r.set([parseInt(s, 16)], o++), t >>= Ut;
  return U(r);
}
n(Vt, "slowBigIntToBase64");
function Lt(t) {
  let e = M(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  let r = Se, o = Se;
  for (let s of e)
    r += BigInt(s) * Jt ** o, o++;
  return r > Te && (r += P + P), r;
}
n(Lt, "slowBase64ToBigInt");
function kt(t) {
  if (t < P || Te < t)
    throw new Error(
      `BigInt ${t} does not fit into a 64-bit signed integer.`
    );
  let e = new ArrayBuffer(8);
  return new DataView(e).setBigInt64(0, t, !0), U(new Uint8Array(e));
}
n(kt, "modernBigIntToBase64");
function Dt(t) {
  let e = M(t);
  if (e.byteLength !== 8)
    throw new Error(
      `Received ${e.byteLength} bytes, expected 8 for $integer`
    );
  return new DataView(e.buffer).getBigInt64(0, !0);
}
n(Dt, "modernBase64ToBigInt");
var Ht = DataView.prototype.setBigInt64 ? kt : Vt, Qt = DataView.prototype.getBigInt64 ? Dt : Lt, tt = 1024;
function Ie(t) {
  if (t.length > tt)
    throw new Error(
      `Field name ${t} exceeds maximum field name length ${tt}.`
    );
  if (t.startsWith("$"))
    throw new Error(`Field name ${t} starts with a '$', which is reserved.`);
  for (let e = 0; e < t.length; e += 1) {
    let r = t.charCodeAt(e);
    if (r < 32 || r >= 127)
      throw new Error(
        `Field name ${t} has invalid character '${t[e]}': Field names can only contain non-control ASCII characters`
      );
  }
}
n(Ie, "validateObjectField");
function y(t) {
  if (t === null || typeof t == "boolean" || typeof t == "number" || typeof t == "string")
    return t;
  if (Array.isArray(t))
    return t.map((o) => y(o));
  if (typeof t != "object")
    throw new Error(`Unexpected type of ${t}`);
  let e = Object.entries(t);
  if (e.length === 1) {
    let o = e[0][0];
    if (o === "$bytes") {
      if (typeof t.$bytes != "string")
        throw new Error(`Malformed $bytes field on ${t}`);
      return M(t.$bytes).buffer;
    }
    if (o === "$integer") {
      if (typeof t.$integer != "string")
        throw new Error(`Malformed $integer field on ${t}`);
      return Qt(t.$integer);
    }
    if (o === "$float") {
      if (typeof t.$float != "string")
        throw new Error(`Malformed $float field on ${t}`);
      let s = M(t.$float);
      if (s.byteLength !== 8)
        throw new Error(
          `Received ${s.byteLength} bytes, expected 8 for $float`
        );
      let a = new DataView(s.buffer).getFloat64(0, nt);
      if (!ot(a))
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
  for (let [o, s] of Object.entries(t))
    Ie(o), r[o] = y(s);
  return r;
}
n(y, "jsonToConvex");
var rt = 16384;
function _(t) {
  let e = JSON.stringify(t, (r, o) => o === void 0 ? "undefined" : typeof o == "bigint" ? `${o.toString()}n` : o);
  if (e.length > rt) {
    let r = "[...truncated]", o = rt - r.length, s = e.codePointAt(o - 1);
    return s !== void 0 && s > 65535 && (o -= 1), e.substring(0, o) + r;
  }
  return e;
}
n(_, "stringifyValueForError");
function J(t, e, r, o) {
  if (t === void 0) {
    let a = r && ` (present at path ${r} in original object ${_(
      e
    )})`;
    throw new Error(
      `undefined is not a valid Convex value${a}. To learn about Convex's supported types, see https://docs.convex.dev/using/types.`
    );
  }
  if (t === null)
    return t;
  if (typeof t == "bigint") {
    if (t < P || Te < t)
      throw new Error(
        `BigInt ${t} does not fit into a 64-bit signed integer.`
      );
    return { $integer: Ht(t) };
  }
  if (typeof t == "number")
    if (ot(t)) {
      let a = new ArrayBuffer(8);
      return new DataView(a).setFloat64(0, t, nt), { $float: U(new Uint8Array(a)) };
    } else
      return t;
  if (typeof t == "boolean" || typeof t == "string")
    return t;
  if (t instanceof ArrayBuffer)
    return { $bytes: U(new Uint8Array(t)) };
  if (Array.isArray(t))
    return t.map(
      (a, c) => J(a, e, r + `[${c}]`, !1)
    );
  if (t instanceof Set)
    throw new Error(
      Ee(r, "Set", [...t], e)
    );
  if (t instanceof Map)
    throw new Error(
      Ee(r, "Map", [...t], e)
    );
  if (!W(t)) {
    let a = t?.constructor?.name, c = a ? `${a} ` : "";
    throw new Error(
      Ee(r, c, t, e)
    );
  }
  let s = {}, i = Object.entries(t);
  i.sort(([a, c], [d, T]) => a === d ? 0 : a < d ? -1 : 1);
  for (let [a, c] of i)
    c !== void 0 ? (Ie(a), s[a] = J(c, e, r + `.${a}`, !1)) : o && (Ie(a), s[a] = st(
      c,
      e,
      r + `.${a}`
    ));
  return s;
}
n(J, "convexToJsonInternal");
function Ee(t, e, r, o) {
  return t ? `${e}${_(
    r
  )} is not a supported Convex type (present at path ${t} in original object ${_(
    o
  )}). To learn about Convex's supported types, see https://docs.convex.dev/using/types.` : `${e}${_(
    r
  )} is not a supported Convex type.`;
}
n(Ee, "errorMessageForUnsupportedType");
function st(t, e, r) {
  if (t === void 0)
    return { $undefined: null };
  if (e === void 0)
    throw new Error(
      `Programming error. Current value is ${_(
        t
      )} but original value is undefined`
    );
  return J(t, e, r, !1);
}
n(st, "convexOrUndefinedToJsonInternal");
function h(t) {
  return J(t, t, "", !1);
}
n(h, "convexToJson");
function v(t) {
  return st(t, t, "");
}
n(v, "convexOrUndefinedToJson");
function it(t) {
  return J(t, t, "", !0);
}
n(it, "patchValueToJson");

// node_modules/convex/dist/esm/values/validators.js
var zt = Object.defineProperty, Gt = /* @__PURE__ */ n((t, e, r) => e in t ? zt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), m = /* @__PURE__ */ n((t, e, r) => Gt(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), Wt = "https://docs.convex.dev/error#undefined-validator";
function V(t, e) {
  let r = e !== void 0 ? ` for field "${e}"` : "";
  throw new Error(
    `A validator is undefined${r} in ${t}. This is often caused by circular imports. See ${Wt} for details.`
  );
}
n(V, "throwUndefinedValidatorError");
var x = class {
  static {
    n(this, "BaseValidator");
  }
  constructor({ isOptional: e }) {
    m(this, "type"), m(this, "fieldPaths"), m(this, "isOptional"), m(this, "isConvexValidator"), this.isOptional = e, this.isConvexValidator = !0;
  }
}, Y = class t extends x {
  static {
    n(this, "VId");
  }
  /**
   * Usually you'd use `v.id(tableName)` instead.
   */
  constructor({
    isOptional: e,
    tableName: r
  }) {
    if (super({ isOptional: e }), m(this, "tableName"), m(this, "kind", "id"), typeof r != "string")
      throw new Error("v.id(tableName) requires a string");
    this.tableName = r;
  }
  /** @internal */
  get json() {
    return { type: "id", tableName: this.tableName };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional",
      tableName: this.tableName
    });
  }
}, L = class t extends x {
  static {
    n(this, "VFloat64");
  }
  constructor() {
    super(...arguments), m(this, "kind", "float64");
  }
  /** @internal */
  get json() {
    return { type: "number" };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional"
    });
  }
}, k = class t extends x {
  static {
    n(this, "VInt64");
  }
  constructor() {
    super(...arguments), m(this, "kind", "int64");
  }
  /** @internal */
  get json() {
    return { type: "bigint" };
  }
  /** @internal */
  asOptional() {
    return new t({ isOptional: "optional" });
  }
}, X = class t extends x {
  static {
    n(this, "VBoolean");
  }
  constructor() {
    super(...arguments), m(this, "kind", "boolean");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional"
    });
  }
}, K = class t extends x {
  static {
    n(this, "VBytes");
  }
  constructor() {
    super(...arguments), m(this, "kind", "bytes");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new t({ isOptional: "optional" });
  }
}, Z = class t extends x {
  static {
    n(this, "VString");
  }
  constructor() {
    super(...arguments), m(this, "kind", "string");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional"
    });
  }
}, ee = class t extends x {
  static {
    n(this, "VNull");
  }
  constructor() {
    super(...arguments), m(this, "kind", "null");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new t({ isOptional: "optional" });
  }
}, te = class t extends x {
  static {
    n(this, "VAny");
  }
  constructor() {
    super(...arguments), m(this, "kind", "any");
  }
  /** @internal */
  get json() {
    return {
      type: this.kind
    };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional"
    });
  }
}, re = class t extends x {
  static {
    n(this, "VObject");
  }
  /**
   * Usually you'd use `v.object({ ... })` instead.
   */
  constructor({
    isOptional: e,
    fields: r
  }) {
    super({ isOptional: e }), m(this, "fields"), m(this, "kind", "object"), globalThis.Object.entries(r).forEach(([o, s]) => {
      if (s === void 0 && V("v.object()", o), !s.isConvexValidator)
        throw new Error("v.object() entries must be validators");
    }), this.fields = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: globalThis.Object.fromEntries(
        globalThis.Object.entries(this.fields).map(([e, r]) => [
          e,
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
    return new t({
      isOptional: "optional",
      fields: this.fields
    });
  }
  /**
   * Create a new VObject with the specified fields omitted.
   * @param fields The field names to omit from this VObject.
   */
  omit(...e) {
    let r = { ...this.fields };
    for (let o of e)
      delete r[o];
    return new t({
      isOptional: this.isOptional,
      fields: r
    });
  }
  /**
   * Create a new VObject with only the specified fields.
   * @param fields The field names to pick from this VObject.
   */
  pick(...e) {
    let r = {};
    for (let o of e)
      r[o] = this.fields[o];
    return new t({
      isOptional: this.isOptional,
      fields: r
    });
  }
  /**
   * Create a new VObject with all fields marked as optional.
   */
  partial() {
    let e = {};
    for (let [r, o] of globalThis.Object.entries(this.fields))
      e[r] = o.asOptional();
    return new t({
      isOptional: this.isOptional,
      fields: e
    });
  }
  /**
   * Create a new VObject with additional fields merged in.
   * @param fields An object with additional validators to merge into this VObject.
   */
  extend(e) {
    return new t({
      isOptional: this.isOptional,
      fields: { ...this.fields, ...e }
    });
  }
}, ne = class t extends x {
  static {
    n(this, "VLiteral");
  }
  /**
   * Usually you'd use `v.literal(value)` instead.
   */
  constructor({ isOptional: e, value: r }) {
    if (super({ isOptional: e }), m(this, "value"), m(this, "kind", "literal"), typeof r != "string" && typeof r != "boolean" && typeof r != "number" && typeof r != "bigint")
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
    return new t({
      isOptional: "optional",
      value: this.value
    });
  }
}, oe = class t extends x {
  static {
    n(this, "VArray");
  }
  /**
   * Usually you'd use `v.array(element)` instead.
   */
  constructor({
    isOptional: e,
    element: r
  }) {
    super({ isOptional: e }), m(this, "element"), m(this, "kind", "array"), r === void 0 && V("v.array()"), this.element = r;
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
    return new t({
      isOptional: "optional",
      element: this.element
    });
  }
}, se = class t extends x {
  static {
    n(this, "VRecord");
  }
  /**
   * Usually you'd use `v.record(key, value)` instead.
   */
  constructor({
    isOptional: e,
    key: r,
    value: o
  }) {
    if (super({ isOptional: e }), m(this, "key"), m(this, "value"), m(this, "kind", "record"), r === void 0 && V("v.record()", "key"), o === void 0 && V("v.record()", "value"), r.isOptional === "optional")
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
    return new t({
      isOptional: "optional",
      key: this.key,
      value: this.value
    });
  }
}, ie = class t extends x {
  static {
    n(this, "VUnion");
  }
  /**
   * Usually you'd use `v.union(...members)` instead.
   */
  constructor({ isOptional: e, members: r }) {
    super({ isOptional: e }), m(this, "members"), m(this, "kind", "union"), r.forEach((o, s) => {
      if (o === void 0 && V("v.union()", `member at index ${s}`), !o.isConvexValidator)
        throw new Error("All members of v.union() must be validators");
    }), this.members = r;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: this.members.map((e) => e.json)
    };
  }
  /** @internal */
  asOptional() {
    return new t({
      isOptional: "optional",
      members: this.members
    });
  }
};

// node_modules/convex/dist/esm/values/validator.js
function Oe(t) {
  return !!t.isConvexValidator;
}
n(Oe, "isValidator");
function ae(t) {
  return Oe(t) ? t : u.object(t);
}
n(ae, "asObjectValidator");
var u = {
  /**
   * Validates that the value corresponds to an ID of a document in given table.
   * @param tableName The name of the table.
   */
  id: /* @__PURE__ */ n((t) => new Y({
    isOptional: "required",
    tableName: t
  }), "id"),
  /**
   * Validates that the value is of type Null.
   */
  null: /* @__PURE__ */ n(() => new ee({ isOptional: "required" }), "null"),
  /**
   * Validates that the value is of Convex type Float64 (Number in JS).
   *
   * Alias for `v.float64()`
   */
  number: /* @__PURE__ */ n(() => new L({ isOptional: "required" }), "number"),
  /**
   * Validates that the value is of Convex type Float64 (Number in JS).
   */
  float64: /* @__PURE__ */ n(() => new L({ isOptional: "required" }), "float64"),
  /**
   * @deprecated Use `v.int64()` instead
   */
  bigint: /* @__PURE__ */ n(() => new k({ isOptional: "required" }), "bigint"),
  /**
   * Validates that the value is of Convex type Int64 (BigInt in JS).
   */
  int64: /* @__PURE__ */ n(() => new k({ isOptional: "required" }), "int64"),
  /**
   * Validates that the value is of type Boolean.
   */
  boolean: /* @__PURE__ */ n(() => new X({ isOptional: "required" }), "boolean"),
  /**
   * Validates that the value is of type String.
   */
  string: /* @__PURE__ */ n(() => new Z({ isOptional: "required" }), "string"),
  /**
   * Validates that the value is of Convex type Bytes (constructed in JS via `ArrayBuffer`).
   */
  bytes: /* @__PURE__ */ n(() => new K({ isOptional: "required" }), "bytes"),
  /**
   * Validates that the value is equal to the given literal value.
   * @param literal The literal value to compare against.
   */
  literal: /* @__PURE__ */ n((t) => new ne({ isOptional: "required", value: t }), "literal"),
  /**
   * Validates that the value is an Array of the given element type.
   * @param element The validator for the elements of the array.
   */
  array: /* @__PURE__ */ n((t) => new oe({ isOptional: "required", element: t }), "array"),
  /**
   * Validates that the value is an Object with the given properties.
   * @param fields An object specifying the validator for each property.
   */
  object: /* @__PURE__ */ n((t) => new re({ isOptional: "required", fields: t }), "object"),
  /**
   * Validates that the value is a Record with keys and values that match the given types.
   * @param keys The validator for the keys of the record. This cannot contain string literals.
   * @param values The validator for the values of the record.
   */
  record: /* @__PURE__ */ n((t, e) => new se({
    isOptional: "required",
    key: t,
    value: e
  }), "record"),
  /**
   * Validates that the value matches one of the given validators.
   * @param members The validators to match against.
   */
  union: /* @__PURE__ */ n((...t) => new ie({
    isOptional: "required",
    members: t
  }), "union"),
  /**
   * Does not validate the value.
   */
  any: /* @__PURE__ */ n(() => new te({ isOptional: "required" }), "any"),
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
  optional: /* @__PURE__ */ n((t) => t.asOptional(), "optional"),
  /**
   * Allows specifying a value or null.
   */
  nullable: /* @__PURE__ */ n((t) => u.union(t, u.null()), "nullable")
};

// node_modules/convex/dist/esm/values/errors.js
var Yt = Object.defineProperty, Xt = /* @__PURE__ */ n((t, e, r) => e in t ? Yt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), _e = /* @__PURE__ */ n((t, e, r) => Xt(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), at, ut, Kt = Symbol.for("ConvexError"), ue = class extends (ut = Error, at = Kt, ut) {
  static {
    n(this, "ConvexError");
  }
  constructor(e) {
    super(typeof e == "string" ? e : _(e)), _e(this, "name", "ConvexError"), _e(this, "data"), _e(this, at, !0), this.data = e;
  }
};

// node_modules/convex/dist/esm/values/compare_utf8.js
var ct = /* @__PURE__ */ n(() => Array.from({ length: 4 }, () => 0), "arr"), ln = ct(), fn = ct();

// node_modules/convex/dist/esm/server/pagination.js
var Nn = u.object({
  numItems: u.number(),
  cursor: u.union(u.string(), u.null()),
  endCursor: u.optional(u.union(u.string(), u.null())),
  id: u.optional(u.number()),
  maximumRowsRead: u.optional(u.number()),
  maximumBytesRead: u.optional(u.number())
});

// node_modules/convex/dist/esm/server/functionName.js
var F = Symbol.for("functionName");

// node_modules/convex/dist/esm/server/components/paths.js
var Ce = Symbol.for("toReferencePath");
function Zt(t) {
  return t[Ce] ?? null;
}
n(Zt, "extractReferencePath");
function er(t) {
  return t.startsWith("function://");
}
n(er, "isFunctionHandle");
function A(t) {
  let e;
  if (typeof t == "string")
    er(t) ? e = { functionHandle: t } : e = { name: t };
  else if (t[F])
    e = { name: t[F] };
  else {
    let r = Zt(t);
    if (!r)
      throw new Error(`${t} is not a functionReference`);
    e = { reference: r };
  }
  return e;
}
n(A, "getFunctionAddress");

// node_modules/convex/dist/esm/server/api.js
function $e(t) {
  let e = A(t);
  if (e.name === void 0)
    throw e.functionHandle !== void 0 ? new Error(
      `Expected function reference like "api.file.func" or "internal.file.func", but received function handle ${e.functionHandle}`
    ) : e.reference !== void 0 ? new Error(
      `Expected function reference in the current component like "api.file.func" or "internal.file.func", but received reference ${e.reference}`
    ) : new Error(
      `Expected function reference like "api.file.func" or "internal.file.func", but received ${JSON.stringify(e)}`
    );
  if (typeof t == "string") return t;
  let r = t[F];
  if (!r)
    throw new Error(`${t} is not a functionReference`);
  return r;
}
n($e, "getFunctionName");
function lt(t = []) {
  let e = {
    get(r, o) {
      if (typeof o == "string") {
        let s = [...t, o];
        return lt(s);
      } else if (o === F) {
        if (t.length < 2) {
          let a = ["api", ...t].join(".");
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${a}\``
          );
        }
        let s = t.slice(0, -1).join("/"), i = t[t.length - 1];
        return i === "default" ? s : s + ":" + i;
      } else return o === Symbol.toStringTag ? "FunctionReference" : void 0;
    }
  };
  return new Proxy({}, e);
}
n(lt, "createApi");
var tr = lt();

// node_modules/convex/dist/esm/server/cron.js
var rr = Object.defineProperty, nr = /* @__PURE__ */ n((t, e, r) => e in t ? rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), ft = /* @__PURE__ */ n((t, e, r) => nr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), or = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
], sr = /* @__PURE__ */ n(() => new Fe(), "cronJobs");
function Ne(t) {
  if (!Number.isInteger(t) || t <= 0)
    throw new Error("Interval must be an integer greater than 0");
}
n(Ne, "validateIntervalNumber");
function ir(t) {
  if (!Number.isInteger(t) || t < 1 || t > 31)
    throw new Error("Day of month must be an integer from 1 to 31");
  return t;
}
n(ir, "validatedDayOfMonth");
function ar(t) {
  if (!or.includes(t))
    throw new Error('Day of week must be a string like "monday".');
  return t;
}
n(ar, "validatedDayOfWeek");
function Pe(t) {
  if (!Number.isInteger(t) || t < 0 || t > 23)
    throw new Error("Hour of day must be an integer from 0 to 23");
  return t;
}
n(Pe, "validatedHourOfDay");
function ce(t) {
  if (!Number.isInteger(t) || t < 0 || t > 59)
    throw new Error("Minute of hour must be an integer from 0 to 59");
  return t;
}
n(ce, "validatedMinuteOfHour");
function ur(t) {
  if (!t.match(/^[ -~]*$/))
    throw new Error(
      `Invalid cron identifier ${t}: use ASCII letters that are not control characters`
    );
  return t;
}
n(ur, "validatedCronIdentifier");
var Fe = class {
  static {
    n(this, "Crons");
  }
  constructor() {
    ft(this, "crons"), ft(this, "isCrons"), this.isCrons = !0, this.crons = {};
  }
  /** @internal */
  schedule(e, r, o, s) {
    let i = I(s);
    if (ur(e), e in this.crons)
      throw new Error(`Cron identifier registered twice: ${e}`);
    this.crons[e] = {
      name: $e(o),
      args: [h(i)],
      schedule: r
    };
  }
  /**
   * Schedule a mutation or action to run at some interval.
   *
   * ```js
   * crons.interval("Clear presence data", {seconds: 30}, api.presence.clear);
   * ```
   *
   * @param identifier - A unique name for this scheduled job.
   * @param schedule - The time between runs for this scheduled job.
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   * @param args - The arguments to the function.
   */
  interval(e, r, o, ...s) {
    let i = r, a = +("seconds" in i && i.seconds !== void 0), c = +("minutes" in i && i.minutes !== void 0), d = +("hours" in i && i.hours !== void 0);
    if (a + c + d !== 1)
      throw new Error("Must specify one of seconds, minutes, or hours");
    a ? Ne(r.seconds) : c ? Ne(r.minutes) : d && Ne(r.hours), this.schedule(
      e,
      { ...r, type: "interval" },
      o,
      ...s
    );
  }
  /**
   * Schedule a mutation or action to run on an hourly basis.
   *
   * ```js
   * crons.hourly(
   *   "Reset high scores",
   *   {
   *     minuteUTC: 30,
   *   },
   *   api.scores.reset
   * )
   * ```
   *
   * @param cronIdentifier - A unique name for this scheduled job.
   * @param schedule - What time (UTC) each day to run this function.
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   * @param args - The arguments to the function.
   */
  hourly(e, r, o, ...s) {
    let i = ce(r.minuteUTC);
    this.schedule(
      e,
      { minuteUTC: i, type: "hourly" },
      o,
      ...s
    );
  }
  /**
   * Schedule a mutation or action to run on a daily basis.
   *
   * ```js
   * crons.daily(
   *   "Reset high scores",
   *   {
   *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
   *     minuteUTC: 30,
   *   },
   *   api.scores.reset
   * )
   * ```
   *
   * @param cronIdentifier - A unique name for this scheduled job.
   * @param schedule - What time (UTC) each day to run this function.
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   * @param args - The arguments to the function.
   */
  daily(e, r, o, ...s) {
    let i = Pe(r.hourUTC), a = ce(r.minuteUTC);
    this.schedule(
      e,
      { hourUTC: i, minuteUTC: a, type: "daily" },
      o,
      ...s
    );
  }
  /**
   * Schedule a mutation or action to run on a weekly basis.
   *
   * ```js
   * crons.weekly(
   *   "Weekly re-engagement email",
   *   {
   *     dayOfWeek: "Tuesday",
   *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
   *     minuteUTC: 30,
   *   },
   *   api.emails.send
   * )
   * ```
   *
   * @param cronIdentifier - A unique name for this scheduled job.
   * @param schedule - What day and time (UTC) each week to run this function.
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   */
  weekly(e, r, o, ...s) {
    let i = ar(r.dayOfWeek), a = Pe(r.hourUTC), c = ce(r.minuteUTC);
    this.schedule(
      e,
      { dayOfWeek: i, hourUTC: a, minuteUTC: c, type: "weekly" },
      o,
      ...s
    );
  }
  /**
   * Schedule a mutation or action to run on a monthly basis.
   *
   * Note that some months have fewer days than others, so e.g. a function
   * scheduled to run on the 30th will not run in February.
   *
   * ```js
   * crons.monthly(
   *   "Bill customers at ",
   *   {
   *     hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
   *     minuteUTC: 30,
   *     day: 1,
   *   },
   *   api.billing.billCustomers
   * )
   * ```
   *
   * @param cronIdentifier - A unique name for this scheduled job.
   * @param schedule - What day and time (UTC) each month to run this function.
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   * @param args - The arguments to the function.
   */
  monthly(e, r, o, ...s) {
    let i = ir(r.day), a = Pe(r.hourUTC), c = ce(r.minuteUTC);
    this.schedule(
      e,
      { day: i, hourUTC: a, minuteUTC: c, type: "monthly" },
      o,
      ...s
    );
  }
  /**
   * Schedule a mutation or action to run on a recurring basis.
   *
   * Like the unix command `cron`, Sunday is 0, Monday is 1, etc.
   *
   * ```
   *  ┌─ minute (0 - 59)
   *  │ ┌─ hour (0 - 23)
   *  │ │ ┌─ day of the month (1 - 31)
   *  │ │ │ ┌─ month (1 - 12)
   *  │ │ │ │ ┌─ day of the week (0 - 6) (Sunday to Saturday)
   * "* * * * *"
   * ```
   *
   * @param cronIdentifier - A unique name for this scheduled job.
   * @param cron - Cron string like `"15 7 * * *"` (Every day at 7:15 UTC)
   * @param functionReference - A {@link FunctionReference} for the function
   * to schedule.
   * @param args - The arguments to the function.
   */
  cron(e, r, o, ...s) {
    let i = r;
    this.schedule(
      e,
      { cron: i, type: "cron" },
      o,
      ...s
    );
  }
  /** @internal */
  export() {
    return JSON.stringify(this.crons);
  }
};

// node_modules/convex/dist/esm/server/impl/syscall.js
function D(t, e) {
  if (typeof Convex > "u" || Convex.syscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  let r = Convex.syscall(t, JSON.stringify(e));
  return JSON.parse(r);
}
n(D, "performSyscall");
async function f(t, e) {
  if (typeof Convex > "u" || Convex.asyncSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  let r;
  try {
    r = await Convex.asyncSyscall(t, JSON.stringify(e));
  } catch (o) {
    if (o.data !== void 0) {
      let s = new ue(o.message);
      throw s.data = y(o.data), s;
    }
    throw new Error(o.message);
  }
  return JSON.parse(r);
}
n(f, "performAsyncSyscall");
function C(t, e) {
  if (typeof Convex > "u" || Convex.jsSyscall === void 0)
    throw new Error(
      "The Convex database and auth objects are being used outside of a Convex backend. Did you mean to use `useQuery` or `useMutation` to call a Convex function?"
    );
  return Convex.jsSyscall(t, e);
}
n(C, "performJsSyscall");

// node_modules/convex/dist/esm/server/router.js
var cr = Object.defineProperty, lr = /* @__PURE__ */ n((t, e, r) => e in t ? cr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), $ = /* @__PURE__ */ n((t, e, r) => lr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), pt = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "OPTIONS",
  "PATCH"
];
function fr(t) {
  return t === "HEAD" ? "GET" : t;
}
n(fr, "normalizeMethod");
var pr = /* @__PURE__ */ n(() => new le(), "httpRouter"), le = class {
  static {
    n(this, "HttpRouter");
  }
  constructor() {
    $(this, "exactRoutes", /* @__PURE__ */ new Map()), $(this, "prefixRoutes", /* @__PURE__ */ new Map()), $(this, "isRouter", !0), $(this, "route", (e) => {
      if (!e.handler) throw new Error("route requires handler");
      if (!e.method) throw new Error("route requires method");
      let { method: r, handler: o } = e;
      if (!pt.includes(r))
        throw new Error(
          `'${r}' is not an allowed HTTP method (like GET, POST, PUT etc.)`
        );
      if ("path" in e) {
        if ("pathPrefix" in e)
          throw new Error(
            "Invalid httpRouter route: cannot contain both 'path' and 'pathPrefix'"
          );
        if (!e.path.startsWith("/"))
          throw new Error(`path '${e.path}' does not start with a /`);
        if (e.path.startsWith("/.files/") || e.path === "/.files")
          throw new Error(`path '${e.path}' is reserved`);
        let s = this.exactRoutes.has(e.path) ? this.exactRoutes.get(e.path) : /* @__PURE__ */ new Map();
        if (s.has(r))
          throw new Error(
            `Path '${e.path}' for method ${r} already in use`
          );
        s.set(r, o), this.exactRoutes.set(e.path, s);
      } else if ("pathPrefix" in e) {
        if (!e.pathPrefix.startsWith("/"))
          throw new Error(
            `pathPrefix '${e.pathPrefix}' does not start with a /`
          );
        if (!e.pathPrefix.endsWith("/"))
          throw new Error(`pathPrefix ${e.pathPrefix} must end with a /`);
        if (e.pathPrefix.startsWith("/.files/"))
          throw new Error(`pathPrefix '${e.pathPrefix}' is reserved`);
        let s = this.prefixRoutes.get(r) || /* @__PURE__ */ new Map();
        if (s.has(e.pathPrefix))
          throw new Error(
            `${e.method} pathPrefix ${e.pathPrefix} is already defined`
          );
        s.set(e.pathPrefix, o), this.prefixRoutes.set(r, s);
      } else
        throw new Error(
          "Invalid httpRouter route entry: must contain either field 'path' or 'pathPrefix'"
        );
    }), $(this, "getRoutes", () => {
      let r = [...this.exactRoutes.keys()].sort().flatMap(
        (i) => [...this.exactRoutes.get(i).keys()].sort().map(
          (a) => [i, a, this.exactRoutes.get(i).get(a)]
        )
      ), s = [...this.prefixRoutes.keys()].sort().flatMap(
        (i) => [...this.prefixRoutes.get(i).keys()].sort().map(
          (a) => [
            `${a}*`,
            i,
            this.prefixRoutes.get(i).get(a)
          ]
        )
      );
      return [...r, ...s];
    }), $(this, "lookup", (e, r) => {
      r = fr(r);
      let o = this.exactRoutes.get(e)?.get(r);
      if (o) return [o, r, e];
      let i = [...(this.prefixRoutes.get(r) || /* @__PURE__ */ new Map()).entries()].sort(
        ([a, c], [d, T]) => d.length - a.length
      );
      for (let [a, c] of i)
        if (e.startsWith(a))
          return [c, r, `${a}*`];
      return null;
    }), $(this, "runRequest", async (e, r) => {
      let o = C("requestFromConvexJson", {
        convexJson: JSON.parse(e)
      }), s = r;
      (!s || typeof s != "string") && (s = new URL(o.url).pathname);
      let i = o.method, a = this.lookup(s, i);
      if (!a) {
        let ve = new Response(`No HttpAction routed for ${s}`, {
          status: 404
        });
        return JSON.stringify(
          C("convexJsonFromResponse", { response: ve })
        );
      }
      let [c, d, T] = a, be = await c.invokeHttpAction(o);
      return JSON.stringify(
        C("convexJsonFromResponse", { response: be })
      );
    });
  }
};

// node_modules/convex/dist/esm/index.js
var w = "1.31.7";

// node_modules/convex/dist/esm/server/components/index.js
function dt(t, e) {
  let r = {
    get(o, s) {
      if (typeof s == "string") {
        let i = [...e, s];
        return dt(t, i);
      } else if (s === Ce) {
        if (e.length < 1) {
          let i = [t, ...e].join(".");
          throw new Error(
            `API path is expected to be of the form \`${t}.childComponent.functionName\`. Found: \`${i}\``
          );
        }
        return "_reference/childComponent/" + e.join("/");
      } else
        return;
    }
  };
  return new Proxy({}, r);
}
n(dt, "createChildComponents");
var dr = /* @__PURE__ */ n(() => dt("components", []), "componentsGeneric");

// node_modules/convex/dist/esm/server/impl/actions_impl.js
function Re(t, e, r) {
  return {
    ...A(e),
    args: h(I(r)),
    version: w,
    requestId: t
  };
}
n(Re, "syscallArgs");
function Be(t) {
  return {
    runQuery: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/query",
        Re(t, e, r)
      );
      return y(o);
    }, "runQuery"),
    runMutation: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/mutation",
        Re(t, e, r)
      );
      return y(o);
    }, "runMutation"),
    runAction: /* @__PURE__ */ n(async (e, r) => {
      let o = await f(
        "1.0/actions/action",
        Re(t, e, r)
      );
      return y(o);
    }, "runAction")
  };
}
n(Be, "setupActionCalls");

// node_modules/convex/dist/esm/server/vector_search.js
var hr = Object.defineProperty, mr = /* @__PURE__ */ n((t, e, r) => e in t ? hr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), ht = /* @__PURE__ */ n((t, e, r) => mr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), fe = class {
  static {
    n(this, "FilterExpression");
  }
  /**
   * @internal
   */
  constructor() {
    ht(this, "_isExpression"), ht(this, "_value");
  }
};

// node_modules/convex/dist/esm/server/impl/validate.js
function l(t, e, r, o) {
  if (t === void 0)
    throw new TypeError(
      `Must provide arg ${e} \`${o}\` to \`${r}\``
    );
}
n(l, "validateArg");
function mt(t, e, r, o) {
  if (!Number.isInteger(t) || t < 0)
    throw new TypeError(
      `Arg ${e} \`${o}\` to \`${r}\` must be a non-negative integer`
    );
}
n(mt, "validateArgIsNonNegativeInteger");

// node_modules/convex/dist/esm/server/impl/vector_search_impl.js
var yr = Object.defineProperty, wr = /* @__PURE__ */ n((t, e, r) => e in t ? yr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), qe = /* @__PURE__ */ n((t, e, r) => wr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField");
function Me(t) {
  return async (e, r, o) => {
    if (l(e, 1, "vectorSearch", "tableName"), l(r, 2, "vectorSearch", "indexName"), l(o, 3, "vectorSearch", "query"), !o.vector || !Array.isArray(o.vector) || o.vector.length === 0)
      throw Error("`vector` must be a non-empty Array in vectorSearch");
    return await new je(
      t,
      e + "." + r,
      o
    ).collect();
  };
}
n(Me, "setupActionVectorSearch");
var je = class {
  static {
    n(this, "VectorQueryImpl");
  }
  constructor(e, r, o) {
    qe(this, "requestId"), qe(this, "state"), this.requestId = e;
    let s = o.filter ? pe(o.filter(gr)) : null;
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
    let e = this.state.query;
    this.state = { type: "consumed" };
    let { results: r } = await f("1.0/actions/vectorSearch", {
      requestId: this.requestId,
      version: w,
      query: e
    });
    return r;
  }
}, R = class extends fe {
  static {
    n(this, "ExpressionImpl");
  }
  constructor(e) {
    super(), qe(this, "inner"), this.inner = e;
  }
  serialize() {
    return this.inner;
  }
};
function pe(t) {
  return t instanceof R ? t.serialize() : { $literal: v(t) };
}
n(pe, "serializeExpression");
var gr = {
  //  Comparisons  /////////////////////////////////////////////////////////////
  eq(t, e) {
    if (typeof t != "string")
      throw new Error("The first argument to `q.eq` must be a field name.");
    return new R({
      $eq: [
        pe(new R({ $field: t })),
        pe(e)
      ]
    });
  },
  //  Logic  ///////////////////////////////////////////////////////////////////
  or(...t) {
    return new R({ $or: t.map(pe) });
  }
};

// node_modules/convex/dist/esm/server/impl/authentication_impl.js
function H(t) {
  return {
    getUserIdentity: /* @__PURE__ */ n(async () => await f("1.0/getUserIdentity", {
      requestId: t
    }), "getUserIdentity")
  };
}
n(H, "setupAuth");

// node_modules/convex/dist/esm/server/filter_builder.js
var xr = Object.defineProperty, br = /* @__PURE__ */ n((t, e, r) => e in t ? xr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), yt = /* @__PURE__ */ n((t, e, r) => br(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), de = class {
  static {
    n(this, "Expression");
  }
  /**
   * @internal
   */
  constructor() {
    yt(this, "_isExpression"), yt(this, "_value");
  }
};

// node_modules/convex/dist/esm/server/impl/filter_builder_impl.js
var vr = Object.defineProperty, Ar = /* @__PURE__ */ n((t, e, r) => e in t ? vr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Er = /* @__PURE__ */ n((t, e, r) => Ar(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), g = class extends de {
  static {
    n(this, "ExpressionImpl");
  }
  constructor(e) {
    super(), Er(this, "inner"), this.inner = e;
  }
  serialize() {
    return this.inner;
  }
};
function p(t) {
  return t instanceof g ? t.serialize() : { $literal: v(t) };
}
n(p, "serializeExpression");
var wt = {
  //  Comparisons  /////////////////////////////////////////////////////////////
  eq(t, e) {
    return new g({
      $eq: [p(t), p(e)]
    });
  },
  neq(t, e) {
    return new g({
      $neq: [p(t), p(e)]
    });
  },
  lt(t, e) {
    return new g({
      $lt: [p(t), p(e)]
    });
  },
  lte(t, e) {
    return new g({
      $lte: [p(t), p(e)]
    });
  },
  gt(t, e) {
    return new g({
      $gt: [p(t), p(e)]
    });
  },
  gte(t, e) {
    return new g({
      $gte: [p(t), p(e)]
    });
  },
  //  Arithmetic  //////////////////////////////////////////////////////////////
  add(t, e) {
    return new g({
      $add: [p(t), p(e)]
    });
  },
  sub(t, e) {
    return new g({
      $sub: [p(t), p(e)]
    });
  },
  mul(t, e) {
    return new g({
      $mul: [p(t), p(e)]
    });
  },
  div(t, e) {
    return new g({
      $div: [p(t), p(e)]
    });
  },
  mod(t, e) {
    return new g({
      $mod: [p(t), p(e)]
    });
  },
  neg(t) {
    return new g({ $neg: p(t) });
  },
  //  Logic  ///////////////////////////////////////////////////////////////////
  and(...t) {
    return new g({ $and: t.map(p) });
  },
  or(...t) {
    return new g({ $or: t.map(p) });
  },
  not(t) {
    return new g({ $not: p(t) });
  },
  //  Other  ///////////////////////////////////////////////////////////////////
  field(t) {
    return new g({ $field: t });
  }
};

// node_modules/convex/dist/esm/server/index_range_builder.js
var Sr = Object.defineProperty, Ir = /* @__PURE__ */ n((t, e, r) => e in t ? Sr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Tr = /* @__PURE__ */ n((t, e, r) => Ir(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), he = class {
  static {
    n(this, "IndexRange");
  }
  /**
   * @internal
   */
  constructor() {
    Tr(this, "_isIndexRange");
  }
};

// node_modules/convex/dist/esm/server/impl/index_range_builder_impl.js
var Or = Object.defineProperty, _r = /* @__PURE__ */ n((t, e, r) => e in t ? Or(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), gt = /* @__PURE__ */ n((t, e, r) => _r(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), me = class t extends he {
  static {
    n(this, "IndexRangeBuilderImpl");
  }
  constructor(e) {
    super(), gt(this, "rangeExpressions"), gt(this, "isConsumed"), this.rangeExpressions = e, this.isConsumed = !1;
  }
  static new() {
    return new t([]);
  }
  consume() {
    if (this.isConsumed)
      throw new Error(
        "IndexRangeBuilder has already been used! Chain your method calls like `q => q.eq(...).eq(...)`. See https://docs.convex.dev/using/indexes"
      );
    this.isConsumed = !0;
  }
  eq(e, r) {
    return this.consume(), new t(
      this.rangeExpressions.concat({
        type: "Eq",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  gt(e, r) {
    return this.consume(), new t(
      this.rangeExpressions.concat({
        type: "Gt",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  gte(e, r) {
    return this.consume(), new t(
      this.rangeExpressions.concat({
        type: "Gte",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  lt(e, r) {
    return this.consume(), new t(
      this.rangeExpressions.concat({
        type: "Lt",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  lte(e, r) {
    return this.consume(), new t(
      this.rangeExpressions.concat({
        type: "Lte",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  export() {
    return this.consume(), this.rangeExpressions;
  }
};

// node_modules/convex/dist/esm/server/search_filter_builder.js
var Cr = Object.defineProperty, $r = /* @__PURE__ */ n((t, e, r) => e in t ? Cr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Nr = /* @__PURE__ */ n((t, e, r) => $r(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), ye = class {
  static {
    n(this, "SearchFilter");
  }
  /**
   * @internal
   */
  constructor() {
    Nr(this, "_isSearchFilter");
  }
};

// node_modules/convex/dist/esm/server/impl/search_filter_builder_impl.js
var Pr = Object.defineProperty, Fr = /* @__PURE__ */ n((t, e, r) => e in t ? Pr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), xt = /* @__PURE__ */ n((t, e, r) => Fr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), we = class t extends ye {
  static {
    n(this, "SearchFilterBuilderImpl");
  }
  constructor(e) {
    super(), xt(this, "filters"), xt(this, "isConsumed"), this.filters = e, this.isConsumed = !1;
  }
  static new() {
    return new t([]);
  }
  consume() {
    if (this.isConsumed)
      throw new Error(
        "SearchFilterBuilder has already been used! Chain your method calls like `q => q.search(...).eq(...)`."
      );
    this.isConsumed = !0;
  }
  search(e, r) {
    return l(e, 1, "search", "fieldName"), l(r, 2, "search", "query"), this.consume(), new t(
      this.filters.concat({
        type: "Search",
        fieldPath: e,
        value: r
      })
    );
  }
  eq(e, r) {
    return l(e, 1, "eq", "fieldName"), arguments.length !== 2 && l(r, 2, "search", "value"), this.consume(), new t(
      this.filters.concat({
        type: "Eq",
        fieldPath: e,
        value: v(r)
      })
    );
  }
  export() {
    return this.consume(), this.filters;
  }
};

// node_modules/convex/dist/esm/server/impl/query_impl.js
var Rr = Object.defineProperty, Br = /* @__PURE__ */ n((t, e, r) => e in t ? Rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), Ue = /* @__PURE__ */ n((t, e, r) => Br(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), bt = 256, B = class {
  static {
    n(this, "QueryInitializerImpl");
  }
  constructor(e) {
    Ue(this, "tableName"), this.tableName = e;
  }
  withIndex(e, r) {
    l(e, 1, "withIndex", "indexName");
    let o = me.new();
    return r !== void 0 && (o = r(o)), new N({
      source: {
        type: "IndexRange",
        indexName: this.tableName + "." + e,
        range: o.export(),
        order: null
      },
      operators: []
    });
  }
  withSearchIndex(e, r) {
    l(e, 1, "withSearchIndex", "indexName"), l(r, 2, "withSearchIndex", "searchFilter");
    let o = we.new();
    return new N({
      source: {
        type: "Search",
        indexName: this.tableName + "." + e,
        filters: r(o).export()
      },
      operators: []
    });
  }
  fullTableScan() {
    return new N({
      source: {
        type: "FullTableScan",
        tableName: this.tableName,
        order: null
      },
      operators: []
    });
  }
  order(e) {
    return this.fullTableScan().order(e);
  }
  // This is internal API and should not be exposed to developers yet.
  async count() {
    let e = await f("1.0/count", {
      table: this.tableName
    });
    return y(e);
  }
  filter(e) {
    return this.fullTableScan().filter(e);
  }
  limit(e) {
    return this.fullTableScan().limit(e);
  }
  collect() {
    return this.fullTableScan().collect();
  }
  take(e) {
    return this.fullTableScan().take(e);
  }
  paginate(e) {
    return this.fullTableScan().paginate(e);
  }
  first() {
    return this.fullTableScan().first();
  }
  unique() {
    return this.fullTableScan().unique();
  }
  [Symbol.asyncIterator]() {
    return this.fullTableScan()[Symbol.asyncIterator]();
  }
};
function vt(t) {
  throw new Error(
    t === "consumed" ? "This query is closed and can't emit any more values." : "This query has been chained with another operator and can't be reused."
  );
}
n(vt, "throwClosedError");
var N = class t {
  static {
    n(this, "QueryImpl");
  }
  constructor(e) {
    Ue(this, "state"), Ue(this, "tableNameForErrorMessages"), this.state = { type: "preparing", query: e }, e.source.type === "FullTableScan" ? this.tableNameForErrorMessages = e.source.tableName : this.tableNameForErrorMessages = e.source.indexName.split(".")[0];
  }
  takeQuery() {
    if (this.state.type !== "preparing")
      throw new Error(
        "A query can only be chained once and can't be chained after iteration begins."
      );
    let e = this.state.query;
    return this.state = { type: "closed" }, e;
  }
  startQuery() {
    if (this.state.type === "executing")
      throw new Error("Iteration can only begin on a query once.");
    (this.state.type === "closed" || this.state.type === "consumed") && vt(this.state.type);
    let e = this.state.query, { queryId: r } = D("1.0/queryStream", { query: e, version: w });
    return this.state = { type: "executing", queryId: r }, r;
  }
  closeQuery() {
    if (this.state.type === "executing") {
      let e = this.state.queryId;
      D("1.0/queryCleanup", { queryId: e });
    }
    this.state = { type: "consumed" };
  }
  order(e) {
    l(e, 1, "order", "order");
    let r = this.takeQuery();
    if (r.source.type === "Search")
      throw new Error(
        "Search queries must always be in relevance order. Can not set order manually."
      );
    if (r.source.order !== null)
      throw new Error("Queries may only specify order at most once");
    return r.source.order = e, new t(r);
  }
  filter(e) {
    l(e, 1, "filter", "predicate");
    let r = this.takeQuery();
    if (r.operators.length >= bt)
      throw new Error(
        `Can't construct query with more than ${bt} operators`
      );
    return r.operators.push({
      filter: p(e(wt))
    }), new t(r);
  }
  limit(e) {
    l(e, 1, "limit", "n");
    let r = this.takeQuery();
    return r.operators.push({ limit: e }), new t(r);
  }
  [Symbol.asyncIterator]() {
    return this.startQuery(), this;
  }
  async next() {
    (this.state.type === "closed" || this.state.type === "consumed") && vt(this.state.type);
    let e = this.state.type === "preparing" ? this.startQuery() : this.state.queryId, { value: r, done: o } = await f("1.0/queryStreamNext", {
      queryId: e
    });
    return o && this.closeQuery(), { value: y(r), done: o };
  }
  return() {
    return this.closeQuery(), Promise.resolve({ done: !0, value: void 0 });
  }
  async paginate(e) {
    if (l(e, 1, "paginate", "options"), typeof e?.numItems != "number" || e.numItems < 0)
      throw new Error(
        `\`options.numItems\` must be a positive number. Received \`${e?.numItems}\`.`
      );
    let r = this.takeQuery(), o = e.numItems, s = e.cursor, i = e?.endCursor ?? null, a = e.maximumRowsRead ?? null, { page: c, isDone: d, continueCursor: T, splitCursor: be, pageStatus: ve } = await f("1.0/queryPage", {
      query: r,
      cursor: s,
      endCursor: i,
      pageSize: o,
      maximumRowsRead: a,
      maximumBytesRead: e.maximumBytesRead,
      version: w
    });
    return {
      page: c.map((Pt) => y(Pt)),
      isDone: d,
      continueCursor: T,
      splitCursor: be,
      pageStatus: ve
    };
  }
  async collect() {
    let e = [];
    for await (let r of this)
      e.push(r);
    return e;
  }
  async take(e) {
    return l(e, 1, "take", "n"), mt(e, 1, "take", "n"), this.limit(e).collect();
  }
  async first() {
    let e = await this.take(1);
    return e.length === 0 ? null : e[0];
  }
  async unique() {
    let e = await this.take(2);
    if (e.length === 0)
      return null;
    if (e.length === 2)
      throw new Error(`unique() query returned more than one result from table ${this.tableNameForErrorMessages}:
 [${e[0]._id}, ${e[1]._id}, ...]`);
    return e[0];
  }
};

// node_modules/convex/dist/esm/server/impl/database_impl.js
async function Je(t, e, r) {
  if (l(e, 1, "get", "id"), typeof e != "string")
    throw new Error(
      `Invalid argument \`id\` for \`db.get\`, expected string but got '${typeof e}': ${e}`
    );
  let o = {
    id: h(e),
    isSystem: r,
    version: w,
    table: t
  }, s = await f("1.0/get", o);
  return y(s);
}
n(Je, "get");
function He() {
  let t = /* @__PURE__ */ n((s = !1) => ({
    get: /* @__PURE__ */ n(async (i, a) => a !== void 0 ? await Je(i, a, s) : await Je(void 0, i, s), "get"),
    query: /* @__PURE__ */ n((i) => new Q(i, s).query(), "query"),
    normalizeId: /* @__PURE__ */ n((i, a) => {
      l(i, 1, "normalizeId", "tableName"), l(a, 2, "normalizeId", "id");
      let c = i.startsWith("_");
      if (c !== s)
        throw new Error(
          `${c ? "System" : "User"} tables can only be accessed from db.${s ? "" : "system."}normalizeId().`
        );
      let d = D("1.0/db/normalizeId", {
        table: i,
        idString: a
      });
      return y(d).id;
    }, "normalizeId"),
    // We set the system reader on the next line
    system: null,
    table: /* @__PURE__ */ n((i) => new Q(i, s), "table")
  }), "reader"), { system: e, ...r } = t(!0), o = t();
  return o.system = r, o;
}
n(He, "setupReader");
async function At(t, e) {
  if (t.startsWith("_"))
    throw new Error("System tables (prefixed with `_`) are read-only.");
  l(t, 1, "insert", "table"), l(e, 2, "insert", "value");
  let r = await f("1.0/insert", {
    table: t,
    value: h(e)
  });
  return y(r)._id;
}
n(At, "insert");
async function Ve(t, e, r) {
  l(e, 1, "patch", "id"), l(r, 2, "patch", "value"), await f("1.0/shallowMerge", {
    id: h(e),
    value: it(r),
    table: t
  });
}
n(Ve, "patch");
async function Le(t, e, r) {
  l(e, 1, "replace", "id"), l(r, 2, "replace", "value"), await f("1.0/replace", {
    id: h(e),
    value: h(r),
    table: t
  });
}
n(Le, "replace");
async function ke(t, e) {
  l(e, 1, "delete", "id"), await f("1.0/remove", {
    id: h(e),
    table: t
  });
}
n(ke, "delete_");
function Et() {
  let t = He();
  return {
    get: t.get,
    query: t.query,
    normalizeId: t.normalizeId,
    system: t.system,
    insert: /* @__PURE__ */ n(async (e, r) => await At(e, r), "insert"),
    patch: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await Ve(e, r, o) : await Ve(void 0, e, r), "patch"),
    replace: /* @__PURE__ */ n(async (e, r, o) => o !== void 0 ? await Le(e, r, o) : await Le(void 0, e, r), "replace"),
    delete: /* @__PURE__ */ n(async (e, r) => r !== void 0 ? await ke(e, r) : await ke(void 0, e), "delete"),
    table: /* @__PURE__ */ n((e) => new De(e, !1), "table")
  };
}
n(Et, "setupWriter");
var Q = class {
  static {
    n(this, "TableReader");
  }
  constructor(e, r) {
    this.tableName = e, this.isSystem = r;
  }
  async get(e) {
    return Je(this.tableName, e, this.isSystem);
  }
  query() {
    let e = this.tableName.startsWith("_");
    if (e !== this.isSystem)
      throw new Error(
        `${e ? "System" : "User"} tables can only be accessed from db.${this.isSystem ? "" : "system."}query().`
      );
    return new B(this.tableName);
  }
}, De = class extends Q {
  static {
    n(this, "TableWriter");
  }
  async insert(e) {
    return At(this.tableName, e);
  }
  async patch(e, r) {
    return Ve(this.tableName, e, r);
  }
  async replace(e, r) {
    return Le(this.tableName, e, r);
  }
  async delete(e) {
    return ke(this.tableName, e);
  }
};

// node_modules/convex/dist/esm/server/impl/scheduler_impl.js
function St() {
  return {
    runAfter: /* @__PURE__ */ n(async (t, e, r) => {
      let o = It(t, e, r);
      return await f("1.0/schedule", o);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (t, e, r) => {
      let o = Tt(
        t,
        e,
        r
      );
      return await f("1.0/schedule", o);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (t) => {
      l(t, 1, "cancel", "id");
      let e = { id: h(t) };
      await f("1.0/cancel_job", e);
    }, "cancel")
  };
}
n(St, "setupMutationScheduler");
function Qe(t) {
  return {
    runAfter: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...It(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAfter"),
    runAt: /* @__PURE__ */ n(async (e, r, o) => {
      let s = {
        requestId: t,
        ...Tt(e, r, o)
      };
      return await f("1.0/actions/schedule", s);
    }, "runAt"),
    cancel: /* @__PURE__ */ n(async (e) => {
      l(e, 1, "cancel", "id");
      let r = { id: h(e) };
      return await f("1.0/actions/cancel_job", r);
    }, "cancel")
  };
}
n(Qe, "setupActionScheduler");
function It(t, e, r) {
  if (typeof t != "number")
    throw new Error("`delayMs` must be a number");
  if (!isFinite(t))
    throw new Error("`delayMs` must be a finite number");
  if (t < 0)
    throw new Error("`delayMs` must be non-negative");
  let o = I(r), s = A(e), i = (Date.now() + t) / 1e3;
  return {
    ...s,
    ts: i,
    args: h(o),
    version: w
  };
}
n(It, "runAfterSyscallArgs");
function Tt(t, e, r) {
  let o;
  if (t instanceof Date)
    o = t.valueOf() / 1e3;
  else if (typeof t == "number")
    o = t / 1e3;
  else
    throw new Error("The invoke time must a Date or a timestamp");
  let s = A(e), i = I(r);
  return {
    ...s,
    ts: o,
    args: h(i),
    version: w
  };
}
n(Tt, "runAtSyscallArgs");

// node_modules/convex/dist/esm/server/impl/storage_impl.js
function ze(t) {
  return {
    getUrl: /* @__PURE__ */ n(async (e) => (l(e, 1, "getUrl", "storageId"), await f("1.0/storageGetUrl", {
      requestId: t,
      version: w,
      storageId: e
    })), "getUrl"),
    getMetadata: /* @__PURE__ */ n(async (e) => await f("1.0/storageGetMetadata", {
      requestId: t,
      version: w,
      storageId: e
    }), "getMetadata")
  };
}
n(ze, "setupStorageReader");
function Ge(t) {
  let e = ze(t);
  return {
    generateUploadUrl: /* @__PURE__ */ n(async () => await f("1.0/storageGenerateUploadUrl", {
      requestId: t,
      version: w
    }), "generateUploadUrl"),
    delete: /* @__PURE__ */ n(async (r) => {
      await f("1.0/storageDelete", {
        requestId: t,
        version: w,
        storageId: r
      });
    }, "delete"),
    getUrl: e.getUrl,
    getMetadata: e.getMetadata
  };
}
n(Ge, "setupStorageWriter");
function We(t) {
  return {
    ...Ge(t),
    store: /* @__PURE__ */ n(async (r, o) => await C("storage/storeBlob", {
      requestId: t,
      version: w,
      blob: r,
      options: o
    }), "store"),
    get: /* @__PURE__ */ n(async (r) => await C("storage/getBlob", {
      requestId: t,
      version: w,
      storageId: r
    }), "get")
  };
}
n(We, "setupStorageActionWriter");

// node_modules/convex/dist/esm/server/impl/registration_impl.js
async function Ot(t, e) {
  let o = y(JSON.parse(e)), s = {
    db: Et(),
    auth: H(""),
    storage: Ge(""),
    scheduler: St(),
    runQuery: /* @__PURE__ */ n((a, c) => Ye("query", a, c), "runQuery"),
    runMutation: /* @__PURE__ */ n((a, c) => Ye("mutation", a, c), "runMutation")
  }, i = await ge(t, s, o);
  return _t(i), JSON.stringify(h(i === void 0 ? null : i));
}
n(Ot, "invokeMutation");
function _t(t) {
  if (t instanceof B || t instanceof N)
    throw new Error(
      "Return value is a Query. Results must be retrieved with `.collect()`, `.take(n), `.unique()`, or `.first()`."
    );
}
n(_t, "validateReturnValue");
async function ge(t, e, r) {
  let o;
  try {
    o = await Promise.resolve(t(e, ...r));
  } catch (s) {
    throw qr(s);
  }
  return o;
}
n(ge, "invokeFunction");
function q(t, e) {
  return (r, o) => (globalThis.console.warn(
    `Convex functions should not directly call other Convex functions. Consider calling a helper function instead. e.g. \`export const foo = ${t}(...); await foo(ctx);\` is not supported. See https://docs.convex.dev/production/best-practices/#use-helper-functions-to-write-shared-code`
  ), e(r, o));
}
n(q, "dontCallDirectly");
function qr(t) {
  if (typeof t == "object" && t !== null && Symbol.for("ConvexError") in t) {
    let e = t;
    return e.data = JSON.stringify(
      h(e.data === void 0 ? null : e.data)
    ), e.ConvexErrorSymbol = Symbol.for("ConvexError"), e;
  } else
    return t;
}
n(qr, "serializeConvexErrorData");
function j() {
  if (typeof window > "u" || window.__convexAllowFunctionsInBrowser)
    return;
  (Object.getOwnPropertyDescriptor(globalThis, "window")?.get?.toString().includes("[native code]") ?? !1) && console.error(
    "Convex functions should not be imported in the browser. This will throw an error in future versions of `convex`. If this is a false negative, please report it to Convex support."
  );
}
n(j, "assertNotBrowser");
function Ct(t, e) {
  if (e === void 0)
    throw new Error(
      `A validator is undefined for field "${t}". This is often caused by circular imports. See https://docs.convex.dev/error#undefined-validator for details.`
    );
  return e;
}
n(Ct, "strictReplacer");
function z(t) {
  return () => {
    let e = u.any();
    return typeof t == "object" && t.args !== void 0 && (e = ae(t.args)), JSON.stringify(e.json, Ct);
  };
}
n(z, "exportArgs");
function G(t) {
  return () => {
    let e;
    return typeof t == "object" && t.returns !== void 0 && (e = ae(t.returns)), JSON.stringify(e ? e.json : null, Ct);
  };
}
n(G, "exportReturns");
var jr = /* @__PURE__ */ n(((t) => {
  let e = typeof t == "function" ? t : t.handler, r = q("mutation", e);
  return j(), r.isMutation = !0, r.isPublic = !0, r.invokeMutation = (o) => Ot(e, o), r.exportArgs = z(t), r.exportReturns = G(t), r._handler = e, r;
}), "mutationGeneric"), Mr = /* @__PURE__ */ n(((t) => {
  let e = typeof t == "function" ? t : t.handler, r = q(
    "internalMutation",
    e
  );
  return j(), r.isMutation = !0, r.isInternal = !0, r.invokeMutation = (o) => Ot(e, o), r.exportArgs = z(t), r.exportReturns = G(t), r._handler = e, r;
}), "internalMutationGeneric");
async function $t(t, e) {
  let o = y(JSON.parse(e)), s = {
    db: He(),
    auth: H(""),
    storage: ze(""),
    runQuery: /* @__PURE__ */ n((a, c) => Ye("query", a, c), "runQuery")
  }, i = await ge(t, s, o);
  return _t(i), JSON.stringify(h(i === void 0 ? null : i));
}
n($t, "invokeQuery");
var Ur = /* @__PURE__ */ n(((t) => {
  let e = typeof t == "function" ? t : t.handler, r = q("query", e);
  return j(), r.isQuery = !0, r.isPublic = !0, r.invokeQuery = (o) => $t(e, o), r.exportArgs = z(t), r.exportReturns = G(t), r._handler = e, r;
}), "queryGeneric"), Jr = /* @__PURE__ */ n(((t) => {
  let e = typeof t == "function" ? t : t.handler, r = q("internalQuery", e);
  return j(), r.isQuery = !0, r.isInternal = !0, r.invokeQuery = (o) => $t(e, o), r.exportArgs = z(t), r.exportReturns = G(t), r._handler = e, r;
}), "internalQueryGeneric");
async function Vr(t, e, r) {
  let o = y(JSON.parse(r)), i = {
    ...Be(e),
    auth: H(e),
    scheduler: Qe(e),
    storage: We(e),
    vectorSearch: Me(e)
  }, a = await ge(t, i, o);
  return JSON.stringify(h(a === void 0 ? null : a));
}
n(Vr, "invokeAction");
var Lr = /* @__PURE__ */ n(((t) => {
  let e = typeof t == "function" ? t : t.handler, r = q("action", e);
  return j(), r.isAction = !0, r.isPublic = !0, r.invokeAction = (o, s) => Vr(e, o, s), r.exportArgs = z(t), r.exportReturns = G(t), r._handler = e, r;
}), "actionGeneric");
async function kr(t, e) {
  let s = {
    ...Be(""),
    auth: H(""),
    storage: We(""),
    scheduler: Qe(""),
    vectorSearch: Me("")
  };
  return await ge(t, s, [e]);
}
n(kr, "invokeHttpAction");
var Dr = /* @__PURE__ */ n((t) => {
  let e = q("httpAction", t);
  return j(), e.isHttp = !0, e.invokeHttpAction = (r) => kr(t, r), e._handler = t, e;
}, "httpActionGeneric");
async function Ye(t, e, r) {
  let o = I(r), s = {
    udfType: t,
    args: h(o),
    ...A(e)
  }, i = await f("1.0/runUdf", s);
  return y(i);
}
n(Ye, "runUdf");

// node_modules/convex/dist/esm/server/schema.js
var Hr = Object.defineProperty, Qr = /* @__PURE__ */ n((t, e, r) => e in t ? Hr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, "__defNormalProp"), S = /* @__PURE__ */ n((t, e, r) => Qr(t, typeof e != "symbol" ? e + "" : e, r), "__publicField"), xe = class {
  static {
    n(this, "TableDefinition");
  }
  /**
   * @internal
   */
  constructor(e) {
    S(this, "indexes"), S(this, "stagedDbIndexes"), S(this, "searchIndexes"), S(this, "stagedSearchIndexes"), S(this, "vectorIndexes"), S(this, "stagedVectorIndexes"), S(this, "validator"), this.indexes = [], this.stagedDbIndexes = [], this.searchIndexes = [], this.stagedSearchIndexes = [], this.vectorIndexes = [], this.stagedVectorIndexes = [], this.validator = e;
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
  index(e, r) {
    return Array.isArray(r) ? this.indexes.push({
      indexDescriptor: e,
      fields: r
    }) : r.staged ? this.stagedDbIndexes.push({
      indexDescriptor: e,
      fields: r.fields
    }) : this.indexes.push({
      indexDescriptor: e,
      fields: r.fields
    }), this;
  }
  searchIndex(e, r) {
    return r.staged ? this.stagedSearchIndexes.push({
      indexDescriptor: e,
      searchField: r.searchField,
      filterFields: r.filterFields || []
    }) : this.searchIndexes.push({
      indexDescriptor: e,
      searchField: r.searchField,
      filterFields: r.filterFields || []
    }), this;
  }
  vectorIndex(e, r) {
    return r.staged ? this.stagedVectorIndexes.push({
      indexDescriptor: e,
      vectorField: r.vectorField,
      dimensions: r.dimensions,
      filterFields: r.filterFields || []
    }) : this.vectorIndexes.push({
      indexDescriptor: e,
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
    let e = this.validator.json;
    if (typeof e != "object")
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
      documentType: e
    };
  }
};
function Xe(t) {
  return Oe(t) ? new xe(t) : new xe(u.object(t));
}
n(Xe, "defineTable");
var Ke = class {
  static {
    n(this, "SchemaDefinition");
  }
  /**
   * @internal
   */
  constructor(e, r) {
    S(this, "tables"), S(this, "strictTableNameTypes"), S(this, "schemaValidation"), this.tables = e, this.schemaValidation = r?.schemaValidation === void 0 ? !0 : r.schemaValidation;
  }
  /**
   * Export the contents of this definition.
   *
   * This is called internally by the Convex framework.
   * @internal
   */
  export() {
    return JSON.stringify({
      tables: Object.entries(this.tables).map(([e, r]) => {
        let {
          indexes: o,
          stagedDbIndexes: s,
          searchIndexes: i,
          stagedSearchIndexes: a,
          vectorIndexes: c,
          stagedVectorIndexes: d,
          documentType: T
        } = r.export();
        return {
          tableName: e,
          indexes: o,
          stagedDbIndexes: s,
          searchIndexes: i,
          stagedSearchIndexes: a,
          vectorIndexes: c,
          stagedVectorIndexes: d,
          documentType: T
        };
      }),
      schemaValidation: this.schemaValidation
    });
  }
};
function Nt(t, e) {
  return new Ke(t, e);
}
n(Nt, "defineSchema");
var Vs = Nt({
  _scheduled_functions: Xe({
    name: u.string(),
    args: u.array(u.any()),
    scheduledTime: u.float64(),
    completedTime: u.optional(u.float64()),
    state: u.union(
      u.object({ kind: u.literal("pending") }),
      u.object({ kind: u.literal("inProgress") }),
      u.object({ kind: u.literal("success") }),
      u.object({ kind: u.literal("failed"), error: u.string() }),
      u.object({ kind: u.literal("canceled") })
    )
  }),
  _storage: Xe({
    sha256: u.string(),
    size: u.float64(),
    contentType: u.optional(u.string())
  })
});

export {
  n as a,
  u as b,
  jr as c,
  Mr as d,
  Ur as e,
  Jr as f,
  Lr as g,
  Dr as h,
  Nn as i,
  tr as j,
  sr as k,
  pt as l,
  pr as m,
  dr as n
};
//# sourceMappingURL=M2D6NT5W.js.map
