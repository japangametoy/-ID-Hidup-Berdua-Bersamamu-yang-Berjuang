//=============================================================================
// MeikohanaVirtualPad.js  v3.0
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Virtual pad ala JoiPlay: analog + tombol (bisa remap key), keyboard QWERTY, hide, edit & resize, layout disimpan. v3.0
 * @author Meikohana
 *
 * @param showOnDesktop
 * @text Tampilkan di desktop
 * @type boolean
 * @default false
 *
 * @param opacity
 * @text Opacity kontrol (0-1)
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @help
 * Mirip VirtualGamepadView punya JoiPlay tapi murni JS (mandiri).
 *  - Analog kiri 8 arah (gerak) -> set Input langsung.
 *  - Tombol aksi -> nembak KeyboardEvent asli, jadi bisa di-REMAP ke key apa
 *    aja (Z/X/Shift, panah, A-Z, 0-9, F1-F12, dll).
 *  - Keyboard QWERTY penuh (tombol "KB" pojok kanan atas).
 *  - HIDE: sembunyiin/munculin pad. EDIT: geser + resize + remap tombol.
 *  - Long-press EDIT = reset layout.
 *  - Posisi, ukuran, key mapping, status hide DISIMPAN otomatis (localStorage).
 *
 * Cara remap: tap EDIT -> tap handle kuning di pojok kiri-atas tombol ->
 * pilih key dari daftar. Tap DONE kalau udah.
 */

