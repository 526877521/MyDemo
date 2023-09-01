import { _decorator, Component, Node, Vec3, tween, v3, easing, KeyCode, EventKeyboard, SystemEvent, systemEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    target:Node = null;
    private offset:Vec3 = null;
    private vec3:Vec3 = v3();
    start() {
        this.offset = this.node.position.clone();
        systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
    }
    onDestroy(){
        systemEvent.off(SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
    }
    private onKeyDown(e:EventKeyboard){
        if(e.keyCode == KeyCode.KEY_Q){
            this.rotateAround(-45,0.5);
        }else if(e.keyCode == KeyCode.KEY_E){
            this.rotateAround(45,0.5);
        }
    }
    isRotating:boolean = false;
    rotateAround(angle:number,time:number){
        if(this.isRotating) return;
        this.isRotating = true;
        const ea = this.node.eulerAngles;
        tween(this.node).to(time,{
            eulerAngles:v3(ea.x,ea.y,ea.z + angle)
        },{easing:easing.sineOut})
            .call(()=>{
                this.isRotating = false;
            }).start();
    }
    update (deltaTime: number) {
        if(this.target){
            Vec3.add(this.vec3,this.offset,this.target.position);
            this.node.setPosition(this.node.position.clone().lerp(this.vec3,deltaTime)  );
        }
    }
}

