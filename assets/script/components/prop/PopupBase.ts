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
    view
} from 'cc';
import { PopupAniType } from './PopupAniType';
import { resourceBundlePath } from '../../../../@types/packages/localization-editor/@types/runtime/core/localization-global';
const { ccclass, property } = _decorator;
/**
 * 弹窗基类
 *
 *
 */
@ccclass
export default class PopupBase<Options = any> extends Component {
    @property({ type: Node, tooltip: '背景遮罩' })
    public background: Node = null;

    @property({ type: Node, tooltip: '弹窗主体' })
    public content: Node = null;

    @property({ type: Enum(PopupAniType), tooltip: '界面入场动画类型' })
    animType: PopupAniType = PopupAniType.no_animation;

    @property({ tooltip: '对话框原始尺寸缩放比例', visible: false })
    riginalScale: number = 1;

    @property({ tooltip: '动画播放时系数' })
    timeScale: number = 1;

    /**是否开启屏蔽穿透*/
    protected openBlockInput: boolean = true;

    /** 展示/隐藏动画的时长 */
    public animDuration: number = 0.3;



    /** 弹窗选项 */
    protected options: Options = null;

    public async show(options?: Options, duration?: number) {
        this.options = options;
        this.init(this.options);
        // 更新样式
        this.updateDisplay(this.options);
        this.onBeforeShow && await this.onBeforeShow();
        // 展示动画
        if (duration == undefined) {
            duration = (duration < 0 ? 0 : this.animDuration);
        }
        await this.playShowAnimation(duration);
        // 弹窗回调
        this.onAfterShow && this.onAfterShow();
    }

    /**
     * 隐藏弹窗
     * @param suspended 是否被挂起
     * @param duration 动画时长
     */
    public async hide(suspended: boolean = false, duration?: number) {
        if (suspended) return
        const node = this.node;
        // 动画时长不为 0 时拦截点击事件（避免误操作）
        this.onBeforeHide && await this.onBeforeHide(suspended);
        // 展示动画
        if (duration == undefined) {
            duration = duration < 0 ? 0 : this.animDuration;
        }
        await this.playHideAnimation(duration);
        // 关闭节点
        node.active = false;
        // 弹窗回调
        this.onAfterHide && this.onAfterHide(suspended);
        // 弹窗完成回调
        this.finishCallback && this.finishCallback(suspended);
    }

    /**
     * 播放弹窗展示动画（派生类请重写此函数以实现自定义逻辑）
     *          
     *          
     * @param duration 动画时长
     */
    protected playShowAnimation(duration: number): Promise<void> {
        return new Promise<void>(async res => {
            // 初始化节点
            const background = this.background, main = this.content;
            this.node.active = true;
            await this.showAni(true);
            res(null);
            // background.getComponent(UIOpacity).opacity = (duration === 0 ? 150 : 0);
            // main.getComponent(UIOpacity).opacity = (duration === 0 ? 255 : 0);
            // main.scale = (duration === 0 ? new Vec3(1, 1, 1) : new Vec3(0.5, 0.5, 0.5));
            // // 背景遮罩
            // tween(main)
            //     .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            //     .call(res)
            //     .start();
            // tween(main.getComponent(UIOpacity))
            //     .to(duration, { opacity: 255 }, { easing: 'backOut' })
            //     .start();
        });
    }

