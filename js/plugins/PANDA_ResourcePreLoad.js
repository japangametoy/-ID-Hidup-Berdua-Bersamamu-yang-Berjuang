//=============================================================================
// PANDA_ResourcePreLoad.js
//=============================================================================
// [Update History]
// 2021-05-29 Ver.1.0.0 First Release for MZ as PANDA_ImagePreLoad.
// 2021-06-23 Ver.1.1.0 fix for subfolder (MZ 1.3.0).
// 2021-07-05 Ver.1.1.1 revert fix for subfolder (MZ 1.3.2).
// 2026-01-12 Ver.2.0.2 Upgrade as PANDA_ResourcePreLoad.
// 2026-01-13 Ver.2.0.3 bug fix.
// 2026-01-18 Ver.2.0.4 bug fix for [Transform Enemy].

/*:
 * @target MZ
 * @plugindesc Preloads images, audio, and animations to reduce lag.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260112220829.html
 * @orderAfter PANDA_ImagePreLoad
 * 
 * @help This plugin preloads image. audio and animation files in advance
 * to reduce lag during display and playback.
 * 
 * When an event starts, it scans the event commands on the current event page
 * and preloads the resources used by the following commands:
 * - Face graphics used by [Show Text]
 * - Image files for the actor added via [Change Party Member]
 * - Image files used by [Change Image] in [Set Movement Route]
 * - Audio files used by [Play SE] in [Set Movement Route]
 * - Animations used by [Show Animation]
 * - Image files used by [Show Picture]
 * - Audio files used by [Play BGM/BGS/ME/SE]
 * - Audio files used by [Change Battle BGM/Victory ME/Defeat ME/Vehicle BGM]
 * - Various image files used by [Change Actor Image]
 * - Image files used by [Change Vehicle Image]
 * - Image files used by [Change Tileset]
 * - Image files used by [Change Battleback]
 * - Image files used by [Change Parallax]
 * - Image files of the enemy after transformation used by [Transform Enemy]
 * - Animations used by [Show Battle Animation]
 * 
 * By preloading these resources when the event starts,
 * lag during display and playback can be reduced.
 * 
 * However, for very long events or events that require preloading a large
 * number of resources, the preloading process itself may take some time.
 * 
 * You can also preload specific resources individually using the following
 * plugin commands. Use them as needed.
 * 
 * - Preload Image : Preloads a specified image file.
 * - Preload Tileset : Preloads image files included in a specified tileset.
 * - Preload Audio : Preloads a specified audio file.
 * - Preload Animation : Preloads a specified animation.
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command PRELOAD_IMAGE
 * @text Preload Image
 * @desc Preloads the specified image file.
 * 
 * @arg file
 * @text Image File Name
 * @desc Specify the image file to be preloaded.
 * @type file
 * @dir img/
 * 
 * @command PRELOAD_TILESET
 * @text Preload Tileset
 * @desc Preloads image files included in the specified tileset.
 * 
 * @arg tilesetId
 * @text Tileset ID
 * @desc Specify the tileset ID to be preloaded.
 * @type tileset
 * 
 * @command PRELOAD_AUDIO
 * @text Preload Audio
 * @desc Preloads the specified audio file.
 * 
 * @arg file
 * @text Audio File Name
 * @desc Specify the audio file to be preloaded.
 * @type file
 * @dir audio/
 * 
 * @command PRELOAD_ANIMATION
 * @text Preload Animation
 * @desc Preloads the specified animation.
 * 
 * @arg animationId
 * @text Animation ID
 * @desc Specify the animation ID to be preloaded.
 * @type animation
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 画像・音声・アニメーションを事前に読み込み、ラグを軽減します。
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260112220829.html
 * @orderAfter PANDA_ImagePreLoad
 * 
 * @help 画像・音声・アニメーションのファイルを事前に読み込み、
 * 表示・再生時のラグ（遅延）を軽減します。
 * 
 * イベント開始時に、そのイベントページのイベントコマンドを走査し、
 * 以下のコマンドで使用される画像・音声・アニメーションを事前に読み込みます。
 * - 「文章の表示」で使用される顔グラフィック
 * - 「メンバーの入れ替え」で加えられたアクターの各種画像ファイル
 * - 「移動ルートの設定」中の「画像の変更」で使用される画像ファイル
 * - 「移動ルートの設定」中の「SEの演奏」で使用される音声ファイル
 * - 「アニメーションの表示」で使用されるアニメーション
 * - 「ピクチャの表示」で使用される画像ファイル
 * - 「BGM/BGS/ME/SEの演奏」で使用される音声ファイル
 * - 「戦闘BGM/勝利ME/敗北ME/乗り物BGMの変更」で使用される音声ファイル
 * - 「アクターの画像変更」で使用される各種画像ファイル
 * - 「乗り物の画像変更」で使用される画像ファイル
 * - 「タイルセットの変更」で使用される画像ファイル
 * - 「戦闘背景の変更」で使用される画像ファイル
 * - 「遠景の変更」で使用される画像ファイル
 * - 「敵キャラの変身」で変身後の敵キャラの画像ファイル
 * - 「戦闘アニメーションの表示」で使用されるアニメーション
 * 
 * イベント開始時にこれらのリソースを事前に読み込んでおくことで、
 * 表示・再生時のラグ（遅延）を軽減します。
 * 
 * ただし、非常に長いイベントや大量の事前読み込みを要するイベントでは、
 * 事前読み込み処理に時間がかかる可能性があります。
 * 
 * また、下記のプラグインコマンドを使用することで、
 * 任意のリソースを個別に先読みできます。必要に応じてご利用ください。
 * - 画像先読み：任意の画像ファイルを先読みします
 * - タイルセット先読み：指定したタイルセットの画像ファイルを先読みします
 * - 音声先読み：任意の音声ファイルを先読みします
 * - アニメーション先読み：任意のアニメーションを先読みします
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command PRELOAD_IMAGE
 * @text 画像先読み
 * @desc 指定した画像ファイルを先読みします。
 * 
 * @arg file
 * @text 画像ファイル名
 * @desc 先読みする画像ファイルを指定します。
 * @type file
 * @dir img/
 * 
 * @command PRELOAD_TILESET
 * @text タイルセット先読み
 * @desc 指定したタイルセットに含まれる画像ファイルを先読みします。
 * 
 * @arg tilesetId
 * @text タイルセットID
 * @desc 先読みするタイルセットIDを指定します。
 * @type tileset
 * 
 * @command PRELOAD_AUDIO
 * @text 音声先読み
 * @desc 指定した音声ファイルを先読みします。
 * 
 * @arg file
 * @text 音声ファイル名
 * @desc 先読みする音声ファイルを指定します。
 * @type file
 * @dir audio/
 * 
 * @command PRELOAD_ANIMATION
 * @text アニメーション先読み
 * @desc 指定したアニメーションを先読みします。
 * 
 * @arg animationId
 * @text アニメーションID
 * @desc 先読みするアニメーションIDを指定します。
 * @type animation
 * 
 */

