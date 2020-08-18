/**
 * Specifies a geometric object.
 *
 * @author Alfred Lam
 * @this {Geometry}
 */
class Geometry {
  /**
   * Constructor for Geometry.
   *
   * @constructor
   */
  constructor() {
    this.vertices = []; // Vertex objects. Each vertex has x-y-z.
    this.modelMatrix = new Matrix4(); // Model matrix applied to geometric object
    this.shader = normShaders; 
  }

  /**
   * Renders this Geometry within your webGL scene.
   */
  render() {
    gl.uniformMatrix4fv(un_XformMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(un_ViewMatrix, false, camera.getViewMatrix().elements);
    gl.uniformMatrix4fv(un_ProjMatrix, false, camera.getProjMatrix().elements);

    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPosArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(an_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(an_Position);

    gl.uniform4fv(un_FragColor, this.color);
    
    tellGLSLToDrawCurrentBuffer(this.vertices.length);
  }

  /**
   * Responsible for updating the geometry's modelMatrix for animation.
   * Does nothing for non-animating geometry.
   */
  updateAnimation() {
    return;

    // NOTE: This is just in place so you'll be able to call updateAnimation()
    // on geometry that don't animate. No need to change anything.
  }

  setColor(r, g, b, a) {
    this.color = [r, g, b, a];
    let i = 0;
    let acolorArray = [];
    for(let vertex of this.vertices) {
      acolorArray[i] = this.color[0];
      acolorArray[i+1] = this.color[1];
      acolorArray[i+2] = this.color[2];
      acolorArray[i+3] = this.color[3]
      i += 4
    }
    this.colorArray = new Float32Array(acolorArray);
  }
}
