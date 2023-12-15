export default class BaseMgr<T extends BaseMgr<T>> {
    protected constructor() {}
    private static _instance: BaseMgr<any> = null;

    static _getInstance<T extends BaseMgr<T>>(): T {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance as T;
    }
}