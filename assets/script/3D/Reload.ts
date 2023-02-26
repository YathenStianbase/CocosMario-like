import { _decorator, Component, ITriggerEvent, Collider, director } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Reload')
export class Reload extends Component {
    @property
    public sceneName = "";

    private _collider: Collider;
    start() {
        this._collider = this.node.getComponent(Collider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            if (event.otherCollider.getComponent(PlayerController).isDeath) {
            }
            this.R();
        }
    }

    public R() {
        director.loadScene(this.sceneName);
    }
}


