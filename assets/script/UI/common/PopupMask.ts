import { _decorator, Component, Node, NodeEventType, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupMask')
export class PopupMask extends Component {

    closeCb: Function;
    onLoad(): void {
        this.node.getComponent(UITransform).setContentSize(view.getVisibleSize());
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    onTouchEnd() {
        if (this.closeCb) this.closeCb();
    }
    setTouckCb(cb: Function) {
        this.closeCb = cb;
    }
}


