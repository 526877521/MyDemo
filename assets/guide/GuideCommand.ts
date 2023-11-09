import { Node, log } from "cc";
import async from "async";
import GuideView from "./GuideView";
export class GuideCommand {
    //定位节点
    static locator(godGuide: GuideView, step, callback) {
        let { args } = step.command;
        godGuide.find(args, (node) => {
            godGuide._targetNode = node as Node;

            //点击确认
            node.once(Node.EventType.TOUCH_END, () => {
                log('节点被点击');
                //任务完成
                callback();
            });
        });
    }

    //定位节点，显示一个手指动画
    static finger(godGuide:GuideView, step, callback) {
        let { args } = step.command;
        godGuide._targetNode = null;
        //定位节点
        godGuide.find(args, (node) => {
            //手指动画
            godGuide.fingerToNode(node, () => {
                godGuide._targetNode = node;
                //点击确认
                node.once(Node.EventType.TOUCH_END, () => {
                    log('手指定位的节点被点击');
                    //任务完成
                    callback();
                });
            });
        });
    }

    //文本指令
    static text(godGuide, step, callback) {
        let { args } = step.command;
        if (args && (typeof args === 'string' || typeof args === 'number')) {
            args = [args];
        }
        let index = 0;
        //顺序显示文本
        async.eachSeries(args, (str, cb) => {
            let flag = false;
            godGuide.showText(str, () => {
                if (flag) {
                    return;
                }
                flag = true;
                cb();
            });

            if (index++ >= args.length - 1) {
                flag = true;
                cb();
                return;
            }
        }, callback);
    }
}