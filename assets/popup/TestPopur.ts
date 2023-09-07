import { _decorator, Component, Label, Node } from 'cc';
import PopupBase from '../script/components/prop/PopupBase';
import PopupManager from '../script/components/prop/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('TestPopur')
export class TestPopur extends PopupBase {

    @property({ type: Label, tooltip: "测试lbl" })
    lbl: Label = null;
    start() {

    }
    protected init(options: any): void {
        this.lbl.string = options.lbl;
    }
    protected onAfterShow(): void {

    }
    protected onBeforeShow(): Promise<void> {
        return new Promise((resolve) => {
            console.log("实例节点打开");
            resolve();
        })
    }

    protected onBeforeHide(suspended: boolean): Promise<void> {
        return new Promise(resolve => {
            console.log("实例节点关闭");
            resolve(null);
        })
    }
    onBtnClickHide() {
        PopupManager.hide()
    }


    update(deltaTime: number) {

    }
}


