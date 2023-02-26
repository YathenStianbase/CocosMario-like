import { instantiate, _decorator, Component, Vec3, input, Input, EventMouse, EventKeyboard, KeyCode, director, Prefab, Quat, Color, Graphics, RichText, RigidBody2D, BoxCollider2D, Vec2, PhysicsSystem2D, ERaycast2DType, EPhysics2DDrawFlags, Sprite, CCBoolean, CCFloat, Contact2DType, Collider2D } from 'cc';
import { Monster2D } from './Enemy/Monster2D';
const { ccclass, property, integer, float, boolean, string, type } = _decorator;

@ccclass('PlayerController2D')
export class PlayerController2D extends Component {

    // 移动方向
    @property
    private moveDir: Vec3 = new Vec3(0, 0, 0);
    // 
    @property
    private _faceDir: Vec3 = new Vec3(0, 0, 0);
    // 移动距离
    @property
    private moveSpeed: Vec3 = new Vec3(5, 0, 0);
    // 刚体
    private _rigid: RigidBody2D;
    // 跳跃力度
    @property
    private jumpForce: Vec3 = new Vec3(0, 250, 0);
    // 落地判定标识
    private _isGounding: boolean = true;
    // 状态提示UI
    @type(Component)
    public stateText: Component = null;
    // 蹲伏
    // private _isCrouching: Boolean = false;
    // private CrouchedCapsuleHeight = 1;
    // 碰撞体
    @type(BoxCollider2D)
    private collider: BoxCollider2D;
    @type(BoxCollider2D)
    private groundCheckCollider: BoxCollider2D;
    // 射击起点
    @type(Component)
    public shootPoint: Component = null;
    // 抛射物
    @type(Prefab)
    public attackProjectile: Prefab = null;
    // 抛射物速度
    @float
    public projectileSpeed: number = 10;
    // // state
    // @property(Number)
    // public state: Number = 0;
    // public _shouldChangeState: Boolean = false;

    // 是否允许移动标识
    @property
    public shouldMove = false;
    // 是否允许射击攻击标识
    @property
    public canAttack = false;
    // 是否允许死亡标识 
    @property
    public isDeath = false;


    onLoad() {
        this._rigid = this.getComponent(RigidBody2D);

        // this.collider = this.node.getComponent(BoxCollider2D);

        this.groundCheckCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.groundCheckCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {
        console.log("otherCollider begin --> " + otherCollider.name);
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact) {
        console.log("otherCollider end --> " + otherCollider.name);
    }

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.KEY_UP, this.onKeyPressUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyPressDown, this);

    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() == 1) {
            if (this.canAttack)
                this.AttackShoot();
        }
    }


    onKeyPressing(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_D) {
            this.moveDir = new Vec3(0, 0, 0);
            this.shouldMove = true;
        } else if (event.keyCode == KeyCode.KEY_A) {
            this.moveDir = new Vec3(0, -180, 0);
            this.shouldMove = true;

        }

        if (this.moveDir != Vec3.ZERO) {

            this._faceDir = this.moveDir;
        }

        if (this._faceDir == Vec3.ZERO) {
        }

    }

    onKeyPressDown(event: EventKeyboard) {

        if (event.keyCode == KeyCode.KEY_D) {
            this.moveDir = new Vec3(0, 0, 0);
            this.shouldMove = true;

        }
        else if (event.keyCode == KeyCode.KEY_A) {
            this.moveDir = new Vec3(0, -180, 0);
            this.shouldMove = true;

        }
        if (this.moveDir != Vec3.ZERO) {
        }

        if (this._faceDir == Vec3.ZERO) {
        }

        if (event.keyCode == KeyCode.SPACE) {
            if (!this._isGounding) {
                return;
            }
            this._rigid.applyForceToCenter(new Vec2(this.jumpForce.x, this.jumpForce.y), true);
            this._isGounding = false;
            let rt = this.stateText.getComponent(RichText);
            rt.string = "状态: " + "空中";
        }

    }

    onKeyPressUp(event: EventKeyboard) {


        // 设置方向
        if (event.keyCode == KeyCode.KEY_D) {
            this.shouldMove = false;
        }
        if (event.keyCode == KeyCode.KEY_A) {
            this.shouldMove = false;
        }

    }



    update(deltaTime: number) {

        if (this.isDeath) return;

        this.node.rotation = Quat.fromEuler(new Quat(), this.moveDir.x, this.moveDir.y, this.moveDir.z);

        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Controller


        let mask = 0xffffffff;
        let halfHeight = this.collider.worldAABB.height / 2;
        halfHeight = Math.round(halfHeight);
        const maxDistance = 50;

        let p1 = this.node.worldPosition;
        let p2 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y - maxDistance);

        const bResult = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.Any, mask);

        if (bResult.length > 0) {
            const results = bResult;

            console.log(results);


            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const result = element;
                const hp = result.point;
                const distance = Vec2.distance(this.node.worldPosition, new Vec3(hp.x, hp.y, 0));


                if (result.collider.tag == 25) {

                    if (distance < halfHeight + 1.5) {
                        this._isGounding = true;
                        let rt = this.stateText.getComponent(RichText);
                        rt.string = "状态: " + "落地";
                    }
                    else {
                        this._isGounding = false;
                        let rt = this.stateText.getComponent(RichText);
                        rt.string = "状态: " + "空中";
                    }
                }
                if (result.collider.tag == 24) {

                    if (distance < halfHeight + 1.1) {
                        let monster = result.collider.node.getComponent(Monster2D);
                        if (monster != null) {
                            monster.Death();
                            this._rigid.applyForceToCenter(new Vec2(0, 2000), true);
                            this._isGounding = false;
                            let rt = this.stateText.getComponent(RichText);
                            rt.string = "状态: " + "踩头";
                        }
                    }
                }
            }
        }
        // else {
        //     this._isGounding = false;
        //     let rt = this.stateText.getComponent(RichText);
        //     rt.string = "状态: " + "空中";
        // }

        var pos = this.node.getPosition();
        var amp = (this._isGounding ? 1 : 0.75);
        // 将转向映射到速度
        if (this.moveDir.y == 0) {
            pos.x += 1 * deltaTime * this.moveSpeed.x * amp;
        } else if (this.moveDir.y = 180) {
            pos.x += -1 * deltaTime * this.moveSpeed.x * amp;
        }

        if (this.shouldMove) {
            this.node.setPosition(pos);
        }
    }

    // 攻击行为
    private AttackShoot() {
        var pos = this.shootPoint.node.getWorldPosition();

        let scene = director.getScene();
        let node = instantiate(this.attackProjectile);
        let canvas = scene.getChildByName("Canvas");
        canvas.addChild(node);

        node.setWorldPosition(pos);
        let rigid = node.getComponent(RigidBody2D);

        let temp = this.moveDir.y == 0 ? 1 : -1;
        let temp2 = new Vec2(temp, 0);
        rigid.applyLinearImpulseToCenter(temp2.multiplyScalar(this.projectileSpeed), true);
    }

    // 设置皮肤
    public SetSuperBodySkin() {
        let col = new Color(172, 39, 50, 255);
        let sprite = this.getComponent(Sprite);
        sprite.color = col;
    }

    // 死亡行为
    public Death() {
        this.isDeath = true;
        this._rigid.applyAngularImpulse(5, true);
        this._rigid.angularVelocity = 5;
        this._rigid.applyTorque(1.5, true);
        this.collider.destroy();
        let rt = this.stateText.getComponent(RichText);
        rt.string = "状态: " + "Death";
    }
}


