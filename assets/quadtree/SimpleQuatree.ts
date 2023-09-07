import { _decorator, Color, Component, EventTouch, Graphics, input, Input, Label, Node, Rect } from 'cc';
import { Quadtree } from './src/Quadtree';
const { ccclass, property } = _decorator;

@ccclass('SimpleQuatree')
export class SimpleQuatree extends Component {

    @property({ type: Label, tooltip: "总数量" })
    totalNum: Label = null;

    @property({ type: Graphics, tooltip: "绘图系统" })
    GraphicsNode: Graphics = null;

    myTree: any
    myObjects = [];
    myCursor: any;//操作的方块大小


    isMouseover: boolean = false;
    start() {
        this.myTree = new Quadtree({
            x: 0,
            y: 0,
            width: 600,
            height: 600,
            maxLevels: 4,
            maxObjects: 10
        });

        this.myCursor = {
            x: 0,
            y: 0,
            width: 28,
            height: 28
        };
        this.myObjects = [];
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchCancel, this);
        this.drawQuadtree(this.myTree);

    }


    onBtnClickAddSmall(event?, cuxtomData?, rect?) {
        if (!rect) {
            rect = {
                x: this.randMinMax(0, this.myTree.bounds.width - 32),
                y: this.randMinMax(0, this.myTree.bounds.height - 32),
                width: this.randMinMax(4, 32, true),
                height: this.randMinMax(4, 32, true),
                check: false
            };
        }

        //store object in our array
        this.myObjects.push(rect);

        //insert object in our quadtree
        this.myTree.insert(rect);

        //update total counter
        this.updateTotal();
    }

    onBtnClickAddBig() {
        this.onBtnClickAddSmall(null, null, {
            x: this.randMinMax(0, this.myTree.bounds.width / 2),
            y: this.randMinMax(0, this.myTree.bounds.height / 2),
            width: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            height: this.randMinMax(this.myTree.bounds.height / 4, this.myTree.bounds.height / 2, true),
            check: false
        });
    }

    onBtnClickAddTenSmall() {
        for (let i = 0; i < 10; i++) {
            this.onBtnClickAddSmall()
        };
    }

    onBtnClickClean() {
        this.myObjects = [];

        //empty our quadtree
        this.myTree.clear();
        //update total counter
        this.updateTotal();
    }
    onTouchMove(event: EventTouch) {
        this.isMouseover = true;
    }
    onTouchCancel(event: EventTouch) {
        this.isMouseover = false;
    }
    updateTotal() {
        this.totalNum.string = `${this.myObjects.length}`;
    }
    randMinMax(min, max, round?) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    }
    update(deltaTime: number) {
        if (this.isMouseover) {
            // ctx.fillStyle = 'rgba(255,255,255,0.5)';
            // ctx.fillRect(myCursor.x, myCursor.y, myCursor.width, myCursor.height);

            //retrieve all objects in the bounds of the hero 
            let candidates = this.myTree.retrieve(this.myCursor);

            //flag retrieved objects
            for (let i = 0; i < candidates.length; i = i + 1) {
                candidates[i].check = true;
            }
        }
        // this.drawQuadtree(this.myTree);
    }
    drawQuadtree(node) {
        var bounds = node.bounds;

        //no subnodes? draw the current node
        if (node.nodes.length === 0) {
            this.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            //has subnodes? drawQuadtree them!
        } else {
            for (let i = 0; i < node.nodes.length; i = i + 1) {
                this.drawQuadtree(node.nodes[i]);
            }
        }
    }
    strokeRect(x, y, w, h, color?: Color) {
        const ctx = this.GraphicsNode.getComponent(Graphics);
        ctx.lineWidth = 1;
        ctx.strokeColor = color ? color : Color.GREEN;
        // g.rect(x, y, w, h);

        //坐标系转换
        ctx.moveTo(-w / 2, -h / 2);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.close();

        ctx.stroke();
        ctx.fill();
    }
}


