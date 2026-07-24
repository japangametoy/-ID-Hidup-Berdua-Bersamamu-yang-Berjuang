/*:
 * @target MZ
 * @plugindesc クリアデータをロードした時に自動で別のマップへ飛ばします
 * * @param ClearSwitchId
 * @text クリアフラグのスイッチ番号
 * @desc クリアデータだと判定するためのスイッチ番号
 * @default 100
 *
 * @param TargetMapId
 * @text 移動先のマップID
 * @desc ロード後に飛ばす先のマップID
 * @default 11
 *
 * @param TargetX
 * @text 移動先のX座標
 * @desc 飛ばす先のX座標
 * @default 5
 *
 * @param TargetY
 * @text 移動先のY座標
 * @desc 飛ばす先のY座標
 * @default 5
 */

(() => {
    const pluginName = "Scene_AfterLoad";
    const parameters = PluginManager.parameters(pluginName);
    const switchId = Number(parameters["ClearSwitchId"] || 100);
    const mapId = Number(parameters["TargetMapId"] || 11);
    const x = Number(parameters["TargetX"] || 5);
    const y = Number(parameters["TargetY"] || 5);

    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.call(this);
        
        // セーブデータ内のスイッチを確認
        if ($gameSwitches.value(switchId)) {
            // クリアデータならマップ移動を予約
            $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
        }
    };
})();