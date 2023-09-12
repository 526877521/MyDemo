import { _decorator, Color, Component, EventTouch, Graphics, input, Input, Label, Node, Rect, view } from 'cc';
import { Quadtree } from './src/Quadtree';
import { Rectangle } from './src/Rectangle';
const { ccclass, property } = _decorator;

@ccclass('SimpleQuatree')
export class SimpleQuatree extends Component {

    @property({ type: Label, tooltip: "总数量" })
    totalNum: Label = null;

    @property({ type: Graphics, tooltip: "绘图系统" })
    GraphicsNode: Graphics = null;

    myTree: Quadtree<Rectangle>
    myObjects = [];
    myCursor: Rectangle;//操作的方块大小


    isMouseover: boolean = false;



    /**
     * 坐标系基于左下角操作
     */

    start() {
        this.myTree = new Quadtree({
            width: 800,
            height: 600,
            x: -400,
            y: -300
        });

        this.myCursor = new Rectangle({
            x: -14,
            y: -14,
            width: 28,
            height: 28
        });
        this.myObjects = [];
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchCancel, this);
        this.drawQuadtree(this.myTree);

    }


    onBtnClickAddSmall(event?, cuxtomData?, rect?) {
        let randomX = Math.random() > 0.5 ? 1 : -1;
        let randomY = Math.random() > 0.5 ? 1 : -1;
        rect = rect || new Rectangle({
            x: Math.random() * (this.myTree.bounds.width - 32) * randomX,
            y: Math.random() * (this.myTree.bounds.height - 32) * randomY,
            width: 4 + Math.random() * 28,
            height: 4 + Math.random() * 28,
            data: {
                check: false
            },
        })
        //store object in our array
        this.myObjects.push(rect);

        //insert object in our quadtree
        this.myTree.insert(rect);

        //update total counter
        this.updateTotal();

        //视图操作

    }

    onBtnClickAddBig() {
        let randomX = Math.random() > 0.5 ? 1 : -1;
        let randomY = Math.random() > 0.5 ? 1 : -1;
        this.onBtnClickAddSmall(null, null, new Rectangle({
            x: this.randMinMax(0, this.myTree.bounds.width / 2) * randomX,
            y: this.randMinMax(0, this.myTree.bounds.height / 2) * randomY,
            width: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            height: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            data: {
                check: false,
            },
        }));
        this.drawQuadtree(this.myTree);
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
    }

    updateTotal() {
        this.totalNum.string = `${this.myObjects.length}`;
    }
    randMinMax(min, max, round?) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
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

    // 400 0 400 300 
    strokeRect(x, y, w, h, level) {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.lineWidth = level + 2;
        ctx.strokeColor = Color.RED;

        //坐标系转换
        // ctx.moveTo(-w / 2, -h / 2);
        // ctx.lineTo(w / 2, -h / 2);
        // ctx.lineTo(w / 2, h / 2);
        // ctx.lineTo(-w / 2, h / 2);
        // ctx.close();
        // ctx.stroke();
        // ctx.fill();

        ctx.rect(x, y, w, h);
        ctx.stroke();
    }


    onTouchMove(event: EventTouch) {
        this.isMouseover = true;
        // Position cursor at mouse position
        // this.myCursor.x = e.offsetX - (myCursor.width/2);
        // this.myCursor.y = e.offsetY - (myCursor.height/2);

        // Reset myObjects check flag
        this.myObjects.forEach(obj => obj.data.check = false);

        // Retrieve all objects that share nodes with the cursor
        const candidates = this.myTree.retrieve(this.myCursor);

        // Flag retrieved objects
        //@ts-ignore
        candidates.forEach(obj => obj.data.check = true);

        // Draw scene
    }
    onTouchCancel(event: EventTouch) {
        this.isMouseover = false;
        this.myObjects.forEach(obj => obj.data.check = false);
    }
}


