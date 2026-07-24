// Transition200X.js Ver.3.3.1
// MIT License (C) 2024 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @plugindesc Adding to the show/hide screen transition effect like to  RPG Maker XP/VX.
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/499185153.html
* @help Ver.3.3.1
* Place gradient wipe images in the img/transitions folder.
* The color of "Transfer Player" is reflected when fade to white.
*
* This plugin is a modification of Shioinu's PD_Transition_MZ.js.
*
* -----------------------------------------------
* Copyright (c) 2020 PixelDOG
* Released under the MIT license
* https://opensource.org/licenses/mit-license.php
* -----------------------------------------------
*
* [Gradient Wipe]
* Set to (None) for a standard fade.
* A ! at the beginning of the filename will reverse the order of the gradient wipe.
* A $ at the beginning of the filename will preserve the aspect ratio of the image.
*
* [Mode]
* - Normal
*  This transition makes the screen a single color.
*
* - Instantaneous
*  This transition that erases the screenshot.
*
* - Instantaneous (XP)
*  Similar to "Instantaneous," but effects other than Fade (except for Gradient Wipe) are inverted.
*
* [Smoothness]
* A gradient will be added to the gradient wipe.
* Also, Scroll, Split, Zoom, Mosaic and Raster Scroll will change only in Instantaneous (XP) mode.
*
* @command hideScreen
* @text Hide/Freeze Screen
* @desc Hide the screen.
* Freeze the screen when not in normal mode
*
* @arg duration
* @text Duration
* @desc Specifies the number of frames.
* Enter a number or select from the combo box.
* @default normal
* @type combo
* @option instant
* @option faster
* @option normal
* @option slower
*
* @arg wait
* @text Wait for Completion
* @desc Wait for the transition to complete.
* @default true
* @type boolean
*
* @command showScreen
* @text Show Screen
* @desc Show the screen.
*
* @arg duration
* @text Duration
* @desc Specifies the number of frames.
* Enter a number or select from the combo box.
* @default normal
* @type combo
* @option instant
* @option faster
* @option normal
* @option slower
*
* @arg wait
* @text Wait for Completion
* @desc Wait for the transition to complete.
* @default true
* @type boolean
*
* @command changeTransition
* @text Change Transition
* @desc Set the transition.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
*
* @option Plugin Command (Hide)
* @option Plugin Command (Show)
* @option Transfer Player (Hide)
* @option Transfer Player (Show)
* @option Start Battle (Hide)
* @option Start Battle (Show)
* @option End Battle (Hide)
* @option End Battle (Show)
* @default Plugin Command (Hide)
*
* @arg name
* @text Name
* @desc Specify a name.
* @type select
* @option Fade Out/In (Gradient Wipe)
* @value Fade
* @option Scroll Up
* @option Scroll Down
* @option Scroll Left
* @option Scroll Right
* @option Horizontal Split/Join Horizontally
* @value Horizontal
* @option Vertical Split/Join Vertically
* @value Vertical
* @option Quadrisection/Omnidirectional
* @value Quad
* @option Zoom In/Out
* @value Zoom
* @option Mosaic
* @option Raster Scroll
* @default Fade
*
* @command changeImage
* @text Change Image
* @desc Set the gradient wipe image.
* Set to (None) for the standard fade.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
*
* @option Plugin Command (Hide)
* @option Plugin Command (Show)
* @option Transfer Player (Hide)
* @option Transfer Player (Show)
* @option Start Battle (Hide)
* @option Start Battle (Show)
* @option End Battle (Hide)
* @option End Battle (Show)
* @default Plugin Command (Hide)
*
* @arg name
* @text Image
* @desc Specify a file name.
* "filename,invert" to invert the gradient
* @type file
* @default
* @dir img/transitions
*
* @command changeMode
* @text Change Mode
* @desc Choose whether to hide or freeze the screen.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
* @option Plugin Command
* @option Transfer Player
* @option Start Battle
* @option End Battle
* @default Plugin Command
*
* @arg mode
* @text Mode
* @desc Switch modes.
* Some effects will change in XP.
* @type select
* @option Normal
* @option Instantaneous
* @option Instantaneous (XP)
* @value XP
* @default Normal
*
* @command changeColor
* @text Change Color
* @desc Change the color.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
* @option Plugin Command
* @option Transfer Player
* @option Start Battle
* @option End Battle
* @default Plugin Command
*
* @arg color
* @text Color
* @desc Please enter RGB with comma delimiter.
* Black if not entered.
* @type string
* @default 
*
* @command changeSmoothness
* @text Change Smoothness
* @desc Change the smoothness of some transitions.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
* @option Plugin Command
* @option Transfer Player
* @option Start Battle
* @option End Battle
* @default Plugin Command
*
* @arg smoothness
* @text Smoothness
* @desc Smooths out screen changes.
* Specify in the range 0-7. 0 is no smoothing.
* @default 4.5
*
* @command changeEasing
* @text Change Easing
* @desc Change the easing of some transitions.
*
* @arg type
* @text Type
* @desc Select the type of screen transition.
* @type select
* @option Plugin Command
* @option Transfer Player
* @option Start Battle
* @option End Battle
* @default Plugin Command
*
* @arg easing
* @text Easing
* @desc Enable easing.
* @default false
* @type boolean
*
* @command clearTransition
* @text Clear Transition
* @desc Resets the transition settings to the default.
*
* @command waitForCompletion
* @text Wait for Completion
* @desc Wait for the transition to complete.
*
* @param pluginCommand
* @text Plugin Command
* @desc Select the type of screen transition.
* @type struct<settings>
*
* @param transfer
* @text Transfer Player
* @desc Select the type of screen transition.
* @type struct<settings>
*
* @param battleStart
* @text Battle Start
* @desc Select the type of screen transition.
* @type struct<settings>
*
* @param battleEnd
* @text Battle End
* @desc Select the type of screen transition.
* @type struct<settings>
*
* @param instant
* @text Instant
* @desc Specifies the number of frames.
* @type number
* @default 1
*
* @param faster
* @text Faster
* @desc Specifies the number of frames.
* @type number
* @default 24
*
* @param normal
* @text Normal
* @desc Specifies the number of frames.
* @type number
* @default 48
*
* @param slower
* @text Slower
* @desc Specifies the number of frames.
* @type number
* @default 96
*
* @param encounterEffect
* @text Encounter Effect
* @desc Select which Maker you want to use for encounter effect.
* @type select
* @option 2000
* @option XP
* @option VX
* @option VXAce
* @option Fes
* @option MZ
* @default MZ
*
* @param hideCharacters
* @text Hide Characters
* @desc Hide characters during encounter effects.
* @type select
* @option default
* @option true
* @option false
* @default default
*
* @param sceneTransition
* @text Scene Transition
* @desc Select which Maker you want to use for scene transition.
* @type select
* @option 2000
* @option XP
* @option VX (VXAce)
* @value VX
* @option MZ
* @default MZ
*
* @param speedUpWindows
* @text Speed Up Windows
* @desc Speeds up opening and closing of windows.
* "Default" will match the scene transition specifications.
* @type select
* @option default
* @option true
* @option false
* @default default
*
* @param blackout
* @text Blackout on Scene Change
* @desc MZ takes a long time to generate the scene, which breaks mosaic and raster scrolling.
* @type boolean
* @default false
*
* @param gameoverBgm
* @text Gameover BGM
* @desc Reproduction function of 2000 (bonus)
* @type struct<bgm>
*
* @param fadeSpeed
* @text Standard Fade Duration
* @desc Sets the fade duration common to the entire system.
* No Change:0  MZ:24  VXAce etc.:30
* @type number
* @default 0
*
* @param transitionSpeed
* @text Standard Transition Duration
* @desc Sets the transition duration common to the entire system.
* Fade Duration:0
* @type number
* @default 30
*
*/

/*~struct~settings:
*
* @param id1
* @text Name for Hide
* @desc Specify a name.
* @type select
* @option Fade Out/In (Gradient Wipe)
* @value Fade
* @option Scroll Up
* @option Scroll Down
* @option Scroll Left
* @option Scroll Right
* @option Horizontal Split/Join Horizontally
* @value Horizontal
* @option Vertical Split/Join Vertically
* @value Vertical
* @option Quadrisection/Omnidirectional
* @value Quad
* @option Zoom In/Out
* @value Zoom
* @option Mosaic
* @option Raster Scroll
* @default Fade
*
* @param name1
* @text Image for Hide
* @desc Specify a file name. 
* "filename,invert" to invert the gradient
* @type file
* @default
* @dir img/transitions
*
* @param id2
* @text Name for Show
* @desc Specify a name.
* @type select
* @option Fade Out/In (Gradient Wipe)
* @value Fade
* @option Scroll Up
* @option Scroll Down
* @option Scroll Left
* @option Scroll Right
* @option Horizontal Split/Join Horizontally
* @value Horizontal
* @option Vertical Split/Join Vertically
* @value Vertical
* @option Quadrisection/Omnidirectional
* @value Quad
* @option Zoom In/Out
* @value Zoom
* @option Mosaic
* @option Raster Scroll
* @default Fade
*
* @param name2
* @text Image for Show
* @desc Specify a file name.
* "filename,invert" to invert the gradient
* @type file
* @default
* @dir img/transitions
*
* @param mode
* @text Mode
* @desc Switch modes.
* @type select
* @option Normal
* @option Instantaneous
* @option Instantaneous (XP)
* @value XP
* @default Normal
*
* @param color
* @text Color
* @desc Please enter RGB with comma delimiter.
* Black if not entered.
* @type string
* @default 
*
* @param smoothness
* @text Smoothness
* @desc Smooths out screen changes.
* Specify in the range 0-7. 0 is no smoothing.
* @default 4.5
*
* @param easing
* @text Easing
* @desc Enable easing.
* @default false
* @type boolean
*/

/*~struct~bgm:
*
* @param name
* @text Name
* @desc 
* @type file
* @default
* @dir audio/bgm
*
* @param volume
* @text Volume
* @desc 
* @type number
* @default 90
* @min 0
*
* @param pitch
* @text Pitch
* @desc 
* @type number
* @default 100
* @min 0
*
* @param pan
* @text Pan
* @desc 
* @type number
* @default 0
* @min -100
* @max 100
*/
 
