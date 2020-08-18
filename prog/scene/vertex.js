/**
 * Specifies a vertex.
 *
 * @author Alfred Lam
 * @this {Vertex}
 */
class Vertex {
  constructor(x, y, z) {
    this.points = [x, y, z]; // May want to use a vector3 instead
    this.color = [Math.random(), Math.random(), Math.random(), 1.0];
    this.uv = [];
    this.normal = new Vector3();
  }
}
