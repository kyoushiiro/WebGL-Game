/**
 * Specifies a WebGL scene.
 *
 * @author Alfred Lam
 * @this {Scene}
 */
class Scene {
  /**
   * Constructor for Scene.
   *
   * @constructor
   */
  constructor() {
    this.geometries = []; // Geometries being drawn on canvas
    this.texGeometries = [];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * Adds the given geometry to the the scene.
   *
   * @param {Geometry} geometry Geometry being added to scene
   */
  addGeometry(geometry) {
    if (geometry.shader == texShaders) {
      this.texGeometries.push(geometry);
    }
    else {
      this.geometries.push(geometry);
    }
  }

  /**
   * Clears all the geometry within the scene.
   */
  clearGeometry() {
    this.geometries = [];
    this.texGeometries = [];
    this.render();
  }

  /**
   * Updates the animation for each geometry in geometries.
   */
  updateAnimation() {
    for (let geom of this.geometries) {
      geom.updateAnimation();
    }
    
    for (let geom of this.texGeometries) {
      geom.updateAnimation();
    }
  }

  /**
   * Renders all the Geometry within the scene.
   */
  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    useShader(gl, normShaders);
    for (let geom of this.geometries) {
      geom.render();
    }
    
    for (let geom of this.texGeometries) {
      geom.render();
    }
  }
}
