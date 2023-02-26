import { _decorator, Component, Node, Vec3, v3 } from 'cc';
import { PlayerController } from '../PlayerController';
const { ccclass, property,type } = _decorator;

@ccclass('CamFollow')
export class CamFollow extends Component {

    @type(PlayerController)
    public player: PlayerController = null;

    @property
    public offset: Vec3 = null;

    start() {

    }

    update(deltaTime: number) {
        var pos = this.player.node.getPosition();
        var targetX = pos.x + this.offset.x;
        var targetY = pos.y + this.offset.y;
        var targetZ = pos.z + this.offset.z;
   
        this.node.setPosition(new Vec3(targetX,targetY,targetZ));
    }
}


