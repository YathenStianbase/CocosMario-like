import { _decorator, Component, Node, physics, BoxCollider, ICollisionEvent, ITriggerEvent, director, RigidBody, Vec3, Collider, random, math, randomRange, Layers, PhysicsSystem, geometry, Quat, Vec2, PhysicsSystem2D, ERaycast2DType, Collider2D, BoxCollider2D, RichText, Contact2DType, RigidBody2D, CCFloat } from 'cc';
import { PlayerController2D } from '../PlayerController2D';

const { ccclass, property, integer, float, boolean, string, type } = _decorator;

@ccclass('Monster2D')
export class Monster2D extends Component {

    private _collider: Collider2D;

    @float
    public speed: number = 1;

    @float
    public rotation: number = 0;

    start() {
        this._collider = this.node.getComponent(Collider2D);
        this.node.rotation = Quat.fromEuler(new Quat(), 0, 0, this.rotation);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(deltaTime: number) {

        var mask = 0xffffffff;
        var halfHeight = this._collider.worldAABB.height / 2;
        const maxDistance = 50;


        let p1 = this.node.worldPosition;
        let p2 = new Vec2(this.node.worldPosition.x - maxDistance, this.node.worldPosition.y);

        const bResult = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.Closest, mask);

        if (bResult.length > 0) {
            for (let i = 0; i < bResult.length; i++) {
                const result = bResult[i];
                const distance = Vec2.distance(new Vec3(p1.x, p1.y, 0), new Vec3(result.point.x, result.point.y, 0));
                if (result.collider.tag == 25) {
                    console.log(result.collider);
                    console.log(" distance  -> " + distance);
                    if (distance < 50) {
                        // this.dir.z *= -1;
                        this.rotation = -this.rotation;
                    }
                }
            }
        }

        this.node.rotation = Quat.fromEuler(new Quat(), 0, 0, this.rotation);

        var pos = this.node.getWorldPosition();
        var target = pos.x - deltaTime * this.speed * (this.rotation == 90 ? 1 : -1);

        console.log(this.rotation);

        let pppos: number = pos.x - deltaTime * this.speed * (this.rotation == 90 ? 1 : -1);
        this.node.setWorldPosition(new Vec3(pppos, pos.y, pos.z));

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {
        if (otherCollider.tag == 1) {
            otherCollider.getComponent(PlayerController2D).Death();
        }
    }


    public Death() {
        let _rigid = this.node.getComponent(RigidBody2D);
        _rigid.enabled = true;
        _rigid.applyForceToCenter(new Vec2(100, 400), true);
        _rigid.applyAngularImpulse(5, true);
        _rigid.angularVelocity = 5;
        _rigid.applyTorque(1.5, true);
        this._collider.destroy();
    }

}


