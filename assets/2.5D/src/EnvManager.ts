import { _decorator, Component, Node, Camera, Vec3, v3 } from 'cc';
import { CameraController } from './CameraController';
const { ccclass, property } = _decorator;

@ccclass('EnvManager')
export class EnvManager extends Component {
    @property(Camera)
    camera:Camera = null;
    @property(CameraController)
    cameraController:CameraController =null;
    private d1:Vec3 = v3();
    private d2:Vec3 = v3();

    update(deltaTime: number) {
        this.node.children.forEach((v)=>{
            v.setRotationFromEuler(this.cameraController.node.eulerAngles);
        });
        // this.node.children.sort((a,b)=>{return b.position.y - a.position.y});
        const worldPosition = this.camera.node.worldPosition;
        this.node.children.sort((a,b)=>{
            Vec3.subtract(this.d1,a.worldPosition,worldPosition);
            Vec3.subtract(this.d2,b.worldPosition,worldPosition);
            return this.d2.length() - this.d1.length();
        })
    }
}

