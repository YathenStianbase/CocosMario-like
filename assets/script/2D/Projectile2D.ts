import { _decorator, Component, RigidBody2D, Collider2D, Contact2DType } from 'cc';
import { Monster2D } from './Enemy/Monster2D';

const { ccclass, property, type, float } = _decorator;

@ccclass('Projectile2D')
export class Projectile2D extends Component {

    @type(RigidBody2D)
    public _rigid: RigidBody2D;
    @type(Collider2D)
    private _collider: Collider2D;

    @float
    public _lifeTime = 1.5;

    onLoad() {
        this._rigid = this.getComponent(RigidBody2D);
    }

    start() {
        this._collider = this.node.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    }

    update(deltaTime: number) {
        if (this._lifeTime < 0) {
            this.node.destroyAllChildren();
            this.node.destroy();
        }
        this._lifeTime -= deltaTime;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {

        if (otherCollider.tag == 24) {
            otherCollider.getComponent(Monster2D).Death();
        }
    }

}


