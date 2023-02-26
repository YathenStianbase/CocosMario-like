import { _decorator, Component, Node, physics, BoxCollider, ICollisionEvent, ITriggerEvent, director, RigidBody, Vec3, Collider, random, math, randomRange, Layers, PhysicsSystem, geometry, Quat } from 'cc';
import { PlayerController } from '../PlayerController';

const { ccclass, property, float } = _decorator;

@ccclass('Monster')
export class Monster extends Component {

    private _collider: Collider;

    @float
    public speed: number = 1;

    @property
    public dir: Vec3 = new Vec3(0, 0, 90);

    start() {
        this._collider = this.node.getComponent(Collider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    update(deltaTime: number) {
        const worldRay = new geometry.Ray(this.node.position.x, this.node.position.y, this.node.position.z, this.dir.z == 90 ? -1 : 1, 0, 0);
        var mask = 0xffffffff;
        const maxDistance = 5;
        const queryTrigger = true;

        const bResult = PhysicsSystem.instance.raycast(worldRay, mask, maxDistance, queryTrigger);
        if (bResult) {
            const results = PhysicsSystem.instance.raycastResults;

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const distance = result.distance;
                if (result.collider.node.layer == 2) {
                    if (distance < 1) {
                        this.dir.z *= -1;
                    }
                }
            }
        }

        this.node.rotation = Quat.fromEuler(new Quat(), this.dir.x, this.dir.y, this.dir.z);

        var pos = this.node.getPosition();
        var target = pos.x - deltaTime * this.speed * (this.dir.z == 90 ? 1 : -1);
        this.node.setPosition(new Vec3(target, pos.y, pos.z));

    }

    private onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            event.otherCollider.getComponent(PlayerController).Death();
        }
    }

    public Death() {
        let _rigid = this.node.addComponent(RigidBody);
        _rigid.applyImpulse(new Vec3(0, 5, 0));
        _rigid.angularFactor = new Vec3(5, 5, 5);
        _rigid.applyLocalTorque(new Vec3(1.5, 1.5, 0));
        this._collider.destroy();
    }

}


