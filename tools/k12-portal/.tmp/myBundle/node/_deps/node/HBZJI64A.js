import {
  a as c,
  b as Z,
  c as ce,
  d as je,
  e as Br
} from "./27R56OS5.js";

// node_modules/ws/lib/constants.js
var Ee = ce((Qp, Dn) => {
  "use strict";
  var Nn = ["nodebuffer", "arraybuffer", "fragments"], Vn = typeof Blob < "u";
  Vn && Nn.push("blob");
  Dn.exports = {
    BINARY_TYPES: Nn,
    CLOSE_TIMEOUT: 3e4,
    EMPTY_BUFFER: Buffer.alloc(0),
    GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    hasBlob: Vn,
    kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
    kListener: Symbol("kListener"),
    kStatusCode: Symbol("status-code"),
    kWebSocket: Symbol("websocket"),
    NOOP: /* @__PURE__ */ c(() => {
    }, "NOOP")
  };
});

// node_modules/ws/lib/buffer-util.js
var Hr = ce((qp, ho) => {
  "use strict";
  var { EMPTY_BUFFER: al } = Ee(), li = Buffer[Symbol.species];
  function ll(i, r) {
    if (i.length === 0) return al;
    if (i.length === 1) return i[0];
    let e = Buffer.allocUnsafe(r), o = 0;
    for (let t = 0; t < i.length; t++) {
      let n = i[t];
      e.set(n, o), o += n.length;
    }
    return o < r ? new li(e.buffer, e.byteOffset, o) : e;
  }
  c(ll, "concat");
  function Bn(i, r, e, o, t) {
    for (let n = 0; n < t; n++)
      e[o + n] = i[n] ^ r[n & 3];
  }
  c(Bn, "_mask");
  function Fn(i, r) {
    for (let e = 0; e < i.length; e++)
      i[e] ^= r[e & 3];
  }
  c(Fn, "_unmask");
  function dl(i) {
    return i.length === i.buffer.byteLength ? i.buffer : i.buffer.slice(i.byteOffset, i.byteOffset + i.length);
  }
  c(dl, "toArrayBuffer");
  function di(i) {
    if (di.readOnly = !0, Buffer.isBuffer(i)) return i;
    let r;
    return i instanceof ArrayBuffer ? r = new li(i) : ArrayBuffer.isView(i) ? r = new li(i.buffer, i.byteOffset, i.byteLength) : (r = Buffer.from(i), di.readOnly = !1), r;
  }
  c(di, "toBuffer");
  ho.exports = {
    concat: ll,
    mask: Bn,
    toArrayBuffer: dl,
    toBuffer: di,
    unmask: Fn
  };
  if (!process.env.WS_NO_BUFFER_UTIL)
    try {
      let i = Z("bufferutil");
      ho.exports.mask = function(r, e, o, t, n) {
        n < 48 ? Bn(r, e, o, t, n) : i.mask(r, e, o, t, n);
      }, ho.exports.unmask = function(r, e) {
        r.length < 32 ? Fn(r, e) : i.unmask(r, e);
      };
    } catch {
    }
});

// node_modules/ws/lib/limiter.js
var Wn = ce((rf, $n) => {
  "use strict";
  var Kn = Symbol("kDone"), ci = Symbol("kRun"), ui = class {
    static {
      c(this, "Limiter");
    }
    /**
     * Creates a new `Limiter`.
     *
     * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
     *     to run concurrently
     */
    constructor(r) {
      this[Kn] = () => {
        this.pending--, this[ci]();
      }, this.concurrency = r || 1 / 0, this.jobs = [], this.pending = 0;
    }
    /**
     * Adds a job to the queue.
     *
     * @param {Function} job The job to run
     * @public
     */
    add(r) {
      this.jobs.push(r), this[ci]();
    }
    /**
     * Removes a job from the queue and runs it if possible.
     *
     * @private
     */
    [ci]() {
      if (this.pending !== this.concurrency && this.jobs.length) {
        let r = this.jobs.shift();
        this.pending++, r(this[Kn]);
      }
    }
  };
  $n.exports = ui;
});

// node_modules/ws/lib/permessage-deflate.js
var Yr = ce((tf, Yn) => {
  "use strict";
  var Or = Z("zlib"), Gn = Hr(), cl = Wn(), { kStatusCode: Hn } = Ee(), ul = Buffer[Symbol.species], ml = Buffer.from([0, 0, 255, 255]), fo = Symbol("permessage-deflate"), Te = Symbol("total-length"), fr = Symbol("callback"), Ce = Symbol("buffers"), gr = Symbol("error"), po, mi = class {
    static {
      c(this, "PerMessageDeflate");
    }
    /**
     * Creates a PerMessageDeflate instance.
     *
     * @param {Object} [options] Configuration options
     * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
     *     for, or request, a custom client window size
     * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
     *     acknowledge disabling of client context takeover
     * @param {Number} [options.concurrencyLimit=10] The number of concurrent
     *     calls to zlib
     * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
     *     use of a custom server window size
     * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
     *     disabling of server context takeover
     * @param {Number} [options.threshold=1024] Size (in bytes) below which
     *     messages should not be compressed if context takeover is disabled
     * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
     *     deflate
     * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
     *     inflate
     * @param {Boolean} [isServer=false] Create the instance in either server or
     *     client mode
     * @param {Number} [maxPayload=0] The maximum allowed message length
     */
    constructor(r, e, o) {
      if (this._maxPayload = o | 0, this._options = r || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!e, this._deflate = null, this._inflate = null, this.params = null, !po) {
        let t = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
        po = new cl(t);
      }
    }
    /**
     * @type {String}
     */
    static get extensionName() {
      return "permessage-deflate";
    }
    /**
     * Create an extension negotiation offer.
     *
     * @return {Object} Extension parameters
     * @public
     */
    offer() {
      let r = {};
      return this._options.serverNoContextTakeover && (r.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (r.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (r.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? r.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits == null && (r.client_max_window_bits = !0), r;
    }
    /**
     * Accept an extension negotiation offer/response.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Object} Accepted configuration
     * @public
     */
    accept(r) {
      return r = this.normalizeParams(r), this.params = this._isServer ? this.acceptAsServer(r) : this.acceptAsClient(r), this.params;
    }
    /**
     * Releases all resources used by the extension.
     *
     * @public
     */
    cleanup() {
      if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
        let r = this._deflate[fr];
        this._deflate.close(), this._deflate = null, r && r(
          new Error(
            "The deflate stream was closed while data was being processed"
          )
        );
      }
    }
    /**
     *  Accept an extension negotiation offer.
     *
     * @param {Array} offers The extension negotiation offers
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsServer(r) {
      let e = this._options, o = r.find((t) => !(e.serverNoContextTakeover === !1 && t.server_no_context_takeover || t.server_max_window_bits && (e.serverMaxWindowBits === !1 || typeof e.serverMaxWindowBits == "number" && e.serverMaxWindowBits > t.server_max_window_bits) || typeof e.clientMaxWindowBits == "number" && !t.client_max_window_bits));
      if (!o)
        throw new Error("None of the extension offers can be accepted");
      return e.serverNoContextTakeover && (o.server_no_context_takeover = !0), e.clientNoContextTakeover && (o.client_no_context_takeover = !0), typeof e.serverMaxWindowBits == "number" && (o.server_max_window_bits = e.serverMaxWindowBits), typeof e.clientMaxWindowBits == "number" ? o.client_max_window_bits = e.clientMaxWindowBits : (o.client_max_window_bits === !0 || e.clientMaxWindowBits === !1) && delete o.client_max_window_bits, o;
    }
    /**
     * Accept the extension negotiation response.
     *
     * @param {Array} response The extension negotiation response
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsClient(r) {
      let e = r[0];
      if (this._options.clientNoContextTakeover === !1 && e.client_no_context_takeover)
        throw new Error('Unexpected parameter "client_no_context_takeover"');
      if (!e.client_max_window_bits)
        typeof this._options.clientMaxWindowBits == "number" && (e.client_max_window_bits = this._options.clientMaxWindowBits);
      else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && e.client_max_window_bits > this._options.clientMaxWindowBits)
        throw new Error(
          'Unexpected or invalid parameter "client_max_window_bits"'
        );
      return e;
    }
    /**
     * Normalize parameters.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Array} The offers/response with normalized parameters
     * @private
     */
    normalizeParams(r) {
      return r.forEach((e) => {
        Object.keys(e).forEach((o) => {
          let t = e[o];
          if (t.length > 1)
            throw new Error(`Parameter "${o}" must have only a single value`);
          if (t = t[0], o === "client_max_window_bits") {
            if (t !== !0) {
              let n = +t;
              if (!Number.isInteger(n) || n < 8 || n > 15)
                throw new TypeError(
                  `Invalid value for parameter "${o}": ${t}`
                );
              t = n;
            } else if (!this._isServer)
              throw new TypeError(
                `Invalid value for parameter "${o}": ${t}`
              );
          } else if (o === "server_max_window_bits") {
            let n = +t;
            if (!Number.isInteger(n) || n < 8 || n > 15)
              throw new TypeError(
                `Invalid value for parameter "${o}": ${t}`
              );
            t = n;
          } else if (o === "client_no_context_takeover" || o === "server_no_context_takeover") {
            if (t !== !0)
              throw new TypeError(
                `Invalid value for parameter "${o}": ${t}`
              );
          } else
            throw new Error(`Unknown parameter "${o}"`);
          e[o] = t;
        });
      }), r;
    }
    /**
     * Decompress data. Concurrency limited.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    decompress(r, e, o) {
      po.add((t) => {
        this._decompress(r, e, (n, s) => {
          t(), o(n, s);
        });
      });
    }
    /**
     * Compress data. Concurrency limited.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    compress(r, e, o) {
      po.add((t) => {
        this._compress(r, e, (n, s) => {
          t(), o(n, s);
        });
      });
    }
    /**
     * Decompress data.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _decompress(r, e, o) {
      let t = this._isServer ? "client" : "server";
      if (!this._inflate) {
        let n = `${t}_max_window_bits`, s = typeof this.params[n] != "number" ? Or.Z_DEFAULT_WINDOWBITS : this.params[n];
        this._inflate = Or.createInflateRaw({
          ...this._options.zlibInflateOptions,
          windowBits: s
        }), this._inflate[fo] = this, this._inflate[Te] = 0, this._inflate[Ce] = [], this._inflate.on("error", pl), this._inflate.on("data", On);
      }
      this._inflate[fr] = o, this._inflate.write(r), e && this._inflate.write(ml), this._inflate.flush(() => {
        let n = this._inflate[gr];
        if (n) {
          this._inflate.close(), this._inflate = null, o(n);
          return;
        }
        let s = Gn.concat(
          this._inflate[Ce],
          this._inflate[Te]
        );
        this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[Te] = 0, this._inflate[Ce] = [], e && this.params[`${t}_no_context_takeover`] && this._inflate.reset()), o(null, s);
      });
    }
    /**
     * Compress data.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _compress(r, e, o) {
      let t = this._isServer ? "server" : "client";
      if (!this._deflate) {
        let n = `${t}_max_window_bits`, s = typeof this.params[n] != "number" ? Or.Z_DEFAULT_WINDOWBITS : this.params[n];
        this._deflate = Or.createDeflateRaw({
          ...this._options.zlibDeflateOptions,
          windowBits: s
        }), this._deflate[Te] = 0, this._deflate[Ce] = [], this._deflate.on("data", hl);
      }
      this._deflate[fr] = o, this._deflate.write(r), this._deflate.flush(Or.Z_SYNC_FLUSH, () => {
        if (!this._deflate)
          return;
        let n = Gn.concat(
          this._deflate[Ce],
          this._deflate[Te]
        );
        e && (n = new ul(n.buffer, n.byteOffset, n.length - 4)), this._deflate[fr] = null, this._deflate[Te] = 0, this._deflate[Ce] = [], e && this.params[`${t}_no_context_takeover`] && this._deflate.reset(), o(null, n);
      });
    }
  };
  Yn.exports = mi;
  function hl(i) {
    this[Ce].push(i), this[Te] += i.length;
  }
  c(hl, "deflateOnData");
  function On(i) {
    if (this[Te] += i.length, this[fo]._maxPayload < 1 || this[Te] <= this[fo]._maxPayload) {
      this[Ce].push(i);
      return;
    }
    this[gr] = new RangeError("Max payload size exceeded"), this[gr].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[gr][Hn] = 1009, this.removeListener("data", On), this.reset();
  }
  c(On, "inflateOnData");
  function pl(i) {
    if (this[fo]._inflate = null, this[gr]) {
      this[fr](this[gr]);
      return;
    }
    i[Hn] = 1007, this[fr](i);
  }
  c(pl, "inflateOnError");
});

// node_modules/ws/lib/validation.js
var _r = ce((sf, go) => {
  "use strict";
  var { isUtf8: Jn } = Z("buffer"), { hasBlob: fl } = Ee(), gl = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0 - 15
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 16 - 31
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    // 32 - 47
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    // 48 - 63
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 64 - 79
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    // 80 - 95
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 96 - 111
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    0,
    1,
    0
    // 112 - 127
  ];
  function _l(i) {
    return i >= 1e3 && i <= 1014 && i !== 1004 && i !== 1005 && i !== 1006 || i >= 3e3 && i <= 4999;
  }
  c(_l, "isValidStatusCode");
  function hi(i) {
    let r = i.length, e = 0;
    for (; e < r; )
      if ((i[e] & 128) === 0)
        e++;
      else if ((i[e] & 224) === 192) {
        if (e + 1 === r || (i[e + 1] & 192) !== 128 || (i[e] & 254) === 192)
          return !1;
        e += 2;
      } else if ((i[e] & 240) === 224) {
        if (e + 2 >= r || (i[e + 1] & 192) !== 128 || (i[e + 2] & 192) !== 128 || i[e] === 224 && (i[e + 1] & 224) === 128 || // Overlong
        i[e] === 237 && (i[e + 1] & 224) === 160)
          return !1;
        e += 3;
      } else if ((i[e] & 248) === 240) {
        if (e + 3 >= r || (i[e + 1] & 192) !== 128 || (i[e + 2] & 192) !== 128 || (i[e + 3] & 192) !== 128 || i[e] === 240 && (i[e + 1] & 240) === 128 || // Overlong
        i[e] === 244 && i[e + 1] > 143 || i[e] > 244)
          return !1;
        e += 4;
      } else
        return !1;
    return !0;
  }
  c(hi, "_isValidUTF8");
  function vl(i) {
    return fl && typeof i == "object" && typeof i.arrayBuffer == "function" && typeof i.type == "string" && typeof i.stream == "function" && (i[Symbol.toStringTag] === "Blob" || i[Symbol.toStringTag] === "File");
  }
  c(vl, "isBlob");
  go.exports = {
    isBlob: vl,
    isValidStatusCode: _l,
    isValidUTF8: hi,
    tokenChars: gl
  };
  if (Jn)
    go.exports.isValidUTF8 = function(i) {
      return i.length < 24 ? hi(i) : Jn(i);
    };
  else if (!process.env.WS_NO_UTF_8_VALIDATE)
    try {
      let i = Z("utf-8-validate");
      go.exports.isValidUTF8 = function(r) {
        return r.length < 32 ? hi(r) : i(r);
      };
    } catch {
    }
});

// node_modules/ws/lib/receiver.js
var vi = ce((lf, os) => {
  "use strict";
  var { Writable: wl } = Z("stream"), Xn = Yr(), {
    BINARY_TYPES: bl,
    EMPTY_BUFFER: Qn,
    kStatusCode: yl,
    kWebSocket: xl
  } = Ee(), { concat: pi, toArrayBuffer: Rl, unmask: El } = Hr(), { isValidStatusCode: Tl, isValidUTF8: Zn } = _r(), _o = Buffer[Symbol.species], he = 0, qn = 1, es = 2, rs = 3, fi = 4, gi = 5, vo = 6, _i = class extends wl {
    static {
      c(this, "Receiver");
    }
    /**
     * Creates a Receiver instance.
     *
     * @param {Object} [options] Options object
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {String} [options.binaryType=nodebuffer] The type for binary data
     * @param {Object} [options.extensions] An object containing the negotiated
     *     extensions
     * @param {Boolean} [options.isServer=false] Specifies whether to operate in
     *     client or server mode
     * @param {Number} [options.maxPayload=0] The maximum allowed message length
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     */
    constructor(r = {}) {
      super(), this._allowSynchronousEvents = r.allowSynchronousEvents !== void 0 ? r.allowSynchronousEvents : !0, this._binaryType = r.binaryType || bl[0], this._extensions = r.extensions || {}, this._isServer = !!r.isServer, this._maxPayload = r.maxPayload | 0, this._skipUTF8Validation = !!r.skipUTF8Validation, this[xl] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = he;
    }
    /**
     * Implements `Writable.prototype._write()`.
     *
     * @param {Buffer} chunk The chunk of data to write
     * @param {String} encoding The character encoding of `chunk`
     * @param {Function} cb Callback
     * @private
     */
    _write(r, e, o) {
      if (this._opcode === 8 && this._state == he) return o();
      this._bufferedBytes += r.length, this._buffers.push(r), this.startLoop(o);
    }
    /**
     * Consumes `n` bytes from the buffered data.
     *
     * @param {Number} n The number of bytes to consume
     * @return {Buffer} The consumed bytes
     * @private
     */
    consume(r) {
      if (this._bufferedBytes -= r, r === this._buffers[0].length) return this._buffers.shift();
      if (r < this._buffers[0].length) {
        let o = this._buffers[0];
        return this._buffers[0] = new _o(
          o.buffer,
          o.byteOffset + r,
          o.length - r
        ), new _o(o.buffer, o.byteOffset, r);
      }
      let e = Buffer.allocUnsafe(r);
      do {
        let o = this._buffers[0], t = e.length - r;
        r >= o.length ? e.set(this._buffers.shift(), t) : (e.set(new Uint8Array(o.buffer, o.byteOffset, r), t), this._buffers[0] = new _o(
          o.buffer,
          o.byteOffset + r,
          o.length - r
        )), r -= o.length;
      } while (r > 0);
      return e;
    }
    /**
     * Starts the parsing loop.
     *
     * @param {Function} cb Callback
     * @private
     */
    startLoop(r) {
      this._loop = !0;
      do
        switch (this._state) {
          case he:
            this.getInfo(r);
            break;
          case qn:
            this.getPayloadLength16(r);
            break;
          case es:
            this.getPayloadLength64(r);
            break;
          case rs:
            this.getMask();
            break;
          case fi:
            this.getData(r);
            break;
          case gi:
          case vo:
            this._loop = !1;
            return;
        }
      while (this._loop);
      this._errored || r();
    }
    /**
     * Reads the first two bytes of a frame.
     *
     * @param {Function} cb Callback
     * @private
     */
    getInfo(r) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return;
      }
      let e = this.consume(2);
      if ((e[0] & 48) !== 0) {
        let t = this.createError(
          RangeError,
          "RSV2 and RSV3 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_2_3"
        );
        r(t);
        return;
      }
      let o = (e[0] & 64) === 64;
      if (o && !this._extensions[Xn.extensionName]) {
        let t = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        r(t);
        return;
      }
      if (this._fin = (e[0] & 128) === 128, this._opcode = e[0] & 15, this._payloadLength = e[1] & 127, this._opcode === 0) {
        if (o) {
          let t = this.createError(
            RangeError,
            "RSV1 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          r(t);
          return;
        }
        if (!this._fragmented) {
          let t = this.createError(
            RangeError,
            "invalid opcode 0",
            !0,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          r(t);
          return;
        }
        this._opcode = this._fragmented;
      } else if (this._opcode === 1 || this._opcode === 2) {
        if (this._fragmented) {
          let t = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            !0,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          r(t);
          return;
        }
        this._compressed = o;
      } else if (this._opcode > 7 && this._opcode < 11) {
        if (!this._fin) {
          let t = this.createError(
            RangeError,
            "FIN must be set",
            !0,
            1002,
            "WS_ERR_EXPECTED_FIN"
          );
          r(t);
          return;
        }
        if (o) {
          let t = this.createError(
            RangeError,
            "RSV1 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          r(t);
          return;
        }
        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
          let t = this.createError(
            RangeError,
            `invalid payload length ${this._payloadLength}`,
            !0,
            1002,
            "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
          );
          r(t);
          return;
        }
      } else {
        let t = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        r(t);
        return;
      }
      if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (e[1] & 128) === 128, this._isServer) {
        if (!this._masked) {
          let t = this.createError(
            RangeError,
            "MASK must be set",
            !0,
            1002,
            "WS_ERR_EXPECTED_MASK"
          );
          r(t);
          return;
        }
      } else if (this._masked) {
        let t = this.createError(
          RangeError,
          "MASK must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_MASK"
        );
        r(t);
        return;
      }
      this._payloadLength === 126 ? this._state = qn : this._payloadLength === 127 ? this._state = es : this.haveLength(r);
    }
    /**
     * Gets extended payload length (7+16).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength16(r) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return;
      }
      this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(r);
    }
    /**
     * Gets extended payload length (7+64).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength64(r) {
      if (this._bufferedBytes < 8) {
        this._loop = !1;
        return;
      }
      let e = this.consume(8), o = e.readUInt32BE(0);
      if (o > Math.pow(2, 21) - 1) {
        let t = this.createError(
          RangeError,
          "Unsupported WebSocket frame: payload length > 2^53 - 1",
          !1,
          1009,
          "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
        );
        r(t);
        return;
      }
      this._payloadLength = o * Math.pow(2, 32) + e.readUInt32BE(4), this.haveLength(r);
    }
    /**
     * Payload length has been read.
     *
     * @param {Function} cb Callback
     * @private
     */
    haveLength(r) {
      if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) {
        let e = this.createError(
          RangeError,
          "Max payload size exceeded",
          !1,
          1009,
          "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
        );
        r(e);
        return;
      }
      this._masked ? this._state = rs : this._state = fi;
    }
    /**
     * Reads mask bytes.
     *
     * @private
     */
    getMask() {
      if (this._bufferedBytes < 4) {
        this._loop = !1;
        return;
      }
      this._mask = this.consume(4), this._state = fi;
    }
    /**
     * Reads data bytes.
     *
     * @param {Function} cb Callback
     * @private
     */
    getData(r) {
      let e = Qn;
      if (this._payloadLength) {
        if (this._bufferedBytes < this._payloadLength) {
          this._loop = !1;
          return;
        }
        e = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0 && El(e, this._mask);
      }
      if (this._opcode > 7) {
        this.controlMessage(e, r);
        return;
      }
      if (this._compressed) {
        this._state = gi, this.decompress(e, r);
        return;
      }
      e.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(e)), this.dataMessage(r);
    }
    /**
     * Decompresses data.
     *
     * @param {Buffer} data Compressed data
     * @param {Function} cb Callback
     * @private
     */
    decompress(r, e) {
      this._extensions[Xn.extensionName].decompress(r, this._fin, (t, n) => {
        if (t) return e(t);
        if (n.length) {
          if (this._messageLength += n.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
            let s = this.createError(
              RangeError,
              "Max payload size exceeded",
              !1,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            e(s);
            return;
          }
          this._fragments.push(n);
        }
        this.dataMessage(e), this._state === he && this.startLoop(e);
      });
    }
    /**
     * Handles a data message.
     *
     * @param {Function} cb Callback
     * @private
     */
    dataMessage(r) {
      if (!this._fin) {
        this._state = he;
        return;
      }
      let e = this._messageLength, o = this._fragments;
      if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
        let t;
        this._binaryType === "nodebuffer" ? t = pi(o, e) : this._binaryType === "arraybuffer" ? t = Rl(pi(o, e)) : this._binaryType === "blob" ? t = new Blob(o) : t = o, this._allowSynchronousEvents ? (this.emit("message", t, !0), this._state = he) : (this._state = vo, setImmediate(() => {
          this.emit("message", t, !0), this._state = he, this.startLoop(r);
        }));
      } else {
        let t = pi(o, e);
        if (!this._skipUTF8Validation && !Zn(t)) {
          let n = this.createError(
            Error,
            "invalid UTF-8 sequence",
            !0,
            1007,
            "WS_ERR_INVALID_UTF8"
          );
          r(n);
          return;
        }
        this._state === gi || this._allowSynchronousEvents ? (this.emit("message", t, !1), this._state = he) : (this._state = vo, setImmediate(() => {
          this.emit("message", t, !1), this._state = he, this.startLoop(r);
        }));
      }
    }
    /**
     * Handles a control message.
     *
     * @param {Buffer} data Data to handle
     * @return {(Error|RangeError|undefined)} A possible error
     * @private
     */
    controlMessage(r, e) {
      if (this._opcode === 8) {
        if (r.length === 0)
          this._loop = !1, this.emit("conclude", 1005, Qn), this.end();
        else {
          let o = r.readUInt16BE(0);
          if (!Tl(o)) {
            let n = this.createError(
              RangeError,
              `invalid status code ${o}`,
              !0,
              1002,
              "WS_ERR_INVALID_CLOSE_CODE"
            );
            e(n);
            return;
          }
          let t = new _o(
            r.buffer,
            r.byteOffset + 2,
            r.length - 2
          );
          if (!this._skipUTF8Validation && !Zn(t)) {
            let n = this.createError(
              Error,
              "invalid UTF-8 sequence",
              !0,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            e(n);
            return;
          }
          this._loop = !1, this.emit("conclude", o, t), this.end();
        }
        this._state = he;
        return;
      }
      this._allowSynchronousEvents ? (this.emit(this._opcode === 9 ? "ping" : "pong", r), this._state = he) : (this._state = vo, setImmediate(() => {
        this.emit(this._opcode === 9 ? "ping" : "pong", r), this._state = he, this.startLoop(e);
      }));
    }
    /**
     * Builds an error object.
     *
     * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
     * @param {String} message The error message
     * @param {Boolean} prefix Specifies whether or not to add a default prefix to
     *     `message`
     * @param {Number} statusCode The status code
     * @param {String} errorCode The exposed error code
     * @return {(Error|RangeError)} The error
     * @private
     */
    createError(r, e, o, t, n) {
      this._loop = !1, this._errored = !0;
      let s = new r(
        o ? `Invalid WebSocket frame: ${e}` : e
      );
      return Error.captureStackTrace(s, this.createError), s.code = n, s[yl] = t, s;
    }
  };
  os.exports = _i;
});

