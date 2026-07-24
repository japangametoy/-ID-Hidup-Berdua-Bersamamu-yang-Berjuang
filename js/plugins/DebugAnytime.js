// DebugAnytime.js Ver.1.1.4
// MIT License (C) 2024 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @orderAfter KMS_DebugUtil
* @plugindesc Invoke the debug menu at any time.
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/505603685.html
* @help Ver.1.1.4
* Opens the debug menu while keeping the current scene.
*
*/

/*:ja
* @target MZ
* @orderAfter KMS_DebugUtil
* @plugindesc いつでもデバッグメニューを起動できます。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/505603685.html
* @help シーンを現状維持したままデバッグメニューを開けます。
*
* [更新履歴]
* 2024/11/10：Ver.1.0.0　公開。
* 2024/11/14：Ver.1.1.0　挙動修正。KMS_DebugUtilへの最適化。
* 2024/11/17：Ver.1.1.1　KMS_DebugUtilの「エンカウント」の挙動を修正。
* 2024/11/21：Ver.1.1.2　KMS_DebugUtilの「スイッチ・変数監視」の挙動を修正。
* 2024/11/25：Ver.1.1.3　条件式を修正。
* 2025/03/14：Ver.1.1.4　KMS_DebugUtilでマップが存在しない時の不具合を修正。
*
*/

'use strict';

