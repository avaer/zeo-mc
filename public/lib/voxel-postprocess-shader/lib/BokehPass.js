import THREE from 'three';
import BokehShader from './BokehShader';

/**
 * Depth-of-field post-process with bokeh shader
 */

const BokehPass = function ( scene, camera, params ) {

	this.scene = scene;
	this.camera = camera;
  this.params = params;

	var focus = ( this.params.focus !== undefined ) ? this.params.focus : 1.0;
	var aspect = ( this.params.aspect !== undefined ) ? this.params.aspect : camera.aspect;
	var aperture = ( this.params.aperture !== undefined ) ? this.params.aperture : 0.025;
	var maxblur = ( this.params.maxblur !== undefined ) ? this.params.maxblur : 1.0;

	// render targets

	var width = this.params.width || window.innerWidth || 1;
	var height = this.params.height || window.innerHeight || 1;
	var devicePixelRatio = this.params.devicePixelRatio || window.devicePixelRatio || 1;

	this.renderTargetColor = new THREE.WebGLRenderTarget( width * devicePixelRatio, height * devicePixelRatio, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat
	} );

	this.renderTargetDepth = this.renderTargetColor.clone();

	// depth material

	this.materialDepth = new THREE.MeshDepthMaterial();

	// bokeh material
	
	var bokehShader = BokehShader;
	var bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );

	bokehUniforms[ "tDepth" ].value = this.renderTargetDepth;

	bokehUniforms[ "focus" ].value = focus;
	bokehUniforms[ "aspect" ].value = aspect;
	bokehUniforms[ "aperture" ].value = aperture;
	bokehUniforms[ "maxblur" ].value = maxblur;

	this.materialBokeh = new THREE.ShaderMaterial( {
		uniforms: bokehUniforms,
		vertexShader: bokehShader.vertexShader,
		fragmentShader: bokehShader.fragmentShader
	} );

	this.uniforms = bokehUniforms;
	this.enabled = true;
	this.needsSwap = false;
	this.renderToScreen = false;
	this.clear = false;

	this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene2  = new THREE.Scene();

	this.quad2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene2.add( this.quad2 );

};

BokehPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.quad2.material = this.materialBokeh;

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;

		renderer.render( this.scene, this.camera, this.renderTargetDepth, true );

		// Render bokeh composite

		this.uniforms[ "tColor" ].value = readBuffer;

		if ( this.renderToScreen ) {

			renderer.render( this.scene2, this.camera2 );

		} else {

			renderer.render( this.scene2, this.camera2, writeBuffer, this.clear );

		}

		this.scene.overrideMaterial = null;

	},

  setSize: function(width, height, devicePixelRatio) {
  var focus = ( this.params.focus !== undefined ) ? this.params.focus : 1.0;
	var aspect = ( this.params.aspect !== undefined ) ? this.params.aspect : this.camera.aspect;
	var aperture = ( this.params.aperture !== undefined ) ? this.params.aperture : 0.025;
	var maxblur = ( this.params.maxblur !== undefined ) ? this.params.maxblur : 1.0;

	this.renderTargetColor = new THREE.WebGLRenderTarget( width * devicePixelRatio, height * devicePixelRatio, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat
	} );

	this.renderTargetDepth = this.renderTargetColor.clone();

	// depth material

	this.materialDepth = new THREE.MeshDepthMaterial();

	// bokeh material
	
	var bokehShader = BokehShader;
	var bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );

	bokehUniforms[ "tDepth" ].value = this.renderTargetDepth;

	bokehUniforms[ "focus" ].value = focus;
	bokehUniforms[ "aspect" ].value = aspect;
	bokehUniforms[ "aperture" ].value = aperture;
	bokehUniforms[ "maxblur" ].value = maxblur;

	this.materialBokeh = new THREE.ShaderMaterial( {
		uniforms: bokehUniforms,
		vertexShader: bokehShader.vertexShader,
		fragmentShader: bokehShader.fragmentShader
	} );

	this.uniforms = bokehUniforms;
  }

};

module.exports = BokehPass;