    /**
     * 播放弹窗隐藏动画（派生类请重写此函数以实现自定义逻辑）
     * @param duration 动画时长
     */
    protected playHideAnimation(duration: number): Promise<void> {
        return new Promise<void>(async res => {
            // 背景遮罩
            // tween(this.background.getComponent(UIOpacity))
            //     .delay(duration * 0.5)
            //     .to(duration * 0.5, { opacity: 0 })
            //     .start();
            // // 弹窗主体
            // tween(this.content.getComponent(UIOpacity))
            //     .to(duration, { opacity: 255 }, { easing: 'backOut' })
            //     .start();
            // tween(this.content)
            //     .to(duration, { scale: new Vec3(0.5, 0.5, 0.5) }, { easing: 'backIn' })
            //     .call(res)
            //     .start();
            await this.showAni(false);
            this.node.active = false;
            res(null);

        });
    }
    async showAni(isOpen: boolean) {
        switch (this.animType) {
            case PopupAniType.no_animation:
                isOpen ? await this.__openNoAnimation__() : await this.__closeNoAnimation__();
                break;
            case PopupAniType.bottom_to_top:
                isOpen ? await this.__openBottomToTop__() : await this.__closeBottomToTop__();
                break;
            case PopupAniType.ease_back_out:
                isOpen ? await this.__openEaseBackOut__() : await this.__closeEaseBackOut__();
                break;
            case PopupAniType.fade_to_center:
                isOpen ? await this.__openFadeToCenter__() : await this.__closeFadeToCenter__();
                break;
            case PopupAniType.fall_to_center:
                isOpen ? await this.__openFallToCenter__() : await this.__closeFallToCenter__();
                break;
            case PopupAniType.flip_to_center:
                isOpen ? await this.__openFlipToCenter__() : await this.__closeFlipToCenter__();
                break;
            case PopupAniType.left_bottom_to_right_top:
                isOpen ? await this.__openLeftBottomToRightTop__() : await this.__closeLeftBottomToRightTop__();
                break;
            case PopupAniType.left_to_right:
                isOpen ? await this.__openLeftToRight__() : await this.__closeLeftToRight__();
                break;
            case PopupAniType.left_top_to_right_bottom:
                isOpen ? await this.__openLeftTopToRightBottom__() : await this.__closeLeftTopToRightBottom__();
                break;
            case PopupAniType.right_bottom_to_left_top:
                isOpen ? await this.__openRightBottomToLeftTop__() : await this.__closeRightBottomToLeftTop__();
                break;
            case PopupAniType.right_to_left:
                isOpen ? await this.__openRightToLeft__() : await this.__closeRightToLeft__();
                break;
            case PopupAniType.right_top_to_left_bottom:
                isOpen ? await this.__openRightTopToLeftBottom__() : await this.__closeRightTopToLeftBottom__();
                break;
            case PopupAniType.rotate_to_center:
                isOpen ? await this.__opneRotateToCenter__() : await this.__closeRotateToCenter__();
                break;
            case PopupAniType.top_to_bottom:
                isOpen ? await this.__openToptoBottom__() : await this.__closeToptoBottom__();
                break;
        }
    }

    /**
     * 初始化（派生类请重写此函数以实现自定义逻辑）
     * @param options 弹窗选项
     */
    protected init(options: Options) {
    }

    /**
     * 更新样式（派生类请重写此函数以实现自定义逻辑）
     * @param options 弹窗选项
     */
    protected updateDisplay(options: Options) {
    };

    /**
     * 弹窗展示前（派生类请重写此函数以实现自定义逻辑）
     */
    protected onBeforeShow(): Promise<void> {
        return new Promise(resolve => {
            console.log("base节点打开");
            resolve(null);
        })
    };

    /**
     * 弹窗展示后（派生类请重写此函数以实现自定义逻辑）
     */
    protected onAfterShow() {

    }

    /**
     * 弹窗隐藏前（派生类请重写此函数以实现自定义逻辑）
     * @param suspended 是否被挂起
     */
    protected onBeforeHide(suspended: boolean): Promise<void> {
        return new Promise(resolve => {
            console.log("base节点关闭");
            resolve(null);
        })
    };

    /**
     * 弹窗隐藏后（派生类请重写此函数以实现自定义逻辑）
     * @param suspended 是否被挂起
     */
    protected onAfterHide(suspended: boolean) {

    };

    /**
     * 弹窗被挂起（派生类请重写此函数以实现自定义逻辑）
     */
    protected onSuspended(): Promise<void> {
        return new Promise(resolve => {
            resolve(null);
        })
    };

