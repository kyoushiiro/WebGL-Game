let canvas = null;
let gl = null;
let scene = null;
let camera = null;
// Scale of world variable.
let GLOBAL_SCALE = 1;
// Projection/View variables.
let nearPlane = 0.01;
let farPlane = 100;
// Lighting variables.
let lightAngle = 0;
let diffuseY = 1.0;
let diffuseZ = 0.0;

// References to each shader used.
let normShaders = null;
let texShaders = null;

// Path to the pixelmap to be used in creating a map.
let mapSrc = 'external/maps/complex1.png';
let grid = null;

// References to each uniform/attribute variable used in shaders.
// a_ = attribute
// u_ = uniform
// _n = normal shaders
// _t = texture shaders
let at_Position = null;
let ut_XformMatrix = null;
let ut_ViewMatrix = null;
let ut_ProjMatrix = null;
let at_TexCoord = null;
let ut_Sampler = null;

let an_Position = null;
let an_Color = null;
let an_Normal = null;
let un_XformMatrix = null;
let un_ViewMatrix = null;
let un_ProjMatrix = null;
let un_LightColor = null;
let un_AmbientLight = null;
let un_LightPosition = null;
let un_DiffuseDirection = null;
let un_EyePosition = null;
let un_PhongToggle = null;
let u_FogColor = null;
let u_FogDist = null;
let u_Eye = null;

// References to each attribute buffer used in shaders.
let attributeBuffer = null;
let attribColorBuffer = null;
let attribNormBuffer = null;

let blitz = null;
let eyeArray = null;
let fogDist = null;
let fogRange = 10;

/**
 * Function called when the webpage loads.
 */
function main() {
  canvas = document.getElementById("canv");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element!");
    return false;
  }

  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL!");
    return false;
  }

  normShaders = createShader(gl, NORM_VSHADER, NORM_FSHADER);
  texShaders = createShader(gl, TEXTURE_VSHADER, TEXTURE_FSHADER);

  if(initGLSLVariables() < 0) {
    console.log('Failed to initialize GLSL variables');
    return false;
  }

  attributeBuffer = gl.createBuffer();
  if (!attributeBuffer) {
    console.log("Failed to create buffers!");
    return false;
  }
  attribColorBuffer = gl.createBuffer();
  if(!attribColorBuffer) {
    console.log("Failed to create color buffer!");
    return false;
  }
  attribNormBuffer = gl.createBuffer();
  if(!attribNormBuffer) {
    console.log("Failed to create normal buffer!");
    return false;
  }

  useShader(gl, normShaders);
  gl.enable(gl.DEPTH_TEST);

  scene = new Scene();

  let image = new Image();
  if(!image) {
    console.log("Failed to create new image object!");
    return false
  }
  image.onload = function() {
    let data = getImagePixelData(image); 
    createMap(data, image.width, image.height);
  }
  image.src = mapSrc;

  let fogColor = new Float32Array([0.137, 0.231, 0.423]);
  fogDist = new Float32Array([1, fogRange]);
  eyeArray = new Float32Array([g_eyeX, g_eyeY, g_eyeZ, 1.0]);

  useShader(gl, normShaders);
  gl.uniform3fv(u_FogColor, fogColor);
  gl.uniform2fv(u_FogDist, fogDist);
  gl.uniform4fv(u_Eye, eyeArray);

  blitz = new Blitz(1.0, 0.5, 15.0);
  let br = 244/255;
  let bg = 217/255;
  let bb = 66/255;
  blitz.addCubeToBlitz(0.8, 0.0, 0.6, 0.0, br, bg, bb, 1, 1, 1);
  blitz.addCubeToBlitz(0.2, 0.1, 0.1, 0.2, br, bg, bb, 1, 1, 1);
  blitz.addCubeToBlitz(0.2, 0.1, 0.1,-0.2, br, bg, bb, 1, 1, 1);
  blitz.addCubeToBlitz(0.4, 0.0, 1.2, 0.0, br-0.1, bg-0.1, bb, 1, 1, 1);
  blitz.addCubeToBlitz(0.3, 0.0, 0.6, 0.55, br, bg, bb+1, 1, 1, 1);
  blitz.addCubeToBlitz(0.3, 0.0, 0.6,-0.55, br, bg, bb+1, 1, 1, 1);
  scene.addGeometry(blitz);

  let treasure = new Cube(0.6, 6.0, 0.8, 2.0, 150/255, 100/255, 200/255, 1, 1, 1);
  scene.addGeometry(treasure);
  treasure = new Cube(0.5, 23.0, 0.8, 2.0, 200/255, 60/255, 30/255, 1, 1, 1)
  scene.addGeometry(treasure);
  treasure = new Cube(0.5, 26.0, 0.8, 4.0, 5/255, 5/255, 5/255, 1, 1, 1)
  scene.addGeometry(treasure);
  
  canvas.onmousedown = function(ev) {
    let evx = ev.clientX, evy = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    if(rect.left <= evx && evx < rect.right && rect.top <= evy && evy < rect.bottom) {
      let x_in_canvas = evx - rect.left, y_in_canvas = rect.bottom - evy;
      let picked = check(gl, x_in_canvas, y_in_canvas);
      if(picked == 1) alert('You found the purple heart!');
      if(picked == 2) alert('You found the blood box!')
      if(picked == 3) alert('You found the dark soul!')
    }
  }

  camera = new Camera();
  initEventHandelers();

  tick();
}

