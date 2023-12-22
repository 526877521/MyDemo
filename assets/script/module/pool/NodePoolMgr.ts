import { NodePool, Node, Enum, isValid, warn, instantiate } from "cc";
import BaseMgr from "../mgr/BaseMgr";
import { ResourcesMgr } from "../mgr/ResourcesMgr";
import { PoolUnit } from "./PoolUnit";
import { Pool_Type } from "./PoolStruct";


/**
 * 
 *  节点池管理类 
 *      定义初始化方法 
 *      初始化场景 --> 获取该场景的节点池配置文件 --> 创建对应的节点池 
 *      
 *      PoolUnit  
 */

export class NodePoolMgr extends BaseMgr<NodePoolMgr> {


    public static get instance(): NodePoolMgr {
        return this._getInstance();
    }
    private _poolMap: Map<string, NodePool> = new Map<string, NodePool>();



    /**
     * 从节点池获取对象  
     *      直接从节点池获取 
     *      根据路径获取
     * @param poolName 
     * 
     * 
     * @returns 
     */
    public async getPoolNode(poolName: string) {
        let node;
        let nodePool = this._poolMap.get(poolName);
        if (!nodePool || nodePool.size() == 0) {
            if (!poolName) return null;
            let prefabNode = await ResourcesMgr.instance.loadFile(poolName);
            node = instantiate(prefabNode);
            //判定是否可以放入节点池管理
            let poolUnit = node?.getComponent(PoolUnit);
            if (!poolUnit) {
                warn("%s", poolName, "此节点无法使用节点池创建");
                return
            }
            nodePool = new NodePool(poolName);
            nodePool.put(node);
            this._poolMap.set(poolName, nodePool);
        }
        return nodePool.get()
    }

    //回收节点池 
    public putNodeToPool(targetNode: Node) {
        if (!isValid(targetNode)) {
            warn("节点信息异常");
            return
        }
        let poolUnit: PoolUnit = targetNode.getComponent(PoolUnit);
        if (!poolUnit) {
            warn("%s", targetNode.name, "未绑定节点池组件，无法由系统回收");
            targetNode.destroy();
            return
        }
        let poolName = poolUnit.getPoolName();
        let nodePool = this._poolMap.get(poolName);
        if (!nodePool) {
            nodePool = new NodePool(poolName);
            this._poolMap.set(poolName, nodePool);
        }
        nodePool.put(targetNode);
    }


    //删除节点池


    //清空节点池 
    clear() {
        this._poolMap.forEach(pool => {
            pool.clear();
        })
        this._poolMap.clear();
    }

}