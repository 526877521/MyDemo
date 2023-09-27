import { Component, Mask, Prefab, UITransform, _decorator, instantiate, view, Node, log } from "cc";
const { ccclass, property } = _decorator;
@ccclass
export default class MaskGuide extends Component {

    @property(Prefab)
    FINGER_PREFAB: Prefab = null;

    @property(Prefab)
    TEXT_PREFAB: Prefab = null;

    _mask: Mask;
    _targetNode: Node;
    _finger: Node;
    _text: Node;
    init() {
        this.node.getComponent(UITransform).setContentSize(view.getVisibleSize());
        //创建手指提示
        this._targetNode = null;
        if (this.FINGER_PREFAB) {
            this._finger = instantiate(this.FINGER_PREFAB);
            this._finger.parent = this.node;
            this._finger.active = false;
        }

        //创建文本提示
        if (this.TEXT_PREFAB) {
            this._text = instantiate(this.TEXT_PREFAB);
            this._text.parent = this.node;
            this._text.active = false;
        }

        this._mask = this.node.getComponentInChildren(Mask);
        this._mask.inverted = true;
        this._mask.node.active = false;


        //监听事件
        this.node.on(Node.EventType.TOUCH_START, (event) => {

            //放行
            if (!this._mask.node.active) {
                this.node._touchListener.setSwallowTouches(false);
                return;
            }

            //目标节点不存在，拦截
            if (!this._targetNode) {
                this.node._touchListener.setSwallowTouches(true);
                return;
            }

            //目标区域存在，击中放行
            let rect = this._targetNode.getComponent(UITransform).getBoundingBoxToWorld();
            if (rect.contains(event.getLocation())) {
                this.node._touchListener.setSwallowTouches(false);
                log('命中目标节点，放行');
            } else {
                this.node._touchListener.setSwallowTouches(true);
                log('未命中目标节点，拦截');
            }
        }, this);
    }
    _focusToNode(node) {
        this._mask._graphics.clear();
        let rect = node.getBoundingBoxToWorld();
        let p = this.node.getComponent(UITransform).convertToNodeSpaceAR(rect.origin);
        rect.x = p.x;
        rect.y = p.y;

        this._mask._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    }

}


