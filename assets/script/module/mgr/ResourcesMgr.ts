import { Asset, AssetManager, assetManager, resources, warn } from "cc";

import BaseMgr from "./BaseMgr";
import { ResConfig } from "../../../data";

/**
 * 资源管理类
 */

export class ResourcesMgr extends BaseMgr<ResourcesMgr> {
    static get instance(): ResourcesMgr {
        return this._getInstance();
    }
    loadFloderFiles(path: string, type: (typeof Asset)): Promise<Asset[]> {
        return new Promise((resolve) => {
            resources.loadDir(path, type, (error, assets) => {
                if (error) {
                    warn("%s", path, "资源加载失败");
                    resolve(null);
                } else {
                    resolve(assets)
                }
            })

        })
    }
    //加载单个资源
    loadFile(path: string, type?: (typeof Asset), complete?) {
        return new Promise((resolve) => {
            resources.load(path, type, (error, data) => {
                complete && complete(error, data);
                if (error) {
                    warn("%s", path, "资源加载失败");
                    resolve(null);
                } else {
                    resolve(data);
                }
            })

        })
    }

    //加载bundle资源  
    async getFloderByBundle(path: string, type?: (typeof Asset), bundleName: string = "resources") {
        let bundle = assetManager.bundles.get(bundleName)
        if (!bundle) {
            bundle = await this.loadBundle(bundleName);
        }
        let floderFiles = bundle.getDirWithPath(path, type);
        return floderFiles;

    }
    //加载bundle
    loadBundle(bundleName): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    warn("%s", bundleName, "加载异常");
                    return reject(err);
                }
                resolve(bundle);
            });
        });
    }
}