// node_modules/ws/lib/sender.js
var yi = ce((uf, ns) => {
  "use strict";
  var { Duplex: cf } = Z("stream"), { randomFillSync: zl } = Z("crypto"), ts = Yr(), { EMPTY_BUFFER: Sl, kWebSocket: Pl, NOOP: Ml } = Ee(), { isBlob: vr, isValidStatusCode: jl } = _r(), { mask: is, toBuffer: or } = Hr(), pe = Symbol("kByteLength"), Al = Buffer.alloc(4), wo = 8 * 1024, tr, wr = wo, _e = 0, kl = 1, Ul = 2, wi = class i {
    static {
      c(this, "Sender");
    }
    /**
     * Creates a Sender instance.
     *
     * @param {Duplex} socket The connection socket
     * @param {Object} [extensions] An object containing the negotiated extensions
     * @param {Function} [generateMask] The function used to generate the masking
     *     key
     */
    constructor(r, e, o) {
      this._extensions = e || {}, o && (this._generateMask = o, this._maskBuffer = Buffer.alloc(4)), this._socket = r, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = _e, this.onerror = Ml, this[Pl] = void 0;
    }
    /**
     * Frames a piece of data according to the HyBi WebSocket protocol.
     *
     * @param {(Buffer|String)} data The data to frame
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @return {(Buffer|String)[]} The framed data
     * @public
     */
    static frame(r, e) {
      let o, t = !1, n = 2, s = !1;
      e.mask && (o = e.maskBuffer || Al, e.generateMask ? e.generateMask(o) : (wr === wo && (tr === void 0 && (tr = Buffer.alloc(wo)), zl(tr, 0, wo), wr = 0), o[0] = tr[wr++], o[1] = tr[wr++], o[2] = tr[wr++], o[3] = tr[wr++]), s = (o[0] | o[1] | o[2] | o[3]) === 0, n = 6);
      let u;
      typeof r == "string" ? (!e.mask || s) && e[pe] !== void 0 ? u = e[pe] : (r = Buffer.from(r), u = r.length) : (u = r.length, t = e.mask && e.readOnly && !s);
      let m = u;
      u >= 65536 ? (n += 8, m = 127) : u > 125 && (n += 2, m = 126);
      let d = Buffer.allocUnsafe(t ? u + n : n);
      return d[0] = e.fin ? e.opcode | 128 : e.opcode, e.rsv1 && (d[0] |= 64), d[1] = m, m === 126 ? d.writeUInt16BE(u, 2) : m === 127 && (d[2] = d[3] = 0, d.writeUIntBE(u, 4, 6)), e.mask ? (d[1] |= 128, d[n - 4] = o[0], d[n - 3] = o[1], d[n - 2] = o[2], d[n - 1] = o[3], s ? [d, r] : t ? (is(r, o, d, n, u), [d]) : (is(r, o, r, 0, u), [d, r])) : [d, r];
    }
    /**
     * Sends a close message to the other peer.
     *
     * @param {Number} [code] The status code component of the body
     * @param {(String|Buffer)} [data] The message component of the body
     * @param {Boolean} [mask=false] Specifies whether or not to mask the message
     * @param {Function} [cb] Callback
     * @public
     */
    close(r, e, o, t) {
      let n;
      if (r === void 0)
        n = Sl;
      else {
        if (typeof r != "number" || !jl(r))
          throw new TypeError("First argument must be a valid error code number");
        if (e === void 0 || !e.length)
          n = Buffer.allocUnsafe(2), n.writeUInt16BE(r, 0);
        else {
          let u = Buffer.byteLength(e);
          if (u > 123)
            throw new RangeError("The message must not be greater than 123 bytes");
          n = Buffer.allocUnsafe(2 + u), n.writeUInt16BE(r, 0), typeof e == "string" ? n.write(e, 2) : n.set(e, 2);
        }
      }
      let s = {
        [pe]: n.length,
        fin: !0,
        generateMask: this._generateMask,
        mask: o,
        maskBuffer: this._maskBuffer,
        opcode: 8,
        readOnly: !1,
        rsv1: !1
      };
      this._state !== _e ? this.enqueue([this.dispatch, n, !1, s, t]) : this.sendFrame(i.frame(n, s), t);
    }
    /**
     * Sends a ping message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    ping(r, e, o) {
      let t, n;
      if (typeof r == "string" ? (t = Buffer.byteLength(r), n = !1) : vr(r) ? (t = r.size, n = !1) : (r = or(r), t = r.length, n = or.readOnly), t > 125)
        throw new RangeError("The data size must not be greater than 125 bytes");
      let s = {
        [pe]: t,
        fin: !0,
        generateMask: this._generateMask,
        mask: e,
        maskBuffer: this._maskBuffer,
        opcode: 9,
        readOnly: n,
        rsv1: !1
      };
      vr(r) ? this._state !== _e ? this.enqueue([this.getBlobData, r, !1, s, o]) : this.getBlobData(r, !1, s, o) : this._state !== _e ? this.enqueue([this.dispatch, r, !1, s, o]) : this.sendFrame(i.frame(r, s), o);
    }
    /**
     * Sends a pong message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    pong(r, e, o) {
      let t, n;
      if (typeof r == "string" ? (t = Buffer.byteLength(r), n = !1) : vr(r) ? (t = r.size, n = !1) : (r = or(r), t = r.length, n = or.readOnly), t > 125)
        throw new RangeError("The data size must not be greater than 125 bytes");
      let s = {
        [pe]: t,
        fin: !0,
        generateMask: this._generateMask,
        mask: e,
        maskBuffer: this._maskBuffer,
        opcode: 10,
        readOnly: n,
        rsv1: !1
      };
      vr(r) ? this._state !== _e ? this.enqueue([this.getBlobData, r, !1, s, o]) : this.getBlobData(r, !1, s, o) : this._state !== _e ? this.enqueue([this.dispatch, r, !1, s, o]) : this.sendFrame(i.frame(r, s), o);
    }
    /**
     * Sends a data message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Object} options Options object
     * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
     *     or text
     * @param {Boolean} [options.compress=false] Specifies whether or not to
     *     compress `data`
     * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Function} [cb] Callback
     * @public
     */
    send(r, e, o) {
      let t = this._extensions[ts.extensionName], n = e.binary ? 2 : 1, s = e.compress, u, m;
      typeof r == "string" ? (u = Buffer.byteLength(r), m = !1) : vr(r) ? (u = r.size, m = !1) : (r = or(r), u = r.length, m = or.readOnly), this._firstFragment ? (this._firstFragment = !1, s && t && t.params[t._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (s = u >= t._threshold), this._compress = s) : (s = !1, n = 0), e.fin && (this._firstFragment = !0);
      let d = {
        [pe]: u,
        fin: e.fin,
        generateMask: this._generateMask,
        mask: e.mask,
        maskBuffer: this._maskBuffer,
        opcode: n,
        readOnly: m,
        rsv1: s
      };
      vr(r) ? this._state !== _e ? this.enqueue([this.getBlobData, r, this._compress, d, o]) : this.getBlobData(r, this._compress, d, o) : this._state !== _e ? this.enqueue([this.dispatch, r, this._compress, d, o]) : this.dispatch(r, this._compress, d, o);
    }
    /**
     * Gets the contents of a blob as binary data.
     *
     * @param {Blob} blob The blob
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     the data
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    getBlobData(r, e, o, t) {
      this._bufferedBytes += o[pe], this._state = Ul, r.arrayBuffer().then((n) => {
        if (this._socket.destroyed) {
          let u = new Error(
            "The socket was closed while the blob was being read"
          );
          process.nextTick(bi, this, u, t);
          return;
        }
        this._bufferedBytes -= o[pe];
        let s = or(n);
        e ? this.dispatch(s, e, o, t) : (this._state = _e, this.sendFrame(i.frame(s, o), t), this.dequeue());
      }).catch((n) => {
        process.nextTick(Il, this, n, t);
      });
    }
    /**
     * Dispatches a message.
     *
     * @param {(Buffer|String)} data The message to send
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     `data`
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    dispatch(r, e, o, t) {
      if (!e) {
        this.sendFrame(i.frame(r, o), t);
        return;
      }
      let n = this._extensions[ts.extensionName];
      this._bufferedBytes += o[pe], this._state = kl, n.compress(r, o.fin, (s, u) => {
        if (this._socket.destroyed) {
          let m = new Error(
            "The socket was closed while data was being compressed"
          );
          bi(this, m, t);
          return;
        }
        this._bufferedBytes -= o[pe], this._state = _e, o.readOnly = !1, this.sendFrame(i.frame(u, o), t), this.dequeue();
      });
    }
    /**
     * Executes queued send operations.
     *
     * @private
     */
    dequeue() {
      for (; this._state === _e && this._queue.length; ) {
        let r = this._queue.shift();
        this._bufferedBytes -= r[3][pe], Reflect.apply(r[0], this, r.slice(1));
      }
    }
    /**
     * Enqueues a send operation.
     *
     * @param {Array} params Send operation parameters.
     * @private
     */
    enqueue(r) {
      this._bufferedBytes += r[3][pe], this._queue.push(r);
    }
    /**
     * Sends a frame.
     *
     * @param {(Buffer | String)[]} list The frame to send
     * @param {Function} [cb] Callback
     * @private
     */
    sendFrame(r, e) {
      r.length === 2 ? (this._socket.cork(), this._socket.write(r[0]), this._socket.write(r[1], e), this._socket.uncork()) : this._socket.write(r[0], e);
    }
  };
  ns.exports = wi;
  function bi(i, r, e) {
    typeof e == "function" && e(r);
    for (let o = 0; o < i._queue.length; o++) {
      let t = i._queue[o], n = t[t.length - 1];
      typeof n == "function" && n(r);
    }
  }
  c(bi, "callCallbacks");
  function Il(i, r, e) {
    bi(i, r, e), i.onerror(r);
  }
  c(Il, "onError");
});

// node_modules/ws/lib/event-target.js
var ps = ce((hf, hs) => {
  "use strict";
  var { kForOnEventAttribute: Jr, kListener: xi } = Ee(), ss = Symbol("kCode"), as = Symbol("kData"), ls = Symbol("kError"), ds = Symbol("kMessage"), cs = Symbol("kReason"), br = Symbol("kTarget"), us = Symbol("kType"), ms = Symbol("kWasClean"), ze = class {
    static {
      c(this, "Event");
    }
    /**
     * Create a new `Event`.
     *
     * @param {String} type The name of the event
     * @throws {TypeError} If the `type` argument is not specified
     */
    constructor(r) {
      this[br] = null, this[us] = r;
    }
    /**
     * @type {*}
     */
    get target() {
      return this[br];
    }
    /**
     * @type {String}
     */
    get type() {
      return this[us];
    }
  };
  Object.defineProperty(ze.prototype, "target", { enumerable: !0 });
  Object.defineProperty(ze.prototype, "type", { enumerable: !0 });
  var ir = class extends ze {
    static {
      c(this, "CloseEvent");
    }
    /**
     * Create a new `CloseEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {Number} [options.code=0] The status code explaining why the
     *     connection was closed
     * @param {String} [options.reason=''] A human-readable string explaining why
     *     the connection was closed
     * @param {Boolean} [options.wasClean=false] Indicates whether or not the
     *     connection was cleanly closed
     */
    constructor(r, e = {}) {
      super(r), this[ss] = e.code === void 0 ? 0 : e.code, this[cs] = e.reason === void 0 ? "" : e.reason, this[ms] = e.wasClean === void 0 ? !1 : e.wasClean;
    }
    /**
     * @type {Number}
     */
    get code() {
      return this[ss];
    }
    /**
     * @type {String}
     */
    get reason() {
      return this[cs];
    }
    /**
     * @type {Boolean}
     */
    get wasClean() {
      return this[ms];
    }
  };
  Object.defineProperty(ir.prototype, "code", { enumerable: !0 });
  Object.defineProperty(ir.prototype, "reason", { enumerable: !0 });
  Object.defineProperty(ir.prototype, "wasClean", { enumerable: !0 });
  var yr = class extends ze {
    static {
      c(this, "ErrorEvent");
    }
    /**
     * Create a new `ErrorEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.error=null] The error that generated this event
     * @param {String} [options.message=''] The error message
     */
    constructor(r, e = {}) {
      super(r), this[ls] = e.error === void 0 ? null : e.error, this[ds] = e.message === void 0 ? "" : e.message;
    }
    /**
     * @type {*}
     */
    get error() {
      return this[ls];
    }
    /**
     * @type {String}
     */
    get message() {
      return this[ds];
    }
  };
  Object.defineProperty(yr.prototype, "error", { enumerable: !0 });
  Object.defineProperty(yr.prototype, "message", { enumerable: !0 });
  var Xr = class extends ze {
    static {
      c(this, "MessageEvent");
    }
    /**
     * Create a new `MessageEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.data=null] The message content
     */
    constructor(r, e = {}) {
      super(r), this[as] = e.data === void 0 ? null : e.data;
    }
    /**
     * @type {*}
     */
    get data() {
      return this[as];
    }
  };
  Object.defineProperty(Xr.prototype, "data", { enumerable: !0 });
  var Cl = {
    /**
     * Register an event listener.
     *
     * @param {String} type A string representing the event type to listen for
     * @param {(Function|Object)} handler The listener to add
     * @param {Object} [options] An options object specifies characteristics about
     *     the event listener
     * @param {Boolean} [options.once=false] A `Boolean` indicating that the
     *     listener should be invoked at most once after being added. If `true`,
     *     the listener would be automatically removed when invoked.
     * @public
     */
    addEventListener(i, r, e = {}) {
      for (let t of this.listeners(i))
        if (!e[Jr] && t[xi] === r && !t[Jr])
          return;
      let o;
      if (i === "message")
        o = /* @__PURE__ */ c(function(n, s) {
          let u = new Xr("message", {
            data: s ? n : n.toString()
          });
          u[br] = this, bo(r, this, u);
        }, "onMessage");
      else if (i === "close")
        o = /* @__PURE__ */ c(function(n, s) {
          let u = new ir("close", {
            code: n,
            reason: s.toString(),
            wasClean: this._closeFrameReceived && this._closeFrameSent
          });
          u[br] = this, bo(r, this, u);
        }, "onClose");
      else if (i === "error")
        o = /* @__PURE__ */ c(function(n) {
          let s = new yr("error", {
            error: n,
            message: n.message
          });
          s[br] = this, bo(r, this, s);
        }, "onError");
      else if (i === "open")
        o = /* @__PURE__ */ c(function() {
          let n = new ze("open");
          n[br] = this, bo(r, this, n);
        }, "onOpen");
      else
        return;
      o[Jr] = !!e[Jr], o[xi] = r, e.once ? this.once(i, o) : this.on(i, o);
    },
    /**
     * Remove an event listener.
     *
     * @param {String} type A string representing the event type to remove
     * @param {(Function|Object)} handler The listener to remove
     * @public
     */
    removeEventListener(i, r) {
      for (let e of this.listeners(i))
        if (e[xi] === r && !e[Jr]) {
          this.removeListener(i, e);
          break;
        }
    }
  };
  hs.exports = {
    CloseEvent: ir,
    ErrorEvent: yr,
    Event: ze,
    EventTarget: Cl,
    MessageEvent: Xr
  };
  function bo(i, r, e) {
    typeof i == "object" && i.handleEvent ? i.handleEvent.call(i, e) : i.call(r, e);
  }
  c(bo, "callListener");
});

// node_modules/ws/lib/extension.js
var Ri = ce((ff, fs) => {
  "use strict";
  var { tokenChars: Qr } = _r();
  function be(i, r, e) {
    i[r] === void 0 ? i[r] = [e] : i[r].push(e);
  }
  c(be, "push");
  function Ll(i) {
    let r = /* @__PURE__ */ Object.create(null), e = /* @__PURE__ */ Object.create(null), o = !1, t = !1, n = !1, s, u, m = -1, d = -1, l = -1, p = 0;
    for (; p < i.length; p++)
      if (d = i.charCodeAt(p), s === void 0)
        if (l === -1 && Qr[d] === 1)
          m === -1 && (m = p);
        else if (p !== 0 && (d === 32 || d === 9))
          l === -1 && m !== -1 && (l = p);
        else if (d === 59 || d === 44) {
          if (m === -1)
            throw new SyntaxError(`Unexpected character at index ${p}`);
          l === -1 && (l = p);
          let w = i.slice(m, l);
          d === 44 ? (be(r, w, e), e = /* @__PURE__ */ Object.create(null)) : s = w, m = l = -1;
        } else
          throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (u === void 0)
        if (l === -1 && Qr[d] === 1)
          m === -1 && (m = p);
        else if (d === 32 || d === 9)
          l === -1 && m !== -1 && (l = p);
        else if (d === 59 || d === 44) {
          if (m === -1)
            throw new SyntaxError(`Unexpected character at index ${p}`);
          l === -1 && (l = p), be(e, i.slice(m, l), !0), d === 44 && (be(r, s, e), e = /* @__PURE__ */ Object.create(null), s = void 0), m = l = -1;
        } else if (d === 61 && m !== -1 && l === -1)
          u = i.slice(m, p), m = l = -1;
        else
          throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (t) {
        if (Qr[d] !== 1)
          throw new SyntaxError(`Unexpected character at index ${p}`);
        m === -1 ? m = p : o || (o = !0), t = !1;
      } else if (n)
        if (Qr[d] === 1)
          m === -1 && (m = p);
        else if (d === 34 && m !== -1)
          n = !1, l = p;
        else if (d === 92)
          t = !0;
        else
          throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (d === 34 && i.charCodeAt(p - 1) === 61)
        n = !0;
      else if (l === -1 && Qr[d] === 1)
        m === -1 && (m = p);
      else if (m !== -1 && (d === 32 || d === 9))
        l === -1 && (l = p);
      else if (d === 59 || d === 44) {
        if (m === -1)
          throw new SyntaxError(`Unexpected character at index ${p}`);
        l === -1 && (l = p);
        let w = i.slice(m, l);
        o && (w = w.replace(/\\/g, ""), o = !1), be(e, u, w), d === 44 && (be(r, s, e), e = /* @__PURE__ */ Object.create(null), s = void 0), u = void 0, m = l = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${p}`);
    if (m === -1 || n || d === 32 || d === 9)
      throw new SyntaxError("Unexpected end of input");
    l === -1 && (l = p);
    let g = i.slice(m, l);
    return s === void 0 ? be(r, g, e) : (u === void 0 ? be(e, g, !0) : o ? be(e, u, g.replace(/\\/g, "")) : be(e, u, g), be(r, s, e)), r;
  }
  c(Ll, "parse");
  function Nl(i) {
    return Object.keys(i).map((r) => {
      let e = i[r];
      return Array.isArray(e) || (e = [e]), e.map((o) => [r].concat(
        Object.keys(o).map((t) => {
          let n = o[t];
          return Array.isArray(n) || (n = [n]), n.map((s) => s === !0 ? t : `${t}=${s}`).join("; ");
        })
      ).join("; ")).join(", ");
    }).join(", ");
  }
  c(Nl, "format");
  fs.exports = { format: Nl, parse: Ll };
});

// node_modules/ws/lib/websocket.js
var Eo = ce((wf, Ss) => {
  "use strict";
  var Vl = Z("events"), Dl = Z("https"), Bl = Z("http"), vs = Z("net"), Fl = Z("tls"), { randomBytes: Kl, createHash: $l } = Z("crypto"), { Duplex: _f, Readable: vf } = Z("stream"), { URL: Ei } = Z("url"), Le = Yr(), Wl = vi(), Gl = yi(), { isBlob: Hl } = _r(), {
    BINARY_TYPES: gs,
    CLOSE_TIMEOUT: Ol,
    EMPTY_BUFFER: yo,
    GUID: Yl,
    kForOnEventAttribute: Ti,
    kListener: Jl,
    kStatusCode: Xl,
    kWebSocket: re,
    NOOP: ws
  } = Ee(), {
    EventTarget: { addEventListener: Ql, removeEventListener: Zl }
  } = ps(), { format: ql, parse: ed } = Ri(), { toBuffer: rd } = Hr(), bs = Symbol("kAborted"), zi = [8, 13], Se = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"], od = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/, Y = class i extends Vl {
    static {
      c(this, "WebSocket");
    }
    /**
     * Create a new `WebSocket`.
     *
     * @param {(String|URL)} address The URL to which to connect
     * @param {(String|String[])} [protocols] The subprotocols
     * @param {Object} [options] Connection options
     */
    constructor(r, e, o) {
      super(), this._binaryType = gs[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = yo, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = i.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, r !== null ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, e === void 0 ? e = [] : Array.isArray(e) || (typeof e == "object" && e !== null ? (o = e, e = []) : e = [e]), ys(this, r, e, o)) : (this._autoPong = o.autoPong, this._closeTimeout = o.closeTimeout, this._isServer = !0);
    }
    /**
     * For historical reasons, the custom "nodebuffer" type is used by the default
     * instead of "blob".
     *
     * @type {String}
     */
    get binaryType() {
      return this._binaryType;
    }
    set binaryType(r) {
      gs.includes(r) && (this._binaryType = r, this._receiver && (this._receiver._binaryType = r));
    }
    /**
     * @type {Number}
     */
    get bufferedAmount() {
      return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount;
    }
    /**
     * @type {String}
     */
    get extensions() {
      return Object.keys(this._extensions).join();
    }
    /**
     * @type {Boolean}
     */
    get isPaused() {
      return this._paused;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onclose() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onerror() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onopen() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onmessage() {
      return null;
    }
    /**
     * @type {String}
     */
    get protocol() {
      return this._protocol;
    }
    /**
     * @type {Number}
     */
    get readyState() {
      return this._readyState;
    }
    /**
     * @type {String}
     */
    get url() {
      return this._url;
    }
    /**
     * Set up the socket and the internal resources.
     *
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Object} options Options object
     * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Number} [options.maxPayload=0] The maximum allowed message size
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @private
     */
    setSocket(r, e, o) {
      let t = new Wl({
        allowSynchronousEvents: o.allowSynchronousEvents,
        binaryType: this.binaryType,
        extensions: this._extensions,
        isServer: this._isServer,
        maxPayload: o.maxPayload,
        skipUTF8Validation: o.skipUTF8Validation
      }), n = new Gl(r, this._extensions, o.generateMask);
      this._receiver = t, this._sender = n, this._socket = r, t[re] = this, n[re] = this, r[re] = this, t.on("conclude", nd), t.on("drain", sd), t.on("error", ad), t.on("message", ld), t.on("ping", dd), t.on("pong", cd), n.onerror = ud, r.setTimeout && r.setTimeout(0), r.setNoDelay && r.setNoDelay(), e.length > 0 && r.unshift(e), r.on("close", Es), r.on("data", Ro), r.on("end", Ts), r.on("error", zs), this._readyState = i.OPEN, this.emit("open");
    }
    /**
     * Emit the `'close'` event.
     *
     * @private
     */
    emitClose() {
      if (!this._socket) {
        this._readyState = i.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
        return;
      }
      this._extensions[Le.extensionName] && this._extensions[Le.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = i.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
    }
    /**
     * Start a closing handshake.
     *
     *          +----------+   +-----------+   +----------+
     *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
     *    |     +----------+   +-----------+   +----------+     |
     *          +----------+   +-----------+         |
     * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
     *          +----------+   +-----------+   |
     *    |           |                        |   +---+        |
     *                +------------------------+-->|fin| - - - -
     *    |         +---+                      |   +---+
     *     - - - - -|fin|<---------------------+
     *              +---+
     *
     * @param {Number} [code] Status code explaining why the connection is closing
     * @param {(String|Buffer)} [data] The reason why the connection is
     *     closing
     * @public
     */
    close(r, e) {
      if (this.readyState !== i.CLOSED) {
        if (this.readyState === i.CONNECTING) {
          ue(this, this._req, "WebSocket was closed before the connection was established");
          return;
        }
        if (this.readyState === i.CLOSING) {
          this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
          return;
        }
        this._readyState = i.CLOSING, this._sender.close(r, e, !this._isServer, (o) => {
          o || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end());
        }), Rs(this);
      }
    }
    /**
     * Pause the socket.
     *
     * @public
     */
    pause() {
      this.readyState === i.CONNECTING || this.readyState === i.CLOSED || (this._paused = !0, this._socket.pause());
    }
    /**
     * Send a ping.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the ping is sent
     * @public
     */
    ping(r, e, o) {
      if (this.readyState === i.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof r == "function" ? (o = r, r = e = void 0) : typeof e == "function" && (o = e, e = void 0), typeof r == "number" && (r = r.toString()), this.readyState !== i.OPEN) {
        Si(this, r, o);
        return;
      }
      e === void 0 && (e = !this._isServer), this._sender.ping(r || yo, e, o);
    }
    /**
     * Send a pong.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the pong is sent
     * @public
     */
    pong(r, e, o) {
      if (this.readyState === i.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof r == "function" ? (o = r, r = e = void 0) : typeof e == "function" && (o = e, e = void 0), typeof r == "number" && (r = r.toString()), this.readyState !== i.OPEN) {
        Si(this, r, o);
        return;
      }
      e === void 0 && (e = !this._isServer), this._sender.pong(r || yo, e, o);
    }
    /**
     * Resume the socket.
     *
     * @public
     */
    resume() {
      this.readyState === i.CONNECTING || this.readyState === i.CLOSED || (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume());
    }
    /**
     * Send a data message.
     *
     * @param {*} data The message to send
     * @param {Object} [options] Options object
     * @param {Boolean} [options.binary] Specifies whether `data` is binary or
     *     text
     * @param {Boolean} [options.compress] Specifies whether or not to compress
     *     `data`
     * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when data is written out
     * @public
     */
    send(r, e, o) {
      if (this.readyState === i.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof e == "function" && (o = e, e = {}), typeof r == "number" && (r = r.toString()), this.readyState !== i.OPEN) {
        Si(this, r, o);
        return;
      }
      let t = {
        binary: typeof r != "string",
        mask: !this._isServer,
        compress: !0,
        fin: !0,
        ...e
      };
      this._extensions[Le.extensionName] || (t.compress = !1), this._sender.send(r || yo, t, o);
    }
    /**
     * Forcibly close the connection.
     *
     * @public
     */
    terminate() {
      if (this.readyState !== i.CLOSED) {
        if (this.readyState === i.CONNECTING) {
          ue(this, this._req, "WebSocket was closed before the connection was established");
          return;
        }
        this._socket && (this._readyState = i.CLOSING, this._socket.destroy());
      }
    }
  };
  Object.defineProperty(Y, "CONNECTING", {
    enumerable: !0,
    value: Se.indexOf("CONNECTING")
  });
  Object.defineProperty(Y.prototype, "CONNECTING", {
    enumerable: !0,
    value: Se.indexOf("CONNECTING")
  });
  Object.defineProperty(Y, "OPEN", {
    enumerable: !0,
    value: Se.indexOf("OPEN")
  });
  Object.defineProperty(Y.prototype, "OPEN", {
    enumerable: !0,
    value: Se.indexOf("OPEN")
  });
  Object.defineProperty(Y, "CLOSING", {
    enumerable: !0,
    value: Se.indexOf("CLOSING")
  });
  Object.defineProperty(Y.prototype, "CLOSING", {
    enumerable: !0,
    value: Se.indexOf("CLOSING")
  });
  Object.defineProperty(Y, "CLOSED", {
    enumerable: !0,
    value: Se.indexOf("CLOSED")
  });
  Object.defineProperty(Y.prototype, "CLOSED", {
    enumerable: !0,
    value: Se.indexOf("CLOSED")
  });
  [
    "binaryType",
    "bufferedAmount",
    "extensions",
    "isPaused",
    "protocol",
    "readyState",
    "url"
  ].forEach((i) => {
    Object.defineProperty(Y.prototype, i, { enumerable: !0 });
  });
  ["open", "error", "close", "message"].forEach((i) => {
    Object.defineProperty(Y.prototype, `on${i}`, {
      enumerable: !0,
      get() {
        for (let r of this.listeners(i))
          if (r[Ti]) return r[Jl];
        return null;
      },
      set(r) {
        for (let e of this.listeners(i))
          if (e[Ti]) {
            this.removeListener(i, e);
            break;
          }
        typeof r == "function" && this.addEventListener(i, r, {
          [Ti]: !0
        });
      }
    });
  });
  Y.prototype.addEventListener = Ql;
  Y.prototype.removeEventListener = Zl;
  Ss.exports = Y;
  function ys(i, r, e, o) {
    let t = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      closeTimeout: Ol,
      protocolVersion: zi[1],
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...o,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    if (i._autoPong = t.autoPong, i._closeTimeout = t.closeTimeout, !zi.includes(t.protocolVersion))
      throw new RangeError(
        `Unsupported protocol version: ${t.protocolVersion} (supported versions: ${zi.join(", ")})`
      );
    let n;
    if (r instanceof Ei)
      n = r;
    else
      try {
        n = new Ei(r);
      } catch {
        throw new SyntaxError(`Invalid URL: ${r}`);
      }
    n.protocol === "http:" ? n.protocol = "ws:" : n.protocol === "https:" && (n.protocol = "wss:"), i._url = n.href;
    let s = n.protocol === "wss:", u = n.protocol === "ws+unix:", m;
    if (n.protocol !== "ws:" && !s && !u ? m = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"` : u && !n.pathname ? m = "The URL's pathname is empty" : n.hash && (m = "The URL contains a fragment identifier"), m) {
      let f = new SyntaxError(m);
      if (i._redirects === 0)
        throw f;
      xo(i, f);
      return;
    }
    let d = s ? 443 : 80, l = Kl(16).toString("base64"), p = s ? Dl.request : Bl.request, g = /* @__PURE__ */ new Set(), w;
    if (t.createConnection = t.createConnection || (s ? id : td), t.defaultPort = t.defaultPort || d, t.port = n.port || d, t.host = n.hostname.startsWith("[") ? n.hostname.slice(1, -1) : n.hostname, t.headers = {
      ...t.headers,
      "Sec-WebSocket-Version": t.protocolVersion,
      "Sec-WebSocket-Key": l,
      Connection: "Upgrade",
      Upgrade: "websocket"
    }, t.path = n.pathname + n.search, t.timeout = t.handshakeTimeout, t.perMessageDeflate && (w = new Le(
      t.perMessageDeflate !== !0 ? t.perMessageDeflate : {},
      !1,
      t.maxPayload
    ), t.headers["Sec-WebSocket-Extensions"] = ql({
      [Le.extensionName]: w.offer()
    })), e.length) {
      for (let f of e) {
        if (typeof f != "string" || !od.test(f) || g.has(f))
          throw new SyntaxError(
            "An invalid or duplicated subprotocol was specified"
          );
        g.add(f);
      }
      t.headers["Sec-WebSocket-Protocol"] = e.join(",");
    }
    if (t.origin && (t.protocolVersion < 13 ? t.headers["Sec-WebSocket-Origin"] = t.origin : t.headers.Origin = t.origin), (n.username || n.password) && (t.auth = `${n.username}:${n.password}`), u) {
      let f = t.path.split(":");
      t.socketPath = f[0], t.path = f[1];
    }
    let h;
    if (t.followRedirects) {
      if (i._redirects === 0) {
        i._originalIpc = u, i._originalSecure = s, i._originalHostOrSocketPath = u ? t.socketPath : n.host;
        let f = o && o.headers;
        if (o = { ...o, headers: {} }, f)
          for (let [_, R] of Object.entries(f))
            o.headers[_.toLowerCase()] = R;
      } else if (i.listenerCount("redirect") === 0) {
        let f = u ? i._originalIpc ? t.socketPath === i._originalHostOrSocketPath : !1 : i._originalIpc ? !1 : n.host === i._originalHostOrSocketPath;
        (!f || i._originalSecure && !s) && (delete t.headers.authorization, delete t.headers.cookie, f || delete t.headers.host, t.auth = void 0);
      }
      t.auth && !o.headers.authorization && (o.headers.authorization = "Basic " + Buffer.from(t.auth).toString("base64")), h = i._req = p(t), i._redirects && i.emit("redirect", i.url, h);
    } else
      h = i._req = p(t);
    t.timeout && h.on("timeout", () => {
      ue(i, h, "Opening handshake has timed out");
    }), h.on("error", (f) => {
      h === null || h[bs] || (h = i._req = null, xo(i, f));
    }), h.on("response", (f) => {
      let _ = f.headers.location, R = f.statusCode;
      if (_ && t.followRedirects && R >= 300 && R < 400) {
        if (++i._redirects > t.maxRedirects) {
          ue(i, h, "Maximum redirects exceeded");
          return;
        }
        h.abort();
        let k;
        try {
          k = new Ei(_, r);
        } catch {
          let D = new SyntaxError(`Invalid URL: ${_}`);
          xo(i, D);
          return;
        }
        ys(i, k, e, o);
      } else i.emit("unexpected-response", h, f) || ue(
        i,
        h,
        `Unexpected server response: ${f.statusCode}`
      );
    }), h.on("upgrade", (f, _, R) => {
      if (i.emit("upgrade", f), i.readyState !== Y.CONNECTING) return;
      h = i._req = null;
      let k = f.headers.upgrade;
      if (k === void 0 || k.toLowerCase() !== "websocket") {
        ue(i, _, "Invalid Upgrade header");
        return;
      }
      let E = $l("sha1").update(l + Yl).digest("base64");
      if (f.headers["sec-websocket-accept"] !== E) {
        ue(i, _, "Invalid Sec-WebSocket-Accept header");
        return;
      }
      let D = f.headers["sec-websocket-protocol"], U;
      if (D !== void 0 ? g.size ? g.has(D) || (U = "Server sent an invalid subprotocol") : U = "Server sent a subprotocol but none was requested" : g.size && (U = "Server sent no subprotocol"), U) {
        ue(i, _, U);
        return;
      }
      D && (i._protocol = D);
      let $ = f.headers["sec-websocket-extensions"];
      if ($ !== void 0) {
        if (!w) {
          ue(i, _, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
          return;
        }
        let L;
        try {
          L = ed($);
        } catch {
          ue(i, _, "Invalid Sec-WebSocket-Extensions header");
          return;
        }
        let I = Object.keys(L);
        if (I.length !== 1 || I[0] !== Le.extensionName) {
          ue(i, _, "Server indicated an extension that was not requested");
          return;
        }
        try {
          w.accept(L[Le.extensionName]);
        } catch {
          ue(i, _, "Invalid Sec-WebSocket-Extensions header");
          return;
        }
        i._extensions[Le.extensionName] = w;
      }
      i.setSocket(_, R, {
        allowSynchronousEvents: t.allowSynchronousEvents,
        generateMask: t.generateMask,
        maxPayload: t.maxPayload,
        skipUTF8Validation: t.skipUTF8Validation
      });
    }), t.finishRequest ? t.finishRequest(h, i) : h.end();
  }
  c(ys, "initAsClient");
  function xo(i, r) {
    i._readyState = Y.CLOSING, i._errorEmitted = !0, i.emit("error", r), i.emitClose();
  }
  c(xo, "emitErrorAndClose");
  function td(i) {
    return i.path = i.socketPath, vs.connect(i);
  }
  c(td, "netConnect");
  function id(i) {
    return i.path = void 0, !i.servername && i.servername !== "" && (i.servername = vs.isIP(i.host) ? "" : i.host), Fl.connect(i);
  }
  c(id, "tlsConnect");
  function ue(i, r, e) {
    i._readyState = Y.CLOSING;
    let o = new Error(e);
    Error.captureStackTrace(o, ue), r.setHeader ? (r[bs] = !0, r.abort(), r.socket && !r.socket.destroyed && r.socket.destroy(), process.nextTick(xo, i, o)) : (r.destroy(o), r.once("error", i.emit.bind(i, "error")), r.once("close", i.emitClose.bind(i)));
  }
  c(ue, "abortHandshake");
  function Si(i, r, e) {
    if (r) {
      let o = Hl(r) ? r.size : rd(r).length;
      i._socket ? i._sender._bufferedBytes += o : i._bufferedAmount += o;
    }
    if (e) {
      let o = new Error(
        `WebSocket is not open: readyState ${i.readyState} (${Se[i.readyState]})`
      );
      process.nextTick(e, o);
    }
  }
  c(Si, "sendAfterClose");
  function nd(i, r) {
    let e = this[re];
    e._closeFrameReceived = !0, e._closeMessage = r, e._closeCode = i, e._socket[re] !== void 0 && (e._socket.removeListener("data", Ro), process.nextTick(xs, e._socket), i === 1005 ? e.close() : e.close(i, r));
  }
  c(nd, "receiverOnConclude");
  function sd() {
    let i = this[re];
    i.isPaused || i._socket.resume();
  }
  c(sd, "receiverOnDrain");
  function ad(i) {
    let r = this[re];
    r._socket[re] !== void 0 && (r._socket.removeListener("data", Ro), process.nextTick(xs, r._socket), r.close(i[Xl])), r._errorEmitted || (r._errorEmitted = !0, r.emit("error", i));
  }
  c(ad, "receiverOnError");
  function _s() {
    this[re].emitClose();
  }
  c(_s, "receiverOnFinish");
  function ld(i, r) {
    this[re].emit("message", i, r);
  }
  c(ld, "receiverOnMessage");
  function dd(i) {
    let r = this[re];
    r._autoPong && r.pong(i, !this._isServer, ws), r.emit("ping", i);
  }
  c(dd, "receiverOnPing");
  function cd(i) {
    this[re].emit("pong", i);
  }
  c(cd, "receiverOnPong");
  function xs(i) {
    i.resume();
  }
  c(xs, "resume");
  function ud(i) {
    let r = this[re];
    r.readyState !== Y.CLOSED && (r.readyState === Y.OPEN && (r._readyState = Y.CLOSING, Rs(r)), this._socket.end(), r._errorEmitted || (r._errorEmitted = !0, r.emit("error", i)));
  }
  c(ud, "senderOnError");
  function Rs(i) {
    i._closeTimer = setTimeout(
      i._socket.destroy.bind(i._socket),
      i._closeTimeout
    );
  }
  c(Rs, "setCloseTimer");
  function Es() {
    let i = this[re];
    if (this.removeListener("close", Es), this.removeListener("data", Ro), this.removeListener("end", Ts), i._readyState = Y.CLOSING, !this._readableState.endEmitted && !i._closeFrameReceived && !i._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
      let r = this.read(this._readableState.length);
      i._receiver.write(r);
    }
    i._receiver.end(), this[re] = void 0, clearTimeout(i._closeTimer), i._receiver._writableState.finished || i._receiver._writableState.errorEmitted ? i.emitClose() : (i._receiver.on("error", _s), i._receiver.on("finish", _s));
  }
  c(Es, "socketOnClose");
  function Ro(i) {
    this[re]._receiver.write(i) || this.pause();
  }
  c(Ro, "socketOnData");
  function Ts() {
    let i = this[re];
    i._readyState = Y.CLOSING, i._receiver.end(), this.end();
  }
  c(Ts, "socketOnEnd");
  function zs() {
    let i = this[re];
    this.removeListener("error", zs), this.on("error", ws), i && (i._readyState = Y.CLOSING, this.destroy());
  }
  c(zs, "socketOnError");
});

// node_modules/ws/lib/stream.js
var As = ce((xf, js) => {
  "use strict";
  var yf = Eo(), { Duplex: md } = Z("stream");
  function Ps(i) {
    i.emit("close");
  }
  c(Ps, "emitClose");
  function hd() {
    !this.destroyed && this._writableState.finished && this.destroy();
  }
  c(hd, "duplexOnEnd");
  function Ms(i) {
    this.removeListener("error", Ms), this.destroy(), this.listenerCount("error") === 0 && this.emit("error", i);
  }
  c(Ms, "duplexOnError");
  function pd(i, r) {
    let e = !0, o = new md({
      ...r,
      autoDestroy: !1,
      emitClose: !1,
      objectMode: !1,
      writableObjectMode: !1
    });
    return i.on("message", /* @__PURE__ */ c(function(n, s) {
      let u = !s && o._readableState.objectMode ? n.toString() : n;
      o.push(u) || i.pause();
    }, "message")), i.once("error", /* @__PURE__ */ c(function(n) {
      o.destroyed || (e = !1, o.destroy(n));
    }, "error")), i.once("close", /* @__PURE__ */ c(function() {
      o.destroyed || o.push(null);
    }, "close")), o._destroy = function(t, n) {
      if (i.readyState === i.CLOSED) {
        n(t), process.nextTick(Ps, o);
        return;
      }
      let s = !1;
      i.once("error", /* @__PURE__ */ c(function(m) {
        s = !0, n(m);
      }, "error")), i.once("close", /* @__PURE__ */ c(function() {
        s || n(t), process.nextTick(Ps, o);
      }, "close")), e && i.terminate();
    }, o._final = function(t) {
      if (i.readyState === i.CONNECTING) {
        i.once("open", /* @__PURE__ */ c(function() {
          o._final(t);
        }, "open"));
        return;
      }
      i._socket !== null && (i._socket._writableState.finished ? (t(), o._readableState.endEmitted && o.destroy()) : (i._socket.once("finish", /* @__PURE__ */ c(function() {
        t();
      }, "finish")), i.close()));
    }, o._read = function() {
      i.isPaused && i.resume();
    }, o._write = function(t, n, s) {
      if (i.readyState === i.CONNECTING) {
        i.once("open", /* @__PURE__ */ c(function() {
          o._write(t, n, s);
        }, "open"));
        return;
      }
      i.send(t, s);
    }, o.on("end", hd), o.on("error", Ms), o;
  }
  c(pd, "createWebSocketStream");
  js.exports = pd;
});

// node_modules/ws/lib/subprotocol.js
var Us = ce((Ef, ks) => {
  "use strict";
  var { tokenChars: fd } = _r();
  function gd(i) {
    let r = /* @__PURE__ */ new Set(), e = -1, o = -1, t = 0;
    for (t; t < i.length; t++) {
      let s = i.charCodeAt(t);
      if (o === -1 && fd[s] === 1)
        e === -1 && (e = t);
      else if (t !== 0 && (s === 32 || s === 9))
        o === -1 && e !== -1 && (o = t);
      else if (s === 44) {
        if (e === -1)
          throw new SyntaxError(`Unexpected character at index ${t}`);
        o === -1 && (o = t);
        let u = i.slice(e, o);
        if (r.has(u))
          throw new SyntaxError(`The "${u}" subprotocol is duplicated`);
        r.add(u), e = o = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${t}`);
    }
    if (e === -1 || o !== -1)
      throw new SyntaxError("Unexpected end of input");
    let n = i.slice(e, t);
    if (r.has(n))
      throw new SyntaxError(`The "${n}" subprotocol is duplicated`);
    return r.add(n), r;
  }
  c(gd, "parse");
  ks.exports = { parse: gd };
});

// node_modules/ws/lib/websocket-server.js
var Bs = ce((Sf, Ds) => {
  "use strict";
  var _d = Z("events"), To = Z("http"), { Duplex: zf } = Z("stream"), { createHash: vd } = Z("crypto"), Is = Ri(), nr = Yr(), wd = Us(), bd = Eo(), { CLOSE_TIMEOUT: yd, GUID: xd, kWebSocket: Rd } = Ee(), Ed = /^[+/0-9A-Za-z]{22}==$/, Cs = 0, Ls = 1, Vs = 2, Pi = class extends _d {
    static {
      c(this, "WebSocketServer");
    }
    /**
     * Create a `WebSocketServer` instance.
     *
     * @param {Object} options Configuration options
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Boolean} [options.autoPong=true] Specifies whether or not to
     *     automatically send a pong in response to a ping
     * @param {Number} [options.backlog=511] The maximum length of the queue of
     *     pending connections
     * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
     *     track clients
     * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
     *     wait for the closing handshake to finish after `websocket.close()` is
     *     called
     * @param {Function} [options.handleProtocols] A hook to handle protocols
     * @param {String} [options.host] The hostname where to bind the server
     * @param {Number} [options.maxPayload=104857600] The maximum allowed message
     *     size
     * @param {Boolean} [options.noServer=false] Enable no server mode
     * @param {String} [options.path] Accept only connections matching this path
     * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
     *     permessage-deflate
     * @param {Number} [options.port] The port where to bind the server
     * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
     *     server to use
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @param {Function} [options.verifyClient] A hook to reject connections
     * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
     *     class to use. It must be the `WebSocket` class or class that extends it
     * @param {Function} [callback] A listener for the `listening` event
     */
    constructor(r, e) {
      if (super(), r = {
        allowSynchronousEvents: !0,
        autoPong: !0,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: !1,
        perMessageDeflate: !1,
        handleProtocols: null,
        clientTracking: !0,
        closeTimeout: yd,
        verifyClient: null,
        noServer: !1,
        backlog: null,
        // use default (511 as implemented in net.js)
        server: null,
        host: null,
        path: null,
        port: null,
        WebSocket: bd,
        ...r
      }, r.port == null && !r.server && !r.noServer || r.port != null && (r.server || r.noServer) || r.server && r.noServer)
        throw new TypeError(
          'One and only one of the "port", "server", or "noServer" options must be specified'
        );
      if (r.port != null ? (this._server = To.createServer((o, t) => {
        let n = To.STATUS_CODES[426];
        t.writeHead(426, {
          "Content-Length": n.length,
          "Content-Type": "text/plain"
        }), t.end(n);
      }), this._server.listen(
        r.port,
        r.host,
        r.backlog,
        e
      )) : r.server && (this._server = r.server), this._server) {
        let o = this.emit.bind(this, "connection");
        this._removeListeners = Td(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: /* @__PURE__ */ c((t, n, s) => {
            this.handleUpgrade(t, n, s, o);
          }, "upgrade")
        });
      }
      r.perMessageDeflate === !0 && (r.perMessageDeflate = {}), r.clientTracking && (this.clients = /* @__PURE__ */ new Set(), this._shouldEmitClose = !1), this.options = r, this._state = Cs;
    }
    /**
     * Returns the bound address, the address family name, and port of the server
     * as reported by the operating system if listening on an IP socket.
     * If the server is listening on a pipe or UNIX domain socket, the name is
     * returned as a string.
     *
     * @return {(Object|String|null)} The address of the server
     * @public
     */
    address() {
      if (this.options.noServer)
        throw new Error('The server is operating in "noServer" mode');
      return this._server ? this._server.address() : null;
    }
    /**
     * Stop the server from accepting new connections and emit the `'close'` event
     * when all existing connections are closed.
     *
     * @param {Function} [cb] A one-time listener for the `'close'` event
     * @public
     */
    close(r) {
      if (this._state === Vs) {
        r && this.once("close", () => {
          r(new Error("The server is not running"));
        }), process.nextTick(Zr, this);
        return;
      }
      if (r && this.once("close", r), this._state !== Ls)
        if (this._state = Ls, this.options.noServer || this.options.server)
          this._server && (this._removeListeners(), this._removeListeners = this._server = null), this.clients ? this.clients.size ? this._shouldEmitClose = !0 : process.nextTick(Zr, this) : process.nextTick(Zr, this);
        else {
          let e = this._server;
          this._removeListeners(), this._removeListeners = this._server = null, e.close(() => {
            Zr(this);
          });
        }
    }
    /**
     * See if a given request should be handled by this server instance.
     *
     * @param {http.IncomingMessage} req Request object to inspect
     * @return {Boolean} `true` if the request is valid, else `false`
     * @public
     */
    shouldHandle(r) {
      if (this.options.path) {
        let e = r.url.indexOf("?");
        if ((e !== -1 ? r.url.slice(0, e) : r.url) !== this.options.path) return !1;
      }
      return !0;
    }
    /**
     * Handle a HTTP Upgrade request.
     *
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @public
     */
    handleUpgrade(r, e, o, t) {
      e.on("error", Ns);
      let n = r.headers["sec-websocket-key"], s = r.headers.upgrade, u = +r.headers["sec-websocket-version"];
      if (r.method !== "GET") {
        sr(this, r, e, 405, "Invalid HTTP method");
        return;
      }
      if (s === void 0 || s.toLowerCase() !== "websocket") {
        sr(this, r, e, 400, "Invalid Upgrade header");
        return;
      }
      if (n === void 0 || !Ed.test(n)) {
        sr(this, r, e, 400, "Missing or invalid Sec-WebSocket-Key header");
        return;
      }
      if (u !== 13 && u !== 8) {
        sr(this, r, e, 400, "Missing or invalid Sec-WebSocket-Version header", {
          "Sec-WebSocket-Version": "13, 8"
        });
        return;
      }
      if (!this.shouldHandle(r)) {
        qr(e, 400);
        return;
      }
      let m = r.headers["sec-websocket-protocol"], d = /* @__PURE__ */ new Set();
      if (m !== void 0)
        try {
          d = wd.parse(m);
        } catch {
          sr(this, r, e, 400, "Invalid Sec-WebSocket-Protocol header");
          return;
        }
      let l = r.headers["sec-websocket-extensions"], p = {};
      if (this.options.perMessageDeflate && l !== void 0) {
        let g = new nr(
          this.options.perMessageDeflate,
          !0,
          this.options.maxPayload
        );
        try {
          let w = Is.parse(l);
          w[nr.extensionName] && (g.accept(w[nr.extensionName]), p[nr.extensionName] = g);
        } catch {
          sr(this, r, e, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
          return;
        }
      }
      if (this.options.verifyClient) {
        let g = {
          origin: r.headers[`${u === 8 ? "sec-websocket-origin" : "origin"}`],
          secure: !!(r.socket.authorized || r.socket.encrypted),
          req: r
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(g, (w, h, f, _) => {
            if (!w)
              return qr(e, h || 401, f, _);
            this.completeUpgrade(
              p,
              n,
              d,
              r,
              e,
              o,
              t
            );
          });
          return;
        }
        if (!this.options.verifyClient(g)) return qr(e, 401);
      }
      this.completeUpgrade(p, n, d, r, e, o, t);
    }
    /**
     * Upgrade the connection to WebSocket.
     *
     * @param {Object} extensions The accepted extensions
     * @param {String} key The value of the `Sec-WebSocket-Key` header
     * @param {Set} protocols The subprotocols
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @throws {Error} If called more than once with the same socket
     * @private
     */
    completeUpgrade(r, e, o, t, n, s, u) {
      if (!n.readable || !n.writable) return n.destroy();
      if (n[Rd])
        throw new Error(
          "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
        );
      if (this._state > Cs) return qr(n, 503);
      let d = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${vd("sha1").update(e + xd).digest("base64")}`
      ], l = new this.options.WebSocket(null, void 0, this.options);
      if (o.size) {
        let p = this.options.handleProtocols ? this.options.handleProtocols(o, t) : o.values().next().value;
        p && (d.push(`Sec-WebSocket-Protocol: ${p}`), l._protocol = p);
      }
      if (r[nr.extensionName]) {
        let p = r[nr.extensionName].params, g = Is.format({
          [nr.extensionName]: [p]
        });
        d.push(`Sec-WebSocket-Extensions: ${g}`), l._extensions = r;
      }
      this.emit("headers", d, t), n.write(d.concat(`\r
`).join(`\r
`)), n.removeListener("error", Ns), l.setSocket(n, s, {
        allowSynchronousEvents: this.options.allowSynchronousEvents,
        maxPayload: this.options.maxPayload,
        skipUTF8Validation: this.options.skipUTF8Validation
      }), this.clients && (this.clients.add(l), l.on("close", () => {
        this.clients.delete(l), this._shouldEmitClose && !this.clients.size && process.nextTick(Zr, this);
      })), u(l, t);
    }
  };
  Ds.exports = Pi;
  function Td(i, r) {
    for (let e of Object.keys(r)) i.on(e, r[e]);
    return /* @__PURE__ */ c(function() {
      for (let o of Object.keys(r))
        i.removeListener(o, r[o]);
    }, "removeListeners");
  }
  c(Td, "addListeners");
  function Zr(i) {
    i._state = Vs, i.emit("close");
  }
  c(Zr, "emitClose");
  function Ns() {
    this.destroy();
  }
  c(Ns, "socketOnError");
  function qr(i, r, e, o) {
    e = e || To.STATUS_CODES[r], o = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(e),
      ...o
    }, i.once("finish", i.destroy), i.end(
      `HTTP/1.1 ${r} ${To.STATUS_CODES[r]}\r
` + Object.keys(o).map((t) => `${t}: ${o[t]}`).join(`\r
`) + `\r
\r
` + e
    );
  }
  c(qr, "abortHandshake");
  function sr(i, r, e, o, t, n) {
    if (i.listenerCount("wsClientError")) {
      let s = new Error(t);
      Error.captureStackTrace(s, sr), i.emit("wsClientError", s, e, r);
    } else
      qr(e, o, t, n);
  }
  c(sr, "abortHandshakeOrEmitwsClientError");
});

// node_modules/agentmail/dist/esm/core/auth/NoOpAuthProvider.mjs
var Fr = class {
  static {
    c(this, "NoOpAuthProvider");
  }
  getAuthRequest() {
    return Promise.resolve({ headers: {} });
  }
};

// node_modules/agentmail/dist/esm/core/fetcher/EndpointSupplier.mjs
var Ca = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, $i = {
  get: /* @__PURE__ */ c((i, r) => Ca(void 0, void 0, void 0, function* () {
    return typeof i == "function" ? i(r) : i;
  }), "get")
};

// node_modules/agentmail/dist/esm/core/json.mjs
var W = /* @__PURE__ */ c((i, r, e) => JSON.stringify(i, r, e), "toJson");
function qe(i, r) {
  return JSON.parse(i, r);
}
c(qe, "fromJson");

// node_modules/agentmail/dist/esm/core/logging/logger.mjs
var fe = {
  Debug: "debug",
  Info: "info",
  Warn: "warn",
  Error: "error"
}, Wi = {
  [fe.Debug]: 1,
  [fe.Info]: 2,
  [fe.Warn]: 3,
  [fe.Error]: 4
}, Kr = class {
  static {
    c(this, "ConsoleLogger");
  }
  debug(r, ...e) {
    console.debug(r, ...e);
  }
  info(r, ...e) {
    console.info(r, ...e);
  }
  warn(r, ...e) {
    console.warn(r, ...e);
  }
  error(r, ...e) {
    console.error(r, ...e);
  }
}, cr = class {
  static {
    c(this, "Logger");
  }
  /**
   * Creates a new logger instance.
   * @param config - Logger configuration
   */
  constructor(r) {
    this.level = Wi[r.level], this.logger = r.logger, this.silent = r.silent;
  }
  /**
   * Checks if a log level should be output based on configuration.
   * @param level - The log level to check
   * @returns True if the level should be logged
   */
  shouldLog(r) {
    return !this.silent && this.level <= Wi[r];
  }
  /**
   * Checks if debug logging is enabled.
   * @returns True if debug logs should be output
   */
  isDebug() {
    return this.shouldLog(fe.Debug);
  }
  /**
   * Logs a debug message if debug logging is enabled.
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  debug(r, ...e) {
    this.isDebug() && this.logger.debug(r, ...e);
  }
  /**
   * Checks if info logging is enabled.
   * @returns True if info logs should be output
   */
  isInfo() {
    return this.shouldLog(fe.Info);
  }
  /**
   * Logs an info message if info logging is enabled.
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  info(r, ...e) {
    this.isInfo() && this.logger.info(r, ...e);
  }
  /**
   * Checks if warning logging is enabled.
   * @returns True if warning logs should be output
   */
  isWarn() {
    return this.shouldLog(fe.Warn);
  }
  /**
   * Logs a warning message if warning logging is enabled.
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  warn(r, ...e) {
    this.isWarn() && this.logger.warn(r, ...e);
  }
  /**
   * Checks if error logging is enabled.
   * @returns True if error logs should be output
   */
  isError() {
    return this.shouldLog(fe.Error);
  }
  /**
   * Logs an error message if error logging is enabled.
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  error(r, ...e) {
    this.isError() && this.logger.error(r, ...e);
  }
};
function Xt(i) {
  var r, e, o;
  return i == null ? La : i instanceof cr ? i : (i = i ?? {}, (r = i.level) !== null && r !== void 0 || (i.level = fe.Info), (e = i.logger) !== null && e !== void 0 || (i.logger = new Kr()), (o = i.silent) !== null && o !== void 0 || (i.silent = !0), new cr(i));
}
c(Xt, "createLogger");
var La = new cr({
  level: fe.Info,
  logger: new Kr(),
  silent: !0
});

// node_modules/agentmail/dist/esm/core/url/qs.mjs
var Na = {
  arrayFormat: "indices",
  encode: !0
};
function Gi(i, r) {
  if (i === void 0 || i === null)
    return "";
  let e = String(i);
  return r ? encodeURIComponent(e) : e;
}
c(Gi, "encodeValue");
function Qt(i, r = "", e) {
  let o = [];
  for (let [t, n] of Object.entries(i)) {
    let s = r ? `${r}[${t}]` : t;
    if (n !== void 0)
      if (Array.isArray(n)) {
        if (n.length === 0)
          continue;
        for (let u = 0; u < n.length; u++) {
          let m = n[u];
          if (m !== void 0)
            if (typeof m == "object" && !Array.isArray(m) && m !== null) {
              let d = e.arrayFormat === "indices" ? `${s}[${u}]` : s;
              o.push(...Qt(m, d, e));
            } else {
              let d = e.arrayFormat === "indices" ? `${s}[${u}]` : s, l = e.encode ? encodeURIComponent(d) : d;
              o.push(`${l}=${Gi(m, e.encode)}`);
            }
        }
      } else if (typeof n == "object" && n !== null) {
        if (Object.keys(n).length === 0)
          continue;
        o.push(...Qt(n, s, e));
      } else {
        let u = e.encode ? encodeURIComponent(s) : s;
        o.push(`${u}=${Gi(n, e.encode)}`);
      }
  }
  return o;
}
c(Qt, "stringifyObject");
function Ae(i, r) {
  return i == null || typeof i != "object" ? "" : Qt(i, "", Object.assign(Object.assign({}, Na), r)).join("&");
}
c(Ae, "toQueryString");

// node_modules/agentmail/dist/esm/core/fetcher/createRequestUrl.mjs
function Hi(i, r) {
  let e = Ae(r, { arrayFormat: "repeat" });
  return e ? `${i}?${e}` : i;
}
c(Hi, "createRequestUrl");

// node_modules/agentmail/dist/esm/core/fetcher/BinaryResponse.mjs
function Oi(i) {
  let r = {
    get bodyUsed() {
      return i.bodyUsed;
    },
    stream: /* @__PURE__ */ c(() => i.body, "stream"),
    arrayBuffer: i.arrayBuffer.bind(i),
    blob: i.blob.bind(i)
  };
  return "bytes" in i && typeof i.bytes == "function" && (r.bytes = i.bytes.bind(i)), r;
}
c(Oi, "getBinaryResponse");