if (Utils.isOptionValid('test')) {
	const hasDebugUtil = !!(window.KMS && KMS.DebugUtil);

	//-----------------------------------------------------------------------------
	// SceneManager

	SceneManager._keptScenes = [];
	SceneManager._popedKeptScenes = [];
	SceneManager._keptBitmaps = [];
	SceneManager._popedKeptBitmaps = [];
	//上書き
	SceneManager.changeScene = function() {
		if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
			if (this._scene) {
				if (!this._keptScenes.contains(this._scene)) {
					this._scene.terminate(); //保存するシーン以外は終了
				}
				this.onSceneTerminate();
			}
			this._scene = this._nextScene;
			this._nextScene = null;
			if (this._scene) {
				if (!this._popedKeptScenes.contains(this._scene)) {
					this._scene.create(); //復元するシーン以外は生成
				}
				this.onSceneCreate();
			}
			if (this._exiting) {
				this.terminate();
			}
		}
	};
	//上書き
	SceneManager.updateScene = function() {
		if (this._scene) {
			if (this._scene.isStarted()) {
				if (this.isGameActive()) {
					this._scene.update();
				}
			} else if (this._scene.isReady()) {
				this.onBeforeSceneStart();
				if (this._keptScene) {
					this._keptScene._started = true; //復元するシーンは開始判定にするだけ
					this._keptScene = null;
				} else {
					this._scene.start();
				}
				this.onSceneStart();
			}
		}
	};

	const _SceneManager_onBeforeSceneStart = SceneManager.onBeforeSceneStart;
	SceneManager.onBeforeSceneStart = function() {
		if (this._keptScenes.contains(this._previousScene)) {
			this._previousScene = null; //保存するシーンは破壊させない
		}
		this._keptScene = null;
		while (this._popedKeptScenes.length) {
			const scene = this._popedKeptScenes.pop();
			if (scene !== this._scene) {
				scene.destroy();
			} else {
				this._keptScene = scene;
			}
		}
		while (this._popedKeptBitmaps.length) {
			const bitmap = this._popedKeptBitmaps.pop();
			if (bitmap) {
				bitmap.destroy();
			}
		}
		_SceneManager_onBeforeSceneStart.call(this);
	};
	//上書き
	SceneManager.push = function(sceneClass) {
		const isDebug = sceneClass === Scene_Debug;
		this._keptBitmaps.push(isDebug ? this.snap() : null);
		this._stack.push(this._scene.constructor);
		this._keptScenes.push(isDebug ? this._scene : null);
		const scene = this._scene;
		if (isDebug) {
			this._scene._started = false;
			this._scene = null;
		}
		this.goto(sceneClass);
		this._scene = scene;
	};
	//上書き
	SceneManager.pop = function() {
		if (this._stack.length > 0) {
			const scene = this._stack.pop();
			const bitmap = this._keptBitmaps.pop();
			if (bitmap) {
				this._popedKeptBitmaps.push(bitmap);
			}
			const keptScene = this._keptScenes.pop();
			this.goto(keptScene ? null : scene);
			if (keptScene) {
				this._popedKeptScenes.push(keptScene);
				this._nextScene = keptScene;
			}
		} else {
			this.exit();
		}
	};

	const _SceneManager_clearStack = SceneManager.clearStack;
	SceneManager.clearStack = function() {
		_SceneManager_clearStack.call(this);
		this.clearAllKeptScenes();
	};

	SceneManager.clearAllKeptScenes = function() {
		while(this._keptScenes.length) {
			const scene = this._keptScenes.pop();
			if (scene) {
				scene.destroy();
			}
		}
		while(this._keptBitmaps.length) {
			const bitmap = this._keptBitmaps.pop();
			if (bitmap) {
				bitmap.destroy();
			}
		}
	};

	SceneManager.keptBitmap = function() {
		const bitmaps = this._keptBitmaps;
		return bitmaps.length ? this._keptBitmaps[bitmaps.length - 1] : null;
	};

	//-----------------------------------------------------------------------------
	// Scene_Base

	//マップ以外でもデバッグメニューを呼べるようにする
	let update = false;
	const _Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function() {
		_Scene_Base_update.call(this);
		if (!SceneManager.isSceneChanging() && !SceneManager.isCurrentSceneBusy()) {
			this.updateCallDebugAnytime();
		}
	};

	Scene_Base.prototype.updateCallDebugAnytime = function() {
		if (this.isDebugAnytimeCalled()) {
			if (this.constructor === Scene_Debug) {
				return;
			}
			const keptScenes = SceneManager._keptScenes;
			const stack = SceneManager._stack;
			if ([Scene_Map, Scene_Title].some(sceneClass => this.constructor === sceneClass)) {
				SceneManager.snapForBackground();
			}
			SceneManager.push(Scene_Debug);
		}
	};

	Scene_Base.prototype.isDebugAnytimeCalled = function() {
		return Input.isTriggered("debug");
	};

	//-----------------------------------------------------------------------------
	// Scene_Map

	Scene_Map.prototype.updateCallDebug = function() {};
	Scene_Map.prototype.isDebugCalled = function() {};

	//-----------------------------------------------------------------------------
	// Scene_Battle

	if (hasDebugUtil) {
		const _Scene_Battle_shouldAutosave = Scene_Battle.prototype.shouldAutosave;
		Scene_Battle.prototype.shouldAutosave = function() {
			return _Scene_Battle_shouldAutosave.call(this) && !BattleManager._needsKeptMapRecreate;
		};

		const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
		Scene_Battle.prototype.terminate = function() {
			_Scene_Battle_terminate.call(this);
			if (BattleManager._keptBattleTroopId) {
				BattleManager.setup(BattleManager._keptBattleTroopId, BattleManager._canEscape, BattleManager._canLose);
				BattleManager.saveBgmAndBgs();
			}
		};
	}

	//-----------------------------------------------------------------------------
	// Scene_Debug

	if (Scene_MenuBase.prototype.createBackground === Scene_Debug.prototype.createBackground) {
		Scene_Debug.prototype.createBackground = function() {
			Scene_MenuBase.prototype.createBackground.apply(this, arguments);
		};
	}

	const _Scene_Debug_createBackground = Scene_Debug.prototype.createBackground;
	Scene_Debug.prototype.createBackground = function() {
		_Scene_Debug_createBackground.call(this);
		if (this._backgroundSprite) {
			this._backgroundSprite.bitmap = SceneManager.keptBitmap();
		}
	};

	if (hasDebugUtil) {
		const _Scene_Debug_create = Scene_Debug.prototype.create;
		Scene_Debug.prototype.create = function() {
			_Scene_Debug_create.call(this);
			if (!DataManager.isMapLoaded()) {
				DataManager.loadMapData(0);
				if (DataManager.loadMapExData) {
					DataManager.loadMapExData(0);
				}
			}
		};

		const _Scene_Debug_onReloadMap = Scene_Debug.prototype.onReloadMap;
		Scene_Debug.prototype.onReloadMap = function() {
			_Scene_Debug_onReloadMap.call(this);
			if ($gameParty.inBattle()) {
				BattleManager.abort();
				BattleManager.requestKeptMapRecreate();
			} else {
				SceneManager.goto(Scene_Map);
			}
		};

		const _Scene_Debug_onTransferMapTileOk = Scene_Debug.prototype.onTransferMapTileOk;
		Scene_Debug.prototype.onTransferMapTileOk = function() {
			_Scene_Debug_onTransferMapTileOk.call(this);
			if ($gameParty.inBattle()) {
				BattleManager.abort();
				BattleManager.requestKeptMapRecreate();
			} else {
				SceneManager.goto(Scene_Map);
			}
		};

		const _Scene_Debug_onTroopOk = Scene_Debug.prototype.onTroopOk;
		Scene_Debug.prototype.onTroopOk = function() {
			const setup = BattleManager.setup;
			if ($gameParty.inBattle()) {
				BattleManager.setup = BattleManager.setupKeptBattleRecreate;
				BattleManager.requestKeptBattleRecreate();
				BattleManager.replayBgmAndBgs();
			}
			_Scene_Debug_onTroopOk.call(this);
			BattleManager.setup = setup;
			if ($gameParty.inBattle() && SceneManager.isSceneChanging()) {
				BattleManager.saveBgmAndBgs();
				BattleManager.abort();
				this.popScene(); //push打ち消しとシーンの終了を同時に
				while (SceneManager._nextScene && SceneManager._nextScene.constructor !== Scene_Battle) {
					SceneManager.pop(); //戦闘シーンが重複しないように巻き戻す
				}
			}
		};
		if (Scene_MenuBase.prototype.terminate === Scene_Debug.prototype.terminate) {
			Scene_Debug.prototype.terminate = function() {
				Scene_MenuBase.prototype.terminate.apply(this, arguments);
			};
		}
		const _Scene_Debug_terminate = Scene_Debug.prototype.terminate;
		Scene_Debug.prototype.terminate = function() {
			_Scene_Debug_terminate.call(this);
			$gameTemp.requestDebugWatchRefresh();
		};
	}

	//-----------------------------------------------------------------------------
	// BattleManager

	if (hasDebugUtil) {
		const _BattleManager_initMembers = BattleManager.initMembers;
		BattleManager.initMembers = function() {
			_BattleManager_initMembers.call(this);
			this._needsKeptMapRecreate = false;
			this._needsKeptBattleRecreate = false;
			this._keptBattleTroopId = 0;
		};

		BattleManager.requestKeptMapRecreate = function() {
			this._needsKeptMapRecreate = true;
		};

		BattleManager.requestKeptBattleRecreate = function() {
			this._needsKeptBattleRecreate = true;
		};

		BattleManager.setupKeptBattleRecreate = function(troopId) {
			this._keptBattleTroopId = troopId;
		};

		const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
		BattleManager.updateBattleEnd = function() {
			_BattleManager_updateBattleEnd.call(this);
			if (this._needsKeptMapRecreate) {
				SceneManager.goto(Scene_Map); //シーンを再構築
			} else if (this._needsKeptBattleRecreate) {
				const nextScene = SceneManager._nextScene.constructor;
				SceneManager.push(Scene_Battle);
				const stack = SceneManager._stack;
				stack[stack.length - 1] = nextScene; //スタックを補正
			}
		};
	}
}