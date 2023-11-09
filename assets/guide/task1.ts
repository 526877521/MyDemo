import { log } from "cc";

export const task = {
    name: '进入商店',
    debug: true,
    autorun: false,
    steps: [
        {
            id: 1,
            desc: '文本提示',
            command: {
                cmd: 'text',
                args: [`<color=#394250>欢迎体验Shawn的新手引导框架特别感谢【黝黑蜗科】提供的TS版本</color>`, `<color=#394250>本案例演示：
1.文本提示指令
2.手指定位指令
3.自动执行引导
4.点击操作录像</color>`, `<color=#394250>首先，请点击首页按钮</color>`]
            },
        },

        {
            id: 2,
            desc: '点击主界面主页按钮',
            command: { cmd: 'finger', args: 'btn_sure' },
            delayTime: 0.5,
        },

        {
            id: 3,
            desc: '文本提示',
            command: { cmd: 'text', args: '点击主界面设置按钮' }
        },

        {
            id: 4,
            desc: '点击主界面宝箱按钮',
            command: { cmd: 'finger', args: 'btn_test2' },
        },

        {
            id: 5,
            desc: '文本提示',
            command: { cmd: 'text', args: 'btn_test3' }
        },

        {
            id: 6,
            desc: '点击主界面气泡按钮',
            command: { cmd: 'finger', args: 'btn_test3' },
        },

        {
            id: 7,
            desc: '文本提示',
            command: { cmd: 'text', args: 'btn_test2' }
        },

        {
            id: 8,
            desc: '点击商店充值按钮btn_sure',
            command: { cmd: 'finger', args: 'btn_sure' },
            onStart(callback) {
                setTimeout(() => {
                    log('模拟异步获取数据');
                    callback();
                }, 1000);
            },

            onEnd(callback) {
                setTimeout(() => {
                    log('模拟异步提交数据');
                    callback();
                }, 1000);
            },
        },

        {
            id: 9,
            desc: '文本提示',
            command: { cmd: 'text', args: '点击充值界面关闭钮' }
        },

        {
            id: 10,
            desc: '点击充值界面关闭钮',
            command: { cmd: 'finger', args: 'chargePanel > btn_close' },
            delayTime: 0.5
        },

        {
            id: 11,
            desc: '回到主页',
            command: { cmd: 'finger', args: 'Home > main_btns > btn_home' },
        },
    ]
}