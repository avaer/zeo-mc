// var tic = require('tic')();
var createAtlas = require('atlaspack');
var isTransparent = require('opaque').transparent;
var touchup = require('touchup');
var voxelFakeAo = require('voxel-fakeao');
var voxelBlockShader = require('../voxel-block-shader/index');

var floor = Math.floor;
var ceil = Math.ceil;
var round = Math.round;

module.exports = voxelPlaneShader;

function voxelPlaneShader(opts) {
  if (!(this instanceof voxelPlaneShader)) return new voxelPlaneShader(opts || {});
  var self = this;
  this.game = opts.game;
  this.atlas = opts.atlas;

  this._loading = true;
  this._meshQueue = [];
  this.atlas.once('load', () => {
    if (this._meshQueue.length > 0) {
      for (let i = 0; i < this._meshQueue.length; i++) {
        const args = this._meshQueue[i];
        this.paint(...args);
      }
      this._meshQueue = [];
    }

    this.material.needsUpdate = true;

    this._loading = false;
  });

  const {THREE} = this.game;

  this.material = (() => {
    const materialParams = {
      transparent: true,
      side: THREE.FrontSide,
      lights: [], // force lights refresh to setup uniforms, three.js WebGLRenderer line 4323
      fog: true,

      uniforms: THREE.UniformsUtils.merge( [

        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "aomap" ],
        THREE.UniformsLib[ "lightmap" ],
        THREE.UniformsLib[ "emissivemap" ],
        THREE.UniformsLib[ "fog" ],
        THREE.UniformsLib[ "ambient" ],
        THREE.UniformsLib[ "lights" ],

        {
          "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) }
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

        "}"

      ].join( "\n" ),

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
        THREE.ShaderChunk[ "ambient_pars" ],
        THREE.ShaderChunk[ "lights_pars" ],
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmask_pars_fragment" ],
        THREE.ShaderChunk[ "specularmap_pars_fragment" ],
        THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

        "void main() {",

        "	vec4 diffuseColor = vec4( diffuse, opacity );",
        "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
        "	vec3 totalEmissiveLight = emissive;",

          THREE.ShaderChunk[ "logdepthbuf_fragment" ],

          // begin custom
          // THREE.ShaderChunk[ "map_fragment" ],
          'vec4 texelColor = texture2D(map, vUv);',

          'if (texelColor.a < 0.5) discard;',

          'texelColor.xyz = inputToLinear(texelColor.xyz);',

          'diffuseColor *= texelColor;',
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

          THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

          THREE.ShaderChunk[ "fog_fragment" ],

        "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

        "}"

      ].join( "\n" )
    };
    materialParams.uniforms.map.value = this.atlas.getTexture();

    const material = new THREE.ShaderMaterial(materialParams);
    material.map = true;

    return material;
  })();
}

voxelPlaneShader.prototype.getFaceMaterial = function(mesh, i, frame) {
  const frameMaterials = (() => {
    const colors = mesh.geometry.getAttribute('color');
    const colorIndex = i * 2 * 3 * 3;
    const colorArray = [colors.array[colorIndex + 0], colors.array[colorIndex + 1], colors.array[colorIndex + 2]]
    const colorValue = voxelBlockShader.colorArrayToValue(colorArray);
    const frameMaterials = this.atlas.getFrameMaterials(colorValue);
    return frameMaterials;
  })();

  const frameMaterial = frameMaterials[frame % frameMaterials.length];

  const faceMaterial = frameMaterial[0] || '';

  return faceMaterial;
}

voxelPlaneShader.prototype.paint = function(mesh, frame) {
  // if were loading put into queue
  if (this._loading) {
    this._meshQueue.push([mesh, frame]);
    return false;
  }

  frame = frame || 0;

  const uvs = mesh.geometry.getAttribute('uv');
  if (uvs) {
    const numVertices = uvs.array.length / 2;
    const numTrigs = numVertices / 3;
    const numFaces = numTrigs / 2;
    for (let i = 0; i < numFaces; i++) {
      const faceMaterial = this.getFaceMaterial(mesh, i, frame);

      const atlasuvs = this.atlas.getMaterialUvs(faceMaterial);
      if (!atlasuvs) {
        throw new Error('no material index');
      }
      const halfAtlasUvs = [
        [atlasuvs[0][0], atlasuvs[0][1]],
        [(atlasuvs[1][0] + atlasuvs[0][0])/2, atlasuvs[1][1]],
        [(atlasuvs[2][0] + atlasuvs[0][0])/2, (atlasuvs[2][1] + atlasuvs[0][1])/2],
        [atlasuvs[3][0], (atlasuvs[3][1] + atlasuvs[0][1])/2]
      ];

      // range of UV coordinates for this texture (see above diagram)
      const [topUV, rightUV, bottomUV, leftUV] = halfAtlasUvs;

      // set uvs
      const uvIndex = i * 2 * 3 * 2;
      const uvOrder = (i % 2 === 1) ?
        /*
         TOP RIGHT
         LEFT BOTTOM
        */
        [ topUV, leftUV, rightUV, leftUV, bottomUV, rightUV ]
      :
        /*
         RIGHT TOP
         BOTTOM LEFT
        */
        [ rightUV, bottomUV, topUV, bottomUV, leftUV, topUV ];
      // abd
      uvs.array[uvIndex + 0] = uvOrder[0][0];
      uvs.array[uvIndex + 1] = 1.0 - uvOrder[0][1];

      uvs.array[uvIndex + 2] = uvOrder[1][0];
      uvs.array[uvIndex + 3] = 1.0 - uvOrder[1][1];

      uvs.array[uvIndex + 4] = uvOrder[2][0];
      uvs.array[uvIndex + 5] = 1.0 - uvOrder[2][1];

      // bcd
      uvs.array[uvIndex + 6] = uvOrder[3][0];
      uvs.array[uvIndex + 7] = 1.0 - uvOrder[3][1];

      uvs.array[uvIndex + 8] = uvOrder[4][0];
      uvs.array[uvIndex + 9] = 1.0 - uvOrder[4][1];

      uvs.array[uvIndex + 10] = uvOrder[5][0];
      uvs.array[uvIndex + 11] = 1.0 - uvOrder[5][1];
    }

    uvs.needsUpdate = true;
  }
};
