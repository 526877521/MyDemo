import { _decorator, Component, MathBase, Node } from 'cc';
import PopupManager, { CacheMode, PopupParamsType } from '../script/components/prop/PopupManager';
import { ConfirmPopupOptions } from '../script/components/prop/ConfirmPopup';
const { ccclass, property } = _decorator;
import async from 'async';
@ccclass('GameControl')
export class GameControl extends Component {
    start() {
        console.log("async", async);
    }

    update(deltaTime: number) {

    }

    onBtnClickPopup() {
        let pram = {
            lbl: Math.floor(Math.random() * 50)
        }
        PopupManager.show("prefab/testPopur", pram, {
            mode: CacheMode.Normal,
            /** 优先级（优先级大的优先展示） */
            priority: 0,
            /** 立刻展示（将会挂起当前展示中的弹窗） */
            immediately: false
        })
    }


    onBtnClickPopup1() {
        let pram = {
            lbl: "立即展示" + Math.floor(Math.random() * 50)
        }
        PopupManager.show("prefab/testPopur", pram, {
            mode: CacheMode.Normal,
            /** 优先级（优先级大的优先展示） */
            priority: 0,
            /** 立刻展示（将会挂起当前展示中的弹窗） */
            immediately: true
        })
    }

    onBtnClickPopup2() {
        let param: ConfirmPopupOptions = {
            title: "测试标题",
            content: "恭喜升级",
            isShowCancel: false,
            confirmCallback: () => {
                console.log("点击确认按钮");
            }
        }
        PopupManager.show("prefab/testPopConfirm", param, {
            mode: CacheMode.Normal,
            /** 优先级（优先级大的优先展示） */
            priority: 0,
            /** 立刻展示（将会挂起当前展示中的弹窗） */
            immediately: true
        })
    }


}


