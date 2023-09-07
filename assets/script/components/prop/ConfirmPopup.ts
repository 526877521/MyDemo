
import PopupBase from "./PopupBase";


import { _decorator, Node,  Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 确认弹窗（PopB 使用示例）
 */
@ccclass
export default class ConfirmPopup extends PopupBase<ConfirmPopupOptions> {

    @property(Label)
    private titleLabel: Label = null;

    @property(Label)
    private contentLabel: Label = null;

    @property(Node)
    private cancelBtn: Node = null;

    confirmCallback: any = null;


    protected init(options: ConfirmPopupOptions) {
        console.log("初始化界面信息");
        this.contentLabel.string = options.title;
        this.contentLabel.string = options.content;
        this.cancelBtn.active = !!options.isShowCancel;
        this.confirmCallback = options.confirmCallback;
    }

    onBtnClickConfirm() {
        this.confirmCallback && this.confirmCallback();
        this.hide();
    }

    onBtnClickClose() {
        this.hide();
    }

    protected updateDisplay(options: ConfirmPopupOptions): void {
        this.titleLabel.string = options.title;
        this.contentLabel.string = options.content;
        this.confirmCallback = options.confirmCallback;
    }
}

export interface ConfirmPopupOptions {
    title: string;
    content: string;
    isShowCancel?: boolean,
    confirmCallback: Function;
}