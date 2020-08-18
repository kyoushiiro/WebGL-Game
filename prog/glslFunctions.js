/**
 * Sends a WebGL 2D texture object (created by load2DTexture) and sends it to
 * the shaders.
 *
 * @param val The WebGL 2D texture object being passed
 * @param {Number} textureUnit The texture unit (0 - 7) where the texture will reside
 * @param {String} uniformName The name of the uniform variable where the texture's
 * textureUnit location (0 - 7) will reside
 */
function send2DTextureToGLSL(val, textureUnit, uniformName) {
  let u_Sampler = gl.getUniformLocation(gl.program, uniformName);
  if(!u_Sampler) {
    console.log("Faled to find location of uniform " + uniformName);
    return false;
  }
  switch(textureUnit) {
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      break;
    case 2:
      gl.activeTexture(gl.TEXTURE2);
      break;
    case 3:
      gl.activeTexture(gl.TEXTURE3);
      break;
    case 4:
      gl.activeTexture(gl.TEXTURE4);
      break;
    case 5:
      gl.activeTexture(gl.TEXTURE5);
      break;
    case 6:
      gl.activeTexture(gl.TEXTURE6);
      break;
    case 7:
      gl.activeTexture(gl.TEXTURE7);
      break;
    default:
      console.log("Invalid texture unit: " + textureUnit);
  } 
  gl.bindTexture(gl.TEXTURE_2D, val); 
  gl.uniform1i(u_Sampler, textureUnit);
}

/**
 * Creates a WebGl 2D texture object.
 *
 * @param imgPath A file path/data url containing the location of the texture image
 * @param magParam texParameteri for gl.TEXTURE_MAG_FILTER. Can be gl.NEAREST,
 * gl.LINEAR, etc.
 * @param minParam texParameteri for gl.TEXTURE_MIN_FILTER. Can be gl.NEAREST,
 * gl.LINEAR, etc.
 * @param wrapSParam texParameteri for gl.TEXTURE_WRAP_S. Can be gl.REPEAT,
 * gl. MIRRORED_REPEAT, or gl.CLAMP_TO_EDGE.
 * @param wrapTParam texParameteri for gl.TEXTURE_WRAP_S. Can be gl.REPEAT,
 * gl. MIRRORED_REPEAT, or gl.CLAMP_TO_EDGE.
 * @param callback A callback function which executes with the completed texture
 * object passed as a parameter.
 */
function create2DTexture(imgPath, magParam, minParam, wrapSParam, wrapTParam, callback) {
  // Recomendations: This function should see you creating an Image object,
  // setting that image object's ".onload" to an anonymous function containing
  // the rest of your code, and setting that image object's ".src" to imgPath.
  //
  // Within the anonymous function:
  //  1. create a texture object by saving the result of gl.createTexture()
  //  2. Flip your image's y-axis and bind your texture object to gl.TEXTURE_2D
  //  3. Using multiple calls to gl.texParameteri, pass magParam, minParam,
  //     wrapSParam, and wrapTParam.
  //  4. Set the texture's image to the loaded image using gl.texImage2D
  //  5. Pass your completed texture object to your callback function
  //
  // NOTE: This function should not return anything.
  let texture = gl.createTexture();
  if(!texture) {
    console.log("Failed to create new texture!");
    return false;
  }

  let image = new Image();
  if(!image) {
    console.log("Failed to create new image object!");
    return false
  }

  image.onload = function() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magParam);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minParam);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapSParam);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapTParam);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    callback(texture);
  }
  image.crossOrigin = '';
  image.src = imgPath;
  return true;
}

/**
 * Sends data to a uniform variable expecting a matrix value.
 *
 * @private
 * @param {Array} val Value being sent to uniform variable
 * @param {String} uniformName Name of the uniform variable recieving data
 */
function sendUniformMatToGLSL(val, uniformName) {
  let u_matrix = gl.getUniformLocation(gl.program, uniformName);
  if (!u_matrix) {
    console.log("Failed to retrieve the location of " + uniformName);
    return;
  }

  gl.uniformMatrix4fv(u_matrix, false, val.elements);
  // Recomendations: This is going to be very similar to sending a float/vec.
}

/**
* Sends data to an attribute variable using a buffer.
*
* @private
* @param {Float32Array} data Data being sent to attribute variable
* @param {Number} dataCount The amount of data to pass per vertex
* @param {String} attribName The name of the attribute variable
*/
function sendAttributeBufferToGLSL(data, dataCount, attribName) {
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object.");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  let a_Variable = gl.getAttribLocation(gl.program, attribName);
  if(a_Variable < 0) {
    console.log("Failed to find attribute: " + attribName);
    return -1;
  }

  gl.vertexAttribPointer(a_Variable, dataCount, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Variable);
}

/**
* Draws the current buffer loaded. Buffer was loaded by sendAttributeBufferToGLSL.
*
* @param {Integer} pointCount The amount of vertices being drawn from the buffer.
*/
function tellGLSLToDrawCurrentBuffer(pointCount) {
  gl.drawArrays(gl.TRIANGLES, 0, pointCount);
}

/**
* Sends a float value to the specified uniform variable within GLSL shaders.
* Prints an error message if unsuccessful.
*
* @param {float} val The float value being passed to uniform variable
* @param {String} uniformName The name of the uniform variable
*/
function sendUniformFloatToGLSL(val, uniformName) {
  let u_Float = gl.getUniformLocation(gl.program, uniformName);
  if (u_Float < 0) {
    console.log("Failed to find uniform " + uniformName);
    return -1;
  }
  gl.uniform1f(u_Float, val);
}

/**
* Sends an JavaSript array (vector) to the specified uniform variable within
* GLSL shaders. Array can be of length 2-4.
*
* @param {Array} val Array (vector) being passed to uniform variable
* @param {String} uniformName The name of the uniform variable
*/
function sendUniformVec4ToGLSL(val, uniformName) {
  let u_Vec4 = gl.getUniformLocation(gl.program, uniformName);
  if (u_Vec4 < 0) {
    console.log("Failed to find uniform " + uniformName);
    return -1;
  }
  gl.uniform4fv(u_Vec4, val);
}