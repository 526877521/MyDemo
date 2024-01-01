import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, Node } from 'cc';
import { NodePoolMgr } from '../pool/NodePoolMgr';
import { ItemPrefab, ItemType } from './ItemPrefab';
import { ItemDataMgr } from './ItemDataMgr';
import { ObserverMgr } from '../../components/event/ObserverMgr';
import { GAMEMODULE } from '../Constants';
import { Global } from '../../Global';
const { ccclass, property } = _decorator;

@ccclass('UpGridPrefab')
export class UpGridPrefab extends Component {

    posIndex: number = 0;

    _isCollider: boolean = false;
    protected onLoad(): void {
        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._isCollider = false;
    }

    init(pos) {
        this.posIndex = pos;
        this._isCollider = false;
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
        if (otherNode.name !== "ItemPrefab" && otherNode.name !== "bottomCollider") {
            let itemNodeCom = otherNode.parent.getComponent(ItemPrefab);
            let value = ItemDataMgr.instance.getItemValuesById(itemNodeCom.increasingId);
            let unEmptyNum = value.filter(val => {
                return val !== 0;
            });
            if (otherNode.name == "EmptyPrefab" && unEmptyNum.length == 3) {
                this._isCollider = true;
                if (itemNodeCom.itemType == ItemType.Normal) {
                    itemNodeCom.recycleItem();
                    ObserverMgr.instance.emit(GAMEMODULE.MONSTER_UPDATE_STONE, itemNodeCom.increasingId);
                } else if (itemNodeCom.itemType == ItemType.Stone) {
                    if (itemNodeCom.eliminateNum == 1) {
                        itemNodeCom.recycleItem();
                    } else {
                        itemNodeCom.eliminateNum = 1;
                        ObserverMgr.instance.emit(GAMEMODULE.MONSTER_UPDATE_STONE, itemNodeCom.increasingId);
                    }
                }
            } else if (otherNode.name == "EmptyPrefab" && unEmptyNum.length != 3) {
                //如果上面一行 碰到障碍物 则在此行上修改，非 则不进行处理
                let nextLstNode = Global.ItemData.geNextListNodeById(itemNodeCom.increasingId);
                let flag: boolean = false;
                if (!nextLstNode) {
                    //说明碰到顶
                    flag = true;
                    NodePoolMgr.instance.putNodeToPool(this.node);

                } else {
                    let value = nextLstNode.val[this.posIndex];
                    if (value !== 0) {
                        NodePoolMgr.instance.putNodeToPool(this.node);
                        flag = true;
                    }

                }
                if (flag) {
                    Global.ItemData.updateItemValueById(itemNodeCom.increasingId, this.posIndex);
                    ObserverMgr.instance.emit(GAMEMODULE.MONSTER_UPDATE_ITEM_CHILD, { id: itemNodeCom.increasingId, posIndex: this.posIndex });
                }

            } else if (otherNode.name == "NormalPrefab" || otherNode.name == "StorePrefab") {
                //新增一行 或者在新增上替换
                NodePoolMgr.instance.putNodeToPool(this.node);
                if (this._isCollider) return
                let preListId = ItemDataMgr.instance.getPreListNodeById(itemNodeCom.increasingId);
                if (!preListId) {
                    ObserverMgr.instance.emit(GAMEMODULE.MONSTER_ADD_ITEM, { posIndex: this.posIndex, nextId: itemNodeCom.increasingId });
                }
            }
        }
    }

    update(dt: number) {
        let pos = this.node.getPosition();
        this.node.setPosition(pos.x, pos.y += dt * 300, pos.z);
    }
}


