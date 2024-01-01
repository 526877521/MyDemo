export enum GAMEMODULE {
    GameInit = 1,
    MONSTER_ADD_ITEM,//新添加一行
    MONSTER_UPDATE_STONE,//更新石头的状态
    MONSTER_UPDATE_ITEM_POS,//消除一行后更新位置
    MONSTER_UPDATE_ITEM_CHILD,//修改格子的子节点

}