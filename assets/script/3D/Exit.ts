import { _decorator, Component, Node, Collider, BoxCollider, ITriggerEvent } from 'cc';
import { Reload } from './Reload';
const { ccclass, type } = _decorator;

@ccclass('Exit')
export class Exit extends Component {
    @type(Collider)
    private _collider: Collider;

    start() {
        this._collider = this.node.getComponent(BoxCollider);
        this._collider.on('onTriggerEnter', this.onTriggerEnter, this);

    }

    private onTriggerEnter(event: ITriggerEvent) {
        let reload = this.getComponent(Reload);
        reload.R();
    }

}


