import { _decorator, Camera, Color, Component, EventTouch, Graphics, input, Input, instantiate, Label, Node, Prefab, Rect, Sprite, SpriteAtlas, UICoordinateTracker, UITransform, Vec3, view } from 'cc';
import { Quadtree } from './src/Quadtree';
import { Rectangle } from './src/Rectangle';
import { po } from 'gettext-parser';
import { SimpleUtil } from '../script/utils/SimpleUtil';
const { ccclass, property } = _decorator;

@ccclass('DynamicQuatree')
export class DynamicQuatree extends Component {

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

    onLoad() {

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
        setInterval(() => {
            this.loop()
        }, 16)
    }
    start(): void {
        for (let i = 0; i < 50; i++) {
            const rectangle = new Rectangle({
                x: Math.random() * 800,
                y: Math.random() * 600,
                width: 4 + Math.random() * 28,
                height: 4 + Math.random() * 28,

                // Custom data: velocity for x and y, 
                // and a check boolean to flag retrieved objects
                data: {
                    id: this.tIndex,
                    vx: -0.5 + Math.random(),
                    vy: -0.5 + Math.random(),
                    check: false,
                },
            });
            this.onBtnClickAddSmall(rectangle);

            this.myObjects.push(rectangle);
        }
    }

    loop() {
        this.myTree.clear();
        this.clearGraphics();
        this.myObjects.forEach(value => {
            let node: Node = value.data.node;
            let oldPos = node.getPosition();
            let posX = oldPos.x + value.data.vx;
            let posY = oldPos.y + value.data.vy;
            if (posX < 0) value.data.vx = Math.random();
            else if (posX > 800) value.data.vx = -Math.random();

            if (posY < 0) value.data.vy = Math.random();
            else if (posY > 600) value.data.vy = -Math.random();
            value.x = posX;
            value.y = posY;
            node.setPosition(posX, posY, 0)
            node.getComponent(Sprite).color = Color.WHITE;
            this.myTree.insert(value);
        })
        const candidates = this.myTree.retrieve(this.myCursor);
        // // Flag retrieved objects
        // //@ts-ignore
        candidates.forEach(obj => {
            let node = (obj.data as any).node;
            node.getComponent(Sprite).color = Color.GREEN;
        });
        this.drawQuadtree(this.myTree);
    }


    onBtnClickAddSmall(rect?) {
        this.tIndex++;
        rect = rect || new Rectangle({
            x: Math.random() * (this.myTree.bounds.width - 32),
            y: Math.random() * (this.myTree.bounds.height - 32),
            width: 4 + Math.random() * 28,
            height: 4 + Math.random() * 28,
            data: {
                check: false
            },
        })
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

    updateTotal() {
        this.totalNum.string = `${this.myObjects.length}`;
    }
    randMinMax(min, max, round?) {
        let val = min + (Math.random() * (max - min));
        if (round) val = Math.round(val);
        return val;
    }

    onTouchMove(event: EventTouch) {
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
    }
    onTouchCancel(event: EventTouch) {
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
    strokeRect(x, y, w, h, level) {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.lineWidth = level + 2;
        ctx.strokeColor = level < 2 ? Color.RED : Color.BLUE;
        ctx.rect(x, y, w, h);//基于左下角
        ctx.stroke();
    }
    clearGraphics() {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.clear();
    }
}


