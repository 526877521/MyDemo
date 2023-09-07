import { _decorator, Component, MathBase, Node } from 'cc';
import PopupManager, { CacheMode, PopupParamsType } from '../script/components/prop/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    start() {

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

}


