import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Node } from 'cc';
import { NodePoolMgr } from '../pool/NodePoolMgr';
import { ItemPrefab, ItemType } from './ItemPrefab';
import { ItemDataMgr } from './ItemDataMgr';
const { ccclass, property } = _decorator;

@ccclass('UpGridPrefab')
export class UpGridPrefab extends Component {

    posIndex: number;

    protected onLoad(): void {
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    /**
     * 
     * @param my 
     * @param other 
     * 
     *      碰撞到格子  
     *          碰到空格子 直接穿过 判定类型 normal 消除  stone 处理
     *          碰到其他类型 直接新增一行
     * 
     */
    onBeginContact(my: BoxCollider2D, other: BoxCollider2D) {
        let otherNode = other.node;
        if (otherNode.name !== "ItemPrefab") {
            let itemNodeCom = otherNode.parent.getComponent(ItemPrefab);
            let value = ItemDataMgr.instance.getItemValuesById(itemNodeCom.increasingId);
            let unEmptyNum = value.filter(val => {
                return val !== 0;
            });
            if (otherNode.name == "EmptyPrefab") {
                if (itemNodeCom.itemType == ItemType.Normal && unEmptyNum.length == 3) {
                    itemNodeCom.recycleItem();
                }else {
                        
                }
            }

            switch (otherNode.name) {

                case "EmptyPrefab":
                    if (itemNodeCom)
                        break
            }


            if (itemNodeCom.itemType)


                for (let len = otherNode.children.length, i = len - 1; i >= 0; i--) {
                    const element = otherNode.children[i];
                    NodePoolMgr.instance.putNodeToPool(element);
                }
        }
    }

    update(dt: number) {
        let pos = this.node.getPosition();
        this.node.setPosition(pos.x, pos.y += dt * 35, pos.z);
    }
}