// node_modules/agentmail/dist/esm/core/fetcher/ResponseWithBody.mjs
function Yi(i) {
  return i.body != null;
}
c(Yi, "isResponseWithBody");

// node_modules/agentmail/dist/esm/core/fetcher/getResponseBody.mjs
var Va = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
};
function so(i, r) {
  return Va(this, void 0, void 0, function* () {
    if (!Yi(i))
      return;
    switch (r) {
      case "binary-response":
        return Oi(i);
      case "blob":
        return yield i.blob();
      case "arrayBuffer":
        return yield i.arrayBuffer();
      case "sse":
        return i.body;
      case "streaming":
        return i.body;
      case "text":
        return yield i.text();
    }
    let e = yield i.text();
    if (e.length > 0)
      try {
        return qe(e);
      } catch {
        return {
          ok: !1,
          error: {
            reason: "non-json",
            statusCode: i.status,
            rawBody: e
          }
        };
      }
  });
}
c(so, "getResponseBody");

// node_modules/agentmail/dist/esm/core/fetcher/getErrorResponseBody.mjs
var Da = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
};
function Ji(i) {
  return Da(this, void 0, void 0, function* () {
    var r, e, o;
    let t = (r = i.headers.get("Content-Type")) === null || r === void 0 ? void 0 : r.toLowerCase();
    if (t == null || t.length === 0)
      return so(i);
    switch (t.indexOf(";") !== -1 && (t = (o = (e = t.split(";")[0]) === null || e === void 0 ? void 0 : e.trim()) !== null && o !== void 0 ? o : ""), t) {
      case "application/hal+json":
      case "application/json":
      case "application/ld+json":
      case "application/problem+json":
      case "application/vnd.api+json":
      case "text/json": {
        let n = yield i.text();
        return n.length > 0 ? qe(n) : void 0;
      }
      default:
        if (t.startsWith("application/vnd.") && t.endsWith("+json")) {
          let n = yield i.text();
          return n.length > 0 ? qe(n) : void 0;
        }
        return yield i.text();
    }
  });
}
c(Ji, "getErrorResponseBody");

