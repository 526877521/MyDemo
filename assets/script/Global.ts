import { ObserverMgr } from "./components/event/ObserverMgr";
import { ItemDataMgr } from "./module/monster/ItemDataMgr";

export module Global {
    export const Event = ObserverMgr.instance;
    export const ItemData = ItemDataMgr.instance;
}
window['Global'] = Global;