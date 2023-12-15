import { _decorator, Asset, Component, Prefab, resources } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MonsterScene')
export class MonsterScene extends Component {

    //
    @property({ type: Node, tooltip: "滚动节点" })
    content: Node = null;


    @property({ type: Prefab })
    prefab: Prefab = null;

    start() {
        
    }


    //创建预制体
    createPrafab() {

    }


    update(deltaTime: number) {

    }
}


