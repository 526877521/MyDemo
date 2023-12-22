import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

//执行app初始化操作

@ccclass('AppInit')
export class AppInit extends Component {

    onLoad() {
        director.addPersistRootNode(this.node);
    }

    update(deltaTime: number) {
        
    }
}