// node_modules/agentmail/dist/esm/core/fetcher/getFetchFn.mjs
var Ba = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
};
function Xi() {
  return Ba(this, void 0, void 0, function* () {
    return fetch;
  });
}
c(Xi, "getFetchFn");

// node_modules/agentmail/dist/esm/core/fetcher/getRequestBody.mjs
var Fa = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
};
function Qi(i) {
  return Fa(this, arguments, void 0, function* ({ body: r, type: e }) {
    return e === "form" ? Ae(r, { arrayFormat: "repeat", encode: !0 }) : e.includes("json") ? W(r) : r;
  });
}
c(Qi, "getRequestBody");

// node_modules/agentmail/dist/esm/core/fetcher/Headers.mjs
var ke;
typeof globalThis.Headers < "u" ? ke = globalThis.Headers : ke = class Zi {
  static {
    c(this, "Headers");
  }
  constructor(r) {
    if (this.headers = /* @__PURE__ */ new Map(), r)
      if (r instanceof Zi)
        r.forEach((e, o) => this.append(o, e));
      else if (Array.isArray(r))
        for (let [e, o] of r)
          if (typeof e == "string" && typeof o == "string")
            this.append(e, o);
          else
            throw new TypeError("Each header entry must be a [string, string] tuple");
      else
        for (let [e, o] of Object.entries(r))
          if (typeof o == "string")
            this.append(e, o);
          else
            throw new TypeError("Header values must be strings");
  }
  append(r, e) {
    let o = r.toLowerCase(), t = this.headers.get(o) || [];
    this.headers.set(o, [...t, e]);
  }
  delete(r) {
    let e = r.toLowerCase();
    this.headers.delete(e);
  }
  get(r) {
    let e = r.toLowerCase(), o = this.headers.get(e);
    return o ? o.join(", ") : null;
  }
  has(r) {
    let e = r.toLowerCase();
    return this.headers.has(e);
  }
  set(r, e) {
    let o = r.toLowerCase();
    this.headers.set(o, [e]);
  }
  forEach(r, e) {
    let o = e ? r.bind(e) : r;
    this.headers.forEach((t, n) => o(t.join(", "), n, this));
  }
  getSetCookie() {
    return this.headers.get("set-cookie") || [];
  }
  *entries() {
    for (let [r, e] of this.headers.entries())
      yield [r, e.join(", ")];
  }
  *keys() {
    yield* this.headers.keys();
  }
  *values() {
    for (let r of this.headers.values())
      yield r.join(", ");
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};

// node_modules/agentmail/dist/esm/core/fetcher/signals.mjs
var Ka = "timeout";
function qi(i) {
  let r = new AbortController(), e = setTimeout(() => r.abort(Ka), i);
  return { signal: r.signal, abortId: e };
}
c(qi, "getTimeoutSignal");
function en(...i) {
  let r = i.length === 1 && Array.isArray(i[0]) ? i[0] : i, e = new AbortController();
  for (let o of r) {
    if (o.aborted) {
      e.abort(o?.reason);
      break;
    }
    o.addEventListener("abort", () => e.abort(o?.reason), {
      signal: e.signal
    });
  }
  return e.signal;
}
c(en, "anySignal");

// node_modules/agentmail/dist/esm/core/fetcher/makeRequest.mjs
var $a = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, rn = /* @__PURE__ */ c((i, r, e, o, t, n, s, u, m) => $a(void 0, void 0, void 0, function* () {
  let d = [], l;
  if (n != null) {
    let { signal: w, abortId: h } = qi(n);
    l = h, d.push(w);
  }
  s != null && d.push(s);
  let p = en(d), g = yield i(r, {
    method: e,
    headers: o,
    body: t,
    signal: p,
    credentials: u ? "include" : void 0,
    // @ts-ignore
    duplex: m
  });
  return l != null && clearTimeout(l), g;
}), "makeRequest");

// node_modules/agentmail/dist/esm/core/fetcher/RawResponse.mjs
var Zt = {
  headers: new ke(),
  redirected: !1,
  status: 499,
  statusText: "Client Closed Request",
  type: "error",
  url: ""
}, qt = {
  headers: new ke(),
  redirected: !1,
  status: 0,
  statusText: "Unknown Error",
  type: "error",
  url: ""
};
function ei(i) {
  return {
    headers: i.headers,
    redirected: i.redirected,
    status: i.status,
    statusText: i.statusText,
    type: i.type,
    url: i.url
  };
}
c(ei, "toRawResponse");

// node_modules/agentmail/dist/esm/core/fetcher/requestWithRetries.mjs
var Wa = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
};
function Ga(i) {
  let r = 1 + Math.random() * 0.2;
  return i * r;
}
c(Ga, "addPositiveJitter");
function Ha(i) {
  let r = 1 + (Math.random() - 0.5) * 0.2;
  return i * r;
}
c(Ha, "addSymmetricJitter");
function Oa(i, r) {
  let e = i.headers.get("Retry-After");
  if (e) {
    let t = parseInt(e, 10);
    if (!Number.isNaN(t) && t > 0)
      return Math.min(t * 1e3, 6e4);
    let n = new Date(e);
    if (!Number.isNaN(n.getTime())) {
      let s = n.getTime() - Date.now();
      if (s > 0)
        return Math.min(Math.max(s, 0), 6e4);
    }
  }
  let o = i.headers.get("X-RateLimit-Reset");
  if (o) {
    let t = parseInt(o, 10);
    if (!Number.isNaN(t)) {
      let n = t * 1e3 - Date.now();
      if (n > 0)
        return Ga(Math.min(n, 6e4));
    }
  }
  return Ha(Math.min(1e3 * Math.pow(2, r), 6e4));
}
c(Oa, "getRetryDelayFromHeaders");
function on(i) {
  return Wa(this, arguments, void 0, function* (r, e = 2) {
    let o = yield r();
    for (let t = 0; t < e && ([408, 429].includes(o.status) || o.status >= 500); ++t) {
      let n = Oa(o, t);
      yield new Promise((s) => setTimeout(s, n)), o = yield r();
    }
    return o;
  });
}
c(on, "requestWithRetries");

// node_modules/agentmail/dist/esm/core/fetcher/Fetcher.mjs
var oi = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ya = /* @__PURE__ */ new Set([
  "authorization",
  "www-authenticate",
  "x-api-key",
  "api-key",
  "apikey",
  "x-api-token",
  "x-auth-token",
  "auth-token",
  "cookie",
  "set-cookie",
  "proxy-authorization",
  "proxy-authenticate",
  "x-csrf-token",
  "x-xsrf-token",
  "x-session-token",
  "x-access-token"
]);
function ri(i) {
  let r = {};
  for (let [e, o] of i instanceof ke ? i.entries() : Object.entries(i))
    Ya.has(e.toLowerCase()) ? r[e] = "[REDACTED]" : r[e] = o;
  return r;
}
c(ri, "redactHeaders");
var ti = /* @__PURE__ */ new Set([
  "api_key",
  "api-key",
  "apikey",
  "token",
  "access_token",
  "access-token",
  "auth_token",
  "auth-token",
  "password",
  "passwd",
  "secret",
  "api_secret",
  "api-secret",
  "apisecret",
  "key",
  "session",
  "session_id",
  "session-id"
]);
function Ja(i) {
  if (i == null)
    return i;
  let r = {};
  for (let [e, o] of Object.entries(i))
    ti.has(e.toLowerCase()) ? r[e] = "[REDACTED]" : r[e] = o;
  return r;
}
c(Ja, "redactQueryParameters");
function er(i) {
  let r = i.indexOf("://");
  if (r === -1)
    return i;
  let e = r + 3, o = i.indexOf("/", e), t = i.indexOf("?", e), n = i.indexOf("#", e), s = Math.min(o === -1 ? i.length : o, t === -1 ? i.length : t, n === -1 ? i.length : n), u = -1;
  for (let h = e; h < s; h++)
    i[h] === "@" && (u = h);
  if (u !== -1 && (i = `${i.slice(0, e)}[REDACTED]@${i.slice(u + 1)}`), t = i.indexOf("?"), t === -1)
    return i;
  n = i.indexOf("#", t);
  let m = n !== -1 ? n : i.length, d = i.slice(t + 1, m);
  if (d.length === 0)
    return i;
  let l = d.toLowerCase();
  if (!(l.includes("token") || l.includes("key") || l.includes("password") || l.includes("passwd") || l.includes("secret") || l.includes("session") || l.includes("auth")))
    return i;
  let g = [], w = d.split("&");
  for (let h of w) {
    let f = h.indexOf("=");
    if (f === -1) {
      g.push(h);
      continue;
    }
    let _ = h.slice(0, f), R = ti.has(_.toLowerCase());
    if (!R && _.includes("%"))
      try {
        let k = decodeURIComponent(_);
        R = ti.has(k.toLowerCase());
      } catch {
      }
    g.push(R ? `${_}=[REDACTED]` : h);
  }
  return i.slice(0, t + 1) + g.join("&") + i.slice(m);
}
c(er, "redactUrl");
function Xa(i) {
  return oi(this, void 0, void 0, function* () {
    var r;
    let e = new ke();
    if (e.set("Accept", i.responseType === "json" ? "application/json" : i.responseType === "text" ? "text/plain" : "*/*"), i.body !== void 0 && i.contentType != null && e.set("Content-Type", i.contentType), i.headers == null)
      return e;
    for (let [o, t] of Object.entries(i.headers)) {
      let n = yield $i.get(t, { endpointMetadata: (r = i.endpointMetadata) !== null && r !== void 0 ? r : {} });
      if (typeof n == "string") {
        e.set(o, n);
        continue;
      }
      n != null && e.set(o, `${n}`);
    }
    return e;
  });
}
c(Xa, "getHeaders");
function Qa(i) {
  return oi(this, void 0, void 0, function* () {
    var r, e, o;
    let t = Hi(i.url, i.queryParameters), n = yield Qi({
      body: i.body,
      type: (r = i.requestType) !== null && r !== void 0 ? r : "other"
    }), s = (e = i.fetchFn) !== null && e !== void 0 ? e : yield Xi(), u = yield Xa(i), m = Xt(i.logging);
    if (m.isDebug()) {
      let d = {
        method: i.method,
        url: er(t),
        headers: ri(u),
        queryParameters: Ja(i.queryParameters),
        hasBody: n != null
      };
      m.debug("Making HTTP request", d);
    }
    try {
      let d = yield on(() => oi(this, void 0, void 0, function* () {
        return rn(s, t, i.method, u, n, i.timeoutMs, i.abortSignal, i.withCredentials, i.duplex);
      }), i.maxRetries);
      if (d.status >= 200 && d.status < 400) {
        if (m.isDebug()) {
          let l = {
            method: i.method,
            url: er(t),
            statusCode: d.status,
            responseHeaders: ri(d.headers)
          };
          m.debug("HTTP request succeeded", l);
        }
        return {
          ok: !0,
          body: yield so(d, i.responseType),
          headers: d.headers,
          rawResponse: ei(d)
        };
      } else {
        if (m.isError()) {
          let l = {
            method: i.method,
            url: er(t),
            statusCode: d.status,
            responseHeaders: ri(Object.fromEntries(d.headers.entries()))
          };
          m.error("HTTP request failed with error status", l);
        }
        return {
          ok: !1,
          error: {
            reason: "status-code",
            statusCode: d.status,
            body: yield Ji(d)
          },
          rawResponse: ei(d)
        };
      }
    } catch (d) {
      if (!((o = i.abortSignal) === null || o === void 0) && o.aborted) {
        if (m.isError()) {
          let l = {
            method: i.method,
            url: er(t)
          };
          m.error("HTTP request was aborted", l);
        }
        return {
          ok: !1,
          error: {
            reason: "unknown",
            errorMessage: "The user aborted a request"
          },
          rawResponse: Zt
        };
      } else if (d instanceof Error && d.name === "AbortError") {
        if (m.isError()) {
          let l = {
            method: i.method,
            url: er(t),
            timeoutMs: i.timeoutMs
          };
          m.error("HTTP request timed out", l);
        }
        return {
          ok: !1,
          error: {
            reason: "timeout"
          },
          rawResponse: Zt
        };
      } else if (d instanceof Error) {
        if (m.isError()) {
          let l = {
            method: i.method,
            url: er(t),
            errorMessage: d.message
          };
          m.error("HTTP request failed with error", l);
        }
        return {
          ok: !1,
          error: {
            reason: "unknown",
            errorMessage: d.message
          },
          rawResponse: qt
        };
      }
      if (m.isError()) {
        let l = {
          method: i.method,
          url: er(t),
          error: W(d)
        };
        m.error("HTTP request failed with unknown error", l);
      }
      return {
        ok: !1,
        error: {
          reason: "unknown",
          errorMessage: W(d)
        },
        rawResponse: qt
      };
    }
  });
}
c(Qa, "fetcherImpl");
var M = Qa;

// node_modules/agentmail/dist/esm/core/fetcher/HttpResponsePromise.mjs
var Za = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, z = class i extends Promise {
  static {
    c(this, "HttpResponsePromise");
  }
  constructor(r) {
    super((e) => {
      e(void 0);
    }), this.innerPromise = r;
  }
  /**
   * Creates an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @param args - Arguments to pass to the function.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromFunction(r, ...e) {
    return new i(r(...e));
  }
  /**
   * Creates a function that returns an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @returns A function that returns an `HttpResponsePromise` instance.
   */
  static interceptFunction(r) {
    return (...e) => i.fromPromise(r(...e));
  }
  /**
   * Creates an `HttpResponsePromise` from an existing promise.
   *
   * @param promise - A promise resolving to a `WithRawResponse` object.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromPromise(r) {
    return new i(r);
  }
  /**
   * Creates an `HttpResponsePromise` from an executor function.
   *
   * @param executor - A function that takes resolve and reject callbacks to create a promise.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromExecutor(r) {
    let e = new Promise(r);
    return new i(e);
  }
  /**
   * Creates an `HttpResponsePromise` from a resolved result.
   *
   * @param result - A `WithRawResponse` object to resolve immediately.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromResult(r) {
    let e = Promise.resolve(r);
    return new i(e);
  }
  unwrap() {
    return this.unwrappedPromise || (this.unwrappedPromise = this.innerPromise.then(({ data: r }) => r)), this.unwrappedPromise;
  }
  /** @inheritdoc */
  then(r, e) {
    return this.unwrap().then(r, e);
  }
  /** @inheritdoc */
  catch(r) {
    return this.unwrap().catch(r);
  }
  /** @inheritdoc */
  finally(r) {
    return this.unwrap().finally(r);
  }
  /**
   * Retrieves the data and raw response.
   *
   * @returns A promise resolving to a `WithRawResponse` object.
   */
  withRawResponse() {
    return Za(this, void 0, void 0, function* () {
      return yield this.innerPromise;
    });
  }
};

// node_modules/agentmail/dist/esm/core/fetcher/Supplier.mjs
var qa = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, x = {
  get: /* @__PURE__ */ c((i) => qa(void 0, void 0, void 0, function* () {
    return typeof i == "function" ? i() : i;
  }), "get")
};

// node_modules/agentmail/dist/esm/core/logging/index.mjs
var ao = {};
je(ao, {
  ConsoleLogger: () => Kr,
  LogLevel: () => fe,
  Logger: () => cr,
  createLogger: () => Xt
});

// node_modules/agentmail/dist/esm/core/runtime/runtime.mjs
var ur = el();
function el() {
  var i, r, e, o, t;
  return typeof window < "u" && typeof window.document < "u" ? {
    type: "browser",
    version: window.navigator.userAgent
  } : typeof globalThis < "u" && ((i = globalThis?.navigator) === null || i === void 0 ? void 0 : i.userAgent) === "Cloudflare-Workers" ? {
    type: "workerd"
  } : typeof EdgeRuntime == "string" ? {
    type: "edge-runtime"
  } : typeof self == "object" && typeof self?.importScripts == "function" && (((r = self.constructor) === null || r === void 0 ? void 0 : r.name) === "DedicatedWorkerGlobalScope" || ((e = self.constructor) === null || e === void 0 ? void 0 : e.name) === "ServiceWorkerGlobalScope" || ((o = self.constructor) === null || o === void 0 ? void 0 : o.name) === "SharedWorkerGlobalScope") ? {
    type: "web-worker"
  } : typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u" ? {
    type: "deno",
    version: Deno.version.deno
  } : typeof Bun < "u" && typeof Bun.version < "u" ? {
    type: "bun",
    version: Bun.version
  } : typeof process < "u" && "version" in process && !!process.version && "versions" in process && !!(!((t = process.versions) === null || t === void 0) && t.node) ? {
    type: "node",
    version: process.versions.node,
    parsedVersion: Number(process.versions.node.split(".")[0])
  } : typeof navigator < "u" && navigator?.product === "ReactNative" ? {
    type: "react-native"
  } : {
    type: "unknown"
  };
}
c(el, "evaluateRuntime");

// node_modules/agentmail/dist/esm/core/schemas/index.mjs
var a = {};
je(a, {
  JsonError: () => mr,
  ParseError: () => hr,
  any: () => vn,
  bigint: () => nn,
  boolean: () => wn,
  booleanLiteral: () => gn,
  date: () => sn,
  discriminant: () => Mn,
  enum_: () => co,
  getObjectLikeUtils: () => ge,
  getObjectUtils: () => rr,
  getSchemaUtils: () => K,
  isProperty: () => Ie,
  lazy: () => an,
  lazyObject: () => pn,
  list: () => mo,
  never: () => bn,
  number: () => yn,
  object: () => uo,
  objectWithoutOptionalProperties: () => hn,
  optional: () => ii,
  property: () => dn,
  record: () => Tn,
  set: () => zn,
  string: () => xn,
  stringLiteral: () => _n,
  transform: () => ni,
  undiscriminatedUnion: () => Pn,
  union: () => An,
  unknown: () => Rn,
  withParsedProperties: () => ai
});

// node_modules/agentmail/dist/esm/core/schemas/Schema.mjs
var C = {
  BIGINT: "bigint",
  DATE: "date",
  ENUM: "enum",
  LIST: "list",
  STRING_LITERAL: "stringLiteral",
  BOOLEAN_LITERAL: "booleanLiteral",
  OBJECT: "object",
  ANY: "any",
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
  UNKNOWN: "unknown",
  NEVER: "never",
  RECORD: "record",
  SET: "set",
  UNION: "union",
  UNDISCRIMINATED_UNION: "undiscriminatedUnion",
  NULLABLE: "nullable",
  OPTIONAL: "optional",
  OPTIONAL_NULLABLE: "optionalNullable"
};

// node_modules/agentmail/dist/esm/core/schemas/utils/getErrorMessageForIncorrectType.mjs
function F(i, r) {
  return `Expected ${r}. Received ${rl(i)}.`;
}
c(F, "getErrorMessageForIncorrectType");
function rl(i) {
  if (Array.isArray(i))
    return "list";
  if (i === null)
    return "null";
  if (i instanceof BigInt)
    return "BigInt";
  switch (typeof i) {
    case "string":
      return `"${i}"`;
    case "bigint":
    case "number":
    case "boolean":
    case "undefined":
      return `${i}`;
  }
  return typeof i;
}
c(rl, "getTypeAsString");

// node_modules/agentmail/dist/esm/core/schemas/utils/maybeSkipValidation.mjs
function q(i) {
  return Object.assign(Object.assign({}, i), { json: tn(i.json), parse: tn(i.parse) });
}
c(q, "maybeSkipValidation");
function tn(i) {
  return (r, e) => {
    let o = i(r, e), { skipValidation: t = !1 } = e ?? {};
    return !o.ok && t ? (console.warn([
      "Failed to validate.",
      ...o.errors.map((n) => "  - " + (n.path.length > 0 ? `${n.path.join(".")}: ${n.message}` : n.message))
    ].join(`
`)), {
      ok: !0,
      value: r
    }) : o;
  };
}
c(tn, "transformAndMaybeSkipValidation");

// node_modules/agentmail/dist/esm/core/schemas/builders/schema-utils/stringifyValidationErrors.mjs
function lo(i) {
  return i.path.length === 0 ? i.message : `${i.path.join(" -> ")}: ${i.message}`;
}
c(lo, "stringifyValidationError");

