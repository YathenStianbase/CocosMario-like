import { _decorator, Component, Node, Quat } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('Rot')
export class Rot extends Component {

    @property
    public p: number = 1;
    @property
    public x: number = 0;
    @property
    public y: number = 0;
    @property
    public z: number = 0;
    start() {
        var p = this.node.angle;
        this.node.rotation = Quat.rotateY(new Quat(), this.node.rotation, p * Math.PI / 180);
    }

    update(deltaTime: number) {
        // var p = this.node.angle;

        // this.node.rotation = Quat.rotateX(new Quat(), this.node.rotation, (this.p) * Math.PI / 180);
        // this.node.rotation = Quat.rotateX(new Quat(), this.node.rotation, deltaTime * Math.PI / 180);

        this.node.rotation = Quat.fromEuler(new Quat(), this.x, this.y, this.z);

        // console.log(this.p);
        this.p += deltaTime * 1;
    }
}


