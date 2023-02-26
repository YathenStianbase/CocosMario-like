import { _decorator, Component, Node, ICollisionEvent, Collider, ITriggerEvent, RichText } from 'cc';
import { Monster } from './Enemy/Monster';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Trigger')
export class Trigger extends Component {

    private _collider: Collider;

    @property(Monster)
    public monster: Monster = null;

    @property(RichText)
    public richText: RichText = null;


    start() {
        this._collider = this.getComponent(Collider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            // console.log(event.otherCollider.name);

            if (this.monster != null) {
                this.monster.enabled = true;
                // console.log(this.monster.name);
                // console.log(this.monster.enabled);
            }

            if (this.richText != null) {
                // this.richText.enabled = true;
                this.richText.node.active = true;
            }
        }
    }

    update(deltaTime: number) {

    }

}


