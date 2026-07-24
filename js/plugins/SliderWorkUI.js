/*:
 * @target MZ
 * @plugindesc 【仕事UI】マップ画面連動型スライダー (ボヤケ防止)
 * @author Gemini
 *
 * @help SliderWorkUI.js
 * * ■ 概要
 * マップ画面の上に直接スライダーを表示するため、文字ピクチャや
 * 他のピクチャがぼやけることなく、リアルタイムに数値を変化させられます。
 * * ■ 使用方法
 * 1. 各ボタン・つまみの画像を img/pictures に用意してください。
 * 2. イベントの「スクリプト」で以下を実行して表示・非表示を切り替えます。
 * * 表示開始: $gameScreen.showSlider();
 * 非表示: $gameScreen.hideSlider();
 * * ■ パラメータ設定
 * 参照変数：最大値。格納変数：現在の操作値。
 * * @param --- 基本変数設定 ---
 * @param CurrentPtVariable
 * @text 参照：現在の所持pt (変数ID)
 * @type variable
 * @default 1
 * @param ConsumePtVariable
 * @text 格納：決定した消費pt (変数ID)
 * @type variable
 * @default 2
 *
 * @param --- ゲージ・つまみ配置 ---
 * @param SliderX
 * @text ゲージ左端X座標
 * @type number
 * @default 200
 * @param SliderY
 * @text ゲージY中心座標
 * @type number
 * @default 300
 * @param SliderWidth
 * @text ゲージの長さ
 * @type number
 * @default 400
 * @param SliderKnobImage
 * @text つまみ画像 (img/pictures)
 * @type file
 * @dir img/pictures
 *
 * @param --- プラスボタン設定 ---
 * @param PlusButtonImage
 * @text プラスボタン画像
 * @type file
 * @dir img/pictures
 * @default ui_work_pointmenu_plus
 * @param PlusBtnX
 * @text プラスボタンX座標
 * @type number
 * @default 650
 * @param PlusBtnY
 * @text プラスボタンY座標
 * @type number
 * @default 285
 *
 * @param --- マイナスボタン設定 ---
 * @param MinusButtonImage
 * @text マイナスボタン画像
 * @type file
 * @dir img/pictures
 * @default ui_work_pointmenu_minus
 * @param MinusBtnX
 * @text マイナスボタンX座標
 * @type number
 * @default 130
 * @param MinusBtnY
 * @text マイナスボタンY座標
 * @type number
 * @default 285
 */

(() => {
    const pluginName = "SliderWorkUI";
    const p = PluginManager.parameters(pluginName);
    const getNum = (k) => Number(p[k] || 0);

    //--- Game_Screen に状態を保存 ---
    const _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this._sliderVisible = false;
    };

    Game_Screen.prototype.showSlider = function() { this._sliderVisible = true; };
    Game_Screen.prototype.hideSlider = function() { this._sliderVisible = false; };

    //--- マップ画面のレイヤーにスライダーを追加 ---
    const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        _Spriteset_Map_createUpperLayer.apply(this, arguments);
        this.createSliderSprites();
    };

    Spriteset_Map.prototype.createSliderSprites = function() {
        this._sliderContainer = new Sprite();
        this.addChild(this._sliderContainer);

        const sx = getNum('SliderX'), sy = getNum('SliderY'), sw = getNum('SliderWidth');

        this._baseBar = new Sprite(new Bitmap(sw, 8));
        this._baseBar.x = sx; this._baseBar.y = sy;
        this._baseBar.bitmap.smooth = false;
        this._baseBar.bitmap.fillAll('rgba(0,0,0,0.5)');
        this._sliderContainer.addChild(this._baseBar);

        this._gaugeBar = new Sprite(new Bitmap(sw, 8));
        this._gaugeBar.x = sx; this._gaugeBar.y = sy;
        this._gaugeBar.bitmap.smooth = false;
        this._sliderContainer.addChild(this._gaugeBar);

        this._knob = this.createManagedSprite(p['SliderKnobImage'], sx, sy, true);
        this._btnMinus = this.createManagedSprite(p['MinusButtonImage'], getNum('MinusBtnX'), getNum('MinusBtnY'));
        this._btnPlus = this.createManagedSprite(p['PlusButtonImage'], getNum('PlusBtnX'), getNum('PlusBtnY'));
        
        this._isDragging = false;
    };

    Spriteset_Map.prototype.createManagedSprite = function(name, x, y, isCenter = false) {
        const sprite = new Sprite();
        sprite.x = x; sprite.y = y;
        if (name) {
            sprite.bitmap = ImageManager.loadPicture(name);
            sprite.bitmap.addLoadListener(() => {
                sprite.bitmap.smooth = false;
                if (isCenter) { sprite.anchor.x = 0.5; sprite.anchor.y = 0.5; }
            });
        }
        this._sliderContainer.addChild(sprite);
        return sprite;
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.apply(this, arguments);
        if (this._sliderContainer) {
            this._sliderContainer.visible = !!$gameScreen._sliderVisible;
            if ($gameScreen._sliderVisible) this.updateSliderLogic();
        }
    };

    Spriteset_Map.prototype.updateSliderLogic = function() {
        const max = $gameVariables.value(getNum('CurrentPtVariable')) || 1;
        const current = $gameVariables.value(getNum('ConsumePtVariable'));
        const tx = TouchInput.x, ty = TouchInput.y;
        const sx = getNum('SliderX'), sy = getNum('SliderY'), sw = getNum('SliderWidth');

        if (TouchInput.isTriggered()) {
            if (this.isHit(this._btnMinus, tx, ty)) this.applyVal(current - 1, max);
            if (this.isHit(this._btnPlus, tx, ty)) this.applyVal(current + 1, max);
            if (Math.abs(ty - sy) < 40 && tx >= sx - 20 && tx <= sx + sw + 20) this._isDragging = true;
        }

        if (this._isDragging) {
            if (TouchInput.isPressed()) {
                this.applyVal(Math.round(((tx - sx) / sw) * max), max);
            } else {
                this._isDragging = false;
            }
        }

        const rate = current / max;
        this._gaugeBar.bitmap.clear();
        this._gaugeBar.bitmap.fillRect(0, 0, sw * rate, 8, '#ffa500');
        this._knob.x = sx + (sw * rate);
        this._knob.y = sy + 4;
    };

    Spriteset_Map.prototype.applyVal = function(v, max) {
        const res = v.clamp(0, max);
        if ($gameVariables.value(getNum('ConsumePtVariable')) !== res) {
            $gameVariables.setValue(getNum('ConsumePtVariable'), res);
            if (res % 5 === 0) SoundManager.playCursor();
        }
    };

    Spriteset_Map.prototype.isHit = function(sprite, tx, ty) {
        if (!sprite || !sprite.bitmap || !sprite.bitmap.isReady()) return false;
        const rect = {
            x: sprite.x - (sprite.anchor.x * sprite.width),
            y: sprite.y - (sprite.anchor.y * sprite.height),
            w: sprite.width, h: sprite.height
        };
        return tx >= rect.x && tx <= rect.x + rect.w && ty >= rect.y && ty <= rect.y + rect.h;
    };
})();