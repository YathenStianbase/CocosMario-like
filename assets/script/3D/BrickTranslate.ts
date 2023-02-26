import { _decorator, Component, BoxCollider, ICollisionEvent, RigidBody, Vec3, Collider, randomRange, Prefab, instantiate } from 'cc';
import { Reload } from './Reload';
const { ccclass, type } = _decorator;

@ccclass('BrickTranslate')
export class BrickTranslate extends Component {
    @type(RigidBody)
    private _rigid: RigidBody;
    private _impulse: Vec3 = new Vec3(0, 5, 0);
    private _collider: Collider;

    @type(Prefab)
    public reload: Prefab = null;

    @type(String)
    public sceneName = "";

    start() {
        this._rigid = this.getComponent(RigidBody);
        this._collider = this.node.getComponent(BoxCollider);
        // this._collider.on('onCollisionEnter', this.onCollisionEnter, this);
        this._collider.on('onTriggerEnter', this.onCollisionEnter, this);
    }

    private onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            this.Action();
        }
    }

    public Action() {
        // this._rigid.isKinematic = false;
        // this._rigid.isDynamic = true;
        // this._impulse.x = randomRange(-2, 2);
        // this._rigid.applyImpulse(this._impulse);
        // this._collider.destroy();

        console.log("do translation action ... ");


        let r = instantiate(this.reload);
        let rld = r.getComponent(Reload);
        rld.sceneName = this.sceneName;
        rld.R();
        rld.destroy();
    }
}


