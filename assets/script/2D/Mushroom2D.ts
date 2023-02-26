import { _decorator, Component, Vec3, randomRange, Collider2D, Contact2DType, RigidBody2D, Vec2 } from 'cc';
import { PlayerController2D } from './PlayerController2D';
const { ccclass } = _decorator;

@ccclass('Mushroom2D')
export class Mushroom2D extends Component {

    private _rigid: RigidBody2D;
    private _impulse: Vec3 = new Vec3(0, 5, 0);
    private _collider: Collider2D;

    start() {
        this._rigid = this.getComponent(RigidBody2D);

        this._collider = this.node.getComponent(Collider2D);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {
        if (otherCollider.tag == 1) {
            let pc = otherCollider.getComponent(PlayerController2D);
            this._rigid.enabled = true;
            this._impulse.x = randomRange(-20, 20);
            this._rigid.applyForceToCenter(new Vec2(100, 500), true);
            selfCollider.sensor = true;
            pc.SetSuperBodySkin();
            
            pc.canAttack = true;
            selfCollider.destroy();
        }
    }
}