/*:ko
 * @target MZ
 * @plugindesc 이미지, 오디오, 애니메이션을 사전에 로드하여 지연을 줄입니다.
 * @author panda(werepanda.jp)
 * @url https://www.werepanda.jp/blog/20260112220829.html
 * @orderAfter PANDA_ImagePreLoad
 * 
 * @help 이미지, 오디오, 애니메이션 파일을 사전에 로드하여
 * 표시 및 재생시에 발생하는 지연을 줄입니다.
 * 
 * 이벤트가 시작할 때, 해당 이벤트 페이지의 이벤트 명령을 분석하여
 * 아래 명령에서 사용되는 이미지, 오디오, 애니메이션을 미리 로드합니다.
 * - [메시지 표시]에서 사용되는 얼굴 그래픽
 * - [파티 멤버 변경]으로 추가된 액터의 각종 이미지 파일
 * - [이동 루트 설정] 중 [이미지 변경]에서 사용되는 이미지 파일
 * - [이동 루트 설정] 중 [SE 재생]에서 사용되는 오디오 파일
 * - [애니메이션 표시]에서 사용되는 애니메이션
 * - [그림 표시]에서 사용되는 이미지 파일
 * - [BGM/BGS/ME/SE 재생]에서 사용되는 오디오 파일
 * - [전투 BGM/승리 ME/패배 ME/탈것 BGM 변경]에서 사용되는 오디오 파일
 * - [액터 이미지 변경]에서 사용되는 각종 이미지 파일
 * - [탈것 이미지 변경]에서 사용되는 이미지 파일
 * - [타일셋 변경]에서 사용되는 이미지 파일
 * - [전투 배경 변경]에서 사용되는 이미지 파일
 * - [원경 변경]에서 사용되는 이미지 파일
 * - [적 캐릭터 변신]으로 변신한 이후의 적 캐릭터 이미지 파일
 * - [전투 애니메이션 표시]에서 사용되는 애니메이션
 * 
 * 이벤트 시작시에 이러한 리소스를 미리 로드함으로써
 * 표시 및 재생시의 지연을 줄입니다.
 * 
 * 단, 매우 긴 이벤트이거나 많은 리소스를 사전 로드해야 하는 이벤트의 경우,
 * 사전 로드 처리에 시간이 걸릴 수 있습니다.
 * 
 * 아래 플러그인 명령을 사용하여 원하는 이미지, 오디오, 애니메이션을
 * 개별적으로 사전 로드할 수 있습니다. 필요에 따라 사용해 주십시오.
 * - 이미지 사전 로드 : 지정한 이미지 파일을 사전 로드합니다.
 * - 타일셋 사전 로드 : 지정한 타일셋에 포함된 이미지 파일을 사전 로드합니다.
 * - 오디오 사전 로드 : 지정한 오디오 파일을 사전 로드합니다.
 * - 애니메이션 사전 로드 : 지정한 애니메이션을 사전 로드합니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command PRELOAD_IMAGE
 * @text 이미지 사전 로드
 * @desc 지정한 이미지 파일을 사전 로드합니다.
 * 
 * @arg file
 * @text 이미지 파일명
 * @desc 사전 로드할 이미지 파일을 지정합니다.
 * @type file
 * @dir img/
 * 
 * @command PRELOAD_TILESET
 * @text 타일셋 사전 로드
 * @desc 지정한 타일셋에 포함된 이미지 파일을 사전 로드합니다.
 * 
 * @arg tilesetId
 * @text 타일셋 ID
 * @desc 사전 로드할 타일셋 ID를 지정합니다.
 * @type tileset
 * 
 * @command PRELOAD_AUDIO
 * @text 오디오 사전 로드
 * @desc 지정한 오디오 파일을 사전 로드합니다.
 * 
 * @arg file
 * @text 오지오 파일명
 * @desc 사전 로드할 오디오 파일을 지정합니다.
 * @type file
 * @dir audio/
 * 
 * @command PRELOAD_ANIMATION
 * @text 애니메이션 사전 로드
 * @desc 지정한 애니메이션을 사전 로드합니다.
 * 
 * @arg animationId
 * @text 애니메이션 ID
 * @desc 사전 로드할 애니메이션 ID를 지정합니다.
 * @type animation
 * 
 */


