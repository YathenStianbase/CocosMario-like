import { _decorator, Component, BoxCollider, ICollisionEvent, RigidBody, Vec3, Collider, randomRange, Node } from 'cc';
import { BrickTranslate } from './BrickTranslate';
const { ccclass, type } = _decorator;

@ccclass('Brick')
export class Brick extends Component {
    @type(RigidBody)
    private _rigid: RigidBody;
    private _impulse: Vec3 = new Vec3(0, 5, 0);
    private _collider: Collider;

    // @type(BrickTranslate)
    // public brickTranslate: BrickTranslate = null;

    @type([BrickTranslate])
    public brickTranslates: BrickTranslate[] = [];

    @type(Node)
    public Nodes: Node[] = [];

    start() {
        this._rigid = this.getComponent(RigidBody);
        this._collider = this.node.getComponent(BoxCollider);
        this._collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    private onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.name == "Player<CapsuleCollider>") {
            this._rigid.isKinematic = false;
            this._rigid.isDynamic = true;
            this._impulse.x = randomRange(-2, 2);
            this._rigid.applyImpulse(this._impulse);
            this._collider.destroy();

            this.Action();
        }
    }

    public Action() {
        // if (this.brickTranslate != null) {
        //     this.brickTranslate.Action();
        // }

        // this.brickTranslates.forEach(brick => {
        //     brick.node.destroy();
        // });

        this.Nodes.forEach(n => {
            n.destroy();
        });
    }
}


