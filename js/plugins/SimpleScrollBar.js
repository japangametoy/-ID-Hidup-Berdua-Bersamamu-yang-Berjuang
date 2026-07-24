// SimpleScrollBar.js Ver.1.2.0
// MIT License (C) 2023 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @orderBefore FesWindowDimmer
* @plugindesc Introduce scrollbar.
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/498100561.html
* @help Ver.1.2.0
*
* @param drawBackground
* @text Draw Background
* @desc Draws the background of the scrollbar.
* @type boolean
* @default true

* @param barWidth
* @text Scroll Bar Width
* @desc Specifies the width of the scrollbar.
* @type number
* @min 1
* @default 3
*
* @param barColor1
* @text Scroll Bar Color
* @desc Specifies the color of the scrollbar.
* @default rgba(255, 255, 255, 1)

* @param barColor2
* @text Scroll Bar Background Color
* @desc Specifies the color of the scrollbar.
* @default rgba(128, 128, 128, 1)
*
* @param fadeOut
* @text Fade Out
* @desc If you do not use it for a while, the scroll bar will fade out.
* @type boolean
* @default false
*
* @param onlyWhileScrolling
* @text Only While Scrolling
* @desc The scrollbar is only displayed while scrolling.
* @type boolean
* @default false
*
* @param waitDuration
* @text Wait Duration
* @desc The number of frames it will take before the fade out begins.
* @type number
* @default 60
*
* @param fadeOutDuration
* @text Fade Out Duration
* @desc The number of frames it takes to fade out.
* @type number
* @default 10
*
*/

/*:ja
* @target MZ
* @orderBefore FesWindowDimmer
* @plugindesc スクロールバーを導入します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/498100561.html
* @help
* [更新履歴]
* 2023/02/09：Ver.1.0.0　公開。
* 2023/02/09：Ver.1.1.0　フェードアウト可能にしました。
* 2023/02/10：Ver.1.1.1　挙動修正。
* 2023/07/02：Ver.1.2.0　スクロール位置が間違っている不具合を修正。
*
* @param drawBackground
* @text 背景を描画する
* @desc スクロールバーの背景を描画します。
* @type boolean
* @default true

* @param barWidth
* @text スクロールバーの幅
* @desc スクロールバーの幅を指定します。
* @type number
* @min 1
* @default 3
*
* @param barColor1
* @text スクロールバーの色
* @desc スクロールバーの色を指定します。
* @default rgba(255, 255, 255, 1)

* @param barColor2
* @text スクロールバーの背景色
* @desc スクロールバーの色を指定します。
* @default rgba(128, 128, 128, 1)
*
* @param fadeOut
* @text フェードアウトする
* @desc しばらく操作しないとスクロールバーがフェードアウトします。
* @type boolean
* @default false
*
* @param onlyWhileScrolling
* @text スクロール中のみ
* @desc スクロール中のみスクロールバーを表示します。
* @type boolean
* @default false
*
* @param waitDuration
* @text ウェイト時間
* @desc フェードアウト開始までに掛かるフレーム数。
* @type number
* @default 60
*
* @param fadeOutDuration
* @text フェードアウト時間
* @desc フェードアウトに掛かるフレーム数。
* @type number
* @default 10
*
*/

'use strict';

