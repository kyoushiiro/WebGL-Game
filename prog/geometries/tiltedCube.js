/**
 * Specifies a tilted cube which rotates.
 *
 * @author Alfred Lam
 * @this {TiltedCube}
 */
class TiltedCube extends Geometry {
  /**
   * Constructor for TiltedCube.
   *
   * @constructor
   * @returns {TiltedCube} Geometric object created
   */
  constructor(size, centerX, centerY, centerZ) {
    super();
    let temp = this;
    this.size = size;
    this.centerX = centerX;
    this.centerY = centerY;
    this.centerZ = centerZ;

    this.vertexPosArray = new Float32Array(this.vertices.length*3);
    this.normalArray = new Float32Array(this.vertices.length*3); 
    this.colorArray = new Float32Array(this.vertices.length*4);

    this.generateCubeVertices(size);
    this.generateCubeNormals();
   
    let aarr = [];
    let i = 0;
    for(let vertex of this.vertices) {
      aarr[i] = vertex.points[0];
      aarr[i+1] = vertex.points[1];
      aarr[i+2] = vertex.points[2];
      i += 3
    }
    this.vertexPosArray = new Float32Array(aarr);
  }

  render() {
    gl.uniformMatrix4fv(un_XformMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(un_ViewMatrix, false, camera.getViewMatrix().elements);
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
    gl.uniform3f(un_AmbientLight, 0.25, 0.25, 0.25);
    gl.uniform3f(un_DiffuseDirection, diffuseZ, diffuseY, 0.0);
    gl.uniform1f(un_PhongToggle, phong);
    
    tellGLSLToDrawCurrentBuffer(this.vertices.length);
  }

  /**
   * Generates the vertices of TiltedCube. Just a regular cube.
   *
   * @private
   * @param {Number} size The size of the tilted cube.
   */
  generateCubeVertices(size) {
    // assumes that size is the length of one side
    let half = size/2;

    let v1 = new Vertex(this.centerX-half, this.centerY+half, this.centerZ+half);
    let v2 = new Vertex(this.centerX+half, this.centerY+half, this.centerZ+half);
    let v3 = new Vertex(this.centerX-half, this.centerY-half, this.centerZ+half);
    let v4 = new Vertex(this.centerX+half, this.centerY-half, this.centerZ+half);
    let v5 = new Vertex(this.centerX-half, this.centerY+half, this.centerZ-half);
    let v6 = new Vertex(this.centerX+half, this.centerY+half, this.centerZ-half);
    let v7 = new Vertex(this.centerX-half, this.centerY-half, this.centerZ-half);
    let v8 = new Vertex(this.centerX+half, this.centerY-half, this.centerZ-half);
    // Recommendations: Might want to generate your cube vertices so that their
    // x-y-z values are combinations of 1.0 and -1.0. Allows you to scale the
    // the cube to your liking better in the future.

    this.vertices.push(copyVertex(v3), copyVertex(v2), copyVertex(v1), copyVertex(v4), copyVertex(v2), copyVertex(v3),
      copyVertex(v4), copyVertex(v6), copyVertex(v2), copyVertex(v8), copyVertex(v6), copyVertex(v4),
      copyVertex(v8), copyVertex(v5), copyVertex(v6), copyVertex(v7), copyVertex(v5), copyVertex(v8),
      copyVertex(v7), copyVertex(v1), copyVertex(v5), copyVertex(v3), copyVertex(v1), copyVertex(v7),
      copyVertex(v1), copyVertex(v6), copyVertex(v5), copyVertex(v2), copyVertex(v6), copyVertex(v1),
      copyVertex(v7), copyVertex(v4), copyVertex(v3), copyVertex(v8), copyVertex(v4), copyVertex(v7));
  }

  generateCubeNormals() {
    let arr = [
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0
    ];
    this.normalArray = new Float32Array(arr);
  }
}

function copyVertex(vertex) {
  return Object.assign(new Vertex(0.0, 0.0, 0.0), vertex);
}