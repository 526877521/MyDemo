import { Enum } from "cc";

export const POOL_ENMU = {
    Monster_Normal: "prefab/monster/NormalPrefab",
    Monster_Stone: "prefab/monster/StorePrefab",
    Monster_Empty: "prefab/monster/EmptyPrefab",
    Monster_UpGrid: "prefab/monster/UpGridPrefab",
}

//cocos 不支持枚举为value的值  进行枚举转换
export function enumPoolEunm() {
    let index = 0;
    let res = {};
    for (const key in POOL_ENMU) {
        res[key] = index;
        index++;
    }
    return Enum(res);
}

export const Pool_Type = enumPoolEunm();