function check(gl, x, y) {
  let picked = false;
  let pixels = new Uint8Array(4);
  scene.render();
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  if(pixels[0] > 130 && pixels[0] < 200 && pixels[1] > 95 && pixels[1] < 150 && pixels[2] > 190) {
    picked = 1;
  }
  else if(pixels[0] > 195 && pixels[1] < 95 && pixels[1] > 30 && pixels[2] < 65 && pixels[2] > 5) {
    picked = 2;
  }
  else if(pixels[0] < 20 && pixels[0] != 0 && pixels[1] < 20 && pixels[1] < 20) {
    picked = 3;
  }
  return picked;
}

function resizeCanvas() {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    camera.setFov();
  }
}

function getImagePixelData(image) {
  var canvas = document.createElement('canvas');

  canvas.height = image.height;
  canvas.width = image.width;
  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  var colorData = context.getImageData(0, 0, image.width, image.height).data;

  return colorData;
}

function createMap(pixelData, mapWidth, mapHeight) {
  grid = new Array(mapWidth);
  for(let k = 0; k < mapWidth; k++) {
    grid[k] = new Array(mapHeight);
  }
  let cubeSize = GLOBAL_SCALE;
  let newMap = new StaticMap(mapWidth, mapHeight);
  for(let z = 0; z < mapHeight; z++) {
    let zo = z*mapWidth*4;
    for (let x = 0; x < mapWidth; x++) {
      let xo = x*4;
      let r = pixelData[zo + xo];
      let g = pixelData[zo + xo + 1];
      let b = pixelData[zo + xo + 2];
      let a = pixelData[zo + xo + 3];
      if(r > 1) {
        grid[x][z] = -1;
      }
      else {
        grid[x][z] = 0;
      }

      for(let h = 0; h < r; h++) {
        newMap.addCubeToMap(cubeSize, x*cubeSize, h*cubeSize, z*cubeSize, r/255, g/255, b/255);
      }
    }
  }
  newMap.setFloat32Buffers();
  scene.addGeometry(newMap);
  console.log("Done creating map!");
}

function initGLSLVariables() {
  useShader(gl, normShaders);
  an_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(an_Position < 0) {
    console.log('Failed to find the location of an_Position');
    return -1;
  }
  an_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(an_Color < 0) {
    console.log('Failed to find the location of an_Color');
    return -1;
  }
  an_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(an_Normal < 0) {
    console.log('Failed to find the location of an_Normal');
    return -1;
  }

  un_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if(!un_LightColor) {
    console.log('Failed to find the location of un_LightColor');
    return -1;
  }
  un_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if(!un_AmbientLight) {
    console.log('Failed to find the location of un_AmbientLight');
    return -1;
  }
  un_DiffuseDirection = gl.getUniformLocation(gl.program, 'u_DiffuseDirection');
  if(!un_DiffuseDirection) {
    console.log('Failed to find the location of un_DiffuseDirection');
    return -1;
  }
  un_PhongToggle = gl.getUniformLocation(gl.program, 'u_PhongToggle');

  un_XformMatrix = gl.getUniformLocation(gl.program, 'u_XformMatrix');
  if(!un_XformMatrix) {
    console.log('Failed to find the location of un_XformMatrix');
    return -1;
  }
  un_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!un_ViewMatrix) {
    console.log('Failed to find the location of un_ViewMatrix');
    return -1;
  }
  un_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!un_ProjMatrix) {
    console.log('Failed to find the location of un_ProjMatrix');
    return -1;
  }
  u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
  u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
  u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');

  useShader(gl, texShaders);
  at_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(at_Position < 0) {
    console.log('Failed to find the location of at_Position');
    return -1;
  }
  ut_XformMatrix = gl.getUniformLocation(gl.program, 'u_XformMatrix');
  if(!ut_XformMatrix) {
    console.log('Failed to find the location of ut_XformMatrix');
    return -1;
  }
  ut_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!ut_ViewMatrix) {
    console.log('Failed to find the location of ut_ViewMatrix');
    return -1;
  }
  ut_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!ut_ProjMatrix) {
    console.log('Failed to find the location of ut_ProjMatrix');
    return -1;
  }
  at_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if(at_TexCoord < 0) {
    console.log('Failed to find the location of at_TexCoord');
    return -1;
  }
  ut_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if(!ut_Sampler) {
    console.log('Failed to find the location of ut_Sampler');
    return -1;
  }

  return 0;
}