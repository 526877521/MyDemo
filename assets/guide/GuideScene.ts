import { _decorator, Component, EventTarget, EventTouch, instantiate, Node, Prefab, Vec2, Vec3 } from 'cc';
import PopupManager, { CacheMode } from '../script/components/prop/PopupManager';
import { SimpleQuatree } from '../quadtree/SimpleQuatree';
import { SimpleUtil } from '../script/utils/SimpleUtil';
import { Locator } from './Locator';
import { protocol } from 'electron';
import GuideMgr from './GuideMgr';
const { ccclass, property } = _decorator;

@ccclass('GuideScene')
export class GuideScene extends Component {

    @property({ type: Prefab })
    guideView: Prefab = null;

    onLoad() {
        SimpleUtil.addButtonClick(Locator.seekNodeByName(this.node, "btn_sure"), this.onBtnTouched, this);
        SimpleUtil.addButtonClick(Locator.seekNodeByName(this.node, "btn_test2"), this.onBtnTouched, this);
        SimpleUtil.addButtonClick(Locator.seekNodeByName(this.node, "btn_test3"), this.onBtnTouched, this);
    }
    start() {
        this.scheduleOnce(()=>{
            GuideMgr.getInstance().openGuide(2);
        },1)
    }
    onBtnTouched(event: EventTouch) {
        let name = event.target.name;
        switch (name) {
            case "btn_test3":
                console.log("点击气泡");
                GuideMgr.getInstance().setNextGuide(2);
                break
            case "btn_test2":
                console.log("点击宝箱");
                GuideMgr.getInstance().setNextGuide(6);
                break
            case "btn_sure":
                console.log("点击确定按钮");
                GuideMgr.getInstance().setNextGuide(4);
                break
        }
    }

}


