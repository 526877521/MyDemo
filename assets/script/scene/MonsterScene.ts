import { _decorator, Asset, Component, Prefab, Node, UITransform, instantiate, Collider2D, Contact2DType, BoxCollider, BoxCollider2D } from 'cc';
import { NodePoolMgr } from '../module/pool/NodePoolMgr';
import { po } from 'gettext-parser';
import { ItemPrefab } from '../module/monster/ItemPrefab';
import { ItemDataMgr } from '../module/monster/ItemDataMgr';
import { Global } from '../Global';

const { ccclass, property } = _decorator;


/**
 * 预制体创建到content上  手动递增y值 
 *      content缓慢下移 
 */

@ccclass('MonsterScene')
export class MonsterScene extends Component {

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
        let collider = this.bottomCollider.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        //设置监听 
        
    }

    start() {
        //优先创建两列
        this.createPrafabToConent();
        this.schedule(this.createPrafabToConent, 1.5, 7);
    }

    //点击创建上升的空格子
    onBtnClickCreateGrid(event, idx) {

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
    async createCustomPre(index, posY) {

        let itemNode = instantiate(this.prefab);
        itemNode.name = "ItemPrefab_cus";
        itemNode.setPosition(0, posY);
        let values = await itemNode.getComponent(ItemPrefab)?.createCustomItem(index, this._increasingId);
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
        }
    }



    update(dt: number) {
        let pos = this.content.getPosition();
        this.content.setPosition(pos.x, pos.y -= dt * 30, pos.z);
    }
}


