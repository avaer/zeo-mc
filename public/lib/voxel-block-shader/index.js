import {MATERIAL_FRAMES} from '../../constants/index';

const {floor, ceil, round} = Math;

function VoxelBlockShader(opts) {
  const {game, atlas} = opts;

  this.game = game;
  this.atlas = atlas;

  const {THREE} = game;

  const materialParams = {
    transparent: true,
    side: THREE.FrontSide,
    lights: [], // force lights refresh to setup uniforms, three.js WebGLRenderer line 4323
    fog: true,

  // based on three.js/src/renderers/WebGLShaders.js lambert
  uniforms: THREE.UniformsUtils.merge( [

      THREE.UniformsLib[ "common" ],
      THREE.UniformsLib[ "aomap" ],
      THREE.UniformsLib[ "lightmap" ],
      THREE.UniformsLib[ "emissivemap" ],
      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "lights" ],

      {
        "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },

        // begin custom
        tileMap: {type: 't', value: null}, // textures not preserved by UniformsUtils.merge(); set below instead
        atlasSize: {type: 'f', value: this.atlas.getTexture().image.width}, // atlas canvas width (= height) in pixels
        frame: {type: 'i', value: 0}
        // end custom
      }
  ] ),

  vertexShader: [

    "#define LAMBERT",

    "varying vec3 vLightFront;",

    "#ifdef DOUBLE_SIDED",

    "	varying vec3 vLightBack;",

    "#endif",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "uv_pars_vertex" ],
    THREE.ShaderChunk[ "uv2_pars_vertex" ],
    THREE.ShaderChunk[ "envmap_pars_vertex" ],
    THREE.ShaderChunk[ "bsdfs" ],
    THREE.ShaderChunk[ "lights_pars" ],
    THREE.ShaderChunk[ "color_pars_vertex" ],
    THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
    THREE.ShaderChunk[ "skinning_pars_vertex" ],
    THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
    THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

    // begin custom
    // added to pass to fragment shader for tile UV coordinate calculation
    'uniform int frame;',
    '',
    _range(0, MATERIAL_FRAMES / 2).map(i => 'attribute vec4 frameUv' + i +';').join('\n'),
    '',
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'varying vec2 vTile;',
    '',
    'vec2 getTileFrame() {',
    _range(0, MATERIAL_FRAMES).map(i =>
    '  if (frame == ' + i + ') return frameUv' + floor(i / 2) + '.' + ((i % 2 === 0) ? 'xy' : 'zw') + ';'
    ).join('\n'),
    '  return vec2(0.0, 0.0);',
    '}',
    '',
    // end custom

    "void main() {",

      THREE.ShaderChunk[ "uv_vertex" ],
      THREE.ShaderChunk[ "uv2_vertex" ],
      THREE.ShaderChunk[ "color_vertex" ],

      THREE.ShaderChunk[ "beginnormal_vertex" ],
      THREE.ShaderChunk[ "morphnormal_vertex" ],
      THREE.ShaderChunk[ "skinbase_vertex" ],
      THREE.ShaderChunk[ "skinnormal_vertex" ],
      THREE.ShaderChunk[ "defaultnormal_vertex" ],

      THREE.ShaderChunk[ "begin_vertex" ],
      THREE.ShaderChunk[ "morphtarget_vertex" ],
      THREE.ShaderChunk[ "skinning_vertex" ],
      THREE.ShaderChunk[ "project_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_vertex" ],

      THREE.ShaderChunk[ "worldpos_vertex" ],
      THREE.ShaderChunk[ "envmap_vertex" ],
      THREE.ShaderChunk[ "lights_lambert_vertex" ],
      THREE.ShaderChunk[ "shadowmap_vertex" ],

      // begin custom
      'vNormal = normal;',
      'vPosition = position;',
      'vTile = getTileFrame();',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      // end custom

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform vec3 diffuse;",
    "uniform vec3 emissive;",
    "uniform float opacity;",

    "varying vec3 vLightFront;",

    "#ifdef DOUBLE_SIDED",

    "	varying vec3 vLightBack;",

    "#endif",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "color_pars_fragment" ],
    THREE.ShaderChunk[ "uv_pars_fragment" ],
    THREE.ShaderChunk[ "uv2_pars_fragment" ],
    THREE.ShaderChunk[ "map_pars_fragment" ],
    THREE.ShaderChunk[ "alphamap_pars_fragment" ],
    THREE.ShaderChunk[ "aomap_pars_fragment" ],
    THREE.ShaderChunk[ "lightmap_pars_fragment" ],
    THREE.ShaderChunk[ "emissivemap_pars_fragment" ],
    THREE.ShaderChunk[ "envmap_pars_fragment" ],
    THREE.ShaderChunk[ "bsdfs" ],
    THREE.ShaderChunk[ "lights_pars" ],
    THREE.ShaderChunk[ "fog_pars_fragment" ],
    THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
    THREE.ShaderChunk[ "shadowmask_pars_fragment" ],
    THREE.ShaderChunk[ "specularmap_pars_fragment" ],
    THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

    // begin custom
    'uniform sampler2D tileMap;',
    //'uniform float tileSize;', // Size of a tile in atlas // computed below
    'uniform float atlasSize;', // size of atlas in pixels
    '',
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    '',
    'varying vec2 vTile;',

    // based on @mikolalysenko's code at:
    // http://0fps.wordpress.com/2013/07/09/texture-atlases-wrapping-and-mip-mapping/
    // https://github.com/mikolalysenko/ao-shader/blob/master/lib/ao.fsh
    // https://github.com/mikolalysenko/ao-shader/blob/master/lib/ao.vsh

    'vec4 fourTapSample(vec2 tileOffset, //Tile offset in the atlas ',
    '                  vec2 tileUV, //Tile coordinate (as above)',
    '                  vec2 tileSize,',
    '                  sampler2D atlas) {', // }
    '  //Initialize accumulators',
    '  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',
    '  float totalWeight = 0.0;',
    '',
    '  for(int dx=0; dx<2; ++dx)',
    '  for(int dy=0; dy<2; ++dy) {',
    '    //Compute coordinate in 2x2 tile patch',
    '    vec2 tileCoord = 2.0 * fract(0.5 * (tileUV + vec2(dx,dy)));',
    '',
    '    //Weight sample based on distance to center',
    '    float w = pow(1.0 - max(abs(tileCoord.x-1.0), abs(tileCoord.y-1.0)), 16.0);',
    '',
    '    //Compute atlas coord',
    '    vec2 atlasUV = tileOffset + tileSize * tileCoord;',
    '',
    '    //Sample and accumulate',
    '    color += w * texture2D(atlas, atlasUV);',
    '    totalWeight += w;',
    '  }',
    '',
    '  //Return weighted color',
    '  return color / totalWeight;',
    '}',
    '',
    // end custom

    "void main() {",

    "	vec4 diffuseColor = vec4( diffuse, opacity );",
    "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
    "	vec3 totalEmissiveLight = emissive;",

      THREE.ShaderChunk[ "logdepthbuf_fragment" ],

      // begin custom
      // THREE.ShaderChunk[ "map_fragment" ],
      // use world coordinates to repeat [0..1] offsets, within _each_ tile face
      '   vec2 tileUV = vec2(dot(vNormal.zxy, vPosition),',
      '                      dot(vNormal.yzx, vPosition));',

      '',
      '    // back and bottom: flip 180',
      '    if (vNormal.z < 0.0 || vNormal.y < 0.0) tileUV.t = 1.0 - tileUV.t;',
      '',
      '    // left: rotate 90 cw',
      '    if (vNormal.x < 0.0) {',
      '        float r = tileUV.s;',
      '        tileUV.s = 1.0 - tileUV.t;',
      '        tileUV.t = r;',
      '    }',
      '',
      '    // right and top: rotate 90 ccw',
      '    if (vNormal.x > 0.0 || vNormal.y > 0.0) {',
      '        float r = tileUV.s;',
      '        tileUV.s = 1.0 - tileUV.t;',
      '        tileUV.t = 1.0 - r;',
      '    }',
      '',
      '    // front and back and bottom: flip 180', // TODO: make top and bottom consistent (pointing north?)
      '   if (vNormal.z > 0.0 || vNormal.z < 0.0 || vNormal.y < 0.0) tileUV.t = 1.0 - tileUV.t;',
      '',
      '',

      // three.js' UV coordinate is passed as tileOffset, starting point determining the texture
      // material type (_not_ interpolated; same for all vertices).
      '   vec2 tileOffset = fract(vTile);',
      '   vec2 tileSize = floor(vTile) / atlasSize;', // TODO: trunc? overloaded not found

      '',
      /* (this.useFourTap // TODO: use glsl conditional compilation?
        ? [ */
          '     vec4 texelColor = fourTapSample(tileOffset, //Tile offset in the atlas ',
          '                  tileUV, //Tile coordinate (as above)',
          '                  tileSize,',
          '                  tileMap);',//].join('\n')
          // 'vec2 texCoord = tileOffset + tileSize * fract(tileUV);',
          // 'vec4 texelColor = texture2D(tileMap, texCoord);'].join('\n')
        /* : [
          // index tile at offset into texture atlas
          'vec2 texCoord = tileOffset + tileSize * fract(tileUV);',
          'vec4 texelColor = texture2D(tileMap, texCoord);'].join('\n')), */

      // 'if (vTransparent > 0.9 && texelColor.a < 0.5) discard;',
      'if (texelColor.a < 0.5) discard;',

      // 'texelColor = mapTexelToLinear(texelColor);',

      'diffuseColor *= texelColor;',

      '',
      // end custom

      THREE.ShaderChunk[ "color_fragment" ],
      THREE.ShaderChunk[ "alphamap_fragment" ],
      THREE.ShaderChunk[ "alphatest_fragment" ],
      THREE.ShaderChunk[ "specularmap_fragment" ],
      THREE.ShaderChunk[ "emissivemap_fragment" ],

      // accumulation
    "	reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );",

      THREE.ShaderChunk[ "lightmap_fragment" ],

    "	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );",

    "	#ifdef DOUBLE_SIDED",

    "		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;",

    "	#else",

    "		reflectedLight.directDiffuse = vLightFront;",

    "	#endif",

    "	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();",

      // modulation
      THREE.ShaderChunk[ "aomap_fragment" ],

    "	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveLight;",

      THREE.ShaderChunk[ "envmap_fragment" ],

    "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

      THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

      THREE.ShaderChunk[ "fog_fragment" ],

    "}"
  ].join("\n"),
    // depthWrite: false,
    // depthTest: false,
  };
  materialParams.uniforms.tileMap.value = this.atlas.getTexture();

  this.material = new THREE.ShaderMaterial(materialParams);
}

