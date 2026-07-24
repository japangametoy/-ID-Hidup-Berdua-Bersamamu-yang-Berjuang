/*:
 * @target MZ
 * @plugindesc メッセージウィンドウ不透明度変更（元の透明設定維持版）
 * @author riru (MZ完全改修: ツクール用)
 *
 * @help MessageWindow_Opacity.js
 *
 * riru氏のMV版をベースに、ツクールMZの仕様、および他プラグインとの競合、
 * さらに「イベントコマンド側で最初から透明に設定されている文章」が
 * 枠ありに戻ってしまう現象を完全に修正した決定版です。
 *
 * 【プラグインコマンド】
 * 1. 不透明度の設定 (SetOpacity)
 * ウィンドウの不透明度を 0～255 の間で変更します。
 * 「0」に指定すると、イベント側の設定を無視してすべて強制透明化します。
 *
 * 2. 不透明度のリセット (ResetOpacity)
 * 不透明度を通常の初期状態（255）に戻します。
 * 戻した後は、イベントコマンド個別の背景設定（通常・暗く・透明）に従います。
 *
 * @command SetOpacity
 * @text 不透明度の設定
 * @desc メッセージウィンドウ不透明度を変更します。0で完全に透明（枠・背景なし）になります。
 *
 * @arg opacity
 * @text 不透明度
 * @desc ウィンドウの不透明度を指定します（0:完全に透明 ～ 255:通常）。
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @command ResetOpacity
 * @text 不透明度のリセット
 * @desc ウィンドウの不透明度を通常の初期値（255）に戻します。
 */

(() => {
    'use strict';

    const pluginName = decodeURIComponent(document.currentScript.src.match(/^.*\/js\/plugins\/(.+)\.js$/)[1]);

    //--- データ管理 ---
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._messageWindowOpacity = 255;
    };

    Game_System.prototype.getMessageWindowOpacity = function() {
        if (this._messageWindowOpacity === undefined) this._messageWindowOpacity = 255;
        return this._messageWindowOpacity;
    };

    Game_System.prototype.setMessageWindowOpacity = function(value) {
        this._messageWindowOpacity = Number(value).clamp(0, 255);
    };

    //--- プラグインコマンド登録 ---
    PluginManager.registerCommand(pluginName, "SetOpacity", args => {
        $gameSystem.setMessageWindowOpacity(Number(args.opacity || 0));
    });

    PluginManager.registerCommand(pluginName, "ResetOpacity", () => {
        $gameSystem.setMessageWindowOpacity(255);
    });

    // MV用互換
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'MessageWindowOpacity') {
            $gameSystem.setMessageWindowOpacity(Number(args[0] || 255));
        }
    };

    //--- 描画処理のスマート制御（元のイベント設定を尊重する） ---
    Window_Message.prototype.applyTransparentMZ = function() {
        if (!$gameSystem) return;
        
        const targetOpacity = $gameSystem.getMessageWindowOpacity();
        const currentBgType = $gameMessage.isTriggered ? $gameMessage.background() : (this._background || 0); 
        // ※背景タイプ 0:通常, 1:暗くする, 2:透明

        // 1. プラグインコマンドで「0（強制透明）」が指定されている、
        // もしくは、イベントコマンド側で最初から「背景：透明（2）」に設定されている場合
        if (targetOpacity === 0 || $gameMessage.background() === 2) {
            this.opacity = 0;
            this.frameVisible = false; 
            if (this._bgSprite) this._bgSprite.visible = false;
            
            if (this._nameBoxWindow) {
                this._nameBoxWindow.opacity = 0;
                this._nameBoxWindow.frameVisible = false;
            }
        } else {
            // 2. プラグインコマンドが通常（255など）で、イベント側が通常か暗くするの場合
            this.opacity = targetOpacity;
            this.frameVisible = (targetOpacity > 0 && $gameMessage.background() === 0);
            
            if (this._bgSprite) {
                this._bgSprite.visible = ($gameMessage.background() === 1);
                this._bgSprite.alpha = targetOpacity / 255;
            }
            if (this._nameBoxWindow) {
                // 名前枠はメッセージ側が「暗くする」の時もMZ標準では枠が表示されるので、それに準拠
                this._nameBoxWindow.opacity = targetOpacity;
                this._nameBoxWindow.frameVisible = (targetOpacity > 0 && $gameMessage.background() !== 2);
            }
        }
    };

    // 各タイミングでのフック処理
    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
        this.applyTransparentMZ();
    };

    const _Window_Message_setBackgroundType = Window_Message.prototype.setBackgroundType;
    Window_Message.prototype.setBackgroundType = function(type) {
        _Window_Message_setBackgroundType.call(this, type);
        this.applyTransparentMZ();
    };

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        this.applyTransparentMZ();
    };

})();