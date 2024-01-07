import { ObserverMgr } from "./components/event/ObserverMgr";
import { ItemDataMgr } from "./module/monster/ItemDataMgr";
import { MonsterScene } from "./scene/MonsterScene";

export module Global {
    export const Event = ObserverMgr.instance;
    export const ItemData = ItemDataMgr.instance;
    export let MonserScene: MonsterScene = null;
}
window['Global'] = Global;