/*:ja
* @target MZ
* @plugindesc 画像によるトランジション演出機能を追加します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/499185153.html
* @help トランジション画像はimg/transitionsフォルダに配置してください。
* 「場所移動」の色はフェードを白にすると反映されます。
*
* このプラグインはしおいぬ氏のPD_Transition_MZ.jsを改変したものです。
*
* -----------------------------------------------
* Copyright (c) 2020 PixelDOG
* Released under the MIT license
* https://opensource.org/licenses/mit-license.php
* -----------------------------------------------
*
* [グラデーションワイプ]
* 画像（なし）にすると標準のフェードを行います。
* ファイル名先頭に!があるとトランジションの順序を反転します。
* ファイル名先頭に$があると画像のアスペクト比を保持します。
*
* [モード]
* ・通常
* 　画面を単色にするトランジションです。
*
* ・消去しない
* 　スクリーンショットを掻き消すトランジションです。
*
* ・消去しない（XP）
* 　「消去しない」と似ていますが、フェード（グラデーションワイプを除く）以外の演出が反転します。
*
* [滑らかさ]
* グラデーションワイプにグラデーションが入ります。
* また、消去しない（XP）モードのみスクロール、分割、ズーム、モザイク、ラスタスクロールが変化します。
*
* [更新履歴]
* 2023/04/30：Ver.1.0.0　公開。
* 2023/07/04：Ver.1.0.1　不具合修正。
* 2024/09/08：Ver.2.0.0　不具合修正。スムージング機能、エンカウントエフェクト、シーン遷移、プラグインコマンドを追加。
* 2024/10/11：Ver.2.0.1　VX、VXAce風のエンカウントエフェクトの不具合を修正。
* 2024/10/12：Ver.2.0.2　エンカウント時、ズームが解除されないよう変更。
* 2024/12/17：Ver.3.0.0　スクロール、分割、ズーム、モザイク、ラスタスクロールを追加。
* 2024/12/18：Ver.3.0.1　グラデーション反転機能を追加。
* 2024/12/22：Ver.3.1.0　イージング機能を追加。不具合修正。
* 2024/12/26：Ver.3.1.1　戦闘終了時の不具合修正。
* 2025/01/13：Ver.3.2.0　シーン変更時の挙動、エンカウントエフェクトの挙動、プラグインコマンドの挙動を修正。
* 2025/02/06：Ver.3.2.1　エンカウントエフェクトの不具合修正。
* 2025/03/22：Ver.3.2.2　場所移動の挙動を修正。
* 2025/04/27：Ver.3.3.0　ラスタスクロールの挙動を修正。
* 2026/01/12：Ver.3.3.1　ズームの挙動を修正。
*
* @command hideScreen
* @text 画面の消去（固定）
* @desc 画面を消去します。
* モード「消去しない」の時は画面を固定します。
*
* @arg duration
* @text 時間
* @desc フレーム数を指定します。
* 数値を入力するかコンボボックスから選択します。
* @default 普通
* @type combo
* @option 瞬時
* @option 速い
* @option 普通
* @option 遅い
*
* @arg wait
* @text 完了までウェイト
* @desc トランジョンが完了するまで待ちます。
* @default true
* @type boolean
*
* @command showScreen
* @text 画面の表示
* @desc 画面を表示します。
*
* @arg duration
* @text 時間
* @desc フレーム数を指定します。
* 数値を入力するかコンボボックスから選択します。
* @default 普通
* @type combo
* @option 瞬時
* @option 速い
* @option 普通
* @option 遅い
*
* @arg wait
* @text 完了までウェイト
* @desc トランジョンが完了するまで待ちます。
* @default true
* @type boolean
*
* @command changeTransition
* @text トランジションの変更
* @desc トランジションを設定します。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
*
* @option プラグインコマンド/消去
* @value Plugin Command (Hide)
* @option プラグインコマンド/表示
* @value Plugin Command (Show)
* @option 場所移動/消去
* @value Transfer Player (Hide)
* @option 場所移動/表示
* @value Transfer Player (Show)
* @option 戦闘開始/消去
* @value Start Battle (Hide)
* @option 戦闘開始/表示
* @value Start Battle (Show)
* @option 戦闘終了/消去
* @value End Battle (Hide)
* @option 戦闘終了/表示
* @value End Battle (Show)
* @default Plugin Command (Hide)
*
* @arg name
* @text 名前
* @desc 名前を指定します。
* @type select
* @option フェードアウト/イン（グラデーションワイプ）
* @value Fade
* @option 上にスクロール
* @value Scroll Up
* @option 下にスクロール
* @value Scroll Down
* @option 左にスクロール
* @value Scroll Left
* @option 右にスクロール
* @value Scroll Right
* @option 上下に分割/結合
* @value Horizontal
* @option 左右に分割/結合
* @value Vertical
* @option 上下左右に分割/結合
* @value Quad
* @option ズームイン/アウト
* @value Zoom
* @option モザイク
* @value Mosaic
* @option ラスタスクロール
* @value Raster Scroll
* @default Fade
*
* @command changeImage
* @text 画像の変更
* @desc グラデーションワイプの画像を設定します。
* （なし）にすると標準のフェードを行います。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
*
* @option プラグインコマンド/消去
* @value Plugin Command (Hide)
* @option プラグインコマンド/表示
* @value Plugin Command (Show)
* @option 場所移動/消去
* @value Transfer Player (Hide)
* @option 場所移動/表示
* @value Transfer Player (Show)
* @option 戦闘開始/消去
* @value Start Battle (Hide)
* @option 戦闘開始/表示
* @value Start Battle (Show)
* @option 戦闘終了/消去
* @value End Battle (Hide)
* @option 戦闘終了/表示
* @value End Battle (Show)
* @default Plugin Command (Hide)
*
* @arg name
* @text 画像
* @desc ファイル名を指定します。
* (ファイル名),invert でグラデーション反転
* @type file
* @default
* @dir img/transitions
*
* @command changeMode
* @text モードの変更
* @desc 画面を消去するか、固定するかを選択します。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
* @option プラグインコマンド
* @value Plugin Command
* @option 場所移動
* @value Transfer Player
* @option 戦闘開始
* @value Start Battle
* @option 戦闘終了
* @value End Battle
* @default Plugin Command
*
* @arg mode
* @text モード
* @desc モードを切り替えます。
* XPは一部演出が変わります。
* @type select
* @option 通常
* @value Normal
* @option 消去しない
* @value Instantaneous
* @option 消去しない（XP）
* @value XP
* @default Normal
*
* @command changeColor
* @text 色の変更
* @desc 色を変更します。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
* @option プラグインコマンド
* @value Plugin Command
* @option 場所移動
* @value Transfer Player
* @option 戦闘開始
* @value Start Battle
* @option 戦闘終了
* @value End Battle
* @default Plugin Command
*
* @arg color
* @text 色
* @desc コンマ区切りでRGBを入力して下さい。
* 未入力で黒。
* @type string
* @default 
*
* @command changeSmoothness
* @text 滑らかさの変更
* @desc 一部トランジションの滑らかさを切り替えます。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
* @option プラグインコマンド
* @value Plugin Command
* @option 場所移動
* @value Transfer Player
* @option 戦闘開始
* @value Start Battle
* @option 戦闘終了
* @value End Battle
* @default Plugin Command
*
* @arg smoothness
* @text 滑らかさ
* @desc 画面の変化を滑らかにします。
* 0-7の範囲で指定。0でスムージングなし。
* @default 4.5
*
* @command changeEasing
* @text イージングの変更
* @desc イージングを切り替えます。
* フェードイン/アウト以外で有効。
*
* @arg type
* @text 種類
* @desc 画面切り替えの種類を選択します。
* @type select
* @option プラグインコマンド
* @value Plugin Command
* @option 場所移動
* @value Transfer Player
* @option 戦闘開始
* @value Start Battle
* @option 戦闘終了
* @value End Battle
* @default Plugin Command
*
* @arg easing
* @text イージング
* @desc イージングをします。
* @default false
* @type boolean
*
* @command clearTransition
* @text トランジションの初期化
* @desc トランジションの設定をデフォルトに戻します。
*
* @command waitForCompletion
* @text 完了までウェイト
* @desc トランジションが完了するまで待ちます。
*
* @param pluginCommand
* @text プラグインコマンド
* @desc トランジションの設定をします。
* @type struct<settings>
*
* @param transfer
* @text 場所移動
* @desc トランジションの設定をします。
* @type struct<settings>
*
* @param battleStart
* @text 戦闘開始
* @desc トランジションの設定をします。
* @type struct<settings>
*
* @param battleEnd
* @text 戦闘終了
* @desc トランジションの設定をします。
* @type struct<settings>
*
* @param instant
* @text 瞬時
* @desc トランジションのフレーム数です。
* @type number
* @default 1
*
* @param faster
* @text 速い
* @desc トランジションのフレーム数です。
* @type number
* @default 24
*
* @param normal
* @text 普通
* @desc トランジションのフレーム数です。
* @type number
* @default 48
*
* @param slower
* @text 遅い
* @desc トランジションのフレーム数です。
* @type number
* @default 96
*
* @param encounterEffect
* @text エンカウントエフェクト
* @desc どのツクールに準拠したエンカウントエフェクトを行うか選択します。
* @type select
* @option 2000
* @option XP
* @option VX
* @option VXAce
* @option Fes
* @option MZ
* @default MZ
*
* @param hideCharacters
* @text キャラクターを隠す
* @desc エンカウントエフェクト中にキャラクターを隠します。
* @type select
* @option デフォルト
* @value default
* @option true
* @option false
* @default default
*
* @param sceneTransition
* @text シーン遷移
* @desc どのツクールに準拠したシーン遷移を行うか選択します。
* @type select
* @option 2000
* @option XP
* @option VX (VXAce)
* @value VX
* @option MZ
* @default MZ
*
* @param speedUpWindows
* @text ウィンドウ高速化
* @desc ウィンドウの開閉を高速化します。
* 「デフォルト」はシーン遷移の仕様に合わせます。
* @type select
* @option デフォルト
* @value default
* @option true
* @option false
* @default default
*
* @param blackout
* @text シーン変更時の暗転
* @desc MZはシーン生成に時間が掛かるのでモザイクやラスタスクロールを暗転させます。
* @type boolean
* @default false
*
* @param gameoverBgm
* @text ゲームオーバーBGM
* @desc 2000の再現機能（おまけ）
* @type struct<bgm>
*
* @param fadeSpeed
* @text 基本フェード時間
* @desc システム全体で共通するフェード時間を設定します。
* 変更しない：0　MZ：24　VXAceなど：30
* @type number
* @default 0
*
* @param transitionSpeed
* @text 基本トランジション時間
* @desc システム全体で共通するトランジション時間を設定します。
* フェードの設定：0
* @type number
* @default 30
*
*/

