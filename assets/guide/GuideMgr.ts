import { Canvas, UIOpacity, director } from "cc";
import { ConfirmPopupOptions } from "../script/components/prop/ConfirmPopup";
import PopupManager, { CacheMode } from "../script/components/prop/PopupManager";
import GuideView from "./GuideView";


export default class GuideMgr {


    //是否在引导中 
    _openGuide: boolean = false;

    static _instance: GuideMgr;
    static getInstance() {
        if (!GuideMgr._instance) GuideMgr._instance = new GuideMgr();
        return GuideMgr._instance;
    }

    _currentGuideId: number = 0;//当前的引导id 
    _nextGuideId: number = 0;//当前的引导id 

    _guideView: GuideView = null;


    setGuideView(node) {
        this._guideView = node;
    }

    openGuide(guideId?) {
        this._openGuide = true;
        this._currentGuideId = guideId;
        this._guideView.node.active = true;
        let childrenCount = director.getScene().children.length
        this._guideView.node.setSiblingIndex(childrenCount + 1);
        this._guideView.node.getComponent(Canvas).enabled = false;
        this._guideView.node.getComponent(Canvas).enabled = true;
        this._guideView.startGuideProcess(guideId);
    }
    closeGuide() {
        this._guideView.node.active = false;
        this._openGuide = false;
    }
    getGuideState() {
        return this._openGuide;
    }
    showNextGuide() {
        if (!this._nextGuideId) return
        this.openGuide(this._nextGuideId);
    }
    setNextGuide(guidId) {
        this._nextGuideId = guidId;
    }

    //获取当前的引导Id
    getGuideId() {
        return this._currentGuideId;
    }

}