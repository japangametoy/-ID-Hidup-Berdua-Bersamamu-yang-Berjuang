//===================================================================
//KG_SharpPicture.js
//奇数サイズピクチャのぼやけを防止します
//===================================================================
//Copyright (c) 2022 蔦森くいな
//Released under the MIT license.
//http://opensource.org/licenses/mit-license.php
//-------------------------------------------------------------------
//blog   : https://kuina.games/
//Twitter: https://twitter.com/Kuina_T
//===================================================================
//＜更新情報＞
//　ver1.0.0 2022/07/08 初版
//===================================================================

/*:
 * @target MZ
 * @plugindesc 奇数サイズピクチャのぼやけを防止します
 * @author 蔦森くいな
 *
 * @help
 * RPGツクールのピクチャは縦・横どちらかの「画像サイズが奇数」かつ、
 * 原点が「中央」である場合にピクチャがぼやける現象が発生します。
 * 
 * このプラグインを導入する事で、奇数サイズのピクチャを使用した場合でも
 * 画像がぼやける事を防止できます。
 * 
 * 利用規約：
 * このプラグインは商用・非商用を問わず無料でご利用いただけます。
 * どのようなゲームに使っても、どのように加工していただいても構いません。
 * MIT Licenseにつき著作権表示とライセンスURLは残しておいて下さい。
 */

(() => {
    const _Sprite_Picture_updateOrigin = Sprite_Picture.prototype.updateOrigin;
    Sprite_Picture.prototype.updateOrigin = function () {
        _Sprite_Picture_updateOrigin.apply(this, arguments);
        const picture = this.picture();
        if (picture.origin() !== 0) {
            this.anchor.x = Math.round(this.width * 0.5) / this.width;
            this.anchor.y = Math.round(this.height * 0.5) / this.height;
        }
    };
})();
