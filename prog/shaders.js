var NORM_VSHADER = 
  `attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_XformMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  uniform vec4 u_Eye;
  varying vec4 v_Color;
  varying vec3 v_Normal;
  varying vec3 v_Position;
  varying float v_Dist;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_XformMatrix * a_Position;
    v_Position = vec3(u_XformMatrix * a_Position);
    v_Normal = normalize(vec3(a_Normal));
    v_Color = a_Color;
    v_Dist = distance(u_XformMatrix * a_Position, u_Eye);
  }`;

var NORM_FSHADER =
  `precision mediump float;
  uniform vec3 u_FogColor;
  uniform vec2 u_FogDist;
  uniform vec3 u_LightColor;
  uniform vec3 u_DiffuseDirection;
  uniform vec3 u_AmbientLight;
  uniform float u_PhongToggle;
  varying vec4 v_Color;
  varying vec3 v_Normal;
  varying vec3 v_Position;
  varying float v_Dist;
  void main() {
    vec3 normal = normalize(v_Normal);
    float nDotLDiffuse = max(dot(u_DiffuseDirection, normal), 0.0);
    vec3 diffuse = u_LightColor * v_Color.rgb * nDotLDiffuse;
    vec3 ambient = u_AmbientLight * v_Color.rgb;

    float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    vec4 tempColor = vec4(u_PhongToggle*(diffuse + ambient) + (1.0-u_PhongToggle)*normal, v_Color.a);
    vec3 color = mix(u_FogColor, vec3(tempColor), fogFactor);
    gl_FragColor = vec4(color, tempColor.a);
  }`;
 
var TEXTURE_VSHADER =
  `attribute vec4 a_Position;
  uniform mat4 u_XformMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_XformMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }`;


var TEXTURE_FSHADER =
  `precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }`;