(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	
	//--------------------------------------------------
	// Plugin Command "PreLoad Image"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'PRELOAD_IMAGE', function(args) {
		// get arguments
		const file = args['file'] || '';
		// preload image
		if (file !== '') {
			ImageManager.loadBitmap('img/', file);
		}
	});
	
	//--------------------------------------------------
	// Plugin Command "PreLoad Tileset"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'PRELOAD_TILESET', function(args) {
		// get arguments
		const tilesetId = Number(args['tilesetId']) || 0;
		// preload tileset
		if (tilesetId > 0) {
			$gameTemp.preloadTileset(tilesetId);
		}
	});
	
	//--------------------------------------------------
	// Plugin Command "PreLoad Audio"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'PRELOAD_AUDIO', function(args) {
		// get arguments
		const file = args['file'] || '';
		// preload audio
		AudioManager.preloadAudio('', file);
	});
	
	//--------------------------------------------------
	// Plugin Command "PreLoad Animation"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'PRELOAD_ANIMATION', function(args) {
		// get arguments
		const animationId = Number(args['animationId']) || 0;
		// preload animation
		if (animationId > 0) {
			$gameTemp.preloadAnimation(animationId);
		}
	});
	
	
	//--------------------------------------------------
	// Game_Interpreter.loadImages
	//  [Modified Definition]
	//--------------------------------------------------
	Game_Interpreter.prototype.loadImages = function() {
		for (const command of this._list) {
			switch (command.code) {
				case 101: // Show Text
					ImageManager.loadFace(command.parameters[0]);
					break;
				case 129: // Change Party Member (added)
					if (command.parameters[1] === 0) {
						const actor = $gameActors.actor(command.parameters[0]);
						if (actor) {
							ImageManager.loadCharacter(actor.characterName());
							ImageManager.loadFace(actor.faceName());
							ImageManager.loadSvActor(actor.battlerName());
						}
					}
					break;
				case 205: // Set Movement Route (added)
					const commands = command.parameters[1].list;
					for (const cmd of commands) {
						switch (cmd.code) {
							case 41:	// Change Character
								ImageManager.loadCharacter(cmd.parameters[0]);
								break;
							case 45:	// Play SE
								AudioManager.preloadAudio('se/', cmd.parameters[0].name);
								break;
						}
					}
					break;
				case 212:	// Show Animation (added)
					$gameTemp.preloadAnimation(command.parameters[1]);
					break;
				case 231: // Show Picture
					ImageManager.loadPicture(command.parameters[1]);
					break;
				case 241: // Play BGM (added)
					AudioManager.preloadAudio('bgm/', command.parameters[0].name);
					break;
				case 245: // Play BGS (added)
					AudioManager.preloadAudio('bgs/', command.parameters[0].name);
					break;
				case 249: // Play ME (added)
					AudioManager.preloadAudio('me/', command.parameters[0].name);
					break;
				case 250: // Play SE (added)
					AudioManager.preloadAudio('se/', command.parameters[0].name);
					break;
				case 132: // Change Battle BGM (added)
					AudioManager.preloadAudio('bgm/', command.parameters[0].name);
					break;
				case 133: // Change Victory ME (added)
					AudioManager.preloadAudio('me/', command.parameters[0].name);
					break;
				case 139: // Change Defeat ME (added)
					AudioManager.preloadAudio('me/', command.parameters[0].name);
					break;
				case 140: //  Change Vehicle BGM (added)
					AudioManager.preloadAudio('bgm/', command.parameters[1].name);
					break;
				case 322: // Change Actor Images (added)
					ImageManager.loadCharacter(command.parameters[1]);
					ImageManager.loadFace(command.parameters[3]);
					ImageManager.loadSvActor(command.parameters[5]);
					break;
				case 323: // Change Vehicle Images (added)
					ImageManager.loadCharacter(command.parameters[1]);
					break;
				case 282:	// Change Tileset (added)
					$gameTemp.preloadTileset(command.parameters[0]);
					break;
				case 283: // Change Battle Background (added)
					ImageManager.loadBattleback1(command.parameters[0]);
					ImageManager.loadBattleback2(command.parameters[1]);
					break;
				case 284: // Change Parallax (added)
					ImageManager.loadParallax(command.parameters[0]);
					break;
				case 336:	// Enemy Transform (added)
					const enemy = $dataEnemies[command.parameters[1]];
					if (enemy) {
						if ($gameSystem.isSideView()) {
							ImageManager.loadSvEnemy(enemy.battlerName);
						} else {
							ImageManager.loadEnemy(enemy.battlerName);
						}
					}
					break;
				case 337:	// Show Battle Animation (added)
					$gameTemp.preloadAnimation(command.parameters[1]);
					break;
				
			}
		}
	};
	
	
	//--------------------------------------------------
	// Game_Temp.preloadTileset
	//  [New Definition]
	//--------------------------------------------------
	Game_Temp.prototype.preloadTileset = function(tilesetId) {
		const tileset = $dataTilesets[tilesetId];
		if (tileset) {
			tileset.tilesetNames.map(tilesetName => ImageManager.loadTileset(tilesetName));
		}
	};
	
	//--------------------------------------------------
	// Game_Temp.preloadAnimation
	//  [New Definition]
	//--------------------------------------------------
	Game_Temp.prototype.preloadAnimation = function(animationId) {
		const animation = $dataAnimations[animationId];
		if (animation) {
			// Effekseer
			const effectName = animation.effectName;
			if (effectName) {
				EffectManager.load(effectName);
			}
			// AnimationMV
			const name1 = animation.animation1Name;
			const name2 = animation.animation2Name;
			if (name1) {
				ImageManager.loadAnimation(name1);
			}
			if (name2) {
				ImageManager.loadAnimation(name2);
			}
			// SE
			const soundTimings = animation.soundTimings;
			if (soundTimings) {
				soundTimings.forEach((st) => {
					if (st.se && st.se.name) {
						AudioManager.preloadAudio('se/', st.se.name);
					}
				});
			}
		}
	};
	
	
	//--------------------------------------------------
	// AudioManager.audioBuffers
	//  [New Definition]
	//--------------------------------------------------
	AudioManager._audioBuffers = [];
	
	//--------------------------------------------------
	// AudioManager.preloadAudio
	//  [New Definition]
	//--------------------------------------------------
	AudioManager.preloadAudio = function(folder, name) {
		if (name) {
			const key = folder + name;
			if (!this._audioBuffers[key]) {
				const buffer = this.createBuffer(folder, name);
				this._audioBuffers[key] = buffer;
			}
		}
	};
	
	
})();

