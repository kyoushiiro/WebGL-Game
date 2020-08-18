let shapeSize = 0.3;
let shape = 'cub';
let textFromFile = "";
let solid = true;
let currTexturePath = "";

// initial eye position
let g_eyeX = 0.04, g_eyeY = 2.2, g_eyeZ = 15.0;
let lookX = 0.0;
let lookAngle = 3*Math.PI/2;
let fov = 60;

let fix_eyeX = 16.0, fix_eyeZ = 30.0;

let phong = 1.0;

/**
 * Responsible for initializing buttons, sliders, radio buttons, etc. present
 * within your HTML document.
 */
function initEventHandelers() {
  document.getElementById("fieldOfView").oninput = function() {
    fogRange = this.value;
    fogDist[1] = fogRange;
    gl.uniform2fv(u_FogDist, fogDist);
  }

  document.onkeydown = function(ev) {
    keydown(ev, camera.getViewMatrix());
  }
}

function keydown(ev, viewMatrix) {
  let currSin = Math.sin(lookAngle);
  let currCos = Math.cos(lookAngle);
  if(ev.keyCode == 68) { // d - blitz right
    if(camera.currView == 'fps') {
      if(blitz.translateRight(0.13)) {
        g_eyeX += currCos * 0.13;
        g_eyeZ -= currSin * 0.13; 
      }
    }
  }
  else if(ev.keyCode == 65) { // a - blitz left 
    if(camera.currView == 'fps') {
      if(blitz.translateRight(-0.13)) {
        g_eyeX -= currCos * 0.13;
        g_eyeZ += currSin * 0.13;
      }
    }
  }
  else if(ev.keyCode == 87) { // w - blitz up 
    if(camera.currView == 'fps') {
      if(blitz.translateForward(0.13)) {
        g_eyeX -= currSin * 0.13;
        g_eyeZ -= currCos * 0.13;
      }
    }
  }
  else if(ev.keyCode == 83) { // s - blitz down
    if(camera.currView == 'fps') {
      if(blitz.translateForward(-0.13)) {
        g_eyeX += currSin * 0.13;
        g_eyeZ += currCos * 0.13;
      }
    }
  }
  else if(ev.keyCode == 73) { // i - camera up
    if(camera.currView == 'fixed') {
      fix_eyeZ -= 0.1;
      camera.moveFixedCamera();
    }
  }
  else if(ev.keyCode == 74) { // j - camera left
    if(camera.currView == 'fixed') {
      fix_eyeX -= 0.1;
      camera.moveFixedCamera();
    }
  }
  else if(ev.keyCode == 75) { // k - camera down
    if(camera.currView == 'fixed') {
      fix_eyeZ += 0.1;
      camera.moveFixedCamera();
    }
  }
  else if(ev.keyCode == 76) { // l - camera right
    if(camera.currView == 'fixed') {
      fix_eyeX += 0.1;
      camera.moveFixedCamera();
    }
  }
  else if(ev.keyCode == 85) { // u - turn left
    /*
    if(camera.currView == 'fps') {
      lookAngle += 0.05;
      blitz.rotate(0.05);
      currSin = Math.sin(lookAngle);
      currCos = Math.cos(lookAngle);
    }
    */
  }
  else if(ev.keyCode == 79) { // o - turn right
    /*
    if(camera.currView == 'fps') {
      lookAngle -= 0.05;
      blitz.rotate(-0.05);
      currSin = Math.sin(lookAngle);
      currCos = Math.cos(lookAngle);
    }
    */
  }
  else if(ev.keyCode == 37) { // arrow left
  }
  else if(ev.keyCode == 39) { // arrow right
  }
  else if(ev.keyCode == 38) { // arrow up - change view
    if(camera.currView == 'fixed') {
      camera.currView = 'fps';
    }
    else {
      camera.currView = 'fixed';
    }
  }
  else if(ev.keyCode == 40) { // arrow down
  }
  else {
    return;
  }
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, g_eyeX - currSin, 2.2, g_eyeZ - currCos , 0, 1, 0);
  eyeArray[0] = g_eyeX;
  eyeArray[1] = g_eyeY;
  eyeArray[2] = g_eyeZ;
  gl.uniform4fv(u_Eye, eyeArray);
}

function getFile(fileLoadedEvent) {
  let fileToLoad = document.getElementById("upload").files[0];
  let fileReader = new FileReader();

  fileReader.onload = function (fileLoadedEvent) {
    textFromFile = fileLoadedEvent.target.result;
  }
  fileReader.readAsText(fileToLoad, "UTF-8");
}

function getTexture(fileLoadedEvent) {
  let fileToLoad = document.getElementById("texUpload").files[0];
  if (fileToLoad) {
    currTexturePath = window.URL.createObjectURL(fileToLoad);
  }
  else {
    currTexturePath = '';
  }
}

/**
* Clears the HTML canvas.
*/
function clearCanvas() {
  scene.clearGeometry();
}