/*~struct~settings:ja
*
* @param id1
* @text 消去時の名前
* @desc 名前を指定します。
* @type select
* @option フェードアウト/イン（グラデーションワイプ）
* @value Fade
* @option 上にスクロール
* @value Scroll Up
* @option 下にスクロール
* @value Scroll Down
* @option 左にスクロール
* @value Scroll Left
* @option 右にスクロール
* @value Scroll Right
* @option 上下に分割/結合
* @value Horizontal
* @option 左右に分割/結合
* @value Vertical
* @option 上下左右に分割/結合
* @value Quad
* @option ズームイン/アウト
* @value Zoom
* @option モザイク
* @value Mosaic
* @option ラスタスクロール
* @value Raster Scroll
* @default Fade
*
* @param name1
* @text 消去時の画像
* @desc ファイル名を指定します。
* (ファイル名),invert でグラデーション反転。
* @type file
* @default
* @dir img/transitions
*
* @param id2
* @text 表示時の名前
* @desc 名前を指定します。
* @type select
* @option フェードアウト/イン（グラデーションワイプ）
* @value Fade
* @option 上にスクロール
* @value Scroll Up
* @option 下にスクロール
* @value Scroll Down
* @option 左にスクロール
* @value Scroll Left
* @option 右にスクロール
* @value Scroll Right
* @option 上下に分割/結合
* @value Horizontal
* @option 左右に分割/結合
* @value Vertical
* @option 上下左右に分割/結合
* @value Quad
* @option ズームイン/アウト
* @value Zoom
* @option モザイク
* @value Mosaic
* @option ラスタスクロール
* @value Raster Scroll
* @default Fade
*
* @param name2
* @text 表示時の画像
* @desc ファイル名を指定します。
* (ファイル名),invert でグラデーション反転
* @type file
* @default
* @dir img/transitions
*
* @param mode
* @text モード
* @desc モードを切り替えます。
* @type select
* @option 通常
* @value Normal
* @option 消去しない
* @value Instantaneous
* @option 消去しない（XP）
* @value XP
* @default Normal
*
* @param color
* @text 色
* @desc コンマ区切りでRGBを入力して下さい。
* 未入力で黒。
* @type string
* @default 
*
* @param smoothness
* @text 滑らかさ
* @desc 画面の変化を滑らかにします。
* 0-7の範囲で指定。0でスムージングなし。
* @default 4.5
*
* @param easing
* @text イージング
* @desc イージングをします。
* @default false
* @type boolean
*/

/*~struct~bgm:ja
*
* @param name
* @text 名前
* @desc 
* @type file
* @default
* @dir audio/bgm
*
* @param volume
* @text 音量
* @desc 
* @type number
* @default 90
* @min 0
*
* @param pitch
* @text ピッチ
* @desc 
* @type number
* @default 100
* @min 0
*
* @param pan
* @text 位相
* @desc 
* @type number
* @default 0
* @min -100
* @max 100
*/


