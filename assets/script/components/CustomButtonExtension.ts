import {
    _decorator,
    Component,
    Node,
    UIOpacity,
    Vec3,
    tween,
    Enum,
    v3,
    Tween,
    view,
    AudioClip,
    Button
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class CustomButtonExtension extends Button {
    @property(AudioClip)
    clickSound: AudioClip = null;

    onLoad() {
        super.onLoad(); // 调用原始按钮组件的 onLoad 方法

        // 添加点击事件监听
        this.node.on('click', this.onButtonClick, this);
    }

    onButtonClick() {
        // 播放按钮点击音效
        if (this.clickSound) {
            // audioEngine.playEffect(this.clickSound, false);
        }

        // 在这里添加其他按钮点击后的逻辑
    }
}
