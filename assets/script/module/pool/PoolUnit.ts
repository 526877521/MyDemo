import { _decorator, CCInteger, Component } from 'cc';
import { POOL_ENMU, Pool_Type } from './PoolStruct';

const { ccclass, property, menu } = _decorator;

/**
 * 定义节点池的类型 以及初始化的数量 
 *      
 */


@ccclass('PoolUnit')
@menu("自定义组件")
export class PoolUnit extends Component {

    @property(CCInteger)
    _type: number = 0;

    @property({ type: Pool_Type, tooltip: "节点类型" })
    get type() {
        return this._type;
    }
    set type(v) {
        this._type = v;
    }

    @property({ type: CCInteger, tooltip: "预生成的数量" })
    num: number = 1;

    //获取节点名称
    getPoolName() {
        return POOL_ENMU[Pool_Type[this.type]];
    }


    //获取节点路径
    getPoolPath() {
        let key = this.getPoolName();
        return POOL_ENMU[key]
    }

}