// node_modules/agentmail/dist/esm/core/schemas/builders/schema-utils/JsonError.mjs
var mr = class i extends Error {
  static {
    c(this, "JsonError");
  }
  constructor(r) {
    super(r.map(lo).join("; ")), this.errors = r, Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/core/schemas/builders/schema-utils/ParseError.mjs
var hr = class i extends Error {
  static {
    c(this, "ParseError");
  }
  constructor(r) {
    super(r.map(lo).join("; ")), this.errors = r, Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/core/schemas/builders/schema-utils/getSchemaUtils.mjs
function K(i) {
  return {
    nullable: /* @__PURE__ */ c(() => ol(i), "nullable"),
    optional: /* @__PURE__ */ c(() => ii(i), "optional"),
    optionalNullable: /* @__PURE__ */ c(() => tl(i), "optionalNullable"),
    transform: /* @__PURE__ */ c((r) => ni(i, r), "transform"),
    parseOrThrow: /* @__PURE__ */ c((r, e) => {
      let o = i.parse(r, e);
      if (o.ok)
        return o.value;
      throw new hr(o.errors);
    }, "parseOrThrow"),
    jsonOrThrow: /* @__PURE__ */ c((r, e) => {
      let o = i.json(r, e);
      if (o.ok)
        return o.value;
      throw new mr(o.errors);
    }, "jsonOrThrow")
  };
}
c(K, "getSchemaUtils");
function ol(i) {
  let r = {
    parse: /* @__PURE__ */ c((e, o) => e == null ? {
      ok: !0,
      value: null
    } : i.parse(e, o), "parse"),
    json: /* @__PURE__ */ c((e, o) => e == null ? {
      ok: !0,
      value: null
    } : i.json(e, o), "json"),
    getType: /* @__PURE__ */ c(() => C.NULLABLE, "getType")
  };
  return Object.assign(Object.assign({}, r), K(r));
}
c(ol, "nullable");
function ii(i) {
  let r = {
    parse: /* @__PURE__ */ c((e, o) => e == null ? {
      ok: !0,
      value: void 0
    } : i.parse(e, o), "parse"),
    json: /* @__PURE__ */ c((e, o) => o?.omitUndefined && e === void 0 ? {
      ok: !0,
      value: void 0
    } : e == null ? {
      ok: !0,
      value: null
    } : i.json(e, o), "json"),
    getType: /* @__PURE__ */ c(() => C.OPTIONAL, "getType")
  };
  return Object.assign(Object.assign({}, r), K(r));
}
c(ii, "optional");
function tl(i) {
  let r = {
    parse: /* @__PURE__ */ c((e, o) => e === void 0 ? {
      ok: !0,
      value: void 0
    } : e === null ? {
      ok: !0,
      value: null
    } : i.parse(e, o), "parse"),
    json: /* @__PURE__ */ c((e, o) => e === void 0 ? {
      ok: !0,
      value: void 0
    } : e === null ? {
      ok: !0,
      value: null
    } : i.json(e, o), "json"),
    getType: /* @__PURE__ */ c(() => C.OPTIONAL_NULLABLE, "getType")
  };
  return Object.assign(Object.assign({}, r), K(r));
}
c(tl, "optionalNullable");
function ni(i, r) {
  let e = {
    parse: /* @__PURE__ */ c((o, t) => {
      let n = i.parse(o, t);
      return n.ok ? {
        ok: !0,
        value: r.transform(n.value)
      } : n;
    }, "parse"),
    json: /* @__PURE__ */ c((o, t) => {
      let n = r.untransform(o);
      return i.json(n, t);
    }, "json"),
    getType: /* @__PURE__ */ c(() => i.getType(), "getType")
  };
  return Object.assign(Object.assign({}, e), K(e));
}
c(ni, "transform");

// node_modules/agentmail/dist/esm/core/schemas/builders/bigint/bigint.mjs
function nn() {
  let i = {
    parse: /* @__PURE__ */ c((r, { breadcrumbsPrefix: e = [] } = {}) => typeof r == "bigint" ? {
      ok: !0,
      value: r
    } : typeof r == "number" ? {
      ok: !0,
      value: BigInt(r)
    } : {
      ok: !1,
      errors: [
        {
          path: e,
          message: F(r, "bigint | number")
        }
      ]
    }, "parse"),
    json: /* @__PURE__ */ c((r, { breadcrumbsPrefix: e = [] } = {}) => typeof r != "bigint" ? {
      ok: !1,
      errors: [
        {
          path: e,
          message: F(r, "bigint")
        }
      ]
    } : {
      ok: !0,
      value: r
    }, "json"),
    getType: /* @__PURE__ */ c(() => C.BIGINT, "getType")
  };
  return Object.assign(Object.assign({}, q(i)), K(i));
}
c(nn, "bigint");

// node_modules/agentmail/dist/esm/core/schemas/builders/date/date.mjs
var il = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
function sn() {
  let i = {
    parse: /* @__PURE__ */ c((r, { breadcrumbsPrefix: e = [] } = {}) => typeof r != "string" ? {
      ok: !1,
      errors: [
        {
          path: e,
          message: F(r, "string")
        }
      ]
    } : il.test(r) ? {
      ok: !0,
      value: new Date(r)
    } : {
      ok: !1,
      errors: [
        {
          path: e,
          message: F(r, "ISO 8601 date string")
        }
      ]
    }, "parse"),
    json: /* @__PURE__ */ c((r, { breadcrumbsPrefix: e = [] } = {}) => r instanceof Date ? {
      ok: !0,
      value: r.toISOString()
    } : {
      ok: !1,
      errors: [
        {
          path: e,
          message: F(r, "Date object")
        }
      ]
    }, "json"),
    getType: /* @__PURE__ */ c(() => C.DATE, "getType")
  };
  return Object.assign(Object.assign({}, q(i)), K(i));
}
c(sn, "date");

// node_modules/agentmail/dist/esm/core/schemas/utils/createIdentitySchemaCreator.mjs
function ee(i, r) {
  return () => {
    let e = {
      parse: r,
      json: r,
      getType: /* @__PURE__ */ c(() => i, "getType")
    };
    return Object.assign(Object.assign({}, q(e)), K(e));
  };
}
c(ee, "createIdentitySchemaCreator");

// node_modules/agentmail/dist/esm/core/schemas/builders/enum/enum.mjs
function co(i) {
  let r = new Set(i);
  return ee(C.ENUM, (o, { allowUnrecognizedEnumValues: t, breadcrumbsPrefix: n = [] } = {}) => typeof o != "string" ? {
    ok: !1,
    errors: [
      {
        path: n,
        message: F(o, "string")
      }
    ]
  } : !r.has(o) && !t ? {
    ok: !1,
    errors: [
      {
        path: n,
        message: F(o, "enum")
      }
    ]
  } : {
    ok: !0,
    value: o
  })();
}
c(co, "enum_");

// node_modules/agentmail/dist/esm/core/schemas/builders/lazy/lazy.mjs
function an(i) {
  let r = si(i);
  return Object.assign(Object.assign({}, r), K(r));
}
c(an, "lazy");
function si(i) {
  return {
    parse: /* @__PURE__ */ c((r, e) => pr(i).parse(r, e), "parse"),
    json: /* @__PURE__ */ c((r, e) => pr(i).json(r, e), "json"),
    getType: /* @__PURE__ */ c(() => pr(i).getType(), "getType")
  };
}
c(si, "constructLazyBaseSchema");
function pr(i) {
  let r = i;
  return r.__zurg_memoized == null && (r.__zurg_memoized = i()), r.__zurg_memoized;
}
c(pr, "getMemoizedSchema");

// node_modules/agentmail/dist/esm/core/schemas/utils/entries.mjs
function $r(i) {
  return Object.entries(i);
}
c($r, "entries");

// node_modules/agentmail/dist/esm/core/schemas/utils/filterObject.mjs
function Wr(i, r) {
  let e = new Set(r);
  return Object.entries(i).reduce((o, [t, n]) => (e.has(t) && (o[t] = n), o), {});
}
c(Wr, "filterObject");

// node_modules/agentmail/dist/esm/core/schemas/utils/isPlainObject.mjs
function Ue(i) {
  if (typeof i != "object" || i === null)
    return !1;
  if (Object.getPrototypeOf(i) === null)
    return !0;
  let r = i;
  for (; Object.getPrototypeOf(r) !== null; )
    r = Object.getPrototypeOf(r);
  return Object.getPrototypeOf(i) === r;
}
c(Ue, "isPlainObject");

// node_modules/agentmail/dist/esm/core/schemas/utils/keys.mjs
function Gr(i) {
  return Object.keys(i);
}
c(Gr, "keys");

// node_modules/agentmail/dist/esm/core/schemas/utils/partition.mjs
function ln(i, r) {
  let e = [], o = [];
  for (let t of i)
    r(t) ? e.push(t) : o.push(t);
  return [e, o];
}
c(ln, "partition");

// node_modules/agentmail/dist/esm/core/schemas/builders/object-like/getObjectLikeUtils.mjs
function ge(i) {
  return {
    withParsedProperties: /* @__PURE__ */ c((r) => ai(i, r), "withParsedProperties")
  };
}
c(ge, "getObjectLikeUtils");
function ai(i, r) {
  let e = {
    parse: /* @__PURE__ */ c((o, t) => {
      let n = i.parse(o, t);
      if (!n.ok)
        return n;
      let s = Object.entries(r).reduce((u, [m, d]) => Object.assign(Object.assign({}, u), { [m]: typeof d == "function" ? d(n.value) : d }), {});
      return {
        ok: !0,
        value: Object.assign(Object.assign({}, n.value), s)
      };
    }, "parse"),
    json: /* @__PURE__ */ c((o, t) => {
      var n;
      if (!Ue(o))
        return {
          ok: !1,
          errors: [
            {
              path: (n = t?.breadcrumbsPrefix) !== null && n !== void 0 ? n : [],
              message: F(o, "object")
            }
          ]
        };
      let s = new Set(Object.keys(r)), u = Wr(o, Object.keys(o).filter((m) => !s.has(m)));
      return i.json(u, t);
    }, "json"),
    getType: /* @__PURE__ */ c(() => i.getType(), "getType")
  };
  return Object.assign(Object.assign(Object.assign({}, e), K(e)), ge(e));
}
c(ai, "withParsedProperties");

// node_modules/agentmail/dist/esm/core/schemas/builders/object/property.mjs
function dn(i, r) {
  return {
    rawKey: i,
    valueSchema: r,
    isProperty: !0
  };
}
c(dn, "property");
function Ie(i) {
  return i.isProperty;
}
c(Ie, "isProperty");

// node_modules/agentmail/dist/esm/core/schemas/builders/object/object.mjs
function uo(i) {
  let r = {
    _getRawProperties: /* @__PURE__ */ c(() => Object.entries(i).map(([e, o]) => Ie(o) ? o.rawKey : e), "_getRawProperties"),
    _getParsedProperties: /* @__PURE__ */ c(() => Gr(i), "_getParsedProperties"),
    parse: /* @__PURE__ */ c((e, o) => {
      let t = {}, n = [];
      for (let [s, u] of $r(i)) {
        let m = Ie(u) ? u.rawKey : s, d = Ie(u) ? u.valueSchema : u, l = {
          rawKey: m,
          parsedKey: s,
          valueSchema: d
        };
        t[m] = l, mn(d) && n.push(m);
      }
      return cn({
        value: e,
        requiredKeys: n,
        getProperty: /* @__PURE__ */ c((s) => {
          let u = t[s];
          if (u != null)
            return {
              transformedKey: u.parsedKey,
              transform: /* @__PURE__ */ c((m) => {
                var d;
                return u.valueSchema.parse(m, Object.assign(Object.assign({}, o), { breadcrumbsPrefix: [...(d = o?.breadcrumbsPrefix) !== null && d !== void 0 ? d : [], s] }));
              }, "transform")
            };
        }, "getProperty"),
        unrecognizedObjectKeys: o?.unrecognizedObjectKeys,
        skipValidation: o?.skipValidation,
        breadcrumbsPrefix: o?.breadcrumbsPrefix,
        omitUndefined: o?.omitUndefined
      });
    }, "parse"),
    json: /* @__PURE__ */ c((e, o) => {
      let t = [];
      for (let [n, s] of $r(i)) {
        let u = Ie(s) ? s.valueSchema : s;
        mn(u) && t.push(n);
      }
      return cn({
        value: e,
        requiredKeys: t,
        getProperty: /* @__PURE__ */ c((n) => {
          let s = i[n];
          if (s != null)
            return Ie(s) ? {
              transformedKey: s.rawKey,
              transform: /* @__PURE__ */ c((u) => {
                var m;
                return s.valueSchema.json(u, Object.assign(Object.assign({}, o), { breadcrumbsPrefix: [...(m = o?.breadcrumbsPrefix) !== null && m !== void 0 ? m : [], n] }));
              }, "transform")
            } : {
              transformedKey: n,
              transform: /* @__PURE__ */ c((u) => {
                var m;
                return s.json(u, Object.assign(Object.assign({}, o), { breadcrumbsPrefix: [...(m = o?.breadcrumbsPrefix) !== null && m !== void 0 ? m : [], n] }));
              }, "transform")
            };
        }, "getProperty"),
        unrecognizedObjectKeys: o?.unrecognizedObjectKeys,
        skipValidation: o?.skipValidation,
        breadcrumbsPrefix: o?.breadcrumbsPrefix,
        omitUndefined: o?.omitUndefined
      });
    }, "json"),
    getType: /* @__PURE__ */ c(() => C.OBJECT, "getType")
  };
  return Object.assign(Object.assign(Object.assign(Object.assign({}, q(r)), K(r)), ge(r)), rr(r));
}
c(uo, "object");
function cn({ value: i, requiredKeys: r, getProperty: e, unrecognizedObjectKeys: o = "fail", skipValidation: t = !1, breadcrumbsPrefix: n = [] }) {
  if (!Ue(i))
    return {
      ok: !1,
      errors: [
        {
          path: n,
          message: F(i, "object")
        }
      ]
    };
  let s = new Set(r), u = [], m = {};
  for (let [d, l] of Object.entries(i)) {
    let p = e(d);
    if (p != null) {
      s.delete(d);
      let g = p.transform(l);
      g.ok ? m[p.transformedKey] = g.value : (m[d] = l, u.push(...g.errors));
    } else
      switch (o) {
        case "fail":
          u.push({
            path: [...n, d],
            message: `Unexpected key "${d}"`
          });
          break;
        case "strip":
          break;
        case "passthrough":
          m[d] = l;
          break;
      }
  }
  return u.push(...r.filter((d) => s.has(d)).map((d) => ({
    path: n,
    message: `Missing required key "${d}"`
  }))), u.length === 0 || t ? {
    ok: !0,
    value: m
  } : {
    ok: !1,
    errors: u
  };
}
c(cn, "validateAndTransformObject");
function rr(i) {
  return {
    extend: /* @__PURE__ */ c((r) => {
      let e = {
        _getParsedProperties: /* @__PURE__ */ c(() => [...i._getParsedProperties(), ...r._getParsedProperties()], "_getParsedProperties"),
        _getRawProperties: /* @__PURE__ */ c(() => [...i._getRawProperties(), ...r._getRawProperties()], "_getRawProperties"),
        parse: /* @__PURE__ */ c((o, t) => un({
          extensionKeys: r._getRawProperties(),
          value: o,
          transformBase: /* @__PURE__ */ c((n) => i.parse(n, t), "transformBase"),
          transformExtension: /* @__PURE__ */ c((n) => r.parse(n, t), "transformExtension")
        }), "parse"),
        json: /* @__PURE__ */ c((o, t) => un({
          extensionKeys: r._getParsedProperties(),
          value: o,
          transformBase: /* @__PURE__ */ c((n) => i.json(n, t), "transformBase"),
          transformExtension: /* @__PURE__ */ c((n) => r.json(n, t), "transformExtension")
        }), "json"),
        getType: /* @__PURE__ */ c(() => C.OBJECT, "getType")
      };
      return Object.assign(Object.assign(Object.assign(Object.assign({}, e), K(e)), ge(e)), rr(e));
    }, "extend"),
    passthrough: /* @__PURE__ */ c(() => {
      let r = {
        _getParsedProperties: /* @__PURE__ */ c(() => i._getParsedProperties(), "_getParsedProperties"),
        _getRawProperties: /* @__PURE__ */ c(() => i._getRawProperties(), "_getRawProperties"),
        parse: /* @__PURE__ */ c((e, o) => {
          let t = i.parse(e, Object.assign(Object.assign({}, o), { unrecognizedObjectKeys: "passthrough" }));
          return t.ok ? {
            ok: !0,
            value: Object.assign(Object.assign({}, e), t.value)
          } : t;
        }, "parse"),
        json: /* @__PURE__ */ c((e, o) => {
          let t = i.json(e, Object.assign(Object.assign({}, o), { unrecognizedObjectKeys: "passthrough" }));
          return t.ok ? {
            ok: !0,
            value: Object.assign(Object.assign({}, e), t.value)
          } : t;
        }, "json"),
        getType: /* @__PURE__ */ c(() => C.OBJECT, "getType")
      };
      return Object.assign(Object.assign(Object.assign(Object.assign({}, r), K(r)), ge(r)), rr(r));
    }, "passthrough")
  };
}
c(rr, "getObjectUtils");
function un({ extensionKeys: i, value: r, transformBase: e, transformExtension: o }) {
  let t = new Set(i), [n, s] = ln(Gr(r), (d) => t.has(d)), u = e(Wr(r, s)), m = o(Wr(r, n));
  return u.ok && m.ok ? {
    ok: !0,
    value: Object.assign(Object.assign({}, u.value), m.value)
  } : {
    ok: !1,
    errors: [
      ...u.ok ? [] : u.errors,
      ...m.ok ? [] : m.errors
    ]
  };
}
c(un, "validateAndTransformExtendedObject");
function mn(i) {
  return !nl(i);
}
c(mn, "isSchemaRequired");
function nl(i) {
  switch (i.getType()) {
    case C.ANY:
    case C.UNKNOWN:
    case C.OPTIONAL:
    case C.OPTIONAL_NULLABLE:
      return !0;
    default:
      return !1;
  }
}
c(nl, "isSchemaOptional");

// node_modules/agentmail/dist/esm/core/schemas/builders/object/objectWithoutOptionalProperties.mjs
function hn(i) {
  return uo(i);
}
c(hn, "objectWithoutOptionalProperties");

// node_modules/agentmail/dist/esm/core/schemas/builders/lazy/lazyObject.mjs
function pn(i) {
  let r = Object.assign(Object.assign({}, si(i)), { _getRawProperties: /* @__PURE__ */ c(() => pr(i)._getRawProperties(), "_getRawProperties"), _getParsedProperties: /* @__PURE__ */ c(() => pr(i)._getParsedProperties(), "_getParsedProperties") });
  return Object.assign(Object.assign(Object.assign(Object.assign({}, r), K(r)), ge(r)), rr(r));
}
c(pn, "lazyObject");

// node_modules/agentmail/dist/esm/core/schemas/builders/list/list.mjs
function mo(i) {
  let r = {
    parse: /* @__PURE__ */ c((e, o) => fn(e, (t, n) => {
      var s;
      return i.parse(t, Object.assign(Object.assign({}, o), { breadcrumbsPrefix: [...(s = o?.breadcrumbsPrefix) !== null && s !== void 0 ? s : [], `[${n}]`] }));
    }), "parse"),
    json: /* @__PURE__ */ c((e, o) => fn(e, (t, n) => {
      var s;
      return i.json(t, Object.assign(Object.assign({}, o), { breadcrumbsPrefix: [...(s = o?.breadcrumbsPrefix) !== null && s !== void 0 ? s : [], `[${n}]`] }));
    }), "json"),
    getType: /* @__PURE__ */ c(() => C.LIST, "getType")
  };
  return Object.assign(Object.assign({}, q(r)), K(r));
}
c(mo, "list");
function fn(i, r) {
  return Array.isArray(i) ? i.map((o, t) => r(o, t)).reduce((o, t) => {
    if (o.ok && t.ok)
      return {
        ok: !0,
        value: [...o.value, t.value]
      };
    let n = [];
    return o.ok || n.push(...o.errors), t.ok || n.push(...t.errors), {
      ok: !1,
      errors: n
    };
  }, { ok: !0, value: [] }) : {
    ok: !1,
    errors: [
      {
        message: F(i, "list"),
        path: []
      }
    ]
  };
}
c(fn, "validateAndTransformArray");

// node_modules/agentmail/dist/esm/core/schemas/builders/literals/booleanLiteral.mjs
function gn(i) {
  return ee(C.BOOLEAN_LITERAL, (e, { breadcrumbsPrefix: o = [] } = {}) => e === i ? {
    ok: !0,
    value: i
  } : {
    ok: !1,
    errors: [
      {
        path: o,
        message: F(e, `${i.toString()}`)
      }
    ]
  })();
}
c(gn, "booleanLiteral");

// node_modules/agentmail/dist/esm/core/schemas/builders/literals/stringLiteral.mjs
function _n(i) {
  return ee(C.STRING_LITERAL, (e, { breadcrumbsPrefix: o = [] } = {}) => e === i ? {
    ok: !0,
    value: i
  } : {
    ok: !1,
    errors: [
      {
        path: o,
        message: F(e, `"${i}"`)
      }
    ]
  })();
}
c(_n, "stringLiteral");

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/any.mjs
var vn = ee(C.ANY, (i) => ({
  ok: !0,
  value: i
}));

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/boolean.mjs
var wn = ee(C.BOOLEAN, (i, { breadcrumbsPrefix: r = [] } = {}) => typeof i == "boolean" ? {
  ok: !0,
  value: i
} : {
  ok: !1,
  errors: [
    {
      path: r,
      message: F(i, "boolean")
    }
  ]
});

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/never.mjs
var bn = ee(C.NEVER, (i, { breadcrumbsPrefix: r = [] } = {}) => ({
  ok: !1,
  errors: [
    {
      path: r,
      message: "Expected never"
    }
  ]
}));

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/number.mjs
var yn = ee(C.NUMBER, (i, { breadcrumbsPrefix: r = [] } = {}) => typeof i == "number" ? {
  ok: !0,
  value: i
} : {
  ok: !1,
  errors: [
    {
      path: r,
      message: F(i, "number")
    }
  ]
});

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/string.mjs
var xn = ee(C.STRING, (i, { breadcrumbsPrefix: r = [] } = {}) => typeof i == "string" ? {
  ok: !0,
  value: i
} : {
  ok: !1,
  errors: [
    {
      path: r,
      message: F(i, "string")
    }
  ]
});

// node_modules/agentmail/dist/esm/core/schemas/builders/primitives/unknown.mjs
var Rn = ee(C.UNKNOWN, (i) => ({ ok: !0, value: i }));

// node_modules/agentmail/dist/esm/core/schemas/builders/record/record.mjs
function Tn(i, r) {
  let e = {
    parse: /* @__PURE__ */ c((o, t) => En({
      value: o,
      isKeyNumeric: i.getType() === C.NUMBER,
      transformKey: /* @__PURE__ */ c((n) => {
        var s;
        return i.parse(n, Object.assign(Object.assign({}, t), { breadcrumbsPrefix: [...(s = t?.breadcrumbsPrefix) !== null && s !== void 0 ? s : [], `${n} (key)`] }));
      }, "transformKey"),
      transformValue: /* @__PURE__ */ c((n, s) => {
        var u;
        return r.parse(n, Object.assign(Object.assign({}, t), { breadcrumbsPrefix: [...(u = t?.breadcrumbsPrefix) !== null && u !== void 0 ? u : [], `${s}`] }));
      }, "transformValue"),
      breadcrumbsPrefix: t?.breadcrumbsPrefix
    }), "parse"),
    json: /* @__PURE__ */ c((o, t) => En({
      value: o,
      isKeyNumeric: i.getType() === C.NUMBER,
      transformKey: /* @__PURE__ */ c((n) => {
        var s;
        return i.json(n, Object.assign(Object.assign({}, t), { breadcrumbsPrefix: [...(s = t?.breadcrumbsPrefix) !== null && s !== void 0 ? s : [], `${n} (key)`] }));
      }, "transformKey"),
      transformValue: /* @__PURE__ */ c((n, s) => {
        var u;
        return r.json(n, Object.assign(Object.assign({}, t), { breadcrumbsPrefix: [...(u = t?.breadcrumbsPrefix) !== null && u !== void 0 ? u : [], `${s}`] }));
      }, "transformValue"),
      breadcrumbsPrefix: t?.breadcrumbsPrefix
    }), "json"),
    getType: /* @__PURE__ */ c(() => C.RECORD, "getType")
  };
  return Object.assign(Object.assign({}, q(e)), K(e));
}
c(Tn, "record");
function En({ value: i, isKeyNumeric: r, transformKey: e, transformValue: o, breadcrumbsPrefix: t = [] }) {
  return Ue(i) ? $r(i).reduce((n, [s, u]) => {
    if (u === void 0)
      return n;
    let m = n, d = s;
    if (r) {
      let w = s.length > 0 ? Number(s) : NaN;
      Number.isNaN(w) || (d = w);
    }
    let l = e(d), p = o(u, d);
    if (m.ok && l.ok && p.ok)
      return {
        ok: !0,
        value: Object.assign(Object.assign({}, m.value), { [l.value]: p.value })
      };
    let g = [];
    return m.ok || g.push(...m.errors), l.ok || g.push(...l.errors), p.ok || g.push(...p.errors), {
      ok: !1,
      errors: g
    };
  }, { ok: !0, value: {} }) : {
    ok: !1,
    errors: [
      {
        path: t,
        message: F(i, "object")
      }
    ]
  };
}
c(En, "validateAndTransformRecord");

// node_modules/agentmail/dist/esm/core/schemas/builders/set/set.mjs
function zn(i) {
  let r = mo(i), e = {
    parse: /* @__PURE__ */ c((o, t) => {
      let n = r.parse(o, t);
      return n.ok ? {
        ok: !0,
        value: new Set(n.value)
      } : n;
    }, "parse"),
    json: /* @__PURE__ */ c((o, t) => {
      var n;
      return o instanceof Set ? r.json([...o], t) : {
        ok: !1,
        errors: [
          {
            path: (n = t?.breadcrumbsPrefix) !== null && n !== void 0 ? n : [],
            message: F(o, "Set")
          }
        ]
      };
    }, "json"),
    getType: /* @__PURE__ */ c(() => C.SET, "getType")
  };
  return Object.assign(Object.assign({}, q(e)), K(e));
}
c(zn, "set");

// node_modules/agentmail/dist/esm/core/schemas/builders/undiscriminated-union/undiscriminatedUnion.mjs
function Pn(i) {
  let r = {
    parse: /* @__PURE__ */ c((e, o) => Sn((t, n) => t.parse(e, n), i, o), "parse"),
    json: /* @__PURE__ */ c((e, o) => Sn((t, n) => t.json(e, n), i, o), "json"),
    getType: /* @__PURE__ */ c(() => C.UNDISCRIMINATED_UNION, "getType")
  };
  return Object.assign(Object.assign({}, q(r)), K(r));
}
c(Pn, "undiscriminatedUnion");
function Sn(i, r, e) {
  let o = [];
  for (let [t, n] of r.entries()) {
    let s = i(n, Object.assign(Object.assign({}, e), { skipValidation: !1 }));
    if (s.ok)
      return s;
    for (let u of s.errors)
      o.push({
        path: u.path,
        message: `[Variant ${t}] ${u.message}`
      });
  }
  return {
    ok: !1,
    errors: o
  };
}
c(Sn, "validateAndTransformUndiscriminatedUnion");

// node_modules/agentmail/dist/esm/core/schemas/builders/union/discriminant.mjs
function Mn(i, r) {
  return {
    parsedDiscriminant: i,
    rawDiscriminant: r
  };
}
c(Mn, "discriminant");

// node_modules/agentmail/dist/esm/core/schemas/builders/union/union.mjs
var sl = function(i, r) {
  var e = {};
  for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && r.indexOf(o) < 0 && (e[o] = i[o]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var t = 0, o = Object.getOwnPropertySymbols(i); t < o.length; t++)
      r.indexOf(o[t]) < 0 && Object.prototype.propertyIsEnumerable.call(i, o[t]) && (e[o[t]] = i[o[t]]);
  return e;
};
function An(i, r) {
  let e = typeof i == "string" ? i : i.rawDiscriminant, o = typeof i == "string" ? i : i.parsedDiscriminant, t = co(Gr(r)), n = {
    parse: /* @__PURE__ */ c((s, u) => jn({
      value: s,
      discriminant: e,
      transformedDiscriminant: o,
      transformDiscriminantValue: /* @__PURE__ */ c((m) => {
        var d;
        return t.parse(m, {
          allowUnrecognizedEnumValues: u?.allowUnrecognizedUnionMembers,
          breadcrumbsPrefix: [...(d = u?.breadcrumbsPrefix) !== null && d !== void 0 ? d : [], e]
        });
      }, "transformDiscriminantValue"),
      getAdditionalPropertiesSchema: /* @__PURE__ */ c((m) => r[m], "getAdditionalPropertiesSchema"),
      allowUnrecognizedUnionMembers: u?.allowUnrecognizedUnionMembers,
      transformAdditionalProperties: /* @__PURE__ */ c((m, d) => d.parse(m, u), "transformAdditionalProperties"),
      breadcrumbsPrefix: u?.breadcrumbsPrefix
    }), "parse"),
    json: /* @__PURE__ */ c((s, u) => jn({
      value: s,
      discriminant: o,
      transformedDiscriminant: e,
      transformDiscriminantValue: /* @__PURE__ */ c((m) => {
        var d;
        return t.json(m, {
          allowUnrecognizedEnumValues: u?.allowUnrecognizedUnionMembers,
          breadcrumbsPrefix: [...(d = u?.breadcrumbsPrefix) !== null && d !== void 0 ? d : [], o]
        });
      }, "transformDiscriminantValue"),
      getAdditionalPropertiesSchema: /* @__PURE__ */ c((m) => r[m], "getAdditionalPropertiesSchema"),
      allowUnrecognizedUnionMembers: u?.allowUnrecognizedUnionMembers,
      transformAdditionalProperties: /* @__PURE__ */ c((m, d) => d.json(m, u), "transformAdditionalProperties"),
      breadcrumbsPrefix: u?.breadcrumbsPrefix
    }), "json"),
    getType: /* @__PURE__ */ c(() => C.UNION, "getType")
  };
  return Object.assign(Object.assign(Object.assign({}, q(n)), K(n)), ge(n));
}
c(An, "union");
function jn({ value: i, discriminant: r, transformedDiscriminant: e, transformDiscriminantValue: o, getAdditionalPropertiesSchema: t, allowUnrecognizedUnionMembers: n = !1, transformAdditionalProperties: s, breadcrumbsPrefix: u = [] }) {
  if (!Ue(i))
    return {
      ok: !1,
      errors: [
        {
          path: u,
          message: F(i, "object")
        }
      ]
    };
  let m = i, d = r, l = m[d], p = sl(m, [typeof d == "symbol" ? d : d + ""]);
  if (l == null)
    return {
      ok: !1,
      errors: [
        {
          path: u,
          message: `Missing discriminant ("${r}")`
        }
      ]
    };
  let g = o(l);
  if (!g.ok)
    return {
      ok: !1,
      errors: g.errors
    };
  let w = t(g.value);
  if (w == null)
    return n ? {
      ok: !0,
      value: Object.assign({ [e]: g.value }, p)
    } : {
      ok: !1,
      errors: [
        {
          path: [...u, r],
          message: "Unexpected discriminant value"
        }
      ]
    };
  let h = s(p, w);
  return h.ok ? {
    ok: !0,
    value: Object.assign({ [e]: l }, h.value)
  } : h;
}
c(jn, "transformAndValidateUnion");

// node_modules/agentmail/dist/esm/core/url/index.mjs
var y = {};
je(y, {
  encodePathParam: () => kn,
  join: () => In,
  toQueryString: () => Ae
});

// node_modules/agentmail/dist/esm/core/url/encodePathParam.mjs
function kn(i) {
  if (i === null)
    return "null";
  switch (typeof i) {
    case "undefined":
      return "undefined";
    case "string":
    case "number":
    case "boolean":
      break;
    default:
      i = String(i);
      break;
  }
  return encodeURIComponent(i);
}
c(kn, "encodePathParam");

// node_modules/agentmail/dist/esm/core/url/join.mjs
function In(i, ...r) {
  if (!i)
    return "";
  if (r.length === 0)
    return i;
  if (i.includes("://")) {
    let e;
    try {
      e = new URL(i);
    } catch {
      return Un(i, ...r);
    }
    let o = r[r.length - 1], t = o?.endsWith("/");
    for (let n of r) {
      let s = Ln(n);
      s && (e.pathname = Cn(e.pathname, s));
    }
    return t && !e.pathname.endsWith("/") && (e.pathname += "/"), e.toString();
  }
  return Un(i, ...r);
}
c(In, "join");
function Un(i, ...r) {
  if (r.length === 0)
    return i;
  let e = i, o = r[r.length - 1], t = o?.endsWith("/");
  for (let n of r) {
    let s = Ln(n);
    s && (e = Cn(e, s));
  }
  return t && !e.endsWith("/") && (e += "/"), e;
}
c(Un, "joinPath");
function Cn(i, r) {
  return i.endsWith("/") ? i + r : `${i}/${r}`;
}
c(Cn, "joinPathSegments");
function Ln(i) {
  if (!i)
    return i;
  let r = 0, e = i.length;
  return i.startsWith("/") && (r = 1), i.endsWith("/") && (e = i.length - 1), r === 0 && e === i.length ? i : i.slice(r, e);
}
c(Ln, "trimSlashes");

// node_modules/ws/wrapper.mjs
var zd = Br(As(), 1), Sd = Br(vi(), 1), Pd = Br(yi(), 1), Mi = Br(Eo(), 1), Md = Br(Bs(), 1);

// node_modules/agentmail/dist/esm/core/websocket/events.mjs
var zo = class {
  static {
    c(this, "Event");
  }
  constructor(r, e) {
    this.target = e, this.type = r;
  }
}, So = class extends zo {
  static {
    c(this, "ErrorEvent");
  }
  constructor(r, e) {
    super("error", e), this.message = r.message, this.error = r;
  }
}, Po = class extends zo {
  static {
    c(this, "CloseEvent");
  }
  constructor(r = 1e3, e = "", o) {
    super("close", o), this.wasClean = !0, this.code = r, this.reason = e;
  }
};

// node_modules/agentmail/dist/esm/core/websocket/ws.mjs
var Ad = /* @__PURE__ */ c(() => {
  if (typeof WebSocket < "u")
    return WebSocket;
  if (ur.type === "node")
    return Mi.default;
}, "getGlobalWebSocket"), kd = /* @__PURE__ */ c((i) => typeof i < "u" && !!i && i.CLOSING === 2, "isWebSocket"), Ne = {
  maxReconnectionDelay: 1e4,
  minReconnectionDelay: 1e3 + Math.random() * 4e3,
  minUptime: 5e3,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4e3,
  maxRetries: 1 / 0,
  maxEnqueuedMessages: 1 / 0,
  startClosed: !1,
  debug: !1
}, ve = class i {
  static {
    c(this, "ReconnectingWebSocket");
  }
  constructor({ url: r, protocols: e, options: o, headers: t, queryParameters: n }) {
    this._listeners = {
      error: [],
      message: [],
      open: [],
      close: []
    }, this._retryCount = -1, this._shouldReconnect = !0, this._connectLock = !1, this._binaryType = "blob", this._closeCalled = !1, this._messageQueue = [], this.CONNECTING = i.CONNECTING, this.OPEN = i.OPEN, this.CLOSING = i.CLOSING, this.CLOSED = i.CLOSED, this.onclose = null, this.onerror = null, this.onmessage = null, this.onopen = null, this._handleOpen = (s) => {
      this._debug("open event");
      let { minUptime: u = Ne.minUptime } = this._options;
      clearTimeout(this._connectTimeout), this._uptimeTimeout = setTimeout(() => this._acceptOpen(), u), this._ws.binaryType = this._binaryType, this._messageQueue.forEach((m) => {
        var d;
        return (d = this._ws) === null || d === void 0 ? void 0 : d.send(m);
      }), this._messageQueue = [], this.onopen && this.onopen(s), this._listeners.open.forEach((m) => this._callEventListener(s, m));
    }, this._handleMessage = (s) => {
      this._debug("message event"), this.onmessage && this.onmessage(s), this._listeners.message.forEach((u) => this._callEventListener(s, u));
    }, this._handleError = (s) => {
      this._debug("error event", s.message), this._disconnect(void 0, s.message === "TIMEOUT" ? "timeout" : void 0), this.onerror && this.onerror(s), this._debug("exec error listeners"), this._listeners.error.forEach((u) => this._callEventListener(s, u)), this._connect();
    }, this._handleClose = (s) => {
      this._debug("close event"), this._clearTimeouts(), s.code === 1e3 && (this._shouldReconnect = !1), this._shouldReconnect && this._connect(), this.onclose && this.onclose(s), this._listeners.close.forEach((u) => this._callEventListener(s, u));
    }, this._url = r, this._protocols = e, this._options = o ?? Ne, this._headers = t, this._queryParameters = n, this._options.startClosed && (this._shouldReconnect = !1), this._connect();
  }
  get binaryType() {
    return this._ws ? this._ws.binaryType : this._binaryType;
  }
  set binaryType(r) {
    this._binaryType = r, this._ws && (this._ws.binaryType = r);
  }
  /**
   * Returns the number or connection retries
   */
  get retryCount() {
    return Math.max(this._retryCount, 0);
  }
  /**
   * The number of bytes of data that have been queued using calls to send() but not yet
   * transmitted to the network. This value resets to zero once all queued data has been sent.
   * This value does not reset to zero when the connection is closed; if you keep calling send(),
   * this will continue to climb. Read only
   */
  get bufferedAmount() {
    return this._messageQueue.reduce((e, o) => (typeof o == "string" ? e += o.length : o instanceof Blob ? e += o.size : e += o.byteLength, e), 0) + (this._ws ? this._ws.bufferedAmount : 0);
  }
  /**
   * The extensions selected by the server. This is currently only the empty string or a list of
   * extensions as negotiated by the connection
   */
  get extensions() {
    return this._ws ? this._ws.extensions : "";
  }
  /**
   * A string indicating the name of the sub-protocol the server selected;
   * this will be one of the strings specified in the protocols parameter when creating the
   * WebSocket object
   */
  get protocol() {
    return this._ws ? this._ws.protocol : "";
  }
  /**
   * The current state of the connection; this is one of the Ready state constants
   */
  get readyState() {
    return this._ws ? this._ws.readyState : this._options.startClosed ? i.CLOSED : i.CONNECTING;
  }
  /**
   * The URL as resolved by the constructor
   */
  get url() {
    return this._ws ? this._ws.url : "";
  }
  /**
   * Closes the WebSocket connection or connection attempt, if any. If the connection is already
   * CLOSED, this method does nothing
   */
  close(r = 1e3, e) {
    if (this._closeCalled = !0, this._shouldReconnect = !1, this._clearTimeouts(), !this._ws) {
      this._debug("close enqueued: no ws instance");
      return;
    }
    if (this._ws.readyState === this.CLOSED) {
      this._debug("close: already closed");
      return;
    }
    this._ws.close(r, e);
  }
  /**
   * Closes the WebSocket connection or connection attempt and connects again.
   * Resets retry counter;
   */
  reconnect(r, e) {
    this._shouldReconnect = !0, this._closeCalled = !1, this._retryCount = -1, !this._ws || this._ws.readyState === this.CLOSED ? this._connect() : (this._disconnect(r, e), this._connect());
  }
  /**
   * Enqueue specified data to be transmitted to the server over the WebSocket connection
   */
  send(r) {
    if (this._ws && this._ws.readyState === this.OPEN)
      this._debug("send", r), this._ws.send(r);
    else {
      let { maxEnqueuedMessages: e = Ne.maxEnqueuedMessages } = this._options;
      this._messageQueue.length < e && (this._debug("enqueue", r), this._messageQueue.push(r));
    }
  }
  /**
   * Register an event handler of a specific event type
   */
  addEventListener(r, e) {
    this._listeners[r] && this._listeners[r].push(e);
  }
  dispatchEvent(r) {
    let e = this._listeners[r.type];
    if (e)
      for (let o of e)
        this._callEventListener(r, o);
    return !0;
  }
  /**
   * Removes an event listener
   */
  removeEventListener(r, e) {
    this._listeners[r] && (this._listeners[r] = this._listeners[r].filter(
      // @ts-ignore
      (o) => o !== e
    ));
  }
  _debug(...r) {
    this._options.debug && console.log.apply(console, ["RWS>", ...r]);
  }
  _getNextDelay() {
    let { reconnectionDelayGrowFactor: r = Ne.reconnectionDelayGrowFactor, minReconnectionDelay: e = Ne.minReconnectionDelay, maxReconnectionDelay: o = Ne.maxReconnectionDelay } = this._options, t = 0;
    return this._retryCount > 0 && (t = e * Math.pow(r, this._retryCount - 1), t > o && (t = o)), this._debug("next delay", t), t;
  }
  _wait() {
    return new Promise((r) => {
      setTimeout(r, this._getNextDelay());
    });
  }
  _getNextUrl(r) {
    if (typeof r == "string")
      return Promise.resolve(r);
    if (typeof r == "function") {
      let e = r();
      if (typeof e == "string")
        return Promise.resolve(e);
      if (e.then)
        return e;
    }
    throw Error("Invalid URL");
  }
  _connect() {
    if (this._connectLock || !this._shouldReconnect)
      return;
    this._connectLock = !0;
    let { maxRetries: r = Ne.maxRetries, connectionTimeout: e = Ne.connectionTimeout, WebSocket: o = Ad() } = this._options;
    if (this._retryCount >= r) {
      this._debug("max retries reached", this._retryCount, ">=", r);
      return;
    }
    if (this._retryCount++, this._debug("connect", this._retryCount), this._removeListeners(), !kd(o))
      throw Error("No valid WebSocket class provided");
    this._wait().then(() => this._getNextUrl(this._url)).then((t) => {
      if (this._closeCalled)
        return;
      let n = {};
      if (this._headers && (n.headers = this._headers), this._queryParameters && Object.keys(this._queryParameters).length > 0) {
        let s = Ae(this._queryParameters, { arrayFormat: "repeat" });
        s && (t = `${t}?${s}`);
      }
      this._ws = new o(t, this._protocols, n), this._ws.binaryType = this._binaryType, this._connectLock = !1, this._addListeners(), this._connectTimeout = setTimeout(() => this._handleTimeout(), e);
    });
  }
  _handleTimeout() {
    this._debug("timeout event"), this._handleError(new So(Error("TIMEOUT"), this));
  }
  _disconnect(r = 1e3, e) {
    if (this._clearTimeouts(), !!this._ws) {
      this._removeListeners();
      try {
        this._ws.close(r, e), this._handleClose(new Po(r, e, this));
      } catch {
      }
    }
  }
  _acceptOpen() {
    this._debug("accept open"), this._retryCount = 0;
  }
  _callEventListener(r, e) {
    "handleEvent" in e ? e.handleEvent(r) : e(r);
  }
  _removeListeners() {
    this._ws && (this._debug("removeListeners"), this._ws.removeEventListener("open", this._handleOpen), this._ws.removeEventListener("close", this._handleClose), this._ws.removeEventListener("message", this._handleMessage), this._ws.removeEventListener("error", this._handleError));
  }
  _addListeners() {
    this._ws && (this._debug("addListeners"), this._ws.addEventListener("open", this._handleOpen), this._ws.addEventListener("close", this._handleClose), this._ws.addEventListener("message", this._handleMessage), this._ws.addEventListener("error", this._handleError));
  }
  _clearTimeouts() {
    clearTimeout(this._connectTimeout), clearTimeout(this._uptimeTimeout);
  }
};
ve.CONNECTING = 0;
ve.OPEN = 1;
ve.CLOSING = 2;
ve.CLOSED = 3;

// node_modules/agentmail/dist/esm/errors/AgentMailError.mjs
var v = class i extends Error {
  static {
    c(this, "AgentMailError");
  }
  constructor({ message: r, statusCode: e, body: o, rawResponse: t }) {
    super(Ud({ message: r, statusCode: e, body: o })), Object.setPrototypeOf(this, i.prototype), this.statusCode = e, this.body = o, this.rawResponse = t;
  }
};
function Ud({ message: i, statusCode: r, body: e }) {
  let o = [];
  return i != null && o.push(i), r != null && o.push(`Status code: ${r.toString()}`), e != null && o.push(`Body: ${W(e, void 0, 2)}`), o.join(`
`);
}
c(Ud, "buildMessage");

// node_modules/agentmail/dist/esm/errors/AgentMailTimeoutError.mjs
var S = class i extends Error {
  static {
    c(this, "AgentMailTimeoutError");
  }
  constructor(r) {
    super(r), Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/auth/BearerAuthProvider.mjs
var Id = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Mo = class {
  static {
    c(this, "BearerAuthProvider");
  }
  constructor(r) {
    this.token = r.apiKey;
  }
  static canCreate(r) {
    var e;
    return r.apiKey != null || ((e = process.env) === null || e === void 0 ? void 0 : e.AGENTMAIL_API_KEY) != null;
  }
  getAuthRequest(r) {
    return Id(this, void 0, void 0, function* () {
      var e, o;
      let t = (e = yield x.get(this.token)) !== null && e !== void 0 ? e : (o = process.env) === null || o === void 0 ? void 0 : o.AGENTMAIL_API_KEY;
      if (t == null)
        throw new v({
          message: "Please specify a apiKey by either passing it in to the constructor or initializing a AGENTMAIL_API_KEY environment variable"
        });
      return {
        headers: { Authorization: `Bearer ${t}` }
      };
    });
  }
};

// node_modules/agentmail/dist/esm/core/headers.mjs
function T(...i) {
  let r = {};
  for (let [e, o] of i.filter((t) => t != null).flatMap((t) => Object.entries(t))) {
    let t = e.toLowerCase();
    o != null ? r[t] = o : t in r && delete r[t];
  }
  return r;
}
c(T, "mergeHeaders");

// node_modules/agentmail/dist/esm/BaseClient.mjs
function Cd(i) {
  let r = T({
    "X-Fern-Language": "JavaScript",
    "X-Fern-SDK-Name": "agentmail",
    "X-Fern-SDK-Version": "0.1.19",
    "User-Agent": "agentmail/0.1.19",
    "X-Fern-Runtime": ur.type,
    "X-Fern-Runtime-Version": ur.version
  }, i?.headers);
  return Object.assign(Object.assign({}, i), { logging: ao.createLogger(i?.logging), headers: r });
}
c(Cd, "normalizeClientOptions");
function V(i) {
  var r;
  let e = Cd(i), o = Ld(e);
  return (r = e.authProvider) !== null && r !== void 0 || (e.authProvider = new Mo(o)), e;
}
c(V, "normalizeClientOptionsWithAuth");
function Ld(i) {
  return Object.assign(Object.assign({}, i), { authProvider: new Fr() });
}
c(Ld, "withNoOpAuthProvider");

// node_modules/agentmail/dist/esm/environments.mjs
var P = {
  Production: {
    http: "https://api.agentmail.to",
    websockets: "wss://ws.agentmail.to"
  },
  Development: {
    http: "https://api.agentmail.dev",
    websockets: "wss://ws.agentmail.dev"
  }
};

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/ApiKeyId.mjs
var xr = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/CreatedAt.mjs
var jo = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/Name.mjs
var Rr = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/Prefix.mjs
var Ao = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/ApiKey.mjs
var Fs = a.object({
  apiKeyId: a.property("api_key_id", xr),
  prefix: Ao,
  name: Rr,
  usedAt: a.property("used_at", a.date().optional()),
  createdAt: a.property("created_at", jo)
});

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/CreateApiKeyRequest.mjs
var Ks = a.object({
  name: Rr
});

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/CreateApiKeyResponse.mjs
var $s = a.object({
  apiKeyId: a.property("api_key_id", xr),
  apiKey: a.property("api_key", a.string()),
  prefix: Ao,
  name: Rr,
  createdAt: a.property("created_at", jo)
});

// node_modules/agentmail/dist/esm/serialization/types/Count.mjs
var ie = a.number();

// node_modules/agentmail/dist/esm/serialization/types/PageToken.mjs
var ne = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/apiKeys/types/ListApiKeysResponse.mjs
var Ws = a.object({
  count: ie,
  nextPageToken: a.property("next_page_token", ne.optional()),
  apiKeys: a.property("api_keys", a.list(Fs))
});

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentContentDisposition.mjs
var ko = a.enum_(["inline", "attachment"]);

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentContentId.mjs
var Uo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentContentType.mjs
var Io = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentFilename.mjs
var Co = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentId.mjs
var ye = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentSize.mjs
var Gs = a.number();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/Attachment.mjs
var Er = a.object({
  attachmentId: a.property("attachment_id", ye),
  filename: Co.optional(),
  size: Gs,
  contentType: a.property("content_type", Io.optional()),
  contentDisposition: a.property("content_disposition", ko.optional()),
  contentId: a.property("content_id", Uo.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/AttachmentContent.mjs
var Hs = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/attachments/types/SendAttachment.mjs
var Os = a.object({
  filename: Co.optional(),
  contentType: a.property("content_type", Io.optional()),
  contentDisposition: a.property("content_disposition", ko.optional()),
  contentId: a.property("content_id", Uo.optional()),
  content: Hs
});

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/ClientId.mjs
var Lo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/DomainName.mjs
var Ys = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/FeedbackEnabled.mjs
var Tr = a.boolean();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/CreateDomainRequest.mjs
var No = a.object({
  domain: Ys,
  feedbackEnabled: a.property("feedback_enabled", Tr)
});

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/PodId.mjs
var Pe = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/DomainId.mjs
var we = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/RecordStatus.mjs
var Js = a.enum_(["MISSING", "INVALID", "VALID"]);

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/RecordType.mjs
var Xs = a.enum_(["TXT", "CNAME", "MX"]);

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/VerificationRecord.mjs
var Qs = a.object({
  type: Xs,
  name: a.string(),
  value: a.string(),
  status: Js,
  priority: a.number().optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/VerificationStatus.mjs
var Zs = a.enum_(["NOT_STARTED", "PENDING", "INVALID", "FAILED", "VERIFYING", "VERIFIED"]);

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/Domain.mjs
var ar = a.object({
  podId: a.property("pod_id", Pe.optional()),
  domainId: a.property("domain_id", we),
  status: Zs,
  feedbackEnabled: a.property("feedback_enabled", Tr),
  records: a.list(Qs),
  clientId: a.property("client_id", Lo.optional()),
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date())
});

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/DomainItem.mjs
var qs = a.object({
  podId: a.property("pod_id", Pe.optional()),
  domainId: a.property("domain_id", we),
  feedbackEnabled: a.property("feedback_enabled", Tr),
  clientId: a.property("client_id", Lo.optional()),
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date())
});

// node_modules/agentmail/dist/esm/serialization/types/Limit.mjs
var ae = a.number();

// node_modules/agentmail/dist/esm/serialization/resources/domains/types/ListDomainsResponse.mjs
var Vo = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  domains: a.list(qs)
});

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftBcc.mjs
var Ve = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftCc.mjs
var De = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftClientId.mjs
var Do = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftHtml.mjs
var zr = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftInReplyTo.mjs
var Bo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftLabels.mjs
var Sr = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftReplyTo.mjs
var Pr = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftSendAt.mjs
var Be = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftSubject.mjs
var Fe = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftText.mjs
var Mr = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftTo.mjs
var Ke = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/CreateDraftRequest.mjs
var ea = a.object({
  labels: Sr.optional(),
  replyTo: a.property("reply_to", Pr.optional()),
  to: Ke.optional(),
  cc: De.optional(),
  bcc: Ve.optional(),
  subject: Fe.optional(),
  text: Mr.optional(),
  html: zr.optional(),
  inReplyTo: a.property("in_reply_to", Bo.optional()),
  sendAt: a.property("send_at", Be.optional()),
  clientId: a.property("client_id", Do.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/InboxId.mjs
var G = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadId.mjs
var B = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftAttachments.mjs
var Fo = a.list(Er);

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftId.mjs
var me = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftPreview.mjs
var Ko = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftSendStatus.mjs
var $o = a.enum_(["scheduled", "sending", "failed"]);

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftUpdatedAt.mjs
var Wo = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/Draft.mjs
var $e = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  draftId: a.property("draft_id", me),
  clientId: a.property("client_id", Do.optional()),
  labels: Sr,
  replyTo: a.property("reply_to", Pr.optional()),
  to: Ke.optional(),
  cc: De.optional(),
  bcc: Ve.optional(),
  subject: Fe.optional(),
  preview: Ko.optional(),
  text: Mr.optional(),
  html: zr.optional(),
  attachments: Fo.optional(),
  inReplyTo: a.property("in_reply_to", Bo.optional()),
  references: a.list(a.string()).optional(),
  sendStatus: a.property("send_status", $o.optional()),
  sendAt: a.property("send_at", Be.optional()),
  updatedAt: a.property("updated_at", Wo),
  createdAt: a.property("created_at", a.date())
});

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/DraftItem.mjs
var ra = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  draftId: a.property("draft_id", me),
  labels: Sr,
  to: Ke.optional(),
  cc: De.optional(),
  bcc: Ve.optional(),
  subject: Fe.optional(),
  preview: Ko.optional(),
  attachments: Fo.optional(),
  sendStatus: a.property("send_status", $o.optional()),
  sendAt: a.property("send_at", Be.optional()),
  updatedAt: a.property("updated_at", Wo)
});

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/ListDraftsResponse.mjs
var jr = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  drafts: a.list(ra)
});

// node_modules/agentmail/dist/esm/serialization/resources/drafts/types/UpdateDraftRequest.mjs
var oa = a.object({
  replyTo: a.property("reply_to", Pr.optional()),
  to: Ke.optional(),
  cc: De.optional(),
  bcc: Ve.optional(),
  subject: Fe.optional(),
  text: Mr.optional(),
  html: zr.optional(),
  sendAt: a.property("send_at", Be.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageId.mjs
var J = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Recipient.mjs
var ta = a.object({
  address: a.string(),
  status: a.string()
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Timestamp.mjs
var xe = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Bounce.mjs
var ia = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  timestamp: xe,
  type: a.string(),
  subType: a.property("sub_type", a.string()),
  recipients: a.list(ta)
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Complaint.mjs
var na = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  timestamp: xe,
  type: a.string(),
  subType: a.property("sub_type", a.string()),
  recipients: a.list(a.string())
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Delivery.mjs
var sa = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  timestamp: xe,
  recipients: a.list(a.string())
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/EventId.mjs
var le = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/events/types/DomainVerifiedEvent.mjs
var aa = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("domain.verified")),
  eventId: a.property("event_id", le),
  domain: ar
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/EventType.mjs
var la = a.enum_([
  "message.received",
  "message.sent",
  "message.delivered",
  "message.bounced",
  "message.complained",
  "message.rejected",
  "domain.verified"
]);

// node_modules/agentmail/dist/esm/serialization/resources/events/types/EventTypes.mjs
var We = a.list(la);

// node_modules/agentmail/dist/esm/serialization/resources/events/types/InboxIds.mjs
var Ge = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageBouncedEvent.mjs
var da = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.bounced")),
  eventId: a.property("event_id", le),
  bounce: ia
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageComplainedEvent.mjs
var ca = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.complained")),
  eventId: a.property("event_id", le),
  complaint: na
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageDeliveredEvent.mjs
var ua = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.delivered")),
  eventId: a.property("event_id", le),
  delivery: sa
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageAttachments.mjs
var Go = a.list(Er);

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageBcc.mjs
var Ho = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageCc.mjs
var Oo = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageCreatedAt.mjs
var Yo = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageFrom.mjs
var Jo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageHeaders.mjs
var Xo = a.record(a.string(), a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageHtml.mjs
var He = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageInReplyTo.mjs
var Qo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageLabels.mjs
var Re = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessagePreview.mjs
var Zo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageReferences.mjs
var qo = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageSize.mjs
var et = a.number();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageSubject.mjs
var Ar = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageText.mjs
var Oe = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageTimestamp.mjs
var rt = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageTo.mjs
var ot = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageUpdatedAt.mjs
var tt = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/Message.mjs
var lr = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  labels: Re,
  timestamp: rt,
  from: Jo,
  replyTo: a.property("reply_to", a.list(a.string()).optional()),
  to: ot,
  cc: Oo.optional(),
  bcc: Ho.optional(),
  subject: Ar.optional(),
  preview: Zo.optional(),
  text: Oe.optional(),
  html: He.optional(),
  extractedText: a.property("extracted_text", a.string().optional()),
  extractedHtml: a.property("extracted_html", a.string().optional()),
  attachments: Go.optional(),
  inReplyTo: a.property("in_reply_to", Qo.optional()),
  references: qo.optional(),
  headers: Xo.optional(),
  size: et,
  updatedAt: a.property("updated_at", tt),
  createdAt: a.property("created_at", Yo)
});

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadAttachments.mjs
var it = a.list(Er);

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadCreatedAt.mjs
var nt = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadLabels.mjs
var st = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadLastMessageId.mjs
var at = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadMessageCount.mjs
var lt = a.number();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadPreview.mjs
var dt = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadReceivedTimestamp.mjs
var ct = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadRecipients.mjs
var ut = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadSenders.mjs
var mt = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadSentTimestamp.mjs
var ht = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadSize.mjs
var pt = a.number();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadSubject.mjs
var ft = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadTimestamp.mjs
var gt = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadUpdatedAt.mjs
var _t = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ThreadItem.mjs
var vt = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  labels: st,
  timestamp: gt,
  receivedTimestamp: a.property("received_timestamp", ct),
  sentTimestamp: a.property("sent_timestamp", ht),
  senders: mt,
  recipients: ut,
  subject: ft.optional(),
  preview: dt.optional(),
  attachments: it.optional(),
  lastMessageId: a.property("last_message_id", at),
  messageCount: a.property("message_count", lt),
  size: pt,
  updatedAt: a.property("updated_at", _t),
  createdAt: a.property("created_at", nt)
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageReceivedEvent.mjs
var ma = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.received")),
  eventId: a.property("event_id", le),
  message: lr,
  thread: vt
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Reject.mjs
var ha = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  timestamp: xe,
  reason: a.string()
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageRejectedEvent.mjs
var pa = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.rejected")),
  eventId: a.property("event_id", le),
  reject: ha
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/Send.mjs
var fa = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  timestamp: xe,
  recipients: a.list(a.string())
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/MessageSentEvent.mjs
var ga = a.object({
  type: a.stringLiteral("event"),
  eventType: a.property("event_type", a.stringLiteral("message.sent")),
  eventId: a.property("event_id", le),
  send: fa
});

// node_modules/agentmail/dist/esm/serialization/resources/events/types/PodIds.mjs
var Ye = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/index.mjs
var N = {};
je(N, {
  ClientId: () => eo,
  CreateInboxRequest: () => ji,
  DisplayName: () => dr,
  Inbox: () => ki,
  InboxId: () => G,
  ListInboxesResponse: () => Vd,
  UpdateInboxRequest: () => Dd,
  create: () => Ai
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/client/create.mjs
var Ai = {};
je(Ai, {
  Request: () => Nd
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/ClientId.mjs
var eo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/DisplayName.mjs
var dr = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/CreateInboxRequest.mjs
var ji = a.object({
  username: a.string().optional(),
  domain: a.string().optional(),
  displayName: a.property("display_name", dr.optional()),
  clientId: a.property("client_id", eo.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/client/create.mjs
var Nd = ji.optional();

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/Inbox.mjs
var ki = a.object({
  podId: a.property("pod_id", Pe),
  inboxId: a.property("inbox_id", G),
  displayName: a.property("display_name", dr.optional()),
  clientId: a.property("client_id", eo.optional()),
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date())
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/ListInboxesResponse.mjs
var Vd = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  inboxes: a.list(ki)
});

// node_modules/agentmail/dist/esm/serialization/resources/inboxes/types/UpdateInboxRequest.mjs
var Dd = a.object({
  displayName: a.property("display_name", dr)
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/Addresses.mjs
var Je = a.undiscriminatedUnion([
  a.string(),
  a.list(a.string())
]);

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/MessageItem.mjs
var _a = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  messageId: a.property("message_id", J),
  labels: Re,
  timestamp: rt,
  from: Jo,
  to: ot,
  cc: Oo.optional(),
  bcc: Ho.optional(),
  subject: Ar.optional(),
  preview: Zo.optional(),
  attachments: Go.optional(),
  inReplyTo: a.property("in_reply_to", Qo.optional()),
  references: qo.optional(),
  headers: Xo.optional(),
  size: et,
  updatedAt: a.property("updated_at", tt),
  createdAt: a.property("created_at", Yo)
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/ListMessagesResponse.mjs
var va = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  messages: a.list(_a)
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/ReplyAll.mjs
var wa = a.boolean();

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageAttachments.mjs
var kr = a.list(Os);

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageHeaders.mjs
var Ur = a.record(a.string(), a.string());

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageReplyTo.mjs
var Ir = Je;

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/ReplyAllMessageRequest.mjs
var ba = a.object({
  labels: Re.optional(),
  replyTo: a.property("reply_to", Ir.optional()),
  text: Oe.optional(),
  html: He.optional(),
  attachments: kr.optional(),
  headers: Ur.optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageBcc.mjs
var wt = Je;

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageCc.mjs
var bt = Je;

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageTo.mjs
var yt = Je;

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/ReplyToMessageRequest.mjs
var ya = a.object({
  labels: Re.optional(),
  replyTo: a.property("reply_to", Ir.optional()),
  to: yt.optional(),
  cc: bt.optional(),
  bcc: wt.optional(),
  replyAll: a.property("reply_all", wa.optional()),
  text: Oe.optional(),
  html: He.optional(),
  attachments: kr.optional(),
  headers: Ur.optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageRequest.mjs
var xa = a.object({
  labels: Re.optional(),
  replyTo: a.property("reply_to", Ir.optional()),
  to: yt.optional(),
  cc: bt.optional(),
  bcc: wt.optional(),
  subject: Ar.optional(),
  text: Oe.optional(),
  html: He.optional(),
  attachments: kr.optional(),
  headers: Ur.optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/SendMessageResponse.mjs
var Cr = a.object({
  messageId: a.property("message_id", J),
  threadId: a.property("thread_id", B)
});

// node_modules/agentmail/dist/esm/serialization/resources/messages/types/UpdateMessageRequest.mjs
var xt = a.object({
  addLabels: a.property("add_labels", a.list(a.string()).optional()),
  removeLabels: a.property("remove_labels", a.list(a.string()).optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/metrics/types/MetricTimestamp.mjs
var Xe = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/metrics/types/MessageMetrics.mjs
var Ra = a.object({
  sent: a.list(Xe).optional(),
  delivered: a.list(Xe).optional(),
  bounced: a.list(Xe).optional(),
  delayed: a.list(Xe).optional(),
  rejected: a.list(Xe).optional(),
  complained: a.list(Xe).optional(),
  received: a.list(Xe).optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/metrics/types/ListMetricsResponse.mjs
var Rt = a.object({
  message: Ra.optional()
});

// node_modules/agentmail/dist/esm/serialization/resources/metrics/types/MetricEventType.mjs
var Ea = a.enum_([
  "message.sent",
  "message.delivered",
  "message.bounced",
  "message.delayed",
  "message.rejected",
  "message.complained",
  "message.received"
]);

// node_modules/agentmail/dist/esm/serialization/resources/metrics/types/MetricEventTypes.mjs
var Et = a.list(Ea);

// node_modules/agentmail/dist/esm/serialization/types/OrganizationId.mjs
var Ta = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/organizations/types/Organization.mjs
var za = a.object({
  organizationId: a.property("organization_id", Ta),
  inboxCount: a.property("inbox_count", a.number()),
  domainCount: a.property("domain_count", a.number()),
  inboxLimit: a.property("inbox_limit", a.number().optional()),
  domainLimit: a.property("domain_limit", a.number().optional()),
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date())
});

// node_modules/agentmail/dist/esm/serialization/resources/pods/index.mjs
var H = {};
je(H, {
  ClientId: () => ro,
  CreatePodRequest: () => Bd,
  ListPodsResponse: () => Fd,
  Name: () => oo,
  Pod: () => Ui,
  PodId: () => Pe
});

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/ClientId.mjs
var ro = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/Name.mjs
var oo = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/CreatePodRequest.mjs
var Bd = a.object({
  name: oo.optional(),
  clientId: a.property("client_id", ro.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/Pod.mjs
var Ui = a.object({
  podId: a.property("pod_id", Pe),
  name: oo,
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date()),
  clientId: a.property("client_id", ro.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/pods/types/ListPodsResponse.mjs
var Fd = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  pods: a.list(Ui)
});

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/ListThreadsResponse.mjs
var Lr = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  threads: a.list(vt)
});

// node_modules/agentmail/dist/esm/serialization/resources/threads/types/Thread.mjs
var Nr = a.object({
  inboxId: a.property("inbox_id", G),
  threadId: a.property("thread_id", B),
  labels: st,
  timestamp: gt,
  receivedTimestamp: a.property("received_timestamp", ct),
  sentTimestamp: a.property("sent_timestamp", ht),
  senders: mt,
  recipients: ut,
  subject: ft.optional(),
  preview: dt.optional(),
  attachments: it.optional(),
  lastMessageId: a.property("last_message_id", at),
  messageCount: a.property("message_count", lt),
  size: pt,
  updatedAt: a.property("updated_at", _t),
  createdAt: a.property("created_at", nt),
  messages: a.list(lr)
});

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/index.mjs
var Me = {};
je(Me, {
  ClientId: () => to,
  CreateWebhookRequest: () => Kd,
  ListWebhooksResponse: () => $d,
  SvixId: () => Sa,
  SvixSignature: () => Pa,
  SvixTimestamp: () => Ma,
  Url: () => io,
  Webhook: () => Li,
  WebhookId: () => Ci,
  events: () => Ii
});

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/resources/events/index.mjs
var Ii = {};
je(Ii, {
  SvixId: () => Sa,
  SvixSignature: () => Pa,
  SvixTimestamp: () => Ma
});

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/resources/events/types/SvixId.mjs
var Sa = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/resources/events/types/SvixSignature.mjs
var Pa = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/resources/events/types/SvixTimestamp.mjs
var Ma = a.date();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/ClientId.mjs
var to = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/Url.mjs
var io = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/CreateWebhookRequest.mjs
var Kd = a.object({
  url: io,
  eventTypes: a.property("event_types", We),
  podIds: a.property("pod_ids", Ye.optional()),
  inboxIds: a.property("inbox_ids", Ge.optional()),
  clientId: a.property("client_id", to.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/WebhookId.mjs
var Ci = a.string();

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/Webhook.mjs
var Li = a.object({
  webhookId: a.property("webhook_id", Ci),
  url: io,
  eventTypes: a.property("event_types", We.optional()),
  podIds: a.property("pod_ids", Ye.optional()),
  inboxIds: a.property("inbox_ids", Ge.optional()),
  secret: a.string(),
  enabled: a.boolean(),
  updatedAt: a.property("updated_at", a.date()),
  createdAt: a.property("created_at", a.date()),
  clientId: a.property("client_id", to.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/webhooks/types/ListWebhooksResponse.mjs
var $d = a.object({
  count: ie,
  limit: ae.optional(),
  nextPageToken: a.property("next_page_token", ne.optional()),
  webhooks: a.list(Li)
});

// node_modules/agentmail/dist/esm/serialization/resources/websockets/types/Subscribed.mjs
var ja = a.object({
  type: a.stringLiteral("subscribed"),
  eventTypes: a.property("event_types", We.optional()),
  inboxIds: a.property("inbox_ids", Ge.optional()),
  podIds: a.property("pod_ids", Ye.optional())
});

// node_modules/agentmail/dist/esm/serialization/resources/websockets/client/socket/WebsocketsSocketResponse.mjs
var Ni = a.undiscriminatedUnion([
  ja,
  ma,
  ga,
  ua,
  da,
  ca,
  pa,
  aa
]);

// node_modules/agentmail/dist/esm/serialization/resources/websockets/types/Subscribe.mjs
var Aa = a.object({
  type: a.stringLiteral("subscribe"),
  eventTypes: a.property("event_types", We.optional()),
  inboxIds: a.property("inbox_ids", Ge.optional()),
  podIds: a.property("pod_ids", Ye.optional())
});

// node_modules/agentmail/dist/esm/serialization/types/ErrorName.mjs
var Tt = a.string();

// node_modules/agentmail/dist/esm/serialization/types/ErrorResponse.mjs
var j = a.object({
  name: Tt,
  message: a.string()
});

// node_modules/agentmail/dist/esm/serialization/types/Labels.mjs
var de = a.list(a.string());

// node_modules/agentmail/dist/esm/serialization/types/ValidationErrorResponse.mjs
var X = a.object({
  name: Tt,
  errors: a.unknown()
});

// node_modules/agentmail/dist/esm/api/errors/NotFoundError.mjs
var A = class i extends v {
  static {
    c(this, "NotFoundError");
  }
  constructor(r, e) {
    super({
      message: "NotFoundError",
      statusCode: 404,
      body: r,
      rawResponse: e
    }), Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/api/errors/ValidationError.mjs
var O = class i extends v {
  static {
    c(this, "ValidationError");
  }
  constructor(r, e) {
    super({
      message: "ValidationError",
      statusCode: 400,
      body: r,
      rawResponse: e
    }), Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/api/resources/messages/errors/MessageRejectedError.mjs
var Qe = class i extends v {
  static {
    c(this, "MessageRejectedError");
  }
  constructor(r, e) {
    super({
      message: "MessageRejectedError",
      statusCode: 403,
      body: r,
      rawResponse: e
    }), Object.setPrototypeOf(this, i.prototype);
  }
};

// node_modules/agentmail/dist/esm/api/resources/apiKeys/client/Client.mjs
var Vi = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, zt = class {
  static {
    c(this, "ApiKeysClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.ListApiKeysRequest} request
   * @param {ApiKeysClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.apiKeys.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return Vi(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w } = r, h = {};
      g != null && (h.limit = g.toString()), w != null && (h.page_token = w);
      let f = yield this._options.authProvider.getAuthRequest(), _ = T(f.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), R = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/api-keys"),
        method: "GET",
        headers: _,
        queryParameters: Object.assign(Object.assign({}, h), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (R.ok)
        return {
          data: Ws.parseOrThrow(R.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: R.rawResponse
        };
      if (R.error.reason === "status-code")
        throw new v({
          statusCode: R.error.statusCode,
          body: R.error.body,
          rawResponse: R.rawResponse
        });
      switch (R.error.reason) {
        case "non-json":
          throw new v({
            statusCode: R.error.statusCode,
            body: R.error.rawBody,
            rawResponse: R.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/api-keys.");
        case "unknown":
          throw new v({
            message: R.error.errorMessage,
            rawResponse: R.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.CreateApiKeyRequest} request
   * @param {ApiKeysClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.apiKeys.create({
   *         name: "name"
   *     })
   */
  create(r, e) {
    return z.fromPromise(this.__create(r, e));
  }
  __create(r, e) {
    return Vi(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/api-keys"),
        method: "POST",
        headers: w,
        contentType: "application/json",
        queryParameters: e?.queryParams,
        requestType: "json",
        body: Ks.jsonOrThrow(r, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: $s.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/api-keys.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.ApiKeyId} api_key
   * @param {ApiKeysClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.apiKeys.delete("api_key")
   */
  delete(r, e) {
    return z.fromPromise(this.__delete(r, e));
  }
  __delete(r, e) {
    return Vi(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/api-keys/${y.encodePathParam(xr.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/api-keys/{api_key}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/domains/client/Client.mjs
var Vr = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, St = class {
  static {
    c(this, "DomainsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.ListDomainsRequest} request
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.domains.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return Vr(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w } = r, h = {};
      g != null && (h.limit = g.toString()), w != null && (h.page_token = w);
      let f = yield this._options.authProvider.getAuthRequest(), _ = T(f.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), R = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/domains"),
        method: "GET",
        headers: _,
        queryParameters: Object.assign(Object.assign({}, h), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (R.ok)
        return {
          data: Vo.parseOrThrow(R.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: R.rawResponse
        };
      if (R.error.reason === "status-code")
        throw new v({
          statusCode: R.error.statusCode,
          body: R.error.body,
          rawResponse: R.rawResponse
        });
      switch (R.error.reason) {
        case "non-json":
          throw new v({
            statusCode: R.error.statusCode,
            body: R.error.rawBody,
            rawResponse: R.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/domains.");
        case "unknown":
          throw new v({
            message: R.error.errorMessage,
            rawResponse: R.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.DomainId} domain_id
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.domains.get("domain_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return Vr(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/domains/${y.encodePathParam(we.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: ar.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/domains/{domain_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getZoneFile(r, e) {
    return z.fromPromise(this.__getZoneFile(r, e));
  }
  __getZoneFile(r, e) {
    return Vr(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/domains/${y.encodePathParam(we.jsonOrThrow(r, { omitUndefined: !0 }))}/zone-file`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: h.body, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/domains/{domain_id}/zone-file.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.CreateDomainRequest} request
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.domains.create({
   *         domain: "domain",
   *         feedbackEnabled: true
   *     })
   */
  create(r, e) {
    return z.fromPromise(this.__create(r, e));
  }
  __create(r, e) {
    return Vr(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/domains"),
        method: "POST",
        headers: w,
        contentType: "application/json",
        queryParameters: e?.queryParams,
        requestType: "json",
        body: No.jsonOrThrow(r, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: ar.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/domains.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.DomainId} domain_id
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.domains.delete("domain_id")
   */
  delete(r, e) {
    return z.fromPromise(this.__delete(r, e));
  }
  __delete(r, e) {
    return Vr(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/domains/${y.encodePathParam(we.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/domains/{domain_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.DomainId} domain_id
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.domains.verify("domain_id")
   */
  verify(r, e) {
    return z.fromPromise(this.__verify(r, e));
  }
  __verify(r, e) {
    return Vr(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/domains/${y.encodePathParam(we.jsonOrThrow(r, { omitUndefined: !0 }))}/verify`),
        method: "POST",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/domains/{domain_id}/verify.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/drafts/client/Client.mjs
var ka = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Pt = class {
  static {
    c(this, "DraftsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.ListDraftsRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.drafts.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return ka(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w, labels: h, before: f, after: _, ascending: R } = r, k = {};
      g != null && (k.limit = g.toString()), w != null && (k.page_token = w), h != null && (k.labels = W(de.jsonOrThrow(h, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), f != null && (k.before = f.toISOString()), _ != null && (k.after = _.toISOString()), R != null && (k.ascending = R.toString());
      let E = yield this._options.authProvider.getAuthRequest(), D = T(E.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), U = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/drafts"),
        method: "GET",
        headers: D,
        queryParameters: Object.assign(Object.assign({}, k), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (U.ok)
        return {
          data: jr.parseOrThrow(U.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: U.rawResponse
        };
      if (U.error.reason === "status-code")
        switch (U.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(U.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), U.rawResponse);
          default:
            throw new v({
              statusCode: U.error.statusCode,
              body: U.error.body,
              rawResponse: U.rawResponse
            });
        }
      switch (U.error.reason) {
        case "non-json":
          throw new v({
            statusCode: U.error.statusCode,
            body: U.error.rawBody,
            rawResponse: U.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/drafts.");
        case "unknown":
          throw new v({
            message: U.error.errorMessage,
            rawResponse: U.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.DraftId} draft_id
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.drafts.get("draft_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return ka(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/drafts/${y.encodePathParam(me.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: $e.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/drafts/{draft_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/inboxes/resources/drafts/client/Client.mjs
var Dr = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Mt = class {
  static {
    c(this, "DraftsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.inboxes.ListDraftsRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.drafts.list("inbox_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Dr(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f, labels: _, before: R, after: k, ascending: E } = o, D = {};
      h != null && (D.limit = h.toString()), f != null && (D.page_token = f), _ != null && (D.labels = W(de.jsonOrThrow(_, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), R != null && (D.before = R.toISOString()), k != null && (D.after = k.toISOString()), E != null && (D.ascending = E.toString());
      let U = yield this._options.authProvider.getAuthRequest(), $ = T(U.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), L = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(e, { omitUndefined: !0 }))}/drafts`),
        method: "GET",
        headers: $,
        queryParameters: Object.assign(Object.assign({}, D), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (L.ok)
        return {
          data: jr.parseOrThrow(L.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: L.rawResponse
        };
      if (L.error.reason === "status-code")
        switch (L.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(L.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), L.rawResponse);
          default:
            throw new v({
              statusCode: L.error.statusCode,
              body: L.error.body,
              rawResponse: L.rawResponse
            });
        }
      switch (L.error.reason) {
        case "non-json":
          throw new v({
            statusCode: L.error.statusCode,
            body: L.error.rawBody,
            rawResponse: L.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/drafts.");
        case "unknown":
          throw new v({
            message: L.error.errorMessage,
            rawResponse: L.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.DraftId} draft_id
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.drafts.get("inbox_id", "draft_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Dr(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts/${y.encodePathParam(me.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: $e.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/drafts/{draft_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.CreateDraftRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.drafts.create("inbox_id", {})
   */
  create(r, e, o) {
    return z.fromPromise(this.__create(r, e, o));
  }
  __create(r, e, o) {
    return Dr(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts`),
        method: "POST",
        headers: h,
        contentType: "application/json",
        queryParameters: o?.queryParams,
        requestType: "json",
        body: ea.jsonOrThrow(e, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: $e.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes/{inbox_id}/drafts.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.DraftId} draft_id
   * @param {AgentMail.UpdateDraftRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.drafts.update("inbox_id", "draft_id", {})
   */
  update(r, e, o, t) {
    return z.fromPromise(this.__update(r, e, o, t));
  }
  __update(r, e, o, t) {
    return Dr(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts/${y.encodePathParam(me.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "PATCH",
        headers: f,
        contentType: "application/json",
        queryParameters: t?.queryParams,
        requestType: "json",
        body: oa.jsonOrThrow(o, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return {
          data: $e.parseOrThrow(_.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _.rawResponse
        };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling PATCH /v0/inboxes/{inbox_id}/drafts/{draft_id}.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.DraftId} draft_id
   * @param {AgentMail.UpdateMessageRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   * @throws {@link AgentMail.ValidationError}
   * @throws {@link AgentMail.MessageRejectedError}
   *
   * @example
   *     await client.inboxes.drafts.send("inbox_id", "draft_id", {})
   */
  send(r, e, o, t) {
    return z.fromPromise(this.__send(r, e, o, t));
  }
  __send(r, e, o, t) {
    return Dr(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts/${y.encodePathParam(me.jsonOrThrow(e, { omitUndefined: !0 }))}/send`),
        method: "POST",
        headers: f,
        contentType: "application/json",
        queryParameters: t?.queryParams,
        requestType: "json",
        body: xt.jsonOrThrow(o, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return {
          data: Cr.parseOrThrow(_.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _.rawResponse
        };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 400:
            throw new O(X.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 403:
            throw new Qe(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes/{inbox_id}/drafts/{draft_id}/send.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.DraftId} draft_id
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.drafts.delete("inbox_id", "draft_id")
   */
  delete(r, e, o) {
    return z.fromPromise(this.__delete(r, e, o));
  }
  __delete(r, e, o) {
    return Dr(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts/${y.encodePathParam(me.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: void 0, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/inboxes/{inbox_id}/drafts/{draft_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/inboxes/resources/messages/client/Client.mjs
var Ze = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, jt = class {
  static {
    c(this, "MessagesClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.inboxes.ListMessagesRequest} request
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.messages.list("inbox_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Ze(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f, labels: _, before: R, after: k, ascending: E, includeSpam: D } = o, U = {};
      h != null && (U.limit = h.toString()), f != null && (U.page_token = f), _ != null && (U.labels = W(de.jsonOrThrow(_, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), R != null && (U.before = R.toISOString()), k != null && (U.after = k.toISOString()), E != null && (U.ascending = E.toString()), D != null && (U.include_spam = D.toString());
      let $ = yield this._options.authProvider.getAuthRequest(), L = T($.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), I = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(e, { omitUndefined: !0 }))}/messages`),
        method: "GET",
        headers: L,
        queryParameters: Object.assign(Object.assign({}, U), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (I.ok)
        return {
          data: va.parseOrThrow(I.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: I.rawResponse
        };
      if (I.error.reason === "status-code")
        switch (I.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(I.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), I.rawResponse);
          default:
            throw new v({
              statusCode: I.error.statusCode,
              body: I.error.body,
              rawResponse: I.rawResponse
            });
        }
      switch (I.error.reason) {
        case "non-json":
          throw new v({
            statusCode: I.error.statusCode,
            body: I.error.rawBody,
            rawResponse: I.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/messages.");
        case "unknown":
          throw new v({
            message: I.error.errorMessage,
            rawResponse: I.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.MessageId} message_id
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.messages.get("inbox_id", "message_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Ze(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: lr.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/messages/{message_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getAttachment(r, e, o, t) {
    return z.fromPromise(this.__getAttachment(r, e, o, t));
  }
  __getAttachment(r, e, o, t) {
    return Ze(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}/attachments/${y.encodePathParam(ye.jsonOrThrow(o, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: f,
        queryParameters: t?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return { data: _.body, rawResponse: _.rawResponse };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/messages/{message_id}/attachments/{attachment_id}.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getRaw(r, e, o) {
    return z.fromPromise(this.__getRaw(r, e, o));
  }
  __getRaw(r, e, o) {
    return Ze(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}/raw`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: f.body, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/messages/{message_id}/raw.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.SendMessageRequest} request
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   * @throws {@link AgentMail.NotFoundError}
   * @throws {@link AgentMail.MessageRejectedError}
   *
   * @example
   *     await client.inboxes.messages.send("inbox_id", {})
   */
  send(r, e, o) {
    return z.fromPromise(this.__send(r, e, o));
  }
  __send(r, e, o) {
    return Ze(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/send`),
        method: "POST",
        headers: h,
        contentType: "application/json",
        queryParameters: o?.queryParams,
        requestType: "json",
        body: xa.jsonOrThrow(e, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: Cr.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          case 403:
            throw new Qe(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes/{inbox_id}/messages/send.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.MessageId} message_id
   * @param {AgentMail.ReplyToMessageRequest} request
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   * @throws {@link AgentMail.NotFoundError}
   * @throws {@link AgentMail.MessageRejectedError}
   *
   * @example
   *     await client.inboxes.messages.reply("inbox_id", "message_id", {})
   */
  reply(r, e, o, t) {
    return z.fromPromise(this.__reply(r, e, o, t));
  }
  __reply(r, e, o, t) {
    return Ze(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}/reply`),
        method: "POST",
        headers: f,
        contentType: "application/json",
        queryParameters: t?.queryParams,
        requestType: "json",
        body: ya.jsonOrThrow(o, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return {
          data: Cr.parseOrThrow(_.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _.rawResponse
        };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 403:
            throw new Qe(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes/{inbox_id}/messages/{message_id}/reply.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.MessageId} message_id
   * @param {AgentMail.ReplyAllMessageRequest} request
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   * @throws {@link AgentMail.NotFoundError}
   * @throws {@link AgentMail.MessageRejectedError}
   *
   * @example
   *     await client.inboxes.messages.replyAll("inbox_id", "message_id", {})
   */
  replyAll(r, e, o, t) {
    return z.fromPromise(this.__replyAll(r, e, o, t));
  }
  __replyAll(r, e, o, t) {
    return Ze(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}/reply-all`),
        method: "POST",
        headers: f,
        contentType: "application/json",
        queryParameters: t?.queryParams,
        requestType: "json",
        body: ba.jsonOrThrow(o, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return {
          data: Cr.parseOrThrow(_.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _.rawResponse
        };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 403:
            throw new Qe(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes/{inbox_id}/messages/{message_id}/reply-all.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.MessageId} message_id
   * @param {AgentMail.UpdateMessageRequest} request
   * @param {MessagesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.messages.update("inbox_id", "message_id", {})
   */
  update(r, e, o, t) {
    return z.fromPromise(this.__update(r, e, o, t));
  }
  __update(r, e, o, t) {
    return Ze(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/messages/${y.encodePathParam(J.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "PATCH",
        headers: f,
        contentType: "application/json",
        queryParameters: t?.queryParams,
        requestType: "json",
        body: xt.jsonOrThrow(o, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return {
          data: lr.parseOrThrow(_.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _.rawResponse
        };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling PATCH /v0/inboxes/{inbox_id}/messages/{message_id}.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/inboxes/resources/metrics/client/Client.mjs
var Wd = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, At = class {
  static {
    c(this, "MetricsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.inboxes.ListInboxMetricsRequest} request
   * @param {MetricsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.inboxes.metrics.get("inbox_id", {
   *         startTimestamp: new Date("2024-01-15T09:30:00.000Z"),
   *         endTimestamp: new Date("2024-01-15T09:30:00.000Z")
   *     })
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Wd(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let { eventTypes: w, startTimestamp: h, endTimestamp: f } = e, _ = {};
      w != null && (_.event_types = W(Et.jsonOrThrow(w, {
        unrecognizedObjectKeys: "strip",
        omitUndefined: !0
      }))), _.start_timestamp = h.toISOString(), _.end_timestamp = f.toISOString();
      let R = yield this._options.authProvider.getAuthRequest(), k = T(R.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), E = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/metrics`),
        method: "GET",
        headers: k,
        queryParameters: Object.assign(Object.assign({}, _), o?.queryParams),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (E.ok)
        return {
          data: Rt.parseOrThrow(E.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: E.rawResponse
        };
      if (E.error.reason === "status-code")
        switch (E.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(E.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), E.rawResponse);
          case 400:
            throw new O(X.parseOrThrow(E.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), E.rawResponse);
          default:
            throw new v({
              statusCode: E.error.statusCode,
              body: E.error.body,
              rawResponse: E.rawResponse
            });
        }
      switch (E.error.reason) {
        case "non-json":
          throw new v({
            statusCode: E.error.statusCode,
            body: E.error.rawBody,
            rawResponse: E.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/metrics.");
        case "unknown":
          throw new v({
            message: E.error.errorMessage,
            rawResponse: E.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/inboxes/resources/threads/client/Client.mjs
var kt = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ut = class {
  static {
    c(this, "ThreadsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.inboxes.ListThreadsRequest} request
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.threads.list("inbox_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return kt(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f, labels: _, before: R, after: k, ascending: E, includeSpam: D } = o, U = {};
      h != null && (U.limit = h.toString()), f != null && (U.page_token = f), _ != null && (U.labels = W(de.jsonOrThrow(_, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), R != null && (U.before = R.toISOString()), k != null && (U.after = k.toISOString()), E != null && (U.ascending = E.toString()), D != null && (U.include_spam = D.toString());
      let $ = yield this._options.authProvider.getAuthRequest(), L = T($.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), I = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(e, { omitUndefined: !0 }))}/threads`),
        method: "GET",
        headers: L,
        queryParameters: Object.assign(Object.assign({}, U), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (I.ok)
        return {
          data: Lr.parseOrThrow(I.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: I.rawResponse
        };
      if (I.error.reason === "status-code")
        switch (I.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(I.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), I.rawResponse);
          default:
            throw new v({
              statusCode: I.error.statusCode,
              body: I.error.body,
              rawResponse: I.rawResponse
            });
        }
      switch (I.error.reason) {
        case "non-json":
          throw new v({
            statusCode: I.error.statusCode,
            body: I.error.rawBody,
            rawResponse: I.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/threads.");
        case "unknown":
          throw new v({
            message: I.error.errorMessage,
            rawResponse: I.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.ThreadId} thread_id
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.threads.get("inbox_id", "thread_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return kt(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/threads/${y.encodePathParam(B.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: Nr.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/threads/{thread_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getAttachment(r, e, o, t) {
    return z.fromPromise(this.__getAttachment(r, e, o, t));
  }
  __getAttachment(r, e, o, t) {
    return kt(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/threads/${y.encodePathParam(B.jsonOrThrow(e, { omitUndefined: !0 }))}/attachments/${y.encodePathParam(ye.jsonOrThrow(o, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: f,
        queryParameters: t?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return { data: _.body, rawResponse: _.rawResponse };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}/threads/{thread_id}/attachments/{attachment_id}.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.ThreadId} thread_id
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.threads.delete("inbox_id", "thread_id")
   */
  delete(r, e, o) {
    return z.fromPromise(this.__delete(r, e, o));
  }
  __delete(r, e, o) {
    return kt(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}/threads/${y.encodePathParam(B.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: void 0, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/inboxes/{inbox_id}/threads/{thread_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/inboxes/client/Client.mjs
var no = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, It = class {
  static {
    c(this, "InboxesClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  get threads() {
    var r;
    return (r = this._threads) !== null && r !== void 0 ? r : this._threads = new Ut(this._options);
  }
  get messages() {
    var r;
    return (r = this._messages) !== null && r !== void 0 ? r : this._messages = new jt(this._options);
  }
  get drafts() {
    var r;
    return (r = this._drafts) !== null && r !== void 0 ? r : this._drafts = new Mt(this._options);
  }
  get metrics() {
    var r;
    return (r = this._metrics) !== null && r !== void 0 ? r : this._metrics = new At(this._options);
  }
  /**
   * @param {AgentMail.inboxes.ListInboxesRequest} request
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.inboxes.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return no(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w } = r, h = {};
      g != null && (h.limit = g.toString()), w != null && (h.page_token = w);
      let f = yield this._options.authProvider.getAuthRequest(), _ = T(f.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), R = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/inboxes"),
        method: "GET",
        headers: _,
        queryParameters: Object.assign(Object.assign({}, h), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (R.ok)
        return {
          data: N.ListInboxesResponse.parseOrThrow(R.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: R.rawResponse
        };
      if (R.error.reason === "status-code")
        throw new v({
          statusCode: R.error.statusCode,
          body: R.error.body,
          rawResponse: R.rawResponse
        });
      switch (R.error.reason) {
        case "non-json":
          throw new v({
            statusCode: R.error.statusCode,
            body: R.error.rawBody,
            rawResponse: R.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes.");
        case "unknown":
          throw new v({
            message: R.error.errorMessage,
            rawResponse: R.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.get("inbox_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return no(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: N.Inbox.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/inboxes/{inbox_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.CreateInboxRequest} request
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.inboxes.create(undefined)
   */
  create(r, e) {
    return z.fromPromise(this.__create(r, e));
  }
  __create(r, e) {
    return no(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/inboxes"),
        method: "POST",
        headers: w,
        contentType: "application/json",
        queryParameters: e?.queryParams,
        requestType: "json",
        body: r != null ? N.create.Request.jsonOrThrow(r, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }) : void 0,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: N.Inbox.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/inboxes.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {AgentMail.inboxes.UpdateInboxRequest} request
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.update("inbox_id", {
   *         displayName: "display_name"
   *     })
   */
  update(r, e, o) {
    return z.fromPromise(this.__update(r, e, o));
  }
  __update(r, e, o) {
    return no(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "PATCH",
        headers: h,
        contentType: "application/json",
        queryParameters: o?.queryParams,
        requestType: "json",
        body: N.UpdateInboxRequest.jsonOrThrow(e, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: N.Inbox.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling PATCH /v0/inboxes/{inbox_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.inboxes.delete("inbox_id")
   */
  delete(r, e) {
    return z.fromPromise(this.__delete(r, e));
  }
  __delete(r, e) {
    return no(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/inboxes/{inbox_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/metrics/client/Client.mjs
var Gd = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ct = class {
  static {
    c(this, "MetricsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.ListMetricsRequest} request
   * @param {MetricsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.metrics.list({
   *         startTimestamp: new Date("2024-01-15T09:30:00.000Z"),
   *         endTimestamp: new Date("2024-01-15T09:30:00.000Z")
   *     })
   */
  list(r, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list(r, e) {
    return Gd(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let { eventTypes: g, startTimestamp: w, endTimestamp: h } = r, f = {};
      g != null && (f.event_types = W(Et.jsonOrThrow(g, {
        unrecognizedObjectKeys: "strip",
        omitUndefined: !0
      }))), f.start_timestamp = w.toISOString(), f.end_timestamp = h.toISOString();
      let _ = yield this._options.authProvider.getAuthRequest(), R = T(_.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), k = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/metrics"),
        method: "GET",
        headers: R,
        queryParameters: Object.assign(Object.assign({}, f), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (k.ok)
        return {
          data: Rt.parseOrThrow(k.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: k.rawResponse
        };
      if (k.error.reason === "status-code")
        switch (k.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(k.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), k.rawResponse);
          default:
            throw new v({
              statusCode: k.error.statusCode,
              body: k.error.body,
              rawResponse: k.rawResponse
            });
        }
      switch (k.error.reason) {
        case "non-json":
          throw new v({
            statusCode: k.error.statusCode,
            body: k.error.rawBody,
            rawResponse: k.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/metrics.");
        case "unknown":
          throw new v({
            message: k.error.errorMessage,
            rawResponse: k.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/organizations/client/Client.mjs
var Hd = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Lt = class {
  static {
    c(this, "OrganizationsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * Get the current organization.
   *
   * @param {OrganizationsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.organizations.get()
   */
  get(r) {
    return z.fromPromise(this.__get(r));
  }
  __get(r) {
    return Hd(this, void 0, void 0, function* () {
      var e, o, t, n, s, u, m, d, l;
      let p = yield this._options.authProvider.getAuthRequest(), g = T(p.headers, (e = this._options) === null || e === void 0 ? void 0 : e.headers, r?.headers), w = yield M({
        url: y.join((o = yield x.get(this._options.baseUrl)) !== null && o !== void 0 ? o : ((t = yield x.get(this._options.environment)) !== null && t !== void 0 ? t : P.Production).http, "/v0/organizations"),
        method: "GET",
        headers: g,
        queryParameters: r?.queryParams,
        timeoutMs: ((u = (n = r?.timeoutInSeconds) !== null && n !== void 0 ? n : (s = this._options) === null || s === void 0 ? void 0 : s.timeoutInSeconds) !== null && u !== void 0 ? u : 60) * 1e3,
        maxRetries: (m = r?.maxRetries) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.maxRetries,
        abortSignal: r?.abortSignal,
        fetchFn: (l = this._options) === null || l === void 0 ? void 0 : l.fetch,
        logging: this._options.logging
      });
      if (w.ok)
        return {
          data: za.parseOrThrow(w.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: w.rawResponse
        };
      if (w.error.reason === "status-code")
        throw new v({
          statusCode: w.error.statusCode,
          body: w.error.body,
          rawResponse: w.rawResponse
        });
      switch (w.error.reason) {
        case "non-json":
          throw new v({
            statusCode: w.error.statusCode,
            body: w.error.rawBody,
            rawResponse: w.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/organizations.");
        case "unknown":
          throw new v({
            message: w.error.errorMessage,
            rawResponse: w.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/pods/resources/domains/client/Client.mjs
var Di = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Nt = class {
  static {
    c(this, "DomainsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.pods.ListDomainsRequest} request
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.domains.list("pod_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Di(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f } = o, _ = {};
      h != null && (_.limit = h.toString()), f != null && (_.page_token = f);
      let R = yield this._options.authProvider.getAuthRequest(), k = T(R.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), E = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(e, { omitUndefined: !0 }))}/domains`),
        method: "GET",
        headers: k,
        queryParameters: Object.assign(Object.assign({}, _), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (E.ok)
        return {
          data: Vo.parseOrThrow(E.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: E.rawResponse
        };
      if (E.error.reason === "status-code")
        switch (E.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(E.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), E.rawResponse);
          default:
            throw new v({
              statusCode: E.error.statusCode,
              body: E.error.body,
              rawResponse: E.rawResponse
            });
        }
      switch (E.error.reason) {
        case "non-json":
          throw new v({
            statusCode: E.error.statusCode,
            body: E.error.rawBody,
            rawResponse: E.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/domains.");
        case "unknown":
          throw new v({
            message: E.error.errorMessage,
            rawResponse: E.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.CreateDomainRequest} request
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.pods.domains.create("pod_id", {
   *         domain: "domain",
   *         feedbackEnabled: true
   *     })
   */
  create(r, e, o) {
    return z.fromPromise(this.__create(r, e, o));
  }
  __create(r, e, o) {
    return Di(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/domains`),
        method: "POST",
        headers: h,
        contentType: "application/json",
        queryParameters: o?.queryParams,
        requestType: "json",
        body: No.jsonOrThrow(e, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: ar.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/pods/{pod_id}/domains.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.DomainId} domain_id
   * @param {DomainsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.domains.delete("pod_id", "domain_id")
   */
  delete(r, e, o) {
    return z.fromPromise(this.__delete(r, e, o));
  }
  __delete(r, e, o) {
    return Di(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/domains/${y.encodePathParam(we.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: void 0, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/pods/{pod_id}/domains/{domain_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/pods/resources/drafts/client/Client.mjs
var Ua = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Vt = class {
  static {
    c(this, "DraftsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.pods.ListDraftsRequest} request
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.drafts.list("pod_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Ua(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f, labels: _, before: R, after: k, ascending: E } = o, D = {};
      h != null && (D.limit = h.toString()), f != null && (D.page_token = f), _ != null && (D.labels = W(de.jsonOrThrow(_, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), R != null && (D.before = R.toISOString()), k != null && (D.after = k.toISOString()), E != null && (D.ascending = E.toString());
      let U = yield this._options.authProvider.getAuthRequest(), $ = T(U.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), L = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(e, { omitUndefined: !0 }))}/drafts`),
        method: "GET",
        headers: $,
        queryParameters: Object.assign(Object.assign({}, D), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (L.ok)
        return {
          data: jr.parseOrThrow(L.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: L.rawResponse
        };
      if (L.error.reason === "status-code")
        switch (L.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(L.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), L.rawResponse);
          default:
            throw new v({
              statusCode: L.error.statusCode,
              body: L.error.body,
              rawResponse: L.rawResponse
            });
        }
      switch (L.error.reason) {
        case "non-json":
          throw new v({
            statusCode: L.error.statusCode,
            body: L.error.rawBody,
            rawResponse: L.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/drafts.");
        case "unknown":
          throw new v({
            message: L.error.errorMessage,
            rawResponse: L.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.DraftId} draft_id
   * @param {DraftsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.drafts.get("pod_id", "draft_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Ua(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/drafts/${y.encodePathParam(me.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: $e.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/drafts/{draft_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/pods/resources/inboxes/client/Client.mjs
var Dt = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Bt = class {
  static {
    c(this, "InboxesClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.pods.ListInboxesRequest} request
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.inboxes.list("pod_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Dt(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f } = o, _ = {};
      h != null && (_.limit = h.toString()), f != null && (_.page_token = f);
      let R = yield this._options.authProvider.getAuthRequest(), k = T(R.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), E = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(e, { omitUndefined: !0 }))}/inboxes`),
        method: "GET",
        headers: k,
        queryParameters: Object.assign(Object.assign({}, _), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (E.ok)
        return {
          data: N.ListInboxesResponse.parseOrThrow(E.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: E.rawResponse
        };
      if (E.error.reason === "status-code")
        switch (E.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(E.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), E.rawResponse);
          default:
            throw new v({
              statusCode: E.error.statusCode,
              body: E.error.body,
              rawResponse: E.rawResponse
            });
        }
      switch (E.error.reason) {
        case "non-json":
          throw new v({
            statusCode: E.error.statusCode,
            body: E.error.rawBody,
            rawResponse: E.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/inboxes.");
        case "unknown":
          throw new v({
            message: E.error.errorMessage,
            rawResponse: E.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.inboxes.get("pod_id", "inbox_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Dt(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: N.Inbox.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/inboxes/{inbox_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.inboxes.CreateInboxRequest} request
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.pods.inboxes.create("pod_id", {})
   */
  create(r, e, o) {
    return z.fromPromise(this.__create(r, e, o));
  }
  __create(r, e, o) {
    return Dt(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/inboxes`),
        method: "POST",
        headers: h,
        contentType: "application/json",
        queryParameters: o?.queryParams,
        requestType: "json",
        body: N.CreateInboxRequest.jsonOrThrow(e, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: N.Inbox.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/pods/{pod_id}/inboxes.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.inboxes.InboxId} inbox_id
   * @param {InboxesClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.inboxes.delete("pod_id", "inbox_id")
   */
  delete(r, e, o) {
    return z.fromPromise(this.__delete(r, e, o));
  }
  __delete(r, e, o) {
    return Dt(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/inboxes/${y.encodePathParam(N.InboxId.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: void 0, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/pods/{pod_id}/inboxes/{inbox_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/pods/resources/threads/client/Client.mjs
var Bi = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ft = class {
  static {
    c(this, "ThreadsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.pods.ListThreadsRequest} request
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.threads.list("pod_id")
   */
  list(r, e = {}, o) {
    return z.fromPromise(this.__list(r, e, o));
  }
  __list(r) {
    return Bi(this, arguments, void 0, function* (e, o = {}, t) {
      var n, s, u, m, d, l, p, g, w;
      let { limit: h, pageToken: f, labels: _, before: R, after: k, ascending: E, includeSpam: D } = o, U = {};
      h != null && (U.limit = h.toString()), f != null && (U.page_token = f), _ != null && (U.labels = W(de.jsonOrThrow(_, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), R != null && (U.before = R.toISOString()), k != null && (U.after = k.toISOString()), E != null && (U.ascending = E.toString()), D != null && (U.include_spam = D.toString());
      let $ = yield this._options.authProvider.getAuthRequest(), L = T($.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), I = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(e, { omitUndefined: !0 }))}/threads`),
        method: "GET",
        headers: L,
        queryParameters: Object.assign(Object.assign({}, U), t?.queryParams),
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (I.ok)
        return {
          data: Lr.parseOrThrow(I.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: I.rawResponse
        };
      if (I.error.reason === "status-code")
        switch (I.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(I.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), I.rawResponse);
          default:
            throw new v({
              statusCode: I.error.statusCode,
              body: I.error.body,
              rawResponse: I.rawResponse
            });
        }
      switch (I.error.reason) {
        case "non-json":
          throw new v({
            statusCode: I.error.statusCode,
            body: I.error.rawBody,
            rawResponse: I.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/threads.");
        case "unknown":
          throw new v({
            message: I.error.errorMessage,
            rawResponse: I.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {AgentMail.ThreadId} thread_id
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.threads.get("pod_id", "thread_id")
   */
  get(r, e, o) {
    return z.fromPromise(this.__get(r, e, o));
  }
  __get(r, e, o) {
    return Bi(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/threads/${y.encodePathParam(B.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return {
          data: Nr.parseOrThrow(f.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: f.rawResponse
        };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/threads/{thread_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getAttachment(r, e, o, t) {
    return z.fromPromise(this.__getAttachment(r, e, o, t));
  }
  __getAttachment(r, e, o, t) {
    return Bi(this, void 0, void 0, function* () {
      var n, s, u, m, d, l, p, g, w;
      let h = yield this._options.authProvider.getAuthRequest(), f = T(h.headers, (n = this._options) === null || n === void 0 ? void 0 : n.headers, t?.headers), _ = yield M({
        url: y.join((s = yield x.get(this._options.baseUrl)) !== null && s !== void 0 ? s : ((u = yield x.get(this._options.environment)) !== null && u !== void 0 ? u : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}/threads/${y.encodePathParam(B.jsonOrThrow(e, { omitUndefined: !0 }))}/attachments/${y.encodePathParam(ye.jsonOrThrow(o, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: f,
        queryParameters: t?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((l = (m = t?.timeoutInSeconds) !== null && m !== void 0 ? m : (d = this._options) === null || d === void 0 ? void 0 : d.timeoutInSeconds) !== null && l !== void 0 ? l : 60) * 1e3,
        maxRetries: (p = t?.maxRetries) !== null && p !== void 0 ? p : (g = this._options) === null || g === void 0 ? void 0 : g.maxRetries,
        abortSignal: t?.abortSignal,
        fetchFn: (w = this._options) === null || w === void 0 ? void 0 : w.fetch,
        logging: this._options.logging
      });
      if (_.ok)
        return { data: _.body, rawResponse: _.rawResponse };
      if (_.error.reason === "status-code")
        switch (_.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(_.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), _.rawResponse);
          default:
            throw new v({
              statusCode: _.error.statusCode,
              body: _.error.body,
              rawResponse: _.rawResponse
            });
        }
      switch (_.error.reason) {
        case "non-json":
          throw new v({
            statusCode: _.error.statusCode,
            body: _.error.rawBody,
            rawResponse: _.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}/threads/{thread_id}/attachments/{attachment_id}.");
        case "unknown":
          throw new v({
            message: _.error.errorMessage,
            rawResponse: _.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/pods/client/Client.mjs
var Kt = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, $t = class {
  static {
    c(this, "PodsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  get inboxes() {
    var r;
    return (r = this._inboxes) !== null && r !== void 0 ? r : this._inboxes = new Bt(this._options);
  }
  get threads() {
    var r;
    return (r = this._threads) !== null && r !== void 0 ? r : this._threads = new Ft(this._options);
  }
  get drafts() {
    var r;
    return (r = this._drafts) !== null && r !== void 0 ? r : this._drafts = new Vt(this._options);
  }
  get domains() {
    var r;
    return (r = this._domains) !== null && r !== void 0 ? r : this._domains = new Nt(this._options);
  }
  /**
   * @param {AgentMail.pods.ListPodsRequest} request
   * @param {PodsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.pods.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return Kt(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w } = r, h = {};
      g != null && (h.limit = g.toString()), w != null && (h.page_token = w);
      let f = yield this._options.authProvider.getAuthRequest(), _ = T(f.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), R = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/pods"),
        method: "GET",
        headers: _,
        queryParameters: Object.assign(Object.assign({}, h), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (R.ok)
        return {
          data: H.ListPodsResponse.parseOrThrow(R.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: R.rawResponse
        };
      if (R.error.reason === "status-code")
        throw new v({
          statusCode: R.error.statusCode,
          body: R.error.body,
          rawResponse: R.rawResponse
        });
      switch (R.error.reason) {
        case "non-json":
          throw new v({
            statusCode: R.error.statusCode,
            body: R.error.rawBody,
            rawResponse: R.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods.");
        case "unknown":
          throw new v({
            message: R.error.errorMessage,
            rawResponse: R.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {PodsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.get("pod_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return Kt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: H.Pod.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/pods/{pod_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.CreatePodRequest} request
   * @param {PodsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.pods.create({})
   */
  create(r, e) {
    return z.fromPromise(this.__create(r, e));
  }
  __create(r, e) {
    return Kt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/pods"),
        method: "POST",
        headers: w,
        contentType: "application/json",
        queryParameters: e?.queryParams,
        requestType: "json",
        body: H.CreatePodRequest.jsonOrThrow(r, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: H.Pod.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/pods.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.pods.PodId} pod_id
   * @param {PodsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.pods.delete("pod_id")
   */
  delete(r, e) {
    return z.fromPromise(this.__delete(r, e));
  }
  __delete(r, e) {
    return Kt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/pods/${y.encodePathParam(H.PodId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/pods/{pod_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/threads/client/Client.mjs
var Fi = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Wt = class {
  static {
    c(this, "ThreadsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.ListThreadsRequest} request
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.threads.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return Fi(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w, labels: h, before: f, after: _, ascending: R, includeSpam: k } = r, E = {};
      g != null && (E.limit = g.toString()), w != null && (E.page_token = w), h != null && (E.labels = W(de.jsonOrThrow(h, { unrecognizedObjectKeys: "strip", omitUndefined: !0 }))), f != null && (E.before = f.toISOString()), _ != null && (E.after = _.toISOString()), R != null && (E.ascending = R.toString()), k != null && (E.include_spam = k.toString());
      let D = yield this._options.authProvider.getAuthRequest(), U = T(D.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), $ = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/threads"),
        method: "GET",
        headers: U,
        queryParameters: Object.assign(Object.assign({}, E), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if ($.ok)
        return {
          data: Lr.parseOrThrow($.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: $.rawResponse
        };
      if ($.error.reason === "status-code")
        switch ($.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow($.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), $.rawResponse);
          default:
            throw new v({
              statusCode: $.error.statusCode,
              body: $.error.body,
              rawResponse: $.rawResponse
            });
        }
      switch ($.error.reason) {
        case "non-json":
          throw new v({
            statusCode: $.error.statusCode,
            body: $.error.rawBody,
            rawResponse: $.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/threads.");
        case "unknown":
          throw new v({
            message: $.error.errorMessage,
            rawResponse: $.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.ThreadId} thread_id
   * @param {ThreadsClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.threads.get("thread_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return Fi(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/threads/${y.encodePathParam(B.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: Nr.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/threads/{thread_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @throws {@link AgentMail.NotFoundError}
   */
  getAttachment(r, e, o) {
    return z.fromPromise(this.__getAttachment(r, e, o));
  }
  __getAttachment(r, e, o) {
    return Fi(this, void 0, void 0, function* () {
      var t, n, s, u, m, d, l, p, g;
      let w = yield this._options.authProvider.getAuthRequest(), h = T(w.headers, (t = this._options) === null || t === void 0 ? void 0 : t.headers, o?.headers), f = yield M({
        url: y.join((n = yield x.get(this._options.baseUrl)) !== null && n !== void 0 ? n : ((s = yield x.get(this._options.environment)) !== null && s !== void 0 ? s : P.Production).http, `/v0/threads/${y.encodePathParam(B.jsonOrThrow(r, { omitUndefined: !0 }))}/attachments/${y.encodePathParam(ye.jsonOrThrow(e, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: h,
        queryParameters: o?.queryParams,
        responseType: "binary-response",
        timeoutMs: ((d = (u = o?.timeoutInSeconds) !== null && u !== void 0 ? u : (m = this._options) === null || m === void 0 ? void 0 : m.timeoutInSeconds) !== null && d !== void 0 ? d : 60) * 1e3,
        maxRetries: (l = o?.maxRetries) !== null && l !== void 0 ? l : (p = this._options) === null || p === void 0 ? void 0 : p.maxRetries,
        abortSignal: o?.abortSignal,
        fetchFn: (g = this._options) === null || g === void 0 ? void 0 : g.fetch,
        logging: this._options.logging
      });
      if (f.ok)
        return { data: f.body, rawResponse: f.rawResponse };
      if (f.error.reason === "status-code")
        switch (f.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(f.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), f.rawResponse);
          default:
            throw new v({
              statusCode: f.error.statusCode,
              body: f.error.body,
              rawResponse: f.rawResponse
            });
        }
      switch (f.error.reason) {
        case "non-json":
          throw new v({
            statusCode: f.error.statusCode,
            body: f.error.rawBody,
            rawResponse: f.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/threads/{thread_id}/attachments/{attachment_id}.");
        case "unknown":
          throw new v({
            message: f.error.errorMessage,
            rawResponse: f.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/webhooks/client/Client.mjs
var Gt = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ht = class {
  static {
    c(this, "WebhooksClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  /**
   * @param {AgentMail.webhooks.ListWebhooksRequest} request
   * @param {WebhooksClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.webhooks.list()
   */
  list(r = {}, e) {
    return z.fromPromise(this.__list(r, e));
  }
  __list() {
    return Gt(this, arguments, void 0, function* (r = {}, e) {
      var o, t, n, s, u, m, d, l, p;
      let { limit: g, pageToken: w } = r, h = {};
      g != null && (h.limit = g.toString()), w != null && (h.page_token = w);
      let f = yield this._options.authProvider.getAuthRequest(), _ = T(f.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), R = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/webhooks"),
        method: "GET",
        headers: _,
        queryParameters: Object.assign(Object.assign({}, h), e?.queryParams),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (R.ok)
        return {
          data: Me.ListWebhooksResponse.parseOrThrow(R.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: R.rawResponse
        };
      if (R.error.reason === "status-code")
        throw new v({
          statusCode: R.error.statusCode,
          body: R.error.body,
          rawResponse: R.rawResponse
        });
      switch (R.error.reason) {
        case "non-json":
          throw new v({
            statusCode: R.error.statusCode,
            body: R.error.rawBody,
            rawResponse: R.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/webhooks.");
        case "unknown":
          throw new v({
            message: R.error.errorMessage,
            rawResponse: R.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.webhooks.WebhookId} webhook_id
   * @param {WebhooksClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.webhooks.get("webhook_id")
   */
  get(r, e) {
    return z.fromPromise(this.__get(r, e));
  }
  __get(r, e) {
    return Gt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/webhooks/${y.encodePathParam(Me.WebhookId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "GET",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: Me.Webhook.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling GET /v0/webhooks/{webhook_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.webhooks.CreateWebhookRequest} request
   * @param {WebhooksClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.ValidationError}
   *
   * @example
   *     await client.webhooks.create({
   *         url: "url",
   *         eventTypes: ["message.received", "message.received"]
   *     })
   */
  create(r, e) {
    return z.fromPromise(this.__create(r, e));
  }
  __create(r, e) {
    return Gt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, "/v0/webhooks"),
        method: "POST",
        headers: w,
        contentType: "application/json",
        queryParameters: e?.queryParams,
        requestType: "json",
        body: Me.CreateWebhookRequest.jsonOrThrow(r, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: !0
        }),
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return {
          data: Me.Webhook.parseOrThrow(h.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: !0,
            allowUnrecognizedEnumValues: !0,
            skipValidation: !0,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: h.rawResponse
        };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 400:
            throw new O(X.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling POST /v0/webhooks.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
  /**
   * @param {AgentMail.webhooks.WebhookId} webhook_id
   * @param {WebhooksClient.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link AgentMail.NotFoundError}
   *
   * @example
   *     await client.webhooks.delete("webhook_id")
   */
  delete(r, e) {
    return z.fromPromise(this.__delete(r, e));
  }
  __delete(r, e) {
    return Gt(this, void 0, void 0, function* () {
      var o, t, n, s, u, m, d, l, p;
      let g = yield this._options.authProvider.getAuthRequest(), w = T(g.headers, (o = this._options) === null || o === void 0 ? void 0 : o.headers, e?.headers), h = yield M({
        url: y.join((t = yield x.get(this._options.baseUrl)) !== null && t !== void 0 ? t : ((n = yield x.get(this._options.environment)) !== null && n !== void 0 ? n : P.Production).http, `/v0/webhooks/${y.encodePathParam(Me.WebhookId.jsonOrThrow(r, { omitUndefined: !0 }))}`),
        method: "DELETE",
        headers: w,
        queryParameters: e?.queryParams,
        timeoutMs: ((m = (s = e?.timeoutInSeconds) !== null && s !== void 0 ? s : (u = this._options) === null || u === void 0 ? void 0 : u.timeoutInSeconds) !== null && m !== void 0 ? m : 60) * 1e3,
        maxRetries: (d = e?.maxRetries) !== null && d !== void 0 ? d : (l = this._options) === null || l === void 0 ? void 0 : l.maxRetries,
        abortSignal: e?.abortSignal,
        fetchFn: (p = this._options) === null || p === void 0 ? void 0 : p.fetch,
        logging: this._options.logging
      });
      if (h.ok)
        return { data: void 0, rawResponse: h.rawResponse };
      if (h.error.reason === "status-code")
        switch (h.error.statusCode) {
          case 404:
            throw new A(j.parseOrThrow(h.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: !0,
              allowUnrecognizedEnumValues: !0,
              skipValidation: !0,
              breadcrumbsPrefix: ["response"]
            }), h.rawResponse);
          default:
            throw new v({
              statusCode: h.error.statusCode,
              body: h.error.body,
              rawResponse: h.rawResponse
            });
        }
      switch (h.error.reason) {
        case "non-json":
          throw new v({
            statusCode: h.error.statusCode,
            body: h.error.rawBody,
            rawResponse: h.rawResponse
          });
        case "timeout":
          throw new S("Timeout exceeded when calling DELETE /v0/webhooks/{webhook_id}.");
        case "unknown":
          throw new v({
            message: h.error.errorMessage,
            rawResponse: h.rawResponse
          });
      }
    });
  }
};

// node_modules/agentmail/dist/esm/api/resources/websockets/client/Socket.mjs
var Od = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Ot = class {
  static {
    c(this, "WebsocketsSocket");
  }
  constructor(r) {
    this.eventHandlers = {}, this.handleOpen = () => {
      var e, o;
      (o = (e = this.eventHandlers).open) === null || o === void 0 || o.call(e);
    }, this.handleMessage = (e) => {
      var o, t, n, s;
      let u = qe(e.data), m = Ni.parse(u, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: !0,
        allowUnrecognizedEnumValues: !0,
        skipValidation: !0,
        omitUndefined: !0
      });
      m.ok ? (t = (o = this.eventHandlers).message) === null || t === void 0 || t.call(o, m.value) : (s = (n = this.eventHandlers).error) === null || s === void 0 || s.call(n, new Error("Received unknown message type"));
    }, this.handleClose = (e) => {
      var o, t;
      (t = (o = this.eventHandlers).close) === null || t === void 0 || t.call(o, e);
    }, this.handleError = (e) => {
      var o, t;
      let n = e.message;
      (t = (o = this.eventHandlers).error) === null || t === void 0 || t.call(o, new Error(n));
    }, this.socket = r.socket, this.socket.addEventListener("open", this.handleOpen), this.socket.addEventListener("message", this.handleMessage), this.socket.addEventListener("close", this.handleClose), this.socket.addEventListener("error", this.handleError);
  }
  /** The current state of the connection; this is one of the readyState constants. */
  get readyState() {
    return this.socket.readyState;
  }
  /**
   * @param event - The event to attach to.
   * @param callback - The callback to run when the event is triggered.
   * Usage:
   * ```typescript
   * this.on('open', () => {
   *     console.log('The websocket is open');
   * });
   * ```
   */
  on(r, e) {
    this.eventHandlers[r] = e;
  }
  sendSubscribe(r) {
    this.assertSocketIsOpen();
    let e = Aa.jsonOrThrow(r, {
      unrecognizedObjectKeys: "passthrough",
      allowUnrecognizedUnionMembers: !0,
      allowUnrecognizedEnumValues: !0,
      skipValidation: !0,
      omitUndefined: !0
    });
    this.socket.send(JSON.stringify(e));
  }
  /** Connect to the websocket and register event handlers. */
  connect() {
    return this.socket.reconnect(), this.socket.addEventListener("open", this.handleOpen), this.socket.addEventListener("message", this.handleMessage), this.socket.addEventListener("close", this.handleClose), this.socket.addEventListener("error", this.handleError), this;
  }
  /** Close the websocket and unregister event handlers. */
  close() {
    this.socket.close(), this.handleClose({ code: 1e3 }), this.socket.removeEventListener("open", this.handleOpen), this.socket.removeEventListener("message", this.handleMessage), this.socket.removeEventListener("close", this.handleClose), this.socket.removeEventListener("error", this.handleError);
  }
  /** Returns a promise that resolves when the websocket is open. */
  waitForOpen() {
    return Od(this, void 0, void 0, function* () {
      return this.socket.readyState === ve.OPEN ? this.socket : new Promise((r, e) => {
        this.socket.addEventListener("open", () => {
          r(this.socket);
        }), this.socket.addEventListener("error", (o) => {
          e(o);
        });
      });
    });
  }
  /** Asserts that the websocket is open. */
  assertSocketIsOpen() {
    if (!this.socket)
      throw new Error("Socket is not connected.");
    if (this.socket.readyState !== ve.OPEN)
      throw new Error("Socket is not open.");
  }
  /** Send a binary payload to the websocket. */
  sendBinary(r) {
    this.socket.send(r);
  }
};

// node_modules/agentmail/dist/esm/api/resources/websockets/client/Client.mjs
var Yd = function(i, r, e, o) {
  function t(n) {
    return n instanceof e ? n : new e(function(s) {
      s(n);
    });
  }
  return c(t, "adopt"), new (e || (e = Promise))(function(n, s) {
    function u(l) {
      try {
        d(o.next(l));
      } catch (p) {
        s(p);
      }
    }
    c(u, "fulfilled");
    function m(l) {
      try {
        d(o.throw(l));
      } catch (p) {
        s(p);
      }
    }
    c(m, "rejected");
    function d(l) {
      l.done ? n(l.value) : t(l.value).then(u, m);
    }
    c(d, "step"), d((o = o.apply(i, r || [])).next());
  });
}, Yt = class {
  static {
    c(this, "WebsocketsClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  connect() {
    return Yd(this, arguments, void 0, function* (r = {}) {
      var e, o;
      let { authToken: t, headers: n, debug: s, reconnectAttempts: u } = r, m = {};
      t != null && (m.auth_token = t);
      let d = yield this._options.authProvider.getAuthRequest(), l = T(d.headers, n), p = new ve({
        url: y.join((e = yield x.get(this._options.baseUrl)) !== null && e !== void 0 ? e : ((o = yield x.get(this._options.environment)) !== null && o !== void 0 ? o : P.Production).websockets, "/v0"),
        protocols: [],
        queryParameters: m,
        headers: l,
        options: { debug: s ?? !1, maxRetries: u ?? 30 }
      });
      return new Ot({ socket: p });
    });
  }
};

// node_modules/agentmail/dist/esm/Client.mjs
var Ki = class {
  static {
    c(this, "AgentMailClient");
  }
  constructor(r = {}) {
    this._options = V(r);
  }
  get inboxes() {
    var r;
    return (r = this._inboxes) !== null && r !== void 0 ? r : this._inboxes = new It(this._options);
  }
  get pods() {
    var r;
    return (r = this._pods) !== null && r !== void 0 ? r : this._pods = new $t(this._options);
  }
  get webhooks() {
    var r;
    return (r = this._webhooks) !== null && r !== void 0 ? r : this._webhooks = new Ht(this._options);
  }
  get apiKeys() {
    var r;
    return (r = this._apiKeys) !== null && r !== void 0 ? r : this._apiKeys = new zt(this._options);
  }
  get domains() {
    var r;
    return (r = this._domains) !== null && r !== void 0 ? r : this._domains = new St(this._options);
  }
  get drafts() {
    var r;
    return (r = this._drafts) !== null && r !== void 0 ? r : this._drafts = new Pt(this._options);
  }
  get metrics() {
    var r;
    return (r = this._metrics) !== null && r !== void 0 ? r : this._metrics = new Ct(this._options);
  }
  get organizations() {
    var r;
    return (r = this._organizations) !== null && r !== void 0 ? r : this._organizations = new Lt(this._options);
  }
  get threads() {
    var r;
    return (r = this._threads) !== null && r !== void 0 ? r : this._threads = new Wt(this._options);
  }
  get websockets() {
    var r;
    return (r = this._websockets) !== null && r !== void 0 ? r : this._websockets = new Yt(this._options);
  }
};

export {
  Ki as a
};
//# sourceMappingURL=HBZJI64A.js.map
