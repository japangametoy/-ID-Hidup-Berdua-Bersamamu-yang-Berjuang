/*:
* @target MZ
* @url https://raw.githubusercontent.com/munokura/MNKR-MZ-plugins/master/MNKR_TMLogWindowMZ.js
* @plugindesc マップシーンにログウィンドウを表示します。
* @author tomoaky (改変 munokura)
* 
* @help
* 使い方:
* 
* プラグインを導入するとマップシーンにログウィンドウが追加されます。
* プラグインコマンドを使って手動で書き込むか、転記モードで
* 自動的に書き込むことでログウィンドウにテキストを表示できます。
* 
* プラグインパラメータ補足:
* 
* padding
* テキストの表示領域とウィンドウフレーム外側までのドット数です。
* ウィンドウの高さ（縦方向の大きさ）は以下の式で算出されます。
* １行の高さ(lineHeight) * 行数(lines) + 余白(padding) * 2
* 画面の下部ぴったりにウィンドウを表示したい場合は縦方向の
* 画面サイズから上記の式の結果を引いた値を logWindowY に
* 設定してください。
* 
* collideOpacity
* opacity よりも大きい値を設定した場合、ログの内容には
* collideOpacity を適用し、ウィンドウフレームと背景には
* opacity を適用します。
* 
* autoDelete
* 指定したゲーム変数の値が 0 の場合は、自動削除の機能が
* 停止します。
* 
*
* プラグインコマンド:
* 
* showLogWindow
* ログウィンドウを表示する。
* 
* hideLogWindow
* ログウィンドウを隠す。
* 
* addLog テキスト
* テキストをログウィンドウに追加する。
* 一部の制御文字も使えます（\V[n], \N[n], \P[n], \G, \C[n]）
* 
* deleteLog
* 一番古いテキストをひとつ削除する。
* 
* startMirrorLogWindow
* イベントコマンド『文章の表示』をトレースする転記モードを有効化。
* 
* stopMirrorLogWindow
* startMirrorLogWindow で有効化した機能を無効化します。
* 
* openLogScene
* ログ確認シーンへ移行します。
* 
* startAutoLogWindow
* 『TMJumpAction.js』などの対応プラグインと併用した場合に
* 敵撃破時の報酬情報を自動でログに追記する機能を有効化します。
* この機能はゲーム開始時には自動的にオンになっています。
* 
* stopAutoLogWindow
* startAutoLogWindow で有効化した機能を無効化します。
* 
* 
* このプラグインについて
* RPGツクールMV用に作成されたプラグインをMZ用に移植したものです。
* お問い合わせは改変者へお願いいたします。
* 
* 利用規約:
* MITライセンスです。
* https://licenses.opensource.jp/MIT/MIT.html
* 作者に無断で改変、再配布が可能で、
* 利用形態（商用、18禁利用等）についても制限はありません。
* 
*
* @param logWindowX
* @type number
* @min -1000
* @text ログX座標
* @desc ログウィンドウの X 座標。
* 初期値: 0
* @default 0
*
* @param logWindowY
* @type number
* @min -1000
* @text ログY座標
* @desc ログウィンドウの Y 座標。
* 初期値: 456
* @default 456
*
* @param logWindowWidth
* @type number
* @text ログ幅
* @desc ログウィンドウの幅。
* 初期値: 480
* @default 480
*
* @param lines
* @type number
* @text ログ行数
* @desc ログウィンドウの行数。
* 初期値: 6
* @default 6
*
* @param lineHeight
* @type number
* @text ログ１行高
* @desc ログウィンドウの１行の高さ。
* 初期値: 24
* @default 24
* 
* @param padding
* @type number
* @text ログ余白
* @desc ログウィンドウの余白の大きさ。
* 初期値: 10
* @default 10
*
* @param fontSize
* @type number
* @text ログフォントサイズ
* @desc ログウィンドウのフォントサイズ。
* 初期値: 20
* @default 20
*
* @param startVisible
* @type boolean
* @text ゲーム開始時の表示
* @desc ゲーム開始時の表示状態。
* 初期値: ON（ true = ON 表示 / false = OFF 非表示 )
* @default true
*
* @param opacity
* @type number
* @max 255
* @text フレームと背景の不透明度
* @desc ウィンドウフレームと背景の不透明度。
* 初期値: 255 ( 0 ～ 255 )
* @default 255
* 
* @param collideOpacity
* @type number
* @max 255
* @text プレイヤー重複時の不透明度
* @desc プレイヤーと重なったときの不透明度。
* 初期値: 128（ 0 ～ 255 ）
* @default 128
*
* @param messageBusyHide
* @type boolean
* @text メッセージ表示中の非表示
* @desc メッセージウィンドウ表示中はログウィンドウを隠す。
* 初期値: ON（ true = ON 隠す / false = OFF 隠さない )
* @default true
*
* @param eventBusyHide
* @type boolean
* @text イベント起動中の非表示
* @desc イベント起動中はログウィンドウを隠す。
* 初期値: ON（ true = ON 隠す / false = OFF 隠さない )
* @default true
* 
* @param maxLogs
* @type number
* @text 保存ログ最大行数
* @desc 保存するログの最大行数。
* 初期値: 30
* @default 30
* 
* @param autoDelete
* @type variable
* @text 自動的テキスト削除間隔の変数
* @desc 指定したゲーム変数に代入された値の間隔で、自動的にテキストを削除する。単位はフレーム数（ 60フレーム = 1秒 ）
* @default 0
*
*
* @command showLogWindow
* @text ログウィンドウを表示
* @desc ログウィンドウを表示する。
* 
*
* @command hideLogWindow
* @text ログウィンドウを隠す
* @desc ログウィンドウを隠す。
*
* @command addLog
* @text テキストをログウィンドウに追加
* @desc テキストをログウィンドウに追加する。
* 一部の制御文字も使えます（\V[n], \N[n], \P[n], \G, \C[n]）
*
* @arg text
* @text テキスト
* @desc 追加するテキスト
* @type string
* @default
* 
*
* @command deleteLog
* @text テキスト削除
* @desc 一番古いテキストをひとつ削除する。
* 
*
* @command startMirrorLogWindow
* @text 転記モード有効化
* @desc イベントコマンド『文章の表示』をトレースする転記モードを有効化。
* 
*
* @command stopMirrorLogWindow
* @text 転記モード無効化
* @desc 転記モードを無効化。
* 
*
* @command openLogScene
* @text ログ確認シーンへ移行
* @desc ログ確認シーンへ移行します。
* 
*
* @command startAutoLogWindow
* @text 報酬情報自動追記を有効化
* @desc 『TMJumpAction.js』などの対応プラグインと併用した場合に敵撃破時の報酬情報を自動でログに追記する機能を有効化します。
* この機能はゲーム開始時には自動的にオンになっています。
* 
*
* @command stopAutoLogWindow
* @text 報酬情報自動追記を無効化
* @desc 報酬情報自動追記を無効化
*/