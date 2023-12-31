import { macro, warn } from "cc";
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

    //修改val值
    updateItemValueById(id, index) {
        let val: Array<number> = this.getItemValuesById(id);
        if (val.length == 0) {
            warn("%s", id, "对应的val为空,逻辑出现错误");
            return
        }
        val.splice(index, 1, 1);
        console.log(val);
    }


    //获取当前格子的下一个格子信息
    getPreListNodeById(id) {
        let tail = this.itemListTail;
        while (tail && tail.id !== id) {
            tail = tail.pre;
        }

        if (!tail) return null;
        return tail.pre.id;
    }


    //获取当前格子的上一个格子信息
    geNextListNodeById(id) {
        let head = this.itemListHead;
        while (head && head.id !== id) {
            head = head.next;
        }

        if (!head) return null;
        if (head.next.id == -1) return null;
        return head.next;
    }


}