{
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const drawBackground = parameters["drawBackground"] === "true";
	const barWidth = Number(parameters["barWidth"]);
	const barColor1 = parameters["barColor1"];
	const barColor2 = parameters["barColor2"];
	const fadeOut = parameters["fadeOut"] === "true";
	const onlyWhileScrolling = !fadeOut || parameters["onlyWhileScrolling"] === "true";
	const waitDuration = Number(parameters["waitDuration"]);
	const fadeOutDuration = Number(parameters["fadeOutDuration"]);
	const scrollBarDuration = waitDuration + fadeOutDuration;

	//-----------------------------------------------------------------------------
	// Window_Scrollable

	const _Window_Scrollable_initialize = Window_Scrollable.prototype.initialize;
	Window_Scrollable.prototype.initialize = function(rect) {
		this._scrollBarSpriteX = null;
		this._scrollBarSpriteY = null;
		this._scrollBarX = NaN;
		this._scrollBarY = NaN;
		this._scrollBarMaxX = NaN;
		this._scrollBarMaxY = NaN;
		this._scrollBarDuration = 0;
		this.scrollBarOpacity = 255;
		this.scrollBarVisible = true;
		_Window_Scrollable_initialize.call(this, rect);
	};

	const _Window_Scrollable__createAllParts = Window_Scrollable.prototype._createAllParts;
	Window_Scrollable.prototype._createAllParts = function() {
		_Window_Scrollable__createAllParts.call(this);
		this._createScrollBarSprites();
	};

	Window_Scrollable.prototype._createScrollBarSprites = function() {
		this._scrollBarSpriteX = new Sprite();
		this.addChild(this._scrollBarSpriteX);
		this._scrollBarSpriteY = new Sprite();
		this.addChild(this._scrollBarSpriteY);
	};

	const _Window_Scrollable_updateTransform = Window_Scrollable.prototype.updateTransform;
	Window_Scrollable.prototype.updateTransform = function() {
		_Window_Scrollable_updateTransform.call(this);
		this._updateScrollBars();
	};

	Window_Scrollable.prototype._updateScrollBars = function() {
		this._scrollBarSpriteX.visible = this._scrollBarSpriteY.visible = this.isOpen() && this.scrollBarVisible;
	};

	const _Window_Scrollable_createContents = Window_Scrollable.prototype.createContents;
	Window_Scrollable.prototype.createContents = function() {
		_Window_Scrollable_createContents.call(this);
		this.createContentsScrollBars();
	};

	Window_Scrollable.prototype.createContentsScrollBars = function() {
		this.createContentsScrollBarX();
		this.createContentsScrollBarY();
	};

	Window_Scrollable.prototype.createContentsScrollBarX = function() {
		const sprite = this._scrollBarSpriteX;
		const x = this.padding + barWidth;
		const y = this.padding + this.innerHeight;
		const w = this.innerWidth - barWidth * 2;
		const h = barWidth;
		sprite.bitmap = new Bitmap(w, h);
		sprite.setFrame(0, 0, w, h);
		sprite.move(x, y);
	};

	Window_Scrollable.prototype.createContentsScrollBarY = function() {
		const sprite = this._scrollBarSpriteY;
		const x = this.padding + this.innerWidth;
		const y = this.padding + barWidth;
		const w = barWidth;
		const h = this.innerHeight - barWidth * 2;
		sprite.bitmap = new Bitmap(w, h);
		sprite.setFrame(0, 0, w, h);
		sprite.move(x, y);
	};

	const _Window_Scrollable_destroyContents = Window_Scrollable.prototype.destroyContents;
	Window_Scrollable.prototype.destroyContents = function() {
		_Window_Scrollable_destroyContents.call(this);
		const bitmapX = this._scrollBarSpriteX.bitmap;
		const bitmapY = this._scrollBarSpriteY.bitmap;
		if (bitmapX) {
			bitmapX.destroy();
			bitmapY.destroy();
		}
	};

	const _Window_Scrollable_scrollTo = Window_Scrollable.prototype.scrollTo;
	Window_Scrollable.prototype.scrollTo = function(x, y) {
		if (fadeOut) {
			const maxScrollX = this.maxScrollX();
			const maxScrollY = this.maxScrollY();
			const scrollX = x.clamp(0, maxScrollX);
			const scrollY = y.clamp(0, maxScrollY);
			if (!onlyWhileScrolling || this._scrollX !== scrollX || this._scrollY !== scrollY) {
				this._scrollBarDuration = scrollBarDuration;
			}
		}
		_Window_Scrollable_scrollTo.apply(this, arguments);
	};

	const _Window_Scrollable_update = Window_Scrollable.prototype.update;
	Window_Scrollable.prototype.update = function() {
		_Window_Scrollable_update.call(this);
		this.updateScrollBars();
	};

	Window_Scrollable.prototype.updateScrollBars = function() {
		this.updateScrollBarX();
		this.updateScrollBarY();
		this.updateScrollBarOpacity();
	};

	Window_Scrollable.prototype.updateScrollBarOpacity = function() {
		if (fadeOut) {
			if (this._scrollBarMaxX === 0 && this._scrollBarMaxY === 0) {
				this._scrollBarDuration = 0;
			}
			if (this._scrollBarDuration > 0) {
				this._scrollBarDuration--;
				if (this._scrollBarDuration > fadeOutDuration) {
					this.scrollBarOpacity = 255;
				} else {
					this.scrollBarOpacity *= this._scrollBarDuration / (this._scrollBarDuration + 1);
				}
			} else {
				this.scrollBarOpacity = 0;
			}
		}
		this._scrollBarSpriteX.opacity = this._scrollBarSpriteY.opacity = this.scrollBarOpacity;
	};

	Window_Scrollable.prototype.updateScrollBarX = function() {
		const scrollX = this.scrollX();
		const maxScrollX = this.maxScrollX();
		if (this._scrollBarX !== scrollX || this._scrollBarMaxX !== maxScrollX) {
			this._scrollBarX = scrollX;
			this._scrollBarMaxX = maxScrollX;
			this.drawScrollBarX();
		}
	};

	Window_Scrollable.prototype.drawScrollBarX = function() {
		const sprite = this._scrollBarSpriteX;
		const bitmap = sprite.bitmap;
		bitmap.clear();
		if (this._scrollBarMaxX === 0) return;
		const ratio = this._scrollBarX / this._scrollBarMaxX;
		const scaleX = this.innerWidth / this.overallWidth();
		const width = bitmap.width * scaleX;
		const x = ratio * (bitmap.width - width);
		if (drawBackground) {
			bitmap.fillAll(barColor2);
		}
		bitmap.fillRect(x, 0, width, bitmap.height, barColor1);
	};

	Window_Scrollable.prototype.updateScrollBarY = function() {
		const scrollY = this.scrollY();
		const maxScrollY = this.maxScrollY();
		if (this._scrollBarY !== scrollY || this._scrollBarMaxY !== maxScrollY) {
			this._scrollBarY = scrollY;
			this._scrollBarMaxY = maxScrollY;
			this.drawScrollBarY();
		}
	};

	Window_Scrollable.prototype.drawScrollBarY = function() {
		const sprite = this._scrollBarSpriteY;
		const bitmap = sprite.bitmap;
		bitmap.clear();
		if (this._scrollBarMaxY === 0) return;
		const ratio = this._scrollBarY / this._scrollBarMaxY;
		const scaleY = this.innerHeight / this.overallHeight();
		const height = bitmap.height * scaleY;
		const y = ratio * (bitmap.height - height);
		if (drawBackground) {
			bitmap.fillAll(barColor2);
		}
		bitmap.fillRect(0, y, bitmap.width, height, barColor1);
	};

	//-----------------------------------------------------------------------------
	// Window_Selectable

	const _Window_Selectable_refreshCursor = Window_Selectable.prototype.refreshCursor;
	Window_Selectable.prototype.refreshCursor = function() {
		_Window_Selectable_refreshCursor.call(this);
		if (!onlyWhileScrolling && this.isCursorMovable()) {
			this._scrollBarDuration = scrollBarDuration;
		}
	};
}