/**
 * Specifies a StaticMap made up of Cubes.
 *
 * @author Alfred Lam
 * @this {StaticMap}
 */
class StaticMap extends Geometry {
  /**
   * Constructor for StaticMap.
   *
   * @constructor
   * @returns {StaticMap} Geometric object created
   */
  constructor(mapWidth, mapHeight) {
    super();

    this.vertexPosArray = null;
    this.colorArray = null;
    this.normalArray = null;

    this.colors = [];
    this.normals = [];
  }

  render() {
    gl.uniformMatrix4fv(un_XformMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(un_ViewMatrix, false, camera.getCurrViewMatrix().elements);
    gl.uniformMatrix4fv(un_ProjMatrix, false, camera.getProjMatrix().elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexPosArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(an_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(an_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, attribNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normalArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(an_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(an_Normal);

    gl.bindBuffer(gl.ARRAY_BUFFER, attribColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(an_Color, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(an_Color);

    gl.uniform3f(un_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(un_AmbientLight, 0.15, 0.15, 0.15);
    gl.uniform3f(un_DiffuseDirection, diffuseZ + 0.8, diffuseY, 1.4);
    gl.uniform1f(un_PhongToggle, phong);
    
    tellGLSLToDrawCurrentBuffer(this.vertices.length);
  }

  addCubeToMap(size, centerX, centerY, centerZ, colorR, colorG, colorB) {
    let half = size/2;

    let v1 = new Vertex(centerX-half, centerY+half, centerZ+half);
    let v2 = new Vertex(centerX+half, centerY+half, centerZ+half);
    let v3 = new Vertex(centerX-half, centerY-half, centerZ+half);
    let v4 = new Vertex(centerX+half, centerY-half, centerZ+half);
    let v5 = new Vertex(centerX-half, centerY+half, centerZ-half);
    let v6 = new Vertex(centerX+half, centerY+half, centerZ-half);
    let v7 = new Vertex(centerX-half, centerY-half, centerZ-half);
    let v8 = new Vertex(centerX+half, centerY-half, centerZ-half);

    this.vertices.push(copyVertex(v3), copyVertex(v2), copyVertex(v1), copyVertex(v4), copyVertex(v2), copyVertex(v3),
      copyVertex(v4), copyVertex(v6), copyVertex(v2), copyVertex(v8), copyVertex(v6), copyVertex(v4),
      copyVertex(v8), copyVertex(v5), copyVertex(v6), copyVertex(v7), copyVertex(v5), copyVertex(v8),
      copyVertex(v7), copyVertex(v1), copyVertex(v5), copyVertex(v3), copyVertex(v1), copyVertex(v7),
      copyVertex(v1), copyVertex(v6), copyVertex(v5), copyVertex(v2), copyVertex(v6), copyVertex(v1),
      copyVertex(v7), copyVertex(v4), copyVertex(v3), copyVertex(v8), copyVertex(v4), copyVertex(v7));

    for(let i = 0; i < 36; i++) {
      this.normals.push(CUBE_NORM_ARRAY[3*i], CUBE_NORM_ARRAY[3*i + 1], CUBE_NORM_ARRAY[3*i + 2]);
      this.colors.push(colorR, colorG, colorB, 1.0);
    }
  }

  // NOTE: REQUIRES this.vertices, this.normals, and this.colors to be initialized before use!
  // TODO: Optimize into 1 interleaved array.
  setFloat32Buffers() {
    let tempArr = []
    for(let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];
      tempArr[3*i] = vertex.points[0];
      tempArr[3*i + 1] = vertex.points[1];
      tempArr[3*i + 2] = vertex.points[2];
    }
    this.vertexPosArray = new Float32Array(tempArr);
    this.colorArray = new Float32Array(this.colors);
    this.normalArray = new Float32Array(this.normals);
  }
}

/**
   * Creates a copy of a vertex.
   *
   * @returns {Vertex} Copy of the vertex passed in.
   */
function copyVertex(vertex) {
  return Object.assign(new Vertex(0.0, 0.0, 0.0), vertex);
}

// the normals for a cube, corresponding to the order of vertices created in addCubeToMap().
let CUBE_NORM_ARRAY = [
  0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
  1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
  0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,
 -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
  0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0
];