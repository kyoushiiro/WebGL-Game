/**
 * Specifies a camera object.
 *
 * @author Alfred Lam
 * @this {Camera}
 */
class Camera{
  /**
   * Constructor for Geometry.
   *
   * @constructor
   */
  constructor() {
    // rotatable, first person view
    this.viewMatrix = new Matrix4();
    this.viewMatrix.setLookAt(0.04, 2.2, 15.0, 5.0, 2.2, 15.0, 0, 1, 0)

    this.projMatrix = new Matrix4();
    this.projMatrix.setPerspective(fov, canvas.width/canvas.height, 0.01, 100);

    // no rotation, top-down view
    this.fixedViewMatrix = new Matrix4();
    this.fixedViewMatrix.setLookAt(16.0, 10.0, 30.0, 16.0, 3.0, 24.0, 0.0, 1.0, 0.0);

    this.currView = 'fps';
  }

  moveFixedCamera() {
    this.fixedViewMatrix.setLookAt(fix_eyeX, 10.0, fix_eyeZ, fix_eyeX, 3.0, fix_eyeZ - 6.0, 0.0, 1.0, 0.0);
  }

  getCurrViewMatrix() {
    if(this.currView == 'fixed') {
      return this.fixedViewMatrix;
    }
    else {
      return this.viewMatrix;
    }
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  getProjMatrix() {
    return this.projMatrix;
  }

  getFixedMatrix() {
    return this.fixedViewMatrix;
  }

  toggleView() {
    if(this.currView == 'persp') {
      this.projMatrix.setOrtho(-1, 1, -1, 1, nearPlane, farPlane);
      this.currView = 'ortho';
    }
    else if(this.currView == 'ortho') {
      this.projMatrix.setPerspective(fov, canvas.width/canvas.height, nearPlane, farPlane);
      this.currView = 'persp';
    }
  }

  setFov() {
    this.projMatrix.setPerspective(fov, canvas.width/canvas.height, nearPlane, farPlane);
  }

  setPlane() {
    if(this.currView == 'ortho') {
      this.projMatrix.setOrtho(-1, 1, -1, 1, nearPlane, farPlane);
    }
    else if(this.currView == 'persp') {
      this.projMatrix.setPerspective(fov, canvas.width/canvas.height, nearPlane, farPlane);
    }
  }
}