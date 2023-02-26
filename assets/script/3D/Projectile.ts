import { _decorator, Component, Node, physics, BoxCollider, ICollisionEvent, ITriggerEvent, director, RigidBody, Vec3, Collider, random, math, randomRange } from 'cc';
import { Monster } from './Enemy/Monster';
import { PlayerController } from './PlayerController';

const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {

    public _rigid: RigidBody;
    private _collider: Collider;


    @property
    public _lifeTime = 1.5;

    onLoad() {
        this._rigid = this.getComponent(RigidBody);
    }

    start() {
        this._collider = this.node.getComponent(Collider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);

    }

    update(deltaTime: number) {
        if (this._lifeTime < 0) {
            this.node.destroyAllChildren();
            this.node.destroy();
        }
        this._lifeTime -= deltaTime;
    }

    private onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.name == "Monster<ConeCollider>") {
            // console.log(event.otherCollider.name);
            event.otherCollider.getComponent(Monster).Death();
        }
    }

}


