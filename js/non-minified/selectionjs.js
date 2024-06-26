!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? (module.exports = e()) : "function" == typeof define && define.amd ? define(e) : ((t = "undefined" != typeof globalThis ? globalThis : t || self).SelectionArea = e());
})(this, function () {
    "use strict";
    const t = (t, e = "px") => ("number" == typeof t ? t + e : t);
    function e({ style: e }, s, i) {
        if ("object" == typeof s) for (const [i, o] of Object.entries(s)) e[i] = t(o);
        else void 0 !== i && (e[s] = t(i));
    }
    function s(t) {
        return (e, s, i, o = {}) => {
            e instanceof HTMLCollection || e instanceof NodeList ? (e = Array.from(e)) : Array.isArray(e) || (e = [e]), Array.isArray(s) || (s = [s]);
            for (const n of e) for (const e of s) n[t](e, i, { capture: !1, ...o });
            return [e, s, i, o];
        };
    }
    const i = s("addEventListener"),
        o = s("removeEventListener"),
        n = (t) => {
            const e = (t.touches && t.touches[0]) || t;
            return { tap: e, x: e.clientX, y: e.clientY, target: e.target };
        };
    function h(t) {
        let e = t.path || (t.composedPath && t.composedPath());
        if (e) return e;
        let s = t.target.parentElement;
        for (e = [t.target, s]; (s = s.parentElement); ) e.push(s);
        return e.push(document, window), e;
    }
    function r(t, e, s = "touch") {
        switch (s) {
            case "center": {
                const s = e.left + e.width / 2,
                    i = e.top + e.height / 2;
                return s >= t.left && s <= t.right && i >= t.top && i <= t.bottom;
            }
            case "cover":
                return e.left >= t.left && e.top >= t.top && e.right <= t.right && e.bottom <= t.bottom;
            case "touch":
                return t.right >= e.left && t.left <= e.right && t.bottom >= e.top && t.top <= e.bottom;
            default:
                throw new Error(`Unkown intersection mode: ${s}`);
        }
    }
    function c(t, e) {
        const s = t.indexOf(e);
        ~s && t.splice(s, 1);
    }
    function l(t, e = document) {
        const s = Array.isArray(t) ? t : [t],
            i = [];
        for (let t = 0, o = s.length; t < o; t++) {
            const o = s[t];
            "string" == typeof o ? i.push(...Array.from(e.querySelectorAll(o))) : o instanceof HTMLElement && i.push(o);
        }
        return i;
    }
    const a = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const { abs: d, max: u, min: p, ceil: f } = Math;
    class SelectionArea extends class {
        constructor() {
            (this.t = new Map()), (this.on = this.addEventListener), (this.off = this.removeEventListener), (this.emit = this.dispatchEvent);
        }
        addEventListener(t, e) {
            const s = this.t.get(t) || new Set();
            return this.t.set(t, s), s.add(e), this;
        }
        removeEventListener(t, e) {
            return this.t.get(t)?.delete(e), this;
        }
        dispatchEvent(t, ...e) {
            let s = !0;
            for (const i of this.t.get(t) || []) s = !1 !== i(...e) && s;
            return s;
        }
        unbindAllListeners() {
            this.t.clear();
        }
    } {
        constructor(t) {
            super(),
                (this.i = { touched: [], stored: [], selected: [], changed: { added: [], removed: [] } }),
                (this.o = []),
                (this.h = new DOMRect()),
                (this.l = { y1: 0, x2: 0, y2: 0, x1: 0 }),
                (this.u = !0),
                (this.p = !0),
                (this.m = { x: 0, y: 0 }),
                (this.v = { x: 0, y: 0 }),
                (this.disable = this.g.bind(this, !1)),
                (this.enable = this.g),
                (this._ = Object.assign(
                    {
                        class: "selection-area",
                        document: window.document,
                        intersect: "touch",
                        startThreshold: 10,
                        singleClick: !0,
                        allowTouch: !0,
                        overlap: "invert",
                        selectables: [],
                        singleTap: { allow: !0, intersect: "native" },
                        scrolling: { speedDivider: 10, manualSpeed: 750 },
                        startareas: ["html"],
                        boundaries: ["html"],
                        container: "body",
                    },
                    t
                ));
            for (const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) "function" == typeof this[t] && (this[t] = this[t].bind(this));
            const { document: s } = this._;
            (this.S = s.createElement("div")),
                (this.T = s.createElement("div")),
                this.T.appendChild(this.S),
                this.S.classList.add(this._.class),
                e(this.S, { willChange: "top, left, bottom, right, width, height", top: 0, left: 0, position: "fixed" }),
                e(this.T, { overflow: "hidden", position: "fixed", transform: "translate3d(0, 0, 0)", pointerEvents: "none", zIndex: "1" }),
                this.enable();
        }
        g(t = !0) {
            const { document: e, allowTouch: s } = this._,
                n = t ? i : o;
            n(e, "mousedown", this.A), s && n(e, "touchstart", this.A, { passive: !1 });
        }
        A(t, e = !1) {
            const { x: s, y: o, target: c } = n(t),
                { _: a } = this,
                { document: d } = this._,
                u = c.getBoundingClientRect(),
                p = l(a.startareas, a.document),
                f = l(a.boundaries, a.document);
            this.L = f.find((t) => r(t.getBoundingClientRect(), u));
            const m = h(t);
            if (!this.L || !p.find((t) => m.includes(t)) || !f.find((t) => m.includes(t))) return;
            if (!e && !1 === this.k("beforestart", t)) return;
            this.l = { x1: s, y1: o, x2: 0, y2: 0 };
            const v = d.scrollingElement || d.body;
            (this.v = { x: v.scrollLeft, y: v.scrollTop }), (this.u = !0), this.clearSelection(!1), i(d, ["touchmove", "mousemove"], this.j, { passive: !1 }), i(d, ["mouseup", "touchcancel", "touchend"], this.M), i(d, "scroll", this.O);
        }
        R(t) {
            const { intersect: e } = this._.singleTap,
                s = n(t);
            let i = null;
            if ("native" === e) i = s.target;
            else if ("touch" === e) {
                this.resolveSelectables();
                const { x: t, y: e } = s;
                i = this.o.find((s) => {
                    const { right: i, left: o, top: n, bottom: h } = s.getBoundingClientRect();
                    return t < i && t > o && e < h && e > n;
                });
            }
            if (!i) return;
            for (this.resolveSelectables(); !this.o.includes(i); ) {
                if (!i.parentElement) return;
                i = i.parentElement;
            }
            const { stored: o } = this.i;
            if ((this.k("start", t), t.shiftKey && o.length)) {
                const t = o[o.length - 1],
                    [e, s] = 4 & t.compareDocumentPosition(i) ? [i, t] : [t, i],
                    n = [...this.o.filter((t) => 4 & t.compareDocumentPosition(e) && 2 & t.compareDocumentPosition(s)), i, e, s];
                this.select(n);
            } else o.includes(i) && (1 === o.length || t.ctrlKey) ? this.deselect(i) : this.select(i);
            this.k("stop", t);
        }
        j(t) {
            const { startThreshold: s, container: h, document: r, allowTouch: c } = this._,
                { x1: u, y1: p } = this.l,
                { x: f, y: m } = n(t),
                v = typeof s;
            (("number" === v && d(f + m - (u + p)) >= s) || ("object" === v && d(f - u) >= s.x) || d(m - p) >= s.y) &&
                (o(r, ["mousemove", "touchmove"], this.j, { passive: !1 }),
                i(r, ["mousemove", "touchmove"], this.$, { passive: !1 }),
                e(this.S, "display", "block"),
                l(h, r)[0].appendChild(this.T),
                this.resolveSelectables(),
                (this.u = !1),
                (this.C = this.L.getBoundingClientRect()),
                (this.p = this.L.scrollHeight !== this.L.clientHeight || this.L.scrollWidth !== this.L.clientWidth),
                this.p && (i(r, "wheel", this.D, { passive: !1 }), (this.o = this.o.filter((t) => this.L.contains(t)))),
                this.H(),
                this.k("start", t),
                this.$(t)),
                c && a && t.preventDefault();
        }
        H() {
            const { T: t, L: s, S: i } = this,
                o = (this.C = s.getBoundingClientRect());
            this.p
                ? (e(t, { top: o.top, left: o.left, width: o.width, height: o.height }), e(i, { marginTop: -o.top, marginLeft: -o.left }))
                : (e(t, { top: 0, left: 0, width: "100%", height: "100%" }), e(i, { marginTop: 0, marginLeft: 0 }));
        }
        $(t) {
            const { x: e, y: s } = n(t),
                { m: i, l: o, _: h } = this,
                { allowTouch: r } = h,
                { speedDivider: c } = h.scrolling,
                l = this.L;
            if (((o.x2 = e), (o.y2 = s), this.p && (i.y || i.x))) {
                const e = () => {
                    if (!i.x && !i.y) return;
                    const { scrollTop: s, scrollLeft: n } = l;
                    i.y && ((l.scrollTop += f(i.y / c)), (o.y1 -= l.scrollTop - s)), i.x && ((l.scrollLeft += f(i.x / c)), (o.x1 -= l.scrollLeft - n)), this.q(), this.F(), this.k("move", t), this.W(), requestAnimationFrame(e);
                };
                requestAnimationFrame(e);
            } else this.q(), this.F(), this.k("move", t), this.W();
            r && a && t.preventDefault();
        }
        O() {
            const {
                    v: t,
                    _: { document: e },
                } = this,
                { scrollTop: s, scrollLeft: i } = e.scrollingElement || e.body;
            (this.l.x1 += t.x - i), (this.l.y1 += t.y - s), (t.x = i), (t.y = s), this.H(), this.q(), this.F(), this.k("move", null), this.W();
        }
        D(t) {
            const { manualSpeed: e } = this._.scrolling,
                s = t.deltaY ? (t.deltaY > 0 ? 1 : -1) : 0,
                i = t.deltaX ? (t.deltaX > 0 ? 1 : -1) : 0;
            (this.m.y += s * e), (this.m.x += i * e), this.$(t), t.preventDefault();
        }
        q() {
            const { m: t, l: e, h: s, L: i, C: o } = this,
                { scrollTop: n, scrollHeight: h, clientHeight: r, scrollLeft: c, scrollWidth: l, clientWidth: a } = i,
                f = o;
            let { x1: m, y1: v, x2: g, y2: y } = e;
            g < f.left ? ((t.x = c ? -d(f.left - g) : 0), (g = f.left)) : g > f.right ? ((t.x = l - c - a ? d(f.left + f.width - g) : 0), (g = f.right)) : (t.x = 0),
                y < f.top ? ((t.y = n ? -d(f.top - y) : 0), (y = f.top)) : y > f.bottom ? ((t.y = h - n - r ? d(f.top + f.height - y) : 0), (y = f.bottom)) : (t.y = 0);
            const _ = p(m, g),
                w = p(v, y),
                x = u(m, g),
                b = u(v, y);
            (s.x = _), (s.y = w), (s.width = x - _), (s.height = b - w);
        }
        W() {
            const { x: t, y: e, width: s, height: i } = this.h,
                { style: o } = this.S;
            (o.left = `${t}px`), (o.top = `${e}px`), (o.width = `${s}px`), (o.height = `${i}px`);
        }
        M(t, s) {
            const { document: i, singleTap: n } = this._,
                { u: h } = this;
            o(i, ["mousemove", "touchmove"], this.j),
                o(i, ["touchmove", "mousemove"], this.$),
                o(i, ["mouseup", "touchcancel", "touchend"], this.M),
                o(i, "scroll", this.O),
                t && h && n.allow ? this.R(t) : h || s || (this.F(), this.k("stop", t)),
                (this.m.x = 0),
                (this.m.y = 0),
                this.p && o(i, "wheel", this.D, { passive: !0 }),
                this.T.remove(),
                e(this.S, "display", "none");
        }
        F() {
            const { o: t, _: e, i: s, h: i } = this,
                { stored: o, selected: n, touched: h } = s,
                { intersect: c, overlap: l } = e,
                a = [],
                d = [],
                u = [];
            for (let e = 0; e < t.length; e++) {
                const s = t[e];
                if (r(i, s.getBoundingClientRect(), c)) {
                    if (n.includes(s)) o.includes(s) && !h.includes(s) && h.push(s);
                    else {
                        if ("invert" === l && o.includes(s)) {
                            u.push(s);
                            continue;
                        }
                        d.push(s);
                    }
                    a.push(s);
                }
            }
            "invert" === l && d.push(...o.filter((t) => !n.includes(t)));
            for (let t = 0; t < n.length; t++) {
                const e = n[t];
                a.includes(e) || ("keep" === l && o.includes(e)) || u.push(e);
            }
            (s.selected = a), (s.changed = { added: d, removed: u });
        }
        k(t, e) {
            return this.emit(t, { event: e, store: this.i });
        }
        trigger(t, e = !0) {
            this.A(t, e);
        }
        resolveSelectables() {
            this.o = l(this._.selectables, this._.document);
        }
        keepSelection() {
            const { _: t, i: e } = this,
                { selected: s, changed: i, touched: o, stored: n } = e,
                h = s.filter((t) => !n.includes(t));
            switch (t.overlap) {
                case "drop":
                    e.stored = h.concat(n.filter((t) => !o.includes(t)));
                    break;
                case "invert":
                    e.stored = h.concat(n.filter((t) => !i.removed.includes(t)));
                    break;
                case "keep":
                    e.stored = n.concat(s.filter((t) => !n.includes(t)));
            }
        }
        clearSelection(t = !0) {
            this.i = { stored: t ? [] : this.i.stored, selected: [], touched: [], changed: { added: [], removed: [] } };
        }
        getSelection() {
            return this.i.stored;
        }
        getSelectionArea() {
            return this.S;
        }
        cancel(t = !1) {
            this.M(null, !t);
        }
        destroy() {
            this.cancel(), this.disable(), this.T.remove(), super.unbindAllListeners();
        }
        select(t, e = !1) {
            const { changed: s, selected: i, stored: o } = this.i,
                n = l(t, this._.document).filter((t) => !i.includes(t) && !o.includes(t));
            return i.push(...n), s.added.push(...n), !e && this.k("move", null), n;
        }
        deselect(t, e = !1) {
            const { selected: s, stored: i, changed: o } = this.i;
            return !(!s.includes(t) && !i.includes(t)) && (o.removed.push(t), c(i, t), c(s, t), !e && this.k("move", null), !0);
        }
    }
    return (SelectionArea.version = "2.1.1"), SelectionArea;
});
