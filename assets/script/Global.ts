import { ObserverMgr } from "./components/event/ObserverMgr";

export module Global {
    export let Event = ObserverMgr.instance;
}
window['Global'] = Global;