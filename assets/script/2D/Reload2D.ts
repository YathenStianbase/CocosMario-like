import { _decorator, Component, ITriggerEvent, Collider, director, Collider2D, Contact2DType } from 'cc';
import { PlayerController2D } from './PlayerController2D';
const { ccclass, property } = _decorator;

@ccclass('Reload2D')
export class Reload2D extends Component {
    @property
    public sceneName = "";

    private _collider: Collider2D;
    start() {
        this._collider = this.node.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {
        if (otherCollider.tag == 1) {
            if (otherCollider.getComponent(PlayerController2D).isDeath) {
            }
            this.R();
            console.log(otherCollider);
        }
    }

    public R() {
        director.loadScene(this.sceneName);
    }
}


