import { _decorator, Component, Node, NodeEventType, UITransform, view } from 'cc';
import PopupManager from '../../components/prop/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('PopupMask')
export class PopupTitle extends Component {

    @property({ type: Node, tooltip: "返回按钮" })
    backBtn: Node = null;

    @property({ type: Node, tooltip: "返回按钮" })
    helpBtn: Node = null;


    closeCb: Function;
    onLoad(): void {
        this.backBtn.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.helpBtn.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    onTouchEnd(event) {
        let name = event.target.name;
        switch (name) {
            case "btn_back":
                PopupManager.hide();
                break;
            case "btn_help":
                let currentPopup = PopupManager.current;
                if (currentPopup) {
                    //获取help 路径内容
                    console.log(currentPopup.node.name);
                }
                break
        }
    }
    setTouckCb(cb: Function) {
        this.closeCb = cb;
    }
}


