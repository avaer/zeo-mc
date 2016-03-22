import {MATERIAL_FRAMES} from '../../constants/index';

const PARTICLE_SIZE = 100;
const PARTICLE_SCALE = 10;

function VoxelParticleShader(opts) {
  const {game, textureLoader} = opts;

  this.game = game;
  this.textureLoader = textureLoader;

  const {THREE} = this.game;

  const materialParams = {
    transparent: true,
    side: THREE.FrontSide,
    // lights: [], // force lights refresh to setup uniforms, three.js WebGLRenderer line 4323
    fog: true,

    uniforms: THREE.UniformsUtils.merge( [

      THREE.UniformsLib[ "points" ],
      THREE.UniformsLib[ "fog" ],

      {
        frame: {type: 'i', value: 0}
      }

    ] ),

    vertexShader: [

      // begin custom
      "#define USE_SIZEATTENUATION",
      // end custom

      "uniform float size;",
      "uniform float scale;",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

      "void main() {",

        THREE.ShaderChunk[ "color_vertex" ],
        THREE.ShaderChunk[ "begin_vertex" ],
        THREE.ShaderChunk[ "project_vertex" ],

        "#ifdef USE_SIZEATTENUATION",
        "  gl_PointSize = size * ( scale / - mvPosition.z );",
        "#else",
        "  gl_PointSize = size;",
        "#endif",

        THREE.ShaderChunk[ "logdepthbuf_vertex" ],
        THREE.ShaderChunk[ "worldpos_vertex" ],
        THREE.ShaderChunk[ "shadowmap_vertex" ],

      "}"

    ].join( "\n" ),

    fragmentShader: [

      // begin custom
      "#define USE_MAP",
      // end custom

      "uniform vec3 diffuse;",
      "uniform float opacity;",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "map_particle_pars_fragment" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

      "void main() {",

        "vec3 outgoingLight = vec3( 0.0 );",
        "vec4 diffuseColor = vec4( diffuse, opacity );",

        THREE.ShaderChunk[ "logdepthbuf_fragment" ],
        THREE.ShaderChunk[ "map_particle_fragment" ],
        THREE.ShaderChunk[ "color_fragment" ],
        THREE.ShaderChunk[ "alphatest_fragment" ],

        'if (diffuseColor.a < 0.5) discard;',

        "outgoingLight = diffuseColor.rgb;",

        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

        THREE.ShaderChunk[ "premultiplied_alpha_fragment" ],
        THREE.ShaderChunk[ "tonemapping_fragment" ],
        THREE.ShaderChunk[ "encodings_fragment" ],
        THREE.ShaderChunk[ "fog_fragment" ],

      "}"

    ].join( "\n" ),
    // depthWrite: false,
    // depthTest: false,
  };
  materialParams.uniforms.size.value = PARTICLE_SIZE;
  materialParams.uniforms.scale.value = PARTICLE_SCALE;
  materialParams.uniforms.map.value = this.textureLoader.getTexture(this.textureLoader.getTextureUrl('particles/rain'));

  this.material = new THREE.ShaderMaterial(materialParams);
}

VoxelParticleShader.prototype.setFrame = function(frame) {
  frame = frame % MATERIAL_FRAMES;
  this.material.uniforms.frame.value = frame;
}

function voxelParticleShader(opts) {
  return new VoxelParticleShader(opts);
}

module.exports = voxelParticleShader;
