import { _decorator, Component, Node } from 'cc';
import { ObserverMgr } from './ObserverMgr';
const { ccclass, property } = _decorator;

@ccclass('Observer')
export class Observer extends Component {

    onLoad() {
        this._initMsg();
    }

    _initMsg() {
        let list = this._getMsgList();
        for (let k = 0; k < list.length; k++) {
            let msg = list[k];
            ObserverMgr.instance.on(msg, this._onMsg, this);
        }

    }
    _getMsgList() {
        return [];
    }
    _onMsg(msg, data) {

    }


    onDisable() {
        ObserverMgr.instance.remove(this);
    }

    onEnable() {
        // TODO next version register event method
        // ObserverMgr.removeEventListenerWithObject(this);
        // this._initMsg();
    }

    onDestroy() {
        ObserverMgr.instance.remove(this);
    }
}


