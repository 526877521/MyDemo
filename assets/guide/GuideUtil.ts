import { _decorator, Camera, Color, Component, EventTouch, Graphics, input, Input, instantiate, Label, Node, Prefab, Rect, Sprite, SpriteAtlas, UICoordinateTracker, UITransform, Vec3, view } from 'cc';
import { SimpleUtil } from '../script/utils/SimpleUtil';

const { ccclass, property } = _decorator;

@ccclass
export class GuideUtil {


    //通过节点名搜索对象
    static seekNodeByName(root,name) {
        if (!root)
            return null;

        if (root.name == name)
            return root;
        let arrayRootChildren = root.children;
        let length = arrayRootChildren.length;
        for (let i = 0; i < length; i++) {
            let child = arrayRootChildren[i];
            let res = this.seekNodeByName(child, name);
            if (res != null)
                return res;
        }
        return null;
    }

   static focusToNode(node) {
        this._mask._graphics.clear();
        let rect = node.getBoundingBoxToWorld();
        let p = this.node.convertToNodeSpaceAR(rect.origin);
        rect.x = p.x;
        rect.y = p.y;

        this._mask._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    }
}