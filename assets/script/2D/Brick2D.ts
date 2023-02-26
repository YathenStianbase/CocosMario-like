import { _decorator, Component, ICollisionEvent, Vec3, randomRange, RigidBody2D, ERigidBody2DType, Vec2, Contact2DType, Collider2D } from 'cc';
const { ccclass } = _decorator;

@ccclass('Brick2D')
export class Brick2D extends Component {

    private _rigid: RigidBody2D;
    private _impulse: Vec3 = new Vec3(0, 5, 0);
    private _collider: Collider2D;

    start() {
        this._rigid = this.getComponent(RigidBody2D);
        this._collider = this.node.getComponent(Collider2D);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {

        if (otherCollider.tag = 1) {
            console.log("otherCollider -> " + otherCollider);


            this._rigid.enabled = true;
            this._impulse.x = randomRange(-20, 20);
            this._rigid.applyForceToCenter(new Vec2(100, 500), true);
            selfCollider.sensor = true;

            selfCollider.destroy();
        }
    }
}


