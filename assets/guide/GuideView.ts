import { Mask, Prefab, UITransform, _decorator, instantiate, view, Node, log, ExtrapolationMode, RichText, Vec3, tween, Vec2, v2, EventTouch, NodeEventType, Component, director, sp } from "cc";
import PopupBase from "../script/components/prop/PopupBase";
import async from "async";
import { GuideText } from "./GuideText";
import { GuideCommand } from "./GuideCommand";
import { SimpleUtil } from "../script/utils/SimpleUtil";
import { Locator } from "./Locator";
import { task } from "./task1";
import PopupManager from "../script/components/prop/PopupManager";
import GuideMgr from "./GuideMgr";


const { ccclass, property } = _decorator;
@ccclass
export default class GuideView extends Component {

    @property({ type: Prefab, tooltip: "手指节点" })
    finger: Prefab = null;

    @property({ type: Prefab, tooltip: "文本" })
    textNode: Prefab = null;

    _finger: Node;
    _textNode: Node;
    _maskCom: Mask;
    _targetNode: Node;
    GodGuide: any;

    onLoad(): void {
        director.addPersistRootNode(this.node);
        GuideMgr.getInstance().setGuideView(this);

    }
    start() {
        this.init();
    }
    init() {
        this.node.getComponent(UITransform).setContentSize(view.getVisibleSize());
        this._targetNode = null;
        if (this.finger) {
            this._finger = instantiate(this.finger);
            this._finger.parent = this.node;
            this._finger.active = false;
        }
        if (this.textNode) {
            let textNode = instantiate(this.textNode);
            textNode.getComponent(UITransform).setContentSize(view.getVisibleSize())
            textNode.parent = this.node;
            textNode.active = false;
            this._textNode = textNode;
        }
        this._maskCom = this.node.getComponentInChildren(Mask);
        this._maskCom.inverted = true;
        this._maskCom.node.active = false;
        //监听事件
        this.node.on(NodeEventType.TOUCH_START, (event: EventTouch) => {
            //放行
            if (!this._maskCom.node.active) {
                event.preventSwallow = false;
                return;
            }
            //目标节点不存在，拦截
            if (!this._targetNode) {
                event.preventSwallow = true;
                return;
            }
            //目标区域存在，击中放行
            let rect = this._targetNode.getComponent(UITransform).getBoundingBoxToWorld();
            if (rect.contains(event.getUILocation())) {
                event.propagationStopped = false;
                event.preventSwallow = true;
                log('命中目标节点，放行');
            } else {
                event.propagationStopped = false;
                event.preventSwallow = false;
                log('未命中目标节点，拦截');
            }
        }, this);
        this.node.on(NodeEventType.TOUCH_END, (event: EventTouch) => {
            //放行
            if (!this._maskCom.node.active) {
                event.preventSwallow = false;
                return;
            }
            //目标节点不存在，拦截
            if (!this._targetNode) {
                event.preventSwallow = true;
                return;
            }
            //目标区域存在，击中放行
            let rect = this._targetNode.getComponent(UITransform).getBoundingBoxToWorld();
            if (rect.contains(event.getUILocation())) {
                event.propagationStopped = false;
                event.preventSwallow = true;

            } else {
                event.propagationStopped = false;
                event.preventSwallow = false;
            }
        }, this);
    }

    //显示文本 此节点点击之后执行后续逻辑
    showText(text, callback) {
        this._textNode.once('click', callback);
        let godText = this._textNode.getComponent(GuideText);
        godText.showText(text, callback);
    }


    _focusToNode(node) {
        //@ts-ignore
        this._maskCom._graphics.clear();
        let rect = node.getComponent(UITransform).getBoundingBoxToWorld();
        let p = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(rect.origin.x, rect.origin.y, 0));
        rect.x = p.x;
        rect.y = p.y;
        //@ts-ignore
        this._maskCom._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    }

    //执行新手引导逻辑
    startGuideProcess(guideId) {
        let step = task.steps.find(value => {
            return value.id == guideId;
        })
        if (step) {
            this._processStep(step, () => {
                console.log("单个任务完成");
                GuideMgr.getInstance().closeGuide();
                GuideMgr.getInstance().showNextGuide();

            })
            return
        }
        console.log("配制信息错误", guideId);
    }


    _processStep(step, callback) {
        async.series({
            //任务开始
            stepStart(cb) {
                if (step.onStart) {
                    step.onStart(() => { cb() });
                } else {
                    cb(null, 1);
                }

            },

            //任务指令
            stepCommand: (cb) => {
                this._maskCom.node.active = true;
                this.scheduleOnce(() => {
                    this._processStepCommand(step, () => {
                        cb(null, 2);
                    });
                }, step.delayTime || 0);
            },

            //任务结束
            taskEnd: (cb) => {
                //@ts-ignore
                this._maskCom._graphics.clear();
                this._finger.active = false;
                //引导结束执行的流程 比如上报等操作
                if (step.onEnd) {
                    step.onEnd(() => { cb() });
                } else {
                    cb(null, 3);
                }
            },
        }, (error, res) => {
            log(`步骤【${step.desc}】结束！`, res);
            callback();
        })
    }
    _processStepCommand(step, cb) {

        let cmd = GuideCommand[step.command.cmd];
        if (cmd) {
            log(`执行步骤【${step.desc}】指令: ${step.command.cmd}`);
            cmd(this, step, () => {
                log(`步骤【${step.desc}】指令: ${step.command.cmd} 执行完毕`);
                cb();
            });
        } else {
            log(`执行步骤【${step.desc}】指令: ${step.command.cmd} 不存在！`);
            cb();
        }
    }

    /**
    * 手指动画
    */
    fingerToNode(node: Node, cb) {
        if (!this._finger) {
            cb();
        }
        this._finger.active = true;
        let p = this.node.getComponent(UITransform).convertToNodeSpaceAR(node.parent.getComponent(UITransform).convertToWorldSpaceAR(node.position));
        let duration = Vec3.clone(p).subtract(this._finger.getPosition()).length() / view.getVisibleSize().height;
        this._finger.getComponentInChildren(sp.Skeleton).paused = true;
        tween(this._finger)
            .to(duration, { position: p })
            .call(() => {
                this._finger.getComponentInChildren(sp.Skeleton).paused = false;
                cb()
            })
            .start()

    }
    find(value, cb?) {
        let root = SimpleUtil.getCanvas();
        Locator.locateNode(root, value, (error, node) => {
            if (error) {
                log(error);
                return;
            }
            log('定位节点成功');
            let rect = this._focusToNode(node);
            if (cb) {
                cb(node, rect);
            }
        });
    }


}