VoxelBlockShader.prototype.setFrame = function(frame) {
  frame = frame % MATERIAL_FRAMES;
  this.material.uniforms.frame.value = frame;
}

function getColorValue(colorsArray, colorIndex) {
  const colorArray = [colorsArray[colorIndex + 0], colorsArray[colorIndex + 1], colorsArray[colorIndex + 2]];
  return colorArrayToValue(colorArray);
}

function getNormalDirection(normalsArray, normalIndex) {
  if      (normalsArray[normalIndex + 0] === 1)  return 1; // z === 1
  else if (normalsArray[normalIndex + 1] === 1)  return 2; // y === 1
  else if (normalsArray[normalIndex + 1] === -1) return 3; // y === -1
  else if (normalsArray[normalIndex + 2] === -1) return 4; // x === -1
  else if (normalsArray[normalIndex + 2] === 1)  return 5; // x === 0
  else                                           return 0;
}

function colorArrayToValue(a) {
  return floor(
    a[0] * 255 * 255 * 255 +
    a[1] * 255 * 255 +
    a[2] * 255
  );
}
VoxelBlockShader.colorArrayToValue = colorArrayToValue;

function colorValueToArray(v) {
  return [
    (floor(v / (255 * 255)) % 255) / 255,
    (floor(v / 255) % 255) / 255,
    (v % 255) / 255
  ];
}
VoxelBlockShader.colorValueToArray = colorValueToArray;

function _range(a, b) {
  const l = b - a;
  const result = Array(l);
  for (let i = 0; i < l; i++) {
    result[i] = a + i;
  }
  return result;
}

function voxelBlockShader(opts) {
  return new VoxelBlockShader(opts);
}

module.exports = voxelBlockShader;
