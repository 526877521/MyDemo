
/**
 * 定义链表模型 
 */

export class ListNode {
    id: number;
    val: number[];
    next: ListNode | null;
    pre: ListNode | null;
    constructor(id?: number, val?: number[], next?: ListNode | null, pre?: ListNode | null) {
        this.id = (id === undefined ? 0 : id);
        this.val = (val === undefined ? [] : val);
        this.next = (next === undefined ? null : next);
        this.next = (next === undefined ? null : next);
        this.pre = (pre === undefined ? null : pre);
    }
    insertePre(node: ListNode) {
        const preNode = this.pre
        this.pre = node
        node.next = this
        node.pre = preNode
        if(preNode) preNode.next = node
   }
   deletePre(): ListNode | null {
        const deleteNode = this.pre
        if(!deleteNode) return null
        const preNode =  deleteNode.pre
        if(preNode) {
            preNode.next = this
        }
        this.pre = preNode
        return deleteNode
   }
   insertNext(node: ListNode) {
        const nextNode = this.next
        this.next = node
        node.pre = this
        node.next = nextNode
        if(nextNode) nextNode.pre = node
   }
   deleteNext(): ListNode | null {
        const deleteNode = this.next
        if(!deleteNode) return null
        const nextNode = deleteNode.next
        if(nextNode) {
            nextNode.pre = this
        }
        this.next = nextNode
        return deleteNode
   }


}