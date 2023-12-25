import { ObserverMgr } from "./components/event/ObserverMgr";

export module Global {
    export const  Event = ObserverMgr.instance;
}
window['Global'] = Global;