    /**
     * 弹窗流程结束回调（注意：该回调为 PopupManager 专用，重写 hide 函数时记得调用该回调）
     */
    protected finishCallback: (suspended: boolean) => void;


    //动画相关操作

    private __openNoAnimation__() {
        return new Promise(resolve => {
            resolve(null);
        })
    }
    private __closeNoAnimation__() {
        return new Promise(resolve => {
            resolve(null);
        })
    }
    /****************************PopupAniType.bottom_to_top***********************************/
    private async __openBottomToTop__() {
        await this.__openMoveAnim__(0, -2);
    }

    private async __closeBottomToTop__() {
        await this.__closeMoveAnim__(0, -2);
    }
    /****************************PopupAniType.ease_back_out***********************************/
    private __openEaseBackOut__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.3 * this.timeScale, { scale: new Vec3(this.riginalScale + 0.1, this.riginalScale + 0.1, 1) }, { easing: 'quartOut' })
                .to(0.1, { scale: new Vec3(this.riginalScale, this.riginalScale, 1) }, { easing: 'quartOut' })
                .call(() => {
                    this.content.setScale(0, 0, 0);
                    resolve(null)
                })
                .start();
        })

    }

    private __closeEaseBackOut__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.2, { scale: new Vec3(0, 0, 1) })
                .call(() => {
                    this.content.setScale(this.riginalScale, this.riginalScale, this.riginalScale);
                    resolve(null);
                })
                .start();
        })

    }
    /*****************************PopupAniType.fade_to_center*****************************/
    private __openFadeToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            let contentUO = this.content.getComponent(UIOpacity);
            tween(contentUO)
                .to(0.5 * this.timeScale, { opacity: 255 })
                .call(() => {
                    contentUO.opacity = 0;
                    resolve(null);
                })

                .start();
        })

    }

    private __closeFadeToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            let contentUO = this.content.getComponent(UIOpacity);
            tween(contentUO)
                .to(0.2, { opacity: 0 })
                .call(() => { resolve(null) })
                .start();
        })

    }
    /*********************************PopupAniType.fall_to_center******************************/
    private __openFallToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.5 * this.timeScale, { scale: new Vec3(this.riginalScale, this.riginalScale, 1) }, { easing: 'quartOut' })
                .call(() => {
                    this.content.scale = new Vec3(5 * this.riginalScale, 5 * this.riginalScale, 1);
                    resolve(null);
                })
                .start();
        })

    }

    private __closeFallToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.2, { scale: new Vec3(5 * this.riginalScale, 5 * this.riginalScale, 1) })
                .call(() => { resolve(null) })
                .start();
        })

    }

    /***********************************DAILOG_ANIM_TYPE.flip_to_center ****************************/
    private __openFlipToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .call(() => { new Vec3(0, 0, 1) })
                .to(0.1, { scale: new Vec3(this.riginalScale, -this.riginalScale) })
                .to(0.1, { scale: new Vec3(this.riginalScale, this.riginalScale) })
                .to(0.1, { scale: new Vec3(this.riginalScale, -this.riginalScale) })
                .to(0.1, { scale: new Vec3(this.riginalScale, -this.riginalScale) })
                .call(() => {
                    resolve(null)
                })
                .start();
        })

    }

    private __closeFlipToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.1, { scale: new Vec3(this.riginalScale, -this.riginalScale) })
                .to(0.1, { scale: new Vec3(this.riginalScale, this.riginalScale) })
                .to(0.1, { scale: new Vec3(this.riginalScale, -this.riginalScale) })
                .to(0.1, { scale: new Vec3(0, 0) })
                .call(() => { resolve(null) })
                .start();
        })

    }

    /**************************************PopupAniType.left_bottom_to_right_top**********************/
    private async __openLeftBottomToRightTop__() {
        await this.__openOppositeAngle__(-1, -1);
    }
    private async __closeLeftBottomToRightTop__() {
        await this.__closeOppositeAngle__(-1, -1);
    }

    /*************************************PopupAniType.left_to_right********************************/
    private async __openLeftToRight__() {
        await this.__openMoveAnim__(-1, 0);
    }
    private async __closeLeftToRight__() {
        await this.__closeMoveAnim__(-1, 0);
    }

    /*************************************PopupAniType.left_top_to_right_bottom***********************/
    private async __openLeftTopToRightBottom__() {
        await this.__openOppositeAngle__(-1, 1);
    }
    private async __closeLeftTopToRightBottom__() {
        await this.__closeOppositeAngle__(-1, 1);
    }

    /*************************************PopupAniType.right_bottom_to_left_top******************/
    private async __openRightBottomToLeftTop__() {
        await this.__openOppositeAngle__(1, -1);
    }
    private async __closeRightBottomToLeftTop__() {
        await this.__closeOppositeAngle__(1, -1);
    }
    /************************************PopupAniType.right_to_left*****************************/
    private async __openRightToLeft__() {
        await this.__openMoveAnim__(1, 0);
    }
    private async __closeRightToLeft__() {
        await this.__closeMoveAnim__(1, 0);
    }

    /************************************PopupAniType.right_top_to_left_bottom*******************/
    private async __openRightTopToLeftBottom__() {
        await this.__openOppositeAngle__(1, 1);
    }
    private async __closeRightTopToLeftBottom__() {
        await this.__closeOppositeAngle__(1, 1);
    }
    /************************************PopupAniType.rotate_to_center**************************/
    private __opneRotateToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .call(() => {
                    this.content.scale = new Vec3(0, 0, 1);
                    resolve(null)
                })
                .to(0.5 * this.timeScale, { scale: new Vec3(this.riginalScale, this.riginalScale, 1), angle: 360 })
                .start();
        })

    }
    private __closeRotateToCenter__() {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.5 * this.timeScale, { scale: new Vec3(0, 0, 1), angle: -360 })
                .call(() => { resolve(null) })
                .start();
        })

    }

    /************************************PopupAniType.top_to_bottom********************************/
    private async __openToptoBottom__() {
        await this.__openMoveAnim__(0, 1);
    }
    private async __closeToptoBottom__() {
        await this.__closeMoveAnim__(0, 1);
    }
    // 通用对角入场动画
    private __openOppositeAngle__(x: number, y: number) {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .call(() => {
                    this.content.setPosition(v3(x * view.getVisibleSize().width, y * view.getVisibleSize().height, 0))
                    this.content.scale = new Vec3(0, 0);
                    resolve(null);
                })
                .to(0.5 * this.timeScale, { scale: new Vec3(this.riginalScale, this.riginalScale), position: v3(0, 0) })
                .start();
        })

    }
    private __closeOppositeAngle__(x: number, y: number) {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.5 * this.timeScale, { scale: new Vec3(0, 0), position: v3(x * view.getVisibleSize().width, y * view.getVisibleSize().height) })
                .call(() => { resolve(null) })
                .start();
        })

    }

    // 通用上下左右入场方法
    private __openMoveAnim__(scaleX: number, scaleY: number) {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .call(() => {
                    this.content.setPosition(v3(scaleX * view.getVisibleSize().width, scaleY * view.getVisibleSize().height));
                    resolve(null);
                })
                .to(0.5 * this.timeScale, { position: v3(0, 0) }, { easing: 'quartOut' })
                .start();
        })

    }

    private __closeMoveAnim__(scaleX: number, scaleY: number) {
        return new Promise(resolve => {
            Tween.stopAllByTarget(this.content);
            tween(this.content)
                .to(0.2, { position: v3(scaleX * view.getVisibleSize().width, scaleY * view.getVisibleSize().height) })
                .call(() => { resolve(null) })
                .start();
        })

    }

}