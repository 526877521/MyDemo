import { macro } from "cc";
import BaseMgr from "../mgr/BaseMgr";
import { ListNode } from "./ListNode";


/**
 *  数据管理类
 */

export class ItemDataMgr extends BaseMgr<ItemDataMgr>{

    itemListHead: ListNode = new ListNode();
    itemListTail: ListNode = new ListNode(-1);

    public static get instance(): ItemDataMgr {
        return this._getInstance();
    }

    constructor() {
        super();
        this.itemListHead.next = this.itemListTail;
        this.itemListTail.pre = this.itemListHead;
    }
    //向上插入元素
    pushData(id: number, val: number[]) {
        let listNode = new ListNode(id, val, null, this.itemListHead);
        this.itemListTail.insertePre(listNode);
    }
    //向下插入元素
    unshiftData(id: number, val: number[]) {
        let listNode = new ListNode(id, val, null, this.itemListHead);
        this.itemListHead.insertNext(listNode);
    }
    //删除元素
    deleteData(id) {
        let head = this.itemListHead, cur = this.itemListHead.next;
        while (cur && cur.id !== id) {
            head = head.next;
            cur = cur.next;
        }
        //找到要删除的元素
        if (cur && cur.id == id) {
            let curNext = cur.next;
            head.next = curNext;
            if (curNext) curNext.pre = head;
        }
    }

    //获取指定元素的value内容
    getItemValuesById(id) {
        let head = this.itemListHead;
        while (head && head.id !== id) {
            head = head.next;
        }

        if (!head) return [];
        return head.val;
    }

}

