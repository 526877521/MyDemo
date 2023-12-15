import {_decorator, Component, Node, Prefab, instantiate, macro, dynamicAtlasManager} from 'cc';
import {Item} from "db://assets/TestScene/src/Item";
import {SimpleUtil} from "db://assets/script/utils/SimpleUtil";
import SceneMgr, { SceneName } from '../script/scene/SceneMgr';


const {ccclass, property} = _decorator;

@ccclass('TestScene')
export class TestScene extends Component {
    @property(Node)
    content: Node = null;

    @property(Prefab)
    item: Prefab = null;

    start() {
        // this.content.removeAllChildren();
        // for (let i = 0; i < 80; i++) {
        //     let item = instantiate(this.item);
        //     item.getComponent(Item)?.initItemDate(i + 1);
        //     this.content.addChild(item);
        // }


    }
    onBtnClickDirect(){
        SceneMgr.instance.loadScene(SceneName.Game)
    }



    update(deltaTime: number) {

    }
}
//
// macro.CLEANUP_IMAGE_CACHE = true;
// dynamicAtlasManager.enabled = false;
console.log(macro.CLEANUP_IMAGE_CACHE, dynamicAtlasManager.enabled)
