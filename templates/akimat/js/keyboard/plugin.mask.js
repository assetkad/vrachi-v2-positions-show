/*!
 *
 *   simple-keyboard-input-mask v3.0.388
 *   https://github.com/hodgef/simple-keyboard-input-mask
 *
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef)
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
!(function (t, e) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = e())
        : "function" == typeof define && define.amd
        ? define([], e)
        : "object" == typeof exports
            ? (exports.SimpleKeyboardInputMask = e())
            : (t.SimpleKeyboardInputMask = e());
})(window, function () {
    return (function (t) {
        var e = {};
        function n(o) {
            if (e[o]) return e[o].exports;
            var r = (e[o] = { i: o, l: !1, exports: {} });
            return t[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
        }
        return (
            (n.m = t),
                (n.c = e),
                (n.d = function (t, e, o) {
                    n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
                }),
                (n.r = function (t) {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
                }),
                (n.t = function (t, e) {
                    if ((1 & e && (t = n(t)), 8 & e)) return t;
                    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
                    var o = Object.create(null);
                    if ((n.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t))
                        for (var r in t)
                            n.d(
                                o,
                                r,
                                function (e) {
                                    return t[e];
                                }.bind(null, r)
                            );
                    return o;
                }),
                (n.n = function (t) {
                    var e =
                        t && t.__esModule
                            ? function () {
                                return t.default;
                            }
                            : function () {
                                return t;
                            };
                    return n.d(e, "a", e), e;
                }),
                (n.o = function (t, e) {
                    return Object.prototype.hasOwnProperty.call(t, e);
                }),
                (n.p = ""),
                n((n.s = 0))
        );
    })([
        function (t, e, n) {
            "use strict";
            function o(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(t);
                    e &&
                    (o = o.filter(function (e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable;
                    })),
                        n.push.apply(n, o);
                }
                return n;
            }
            function r(t) {
                for (var e, n = 1; n < arguments.length; n++)
                    (e = null == arguments[n] ? {} : arguments[n]),
                        n % 2
                            ? o(Object(e), !0).forEach(function (n) {
                                s(t, n, e[n]);
                            })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e))
                            : o(Object(e)).forEach(function (n) {
                                Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
                            });
                return t;
            }
            function i(t) {
                return (i =
                    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                        ? function (t) {
                            return typeof t;
                        }
                        : function (t) {
                            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                        })(t);
            }
            function u(t, e) {
                for (var n, o = 0; o < e.length; o++) ((n = e[o]).enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
            }
            function a(t, e, n) {
                return e && u(t.prototype, e), n && u(t, n), Object.defineProperty(t, "prototype", { writable: !1 }), t;
            }
            function s(t, e, n) {
                return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : (t[e] = n), t;
            }
            n.r(e);
            var p = a(function t() {
                (function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
                })(this, t),
                    s(this, "init", function (t) {
                        t.registerModule("inputMask", function (e) {
                            return (
                                (e.inputClass = t.options.inputMaskTargetClass || "input"),
                                    (e.currentButton = ""),
                                    (e.fn = {}),
                                    t.options.inputMask
                                        ? (!t.options.disableCaretPositioning &&
                                        (console.warn(
                                            "SimpleKeyboardInputMask: Caret placement is not supported in this release. Option disableCaretPositioning will be enabled. To disable this warning, set option disableCaretPositioning to true."
                                        ),
                                            (t.options.disableCaretPositioning = !0)),
                                            (e.isMaskingEnabled = function () {
                                                var e = t.options.inputMask;
                                                return !!("object" === i(e) && e[t.options.inputName] && e[t.options.inputName].mask && e[t.options.inputName].regex);
                                            }),
                                            (e.getInputMaskStr = function () {
                                                var n = t.options,
                                                    o = n.inputMask,
                                                    r = n.inputName;
                                                return e.isMaskingEnabled() ? o[r].mask : "";
                                            }),
                                            (e.getInputMaskRegex = function () {
                                                var n = t.options,
                                                    o = n.inputMask,
                                                    r = n.inputName;
                                                return e.isMaskingEnabled() ? o[r].regex : "";
                                            }),
                                            (e.getMaskedInput = function (n, o, r) {
                                                var i = e.autoAddSymbol(r, o, n);
                                                (o = i.input || o), (r = i.caretPos || r);
                                                var u = e.fn.getUpdatedInput(n, o, r, r, !1);
                                                return e.validateInputProposal(u, r) ? e.fn.getUpdatedInput(n, o, r, r, !0) : t.getInput();
                                            }),
                                            (e.validateInputProposal = function (t, n) {
                                                var o = e.getInputMaskStr();
                                                if (t && "string" == typeof t && o && "string" == typeof t) {
                                                    var r = t.split("");
                                                    return e.isCharAllowed(r[n || 0]);
                                                }
                                                return !1;
                                            }),
                                            (e.isCharAllowed = function (t) {
                                                return t && !!t.match(e.getInputMaskRegex());
                                            }),
                                            (e.isBksp = function (t) {
                                                return "{bksp}" === t || "{backspace}" === t;
                                            }),
                                            (e.autoAddSymbol = function (n, o, r) {
                                                var i = e.getInputMaskStr();
                                                n = o.trim() || n ? o.length : 0;
                                                var u = i.split("");
                                                return void 0 !== u[n] && null === u[n].match(e.getInputMaskRegex()) ? ((o = t.utilities.addStringAt(o, u[n], n, n, !0)), e.autoAddSymbol(n++, o, r)) : { input: o, caretPos: n };
                                            }),
                                            (e.onKeyPressed = function (n) {
                                                if (!e.isMaskingEnabled()) return !1;
                                                var o = n.target.classList.contains(e.inputClass);
                                                if (!o) return !1;
                                                t.options.debug && console.log("isInputTarget", o), t.options.debug && console.log("input", n);
                                                var r = t.physicalKeyboard.getSimpleKeyboardLayoutKey(n);
                                                r && r.includes("numpad") && (r = r.replace("numpad", ""));
                                                var i = t.getButtonElement(r) || t.getButtonElement("{".concat(r, "}"));
                                                if (i) {
                                                    var u = i.classList.contains("hg-functionBtn"),
                                                        a = u ? "{".concat(r, "}") : r;
                                                    if (u && (r.includes("shift") || r.includes("caps"))) return !1;
                                                    t.options.debug && console.log("layoutKeyFormatted", a), t.handleButtonClicked(a), (n.target.value = ""), (n.target.value = t.getInput());
                                                }
                                                t.options.debug && console.log(r, i);
                                            }),
                                            (e.initInputHandling = function () {
                                                document.addEventListener("keyup", e.onKeyPressed);
                                            }),
                                            (e.destroy = function () {
                                                document.removeEventListener("keyup", e.onKeyPressed);
                                            }),
                                            (e.fn.getUpdatedInput = t.utilities.getUpdatedInput),
                                            (t.utilities.getUpdatedInput = function (n, o, i, u) {
                                                var a = !!(4 < arguments.length && void 0 !== arguments[4]) && arguments[4];
                                                if (e.isMaskingEnabled() && !e.isBksp(n)) {
                                                    var p = t.options,
                                                        l = p.maxLength,
                                                        c = void 0 === l ? {} : l,
                                                        d = p.inputName;
                                                    t.setOptions({ maxLength: r(r({}, c), {}, s({}, d, e.getInputMaskStr().length)) });
                                                    var f = e.getMaskedInput(n, o, i);
                                                    return f;
                                                }
                                                return e.fn.getUpdatedInput(n, o, i, u, a);
                                            }),
                                            void (t.options.inputMaskPhysicalKeyboardHandling && e.initInputHandling()))
                                        : (console.warn("SimpleKeyboardInputMask: You must provide the inputMask option with your input mask"), !1)
                            );
                        });
                    });
            });
            e.default = p;
        },
    ]);
});
//# sourceMappingURL=index.js.map
