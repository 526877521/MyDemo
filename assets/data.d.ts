import { Asset, Prefab } from "cc"

type ResConfig = {
    type: typeof Asset,
    path: string,
    isPool?: boolean,
    isfloderPath?: boolean,//文件夹目录
}