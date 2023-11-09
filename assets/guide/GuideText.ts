import { _decorator, Component, Node, RichText, UITransform, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GuideText')
export class GuideText extends Component {
    @property({ type: RichText, tooltip: "文本描述lbl" })
    richTextLbl: RichText = null;

    @property({ type: Node, tooltip: "文本背景" })
    lblBackground: Node = null;


    @property({ type: Node, tooltip: "点击屏幕继续" })
    continueLblNode: Node = null;

    callback: any;
    start() {
        this.node.on(Node.EventType.TOUCH_START, (event) => {
            //隐藏文本提示
            if (this.node.active) {
                this.node.active = false;
                this.node.emit('click');
                return;
            }
        });
    }
    showText(lbl: string, cb?) {
        this.callback = cb;
        this.node.active = true;
        this.richTextLbl.string = lbl;
        this.scheduleOnce(() => {
            this.lblBackground.getComponent(UITransform).height = this.richTextLbl.node.getComponent(UITransform).height + 50;
            this.lblBackground.getComponentInChildren(Widget).updateAlignment();
        }, 0)

    }

    enableContinueLbl(boo: boolean) {
        this.continueLblNode.active = boo;
    }

    update(deltaTime: number) {

    }
}