(function(){
	'use strict';

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const parameters = PluginManager.parameters(pluginName);

	const instant = Number(parameters["instant"]);
	const faster = Number(parameters["faster"]);
	const normal = Number(parameters["normal"]);
	const slower = Number(parameters["slower"]);
	const fadeSpeed = Number(parameters["fadeSpeed"] || 0);
	const transitionSpeed = Number(parameters["transitionSpeed"] || 30);
	const blackout = parameters["blackout"] === "true";
	const encounterEffect = parameters["encounterEffect"] || "MZ";
	const sceneTransition = parameters["sceneTransition"] || "MZ";
	let hideCharacters = parameters["hideCharacters"] || "default";
	let speedUpWindows = parameters["speedUpWindows"] || "default";
	if (hideCharacters === "default") {
		hideCharacters = encounterEffect === "MZ";
	} else {
		hideCharacters = hideCharacters === "true";
	}
	if (speedUpWindows === "default") {
		speedUpWindows = sceneTransition === "VX" || sceneTransition === "2000";
	} else {
		speedUpWindows = speedUpWindows === "true";
	}
	const gameoverBgm = JSON.parse(parameters.gameoverBgm || "{}");
	gameoverBgm.volume = parseInt(gameoverBgm.volume || 90);
	gameoverBgm.pitch = parseInt(gameoverBgm.pitch || 100);
	gameoverBgm.pan = parseInt(gameoverBgm.pan || 0);
	const defaultSettings = [];
	defaultSettings.push(JSON.parse(parameters["pluginCommand"] || "{}"));
	defaultSettings.push(JSON.parse(parameters["transfer"] || "{}"));
	defaultSettings.push(JSON.parse(parameters["battleStart"] || "{}"));
	defaultSettings.push(JSON.parse(parameters["battleEnd"] || "{}"));
	const transitionIds = [];
	const transitionNames = [];
	const transitionModes = [];
	const transitionColors = [];
	const transitionSmooths = [];
	const transitionEasings = [];

	const nameList = [
	"Fade",
	"Scroll Up",
	"Scroll Down",
	"Scroll Left",
	"Scroll Right",
	"Horizontal",
	"Vertical",
	"Quad",
	"Zoom",
	"Mosaic",
	"Raster Scroll"
	];

	const modeList = [
	"Normal",
	"Instantaneous",
	"XP"
	];

	defaultSettings.forEach(params => {
		const id1 = nameList.indexOf(params.id1);
		const id2 = nameList.indexOf(params.id2);
		transitionIds.push(id1 === -1 ? 0 : id1);
		transitionIds.push(id2 === -1 ? 0 : id2);
		transitionNames.push(params.name1 || "");
		transitionNames.push(params.name2 || "");
		const mode = modeList.indexOf(params.mode);
		transitionModes.push(mode === -1 ? 0 : mode);
		const color = !!params.color && params.color.split(",").map(Number);
		transitionColors.push(color);
		transitionSmooths.push(Number(params.smoothness || 4.5));
		transitionEasings.push(params.easing === "true");
	});

	const typeList = [
	"Plugin Command (Hide)",
	"Plugin Command (Show)",
	"Transfer Player (Hide)",
	"Transfer Player (Show)",
	"Start Battle (Hide)",
	"Start Battle (Show)",
	"End Battle (Hide)",
	"End Battle (Show)"
	];

	const commandList = [
	{"code":112,"indent":0,"parameters":[]},
	{"code":357,"indent":1,"parameters":[pluginName,"updateWaitMode","",{}]},
	{"code":0,"indent":1,"parameters":[]},
	{"code":413,"indent":0,"parameters":[]},
	{"code":0,"indent":0,"parameters":[]}
	];

	function typeToIndex(type, dev = 1) {
		let index = 0;
		if (typeof type === "string") {
			index = typeList.findIndex(str => str.startsWith(type));
		} else {
			index = Number(type || 0);
		}
		if (index < 0) {
			index = 0;
		}
		return Math.floor(index / dev);
	}

	function nameToId(name) {
		let index = 0;
		if (typeof name === "string") {
			index = nameList.findIndex(str => str.startsWith(name));
		} else {
			index = Number(type || 0);
		}
		if (index < 0) {
			index = 0;
		}
		return index;
	}

	function getDuration(duration) {
		switch (duration) {
		case "instant":
		case "瞬時":
			return instant;
		case "faster":
		case "速い":
			return faster;
		case "normal":
		case "普通":
			return normal;
		case "slower":
		case "遅い":
			return slower;
		}
		return Number(duration || 0);
	}

	//-----------------------------------------------------------------------------
	// SceneManager
	//スクショ
	SceneManager.snapForTransition = function() {
		if (this._transitionBitmap) {
			this._transitionBitmap.destroy();
		}
		this._transitionBitmap = this.snap();
	};

	SceneManager.transitionBitmap = function() {
		return this._transitionBitmap;
	};

	if (sceneTransition === "VX") {
		const _SceneManager_goto = SceneManager.goto;
		SceneManager.goto = function(sceneClass) {
			_SceneManager_goto.call(this, sceneClass);
			if (this.isNextScene(Scene_Gameover)) {
				this._nextScene.playGameoverMusic();
			}
		};
	}

	//-----------------------------------------------------------------------------
	// PluginManager

	const _PluginManager = window.PluginManagerEx ?? PluginManager
	const script = window.PluginManagerEx ? document.currentScript : pluginName;
	_PluginManager.registerCommand(script, "hideScreen", function(args) {
		const type = "Plugin Command (Hide)";
		const mode = $gameSystem.transitionMode(type);
		const duration = getDuration(args.duration);
		SceneManager._scene.hideScreenWithPreset(duration, type);
		if (String(args.wait) === "true" && !mode) {
			this.setupChild(commandList);
		}
	});

	_PluginManager.registerCommand(script, "showScreen", function(args) {
		const type = "Plugin Command (Show)";
		const duration = getDuration(args.duration);
		SceneManager._scene.showScreenWithPreset(duration, type);
		if (String(args.wait) === "true") {
			this.setupChild(commandList);
		}
	});

	_PluginManager.registerCommand(script, "changeTransition", function(args) {
		$gameSystem.setTransitionId(args.type, args.name);
	});

	_PluginManager.registerCommand(script, "changeImage", function(args) {
		$gameSystem.setTransitionName(args.type, args.name);
	});

	_PluginManager.registerCommand(script, "changeMode", function(args) {
		const mode = modeList.indexOf(args.mode);
		$gameSystem.setTransitionMode(args.type, mode === -1 ? 0 : mode);
	});

	_PluginManager.registerCommand(script, "changeColor", function(args) {
		$gameSystem.setTransitionColor(args.type, args.color !== "" && String(args.color).split(",").map(Number));
	});

	_PluginManager.registerCommand(script, "changeSmoothness", function(args) {
		$gameSystem.setTransitionSmoothness(args.type, +args.smoothness);
	});

	_PluginManager.registerCommand(script, "changeEasing", function(args) {
		$gameSystem.setTransitionEasing(args.type, String(args.easing) === "true");
	});

	PluginManager.registerCommand(pluginName, "clearTransition", function() {
		$gameSystem.clearTransitionData();
	});

	PluginManager.registerCommand(pluginName, "waitForCompletion", function() {
		this.setupChild(commandList);
	});

	PluginManager.registerCommand(pluginName, "updateWaitMode", function() {
		if (SceneManager._scene.isTransitioning() || SceneManager._scene.isFading()) {
			this.wait(1);
		} else {
			this.command113();
		}
	});

	//-----------------------------------------------------------------------------
	// Tilemap
	//エンカウントエフェクト時に画面を固めるためだけの関数
	if (!hideCharacters) {
		Tilemap.prototype.setFreeze = function(freeze) {
			this._frozenMap = freeze;
		};

		const _Tilemap_update = Tilemap.prototype.update;
		Tilemap.prototype.update = function(freeze) {
			if (!this._frozenMap) {
				_Tilemap_update.call(this);
			}
		};
	}

	//-----------------------------------------------------------------------------
	// Game_System
	//演出に使うトランジションデータ
	Game_System.prototype.clearTransitionData = function() {
		delete this._transitionIds;
		delete this._transitionNames;
		delete this._transitionModes;
		delete this._transitionColors;
		delete this._transitionSmooths;
		delete this._transitionEasings;
	};

	Game_System.prototype.transitionData = function(type) {
		const data = {
			id: this.transitionId(type),
			name: this.transitionName(type),
			mode: this.transitionMode(type),
			color: this.transitionColor(type),
			smoothness: this.transitionSmoothness(type),
			easing: this.transitionEasing(type)
		}
		return data;
	};

	Game_System.prototype.setTransitionId = function(type, name) {
		if (!this._transitionIds) {
			this._transitionIds = [];
		}
		const index = typeToIndex(type);
		const id = nameToId(name);
		if (id) {
			this._transitionIds[index] = id;
		} else {
			delete this._transitionIds[index];
		}
	};

	Game_System.prototype.transitionId = function(type) {
		const index = typeToIndex(type);
		const sysData = this._transitionIds && this._transitionIds[index];
		if (sysData != null) {
			return sysData;
		}
		return transitionIds[index];
	};

	Game_System.prototype.setTransitionName = function(type, fileName) {
		if (!this._transitionNames) {
			this._transitionNames = [];
		}
		const index = typeToIndex(type);
		if (fileName != null) {
			this._transitionNames[index] = String(fileName);
		} else {
			delete this._transitionNames[index];
		}
	};

	Game_System.prototype.transitionName = function(type) {
		const index = typeToIndex(type)
		const sysData = this._transitionNames && this._transitionNames[index];
		if (sysData != null) {
			return sysData;
		}
		return transitionNames[index];
	};

	Game_System.prototype.setTransitionMode = function(type, mode) {
		if (!this._transitionModes) {
			this._transitionModes = [];
		}
		const index = typeToIndex(type, 2);
		if (mode != null) {
			this._transitionModes[index] = mode;
		} else {
			delete this._transitionModes[index];
		}
	};

	Game_System.prototype.transitionMode = function(type) {
		const index = typeToIndex(type, 2);
		const sysData = this._transitionModes && this._transitionModes[index];
		if (sysData != null) {
			return sysData;
		}
		return transitionModes[index];
	};

	Game_System.prototype.setTransitionColor = function(type, color) {
		if (!this._transitionColors) {
			this._transitionColors = [];
		}
		const index = typeToIndex(type, 2);
		if (color != null) {
			this._transitionColors[index] = typeof color === "boolean" ? color : color.clone();
		} else {
			delete this._transitionColors[index];
		}
	};

	Game_System.prototype.transitionColor = function(type) {
		const index = typeToIndex(type, 2);
		let color = this._transitionColors && this._transitionColors[index];
		if (color == null) {
			color = transitionColors[index];
		}
		return typeof color === "boolean" ? color : color.clone()
	};

	Game_System.prototype.setTransitionSmoothness = function(type, value) {
		if (!this._transitionSmooths) {
			this._transitionSmooths = [];
		}
		const index = typeToIndex(type, 2);
		if (value != null) {
			this._transitionSmooths[index] = value;
		} else {
			delete this._transitionSmooths[index];
		}
	};

	Game_System.prototype.transitionSmoothness = function(type) {
		const index = typeToIndex(type, 2);
		const sysData = this._transitionSmooths && this._transitionSmooths[index];
		if (sysData != null) {
			return sysData;
		}
		return transitionSmooths[index];
	};

	Game_System.prototype.setTransitionEasing = function(type, value) {
		if (!this._transitionEasings) {
			this._transitionEasings = [];
		}
		const index = typeToIndex(type, 2);
		if (value != null) {
			this._transitionEasings[index] = value;
		} else {
			delete this._transitionEasings[index];
		}
	};

	Game_System.prototype.transitionEasing = function(type) {
		const index = typeToIndex(type, 2);
		const sysData = this._transitionEasings && this._transitionEasings[index];
		if (sysData != null) {
			return sysData;
		}
		return transitionEasings[index];
	};

	if (fadeSpeed > 0) {
		Game_Interpreter.prototype.fadeSpeed = function() {
			return fadeSpeed;
		};
	}

	//-----------------------------------------------------------------------------
	// Game_Screen

	if (encounterEffect !== "MZ") {
		let onBattleStart = false;
		const _Game_Screen_onBattleStart = Game_Screen.prototype.onBattleStart;
		Game_Screen.prototype.onBattleStart = function() {
			onBattleStart = true;
			_Game_Screen_onBattleStart.call(this);
			onBattleStart = false;
		};

		const _Game_Screen_clearZoom = Game_Screen.prototype.clearZoom;
		Game_Screen.prototype.clearZoom = function() {
			if (onBattleStart) return;
			_Game_Screen_clearZoom.call(this);
		};
	}

	//-----------------------------------------------------------------------------
	// Game_Temp
	//マップ移動時に色や状態を保存するための一時データ。
	//旧作と異なる方式で行う為必須。
	Game_Temp.prototype.clearMapTransition = function() {
		this._inMapTransition = false;
		this._mapTransitionColor = false;
		this._mapTransitionMode = 0;
	};

	Game_Temp.prototype.setMapTransition = function(mode, color) {
		this._inMapTransition = true;
		this._mapTransitionColor = color;
		this._mapTransitionMode = mode;
	};

	Game_Temp.prototype.inMapTransition = function() {
		return !!this._inMapTransition;
	};

	Game_Temp.prototype.mapTransitionData = function() {
		const data = {
			color: this._mapTransitionColor,
			mode: this._mapTransitionMode
		}
		return data;
	};

	//-----------------------------------------------------------------------------
	// Scene_Base

	const _Scene_Base_initialize = Scene_Base.prototype.initialize;
	Scene_Base.prototype.initialize = function() {
		_Scene_Base_initialize.call(this);
		this._transitionSprite = null;
		this._transitionSign = 0;
		this._transitionDuration = 0;
		this._transitionUpdated = false;
		this._transitionMode = 0;
	};
	//必要なら行う
	const _Scene_Base_start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function() {
		_Scene_Base_start.call(this);
		if (this.needsTransition(1)) {
			this.performTransition();
		}
	};

	Scene_Base.prototype.performTransition = function() {
		this.executeTransition(this.sceneTransitionSpeed());  //シーン変更直前のスクショを利用してフェード
	};

	if (sceneTransition === "2000") {
		const _Scene_Base_stop = Scene_Base.prototype.stop;
		Scene_Base.prototype.stop = function() {
			_Scene_Base_stop.call(this);
			if (this.needsTransition(-1) && !this.isFading()) {
				this.startFadeOut(this.sceneTransitionSpeed());
			}
		};
	}

	const _Scene_Base_terminate = Scene_Base.prototype.terminate;
	Scene_Base.prototype.terminate = function() {
		_Scene_Base_terminate.call(this);
		this.snapForTransition();
	};
	//シーン遷移が旧ツクール仕様なら利用
	Scene_Base.prototype.needsTransition = function() {
		return sceneTransition !== "MZ";
	};
	//トランジションを開始した直後なら時間を上書き（既存機能と互換性を保つため）
	const _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;
	Scene_Base.prototype.startFadeIn = function(duration, white) {
		if (this.isTransitioning() && this._transitionSign > 0 && !this._transitionUpdated) {
			this._transitionDuration = duration || this._transitionDuration;
			return;
		}
		_Scene_Base_startFadeIn.apply(this, arguments);
	};

	const _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut;
	Scene_Base.prototype.startFadeOut = function(duration, white) {
		if (this.isTransitioning() && this._transitionSign < 0 && !this._transitionUpdated) {
			this._transitionDuration = duration || this._transitionDuration;
			return;
		}
		_Scene_Base_startFadeOut.apply(this, arguments);
	};

	if (fadeSpeed > 0) {
		Scene_Base.prototype.fadeSpeed = function() {
			return fadeSpeed;
		};
	}

	Scene_Base.prototype.sceneTransitionSpeed = function() {
		return 12;
	};

	Scene_Base.prototype.transitionSpeed = function() {
		return this.fadeSpeed();
	};

	Scene_Base.prototype.slowTransitionSpeed = function() {
		return this.transitionSpeed()*2;
	};

	if (transitionSpeed > 0) {
		Scene_Base.prototype.transitionSpeed = function() {
			return transitionSpeed;
		}
	};

	Scene_Base.prototype.transitionMode = function() {
		return this._transitionMode;
	};

	Scene_Base.prototype.setTransitionMode = function(mode) {
		this._transitionMode = mode;
	};

	if (sceneTransition === "2000") {
		Scene_Base.prototype.sceneTransitionSpeed = function() {
			return 5;
		};
	} else if (sceneTransition === "VX") {
		Scene_Base.prototype.sceneTransitionSpeed = function() {
			return 10;
		};
	}

	const _Scene_Base_isFading = Scene_Base.prototype.isFading;
	Scene_Base.prototype.isFading = function() {
		return _Scene_Base_isFading.call(this) || this.isTransitioning();
	};

	Scene_Base.prototype.isTransitioning = function() {
		return this._transitionDuration > 0;
	};

	Scene_Base.prototype.rejectFade = function() {
		this._fadeSign = 0;
		this._fadeDuration = 0;
		this._fadeWhite = 0;
		this._fadeOpacity = 0;
		this.updateColorFilter();
	};

	Scene_Base.prototype.showScreenWithPreset = function(duration, type, color) {
		const data = $gameSystem.transitionData(type);
		data.color = color ?? data.color;
		this._transitionDuration = duration || (data.mode === 2 && !name ? 15 : 30);
		this.setupTransition(data, 1);
	};
	//画面の表示
	Scene_Base.prototype.showScreen = function(duration, name/*or id*/, smoothness, pos, color) {
		let id = 0;
		if (typeof name === "number") {
			name = "";
			id = name;
		}
		const data = {
			id: id,
			name: name,
			mode: this._transitionMode,
			pos: pos,
			color: color,
			smoothness: smoothness
		};
		this._transitionDuration = duration || 30;
		this.setupTransition(data, 1);
	};
	//XP：トランジション実行
	Scene_Base.prototype.executeTransition = function(duration, name, smoothness, pos) {
		let id = 0;
		if (typeof name === "number") {
			name = "";
			id = name;
		}
		const data = {
			id: id,
			name: name,
			mode: 2,
			pos: pos,
			smoothness: smoothness
		};
		this._transitionDuration = duration || (name ? 30 : 15);
		this.setupTransition(data, 1);
	};

	Scene_Base.prototype.hideScreenWithPreset = function(duration, type, color) {
		const data = $gameSystem.transitionData(type);
		data.color = color ?? data.color;
		this._transitionDuration = duration || 30;
		this.setupTransition(data, -1);
	};
	//2000：画面の消去
	Scene_Base.prototype.hideScreen = function(duration, name/*or id*/, smoothness, pos, color) {
		let id = 0;
		if (typeof name === "number") {
			name = "";
			id = name;
		}
		const data = {
			id: id,
			name: name,
			mode: this._transitionMode,
			pos: pos,
			color: color,
			smoothness: smoothness
		};
		this._transitionDuration = duration || 30;
		this.setupTransition(data, -1);
	};
	//XP：トランジション準備
	Scene_Base.prototype.prepareForTransition = function() {
		const data = {
			mode: 2
		};
		this.setupTransition(data, -1);
	};

	Scene_Base.prototype.snapForTransition = function() {
		SceneManager.snapForTransition();
	};

	Scene_Base.prototype.removeTransitionSprite = function() {
		if (this._transitionSprite) {
			this._transitionSprite.destroy();
			this._transitionSprite = null;
		}
	};

	Scene_Base.prototype.createTransitionSprite = function(data) {
		this.removeTransitionSprite();
		this._transitionSprite = new Sprite_Transition(this, data);
		this.addChild(this._transitionSprite);
	};

	const _Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function() {
		this.updateTransition();
		_Scene_Base_update.call(this);
	};

	Scene_Base.prototype.setupTransition = function(data, sign) {
		this._transitionUpdated = false;
		if (sign < 0) {
			if (data.mode) {
				this._transitionDuration = 0;
				if (!data.restored || SceneManager.isSceneChanging()) {
					this.snapForTransition();
				}
				if (SceneManager.isSceneChanging()) {
					this._transitionSign = sign; //シーン変更中はもう何もしない。
					return;
				}
			}
		} else {
			if (this._transitionSprite) {
				data.color = data.color ?? this._transitionSprite._color.slice(0, 3);
			}
		}
		this._transitionSign = sign;
		data.sign = sign;
		data.duration = this._transitionDuration;
		if (!this._transitionDuration) {
			data.name = ""; //0フレームの時はトランジション画像を使わない。
		}
		this.createTransitionSprite(data);
		if (data.id === 8) {
			this._spriteset.updatePosition();
		}
		if (!this._transitionDuration) {
			this._transitionDuration = 1; //0フレームの時は強制終了させる。
			this.updateTransition();
		}
	};

	Scene_Base.prototype.updateTransition = function() {
		if (this._transitionDuration > 0) {
			this._transitionUpdated = true;
			if (this._transitionSprite.durationMax() === 0){
				const ready = this._transitionSprite.setDefault(this._transitionDuration, this._transitionSign);
				if(!ready){
					return;
				}
			}
			this._transitionDuration--;
			const d = this._transitionDuration;
			const sign = this._transitionSign;
			this._transitionSprite.updateTransition(d, sign);
			if (this._transitionDuration === 0) {
				if (sign > 0) {
					this.removeTransitionSprite();
				} else if (this._transitionSprite._id > 7 && (blackout || !SceneManager.isSceneChanging())) {
					this._transitionSprite.opacity = 255;
				}
			}
		}
	};
	
	Scene_Base.prototype.needsPresetTransition = function(type) {
		const data = $gameSystem.transitionData(type);
		return data.id || data.name || data.mode || data.color;
	};

	Scene_Base.prototype.presetTransitionSpeed = function(type, slow, normal) {
		const data = $gameSystem.transitionData(type);
		const isFade = !data.id && !data.name;
		if (data.mode === 2 && !isFade && (data.id === 0 || data.id > 7)) {//XPかつグラデーションワイプ、ズーム、モザイク、ラスタスクロールの時
			return  slow ?? this.slowTransitionSpeed();
		}//その他
		return normal ?? (isFade ? this.fadeSpeed() : this.transitionSpeed());
	};

	//-----------------------------------------------------------------------------
	// Scene_MenuBase

	const _Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
	Scene_MenuBase.prototype.createBackground = function() {
		_Scene_MenuBase_createBackground.call(this);
		const bitmap = SceneManager.backgroundBitmap();
		if (bitmap && sceneTransition === "2000") {
			bitmap.fillAll("#002063");
			this.setBackgroundOpacity(255);
		}
	};

	//-----------------------------------------------------------------------------
	// Scene_Title

	if (sceneTransition === "2000") {
		const _Scene_Title_start = Scene_Title.prototype.start;
		Scene_Title.prototype.start = function() {
			_Scene_Title_start.call(this);
			this._shouldAlwaysOpenCommandWindow = false;
			if ([Scene_Load, Scene_Options].some(scene => SceneManager.isPreviousScene(scene))) {
				this.startFadeIn(this.sceneTransitionSpeed());
				this._shouldAlwaysOpenCommandWindow = true;
			} else if (SceneManager.isPreviousScene(Scene_Map)) {
				this.startFadeIn(this.slowFadeSpeed());
			}
		};

		let slowFadeSpeed = 0;
		const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
		Scene_Title.prototype.commandNewGame = function() {
			slowFadeSpeed = this.sceneTransitionSpeed();
			_Scene_Title_commandNewGame.call(this);
			slowFadeSpeed = 0;
		};

		if (Scene_Title.prototype.slowFadeSpeed === Scene_Base.prototype.slowFadeSpeed) {
			Scene_Title.prototype.slowFadeSpeed = function() {
				return Scene_Base.prototype.slowFadeSpeed.apply(this, arguments);
			};
		}

		const _Scene_Title_slowFadeSpeed = Scene_Title.prototype.slowFadeSpeed
		Scene_Title.prototype.slowFadeSpeed = function() {
			return slowFadeSpeed || _Scene_Title_slowFadeSpeed.call(this);
		};

		const _Scene_Title_update = Scene_Title.prototype.update;
		Scene_Title.prototype.update = function() {
			_Scene_Title_update.call(this);
			if (this._shouldAlwaysOpenCommandWindow || this._commandWindow.isClosing()) {
				this._commandWindow.openness = 255;
				this._commandWindow.open();
			}
		};
	} else if (sceneTransition === "XP") {
		const _Scene_Title_start = Scene_Title.prototype.start;
		Scene_Title.prototype.start = function() {
			_Scene_Title_start.call(this);
			this.startFadeIn(this.sceneTransitionSpeed());
		};

		const _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
		Scene_Title.prototype.commandNewGame = function() {
			_Scene_Title_commandNewGame.call(this);
			this.rejectFade();
		};

		const _Scene_Title_update = Scene_Title.prototype.update;
		Scene_Title.prototype.update = function() {
			_Scene_Title_update.call(this);
			this._commandWindow.openness = 255;
			this._commandWindow.open();
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Load

	const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
	Scene_Load.prototype.onLoadSuccess = function() {
		_Scene_Load_onLoadSuccess.call(this);
		if (sceneTransition === "XP") {
			this.rejectFade();
		} else if (sceneTransition === "2000") {
			this.startFadeOut(this.sceneTransitionSpeed());
		}
	};

	//-----------------------------------------------------------------------------
	// Scene_GameEnd

	const _Scene_GameEnd_createBackground = Scene_GameEnd.prototype.createBackground;
	Scene_GameEnd.prototype.createBackground = function() {
		_Scene_GameEnd_createBackground.call(this);
		if (sceneTransition === "2000") {
			this.setBackgroundOpacity(255);
		}
	};

	if (["2000", "XP"].includes(sceneTransition)) {
		const _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
		Scene_GameEnd.prototype.create = function() {
			_Scene_GameEnd_create.call(this);
			this._commandWindow.openness = 255;
			this._commandWindow.open();
		};

		const _Scene_GameEnd_stop = Scene_GameEnd.prototype.stop;
		Scene_GameEnd.prototype.stop = function() {
			_Scene_GameEnd_stop.call(this);
			this._commandWindow.open();
		};

		const _Scene_GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
		Scene_GameEnd.prototype.commandToTitle = function() {
			_Scene_GameEnd_commandToTitle.call(this);
			this.startFadeOut(sceneTransition === "XP" ? this.sceneTransitionSpeed() : this.fadeSpeed());
		};
	} else if (sceneTransition === "VX") {
		if (Scene_MenuBase.prototype.isBusy === Scene_GameEnd.prototype.isBusy) {
			Scene_GameEnd.prototype.isBusy = function() {
				return Scene_MenuBase.prototype.isBusy.call(this);
			};
		}
		const _Scene_GameEnd_isBusy = Scene_GameEnd.prototype.isBusy;
		Scene_GameEnd.prototype.isBusy = function() {
			return this._commandWindow.isClosing() || _Scene_GameEnd_isBusy.call(this);
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Gameover

	const _Scene_Gameover_playGameoverMusic = Scene_Gameover.prototype.playGameoverMusic;
	Scene_Gameover.prototype.playGameoverMusic = function() {
		_Scene_Gameover_playGameoverMusic.call(this);
		if (gameoverBgm.name) {
			AudioManager.playBgm(gameoverBgm);
		}
	};

	if (sceneTransition === "VX") {
		let createGameover = false;
		const _Scene_Gameover_create = Scene_Gameover.prototype.create;
		Scene_Gameover.prototype.create = function() {
			createGameover = true;
			_Scene_Gameover_create.call(this);
			createGameover = false;
		};

		const _Scene_Gameover_playGameoverMusic = Scene_Gameover.prototype.playGameoverMusic;
		Scene_Gameover.prototype.playGameoverMusic = function() {
			if (createGameover) return;
			_Scene_Gameover_playGameoverMusic.call(this);
		};
	}

	if (sceneTransition === "XP")  {
		const _Scene_Gameover_start = Scene_Gameover.prototype.start;
		Scene_Gameover.prototype.start = function() {
			_Scene_Gameover_start.call(this);
			this.startFadeIn(180);
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Message

	Scene_Message.prototype.needsTransition = function() {
		return false;
	};

	if (sceneTransition === "VX") {
		Scene_Message.prototype.sceneTransitionSpeed = function() {
			return 12;
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Map

	Scene_Map.prototype.inTransition = function() {
		return !this.isFading() && $gameTemp.inMapTransition() && SceneManager.isPreviousScene(Scene_Map);
	};

	if (sceneTransition !== "MZ") {
		Scene_Map.prototype.needsTransition = function(sign) {
			if (sign < 0) {
				return ![Scene_Map, Scene_Battle].some(scene => SceneManager.isNextScene(scene));
			} else {
				return ![Scene_Map, Scene_Battle].some(scene => SceneManager.isPreviousScene(scene));
			}
		};
	}

	Scene_Map.prototype.restoreTransition = function() {
		if (!this.inTransition()) {
			$gameTemp.clearMapTransition();
			return;
		}
		this.rejectFade();
		const data = $gameTemp.mapTransitionData();
		data.restored = true;
		this._transitionDuration = 0;
		this.setupTransition(data, -1);
	};

	Scene_Map.prototype.setupTransition = function(data, sign) {
		Scene_Message.prototype.setupTransition.apply(this, arguments);
		if (sign < 0) {
			$gameTemp.setMapTransition(data.mode, data.color);
		} else {
			$gameTemp.clearMapTransition();
		}
	};

	Scene_Map.prototype.snapForTransition = function() {
		this._windowLayer.visible = false;
		const sprite = this._spriteset && this._spriteset._destinationSprite;
		const v = sprite && sprite.visible;
		if (v) {
			sprite.visible = false;
		}
		Scene_Message.prototype.snapForTransition.call(this);
		if (v) {
			sprite.visible = true;
		}
		this._windowLayer.visible = true;
	};

	const _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
	Scene_Map.prototype.fadeInForTransfer = function() {
		const type = "Transfer Player (Show)";
		if (SceneManager.isPreviousScene(Scene_Map) && this.needsPresetTransition(type)) {
			this.showScreenForTransfer(type);
			return;
		}
		_Scene_Map_fadeInForTransfer.call(this);
	};

	Scene_Map.prototype.showScreenForTransfer = function(type) {
		const fadeType = $gamePlayer.fadeType();
		switch (fadeType) {
			case 0:
			case 1:
				const color = $gameSystem.transitionColor(type) || true;
				this.showScreenWithPreset(this.presetTransitionSpeed(type), type, fadeType === 1 && color);
				break;
		}
	};

	const _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
	Scene_Map.prototype.fadeOutForTransfer = function() {
		const type = "Transfer Player (Hide)";
		if (SceneManager.isNextScene(Scene_Map) && this.needsPresetTransition(type)) {
			this.hideScreenForTransfer(type);
			return;
		}
		_Scene_Map_fadeOutForTransfer.call(this);
	};

	Scene_Map.prototype.hideScreenForTransfer = function(type) {
		const fadeType = $gamePlayer.fadeType();
		switch (fadeType) {
			case 0:
			case 1:
				const color = $gameSystem.transitionColor(type) || true;
				this.hideScreenWithPreset(this.presetTransitionSpeed(type), type, fadeType === 1 && color);
				break;
		}
	};

	if (Scene_Message.prototype.startFadeOut === Scene_Map.prototype.startFadeOut) {
		Scene_Map.prototype.startFadeOut = function(duration, white) {
			Scene_Message.prototype.startFadeOut.apply(this, arguments);
		};
	}
	//エンカウントエフェクト乗っ取り
	const _Scene_Map_startFadeOut = Scene_Map.prototype.startFadeOut;
	Scene_Map.prototype.startFadeOut = function(duration, white) {
		if (updateEncounterEffect) {
			const type = "Start Battle (Hide)";
			this.hideScreenWithPreset(duration, type);
			return;
		}
		_Scene_Map_startFadeOut.apply(this, arguments);
	};

	const _Scene_Map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		_Scene_Map_start.call(this);
		const type = "End Battle (Show)";
		if (SceneManager.isPreviousScene(Scene_Battle) && this.needsPresetTransition(type)) {
			this.rejectFade();
			if (sceneTransition === "XP") {
				//XPなら更に速くする。
				this.showScreenWithPreset(this.presetTransitionSpeed(type, this.fadeSpeed(), this.sceneTransitionSpeed()), type);
			} else {
				const xpMode = $gameSystem.transitionMode(type) === 2;
				if (!xpMode && sceneTransition === "2000") {
					const bitmap = SceneManager.transitionBitmap();
					if (bitmap) bitmap.destroy();
				}
				this.showScreenWithPreset(this.presetTransitionSpeed(type), type);
			}
		}
		this.restoreTransition();
	};
	//ニューゲーム、ロードを特殊演出に
	if (sceneTransition === "2000") {
		const _Scene_Map_start = Scene_Map.prototype.start;
		Scene_Map.prototype.start = function() {
			_Scene_Map_start.call(this);
			if (SceneManager.isPreviousScene(Scene_Load) || SceneManager.isPreviousScene(Scene_Title)) {
				this.startFadeIn(this.slowFadeSpeed());
			}
		};
	} else if (sceneTransition === "XP") {
		const _Scene_Map_start = Scene_Map.prototype.start;
		Scene_Map.prototype.start = function() {
			_Scene_Map_start.call(this);
			if (SceneManager.isPreviousScene(Scene_Load) || SceneManager.isPreviousScene(Scene_Title)) {
				this.startFadeIn(this.sceneTransitionSpeed());
			}
		};
	}

	if (!hideCharacters) {
		Scene_Map.prototype.startEncounterEffect = function() {
			this._encounterEffectDuration = this.encounterEffectSpeed();
			this._spriteset._tilemap.setFreeze(true);
		};
	}

	if (encounterEffect === "2000") {
		Scene_Map.prototype.encounterEffectSpeed = function() {
			return 53;
		};
		//フラッシュからのフェード
		Scene_Map.prototype.updateEncounterEffect = function() {
			if (this._encounterEffectDuration > 0) {
				this._encounterEffectDuration--;
				const speed = this.encounterEffectSpeed();
				const n = speed - this._encounterEffectDuration;
				if (n === 1) {
					this.snapForBattleBackground();
					this.startFlashForEncounter(24);
					$gameScreen._flashDuration /= 2;
					BattleManager.playBattleBgm();
				}
				if (n === 11) {
					this.startFlashForEncounter(24);
					$gameScreen._flashDuration /= 2;
				}
				if (n === 23) {
					this.startFadeOut(30);
				}
			}
		};

	} else if (["XP", "VX", "VXAce", "Fes"].includes(encounterEffect)) {
		Scene_Map.prototype.encounterEffectSpeed = function() {
			return 1;
		};

		Scene_Map.prototype.updateEncounterEffect = function() {
			if (this._encounterEffectDuration > 0) {
				this._encounterEffectDuration--;
				const speed = this.encounterEffectSpeed();
				const n = speed - this._encounterEffectDuration;
				if (n === 1) {
					this.snapForBattleBackground();
					if (encounterEffect !== "Fes") {
						BattleManager.playBattleBgm();
					}
					switch (encounterEffect) {
					case "XP":
						this.startFadeOut(30);
						break;
					case "VX":
						this.startFadeOut(80);
						if (updateEncounterEffect && this._transitionSprite) this._transitionSprite._pos = 80; //途中から開始する
						break;
					case "VXAce":
						this.startFadeOut(60);
						if (updateEncounterEffect && this._transitionSprite) this._transitionSprite._pos = 120; //同上
						break;
					case "Fes":
						this.startFadeOut(16);
						break;
						
					}
				}
			}
		};
	}

	let updateEncounterEffect = false;
	const _Scene_Map_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
	Scene_Map.prototype.updateEncounterEffect = function() {
		updateEncounterEffect = this.needsPresetTransition("Start Battle (Hide)");
		_Scene_Map_updateEncounterEffect.call(this);
		updateEncounterEffect = false;
	};

	if (sceneTransition === "2000") {
		const _Scene_Map_stop = Scene_Map.prototype.stop;
		Scene_Map.prototype.stop = function() {
			_Scene_Map_stop.call(this);
			if (SceneManager.isNextScene(Scene_Title)) {
				this.startFadeOut(this.sceneTransitionSpeed());
			}
		};
	} else if (sceneTransition === "XP") {
		const _Scene_Map_needsSlowFadeOut = Scene_Map.prototype.needsSlowFadeOut;
		Scene_Map.prototype.needsSlowFadeOut = function() {
			return _Scene_Map_needsSlowFadeOut.call(this) && !SceneManager.isNextScene(Scene_Gameover);
		};
		const _Scene_Map_stop = Scene_Map.prototype.stop;
		Scene_Map.prototype.stop = function() {
			_Scene_Map_stop.call(this);
			if (SceneManager.isNextScene(Scene_Title)) {
				this.startFadeOut(this.sceneTransitionSpeed());
			}
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Battle

	const _Scene_Battle_start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function() {
		const type = "Start Battle (Show)";
		_Scene_Battle_start.call(this);
		if (this.needsPresetTransition(type) || encounterEffect !== "MZ") {
			const xpMode = $gameSystem.transitionMode(type) === 2;
			if (!xpMode && sceneTransition === "2000") {
				const bitmap = SceneManager.transitionBitmap();
				if (bitmap) bitmap.destroy();
			}
			let duration = this.presetTransitionSpeed(type);
			let pos = 0;
			switch (encounterEffect) {
			case "2000":
				duration = 30;
				break;
			case "XP":
				duration = this.presetTransitionSpeed(type, 60, 30);
				break;
			case "VX":
				duration = xpMode ? 80 : 12;
				if (xpMode) pos = 80;
				break;
			case "VXAce":
				duration = xpMode ? 60 : 12;
				if (xpMode) pos = 120;
				break;
			case "Fes":
				duration = 16;
				break;
			}
			this.rejectFade();
			this.showScreenWithPreset(duration, type);
			if (this._transitionSprite) this._transitionSprite._pos = pos;
		}
	};

	const _Scene_Battle_stop = Scene_Battle.prototype.stop;
	Scene_Battle.prototype.stop = function() {
		_Scene_Battle_stop.call(this);
		const type = "End Battle (Hide)";
		if (SceneManager.isNextScene(Scene_Map) && this.needsPresetTransition(type)) {
			this.rejectFade();
			this.hideScreenWithPreset(this.fadeSpeed(), type);
		}
	};

	if (sceneTransition === "2000") {
		const _Scene_Battle_stop = Scene_Battle.prototype.stop;
		Scene_Battle.prototype.stop = function() {
			_Scene_Battle_stop.call(this);
			if (SceneManager.isNextScene(Scene_Title)) {
				this.startFadeOut(this.sceneTransitionSpeed());
			}
		};
	} else if (sceneTransition === "XP") {
		const _Scene_Battle_stop = Scene_Battle.prototype.stop;
		Scene_Battle.prototype.stop = function() {
			_Scene_Battle_stop.call(this);
			if (SceneManager.isNextScene(Scene_Title)) {
				this.startFadeOut(this.sceneTransitionSpeed());
			} else if (!SceneManager.isNextScene(Scene_Map)) {
				this.rejectFade();
			}
		};
	} else if (sceneTransition === "VX") {
		const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
		Scene_Battle.prototype.terminate = function() {
			const playMe = AudioManager.playMe;
			const stopMe = AudioManager.stopMe;
			if (SceneManager.isNextScene(Scene_Gameover)) {
				AudioManager.playMe = function() {};
				AudioManager.stopMe = function() {};
			}
			_Scene_Battle_terminate.call(this);
			AudioManager.playMe = playMe;
			AudioManager.stopMe = stopMe;
		};
	}

	//-----------------------------------------------------------------------------
	// Sprite_Transition
	// トランジション用スプライトの定義です。

	function Sprite_Transition() {
		this.initialize(...arguments);
	}

	Sprite_Transition.prototype = Object.create(Sprite.prototype);
	Sprite_Transition.prototype.constructor = Sprite_Transition;

	//イニシャライザ
	//smoothnessとposでVXのvagueを再現できる
	Sprite_Transition.prototype.initialize = function(target, data) {
		Sprite.prototype.initialize.call(this);
		this.bitmap = new Bitmap(Graphics.width, Graphics.height);
		this.initMembers(data);
		this.setup(target, data);
	};

	Sprite_Transition.prototype.initMembers = function(data) {
		this._id = data.id || 0; //トランジションID
		this._mode = Number(data.mode || 0); //スクショ付きトランジション
		this._xpMode = this._mode === 2;
		this._invert = this._xpMode;
		this._fileName = (data.name || "").replace(/,invert/gi, (_, p1) => {
			this._invert = !this._invert;
            return "";
		});
		if (ImageManager.isObjectCharacter(this._fileName)) {
			this._invert = !this._invert;
		}
		this._smoothness = data.smoothness ?? 4.5; //滑らかさ（0-7）
		this._easing = !!data.easing;
		this._pos = data.pos ?? 0; //開始位置（0-255）
		this._target = null;
		this._picture = new Game_Picture();
		this._durationMax = 0;
		//Set Color
		let c = data.color ?? false;
 		if (this._mode > 0) {
 			c = false;
 		} else if (c === true) {
			c = [255, 255, 255];
		}
		if (c && c.some(n => n > 0)) {
			this._color = [c[0], c[1], c[2], 255];
		} else {
			this._color = [0,0,0,0];
		}
	};

	Sprite_Transition.prototype.setup = function(target, data) {
		const sign = data.sign;
		this.setBitmap(sign);
		this.removeTransitionFilter(target);
		this._target = this._xpMode ? this : target;
		if (this._id > 0 && !this.isStillImage(sign)) {
			this.createTransitionFilter();
			this.setTransitionId(this._id);
			this._transitionFilter.setBitmap(this._xpMode ? null : this.bitmap);
		}
		this.createTransitionData();
 		if (!this._id) {
 			this.setBlendColor(this._color);
 		}
		this.opacity = sign < 0 ? 0 : 255;
		this.setupPicture(sign, data.duration);
	};

	Sprite_Transition.prototype.isStillImage = function(sign) {
		return this._mode > 0 && sign < 0; //画面を硬直させる用途か。
	};

	Sprite_Transition.prototype.setBitmap = function(sign) {
		if (this._mode > 0 && !(sign > 0 && this._id === 10 && this._mode === 1)) {
			const snap = SceneManager.transitionBitmap();
			this.bitmap.fillAll("black"); //ここで染めておくことでスクショが透明でも動作可能にする。
			if (snap) {
				this.synthesizeBitmap(this.bitmap, snap);
			}
		} else if (this._id > 0) {
			this.bitmap.fillAll("rgb("+this._color.slice(0,3).join()+")");
		}else if (sign > 0 || !this._fileName) {
			//ワイプインまたはフェード
			this.bitmap.fillAll("black");
		} else {
			//ワイプアウトまたはその他
			this.bitmap.clear();
		}
	};

	Sprite_Transition.prototype.removeTransitionFilter = function(target = this._target) {
		if (this._transitionFilter) {
			if (this.filters) {
				this.filters.remove(this._transitionFilter);
			}
			this._transitionFilter = null;
		}
		if (target._transitionFilter) {
			if (target.filters) {
				target.filters.remove(target._transitionFilter);
			}
			target._transitionFilter = null;
		}
		this._transitionId = 0;
		this._transitionScale = 1;
		this._transitionPos = [0,0];
	};

	Sprite_Transition.prototype.createTransitionFilter = function() {
		const target = this._target;
		this._transitionFilter = new TransitionFilter();
		if (!target.filters) {
			target.filters = [];
		}
		target.filters.unshift(this._transitionFilter);
		target._transitionFilter = this._transitionFilter;
	};

	Sprite_Transition.prototype.setTransitionId = function(id) {
		const newId = Number(id);
		if (this._transitionId !== newId) {
			this._transitionId = newId
			this.updateTransitionFilter();
		}
	};

	Sprite_Transition.prototype.setTransitionScale = function(scale) {
		const newScale = Number(scale);
		if (this._transitionScale !== newScale) {
			this._transitionScale = newScale;
			this.updateTransitionFilter();
		}
	};

	Sprite_Transition.prototype.setTransitionPos = function(x, y) {
		const newPos = [x, y];
		if (!this._transitionPos.equals(newPos)) {
			this._transitionPos = newPos;
			this.updateTransitionFilter();
		}
	};

	Sprite_Transition.prototype.updateTransitionFilter = function() {
		this._transitionFilter.setId(this._transitionId);
		this._transitionFilter.setPosition(...this._transitionPos);
		this._transitionFilter.setScale(this._transitionScale);
		this._transitionFilter.enabled = this._transitionId > 0 && this._transitionId !== 8 && (this._transitionPos.some(c=>c) || this._transitionScale !== 1);
	};

	Sprite_Transition.prototype.setupPicture = function(sign, duration = this._durationMax) {
		if (!this._id || !this._transitionFilter) return;
		const width = 1;
		const height = 1;
		let x = 0;
		let y = 0;
		switch (this._id) {
		case 1:
			y = -height;
			break;
		case 2:
			y = height;
			break;
		case 3:
			x = -width;
			break;
		case 4:
			x = width;
			break;
		case 5:
			y = -height / 2;
			break;
		case 6:
			x = -width / 2;
			break;
		case 7:
			x = -width / 2;
			y = -height / 2;
			break;
		case 9:
		case 10:
			x = duration*2;
			break;
		}
		let x0 = sign < 0 || this._xpMode ? 0 : x;
		let x1 = sign < 0 || this._xpMode ? x : 0;
		let y0 = sign < 0 || this._xpMode ? 0 : y;
		let y1 = sign < 0 || this._xpMode ? y : 0;
		const scaleMax = 60;
		const scaleMin = 0;
		let s0 = sign < 0 ? scaleMin : scaleMax;
		let s1 = sign < 0 ? scaleMax : scaleMin;
		const amp = 0.25;
		let s2 = sign < 0 || this._xpMode ? 0 : amp;
		let s3 = sign < 0 || this._xpMode ? amp : 0;
		const mosMax = 80;
		const mosMin = 1;
		let o0 = sign < 0 || this._xpMode ? mosMin : mosMax;
		let o1 = sign < 0 || this._xpMode ? mosMax : mosMin;
		let e = 0;
		if (this._easing) {
			e = sign < 0 ? 1 : 2;
			if (this._mode === 1 && this._id >= 1 && this._id <= 4) {
				e = 3;
			}
			if (this._xpMode) {
				if (this._id <= 4) {
					e = 3;
				} if (this._id <= 7) {
					e = 1;
				}
			}
		}
		if (this._id < 5 && sign > 0) {
			[x0, x1, y0, y1] = [-x0, x1, -y0, y1];
		}
		this._picture.show("", 0, x0, y0, s0, s2, o0, 0);
		switch (this._id) {
		case 8:
			this.updateZoom(duration);
			break;
		case 9:
			this.updateMosaic(duration);
			break;
		case 10:
			this.updateRasterScroll(duration);
			break;
		default:
			this.updateScraps(duration);
			break;
		}
		this._picture.move(0, x1, y1, s1, s3, o1, 0, duration, e);
	};

	Sprite_Transition.prototype.durationMax = function() {
		return this._durationMax;
	};

	Sprite_Transition.prototype.setDurationMax = function(d) {
		this._durationMax = d;
	};

	Sprite_Transition.prototype.destroy = function(options) {
		this.removeTransitionFilter();
		if (this.bitmap) {
			this.bitmap.destroy();
		}
		if (this._id === 8) {
			this.clearZoom();
		}
		Sprite.prototype.destroy.call(this, options);
	};

	//トランジションの元画像を読み込んでトランジション情報を作成する
	Sprite_Transition.prototype.createTransitionData = function() {
		const fileName = this._fileName;
		this._transitionBitmap = null;
		this._transitionData = null;
		if (!this._id && fileName) {
			//ファイル名が設定されていたら読み込む
			const bitmap = new Bitmap(Graphics.width, Graphics.height);
			const bitmap2 = ImageManager.loadTransition(fileName);
			if(bitmap2.isReady()){
				//キャッシュから読み込んだ場合は描画
				this.synthesizeBitmap(bitmap, bitmap2, ImageManager.isBigCharacter(fileName));
			} else {
				//すぐに読み込めなかったらバックアップ
				this._transitionBitmap = bitmap2;
			}
			//データ抽出
			this._transitionData = bitmap.getTransitionData(this._invert);
			bitmap.destroy();
		}
	};

	Sprite_Transition.prototype.updateTransition = function(duration, sign) {
		//ファイル名がない場合は普通のフェードを模倣
		this.opacity = 255;
		if (this.isStillImage(sign)) {
			return;
		}
		switch (this._id) {
		case 0:
			if (!this._fileName) {
				this.updateFade(duration, sign);
			} else {
				this.updateWipe(duration, sign);
			}
			break;
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			this.updateScraps(duration, sign);
			break;
		case 8:
			this.updateZoom(duration, sign);
			break;
		case 9:
			this.updateMosaic(duration, sign);
			break;
		case 10:
			this.updateRasterScroll(duration, sign);
			break;
		}
	};

	Sprite_Transition.prototype.updateFade = function(duration, sign) {
		this.opacity = sign > 0 ? 255 * (duration / this._durationMax) : 255 - 255 * (duration / this._durationMax);
	};

	Sprite_Transition.prototype.updateWipe = function(duration, sign) {
		if (this._smoothness > 0) {
			this.updateSmoothWipe(duration, sign);
		} else {
			this.updateBinaryWipe(duration, sign);
		}
	};

	Sprite_Transition.prototype.updateSmoothWipe = function(duration, sign) {
		const speedRate = 2**(8 - this._smoothness);
		const rate = speedRate / (speedRate-1);
		const max = 255 * rate;
		const speed = 255 * speedRate / this._durationMax;
		const pos = this._pos;
		if (sign > 0) {
			const offset = 255 - max;
			let threshold = (max * duration / this._durationMax) + offset;
			let lastThreshold = (max * (duration + 1) / this._durationMax) + offset;
			if (pos > 0) {
				threshold *= (255 - pos) / 255;
				lastThreshold *= (255 - pos) / 255;
			}
			this.bitmap.createSmoothTransitionIn(this._transitionData, threshold, lastThreshold, speed);
		} else {
			let threshold = max - (max * duration / this._durationMax);
			let lastThreshold = max - (max * (duration + 1) / this._durationMax);
			if (pos > 0) {
				threshold = threshold * (255 - pos) / 255 + pos;
				lastThreshold = lastThreshold * (255 - pos) / 255 + pos;
			}
			this.bitmap.createSmoothTransitionOut(this._transitionData, threshold, lastThreshold, speed);
		}
	};

	Sprite_Transition.prototype.updateBinaryWipe = function(duration, sign) {
		const pos = this._pos;
		if (sign > 0) {
			let threshold = (255 * duration / this._durationMax);
			if (pos > 0) {
				threshold *= (255 - pos) / 255;
			}
			this.bitmap.createBinaryTransitionIn(this._transitionData, threshold);
		} else {
			let threshold = 255 - (255 * duration / this._durationMax);
			if (pos > 0) {
				threshold = threshold * (255 - pos) / 255 + pos;
			}
			this.bitmap.createBinaryTransitionOut(this._transitionData, threshold);
		}
	};

	Sprite_Transition.prototype.updateScraps = function(duration, sign) {
		const pic = this._picture;
		pic.update();
		this.setTransitionPos(pic.x(), pic.y());
		this.opacity = 0;
		if (this._target === this) {
			const rate = this._durationMax - this._durationMax / 7 * (7-this._smoothness);
			if (duration > rate) {
				this.opacity = 255;
			} else {
				const dm = this._durationMax;
				this._durationMax = rate;
				this.updateFade(duration, sign);
				this._durationMax = dm;
			}
		}
	};

	Sprite_Transition.prototype.updateZoom = function(duration, sign) {
		const pic = this._picture;
		pic.update();
		const zoomX = $gameParty.inBattle() ? Graphics.width/2 : $gamePlayer.screenX();
        const zoomY = $gameParty.inBattle() ? Graphics.height/2 : $gamePlayer.screenY() - $gameMap.tileHeight()/2;
		const baseWidth = 320;
		const scale = baseWidth/(baseWidth - pic.scaleX() * 5.2);
		this.setZoom(zoomX, zoomY, scale);
		this.opacity = 0;
		if (this._target === this) {
			const rate = this._durationMax / 7 * (7-this._smoothness);
			if (duration <= rate) {
				this.opacity = 0;
			} else {
				const dm = this._durationMax;
				this._durationMax = dm - rate;
				this.updateFade(duration-rate, sign);
				this._durationMax = dm;
			}
		}
	};

	Sprite_Transition.prototype.updateMosaic = function(duration, sign) {
		const pic = this._picture;
		pic.update();
		this.setTransitionScale(pic.opacity());
		this.setTransitionPos(pic.x(), pic.y());
		this.opacity = 0;
		if (this._target === this) {
			const rate = this._durationMax - this._durationMax / 7 * (7-this._smoothness);
			if (duration > rate) {
				this.opacity = 255;
			} else {
				const dm = this._durationMax;
				this._durationMax = rate;
				this.updateFade(duration, sign);
				this._durationMax = dm;
			}
		}
	};

	Sprite_Transition.prototype.clearZoom = function() {
		$gameScreen.clearZoom();
	};

	Sprite_Transition.prototype.setZoom = function(zoomX, zoomY, scale) {
		$gameScreen.setZoom(zoomX, zoomY, scale);
	};

	Sprite_Transition.prototype.updateRasterScroll = function(duration, sign) {
		const pic = this._picture;
		pic.update();
		this.setTransitionScale(pic.scaleY());
		this.setTransitionPos(pic.scaleX(), pic.y());
		this.opacity = 0;
		if (this._target === this) {
			this.updateFade(duration, sign);
		}
	};

	Sprite_Transition.prototype.setDefault = function(duration, sign) {
		if(this._transitionBitmap){
			if(!this._transitionBitmap.isReady()){
				return false;
			}
			this.createTransitionData(sign);
		}
		this.setDurationMax(duration);
		this.setupPicture(sign);
		return true;
	};

	Sprite_Transition.prototype.synthesizeBitmap = function(bitmap1, bitmap2, clip) {
		if (!clip) {
			bitmap1.blt(bitmap2, 0, 0, bitmap2.width, bitmap2.height,
				0, 0, bitmap1.width, bitmap1.height);
			return;
		}
		const aspect1 = bitmap1.width / bitmap1.height;
		const aspect2 = bitmap2.width / bitmap2.height;
		let left, top, width, height;
		if(aspect2 < aspect1) {// 画像が横長
			left = 0;
			width = bitmap1.width;
			height = bitmap1.width / aspect2;
			top = (bitmap1.height - height) / 2;
		} else {// 画像が縦長
			top = 0;
			height = bitmap1.height;
			width = bitmap1.height * aspect2;
			left = (bitmap1.width - width) / 2;
		}
		bitmap1.blt(bitmap2, 0, 0, bitmap2.width, bitmap2.height,
			left, top, width, height);
	};

	//-----------------------------------------------------------------------------
	// Window_Base

	if (speedUpWindows) {
		Window_Base.prototype.updateOpen = function() {
			if (this._opening) {
				this.openness += 48;
				if (this.isOpen()) {
					this._opening = false;
				}
			}
		};

		Window_Base.prototype.updateClose = function() {
			if (this._closing) {
				this.openness -= 48;
				if (this.isClosed()) {
					this._closing = false;
				}
			}
		};
	}

	//-----------------------------------------------------------------------------
	// ImageManager

	ImageManager.loadTransition = function(filename) {
		return this.loadBitmap('img/transitions/', filename);
	};

	//-----------------------------------------------------------------------------
	// Bitmap

	//トランジションデータを作る
	Bitmap.prototype.createBinaryTransitionIn = function(data, threshold) {
		if(this.width > 0 && this.height > 0){
			const context = this._context;
			const imageData = context.getImageData(0, 0, this.width, this.height);
			const pixels = imageData.data;
			for(let i = 0; i < pixels.length; i+=4){
				if(pixels[i + 3] === 255){
				   const alpha = (data[i] >= threshold) ? 0 : 255;
				   pixels[i + 3] = alpha;
				}
			}
			context.putImageData(imageData, 0, 0);
			this._baseTexture.update();
		}
	};

	Bitmap.prototype.createBinaryTransitionOut = function(data, threshold) {
		if(this.width > 0 && this.height > 0){
			const context = this._context;
			const imageData = context.getImageData(0, 0, this.width, this.height);
			const pixels = imageData.data;
			for(let i = 0; i < pixels.length; i+=4){
				if(pixels[i + 3] === 0){
				   const alpha = (data[i] > threshold) ? 0 : 255;
				   pixels[i + 3] = alpha;
				}
			}
			context.putImageData(imageData, 0, 0);
			this._baseTexture.update();
		}
	};
	//閾値の差からグラデーションを復元
	function getSmoothSpeed(opacity, threshold, lastThreshold, speed) {
		return speed * (threshold - opacity) / (threshold - lastThreshold);
	}

	Bitmap.prototype.createSmoothTransitionIn = function(data, threshold, lastThreshold, speed) {
		if(this.width > 0 && this.height > 0){
			const context = this._context;
			const imageData = context.getImageData(0, 0, this.width, this.height);
			const pixels = imageData.data;
			for(let i = 0; i < pixels.length; i+=4){
				if(pixels[i + 3] === 255){
					const alpha = (data[i] >= threshold) ? 255 - getSmoothSpeed(data[i], threshold, lastThreshold, speed) : 255;
					pixels[i + 3] = alpha;
				} else if(pixels[i + 3] !== 0) {
					pixels[i + 3] -= speed;
				}
			}
			context.putImageData(imageData, 0, 0);
			this._baseTexture.update();
		}
	};

	Bitmap.prototype.createSmoothTransitionOut = function(data, threshold, lastThreshold, speed) {
		if(this.width > 0 && this.height > 0){
			const context = this._context;
			const imageData = context.getImageData(0, 0, this.width, this.height);
			const pixels = imageData.data;
			for(let i = 0; i < pixels.length; i+=4){
				if(pixels[i + 3] === 0){
					const alpha = (data[i] > threshold) ? 0 : getSmoothSpeed(data[i], threshold, lastThreshold, speed);
					pixels[i + 3] = alpha;
				} else if(pixels[i + 3] !== 255) {
					pixels[i + 3] += speed;
				}
			}
			context.putImageData(imageData, 0, 0);
			this._baseTexture.update();
		}
	};

	//画像データの配列情報を取得する
	Bitmap.prototype.getTransitionData = function(negative) {
		if(this.width > 0 && this.height > 0){
			const context = this._context;
			const imageData = context.getImageData(0, 0, this.width, this.height);
			const pixels = imageData.data;
			if (negative) {
				for(let i = 0; i < pixels.length; i+=4){
					pixels[i] = 255 - pixels[i];
					pixels[i + 1] = 255 - pixels[i + 1];
					pixels[i + 2] = 255 - pixels[i + 2];
				}
			}
			return pixels;
		}
	};

	//-----------------------------------------------------------------------------
	// TransitionFilter

	function TransitionFilter() {
		this.initialize(...arguments);
	}

	TransitionFilter.prototype = Object.create(PIXI.Filter.prototype);
	TransitionFilter.prototype.constructor = TransitionFilter;

	TransitionFilter.prototype.initialize = function() {
		PIXI.Filter.call(this, null, this._fragmentSrc());
		this.uniforms.id = 0;
		/*
		0:None (Gradient Wipe from Bitmap)
		1:Scroll
		2:Dual Vert
		3:Dual Horz
		4:Quad
		5:None (Zoom from $gameScreen)
		6:Mosaic
		7:Raster Scroll
		*/
		this.uniforms.pos = [0,0]; //-1to1
		this.uniforms.uBaseTexture = null;
		this.uniforms.frame = [0, 0];
	};

	TransitionFilter.prototype.setId = function(id) {
		this.uniforms.id = convertId(id);
	};

	function convertId(id) {
		id = Number(id || 0);
		switch (id) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
			return 1;
		default:
			return id - 3;
		}
	};

	TransitionFilter.prototype.setBitmap = function(bitmap) {
		this.uniforms.uBaseTexture = bitmap ? bitmap.baseTexture : null;
	};

	TransitionFilter.prototype.setPosition = function(x, y) {
		this.uniforms.pos = [Number(x), Number(y)];
	};

	TransitionFilter.prototype.setScale = function(scale) {
		this.uniforms.scale = Number(scale);
	};

	TransitionFilter.prototype._fragmentSrc = function() {
		const src =
		`varying vec2 vTextureCoord;
		uniform sampler2D uSampler;
		uniform sampler2D uBaseTexture;
		uniform int id;
		uniform vec2 pos;
		uniform vec2 frame;
		uniform float scale;
		void main() {
			vec2 tc = vTextureCoord;
			vec2 bc = vTextureCoord;
			bool result = true;
			if (id == 1) {//Scroll
				tc -= pos;
				bc = mod(tc, 1.0);
				result = tc.x >= 0.0 && tc.x < 1.0 && tc.y >= 0.0 && tc.y < 1.0;
			} else if (id == 2) {//Horz
				if (vTextureCoord.y < 0.5) { //upper
					tc -= pos;
					result = tc.x >= 0.0 && tc.x < 1.0 && tc.y >= 0.0 && tc.y < 0.5;
				} else { //lower
					tc += pos;
					result = tc.x >= 0.0 && tc.x < 1.0 && tc.y >= 0.5 && tc.y < 1.0;
				}
			} else if (id == 3) {//Vert
				if (vTextureCoord.x < 0.5) { //left
					tc -= pos;
					result = tc.x >= 0.0 && tc.x < 0.5 && tc.y >= 0.0 && tc.y < 1.0;
				} else { //right
					tc += pos;
					result = tc.x >= 0.5 && tc.x < 1.0 && tc.y >= 0.0 && tc.y < 1.0;
				}
			} else if (id == 4) {//Quad
				if (vTextureCoord.x < 0.5 && vTextureCoord.y < 0.5) { //upper-left
					tc -= pos;
					result = tc.x >= 0.0 && tc.x < 0.5 && tc.y >= 0.0 && tc.y < 0.5;
				} else if (vTextureCoord.y < 0.5) { //upper-right
					tc.x += pos.x;
					tc.y -= pos.y;
					result = tc.x >= 0.5 && tc.x < 1.0 && tc.y >= 0.0 && tc.y < 0.5;
				} else if (vTextureCoord.x < 0.5) { //lower-left
					tc.x -= pos.x;
					tc.y += pos.y;
					result = tc.x >= 0.0 && tc.x < 0.5 && tc.y >= 0.5 && tc.y < 1.0;
				} else { //upper-right
					tc += pos;
					result = tc.x >= 0.5 && tc.x < 1.0 && tc.y >= 0.5 && tc.y < 1.0;
				}
			} else if (id == 6) {//Mosaic
				vec2 num = frame / scale; //縦横それぞれ何個づつ入るか。
				float offset = (sin(pos.x/acos(-1.0))+1.0) / 2.0; //原点ずらし（0.0-1.0）
				tc -= offset;
				tc = floor(tc * num) / num;
				tc += offset;
				tc += (mod(frame, scale)+0.5) / frame;
			} else if (id == 7) {//Raster Scroll
				float pi = acos(-1.0);
				tc.x -= scale*sin((tc.y*15.0 + pos.x/15.0) * pi);
				result = tc.x >= 0.0 && tc.x < 1.0;
			}
			gl_FragColor = result ? texture2D(uSampler, tc) : texture2D(uBaseTexture, bc);
		}`;
		return src;
	};

	TransitionFilter.prototype.apply = function (filterManager, input, output, clearMode, _currentState) {
		const frame = _currentState.sourceFrame;
		this.uniforms.frame = [frame.width, frame.height];
		filterManager.applyFilter(this, input, output, clearMode);
	};
})();