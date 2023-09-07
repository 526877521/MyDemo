import {_decorator, Component, Node, dragonBones, Vec2, EventKeyboard,v2, KeyCode, Input, input} from 'cc';
import {SimpleUtil} from "db://assets/script/utils/SimpleUtil";

const {ccclass, property} = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({type: dragonBones.ArmatureDisplay})
    armatureDisplay: dragonBones.ArmatureDisplay = null

    private _state: dragonBones.AnimationState = null;
    private _keyCodeMap = {};
    private speedMat: Vec2[][];


    start() {
        let arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        // let arr = [7, 3, 5, 9, 1, 6, 2, 8, 4];
        SimpleUtil.defaultSort(arr);
        SimpleUtil.simpleBubbleSort(arr);
        SimpleUtil.bubbleSort(arr);
        SimpleUtil.selectSort(arr);
        SimpleUtil.insertSort(arr);
        SimpleUtil.binaryInsertionSort(arr);
        SimpleUtil.shellSort(arr);
        SimpleUtil.newShellSort(arr);

        this._state = this.armatureDisplay.playAnimation("down", 0);
        this._state.stop();

        this._keyCodeMap[KeyCode.KEY_W] = false;
        this._keyCodeMap[KeyCode.KEY_A] = false;
        this._keyCodeMap[KeyCode.KEY_S] = false;
        this._keyCodeMap[KeyCode.KEY_D] = false;

        //速度矩阵
        let sqrt = Math.cos(45);
        this.speedMat = [
            [v2(-sqrt, sqrt),
                v2(0, 1),
                v2(sqrt, sqrt)],
            [v2(-1, 0), v2(0, 0), v2(1, 0)],
            [v2(-sqrt, -sqrt), v2(0, -1), v2(sqrt, -sqrt)]
        ]

        //按键事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(e: EventKeyboard) {
        this._keyCodeMap[e.keyCode] = true;
    }

    private onKeyUp(e: EventKeyboard) {
        this._keyCodeMap[e.keyCode] = false;
    }

    @property
    speed: number = 300;

    update(dt: number) {
        let h = 1, v = 1;
        if (this._keyCodeMap[KeyCode.KEY_A]) {
            h -= 1;
        }
        if (this._keyCodeMap[KeyCode.KEY_D]) {
            h += 1;
        }
        if (this._keyCodeMap[KeyCode.KEY_W]) {
            v -= 1;
        }
        if (this._keyCodeMap[KeyCode.KEY_S]) {
            v += 1;
        }
        let inputx = this.speedMat[v][h].x;
        let inputy = this.speedMat[v][h].y;

        const right = this.node.right.clone().multiplyScalar(inputx);
        const up = this.node.up.clone().multiplyScalar(inputy);
        const newInputXY = right.add(up).normalize();

        const speed = this._keyCodeMap[KeyCode.SHIFT_LEFT] ? this.speed * 2 : this.speed;
        let x = this.node.position.x;
        let y = this.node.position.y;

        x += speed * dt * newInputXY.x;
        y += speed * dt * newInputXY.y;

        this.node.setPosition(x, y, 0);

        if (v == 1 && h == 1 && this._state.isPlaying) {
            this._state.stop();
        } else if (v > 1) {
            this.playAnimate("down");
        } else if (v < 1) {
            this.playAnimate("up");
        } else if (h > 1) {
            this.playAnimate("right");
        } else if (h < 1) {
            this.playAnimate("left");
        }
    }

    private playAnimate(name: string) {
        if (this._state.name == name && this._state.isPlaying) return;
        this._state = this.armatureDisplay.playAnimation(name, 0);
    }
}

