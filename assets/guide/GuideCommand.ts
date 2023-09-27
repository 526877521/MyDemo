import { GuideUtil } from "./GuideUtil";

/**  新手引导触发机制 :上一个任务完成 、主动触发（达到某一个条件）
 *   节点内容：手指、提示文本、自定义弹出框
 * 解析task    
 *      desc:描述文件
 *      command:{
 *          cmd:类型 //手指 提示文本 弹出框
 *          args:节点路径或者弹出框路径
 *          delayTime:延迟时间
 *          //考虑是否会发送请求或者异步操作
            onStart(callback) {
                setTimeout(() => {
                    cc.log('模拟异步获取数据');
                    callback();
                }, 1000);
            },

            onEnd(callback) {
                setTimeout(() => {
                    cc.log('模拟异步提交数据');
                    callback();
                }, 1000);
            },
 *      }
 * 
 */
export class GuideCommand {
    static locator(step, callback) {
        let { args } = step.command;
        let node = GuideUtil.seekNodeByName(Node, args);
        //遮罩层处理
        
        //设置targetNode 

        //绑定点击事件

        //设置触摸模拟
        // inputManager

    }
}