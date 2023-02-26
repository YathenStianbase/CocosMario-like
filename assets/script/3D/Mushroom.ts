import { _decorator, Component, Node, physics, BoxCollider, ICollisionEvent, ITriggerEvent, director, RigidBody, Vec3, Collider, random, math, randomRange } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Mushroom')
export class Mushroom extends Component {

    private _collider: Collider;

    start() {
        this._collider = this.node.getComponent(BoxCollider);

        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {

        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            let pc = event.otherCollider.getComponent(PlayerController);
            pc.SetSuperBodySkin();
            pc.canAttack = true;
            this.node.active = false;
        }
    }

}