(() => {
    "use strict";

    const PLUGIN = "MeikohanaVirtualPad";
    const P = PluginManager.parameters(PLUGIN);
    const SHOW_ON_DESKTOP = P.showOnDesktop === "true";
    const OPACITY = Number(P.opacity || 0.5);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !SHOW_ON_DESKTOP) return;

    const DIRS = ["up", "down", "left", "right"];
    const LS_LAYOUT = PLUGIN + "_layout";
    const LS_HIDDEN = PLUGIN + "_hidden";

    // --- Persistence ----------------------------------------------------------
    function loadLayout() { try { return JSON.parse(localStorage.getItem(LS_LAYOUT)) || {}; } catch (e) { return {}; } }
    function saveLayout() { try { localStorage.setItem(LS_LAYOUT, JSON.stringify(layout)); } catch (e) {} }
    function loadHidden() { try { return localStorage.getItem(LS_HIDDEN) === "1"; } catch (e) { return false; } }
    function saveHidden(v) { try { localStorage.setItem(LS_HIDDEN, v ? "1" : "0"); } catch (e) {} }

    let layout = loadLayout();   // { name: {left, top, size, keyId} }
    let hidden = loadHidden();
    let EDIT = false;

    // --- Katalog key (buat remap + keyboard) ----------------------------------
    function kd(id, label, key, code, keyCode) { return { id, label, key, code, keyCode }; }
    const KEY_CATALOG = [
        kd("ok", "OK", "z", "KeyZ", 90),
        kd("cancel", "Cancel", "x", "KeyX", 88),
        kd("dash", "Dash", "Shift", "ShiftLeft", 16),
        kd("menu", "Menu", "Escape", "Escape", 27),
        kd("pageup", "PgUp", "q", "KeyQ", 81),
        kd("pagedown", "PgDn", "w", "KeyW", 87),
        kd("enter", "Enter", "Enter", "Enter", 13),
        kd("space", "Space", " ", "Space", 32),
        kd("tab", "Tab", "Tab", "Tab", 9),
        kd("ctrl", "Ctrl", "Control", "ControlLeft", 17),
        kd("up", "Up", "ArrowUp", "ArrowUp", 38),
        kd("down", "Down", "ArrowDown", "ArrowDown", 40),
        kd("left", "Left", "ArrowLeft", "ArrowLeft", 37),
        kd("right", "Right", "ArrowRight", "ArrowRight", 39),
    ];
    for (let i = 65; i <= 90; i++) { const ch = String.fromCharCode(i); KEY_CATALOG.push(kd("key" + ch, ch, ch.toLowerCase(), "Key" + ch, i)); }
    for (let d = 0; d <= 9; d++) { KEY_CATALOG.push(kd("num" + d, String(d), String(d), "Digit" + d, 48 + d)); }
    for (let f = 1; f <= 12; f++) { KEY_CATALOG.push(kd("f" + f, "F" + f, "F" + f, "F" + f, 111 + f)); }

    function catalog(id) { return KEY_CATALOG.find((k) => k.id === id) || KEY_CATALOG[0]; }

    // --- Dispatch KeyboardEvent asli ------------------------------------------
    function fireKey(type, def, shift) {
        const ev = new KeyboardEvent(type, {
            key: def.key, code: def.code, shiftKey: !!shift,
            bubbles: true, cancelable: true,
        });
        try {
            Object.defineProperty(ev, "keyCode", { get: () => def.keyCode });
            Object.defineProperty(ev, "which", { get: () => def.keyCode });
        } catch (e) {}
        document.dispatchEvent(ev);
    }

    // --- Definisi tombol aksi (default) ---------------------------------------
    const BUTTON_LAYOUT = [
        { name: "A", keyId: "ok", size: 78 },
        { name: "B", keyId: "cancel", size: 78 },
        { name: "DASH", keyId: "dash", size: 60 },
        // contoh tambahan:
        // { name: "L", keyId: "pageup", size: 56 },
        // { name: "R", keyId: "pagedown", size: 56 },
    ];
    const STICK_DEFAULT = 160;

    function defaultPos(name) {
        const W = window.innerWidth, H = window.innerHeight;
        switch (name) {
            case "_stick": return { left: 24, top: H - STICK_DEFAULT - 24, size: STICK_DEFAULT };
            case "A": return { left: W - 78 - 30, top: H - 78 - 40, size: 78 };
            case "B": return { left: W - 78 - 120, top: H - 78 - 110, size: 78 };
            case "DASH": return { left: W - 60 - 130, top: H - 60 - 16, size: 60 };
            case "L": return { left: W - 56 - 220, top: H - 56 - 130, size: 56 };
            case "R": return { left: W - 56 - 30, top: H - 56 - 200, size: 56 };
            default: return { left: W / 2, top: H / 2, size: 70 };
        }
    }
    function getPos(name) {
        const d = defaultPos(name), s = layout[name] || {};
        return { left: s.left ?? d.left, top: s.top ?? d.top, size: s.size ?? d.size };
    }
    function setPos(name, pos) { layout[name] = Object.assign(layout[name] || {}, pos); saveLayout(); }
    function getKeyId(name, def) { return (layout[name] && layout[name].keyId) || def; }
    function setKeyId(name, keyId) { layout[name] = Object.assign(layout[name] || {}, { keyId }); saveLayout(); }

    // --- Input helpers (analog) -----------------------------------------------
    function clearDirs() { DIRS.forEach((d) => (Input._currentState[d] = false)); }
    function applyDirection(dx, dy, dead) {
        clearDirs();
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < dead) return;
        let ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (ang < 0) ang += 360;
        if (ang >= 337.5 || ang < 22.5) Input._currentState.right = true;
        else if (ang < 67.5) { Input._currentState.right = true; Input._currentState.down = true; }
        else if (ang < 112.5) Input._currentState.down = true;
        else if (ang < 157.5) { Input._currentState.down = true; Input._currentState.left = true; }
        else if (ang < 202.5) Input._currentState.left = true;
        else if (ang < 247.5) { Input._currentState.left = true; Input._currentState.up = true; }
        else if (ang < 292.5) Input._currentState.up = true;
        else { Input._currentState.up = true; Input._currentState.right = true; }
    }

    // --- DOM utils ------------------------------------------------------------
    let root, controls = [];
    function el(tag, css) { const e = document.createElement(tag); Object.assign(e.style, css); return e; }
    function pickTouch(e, id) {
        if (!e.changedTouches) return e;
        const list = e.touches.length ? e.touches : e.changedTouches;
        for (const t of list) if (t.identifier === id) return t;
        return null;
    }
    // tap + long-press reliable di touch & mouse (stopPropagation biar map nggak ikut kepencet, + feedback tekan)
    function bindTap(elem, onTap, onLongPress) {
        let timer = null, longFired = false, touched = false;
        const press = () => { elem.style.filter = "brightness(1.7)"; };
        const unpress = () => { elem.style.filter = ""; };
        const startLP = () => { longFired = false; if (onLongPress) timer = setTimeout(() => { longFired = true; onLongPress(); }, 700); };
        const clearLP = () => { if (timer) { clearTimeout(timer); timer = null; } };
        elem.addEventListener("touchstart", (e) => { touched = true; e.preventDefault(); e.stopPropagation(); press(); startLP(); }, { passive: false });
        elem.addEventListener("touchend", (e) => { e.preventDefault(); e.stopPropagation(); unpress(); clearLP(); if (!longFired) onTap(); longFired = false; });
        elem.addEventListener("touchcancel", (e) => { e.stopPropagation(); unpress(); clearLP(); longFired = false; });
        elem.addEventListener("mousedown", (e) => { if (touched) return; e.stopPropagation(); press(); startLP(); });
        elem.addEventListener("mouseup", (e) => { e.stopPropagation(); unpress(); if (touched) { touched = false; return; } clearLP(); if (!longFired) onTap(); longFired = false; });
    }
    // handle kecil (stop propagation biar nggak ikut nge-drag tombol)
    function bindHandle(elem, fn) {
        let touched = false;
        elem.addEventListener("touchstart", (e) => { touched = true; e.preventDefault(); e.stopPropagation(); }, { passive: false });
        elem.addEventListener("touchend", (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
        elem.addEventListener("mousedown", (e) => { if (touched) return; e.stopPropagation(); });
        elem.addEventListener("mouseup", (e) => { if (touched) { touched = false; return; } e.stopPropagation(); fn(); });
    }

    function addResizeHandle(elem, name, onResize) {
        const h = el("div", {
            position: "absolute", right: "-6px", bottom: "-6px", width: "22px", height: "22px",
            borderRadius: "50%", background: "rgba(80,200,255,0.95)", border: "2px solid #fff",
            display: "none", touchAction: "none", pointerEvents: "auto", zIndex: "5",
        });
        let pid = null, startSize = 0, sx = 0, sy = 0;
        const down = (e) => { e.preventDefault(); e.stopPropagation(); const t = e.changedTouches ? e.changedTouches[0] : e; pid = t.identifier !== undefined ? t.identifier : "m"; startSize = getPos(name).size; sx = t.clientX; sy = t.clientY; };
        const move = (e) => { if (pid === null) return; const t = pickTouch(e, pid); if (!t) return; e.preventDefault(); const delta = ((t.clientX - sx) + (t.clientY - sy)) / 2; const size = Math.max(40, Math.min(280, Math.round(startSize + delta))); setPos(name, { size }); onResize(size); };
        const up = () => { pid = null; };
        h.addEventListener("touchstart", down, { passive: false });
        h.addEventListener("touchmove", move, { passive: false });
        h.addEventListener("touchend", up);
        h.addEventListener("mousedown", down);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        elem._resizeHandle = h;
        elem.appendChild(h);
    }

    function addKeyHandle(elem, name) {
        const h = el("div", {
            position: "absolute", left: "-6px", top: "-6px", minWidth: "22px", height: "22px",
            padding: "0 4px", borderRadius: "11px", background: "rgba(255,200,40,0.95)", border: "2px solid #fff",
            color: "#000", fontFamily: "sans-serif", fontSize: "11px", fontWeight: "bold",
            textAlign: "center", lineHeight: "22px", display: "none", touchAction: "none",
            pointerEvents: "auto", zIndex: "6", whiteSpace: "nowrap",
        });
        h.textContent = "KEY";
        bindHandle(h, () => openKeyPicker(name));
        elem._keyHandle = h;
        elem.appendChild(h);
    }

    function makeDraggable(elem, name, onMoved) {
        let pid = null, ox = 0, oy = 0;
        elem._dragDown = (e) => {
            if (!EDIT) return false;
            const t = e.changedTouches ? e.changedTouches[0] : e;
            if (e.target === elem._resizeHandle || e.target === elem._keyHandle) return true;
            e.preventDefault(); e.stopPropagation();
            pid = t.identifier !== undefined ? t.identifier : "m";
            const r = elem.getBoundingClientRect();
            ox = t.clientX - r.left; oy = t.clientY - r.top;
            return true;
        };
        const move = (e) => {
            if (pid === null) return;
            const t = pickTouch(e, pid); if (!t) return;
            e.preventDefault();
            let left = t.clientX - ox, top = t.clientY - oy;
            left = Math.max(0, Math.min(window.innerWidth - elem.offsetWidth, left));
            top = Math.max(0, Math.min(window.innerHeight - elem.offsetHeight, top));
            elem.style.left = left + "px"; elem.style.top = top + "px";
            setPos(name, { left, top });
            if (onMoved) onMoved();
        };
        const up = () => { pid = null; };
        window.addEventListener("touchmove", move, { passive: false });
        window.addEventListener("touchend", up);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    }

    // --- Analog stick ---------------------------------------------------------
    let stickEl, knob, stickPid = null, baseCx = 0, baseCy = 0;
    function buildStick() {
        const p = getPos("_stick");
        stickEl = el("div", {
            position: "absolute", left: p.left + "px", top: p.top + "px", width: p.size + "px", height: p.size + "px",
            borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.5)",
            touchAction: "none", pointerEvents: "auto",
        });
        knob = el("div", {
            position: "absolute", left: "50%", top: "50%", width: p.size * 0.45 + "px", height: p.size * 0.45 + "px",
            marginLeft: -(p.size * 0.225) + "px", marginTop: -(p.size * 0.225) + "px",
            borderRadius: "50%", background: "rgba(255,255,255,0.55)",
        });
        stickEl.appendChild(knob);
        const onDown = (e) => {
            if (stickEl._dragDown && stickEl._dragDown(e)) return;
            e.preventDefault(); e.stopPropagation();
            const t = e.changedTouches ? e.changedTouches[0] : e;
            stickPid = t.identifier !== undefined ? t.identifier : "m";
            const r = stickEl.getBoundingClientRect();
            baseCx = r.left + r.width / 2; baseCy = r.top + r.height / 2;
            onMove(e);
        };
        const onMove = (e) => {
            if (stickPid === null) return;
            const t = pickTouch(e, stickPid); if (!t) return;
            e.preventDefault(); if (e.stopPropagation) e.stopPropagation();
            const r = stickEl.getBoundingClientRect(); const curR = r.width / 2;
            let dx = t.clientX - baseCx, dy = t.clientY - baseCy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > curR) { dx = (dx / dist) * curR; dy = (dy / dist) * curR; }
            knob.style.transform = `translate(${dx}px, ${dy}px)`;
            applyDirection(dx, dy, curR * 0.25);
        };
        const onUp = (e) => { if (e && e.stopPropagation) e.stopPropagation(); stickPid = null; knob.style.transform = "translate(0,0)"; clearDirs(); };
        stickEl.addEventListener("touchstart", onDown, { passive: false });
        stickEl.addEventListener("touchmove", onMove, { passive: false });
        stickEl.addEventListener("touchend", onUp);
        stickEl.addEventListener("touchcancel", onUp);
        stickEl.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        makeDraggable(stickEl, "_stick");
        addResizeHandle(stickEl, "_stick", (size) => {
            stickEl.style.width = size + "px"; stickEl.style.height = size + "px";
            knob.style.width = size * 0.45 + "px"; knob.style.height = size * 0.45 + "px";
            knob.style.marginLeft = -(size * 0.225) + "px"; knob.style.marginTop = -(size * 0.225) + "px";
        });
        controls.push(stickEl);
        root.appendChild(stickEl);
    }

    // --- Tombol aksi ----------------------------------------------------------
    function buildButtons() {
        BUTTON_LAYOUT.forEach((b) => {
            const p = getPos(b.name);
            const def0 = catalog(getKeyId(b.name, b.keyId));
            const btn = el("div", {
                position: "absolute", left: p.left + "px", top: p.top + "px", width: p.size + "px", height: p.size + "px",
                borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.55)",
                color: "rgba(255,255,255,0.9)", textAlign: "center", lineHeight: p.size + "px",
                fontFamily: "sans-serif", fontSize: Math.floor(p.size * 0.28) + "px", fontWeight: "bold",
                whiteSpace: "nowrap", userSelect: "none", touchAction: "none", pointerEvents: "auto",
            });
            btn.textContent = def0.label;
            const press = (e) => {
                if (btn._dragDown && btn._dragDown(e)) return;
                e.preventDefault(); e.stopPropagation();
                const def = catalog(getKeyId(b.name, b.keyId));
                fireKey("keydown", def); btn._held = def;
                btn.style.background = "rgba(255,255,255,0.5)";
            };
            const release = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                if (btn._held) { fireKey("keyup", btn._held); btn._held = null; }
                btn.style.background = "rgba(255,255,255,0.22)";
            };
            btn.addEventListener("touchstart", press, { passive: false });
            btn.addEventListener("touchend", release);
            btn.addEventListener("touchcancel", release);
            btn.addEventListener("mousedown", press);
            btn.addEventListener("mouseup", release);
            makeDraggable(btn, b.name);
            addResizeHandle(btn, b.name, (size) => { btn.style.width = size + "px"; btn.style.height = size + "px"; btn.style.lineHeight = size + "px"; btn.style.fontSize = Math.floor(size * 0.28) + "px"; });
            addKeyHandle(btn, b.name);
            controls.push(btn);
            root.appendChild(btn);
        });
    }

    // --- Popup pemilih key (remap) --------------------------------------------
    function openKeyPicker(name) {
        const pop = el("div", {
            position: "fixed", left: "0", top: "0", right: "0", bottom: "0",
            background: "rgba(0,0,0,0.7)", zIndex: "400", pointerEvents: "auto",
            display: "flex", alignItems: "center", justifyContent: "center",
        });
        const panel = el("div", {
            maxWidth: "92%", maxHeight: "80%", overflowY: "auto", padding: "12px",
            background: "#222", borderRadius: "12px", border: "1px solid #555",
            display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center",
        });
        const title = el("div", { width: "100%", color: "#fff", fontFamily: "sans-serif", fontSize: "15px", fontWeight: "bold", textAlign: "center", marginBottom: "6px" });
        title.textContent = "Pilih key buat tombol " + name;
        panel.appendChild(title);
        KEY_CATALOG.forEach((def) => {
            const k = el("div", {
                minWidth: "44px", height: "40px", padding: "0 8px", borderRadius: "8px",
                background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
                textAlign: "center", lineHeight: "40px", fontFamily: "sans-serif", fontSize: "13px",
                userSelect: "none", touchAction: "none",
            });
            k.textContent = def.label;
            bindTap(k, () => { setKeyId(name, def.id); document.body.removeChild(pop); rebuild(); });
            panel.appendChild(k);
        });
        const cancel = el("div", {
            width: "100%", marginTop: "8px", height: "40px", borderRadius: "8px", background: "rgba(255,80,80,0.5)",
            color: "#fff", textAlign: "center", lineHeight: "40px", fontFamily: "sans-serif", fontWeight: "bold",
            userSelect: "none", touchAction: "none",
        });
        cancel.textContent = "Batal";
        bindTap(cancel, () => document.body.removeChild(pop));
        panel.appendChild(cancel);
        pop.appendChild(panel);
        document.body.appendChild(pop);
    }

    // --- Keyboard QWERTY ------------------------------------------------------
    let kbPanel = null, kbShift = false;
    function charDef(ch, shift) {
        if (/[a-z]/i.test(ch)) { const up = ch.toUpperCase(); return { key: shift ? up : ch.toLowerCase(), code: "Key" + up, keyCode: up.charCodeAt(0) }; }
        if (/[0-9]/.test(ch)) return { key: ch, code: "Digit" + ch, keyCode: 48 + Number(ch) };
        return { key: ch, code: "", keyCode: ch.charCodeAt(0) };
    }
    function typeKey(def) { fireKey("keydown", def, kbShift); fireKey("keyup", def, kbShift); }
    const KB_ROWS = [
        "1234567890".split(""),
        "qwertyuiop".split(""),
        "asdfghjkl".split(""),
        ["shift", "z", "x", "c", "v", "b", "n", "m", "back"],
        ["space", "enter", "close"],
    ];
    function buildKeyboard() {
        kbPanel = el("div", {
            position: "fixed", left: "0", right: "0", bottom: "0", zIndex: "300",
            background: "rgba(0,0,0,0.9)", padding: "6px", display: "none",
            flexDirection: "column", gap: "5px", pointerEvents: "auto",
        });
        KB_ROWS.forEach((row) => {
            const r = el("div", { display: "flex", gap: "5px", justifyContent: "center" });
            row.forEach((item) => {
                let label = item, grow = 1, onTap;
                if (item === "shift") { label = "Shift"; grow = 1.6; }
                else if (item === "back") { label = "Back"; grow = 1.6; }
                else if (item === "space") { label = "Space"; grow = 6; }
                else if (item === "enter") { label = "Enter"; grow = 2; }
                else if (item === "close") { label = "Close"; grow = 1.6; }
                else label = kbShift ? item.toUpperCase() : item;
                const key = el("div", {
                    flex: grow + " 1 0", minWidth: "26px", height: "44px", borderRadius: "6px",
                    background: item === "shift" && kbShift ? "rgba(80,200,255,0.8)" : "rgba(255,255,255,0.18)",
                    color: "#fff", border: "1px solid rgba(255,255,255,0.35)", textAlign: "center",
                    lineHeight: "44px", fontFamily: "sans-serif", fontSize: "15px", userSelect: "none", touchAction: "none",
                });
                key.textContent = label;
                if (item === "shift") onTap = () => { kbShift = !kbShift; refreshKeyboard(); };
                else if (item === "back") onTap = () => typeKey({ key: "Backspace", code: "Backspace", keyCode: 8 });
                else if (item === "enter") onTap = () => typeKey({ key: "Enter", code: "Enter", keyCode: 13 });
                else if (item === "space") onTap = () => typeKey({ key: " ", code: "Space", keyCode: 32 });
                else if (item === "close") onTap = () => toggleKeyboard(false);
                else onTap = () => typeKey(charDef(item, kbShift));
                bindTap(key, onTap);
                r.appendChild(key);
            });
            kbPanel.appendChild(r);
        });
        document.body.appendChild(kbPanel);
    }
    function refreshKeyboard() {
        const open = kbPanel && kbPanel.style.display !== "none";
        if (kbPanel) { document.body.removeChild(kbPanel); kbPanel = null; }
        buildKeyboard();
        if (open) kbPanel.style.display = "flex";
    }
    function toggleKeyboard(force) {
        if (!kbPanel) buildKeyboard();
        const show = force === undefined ? kbPanel.style.display === "none" : force;
        kbPanel.style.display = show ? "flex" : "none";
    }

    // --- Tombol sistem (HIDE / EDIT / KB) -------------------------------------
    let hideBtn, editBtn, kbBtn;
    function sysBtn(text, rightPx) {
        const b = el("div", {
            position: "absolute", top: "10px", right: rightPx + "px", minWidth: "48px", height: "32px",
            padding: "0 12px", borderRadius: "16px", background: "rgba(0,0,0,0.45)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.6)", textAlign: "center", lineHeight: "32px", whiteSpace: "nowrap",
            fontFamily: "sans-serif", fontSize: "13px", fontWeight: "bold", userSelect: "none",
            touchAction: "none", pointerEvents: "auto", zIndex: "10", boxSizing: "border-box",
        });
        b.textContent = text;
        return b;
    }
    function applyHidden() {
        controls.forEach((c) => (c.style.display = hidden ? "none" : ""));
        hideBtn.textContent = hidden ? "SHOW" : "HIDE";
        if (hidden && EDIT) toggleEdit(false);
        editBtn.style.display = hidden ? "none" : "";
        kbBtn.style.display = hidden ? "none" : "";
    }
    function toggleEdit(force) {
        EDIT = force === undefined ? !EDIT : force;
        editBtn.style.background = EDIT ? "rgba(80,200,255,0.85)" : "rgba(0,0,0,0.45)";
        editBtn.textContent = EDIT ? "DONE" : "EDIT";
        controls.forEach((c) => {
            if (c._resizeHandle) c._resizeHandle.style.display = EDIT ? "block" : "none";
            if (c._keyHandle) c._keyHandle.style.display = EDIT ? "block" : "none";
        });
        if (EDIT) clearDirs();
    }
    function buildSysButtons() {
        hideBtn = sysBtn("HIDE", 12);
        bindTap(hideBtn, () => { hidden = !hidden; saveHidden(hidden); applyHidden(); });
        editBtn = sysBtn("EDIT", 84);
        bindTap(editBtn, () => toggleEdit(), () => { layout = {}; saveLayout(); rebuild(); });
        kbBtn = sysBtn("KB", 156);
        bindTap(kbBtn, () => toggleKeyboard());
        root.appendChild(hideBtn);
        root.appendChild(editBtn);
        root.appendChild(kbBtn);
    }

    // --- Build / rebuild ------------------------------------------------------
    function rebuild() {
        controls.forEach((c) => c.remove());
        controls = [];
        buildStick();
        buildButtons();
        applyHidden();
        toggleEdit(EDIT);
    }
    function buildOverlay() {
        if (root) return;
        root = el("div", { position: "fixed", left: "0", top: "0", right: "0", bottom: "0", zIndex: "100", opacity: String(OPACITY), pointerEvents: "none" });
        document.body.appendChild(root);
        buildSysButtons();
        buildStick();
        buildButtons();
        applyHidden();
        toggleEdit(false);
    }

    const _SceneManager_run = SceneManager.run;
    SceneManager.run = function (sceneClass) {
        _SceneManager_run.call(this, sceneClass);
        buildOverlay();
    };
})();
