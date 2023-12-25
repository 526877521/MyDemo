import { _decorator, Asset, Component, Prefab, Node, UITransform, instantiate, Collider2D, Contact2DType, BoxCollider, BoxCollider2D, EventTouch, isValid } from 'cc';
import { NodePoolMgr } from '../module/pool/NodePoolMgr';
import { po } from 'gettext-parser';
import { ItemPrefab } from '../module/monster/ItemPrefab';
import { ItemDataMgr } from '../module/monster/ItemDataMgr';
import { Global } from '../Global';
import { Observer } from '../components/event/Observer';
import { GAMEMODULE } from '../module/Constants';
import { POOL_ENMU } from '../module/pool/PoolStruct';
import { UpGridPrefab } from '../module/monster/UpGridPrefab';

const { ccclass, property } = _decorator;


/**
 * 预制体创建到content上  手动递增y值 
 *      content缓慢下移 
 */

@ccclass('MonsterScene')
export class MonsterScene extends Observer {

    @property({ type: Node, tooltip: "滚动节点" })
    content: Node = null;

    @property({ type: Node, tooltip: "底部碰撞条" })
    bottomCollider: Node = null;

    @property({ type: Prefab })
    prefab: Prefab = null;

    _addNums: number = 0;
    _increasingId: number = 1;

    itemNodeMap: Map<number, Node> = new Map<number, Node>();


    onLoad() {
        super.onLoad();
        let collider = this.bottomCollider.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    _getMsgList() {
        return [GAMEMODULE.MONSTER_ADD_ITEM,
        GAMEMODULE.MONSTER_UPDATE_ITEM_POS
        ];
    }

    _onMsg(msg, data) {
        switch (msg) {
            case GAMEMODULE.MONSTER_ADD_ITEM:
                this.addCusItem(data);
                break
            case GAMEMODULE.MONSTER_UPDATE_ITEM_POS:
                this.updateItemNodePos(data);
                break
        }
    }


    start() {
        //优先创建两列
        this.createPrafabToConent();
        this.schedule(this.createPrafabToConent, 1.5);
    }

    //点击创建上升的空格子
    async onBtnClickCreateGrid(event, idx) {
        let parent = event.target;
        let upNode = await NodePoolMgr.instance.getPoolNode(POOL_ENMU.Monster_UpGrid);
        upNode.getComponent(UpGridPrefab).posIndex = Number(idx);
        upNode.setPosition(0, 0, 0);
        parent.addChild(upNode);
    }


    //创建预制体
    async createPrafabToConent() {
        this._addNums++;
        let itemNode = instantiate(this.prefab);
        let itemHeight = itemNode.getComponent(UITransform).height;
        itemNode.setPosition(0, this._addNums * itemHeight);
        let values = await itemNode.getComponent(ItemPrefab)?.createItem(this._increasingId);
        this.content.addChild(itemNode);
        this.itemNodeMap.set(this._increasingId, itemNode);
        ItemDataMgr.instance.pushData(this._increasingId, values);
        this._increasingId++;
    }

    //创建自定义行预制体
    async createCustomPre(posIndex, posY) {
        let itemNode = instantiate(this.prefab);
        itemNode.name = "ItemPrefab_cus";
        itemNode.setPosition(0, posY);
        let values = await itemNode.getComponent(ItemPrefab)?.createCustomItem(posIndex, this._increasingId);
        this.content.addChild(itemNode);
        this.itemNodeMap.set(this._increasingId, itemNode);
        ItemDataMgr.instance.unshiftData(this._increasingId, values);
        this._increasingId++;
    }




    //碰撞到底部  游戏结束
    onBeginContact(my: BoxCollider2D, other: BoxCollider2D) {
        let otherNode = other.node;
        if (otherNode.name == "ItemPrefab") {
            otherNode.getComponent(ItemPrefab)?.recycleItem();
            this.itemNodeMap.delete(otherNode.getComponent(ItemPrefab).increasingId);
        }
    }


    addCusItem(data) {
        let { posIndex, nextId } = data

        let node = this.itemNodeMap.get(nextId);
        let height = node.getComponent(UITransform).height, posY = node.getPosition().y;
        this.createCustomPre(posIndex, posY + height);
    }


    //更新节点位置
    updateItemNodePos(destroyId) {
        let destroyNodePos = this.itemNodeMap.get(destroyId)?.getPosition();
        this.itemNodeMap.delete(destroyId);
        let preId = ItemDataMgr.instance.getPreListNodeById(destroyId);
        let preNode = this.itemNodeMap.get(preId);
        while (preId && preNode && isValid(preNode)) {
            preNode.setPosition(destroyNodePos);
            preId = ItemDataMgr.instance.getPreListNodeById(preId);
            preNode = this.itemNodeMap.get(preId);
            destroyNodePos = preNode.getPosition();
        }
    }


    update(dt: number) {
        let pos = this.content.getPosition();
        this.content.setPosition(pos.x, pos.y -= dt * 30, pos.z);
    }
}


