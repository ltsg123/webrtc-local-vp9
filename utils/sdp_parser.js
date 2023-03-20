!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports["sdp-parser"] = e())
    : t
    ? (t["sdp-parser"] = e())
    : (window["sdp-parser"] = e());
})(this, function () {
  return (() => {
    "use strict";
    var t = {
        8: (t, e, r) => {
          r.r(e),
            r.d(e, {
              Parser: () => T,
              Printer: () => v,
              parse: () => P,
              print: () => A,
            });
          const s = "\n",
            i = "".concat("\r").concat(s),
            n = " ";
          let c;
          function a(t) {
            return t >= "0" && t <= "9";
          }
          function o(t) {
            return t >= "!" && t <= "~";
          }
          function h(t) {
            return o(t) || (t >= "" && t <= "ÿ");
          }
          function u(t) {
            return (
              "!" === t ||
              (t >= "#" && t <= "'") ||
              (t >= "*" && t <= "+") ||
              (t >= "-" && t <= ".") ||
              (t >= "0" && t <= "9") ||
              (t >= "A" && t <= "Z") ||
              (t >= "^" && t <= "~")
            );
          }
          function p(t) {
            return t >= "1" && t <= "9";
          }
          function d(t) {
            return (t >= "A" && t <= "Z") || (t >= "a" && t <= "z");
          }
          function l(t) {
            return "d" === t || "h" === t || "m" === t || "s" === t;
          }
          function m(t) {
            return (
              (t > "" && t < "\t") ||
              (t > "\v" && t < "\f") ||
              (t > "" && t < "ÿ")
            );
          }
          function f(t) {
            return d(t) || a(t) || "+" === t || "/" === t;
          }
          function b(t) {
            return (
              a(t) || d(t) || "+" === t || "/" === t || "-" === t || "_" === t
            );
          }
          function x(t) {
            return d(t) || a(t) || "+" === t || "/" === t;
          }
          function g(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var s = Object.getOwnPropertySymbols(t);
              e &&
                (s = s.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, s);
            }
            return r;
          }
          function y(t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? g(Object(r), !0).forEach(function (e) {
                    w(t, e, r[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : g(Object(r)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(r, e)
                    );
                  });
            }
            return t;
          }
          function w(t, e, r) {
            return (
              e in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          !(function (t) {
            (t.VERSION = "v"),
              (t.ORIGIN = "o"),
              (t.SESSION_NAME = "s"),
              (t.INFORMATION = "i"),
              (t.URI = "u"),
              (t.EMAIL = "e"),
              (t.PHONE = "p"),
              (t.CONNECTION = "c"),
              (t.BANDWIDTH = "b"),
              (t.TIME = "t"),
              (t.REPEAT = "r"),
              (t.ZONE_ADJUSTMENTS = "z"),
              (t.KEY = "k"),
              (t.ATTRIBUTE = "a"),
              (t.MEDIA = "m");
          })(c || (c = {}));
          class O {
            consumeText(t, e) {
              let r = e;
              for (; r < t.length; ) {
                const e = t[r];
                if ("\0" === e || "\r" === e || e === s) break;
                r += 1;
              }
              if (r - e == 0) throw new Error("Invalid text, at ".concat(t));
              return r;
            }
            consumeUnicastAddress(t, e, r) {
              return this.consumeTill(t, e, n);
            }
            consumeOneOrMore(t, e, r) {
              let s = e;
              for (; r(t[s]); ) s++;
              if (s - e == 0)
                throw new Error("Invalid rule at ".concat(e, "."));
              return s;
            }
            consumeSpace(t, e) {
              if (t[e] === n) return e + 1;
              throw new Error("Invalid space at ".concat(e, "."));
            }
            consumeIP4Address(t, e) {
              let r = e;
              for (let e = 0; e < 4; e++)
                if (((r = this.consumeDecimalUChar(t, r)), 3 !== e)) {
                  if ("." !== t[r]) throw new Error("Invalid IP4 address.");
                  r++;
                }
              return r;
            }
            consumeDecimalUChar(t, e) {
              let r = e;
              for (let e = 0; e < 3 && a(t[r]); e++, r++);
              if (r - e == 0) throw new Error("Invalid decimal uchar.");
              const s = parseInt(t.slice(e, r));
              if (s >= 0 && s <= 255) return r;
              throw new Error("Invalid decimal uchar");
            }
            consumeIP6Address(t, e) {
              let r = this.consumeHexpart(t, e);
              return ":" === t[r]
                ? ((r += 1), (r = this.consumeIP4Address(t, r)), r)
                : r;
            }
            consumeHexpart(t, e) {
              let r = e;
              if (":" === t[r] && ":" === t[r + 1]) {
                r += 2;
                try {
                  r = this.consumeHexseq(t, r);
                } catch (t) {}
                return r;
              }
              if (
                ((r = this.consumeHexseq(t, r)),
                ":" === t[r] && ":" === t[r + 1])
              ) {
                r += 2;
                try {
                  r = this.consumeHexseq(t, r);
                } catch (t) {}
                return r;
              }
              return r;
            }
            consumeHexseq(t, e) {
              let r = e;
              for (
                ;
                (r = this.consumeHex4(t, r)), ":" === t[r] && ":" !== t[r + 1];

              )
                r += 1;
              return r;
            }
            consumeHex4(t, e) {
              let r = 0;
              for (; r < 4; r++)
                if (
                  !(
                    ((s = t[e + r]) >= "0" && s <= "9") ||
                    (s >= "a" && s <= "f") ||
                    (s >= "A" && s <= "F")
                  )
                ) {
                  if (0 === r) throw new Error("Invalid hex 4");
                  break;
                }
              var s;
              return e + r;
            }
            consumeFQDN(t, e) {
              let r = e;
              for (; a(t[r]) || d(t[r]) || "-" === t[r] || "." === t[r]; )
                r += 1;
              if (r - e < 4) throw new Error("Invalid FQDN");
              return r;
            }
            consumeExtnAddr(t, e) {
              return this.consumeOneOrMore(t, e, h);
            }
            consumeMulticastAddress(t, e, r) {
              switch (r) {
                case "IP4":
                case "ip4":
                  return this.consumeIP4MulticastAddress(t, e);
                case "IP6":
                case "ip6":
                  return this.consumeIP6MulticastAddress(t, e);
                default:
                  try {
                    return this.consumeFQDN(t, e);
                  } catch (r) {
                    return this.consumeExtnAddr(t, e);
                  }
              }
            }
            consumeIP6MulticastAddress(t, e) {
              const r = this.consumeHexpart(t, e);
              return "/" === t[r] ? this.consumeInteger(t, r + 1) : r;
            }
            consumeIP4MulticastAddress(t, e) {
              let r = e + 3;
              const s = t.slice(e, r),
                i = parseInt(s);
              if (i < 224 || i > 239)
                throw new Error(
                  "Invalid IP4 multicast address, IPv4 multicast addresses may be in the range 224.0.0.0 to 239.255.255.255."
                );
              for (let e = 0; e < 3; e++) {
                if ("." !== t[r])
                  throw new Error("Invalid IP4 multicast address.");
                (r += 1), (r = this.consumeDecimalUChar(t, r));
              }
              return (
                "/" === t[r] && (r += 1),
                (r = this.consumeTTL(t, r)),
                "/" === t[r] && (r = this.consumeInteger(t, r)),
                r
              );
            }
            consumeInteger(t, e) {
              if (!p(t[e])) throw new Error("Invalid integer.");
              for (e += 1; a(t[e]); ) e += 1;
              return e;
            }
            consumeTTL(t, e) {
              if ("0" === t[e]) return e + 1;
              if (!p(t[e])) throw new Error("Invalid TTL.");
              e += 1;
              for (let r = 0; r < 2 && a(t[e]); r++) e += 1;
              return e;
            }
            consumeToken(t, e) {
              return this.consumeOneOrMore(t, e, u);
            }
            consumeTime(t, e) {
              let r = e;
              if ("0" === t[r]) return r + 1;
              for (p(t[r]) && (r += 1); a(t[r]); ) r++;
              if (r - e < 10) throw new Error("Invalid time");
              return r;
            }
            consumeAddress(t, e) {
              return this.consumeTill(t, e, n);
            }
            consumeTypedTime(t, e) {
              let r = e;
              return (r = this.consumeOneOrMore(t, r, a)), l(t[r]) ? r + 1 : r;
            }
            consumeRepeatInterval(t, e) {
              if (!p(t[e])) throw new Error("Invalid repeat interval");
              for (e += 1; a(t[e]); ) e += 1;
              return l(t[e]) && (e += 1), e;
            }
            consumePort(t, e) {
              return this.consumeOneOrMore(t, e, a);
            }
            consume(t, e, r) {
              for (let s = 0; s < r.length; s++) {
                if (e + s >= t.length)
                  throw new Error("consume exceeding value length");
                if (t[e + s] !== r[s])
                  throw new Error(
                    "consume ".concat(r, " failed at ").concat(s)
                  );
              }
              return e + r.length;
            }
            consumeTill(t, e, r) {
              let s = e;
              for (
                ;
                s < t.length &&
                ("string" != typeof r || t[s] !== r) &&
                ("function" != typeof r || !r(t[s]));

              )
                s++;
              return s;
            }
          }
          class T extends O {
            constructor() {
              super(), w(this, "records", []), w(this, "currentLine", 0);
            }
            parse(t) {
              const e = this.probeEOL(t);
              (this.records = t
                .split(e)
                .filter((t) => !!t.trim())
                .map(this.parseLine)),
                (this.currentLine = 0);
              const r = this.parseVersion(),
                s = this.parseOrigin(),
                i = this.parseSessionName(),
                n = this.parseInformation(),
                c = this.parseUri(),
                a = this.parseEmail(),
                o = this.parsePhone(),
                h = this.parseConnection(),
                u = this.parseBandWidth(),
                p = this.parseTimeFields(),
                d = this.parseKey(),
                l = this.parseSessionAttribute(),
                m = this.parseMediaDescription();
              if (this.currentLine !== this.records.length)
                throw new Error("parsing failed, non exhaustive sdp lines.");
              return {
                version: r,
                origin: s,
                sessionName: i,
                information: n,
                uri: c,
                emails: a,
                phones: o,
                connection: h,
                bandwidths: u,
                timeFields: p,
                key: d,
                attributes: l,
                mediaDescriptions: m,
              };
            }
            getCurrentRecord() {
              const t = this.records[this.currentLine];
              if (!t) throw new Error("Record doesn't exit.");
              return t;
            }
            probeEOL(t) {
              for (let e = 0; e < t.length; e++)
                if (t[e] === s) return "\r" === t[e - 1] ? i : s;
              throw new Error("Invalid newline character.");
            }
            parseLine(t, e) {
              if (t.length < 2)
                throw new Error(
                  "Invalid sdp line, sdp line should be of form <type>=<value>."
                );
              const r = t[0];
              if ("=" !== t[1])
                throw new Error(
                  'Invalid sdp line, <type> should be a single character followed by an "=" sign.'
                );
              return { type: r, value: t.slice(2), line: e, cur: 0 };
            }
            parseSessionAttribute() {
              const t = new k();
              for (; this.currentLine < this.records.length; ) {
                const e = this.getCurrentRecord();
                if (e.type !== c.ATTRIBUTE) break;
                const r = {
                  attField: this.extractOneOrMore(e, (t) => u(t) && ":" !== t),
                  _cur: 0,
                };
                ":" === e.value[e.cur] &&
                  ((e.cur += 1), (r.attValue = this.extractOneOrMore(e, m))),
                  t.parse(r),
                  this.currentLine++;
              }
              return t.digest();
            }
            parseMediaAttributes(t) {
              const e = new S(t);
              for (; this.currentLine < this.records.length; ) {
                const t = this.getCurrentRecord();
                if (t.type !== c.ATTRIBUTE) break;
                const r = {
                  attField: this.extractOneOrMore(t, (t) => u(t) && ":" !== t),
                  _cur: 0,
                };
                ":" === t.value[t.cur] &&
                  ((t.cur += 1), (r.attValue = this.extractOneOrMore(t, m))),
                  e.parse(r),
                  this.currentLine++;
              }
              return e.digest();
            }
            parseKey() {
              const t = this.getCurrentRecord();
              if (t.type === c.KEY) {
                if (
                  "prompt" === t.value ||
                  "clear:" === t.value ||
                  "base64:" === t.value ||
                  "uri:" === t.value
                )
                  return t.value;
                throw (this.currentLine++, new Error("Invalid key."));
              }
            }
            parseZone() {
              const t = this.getCurrentRecord();
              if (t.type === c.ZONE_ADJUSTMENTS) {
                const e = [];
                for (;;)
                  try {
                    const r = this.extract(t, this.consumeTime);
                    this.consumeSpaceForRecord(t);
                    let s = !1;
                    "-" === t.value[t.cur] && ((s = !0), (t.cur += 1));
                    const i = this.extract(t, this.consumeTypedTime);
                    e.push({ time: r, typedTime: i, back: s });
                  } catch (t) {
                    break;
                  }
                if (0 === e.length) throw new Error("Invalid zone adjustments");
                return this.currentLine++, e;
              }
              return [];
            }
            parseRepeat() {
              const t = [];
              for (;;) {
                const e = this.getCurrentRecord();
                if (e.type !== c.REPEAT) break;
                {
                  const r = this.extract(e, this.consumeRepeatInterval),
                    s = this.parseTypedTime(e);
                  t.push({ repeatInterval: r, typedTimes: s }),
                    this.currentLine++;
                }
              }
              return t;
            }
            parseTypedTime(t) {
              const e = [];
              for (;;)
                try {
                  this.consumeSpaceForRecord(t),
                    e.push(this.extract(t, this.consumeTypedTime));
                } catch (t) {
                  break;
                }
              if (0 === e.length) throw new Error("Invalid typed time.");
              return e;
            }
            parseTime() {
              const t = this.getCurrentRecord(),
                e = this.extract(t, this.consumeTime);
              this.consumeSpaceForRecord(t);
              const r = this.extract(t, this.consumeTime);
              return this.currentLine++, { startTime: e, stopTime: r };
            }
            parseBandWidth() {
              const t = [];
              for (; this.currentLine < this.records.length; ) {
                const e = this.getCurrentRecord();
                if (e.type !== c.BANDWIDTH) break;
                {
                  const r = this.extractOneOrMore(e, u);
                  if (":" !== e.value[e.cur])
                    throw new Error("Invalid bandwidth field.");
                  e.cur++;
                  const s = this.extractOneOrMore(e, a);
                  t.push({ bwtype: r, bandwidth: s }), this.currentLine++;
                }
              }
              return t;
            }
            parseVersion() {
              const t = this.getCurrentRecord();
              if (t.type !== c.VERSION)
                throw new Error("first sdp record must be version");
              const e = t.value.slice(0, this.consumeOneOrMore(t.value, 0, a));
              if (e.length !== t.value.length)
                throw new Error(
                  'invalid proto version, "v='.concat(t.value, '"')
                );
              return this.currentLine++, e;
            }
            parseOrigin() {
              const t = this.getCurrentRecord();
              if (t.type !== c.ORIGIN)
                throw new Error("second line of sdp must be origin");
              const e = this.extractOneOrMore(t, h);
              this.consumeSpaceForRecord(t);
              const r = this.extractOneOrMore(t, a);
              this.consumeSpaceForRecord(t);
              const s = this.extractOneOrMore(t, a);
              this.consumeSpaceForRecord(t);
              const i = this.extractOneOrMore(t, u);
              this.consumeSpaceForRecord(t);
              const n = this.extractOneOrMore(t, u);
              this.consumeSpaceForRecord(t);
              const o = this.extract(t, this.consumeUnicastAddress);
              return (
                this.currentLine++,
                {
                  username: e,
                  sessId: r,
                  sessVersion: s,
                  nettype: i,
                  addrtype: n,
                  unicastAddress: o,
                }
              );
            }
            parseSessionName() {
              const t = this.getCurrentRecord();
              if (t.type === c.SESSION_NAME) {
                const e = this.extract(t, this.consumeText);
                return this.currentLine++, e;
              }
            }
            parseInformation() {
              const t = this.getCurrentRecord();
              if (t.type !== c.INFORMATION) return;
              const e = this.extract(t, this.consumeText);
              return this.currentLine++, e;
            }
            parseUri() {
              const t = this.getCurrentRecord();
              if (t.type === c.URI) return this.currentLine++, t.value;
            }
            parseEmail() {
              const t = [];
              for (;;) {
                const e = this.getCurrentRecord();
                if (e.type !== c.EMAIL) break;
                t.push(e.value), this.currentLine++;
              }
              return t;
            }
            parsePhone() {
              const t = [];
              for (;;) {
                const e = this.getCurrentRecord();
                if (e.type !== c.PHONE) break;
                t.push(e.value), this.currentLine++;
              }
              return t;
            }
            parseConnection() {
              const t = this.getCurrentRecord();
              if (t.type === c.CONNECTION) {
                const e = this.extractOneOrMore(t, u);
                this.consumeSpaceForRecord(t);
                const r = this.extractOneOrMore(t, u);
                this.consumeSpaceForRecord(t);
                const s = this.extract(t, this.consumeAddress);
                return (
                  this.currentLine++, { nettype: e, addrtype: r, address: s }
                );
              }
            }
            parseMedia() {
              const t = this.getCurrentRecord(),
                e = this.extract(t, this.consumeToken);
              this.consumeSpaceForRecord(t);
              let r = this.extract(t, this.consumePort);
              "/" === t.value[t.cur] &&
                ((t.cur += 1), (r += this.extract(t, this.consumeInteger))),
                this.consumeSpaceForRecord(t);
              const s = [];
              for (
                s.push(this.extract(t, this.consumeToken));
                "/" === t.value[t.cur];

              )
                (t.cur += 1), s.push(this.extract(t, this.consumeToken));
              if (0 === s.length) throw new Error("Invalid proto");
              const i = this.parseFmt(t);
              return (
                this.currentLine++,
                { mediaType: e, port: r, protos: s, fmts: i }
              );
            }
            parseTimeFields() {
              const t = [];
              for (; this.getCurrentRecord().type === c.TIME; ) {
                const e = this.parseTime(),
                  r = this.parseRepeat(),
                  s = this.parseZone();
                t.push({ time: e, repeats: r, zones: s });
              }
              return t;
            }
            parseMediaDescription() {
              const t = [];
              for (
                ;
                this.currentLine < this.records.length &&
                this.getCurrentRecord().type === c.MEDIA;

              ) {
                const e = this.parseMedia(),
                  r = this.parseInformation(),
                  s = this.parseConnections(),
                  i = this.parseBandWidth(),
                  n = this.parseKey(),
                  c = this.parseMediaAttributes(e);
                t.push({
                  media: e,
                  information: r,
                  connections: s,
                  bandwidths: i,
                  key: n,
                  attributes: c,
                });
              }
              return t;
            }
            parseConnections() {
              const t = [];
              for (
                ;
                this.currentLine < this.records.length &&
                this.getCurrentRecord().type === c.CONNECTION;

              )
                t.push(this.parseConnection());
              return t;
            }
            parseFmt(t) {
              const e = [];
              for (;;)
                try {
                  this.consumeSpaceForRecord(t),
                    e.push(this.extract(t, this.consumeToken));
                } catch (t) {
                  break;
                }
              if (0 === e.length) throw new Error("Invalid fmts");
              return e;
            }
            extract(t, e, ...r) {
              const s = e.call(this, t.value, t.cur, ...r),
                i = t.value.slice(t.cur, s);
              return (t.cur = s), i;
            }
            extractOneOrMore(t, e) {
              const r = this.consumeOneOrMore(t.value, t.cur, e),
                s = t.value.slice(t.cur, r);
              return (t.cur = r), s;
            }
            consumeSpaceForRecord(t) {
              if (t.value[t.cur] !== n)
                throw new Error("Invalid space at ".concat(t.cur, "."));
              t.cur += 1;
            }
          }
          class I extends O {
            constructor(...t) {
              super(...t),
                w(this, "attributes", void 0),
                w(this, "digested", !1);
            }
            extractOneOrMore(t, e, r) {
              const s = this.consumeOneOrMore(t.attValue, t._cur, e),
                i = t.attValue.slice(t._cur, s),
                [n, c] = r || [];
              if ("number" == typeof n && i.length < n)
                throw new Error(
                  "error in length, should be more or equal than ".concat(
                    n,
                    " characters."
                  )
                );
              if ("number" == typeof c && i.length > c)
                throw new Error(
                  "error in length, should be less or equal than ".concat(
                    c,
                    " characters."
                  )
                );
              return (t._cur = s), i;
            }
            consumeAttributeSpace(t) {
              if (t.attValue[t._cur] !== n)
                throw new Error("Invalid space at ".concat(t._cur, "."));
              t._cur += 1;
            }
            extract(t, e, ...r) {
              if (!t.attValue)
                throw new Error("Nothing to extract from attValue.");
              const s = e.call(this, t.attValue, t._cur, ...r),
                i = t.attValue.slice(t._cur, s);
              return (t._cur = s), i;
            }
            atEnd(t) {
              if (!t.attValue) throw new Error();
              return t._cur >= t.attValue.length;
            }
            peekChar(t) {
              if (!t.attValue) throw new Error();
              return t.attValue[t._cur];
            }
            peek(t, e) {
              if (!t.attValue) throw new Error();
              for (let r = 0; r < e.length; r++)
                if (e[r] !== t.attValue[t._cur + r]) return !1;
              return !0;
            }
            parseIceUfrag(t) {
              if (this.attributes.iceUfrag)
                throw new Error(
                  "Invalid ice-ufrag, should be only a single line if 'a=ice-ufrag'"
                );
              this.attributes.iceUfrag = this.extractOneOrMore(t, f, [4, 256]);
            }
            parseIcePwd(t) {
              if (this.attributes.icePwd)
                throw new Error(
                  "Invalid ice-pwd, should be only a single line if 'a=ice-pwd'"
                );
              this.attributes.icePwd = this.extractOneOrMore(t, f, [22, 256]);
            }
            parseIceOptions(t) {
              if (this.attributes.iceOptions)
                throw new Error(
                  "Invalid ice-options, should be only one 'ice-options' line"
                );
              const e = [];
              for (; !this.atEnd(t); ) {
                e.push(this.extractOneOrMore(t, f));
                try {
                  this.consumeAttributeSpace(t);
                } catch (e) {
                  if (this.atEnd(t)) break;
                  throw e;
                }
              }
              this.attributes.iceOptions = e;
            }
            parseFingerprint(t) {
              const e = this.extract(t, this.consumeToken);
              this.consumeAttributeSpace(t);
              const r = this.extract(t, this.consumeTill);
              this.attributes.fingerprints.push({
                hashFunction: e,
                fingerprint: r,
              });
            }
            parseExtmap(t) {
              const e = this.extractOneOrMore(t, a);
              let r;
              "/" === this.peekChar(t) &&
                (this.extract(t, this.consume, "/"),
                (r = this.extract(t, this.consumeToken))),
                this.consumeAttributeSpace(t);
              const s = this.extract(t, this.consumeTill, n),
                i = y(
                  y({ entry: parseInt(e, 10) }, r && { direction: r }),
                  {},
                  { extensionName: s }
                );
              this.peekChar(t) === n &&
                (this.consumeAttributeSpace(t),
                (i.extensionAttributes = this.extract(t, this.consumeTill))),
                this.attributes.extmaps.push(i);
            }
            parseSetup(t) {
              if (this.attributes.setup)
                throw new Error("must only be one single 'a=setup' line.");
              const e = this.extract(t, this.consumeTill);
              if (
                "active" !== e &&
                "passive" !== e &&
                "actpass" !== e &&
                "holdconn" !== e
              )
                throw new Error(
                  "role must be one of 'active', 'passive', 'actpass', 'holdconn'."
                );
              this.attributes.setup = e;
            }
          }
          class k extends I {
            constructor(...t) {
              super(...t),
                w(this, "attributes", {
                  unrecognized: [],
                  groups: [],
                  extmaps: [],
                  fingerprints: [],
                  identities: [],
                });
            }
            parse(t) {
              if (this.digested) throw new Error("already digested");
              try {
                switch (t.attField) {
                  case "group":
                    this.parseGroup(t);
                    break;
                  case "ice-lite":
                    this.parseIceLite();
                    break;
                  case "ice-ufrag":
                    this.parseIceUfrag(t);
                    break;
                  case "ice-pwd":
                    this.parseIcePwd(t);
                    break;
                  case "ice-options":
                    this.parseIceOptions(t);
                    break;
                  case "fingerprint":
                    this.parseFingerprint(t);
                    break;
                  case "setup":
                    this.parseSetup(t);
                    break;
                  case "tls-id":
                    this.parseTlsId(t);
                    break;
                  case "identity":
                    this.parseIdentity(t);
                    break;
                  case "extmap":
                    this.parseExtmap(t);
                    break;
                  case "msid-semantic":
                    this.parseMsidSemantic(t);
                    break;
                  default:
                    (t.ignored = !0), this.attributes.unrecognized.push(t);
                }
              } catch (e) {
                throw (
                  (console.error(
                    "parsing session attribute "
                      .concat(t.attField, ' error, "a=')
                      .concat(t.attField, ":")
                      .concat(t.attValue, '"')
                  ),
                  e)
                );
              }
              if (!t.ignored && t.attValue && !this.atEnd(t))
                throw new Error("attribute parsing error");
            }
            digest() {
              return (this.digested = !0), this.attributes;
            }
            parseGroup(t) {
              const e = this.extract(t, this.consumeToken),
                r = [];
              for (; !this.atEnd(t) && this.peekChar(t) === n; )
                this.consumeAttributeSpace(t),
                  r.push(this.extract(t, this.consumeToken));
              this.attributes.groups.push({
                semantic: e,
                identificationTag: r,
              });
            }
            parseIceLite() {
              if (this.attributes.iceLite)
                throw new Error(
                  "Invalid ice-lite, should be only a single line of 'a=ice-lite'"
                );
              this.attributes.iceLite = !0;
            }
            parseTlsId(t) {
              if (this.attributes.tlsId)
                throw new Error("must be only one tld-id line");
              this.attributes.tlsId = this.extractOneOrMore(t, b);
            }
            parseIdentity(t) {
              const e = this.extractOneOrMore(t, x),
                r = [];
              for (; !this.atEnd(t) && this.peekChar(t) === n; ) {
                this.consumeAttributeSpace(t);
                const e = this.extract(t, this.consumeToken);
                this.extract(t, this.consume, "=");
                const s = this.extractOneOrMore(t, (t) => t !== n && m(t));
                r.push({ name: e, value: s });
              }
              this.attributes.identities.push({
                assertionValue: e,
                extensions: r,
              });
            }
            parseMsidSemantic(t) {
              this.peekChar(t) === n && this.consumeAttributeSpace(t);
              const e = {
                semantic: this.extract(t, this.consumeToken),
                identifierList: [],
              };
              for (;;) {
                try {
                  this.consumeAttributeSpace(t);
                } catch (t) {
                  break;
                }
                if ("*" === this.peekChar(t)) {
                  this.extract(t, this.consume, "*"), (e.applyForAll = !0);
                  break;
                }
                {
                  const r = this.extract(t, this.consumeTill, n);
                  e.identifierList.push(r);
                }
              }
              this.attributes.msidSemantic = e;
            }
          }
          class S extends I {
            constructor(t) {
              super(),
                w(this, "attributes", void 0),
                -1 !== t.protos.indexOf("RTP") || t.protos.indexOf("rtp"),
                (this.attributes = {
                  unrecognized: [],
                  candidates: [],
                  extmaps: [],
                  fingerprints: [],
                  imageattr: [],
                  msids: [],
                  remoteCandidatesList: [],
                  rids: [],
                  ssrcs: [],
                  ssrcGroups: [],
                  rtcpFeedbackWildcards: [],
                  payloads: [],
                });
            }
            parse(t) {
              if (this.digested) throw new Error("already digested");
              try {
                switch (t.attField) {
                  case "extmap":
                    this.parseExtmap(t);
                    break;
                  case "setup":
                    this.parseSetup(t);
                    break;
                  case "ice-ufrag":
                    this.parseIceUfrag(t);
                    break;
                  case "ice-pwd":
                    this.parseIcePwd(t);
                    break;
                  case "ice-options":
                    this.parseIceOptions(t);
                    break;
                  case "candidate":
                    this.parseCandidate(t);
                    break;
                  case "remote-candidate":
                    this.parseRemoteCandidate(t);
                    break;
                  case "end-of-candidates":
                    this.parseEndOfCandidates();
                    break;
                  case "fingerprint":
                    this.parseFingerprint(t);
                    break;
                  case "rtpmap":
                    this.parseRtpmap(t);
                    break;
                  case "ptime":
                    this.parsePtime(t);
                    break;
                  case "maxptime":
                    this.parseMaxPtime(t);
                    break;
                  case "sendrecv":
                  case "recvonly":
                  case "sendonly":
                  case "inactive":
                    this.parseDirection(t);
                    break;
                  case "ssrc":
                    this.parseSSRC(t);
                    break;
                  case "fmtp":
                    this.parseFmtp(t);
                    break;
                  case "rtcp-fb":
                    this.parseRtcpFb(t);
                    break;
                  case "rtcp-mux":
                    this.parseRTCPMux();
                    break;
                  case "rtcp-mux-only":
                    this.parseRTCPMuxOnly();
                    break;
                  case "rtcp-rsize":
                    this.parseRTCPRsize();
                    break;
                  case "rtcp":
                    this.parseRTCP(t);
                    break;
                  case "mid":
                    this.parseMid(t);
                    break;
                  case "msid":
                    this.parseMsid(t);
                    break;
                  case "imageattr":
                    this.parseImageAttr(t);
                    break;
                  case "rid":
                    this.parseRid(t);
                    break;
                  case "simulcast":
                    this.parseSimulcast(t);
                    break;
                  case "sctp-port":
                    this.parseSctpPort(t);
                    break;
                  case "max-message-size":
                    this.parseMaxMessageSize(t);
                    break;
                  case "ssrc-group":
                    this.parseSSRCGroup(t);
                    break;
                  default:
                    (t.ignored = !0), this.attributes.unrecognized.push(t);
                }
              } catch (e) {
                throw (
                  (console.error(
                    "parsing media attribute "
                      .concat(t.attField, ' error, "a=')
                      .concat(t.attField, ":")
                      .concat(t.attValue, '"')
                  ),
                  e)
                );
              }
              if (!t.ignored && t.attValue && !this.atEnd(t))
                throw new Error("attribute parsing error");
            }
            parseCandidate(t) {
              const e = this.extractOneOrMore(t, f, [1, 32]);
              this.consumeAttributeSpace(t);
              const r = this.extractOneOrMore(t, a, [1, 5]);
              this.consumeAttributeSpace(t);
              const s = this.extract(t, this.consumeToken);
              this.consumeAttributeSpace(t);
              const i = this.extractOneOrMore(t, a, [1, 10]);
              this.consumeAttributeSpace(t);
              const c = this.extract(t, this.consumeAddress);
              this.consumeAttributeSpace(t);
              const h = this.extract(t, this.consumePort);
              this.consumeAttributeSpace(t),
                this.extract(t, this.consume, "typ"),
                this.consumeAttributeSpace(t);
              const u = {
                foundation: e,
                componentId: r,
                transport: s,
                priority: i,
                connectionAddress: c,
                port: h,
                type: this.extract(t, this.consumeToken),
                extension: {},
              };
              for (
                this.peek(t, " raddr") &&
                  (this.extract(t, this.consume, " raddr"),
                  this.consumeAttributeSpace(t),
                  (u.relAddr = this.extract(t, this.consumeAddress))),
                  this.peek(t, " rport") &&
                    (this.extract(t, this.consume, " rport"),
                    this.consumeAttributeSpace(t),
                    (u.relPort = this.extract(t, this.consumePort)));
                this.peekChar(t) === n;

              ) {
                this.consumeAttributeSpace(t);
                const e = this.extract(t, this.consumeToken);
                this.consumeAttributeSpace(t),
                  (u.extension[e] = this.extractOneOrMore(t, o));
              }
              this.attributes.candidates.push(u);
            }
            parseRemoteCandidate(t) {
              const e = [];
              for (;;) {
                const r = this.extractOneOrMore(t, a, [1, 5]);
                this.consumeAttributeSpace(t);
                const s = this.extract(t, this.consumeAddress);
                this.consumeAttributeSpace(t);
                const i = this.extract(t, this.consumePort);
                e.push({ componentId: r, connectionAddress: s, port: i });
                try {
                  this.consumeAttributeSpace(t);
                } catch (t) {
                  break;
                }
              }
              this.attributes.remoteCandidatesList.push(e);
            }
            parseEndOfCandidates() {
              if (this.attributes.endOfCandidates)
                throw new Error("must be only one line of end-of-candidates");
              this.attributes.endOfCandidates = !0;
            }
            parseRtpmap(t) {
              const e = this.extract(t, this.consumeToken);
              this.consumeAttributeSpace(t);
              const r = this.extract(t, this.consumeTill, "/");
              this.extract(t, this.consume, "/");
              const s = {
                encodingName: r,
                clockRate: this.extractOneOrMore(t, a),
              };
              this.atEnd(t) ||
                "/" !== this.peekChar(t) ||
                (this.extract(t, this.consume, "/"),
                (s.encodingParameters = parseInt(
                  this.extract(t, this.consumeTill),
                  10
                )));
              const i = this.attributes.payloads.find(
                (t) => t.payloadType === parseInt(e, 10)
              );
              i
                ? (i.rtpMap = s)
                : this.attributes.payloads.push({
                    payloadType: parseInt(e, 10),
                    rtpMap: s,
                    rtcpFeedbacks: [],
                  });
            }
            parsePtime(t) {
              if (this.attributes.ptime)
                throw new Error("must be only one line of ptime");
              this.attributes.ptime = this.extract(t, this.consumeTill);
            }
            parseMaxPtime(t) {
              if (this.attributes.maxPtime)
                throw new Error("must be only one line of ptime");
              this.attributes.maxPtime = this.extract(t, this.consumeTill);
            }
            parseDirection(t) {
              if (this.attributes.direction)
                throw new Error("must be only one line of direction info");
              this.attributes.direction = t.attField;
            }
            parseSSRC(t) {
              const e = this.extractOneOrMore(t, a);
              this.consumeAttributeSpace(t);
              const r = this.extract(t, this.consumeTill, ":");
              let s;
              ":" === this.peekChar(t) &&
                (this.extract(t, this.consume, ":"),
                (s = this.extract(t, this.consumeTill)));
              const i = this.attributes.ssrcs.find(
                (t) => t.ssrcId === parseInt(e, 10)
              );
              i
                ? (i.attributes[r] = s)
                : this.attributes.ssrcs.push({
                    ssrcId: parseInt(e, 10),
                    attributes: { [r]: s },
                  });
            }
            parseFmtp(t) {
              const e = this.extract(t, this.consumeTill, n);
              this.consumeAttributeSpace(t);
              const r = this.extract(t, this.consumeTill),
                s = {};
              r.split(";").forEach((t) => {
                let [e, r] = t.split("=");
                e = e.trim();
                const i = "string" == typeof r ? r.trim() : null;
                "string" == typeof e && e.length > 0 && (s[e] = i);
              });
              const i = this.attributes.payloads.find(
                (t) => t.payloadType === parseInt(e, 10)
              );
              i
                ? (i.fmtp = { parameters: s })
                : this.attributes.payloads.push({
                    payloadType: parseInt(e, 10),
                    rtcpFeedbacks: [],
                    fmtp: { parameters: s },
                  });
            }
            parseFmtParameters(t) {
              const e = {},
                r = this.extract(t, this.consumeTill, "=");
              t._cur++;
              const s = this.extract(t, this.consumeTill, ";");
              for (e[r] = s; ";" === t.attValue[t._cur]; ) {
                const r = this.extract(t, this.consumeTill, "=");
                t._cur++;
                const s = this.extract(t, this.consumeTill, ";");
                e[r] = s;
              }
              return e;
            }
            parseRtcpFb(t) {
              let e = "";
              (e =
                "*" === this.peekChar(t)
                  ? this.extract(t, this.consume, "*")
                  : this.extract(t, this.consumeTill, n)),
                this.consumeAttributeSpace(t);
              const r = this.extract(t, this.consumeTill, n);
              let s;
              switch (r) {
                case "trr-int":
                  s = { type: r, interval: this.extract(t, this.consumeTill) };
                  break;
                case "ack":
                case "nack":
                default: {
                  const e = { type: r };
                  this.peekChar(t) === n &&
                    (this.consumeAttributeSpace(t),
                    (e.parameter = this.extract(t, this.consumeToken)),
                    this.peekChar(t) === n &&
                      (e.additional = this.extract(t, this.consumeTill))),
                    (s = e);
                }
              }
              if ("*" === e) this.attributes.rtcpFeedbackWildcards.push(s);
              else {
                const t = this.attributes.payloads.find(
                  (t) => t.payloadType === parseInt(e, 10)
                );
                t
                  ? t.rtcpFeedbacks.push(s)
                  : this.attributes.payloads.push({
                      payloadType: parseInt(e, 10),
                      rtcpFeedbacks: [s],
                    });
              }
            }
            parseRTCPMux() {
              if (this.attributes.rtcpMux)
                throw new Error("must be single line of rtcp-mux");
              this.attributes.rtcpMux = !0;
            }
            parseRTCPMuxOnly() {
              if (this.attributes.rtcpMuxOnly)
                throw new Error("must be single line of rtcp-only");
              this.attributes.rtcpMuxOnly = !0;
            }
            parseRTCPRsize() {
              if (this.attributes.rtcpRsize)
                throw new Error("must be single line of rtcp-rsize");
              this.attributes.rtcpRsize = !0;
            }
            parseRTCP(t) {
              if (this.attributes.rtcp)
                throw new Error("must be single line of rtcp");
              const e = { port: this.extract(t, this.consumePort) };
              this.peekChar(t) === n &&
                (this.consumeAttributeSpace(t),
                (e.netType = this.extractOneOrMore(t, u)),
                this.consumeAttributeSpace(t),
                (e.addressType = this.extractOneOrMore(t, u)),
                this.consumeAttributeSpace(t),
                (e.address = this.extract(t, this.consumeAddress))),
                (this.attributes.rtcp = e);
            }
            parseMsid(t) {
              const e = { id: this.extractOneOrMore(t, u, [1, 64]) };
              this.peekChar(t) === n &&
                (this.consumeAttributeSpace(t),
                (e.appdata = this.extractOneOrMore(t, u, [1, 64]))),
                this.attributes.msids.push(e);
            }
            parseImageAttr(t) {
              this.attributes.imageattr.push(t.attValue);
            }
            parseRid(t) {
              const e = this.extractOneOrMore(
                t,
                (t) => d(t) || a(t) || "_" === t || "-" === t
              );
              this.consumeAttributeSpace(t);
              const r = {
                id: e,
                direction: this.extract(t, this.consumeToken),
                params: [],
              };
              if (this.peekChar(t) === n) {
                if ((this.consumeAttributeSpace(t), this.peek(t, "pt="))) {
                  this.extract(t, this.consume, "pt=");
                  const e = [];
                  for (;;) {
                    const r = this.extract(t, this.consumeToken);
                    e.push(r);
                    try {
                      this.extract(t, this.consume, ",");
                    } catch (t) {
                      break;
                    }
                  }
                  (r.payloads = e),
                    this.peekChar(t) === n && this.extract(t, this.consume, n);
                }
                for (;;) {
                  const e = this.extract(t, this.consumeToken);
                  switch (e) {
                    case "depend": {
                      const s = {
                        type: e,
                        rids: this.extract(t, this.consume, "=").split(","),
                      };
                      r.params.push(s);
                      break;
                    }
                    case "max-width":
                    case "height-width":
                    case "max-fps":
                    case "max-fs":
                    case "max-br":
                    case "max-pps":
                    case "max-bpp":
                    default: {
                      const s = { type: e };
                      "=" === this.peekChar(t) &&
                        (this.extract(t, this.consume, "="),
                        (s.val = this.extract(t, this.consumeTill, ";"))),
                        r.params.push(s);
                    }
                  }
                  try {
                    this.extract(t, this.consume, ";");
                  } catch (t) {
                    break;
                  }
                }
              }
              this.attributes.rids.push(r);
            }
            parseSimulcast(t) {
              if (this.attributes.simulcast)
                throw new Error("must be single line of simulcast");
              (this.attributes.simulcast = t.attValue),
                this.extract(t, this.consumeTill);
            }
            parseSctpPort(t) {
              this.attributes.sctpPort = this.extractOneOrMore(t, a, [1, 5]);
            }
            parseMaxMessageSize(t) {
              this.attributes.maxMessageSize = this.extractOneOrMore(t, a, [
                1,
                void 0,
              ]);
            }
            digest() {
              return (this.digested = !0), this.attributes;
            }
            parseMid(t) {
              this.attributes.mid = this.extract(t, this.consumeToken);
            }
            parseSSRCGroup(t) {
              const e = this.extract(t, this.consumeToken),
                r = [];
              for (;;)
                try {
                  this.consumeAttributeSpace(t);
                  const e = this.extract(t, this.consumeInteger);
                  r.push(parseInt(e, 10));
                } catch (t) {
                  break;
                }
              this.attributes.ssrcGroups.push({ semantic: e, ssrcIds: r });
            }
          }
          function M(t, e, r) {
            return (
              e in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          class v {
            constructor() {
              M(this, "eol", i);
            }
            print(t, e) {
              let r = "";
              return (
                e && (this.eol = e),
                (r += this.printVersion(t.version)),
                (r += this.printOrigin(t.origin)),
                (r += this.printSessionName(t.sessionName)),
                (r += this.printInformation(t.information)),
                (r += this.printUri(t.uri)),
                (r += this.printEmail(t.emails)),
                (r += this.printPhone(t.phones)),
                (r += this.printConnection(t.connection)),
                (r += this.printBandwidth(t.bandwidths)),
                (r += this.printTimeFields(t.timeFields)),
                (r += this.printKey(t.key)),
                (r += this.printSessionAttributes(t.attributes)),
                (r += this.printMediaDescription(t.mediaDescriptions)),
                r
              );
            }
            printVersion(t) {
              return "v=".concat(t).concat(this.eol);
            }
            printOrigin(t) {
              return "o="
                .concat(t.username, " ")
                .concat(t.sessId, " ")
                .concat(t.sessVersion, " ")
                .concat(t.nettype, " ")
                .concat(t.addrtype, " ")
                .concat(t.unicastAddress)
                .concat(this.eol);
            }
            printSessionName(t) {
              return t ? "s=".concat(t).concat(this.eol) : "";
            }
            printInformation(t) {
              return t ? "i=".concat(t).concat(this.eol) : "";
            }
            printUri(t) {
              return t ? "u=".concat(t).concat(this.eol) : "";
            }
            printEmail(t) {
              let e = "";
              for (const r of t) e += "e=".concat(r).concat(this.eol);
              return e;
            }
            printPhone(t) {
              let e = "";
              for (const r of t) e += "e=".concat(r).concat(this.eol);
              return e;
            }
            printConnection(t) {
              return t
                ? "c="
                    .concat(t.nettype, " ")
                    .concat(t.addrtype, " ")
                    .concat(t.address)
                    .concat(this.eol)
                : "";
            }
            printBandwidth(t) {
              let e = "";
              for (const r of t)
                e += "b="
                  .concat(r.bwtype, ":")
                  .concat(r.bandwidth)
                  .concat(this.eol);
              return e;
            }
            printTimeFields(t) {
              let e = "";
              for (const r of t) {
                e += "t="
                  .concat(r.time.startTime, " ")
                  .concat(r.time.startTime)
                  .concat(this.eol);
                for (const t of r.repeats)
                  e += "r="
                    .concat(t.repeatInterval, " ")
                    .concat(t.typedTimes.join(" "))
                    .concat(this.eol);
                r.zoneAdjustments &&
                  ((e += "z="),
                  (e += "z="
                    .concat(
                      r.zoneAdjustments
                        .map((t) =>
                          ""
                            .concat(t.time, " ")
                            .concat(t.back ? "-" : "", " ")
                            .concat(t.typedTime)
                        )
                        .join(" ")
                    )
                    .concat(this.eol)),
                  (e += this.eol));
              }
              return e;
            }
            printKey(t) {
              return t ? "k=".concat(t).concat(this.eol) : "";
            }
            printAttributes(t) {
              let e = "";
              for (const r of t)
                e += "a="
                  .concat(r.attField)
                  .concat(r.attValue ? ":".concat(r.attValue) : "")
                  .concat(this.eol);
              return e;
            }
            printMediaDescription(t) {
              let e = "";
              for (const r of t)
                (e += this.printMedia(r.media)),
                  (e += this.printInformation(r.information)),
                  (e += this.printConnections(r.connections)),
                  (e += this.printBandwidth(r.bandwidths)),
                  (e += this.printKey(r.key)),
                  (e += this.printMediaAttributes(r));
              return e;
            }
            printConnections(t) {
              let e = "";
              for (const r of t) e += this.printConnection(r);
              return e;
            }
            printMedia(t) {
              return "m="
                .concat(t.mediaType, " ")
                .concat(t.port, " ")
                .concat(t.protos.join("/"), " ")
                .concat(t.fmts.join(" "))
                .concat(this.eol);
            }
            printSessionAttributes(t) {
              return new R(this.eol).print(t);
            }
            printMediaAttributes(t) {
              return new C(this.eol).print(t);
            }
          }
          class E {
            constructor(t) {
              M(this, "eol", void 0), (this.eol = t);
            }
            printIceUfrag(t) {
              return void 0 === t
                ? ""
                : "a=ice-ufrag:".concat(t).concat(this.eol);
            }
            printIcePwd(t) {
              return void 0 === t
                ? ""
                : "a=ice-pwd:".concat(t).concat(this.eol);
            }
            printIceOptions(t) {
              return void 0 === t
                ? ""
                : "a=ice-options:".concat(t.join(n)).concat(this.eol);
            }
            printFingerprints(t) {
              return t.length > 0
                ? t
                    .map((t) =>
                      "a=fingerprint:"
                        .concat(t.hashFunction)
                        .concat(n)
                        .concat(t.fingerprint)
                    )
                    .join(this.eol) + this.eol
                : "";
            }
            printExtmap(t) {
              return t
                .map((t) =>
                  "a=extmap:"
                    .concat(t.entry)
                    .concat(t.direction ? "/".concat(t.direction) : "")
                    .concat(n)
                    .concat(t.extensionName)
                    .concat(
                      t.extensionAttributes
                        ? "".concat(n).concat(t.extensionAttributes)
                        : ""
                    )
                    .concat(this.eol)
                )
                .join("");
            }
            printSetup(t) {
              return void 0 === t ? "" : "a=setup:".concat(t).concat(this.eol);
            }
            printUnrecognized(t) {
              return t
                .map((t) =>
                  "a="
                    .concat(t.attField)
                    .concat(t.attValue ? ":".concat(t.attValue) : "")
                    .concat(this.eol)
                )
                .join("");
            }
          }
          class R extends E {
            print(t) {
              let e = "";
              return (
                (e += this.printGroups(t.groups)),
                (e += this.printMsidSemantic(t.msidSemantic)),
                (e += this.printIceLite(t.iceLite)),
                (e += this.printIceUfrag(t.iceUfrag)),
                (e += this.printIcePwd(t.icePwd)),
                (e += this.printIceOptions(t.iceOptions)),
                (e += this.printFingerprints(t.fingerprints)),
                (e += this.printSetup(t.setup)),
                (e += this.printTlsId(t.tlsId)),
                (e += this.printIdentity(t.identities)),
                (e += this.printExtmap(t.extmaps)),
                (e += this.printUnrecognized(t.unrecognized)),
                e
              );
            }
            printGroups(t) {
              let e = "";
              return (
                t.length > 0 &&
                  (e += t
                    .map((t) =>
                      "a=group:"
                        .concat(t.semantic)
                        .concat(
                          t.identificationTag
                            .map((t) => "".concat(n).concat(t))
                            .join("")
                        )
                        .concat(this.eol)
                    )
                    .join("")),
                e
              );
            }
            printIceLite(t) {
              return void 0 === t ? "" : "a=ice-lite" + this.eol;
            }
            printTlsId(t) {
              return t ? "a=tls-id:".concat(t).concat(this.eol) : "";
            }
            printIdentity(t) {
              return 0 === t.length
                ? ""
                : t
                    .map((t) =>
                      "a=identity:".concat(t.assertionValue).concat(
                        t.extensions.map((t) =>
                          ""
                            .concat(n)
                            .concat(t.name)
                            .concat(t.value ? "=".concat(t.value) : "")
                        )
                      )
                    )
                    .join(this.eol) + this.eol;
            }
            printMsidSemantic(t) {
              if (!t) return "";
              let e = "a=msid-semantic:".concat(t.semantic);
              return (
                t.applyForAll
                  ? (e += "".concat(n, "*"))
                  : t.identifierList.length > 0 &&
                    (e += t.identifierList.map((t) => "".concat(n).concat(t))),
                e + this.eol
              );
            }
          }
          class C extends E {
            print(t) {
              const e = t.attributes;
              let r = "";
              return (
                (r += this.printRTCP(e.rtcp)),
                (r += this.printIceUfrag(e.iceUfrag)),
                (r += this.printIcePwd(e.icePwd)),
                (r += this.printIceOptions(e.iceOptions)),
                (r += this.printCandidates(e.candidates)),
                (r += this.printRemoteCandidatesList(e.remoteCandidatesList)),
                (r += this.printEndOfCandidates(e.endOfCandidates)),
                (r += this.printFingerprints(e.fingerprints)),
                (r += this.printSetup(e.setup)),
                (r += this.printMid(e.mid)),
                (r += this.printExtmap(e.extmaps)),
                (r += this.printRTPRelated(e)),
                (r += this.printPtime(e.ptime)),
                (r += this.printMaxPtime(e.maxPtime)),
                (r += this.printDirection(e.direction)),
                (r += this.printSSRCGroups(e.ssrcGroups)),
                (r += this.printSSRC(e.ssrcs)),
                (r += this.printRTCPMux(e.rtcpMux)),
                (r += this.printRTCPMuxOnly(e.rtcpMuxOnly)),
                (r += this.printRTCPRsize(e.rtcpRsize)),
                (r += this.printMSId(e.msids)),
                (r += this.printImageattr(e.imageattr)),
                (r += this.printRid(e.rids)),
                (r += this.printSimulcast(e.simulcast)),
                (r += this.printSCTPPort(e.sctpPort)),
                (r += this.printMaxMessageSize(e.maxMessageSize)),
                (r += this.printUnrecognized(e.unrecognized)),
                r
              );
            }
            printCandidates(t) {
              return t
                .map((t) =>
                  "a=candidate:"
                    .concat(t.foundation)
                    .concat(n)
                    .concat(t.componentId)
                    .concat(n)
                    .concat(t.transport)
                    .concat(n)
                    .concat(t.priority)
                    .concat(n)
                    .concat(t.connectionAddress)
                    .concat(n)
                    .concat(t.port)
                    .concat(n, "typ")
                    .concat(n)
                    .concat(t.type)
                    .concat(
                      t.relAddr
                        ? "".concat(n, "raddr").concat(n).concat(t.relAddr)
                        : ""
                    )
                    .concat(
                      t.relPort
                        ? "".concat(n, "rport").concat(n).concat(t.relPort)
                        : ""
                    )
                    .concat(
                      Object.keys(t.extension)
                        .map((e) =>
                          ""
                            .concat(n)
                            .concat(e)
                            .concat(n)
                            .concat(t.extension[e])
                        )
                        .join("")
                    )
                    .concat(this.eol)
                )
                .join("");
            }
            printRemoteCandidatesList(t) {
              return t
                .map((t) =>
                  "a=remote-candidates:".concat(t.join(n)).concat(this.eol)
                )
                .join("");
            }
            printEndOfCandidates(t) {
              return void 0 === t ? "" : "a=end-of-candidates" + this.eol;
            }
            printRTPRelated(t) {
              if (!t.payloads) return "";
              const e = t.payloads;
              let r = "";
              r += t.rtcpFeedbackWildcards
                .map((t) => this.printRTCPFeedback("*", t))
                .join("");
              for (const t of e)
                (r += this.printRtpMap(t.payloadType, t.rtpMap)),
                  (r += this.printFmtp(t.payloadType, t.fmtp)),
                  (r += t.rtcpFeedbacks
                    .map((e) => this.printRTCPFeedback(t.payloadType, e))
                    .join(""));
              return r;
            }
            printFmtp(t, e) {
              if (!e) return "";
              const r = Object.keys(e.parameters);
              return 1 === r.length && null === e.parameters[r[0]]
                ? "a=fmtp:".concat(t).concat(n).concat(r[0]).concat(this.eol)
                : "a=fmtp:"
                    .concat(t)
                    .concat(n)
                    .concat(
                      Object.keys(e.parameters)
                        .map((t) => "".concat(t, "=").concat(e.parameters[t]))
                        .join(";")
                    )
                    .concat(this.eol);
            }
            printRtpMap(t, e) {
              return e
                ? "a=rtpmap:"
                    .concat(t)
                    .concat(n)
                    .concat(e.encodingName, "/")
                    .concat(e.clockRate)
                    .concat(
                      e.encodingParameters
                        ? "/".concat(e.encodingParameters)
                        : ""
                    )
                    .concat(this.eol)
                : "";
            }
            printRTCPFeedback(t, e) {
              let r = "a=rtcp-fb:".concat(t).concat(n),
                s = e;
              switch (s.type) {
                case "trr-int":
                  r += "ttr-int".concat(n).concat(s.interval);
                  break;
                case "ack":
                case "nack":
                default:
                  (s = s),
                    (r += "".concat(s.type)),
                    s.parameter &&
                      ((r += "".concat(n).concat(s.parameter)),
                      s.additional && (r += "".concat(n).concat(s.additional)));
              }
              return r + this.eol;
            }
            printPtime(t) {
              return void 0 === t ? "" : "a=ptime:".concat(t).concat(this.eol);
            }
            printMaxPtime(t) {
              return void 0 === t
                ? ""
                : "a=maxptime:".concat(t).concat(this.eol);
            }
            printDirection(t) {
              return void 0 === t ? "" : "a=".concat(t).concat(this.eol);
            }
            printSSRC(t) {
              return t
                .map((t) =>
                  Object.keys(t.attributes)
                    .map((e) =>
                      "a=ssrc:"
                        .concat(t.ssrcId.toString(10))
                        .concat(n)
                        .concat(e)
                        .concat(
                          t.attributes[e] ? ":".concat(t.attributes[e]) : ""
                        )
                        .concat(this.eol)
                    )
                    .join("")
                )
                .join("");
            }
            printRTCPMux(t) {
              return void 0 === t ? "" : "a=rtcp-mux".concat(this.eol);
            }
            printRTCPMuxOnly(t) {
              return void 0 === t ? "" : "a=rtcp-mux-only".concat(this.eol);
            }
            printRTCPRsize(t) {
              return void 0 === t ? "" : "a=rtcp-rsize".concat(this.eol);
            }
            printRTCP(t) {
              if (void 0 === t) return "";
              let e = "a=rtcp:".concat(t.port);
              return (
                t.netType && (e += "".concat(n).concat(t.netType)),
                t.addressType && (e += "".concat(n).concat(t.addressType)),
                t.address && (e += "".concat(n).concat(t.address)),
                e + this.eol
              );
            }
            printMSId(t) {
              return t
                .map((t) =>
                  "a=msid:"
                    .concat(t.id)
                    .concat(t.appdata ? "".concat(n).concat(t.appdata) : "")
                    .concat(this.eol)
                )
                .join("");
            }
            printImageattr(t) {
              return t
                .map((t) => "a=imageattr:".concat(t).concat(this.eol))
                .join("");
            }
            printRid(t) {
              return t
                .map((t) => {
                  let e = "a=rid:".concat(t.id).concat(n).concat(t.direction);
                  return (
                    t.payloads &&
                      (e += "".concat(n, "pt=").concat(t.payloads.join(","))),
                    t.params.length > 0 &&
                      (e += ""
                        .concat(n)
                        .concat(
                          t.params
                            .map((t) =>
                              "depend" === t.type
                                ? "depend=".concat(t.rids.join(","))
                                : "".concat(t.type, "=").concat(t.val)
                            )
                            .join(";")
                        )),
                    e + this.eol
                  );
                })
                .join("");
            }
            printSimulcast(t) {
              return void 0 === t
                ? ""
                : "a=simulcast:".concat(t).concat(this.eol);
            }
            printSCTPPort(t) {
              return void 0 === t
                ? ""
                : "a=sctp-port:".concat(t).concat(this.eol);
            }
            printMaxMessageSize(t) {
              return void 0 === t
                ? ""
                : "a=max-message-size:".concat(t).concat(this.eol);
            }
            printMid(t) {
              return void 0 === t ? "" : "a=mid:".concat(t).concat(this.eol);
            }
            printSSRCGroups(t) {
              return t
                .map((t) =>
                  "a=ssrc-group:"
                    .concat(t.semantic)
                    .concat(
                      t.ssrcIds
                        .map((t) => "".concat(n).concat(t.toString(10)))
                        .join("")
                    )
                    .concat(this.eol)
                )
                .join("");
            }
          }
          function P(t) {
            return new T().parse(t);
          }
          function A(t, e) {
            return new v().print(t, e);
          }
        },
      },
      e = {};
    function r(s) {
      if (e[s]) return e[s].exports;
      var i = (e[s] = { exports: {} });
      return t[s](i, i.exports, r), i.exports;
    }
    return (
      (r.d = (t, e) => {
        for (var s in e)
          r.o(e, s) &&
            !r.o(t, s) &&
            Object.defineProperty(t, s, { enumerable: !0, get: e[s] });
      }),
      (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
      (r.r = (t) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      r(8)
    );
  })();
});
//# sourceMappingURL=index.js.map
