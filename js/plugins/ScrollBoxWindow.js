// ScrollBoxWindow.js Ver.1.1.1
// MIT License (C) 2023 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @plugindesc Creates a scrollable window.
* @author あわやまたな (Awayamatana)
* @url https://awaya3ji.seesaa.net/article/500204251.html
* @help Ver.1.1.1
* Created by plugin command and scrolled by key or mouse.
*
* @param bitmapHeight
* @text Bitmap Height
* @desc Basically no need to change.
* @type number
* @default 2048
*
* @command createWindow
* @text Create Window
* @desc Creates a scrollbox window.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg text
* @text Text
* @type multiline_string
* @default 
*
* @arg x
* @text X
* @type combo
* @option Middle
* @option Right
* @default 0
*
* @arg y
* @text Y
* @type combo
* @option Middle
* @option Bottom
* @default 0
*
* @arg width
* @text Width
* @type combo
* @default UI Area Width
* @option UI Area Width
* @option UI Area Half Width
*
* @arg height
* @text Height
* @type combo
* @default UI Area Height
* @option UI Area Height
* @option UI Area Half Height
*
* @arg scrollY
* @text Scroll Y
* @type combo
* @default 0
* @option Bottom
*
* @arg backgroundType
* @text Background
* @type select
* @default Window
* @option Window
* @option Dim
* @option Transparent
*
* @arg windowskin
* @text Window Skin
* @type file
* @dir img/system
* @default 
*
* @arg backOpacity
* @text Back Opacity
* @desc default at -1
* @type number
* @min -1
* @max 255
* @default -1
*
* @command changeText
* @text Change Text
* @desc Change the displayed text.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg text
* @text Text
* @type multiline_string
* @default 
*
* @command changeActive
* @text Change Active
* @desc Change scrollability.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg boolean
* @text Boolean
* @type boolean
* @default false
*
* @command moveWindow
* @text Move Window
* @desc Move the window.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg x
* @text X
* @type combo
* @option Middle
* @option Right
* @default 0
*
* @arg y
* @text Y
* @type combo
* @option Middle
* @option Bottom
* @default 0
*
* @command scrollWindow
* @text Scroll Window
* @desc Scrolls the window to the specified position.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg scrollY
* @text Scroll Y
* @type combo
* @default 0
* @option Bottom
*
* @arg smooth
* @text Smooth
* @type boolean
* @default false
*
* @command scrollWindowBy
* @text Scroll Window By
* @desc Scrolls the window by the specified number.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg scrollY
* @text Scroll Y
* @default 0
*
* @arg smooth
* @text Smooth
* @type boolean
* @default false
*
* @command changeWindow
* @text Change Window
* @desc Opens and closes the window.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg operation
* @text Operation
* @type select
* @default open
* @option Open
* @value open
* @option Close
* @value close
*
* @arg instant
* @text Instant
* @type boolean
* @default false
*
* @command eraseWindow
* @text Erase Window
* @desc Erase the window.
*
* @arg id
* @text Identifier
* @desc The name of the window to operate on.
* @default 
*
* @arg instant
* @text Instant
* @type boolean
* @default false
*
*/

