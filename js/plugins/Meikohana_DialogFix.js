/*:
 * @target MZ
 * @plugindesc [Meikohana DialogFix v2.0] Word-wrap + batas baris (auto pindah halaman) + kotak Choice anti-kepotong. Aman untuk pilihan & callback.
 * @author Meikohana / fix
 *
 * @param maxChars
 * @text Maks Karakter per Baris
 * @type number
 * @min 10
 * @default 50
 * @desc Panjang maksimal satu baris sebelum kata berikutnya dipindah ke
 * baris baru (word-wrap). Kata tidak dipotong di tengah.
 *
 * @param maxRows
 * @text Maksimal Baris Dialog
 * @type number
 * @min 1
 * @default 4
 * @desc Jumlah baris per halaman. Nilai ini SEKALIGUS dipakai sebagai
 * tinggi kotak dialog, jadi window & isi selalu pas (tidak kepotong).
 *
 * @param wrapChoiceText
 * @text Wrap Pesan yang Membawa Pilihan
 * @type boolean
 * @on Ya
 * @off Tidak (aman)
 * @default false
 * @desc Kalau Ya, teks pesan yang punya Show Choices ikut di-wrap.
 * Default Tidak agar 100% aman dari stuck menu (kencan).
 *
 * @param keepChoiceOnScreen
 * @text Choice Selalu di Dalam Layar
 * @type boolean
 * @on Ya
 * @off Tidak
 * @default true
 * @desc Geser posisi X kotak Choice otomatis agar seluruh kotak tetap
 * muat di layar (tidak kepotong ke kanan).
 *
 * @param shrinkLongChoice
 * @text Perkecil Font Choice Kepanjangan
 * @type boolean
 * @on Ya
 * @off Tidak
 * @default true
 * @desc Kalau ada 1 pilihan lebih lebar dari layar, font-nya dikecilkan
 * sedikit supaya tetap terbaca utuh (bukan kepotong).
 *
 * @help
 * Meikohana_DialogFix.js
 * ===========================================================================
 * Gabungan dari dua plugin lama:
 *   - Meikohana_Paraft.js    (word-wrap aman + window pendek)
 *   - Meikohana_LayoutFix.js (batas baris + kotak Choice anti-kepotong)
 *
 * Plugin ini menyelesaikan masalah khas setelah teks Jepang diterjemahkan
 * ke Bahasa Indonesia (yang biasanya jadi lebih panjang):
 *
 * 1) TEKS TERLALU PANJANG -> word-wrap otomatis.
 *    Pesan teks biasa dipecah jadi beberapa baris pada batas kata,
 *    maksimal "Maks Karakter per Baris".
 *
 * 2) KOTAK DIALOG KEPOTONG (baris ke-N+1 nyeruak di bawah).
 *    Dialog dibatasi TEPAT "Maksimal Baris Dialog". Sisa teks otomatis
 *    lanjut ke halaman berikutnya begitu diklik. Perhitungan per-baris
 *    (bukan per-pixel) sehingga kebal terhadap perbedaan tinggi window /
 *    padding antar plugin. Tinggi window juga disamakan dengan angka ini,
 *    jadi window dan isi selalu sinkron.
 *
 * 3) KOTAK CHOICE KEPOTONG (teks pilihan kepanjangan keluar layar).
 *    Posisi kotak Choice digeser agar tetap di dalam layar. Kalau ada satu
 *    pilihan yang lebih lebar dari layar, font-nya dikecilkan sedikit
 *    supaya tetap terbaca utuh.
 *
 * KENAPA AMAN (tidak bikin stuck di menu kencan):
 *    Word-wrap hanya mengganti isi $gameMessage._texts DI TEMPAT, tanpa
 *    pernah memanggil $gameMessage.clear(). Jadi wajah, nama, posisi
 *    window, daftar pilihan, dan callback pilihan tetap utuh. Secara
 *    default pesan yang membawa pilihan / input angka / pilih item juga
 *    dilewati (tidak di-wrap) sebagai lapis pengaman tambahan — bisa
 *    diubah lewat parameter "Wrap Pesan yang Membawa Pilihan".
 *
 * PENEMPATAN:
 *    Taruh plugin ini PALING BAWAH di Plugin Manager, minimal di bawah:
 *    NRP_MessageWindow, MessageAlignCenter, MPP_MessageEX, Meikohana_WP,
 *    MPP_ChoiceEX, dan MPP_ChoiceAlign.
 *
 * CATATAN:
 *    Word-wrap menghitung panjang baris berbasis jumlah karakter, jadi
 *    escape code seperti \C[n] atau \N[1] ikut terhitung sebagai karakter.
 *    Untuk teks dialog biasa efeknya kecil; kalau satu baris punya banyak
 *    escape code dan terasa terlalu cepat/lambat berpindah baris, naikkan
 *    sedikit "Maks Karakter per Baris".
 *
 * Nama parameter dibaca otomatis dari nama file, jadi kamu boleh
 * mengganti nama file plugin ini tanpa merusak setelan.
 *
 * Terms: bebas dipakai/diedit untuk project pribadi maupun komersil.
 * ===========================================================================
 */

