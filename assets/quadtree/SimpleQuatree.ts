import { _decorator, Camera, Color, Component, EventTouch, Graphics, input, Input, instantiate, Label, Node, Prefab, Rect, Sprite, SpriteAtlas, UICoordinateTracker, UITransform, Vec3, view } from 'cc';
import { Quadtree } from './src/Quadtree';
import { Rectangle } from './src/Rectangle';
import { po } from 'gettext-parser';
import { SimpleUtil } from '../script/utils/SimpleUtil';
const { ccclass, property } = _decorator;

@ccclass('SimpleQuatree')
export class SimpleQuatree extends Component {

    @property({ type: Label, tooltip: "总数量" })
    totalNum: Label = null;

    @property({ type: Graphics, tooltip: "绘图系统" })
    GraphicsNode: Graphics = null;

    @property({ type: Prefab, tooltip: "预制体" })
    quadtreePre: Prefab = null;

    @property({ type: Node, tooltip: "预制体父节点" })
    childContent: Node = null;

    myTree: Quadtree<Rectangle>
    myObjects = [];
    myCursor: Rectangle;//操作的方块大小
    myCursorNode: Node;//操作的方块大小


    isMouseover: boolean = false;

    tIndex: number = 0;


    /**
     * 坐标系基于左上角
     */

    start() {

        this.childContent.parent.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.childContent.parent.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.childContent.parent.on(Node.EventType.TOUCH_END, this.onTouchCancel, this);
        this.myTree = new Quadtree({
            width: 800,
            height: 600,
            x: 0,
            y: 0
        });

        this.myCursor = new Rectangle({
            x: 0,
            y: 0,
            width: 28,
            height: 28
        });

        this.myCursorNode = this.createPrefab(this.myCursor);

        this.myObjects = [];

        this.drawQuadtree(this.myTree);

    }


    onBtnClickAddSmall(event?, cuxtomData?, rect?) {
        this.tIndex++;
        let randomX = Math.random() > 0.5 ? 1 : -1;
        let randomY = Math.random() > 0.5 ? 1 : -1;
        //视图操作

        rect = rect || new Rectangle({
            x: Math.random() * (this.myTree.bounds.width - 32),
            y: Math.random() * (this.myTree.bounds.height - 32),
            width: 4 + Math.random() * 28,
            height: 4 + Math.random() * 28,
            data: {
                id: this.tIndex,
                check: false
            },
        })
        //store object in our array
        this.myObjects.push(rect);

        //insert object in our quadtree
        this.myTree.insert(rect);

        //update total counter
        this.updateTotal();
        let prefabNode = this.createPrefab(rect);
        rect.data.node = prefabNode;
        this.drawQuadtree(this.myTree);
    }


    createPrefab(rect: Rectangle) {
        let nodeItem = instantiate(this.quadtreePre);
        nodeItem.getChildByName("id").getComponent(Label).string = `${this.tIndex}`;
        let nodeTransform = nodeItem.getComponent(UITransform);
        //坐标系转换 从中心点坐标系 转换成左下角
        nodeItem.setPosition(new Vec3(rect.x, rect.y, 0));
        nodeTransform.height = rect.height;
        nodeTransform.width = rect.width;
        this.childContent.addChild(nodeItem);
        return nodeItem;
    }


    onBtnClickAddBig() {
        this.onBtnClickAddSmall(null, null, new Rectangle({
            x: this.randMinMax(0, this.myTree.bounds.width / 2),
            y: this.randMinMax(0, this.myTree.bounds.height / 2),
            width: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            height: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            data: {
                check: false,
                node: null
            },
        }));

    }

    onBtnClickAddTenSmall() {
        for (let i = 0; i < 10; i++) {
            this.onBtnClickAddSmall()
        };
        this.drawQuadtree(this.myTree);
    }

    onBtnClickClean() {
        this.myObjects = [];

        //empty our quadtree
        this.myTree.clear();
        //update total counter
        this.updateTotal();
        this.childContent.removeAllChildren();
        this.clearGraphics();
        this.drawQuadtree(this.myTree);
    }

    updateTotal() {
        this.totalNum.string = `${this.myObjects.length}`;
    }
    randMinMax(min, max, round?) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    }




    onTouchMove(event: EventTouch) {
        this.isMouseover = true;
        // Position cursor at mouse position
        let UICamera: Camera = SimpleUtil.getGameCameraNode().getComponent(Camera)
        let point = event.getLocation();
        let wordPoint = UICamera.screenToWorld(new Vec3(point.x, point.y, 0))
        let localPoint = this.childContent.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(wordPoint.x, wordPoint.y, 0));
        let posX = localPoint.x - 14;
        let posY = localPoint.y - 14;
        this.myCursorNode.setPosition(new Vec3(posX, posY, 0));
        this.myCursor.x = posX;
        this.myCursor.y = posY;
        // Reset myObjects check flag
        // this.childContent.children.forEach(value => {
        //     value.getComponent(Sprite).color = Color.WHITE;
        // })
        this.myObjects.forEach(obj => {
            let node = obj.data.node;
            node.getComponent(Sprite).color = Color.WHITE;
        });

        // this.myObjects.forEach(obj => obj.data.check = false);

        // // Retrieve all objects that share nodes with the cursor
        const candidates = this.myTree.retrieve(this.myCursor);
        // // Flag retrieved objects
        // //@ts-ignore
        candidates.forEach(obj => {

            let node = (obj.data as any).node;
            node.getComponent(Sprite).color = Color.GREEN;
        });

        // Draw scene
    }
    onTouchCancel(event: EventTouch) {
        this.isMouseover = false;
        this.myObjects.forEach(obj => {
            let node = obj.data.node;
            node.getComponent(Sprite).color = Color.WHITE;
        });
    }

    drawQuadtree(node) {

        let bounds = node.bounds;
        //no subnodes? draw the current node
        if (node.nodes.length === 0) {
            this.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height, node.level);
        } else {
            for (let i = 0; i < node.nodes.length; i = i + 1) {
                this.drawQuadtree(node.nodes[i]);
            }
        }
    }

    //
    strokeRect(x, y, w, h, level) {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.lineWidth = level + 2;
        ctx.strokeColor = level < 2 ? Color.RED : Color.GREEN;
        ctx.rect(x, y, w, h);//基于左下角
        ctx.stroke();
    }
    clearGraphics() {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.clear();
    }
}