/*:ja
* @target MZ
* @plugindesc スクロールできるウィンドウを生成します。
* @author あわやまたな (Awayamatana)
* @url https://awaya3ji.seesaa.net/article/500204251.html
* @help プラグインコマンドで生成し、キーやマウスでスクロールします。
* [更新履歴]
* 2023/07/31：Ver.1.0.0　公開。
* 2023/11/11：Ver.1.1.0　ウィンドウをスクロールするプラグインコマンドを追加。
* 2023/11/12：Ver.1.1.1　ウィンドウの初期スクロール位置を設定可能にしました。
*
* @param bitmapHeight
* @text ビットマップ高さ
* @desc 生成するビットマップ高さの最大値です。
* 基本的に変更する必要はありません。
* @type number
* @default 2048
*
* @command createWindow
* @text ウィンドウ生成
* @desc スクロールボックスウィンドウを生成します。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg text
* @text テキスト
* @type multiline_string
* @default 
*
* @arg x
* @text X座標
* @type combo
* @option 中
* @option 右
* @default 0
*
* @arg y
* @text Y座標
* @type combo
* @option 中
* @option 下
* @default 0
*
* @arg width
* @text 幅
* @type combo
* @default UIエリアの幅
* @option UIエリアの幅
* @option UIエリアの半分の幅
*
* @arg height
* @text 高さ
* @type combo
* @default UIエリアの高さ
* @option UIエリアの高さ
* @option UIエリアの半分の高さ
*
* @arg scrollY
* @text スクロールY
* @type combo
* @default 0
* @option 下
*
* @arg backgroundType
* @text 背景
* @type select
* @default ウィンドウ
* @option ウィンドウ
* @option 暗くする
* @option 透明
*
* @arg windowskin
* @text ウィンドウスキン
* @type file
* @dir img/system
* @default 
*
* @arg backOpacity
* @text 背景不透明度
* @desc -1でデフォルト
* @type number
* @min -1
* @max 255
* @default -1
*
* @command changeText
* @text 文章の変更
* @desc 表示する文章を変更します。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg text
* @text テキスト
* @type multiline_string
* @default 
*
* @command changeActive
* @text アクティブの変更
* @desc スクロールの可否を変更します。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg boolean
* @text 真偽値
* @type boolean
* @default false
*
* @command moveWindow
* @text ウィンドウの移動
* @desc ウィンドウの移動を行います。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default  
*
* @arg x
* @text X座標
* @type combo
* @option 中
* @option 右
* @default 0
*
* @arg y
* @text Y座標
* @type combo
* @option 中
* @option 下
* @default 0
*
* @command scrollWindow
* @text ウィンドウのスクロール
* @desc ウィンドウを指定位置までスクロールします。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg scrollY
* @text スクロールY
* @type combo
* @default 0
* @option 下
*
* @arg smooth
* @text なめらか
* @type boolean
* @default false
*
* @command scrollWindowBy
* @text ウィンドウの相対スクロール
* @desc ウィンドウを指定された数だけスクロールします。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg scrollY
* @text スクロールY
* @default 0
*
* @arg smooth
* @text なめらか
* @type boolean
* @default false
*
* @command changeWindow
* @text ウィンドウの変更
* @desc ウィンドウの開閉を行います。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg operation
* @text 操作
* @type select
* @default open
* @option 開く
* @value open
* @option 閉じる
* @value close
*
* @arg instant
* @text 瞬間
* @type boolean
* @default false
*
* @command eraseWindow
* @text ウィンドウの消去
* @desc ウィンドウを消去します。
*
* @arg id
* @text 識別子
* @desc 操作するウィンドウの名前です。
* @default 
*
* @arg instant
* @text 瞬間
* @type boolean
* @default false
*
*/

'use strict';

