/**
 *  场景管理类 
 *      配置场景需要动态加载的资源 
 *      
 *      
 * 
 */

import { Director, Prefab, SpriteFrame, director, warn } from "cc";
import { ResConfig } from "../../data";

export enum SceneName {
    Game = "Game",
    Main = "Main",
    Monster = "Monster",
    Loading = "Loading",
    Login = "Login"
}

export const SceneCfg: { [key: string]: Array<ResConfig> } = {
    Login: [],
    Main: [],
    Monster: [
        { type: Prefab, path: "prefab/monster/EmptyPrefab", isPool: true },
        { type: Prefab, path: "prefab/monster/test", isfloderPath: true, isPool: true },
        { type: Prefab, path: "prefab/monster/NormalPrefab", isPool: true },
        { type: Prefab, path: "prefab/monster/StorePrefab", isPool: true }
    ],
    Game: [{
        type: Prefab, path: "", isPool: true,
    }]
}

export default class SceneMgr {

    private static _instance: SceneMgr = null;
    public static get instance() {
        if (!this._instance) this._instance = new SceneMgr();
        return this._instance;
    }
    _lastSceneLaunched: Function = null;
    _lastSceneName: string = "";

    /**
     * 加载场景
     * @param sceneName 
     * @param onLaunched 
     * @returns 
     */
    loadScene(sceneName?: SceneName, onLaunched?: Function) {
        if (!sceneName) {
            if (!this._lastSceneName) {
                warn("%s", "未配置场景名称，请返回检查");
                return
            }
            director.loadScene(this._lastSceneName, () => {
                this._lastSceneLaunched && this._lastSceneLaunched();
                this._lastSceneLaunched = null;
                this._lastSceneName = "";
            });
            return
        }
        let resCfg = SceneCfg[sceneName];
        if (!resCfg) {
            warn("%s", sceneName, "对应的配置文件不存在");
            return
        }
        if (resCfg.length == 0) {
            //直接进入场景
            director.loadScene(sceneName, () => {
                onLaunched && onLaunched();
            });
            return
        }
        this._lastSceneName = sceneName;
        this._lastSceneLaunched = onLaunched;
        director.loadScene(SceneName.Loading);

    }

    //获取将要加载的场景名称
    getNextSceneName() {
        return this._lastSceneName;
    }




}
