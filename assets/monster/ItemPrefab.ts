import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
import { NodePoolMgr } from '../script/module/pool/NodePoolMgr';
import { POOL_ENMU } from '../script/module/pool/PoolStruct';
const { ccclass, property } = _decorator;

@ccclass('ItemPrefab')
export class ItemPrefab extends Component {

    protected onLoad(): void {
        this.createItem();
    }

    async createItem() {
        let random = Math.floor(Math.random() * 16);
        let indexRandom = random + Math.floor(Math.random() * 22);
        let type = random % 3;
        let index = indexRandom % 4;
        let i = 0;
        while (i < 4) {
            if (i == index) {
                let emptyNode = await NodePoolMgr.instance.getPoolNode(POOL_ENMU.Monster_Empty);
                this.node.addChild(emptyNode);
            } else {
                let node = await NodePoolMgr.instance.getPoolNode((type == 2) ? POOL_ENMU.Monster_Stone : POOL_ENMU.Monster_Normal);
                this.node.addChild(node);
            }
            i++;
        }
    }
    recycleItem() {
        let child = this.node.children;
        for (let i = 0, len = child.length; i < len; i++) {
            const childNode = child[i];
            NodePoolMgr.instance.putNodeToPool(childNode);

        }
    }

    update(deltaTime: number) {

    }
}


