/**
 * Specifies a character made up of various shapes.
 *
 * @author Alfred Lam
 * @this {Blitz}
 */
class Blitz extends Geometry {
  /**
   * Constructor for Blitz.
   *
   * @constructor
   * @returns {Blitz} Character object created
   */
  constructor(baseX, baseY, baseZ) {
    super();
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseZ = baseZ;

    this.currX = baseX;
    this.currY = baseY;
    this.currZ = baseZ;

    this.currRot = 0;

    this.parts = []; // an array of blitz's body parts

    this.vertexPosArray = null;
    this.colorArray = null;
    this.normalArray = null;

    this.colors = [];
    this.normals = [];
  }

  render() {
    for(let part of this.parts) {
      part.render();
    }
  }

  // NOTE: centerX, centerY, centerZ are relative to the base of this Blitz, NOT the world space
  addCubeToBlitz(size, centerX, centerY, centerZ, colorR, colorG, colorB, scaleX, scaleY, scaleZ) {
    let cube = new Cube(size, this.baseX + centerX, this.baseY + centerY, this.baseZ + centerZ, colorR, colorG, colorB, scaleX, scaleY, scaleZ);
    this.parts.push(cube);
  }

  translateForward(units) {
    let x = Math.ceil(this.currX + units);
    let z = Math.ceil(this.currZ);
    if(grid[x][z] == -1) {
      return false;
    }
    for(let part of this.parts) {
      part.translateForward(units);
    }

    this.currX += units;
    return true;
  }
  
  translateRight(units) {
    let x = Math.ceil(this.currX);
    let z = Math.ceil(this.currZ + units);
    if(grid[x][z] == -1) {
      return false;
    }
    for(let part of this.parts) {
      part.translateRight(units);
    }

    this.currZ += units;
    return true;
  }

  rotate(units) {
    this.currRot += units;
    if(this.currRot > 360) {
      this.currRot = 0;
    }
    else if(this.currRot < 0) {
      this.currRot = 360;
    }
    for(let part of this.parts) {
      part.rotate(this.currRot);
    }
  }
}

