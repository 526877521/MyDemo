import {_decorator, Component, Node, Label} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('Item')
export class Item extends Component {
    @property(Label)
    num: Label = null;

    start() {

    }

    initItemDate(id: number) {
        this.num.string = `${id}`;
    }

    update(deltaTime: number) {

    }
}

