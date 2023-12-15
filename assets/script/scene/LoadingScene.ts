import { _decorator, assetManager, AssetManager, Component, error, instantiate, Label, Prefab, ProgressBar, resources, warn } from 'cc';
import SceneMgr, { SceneCfg } from './SceneMgr';
import { ResConfig } from '../../data';
import { ResourcesMgr } from '../module/mgr/ResourcesMgr';
import { PoolUnit } from '../module/pool/PoolUnit';
import { NodePoolMgr } from '../module/pool/NodePoolMgr';

const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {

    @property({ type: ProgressBar, tooltip: "进度条" })
    progress: ProgressBar = null;

    @property({ type: Label, tooltip: "进度条进度" })
    progressLbl: Label = null;



    onLoad() {
        this._loadSceneAssets();
    }

    async _loadSceneAssets() {
        let sceneName = SceneMgr.instance.getNextSceneName();
        let assetsList = SceneCfg[sceneName];
        let totalCount = await this._getTotalAssetsNum(assetsList);
        let loadIndex: number = 0;
        //加载进度条
        for (let i = 0; i < assetsList.length; i++) {
            const element = assetsList[i];
            if (element.isfloderPath) {
                //加载资源
                let files = await ResourcesMgr.instance.getFloderByBundle(element.path, element.type);
                for (let j = 0; j < files.length; j++) {
                    const filsData = files[j];
                    ResourcesMgr.instance.loadFile(filsData.path, element.type, (error, data) => {
                        this._putPrefabToPool(element, data);
                        loadIndex++;
                        this.updateProgress(loadIndex, totalCount);
                    })
                }
            } else {
                ResourcesMgr.instance.loadFile(element.path, element.type, (error, data) => {
                    if (element.isPool && element.type !== Prefab) {
                        warn("%s", element.path, element.type, "节点池配置错误暂不支持除perfab之外的类型");
                        return
                    }
                    this._putPrefabToPool(element, data);
                    loadIndex++;
                    this.updateProgress(loadIndex, totalCount);
                });
            }

        }
    }

    _putPrefabToPool(element, itemNode: Prefab) {
        if (element.isPool) {
            if (element.type !== Prefab) {
                warn("%s", element.path, element.type, "节点池配置错误暂不支持除perfab之外的类型");
                return
            }
            let prefabNode = instantiate(itemNode);
            let poolUnit: PoolUnit = prefabNode.getComponent(PoolUnit);
            if (!poolUnit) {
                warn("%s", itemNode.name, "未挂载poolUnit组件,无法由节点池管理器创建");
                return
            }
            let registerNum = poolUnit.num;
            let poolName = poolUnit.getPoolName();
            for (let i = 0; i < registerNum; i++)  NodePoolMgr.instance.putNodeToPool(prefabNode);
        }
    }

    //获取预加载的总文件数量
    async _getTotalAssetsNum(assetsList: Array<ResConfig>) {
        let totalFilesCount = 0;
        for (let i = 0; i < assetsList.length; i++) {
            const element = assetsList[i];
            if (element.isfloderPath) {
                //目录
                let files = await ResourcesMgr.instance.getFloderByBundle(element.path, element.type);
                totalFilesCount += (files.length || 0);
            } else {
                totalFilesCount += 1;
            }

        }
        return totalFilesCount;
    }

    updateProgress(loadIndex, totalCount) {
        this.progressLbl.string = `${loadIndex}/${totalCount}`;
        this.progress.progress = loadIndex / totalCount;
        if (loadIndex >= totalCount) {
            SceneMgr.instance.loadScene();
        }
    }

}