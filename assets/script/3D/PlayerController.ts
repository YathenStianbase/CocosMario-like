import { instantiate, _decorator, Component, Vec3, input, Input, EventMouse, Animation, EventKeyboard, KeyCode, v3, director, physics, RigidBody, Collider, BoxCollider, MeshRenderer, math, CapsuleCollider, SphereCollider, Prefab, Quat, Color, color, geometry, PhysicsSystem, randomRange, Layers, clamp, Graphics, Line, RichText } from 'cc';
import { Monster } from './Enemy/Monster';
import { Projectile } from './Projectile';
const { ccclass, property,type } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _moveDir: Vec3 = new Vec3(0, 0, 0);
    private _faceDir: Vec3 = new Vec3(0, 0, 0);
    private _moveSpeed: Vec3 = new Vec3(5, 0, 0);
    private _rigid: RigidBody;
    @property
    private jumpForce: Vec3 = new Vec3(0, 250, 0);
    private _isGounding: boolean = true;

    @type(Component)
    public stateText: Component = null;

    @property
    public projectileSpeed: number = 10;
    // counch
    private _isCrouching: Boolean = false;
    private CrouchedCapsuleHeight = 1;

    // 
    private _collider: CapsuleCollider;
    public _parentCollider: CapsuleCollider;

    //
    private _meshRender: MeshRenderer;

    @type(Component)     
    public parentNode: Component = null;

    @type(Component)
    public smallBody: Component = null;
    @type(Component)
    public bigBody: Component = null;
    @type(Component)
    public superBody: Component = null;


    @type(Component)
    public shootPoint: Component = null;
    @type(Prefab)
    public attackProjectile: Prefab = null;

    // state
    @property
    public state: Number = 0;

    public _shouldChangeState = false;


    @property
    public shouldMove = false;

    @property
    public canAttack = false;

    @property
    public isDeath = false;

    onLoad() {

        this._rigid = this.getComponent(RigidBody);
      
        this._collider = this.node.getComponent(CapsuleCollider);

        this._meshRender = this.node.getComponent(MeshRenderer);
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
            this._moveDir = new Vec3(0, 0, 0);
            this.shouldMove = true;
        } else if (event.keyCode == KeyCode.KEY_A) {
            this._moveDir = new Vec3(0, -180, 0);
            this.shouldMove = true;

        }
        if (this._moveDir != Vec3.ZERO) {
            this._faceDir = this._moveDir;
        }

        if (this._faceDir == Vec3.ZERO) {
        }

        // counch
        // if (event.keyCode == KeyCode.ARROW_DOWN) {
        //     this._isCrouching = true;
        // }
    }

    onKeyPressDown(event: EventKeyboard) {

        if (event.keyCode == KeyCode.KEY_D) {
            this._moveDir = new Vec3(0, 0, 0);
            this.shouldMove = true;

        }
        else if (event.keyCode == KeyCode.KEY_A) {
            this._moveDir = new Vec3(0, -180, 0);
            this.shouldMove = true;

        }
        if (this._moveDir != Vec3.ZERO) {
        }

        if (this._faceDir == Vec3.ZERO) {
        }

        if (event.keyCode == KeyCode.SPACE) {
            if (!this._isGounding) {
                return;
            }
            this._rigid.applyForce(this.jumpForce);
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

        // counch up
        // if (event.keyCode == KeyCode.ARROW_DOWN) {
        //     this._isCrouching = false;
        // }
    }



    update(deltaTime: number) {
        if (this.isDeath) return;

        this.node.rotation = Quat.fromEuler(new Quat(), this._moveDir.x, this._moveDir.y, this._moveDir.z);

        // 射线检测落地情况
        const worldRay = new geometry.Ray(this.node.position.x, this.node.position.y, this.node.position.z, 0, -1, 0);

        var mask = 0xffffffff;
        var halfHeight = this._collider.worldBounds.halfExtents.y;
        const maxDistance = 5;
        const queryTrigger = true;

        const bResult = PhysicsSystem.instance.raycastClosest(worldRay, mask, maxDistance, queryTrigger);

        if (bResult) {
            const results = PhysicsSystem.instance.raycastClosestResult;

            const result = results;
            const hp = result.hitPoint;
            const distance = Vec3.distance(this.node.position, hp);
            if (result.collider.node.layer == 2) {

                if (distance < halfHeight + 0.15) {
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

            if (result.collider.node.layer == 1) {
                if (distance < 1.1) {
                    let monster = result.collider.node.getComponent(Monster);
                    if (monster != null) {
                        monster.Death();
                        this._rigid.clearState();
                        this._rigid.applyForce(new Vec3(0, 250, 0));
                        this._isGounding = false;
                        let rt = this.stateText.getComponent(RichText);
                        rt.string = "状态: " + "空中";
                    }
                }
            }
        }

        // coounch
        // if (this._shouldChangeState) {
        //     this._rigid.isKinematic = true;
        //     this._rigid.type = physics.ERigidBodyType.KINEMATIC;
        //     this._rigid.enabled = false;
        //     var sizedata;
        //     // var smallmr;
        //     let smallmr = this.smallBody.getComponent(MeshRenderer);
        //     // var bigmr;
        //     let bigmr = this.bigBody.getComponent(MeshRenderer);
        //     // var supermr;
        //     let supermr = this.superBody.getComponent(MeshRenderer);
        //     //state
        //     switch (this.state) {
        //         case 0:
        //             // console.log("small state");
        //             sizedata = this.smallBody.getComponentInChildren(ColliderSizeData);
        //             this._collider.center = new Vec3(sizedata.centerX, sizedata.centerY, sizedata.centerZ);
        //             this._collider.radius = sizedata.radius;
        //             this._collider.height = sizedata.height;
        //             // let smallmr = this.smallBody.getComponent(MeshRenderer);
        //             smallmr.enabled = true;
        //             // let bigmr = this.bigBody.getComponent(MeshRenderer);
        //             bigmr.enabled = false;
        //             // let supermr = this.superBody.getComponent(MeshRenderer);
        //             supermr.enabled = false;
        //             this._shouldChangeState = false;
        //             break;
        //         case 1:
        //             // console.log("big state");
        //             sizedata = this.bigBody.getComponentInChildren(ColliderSizeData);
        //             this._collider.center = new Vec3(sizedata.centerX, sizedata.centerY, sizedata.centerZ);
        //             this._collider.radius = sizedata.radius;
        //             this._collider.height = sizedata.height;
        //             // let smallmr = this.smallBody.getComponent(MeshRenderer);
        //             bigmr.enabled = true;
        //             // let bigmr = this.bigBody.getComponent(MeshRenderer);
        //             smallmr.enabled = false;
        //             // let supermr = this.superBody.getComponent(MeshRenderer);
        //             supermr.enabled = false;
        //             this._shouldChangeState = false;
        //             break;
        //         case 2:
        //             // console.log("super state");
        //             sizedata = this.superBody.getComponentInChildren(ColliderSizeData);
        //             this._collider.center = new Vec3(sizedata.centerX, sizedata.centerY, sizedata.centerZ);
        //             this._collider.radius = sizedata.radius;
        //             this._collider.height = sizedata.height;
        //             // let smallmr = this.smallBody.getComponent(MeshRenderer);
        //             supermr.enabled = true;
        //             bigmr.enabled = false;
        //             // let bigmr = this.bigBody.getComponent(MeshRenderer);
        //             smallmr.enabled = false;
        //             // let supermr = this.superBody.getComponent(MeshRenderer);
        //             this._shouldChangeState = false;
        //             break;
        //         default:
        //             break;
        //     }
        //     this._rigid.isKinematic = false;
        //     this._rigid.type = physics.ERigidBodyType.DYNAMIC;
        //     this._rigid.enabled = true;
        // }



        var pos = this.node.getPosition();
        var amp = (this._isGounding ? 1 : 0.75);
        // 将转向映射到速度
        if (this._moveDir.y == 0) {
            pos.x += 1 * deltaTime * this._moveSpeed.x * amp;
        } else if (this._moveDir.y = 180) {
            pos.x += -1 * deltaTime * this._moveSpeed.x * amp;
        }

        // 
        if (this.shouldMove) {
            this.node.setPosition(pos);
        }


        // counch
        if (this._isCrouching) {
            // this._isCrouching = true;
            this.SetCapsuleDimensions(0.5, this.CrouchedCapsuleHeight, this.CrouchedCapsuleHeight * 0.5);
            this.node.scale = new Vec3(1, 0.5, 1);
        } else {
            // var pos = this.node.getPosition();
            // pos.add(new Vec3(0, 0.5, 0));
            // this.node.setPosition(pos);
            this.node.scale = new Vec3(1, 1, 1);
        }
    }

    private SetCapsuleDimensions(radius, height, yOffset) {
        // height = Mathf.Max(height, (radius * 2f) + 0.01f); // Safety to prevent invalid capsule geometries
        height = Math.max(height, (radius * 2) + 0.001);

        // CapsuleRadius = radius;
        // CapsuleHeight = height;
        // CapsuleYOffset = yOffset;

        // Capsule.radius = CapsuleRadius;
        // Capsule.height = Mathf.Clamp(CapsuleHeight, CapsuleRadius * 2f, CapsuleHeight);
        // Capsule.center = new Vector3(0f, CapsuleYOffset, 0f);

        this._collider.radius = radius;
        this._collider.height = math.clamp(height, radius * 2, height);
        this._collider.center = new Vec3(0, yOffset, 0);

        // _characterTransformToCapsuleCenter = Capsule.center;
        // _characterTransformToCapsuleBottom = Capsule.center + (-_cachedWorldUp * (Capsule.height * 0.5f));
        // _characterTransformToCapsuleTop = Capsule.center + (_cachedWorldUp * (Capsule.height * 0.5f));
        // _characterTransformToCapsuleBottomHemi = Capsule.center + (-_cachedWorldUp * (Capsule.height * 0.5f)) + (_cachedWorldUp * Capsule.radius);
        // _characterTransformToCapsuleTopHemi = Capsule.center + (_cachedWorldUp * (Capsule.height * 0.5f)) + (-_cachedWorldUp * Capsule.radius);
    }

    private AttackShoot() {
        var pos = this.shootPoint.node.getWorldPosition();

        let scene = director.getScene();
        let node = instantiate(this.attackProjectile);
        scene.addChild(node);

        node.setPosition(pos);
        let rigid = node.getComponent(RigidBody);

        if (this._moveDir.y == 0) {
            let temp = new Vec3(1, 0, 0);
            rigid.applyLocalImpulse(temp.multiplyScalar(this.projectileSpeed));
        }
        if (this._moveDir.y == 180) {
            let temp = new Vec3(-1, 0, 0);
            rigid.applyLocalImpulse(temp.multiplyScalar(this.projectileSpeed));
        }


    }

    public SetSuperBodySkin() {
        let bigmr = this.bigBody.getComponent(MeshRenderer);
        let col = new Color(172, 39, 50, 255);
        bigmr.materials[0].setProperty("mainColor", col);
    }

    public SetBigBodySkin() {
        let bigmr = this.bigBody.getComponent(MeshRenderer);
        let col = new Color(69, 88, 138, 255);
        bigmr.materials[0].setProperty("mainColor", col);
    }

    public Death() {
        this.isDeath = true;
        this._rigid.applyImpulse(new Vec3(0, 5, 0));
        this._rigid.angularFactor = new Vec3(5, 5, 5);
        this._rigid.applyLocalTorque(new Vec3(1.5, 1.5, 0));
        this._collider.isTrigger = true;
        let rt = this.stateText.getComponent(RichText);
        rt.string = "状态: " + "Death";
    }
}


