/*:
 * @target MZ
 * @plugindesc MPP_ChoiceEX ヘルプ表示拡張（背景変更・ピクチャ連動）
 * @author Gemini
 *
 * @param helpBackground
 * @text ヘルプ背景タイプ
 * @desc ヘルプウィンドウの背景を指定します。
 * @type select
 * @option ウインドウ
 * @value 0
 * @option 暗くする
 * @value 1
 * @option 透明
 * @value 2
 * @default 2
 *
 * @param pictureId
 * @text ピクチャ番号
 * @desc 連動して表示するピクチャの番号です（0で非表示）。
 * @type number
 * @default 90
 *
 * @param pictureX
 * @text ピクチャX座標
 * @desc ピクチャを表示するX座標です。
 * @type number
 * @default 800
 *
 * @param pictureY
 * @text ピクチャY座標
 * @desc ピクチャを表示するY座標です。
 * @type number
 * @default 200
 *
 * @param picturePrefix
 * @text 画像名の接頭辞
 * @desc 読み込む画像名の頭文字です。これに選択肢番号(0〜)が足されます。
 * @default Help_Index_
 *
 * @help
 * MPP_ChoiceEXの選択肢ヘルプ機能を拡張します。
 * * 【画像名のルール】
 * 接頭辞が「Help_Index_」の場合、一番上の選択肢にカーソルを合わせると
 * 「Help_Index_0」という名前の画像が読み込まれます。
 */

(() => {
    'use strict';

    const pluginName = 'MPP_HelpExtension';
    const params = PluginManager.parameters(pluginName);
    
    const HELP_BG = Number(params.helpBackground || 2);
    const PIC_ID = Number(params.pictureId || 0);
    const PIC_X = Number(params.pictureX || 0);
    const PIC_Y = Number(params.pictureY || 0);
    const PIC_PREFIX = params.picturePrefix || 'Help_Index_';

    // 1. ヘルプ更新時の処理（背景変更 ＆ ピクチャ表示）
    const _Window_ChoiceList_updateHelp = Window_ChoiceList.prototype.updateHelp;
    Window_ChoiceList.prototype.updateHelp = function() {
        // 背景設定をパラメータから適用
        $gameMessage.setBackground(HELP_BG); 
        
        // 元の処理を実行
        _Window_ChoiceList_updateHelp.apply(this, arguments);

        // ピクチャ連動機能
        if (PIC_ID > 0) {
            const index = this.index();
            const fileName = PIC_PREFIX + index;
            
            // 一旦不透明度0で表示してから、10フレームでフェードイン
            $gameScreen.showPicture(PIC_ID, fileName, 0, PIC_X, PIC_Y, 100, 100, 0, 0);
            $gameScreen.movePicture(PIC_ID, 0, PIC_X, PIC_Y, 100, 100, 255, 0, 10);
        }
    };

    // 2. 選択肢を閉じる時にピクチャを消去（お掃除）
    const eraseHelpPic = () => {
        if (PIC_ID > 0) $gameScreen.erasePicture(PIC_ID);
    };

    const _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
    Window_ChoiceList.prototype.callOkHandler = function() {
        eraseHelpPic();
        _Window_ChoiceList_callOkHandler.apply(this, arguments);
    };

    const _Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
    Window_ChoiceList.prototype.callCancelHandler = function() {
        eraseHelpPic();
        _Window_ChoiceList_callCancelHandler.apply(this, arguments);
    };

})();