(() => {
    "use strict";

    // Nama plugin diambil dari nama file (bukan hardcode) supaya setelan di
    // Plugin Manager tidak pernah "hilang" walau file di-rename.
    const PLUGIN_NAME = (() => {
        const s = (typeof document !== "undefined") ? document.currentScript : null;
        if (s && s.src) {
            return decodeURIComponent(s.src.split("/").pop().replace(/\.js$/i, ""));
        }
        return "Meikohana_DialogFix";
    })();

    const params = PluginManager.parameters(PLUGIN_NAME);
    const MAX_CHARS       = Math.max(10, Number(params.maxChars || 50));
    const MAX_ROWS        = Math.max(1, Number(params.maxRows || 4));
    const WRAP_CHOICE     = String(params.wrapChoiceText || "false") === "true";
    const KEEP_ON_SCREEN  = String(params.keepChoiceOnScreen || "true") === "true";
    const SHRINK_LONG     = String(params.shrinkLongChoice || "true") === "true";

    //=========================================================================
    // BAGIAN 0 — Tinggi window mengikuti MAX_ROWS
    //=========================================================================
    // Window dan ambang pindah-halaman memakai angka yang sama, jadi tidak
    // mungkin lagi window 3 baris tapi isi diizinkan 4 baris (penyebab
    // baris terakhir kepotong).
    Window_Message.prototype.numVisibleRows = function() {
        return MAX_ROWS;
    };

    //=========================================================================
    // BAGIAN 1 — Word-wrap AMAN (edit _texts di tempat, tanpa clear())
    //=========================================================================
    const _startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        rewrapInPlace();
        _startMessage.call(this);
    };

    function rewrapInPlace() {
        const gm = $gameMessage;
        if (!gm) return;

        // Lapis pengaman: secara default JANGAN utak-atik pesan yang membawa
        // pilihan / input angka / pilih item. (Bisa dimatikan via parameter.)
        if (!WRAP_CHOICE && (gm.isChoice() || gm.isNumberInput() || gm.isItemChoice())) {
            return;
        }
        if (!gm._texts || gm._texts.length === 0) return;

        const paragraphs = gm._texts.join("\n").split("\n");
        const out = [];
        for (const para of paragraphs) {
            if (para.trim() === "") { out.push(""); continue; }
            const words = para.split(" ");
            let cur = "";
            for (const w of words) {
                if (cur !== "" && (cur + " " + w).length > MAX_CHARS) {
                    out.push(cur);
                    cur = w;
                } else {
                    cur = cur === "" ? w : cur + " " + w;
                }
            }
            if (cur !== "") out.push(cur);
        }
        gm._texts = out; // ganti di tempat; TIDAK memakai clear()
    }

    //=========================================================================
    // BAGIAN 2 — Batasi dialog jadi MAX_ROWS baris + auto pindah halaman
    //=========================================================================
    // Hitung baris visual secara manual (counter), lalu paksa needsNewPage()
    // true tepat saat mau masuk baris ke (MAX_ROWS + 1). Ini menggantikan
    // perhitungan berbasis pixel bawaan/plugin lain yang ambangnya bisa
    // meleset karena contents di-resize ke tinggi penuh window.

    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.apply(this, arguments);
        this._mkLineCount = 1; // baris pertama pada halaman baru
    };

    const _Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
        // Naikkan counter LEBIH DULU agar cek needsNewPage di dalam chain
        // (engine & MPP_MessageEX) melihat nilai yang sudah ter-update.
        this._mkLineCount = (this._mkLineCount || 1) + 1;
        _Window_Message_processNewLine.apply(this, arguments);
    };

    // Ganti total: pindah halaman murni berdasarkan jumlah baris.
    Window_Message.prototype.needsNewPage = function(textState) {
        if (this.isEndOfText(textState)) {
            return false;
        }
        return (this._mkLineCount || 1) > MAX_ROWS;
    };

    //=========================================================================
    // BAGIAN 3 — Kotak Choice tidak kepotong (tetap di layar + auto-shrink)
    //=========================================================================

    // 3a. Jaga agar seluruh kotak Choice tetap di dalam layar.
    if (KEEP_ON_SCREEN) {
        const _Window_ChoiceList_windowX = Window_ChoiceList.prototype.windowX;
        Window_ChoiceList.prototype.windowX = function() {
            let x = _Window_ChoiceList_windowX.apply(this, arguments);
            const w = this.windowWidth(); // lebar otomatis mengikuti teks
            // clamp: pojok kiri >= 0 dan pojok kanan <= lebar layar
            x = Math.max(0, Math.min(x, Graphics.boxWidth - w));
            return x;
        };
    }

    // 3b. Kalau 1 pilihan lebih lebar dari layar, kecilkan font-nya sedikit
    //     supaya tetap muat utuh. Alignment (MPP_ChoiceAlign) tetap dihormati.
    if (SHRINK_LONG) {
        const MIN_FONT = 16;

        const _ChoiceList_resetFontSettings = Window_ChoiceList.prototype.resetFontSettings;
        Window_ChoiceList.prototype.resetFontSettings = function() {
            _ChoiceList_resetFontSettings.apply(this, arguments);
            // Terapkan skala SETELAH reset, karena drawTextEx() memanggil
            // resetFontSettings() di awal (kalau tidak, skala akan ke-reset).
            if (this._mkChoiceScale && this._mkChoiceScale < 1) {
                const fs = this.contents.fontSize;
                this.contents.fontSize = Math.max(MIN_FONT, Math.floor(fs * this._mkChoiceScale));
            }
        };

        const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
        Window_ChoiceList.prototype.drawItem = function(index) {
            const rect = this.itemLineRect(index);
            const text = this.commandName(index);

            // Ukur lebar teks pada font normal (skala mati dulu).
            this._mkChoiceScale = 1;
            const fullWidth = this.textSizeEx(text).width;

            if (fullWidth > rect.width) {
                // Butuh dikecilkan agar muat di dalam rect.
                this._mkChoiceScale = Math.max(
                    MIN_FONT / (this.contents.fontSize || 26),
                    rect.width / fullWidth
                );
                _Window_ChoiceList_drawItem.apply(this, arguments);
                this._mkChoiceScale = 1;
            } else {
                this._mkChoiceScale = 1;
                _Window_ChoiceList_drawItem.apply(this, arguments);
            }
        };
    }

})();
