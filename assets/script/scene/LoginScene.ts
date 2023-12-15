import { _decorator, Component, Node } from 'cc';
import SceneMgr, { SceneName } from './SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
    start() {

    }

    onBtnClickLogin() {
        SceneMgr.instance.loadScene(SceneName.Monster, () => {
            console.log("进入到monster");
        });
    }

    update(deltaTime: number) {

    }
}