{
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const hasPluginCommonBase = typeof PluginManagerEx === "function";
	const bitmapHeight = Number(parameters["bitmapHeight"]);

	//-----------------------------------------------------------------------------
	// PluginManager

	function convertParams(args) {
		const params = JsonEx.makeDeepCopy(args)
		if (["UIエリアの幅", "UI Area Width"].includes(params.width)) {
			params.width = Graphics.boxWidth;
		} else if (["UIエリアの半分の幅", "UI Area Half Width"].includes(params.width)) {
			params.width = Graphics.boxWidth / 2;
		}
		if (["UIエリアの高さ", "UI Area Height"].includes(params.height)) {
			params.height = Graphics.boxHeight;
		} else if (["UIエリアの半分の高さ", "UI Area Half Height"].includes(params.height)) {
			params.height = Graphics.boxHeight / 2;
		}
		if (["中", "Middle"].includes(params.x)) {
			params.x = (Graphics.boxWidth - params.width) / 2;
		} else if (["右", "Right"].includes(params.x)) {
			params.x = Graphics.boxWidth - params.width;
		}
		if (["中", "Middle"].includes(params.y)) {
			params.y = (Graphics.boxHeight - params.height) / 2;
		} else if (["下", "Bottom"].includes(params.y)) {
			params.y = Graphics.boxHeight - params.height;
		}
		const backgroundType = ["ウィンドウ", "暗くする", "透明", "Window", "Dim", "Transparent"].findIndex(type => type === params.backgroundType);
		if (backgroundType > -1) {
			params.backgroundType = backgroundType % 3;
		}
		return params;
	}

	function convertScrollY(boxWindow, scrollY) {
		return ["Bottom", "下"].includes(scrollY) ? boxWindow.maxScrollY() : +scrollY;
	}

	PluginManager.registerCommand(pluginName, "createWindow", function (args) {
		const params = convertParams(args);
		const rect = new Rectangle(+params.x, +params.y, +params.width, +params.height);
		const data ={
			"id": params.id,
			"windowskin": params.windowskin,
			"backgroundType": +params.backgroundType,
			"backOpacity": +params.backOpacity
		};
		const boxWindow = SceneManager._scene.createScrollBoxWindow(rect, data, params.text);
		const scrollY = convertScrollY(boxWindow, args.scrollY);
		if (scrollY) {
			boxWindow.scrollTo(boxWindow._scrollX, scrollY);
		}
	});

	PluginManager.registerCommand(pluginName, "changeActive", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			if (args.boolean === "true") {
				boxWindow.activate();
			} else {
				boxWindow.deactivate();
			}
		}
	});

	PluginManager.registerCommand(pluginName, "changeText", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			boxWindow.setText(args.text);
		}
	});

	PluginManager.registerCommand(pluginName, "changeWindow", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			if (args.instant === "true") {
				boxWindow.openness = args.operation === "open" ? 255 : 0;
			}
			boxWindow[args.operation]();
		}
	});

	PluginManager.registerCommand(pluginName, "moveWindow", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			const params = convertParams(args);
			boxWindow.move(+params.x, +params.y);
		}
	});

	PluginManager.registerCommand(pluginName, "scrollWindow", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			const scrollY = convertScrollY(boxWindow, args.scrollY);
			if (args.smooth === "true") {
				boxWindow.smoothScrollTo(boxWindow._scrollTargetX, scrollY);
			} else {
				boxWindow.scrollTo(boxWindow._scrollX, scrollY);
			}
		}
	});

	PluginManager.registerCommand(pluginName, "scrollWindowBy", function (args) {
		const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
		if (boxWindow) {
			if (args.smooth === "true") {
				boxWindow.smoothScrollBy(0, +args.scrollY);
			} else {
				boxWindow.scrollBy(0, +args.scrollY);
			}
		}
	});

	PluginManager.registerCommand(pluginName, "eraseWindow", function (args) {
		SceneManager._scene.eraseScrollBoxWindow(args.id, args.instant === "true");
	});

	if (hasPluginCommonBase) {
		PluginManagerEx.registerCommand(document.currentScript, "createWindow", function (args) {
			const params = convertParams(args);
			const rect = new Rectangle(params.x, params.y, params.width, params.height);
			const data ={
				"id": params.id,
				"windowskin": params.windowskin,
				"backgroundType": params.backgroundType,
				"backOpacity": params.backOpacity
			};
			const boxWindow = SceneManager._scene.createScrollBoxWindow(rect, data, params.text);
			const scrollY = convertScrollY(boxWindow, args.scrollY);
			if (scrollY) {
				boxWindow.scrollTo(boxWindow._scrollX, scrollY);
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "changeActive", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				if (args.boolean) {
					boxWindow.activate();
				} else {
					boxWindow.deactivate();
				}
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "changeText", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				boxWindow.setText(args.text);
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "changeWindow", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				if (args.instant) {
					boxWindow.openness = args.operation === "open" ? 255 : 0;
				}
				boxWindow[args.operation]();
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "moveWindow", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				const params = convertParams(args);
				boxWindow.move(params.x, params.y);
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "scrollWindow", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				const scrollY = convertScrollY(boxWindow, args.scrollY);
				if (args.smooth === "true") {
					boxWindow.smoothScrollTo(boxWindow._scrollTargetX, scrollY);
				} else {
					boxWindow.scrollTo(boxWindow._scrollX, scrollY);
				}
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "scrollWindowBy", function (args) {
			const boxWindow = SceneManager._scene.findScrollBoxWindow(args.id);
			if (boxWindow) {
				if (args.smooth === "true") {
					boxWindow.smoothScrollBy(0, args.scrollY);
				} else {
					boxWindow.scrollBy(0, args.scrollY);
				}
			}
		});

		PluginManagerEx.registerCommand(document.currentScript, "eraseWindow", function (args) {
			SceneManager._scene.eraseScrollBoxWindow(args.id, args.instant);
		});
	}
	

	//-----------------------------------------------------------------------------
	// Scene_Base

	const _Scene_Base_initialize = Scene_Base.prototype.initialize;
	Scene_Base.prototype.initialize = function() {
		_Scene_Base_initialize.apply(this, arguments);
		this._scrollBoxWindows = [];
	};

	Scene_Base.prototype.createScrollBoxWindow = function(rect, data, text) {
		const oldWindow = this.findScrollBoxWindow(data.id);
		if (oldWindow) {
			boxWindows.remove(oldWindow);
			oldWindow.destroy();
		}
		const newWindow = new Window_ScrollBox(rect, data);
		newWindow.setText(text);
		this._scrollBoxWindows.push(newWindow);
		this.addWindow(newWindow);
		return newWindow;
	};

	Scene_Base.prototype.findScrollBoxWindow = function(id) {
		return this._scrollBoxWindows.find(w => w._id === id);
	};

	Scene_Base.prototype.eraseScrollBoxWindow = function(id, instant) {
		const boxWindow = this.findScrollBoxWindow(id);
		if (boxWindow) {
			boxWindow._delete = true;
			if (instant) {
				boxWindow.openness = 0;
			}
			boxWindow.close();
		}
	};

	//-----------------------------------------------------------------------------
	// Window_ScrollBox

	function Window_ScrollBox() {
	    this.initialize(...arguments);
	}

	Window_ScrollBox.prototype = Object.create(Window_Scrollable.prototype);
	Window_ScrollBox.prototype.constructor = Window_ScrollBox;

	Window_ScrollBox.prototype.initialize = function(rect, data) {
		this._backOpacity = data.backOpacity;
		this._windowSkinName = data.windowskin;
		this._id = data.id;
		this._scrollFixed = false;
		this._text = "";
		this._allTextHeight = 0;
		Window_Scrollable.prototype.initialize.call(this, rect);
		this.openness = 0;
		this.open();
		this.setBackgroundType(data.backgroundType);
	};

	Window_ScrollBox.prototype.update = function() {
		Window_Scrollable.prototype.update.call(this);
		this.processButtonScroll();
		if (this._delete && this.isClosed()) {
			SceneManager._scene._scrollBoxWindows.remove(this);
			this.destroy();
		}
	};

	Window_ScrollBox.prototype.processButtonScroll = function() {
		if (this.isScrollEnabled() && this._scrollDuration === 0) {
			if (Input.isPressed("down")) {
				this.smoothScrollDown(1);
			}
			if (Input.isPressed("up")) {
				this.smoothScrollUp(1);
			}
		}
	};

	Window_ScrollBox.prototype.isScrollEnabled = function() {
		return this.active;
	};

	Window_ScrollBox.prototype.loadWindowskin = function() {
		if (this._windowSkinName) {
			this.windowskin = ImageManager.loadSystem(this._windowSkinName);
			return;
		}
		Window_Scrollable.prototype.loadWindowskin.call(this);
	};

	Window_ScrollBox.prototype.updateBackOpacity = function() {
		if (this._backOpacity > -1) {
			this.backOpacity = this._backOpacity;
			return;
		}
		Window_Scrollable.prototype.updateBackOpacity.call(this);
	};

	Window_ScrollBox.prototype.scrollBlockHeight = function() {
		return bitmapHeight - this.height;
	};

	Window_ScrollBox.prototype.setText = function(text) {
		this._text = text || "";
		this._allTextHeight = this.textSizeEx(this._text).height;
		this.createContents();
		this.refresh();
		this.scrollTo(0, 0);
	};

	Window_ScrollBox.prototype.refresh = function() {
		this.paint();
	};

	Window_ScrollBox.prototype.paint = function() {
		if (this.contents) {
			this.contents.clear();
			this.contentsBack.clear();
			this.drawAllItems();
		}
	};

	Window_ScrollBox.prototype.drawAllItems = function () {
		const rect = this.baseTextRect();
		const blockHeight = this.scrollBlockHeight() || 1;
		this.origin.y = this._scrollY % blockHeight;
		let y = rect.y - (this._scrollY - this.origin.y);

		const lines = this._text.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			// 背景制御文字 \BG[r,g,b,a] を検出
			const bgMatch = line.match(/\\BG\[(\d+),(\d+),(\d+),([0-9.]+)\]/i);
			let bgColor = null;
			let lineText = line;

			if (bgMatch) {
				const r = Number(bgMatch[1]);
				const g = Number(bgMatch[2]);
				const b = Number(bgMatch[3]);
				const a = Number(bgMatch[4]);
				bgColor = `rgba(${r},${g},${b},${a})`;

				// テキストから制御文字を除去
				lineText = line.replace(bgMatch[0], "");
			}

			// 背景を塗る（contentsBack に）
			if (bgColor) {
				const ctx = this.contentsBack.context;
				const radius = 28; // ← 角の丸みの半径（お好みで調整）

				ctx.save();
				ctx.fillStyle = bgColor;

				const x = rect.x + 80;               // 左余白（調整可）
				const w = rect.width - 160;           // 右余白も含めて幅調整
				const h = this.lineHeight();
				const ry = y;

				// パスを使って角丸の四角形を描く
				ctx.beginPath();
				ctx.moveTo(x + radius, ry);
				ctx.lineTo(x + w - radius, ry);
				ctx.quadraticCurveTo(x + w, ry, x + w, ry + radius);
				ctx.lineTo(x + w, ry + h - radius);
				ctx.quadraticCurveTo(x + w, ry + h, x + w - radius, ry + h);
				ctx.lineTo(x + radius, ry + h);
				ctx.quadraticCurveTo(x, ry + h, x, ry + h - radius);
				ctx.lineTo(x, ry + radius);
				ctx.quadraticCurveTo(x, ry, x + radius, ry);
				ctx.closePath();

				ctx.fill();
				ctx.restore();
			}


			// テキストを描画
			this.drawTextEx(lineText, rect.x, y, rect.width);
			y += this.lineHeight();
		}
	};


	Window_ScrollBox.prototype.contentsHeight = function() {
		return Math.max(this._allTextHeight, 1);
	};

	Window_ScrollBox.prototype.overallHeight = function() {
		return this.contentsHeight();
	};



	// ▼ ScrollBoxWindow.js 末尾パッチ：倍率＋行数の二段マージン ▼
	(() => {
		const OVERFLOW_SCALE = 1.01;     // 全体を8%水増し（7〜12%の範囲で調整推奨）
		const EXTRA_LINES = 2;        // さらに下に2行ぶんの余白を追加

		Window_ScrollBox.prototype.setText = function (text) {
			this._text = text || "";
			const t = this._text.replace(/\\BG\[[^]]*\]/gi, "");
			const measured = this.textSizeEx(t).height;
			const scaled = Math.ceil(measured * OVERFLOW_SCALE);
			this._allTextHeight = scaled + this.lineHeight() * EXTRA_LINES;
			this.createContents();
			this.refresh();
			this.scrollTo(0, 0);
		};

		Window_ScrollBox.prototype.contentsHeight = function () {
			return Math.max(this._allTextHeight, 1);
		};
	})();





	window.Window_ScrollBox = Window_ScrollBox;
}