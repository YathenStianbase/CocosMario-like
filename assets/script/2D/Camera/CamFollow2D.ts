import { _decorator, Component, Vec3 } from 'cc';
import { PlayerController2D } from '../PlayerController2D';
const { ccclass, property } = _decorator;

@ccclass('CamFollow2D')
export class CamFollow2D extends Component {

    @property(PlayerController2D)
    public player: PlayerController2D = null;

    // 摄影机偏移
    @property(Vec3)
    public offset: Vec3 = null;

    update(deltaTime: number) {
        var pos = this.player.node.getPosition();
        var targetX = pos.x + this.offset.x;
        var targetY = pos.y + this.offset.y;
        var targetZ = pos.z + this.offset.z;
        this.node.setPosition(new Vec3(targetX,targetY,targetZ));
    }
}


