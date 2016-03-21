import THREE from 'three';
import FXAAShader from './FXAAShader';

const FXAAPass = function (scene, camera, params) {
	this.textureID = "tDiffuse";

	/* this.scene = scene;
	this.camera = camera; */

  const {width, height, devicePixelRatio} = params;
	const resolution = [1 / (width * devicePixelRatio), 1 / (height * devicePixelRatio)];
	
	var fxaaShader = FXAAShader;
	var fxaaUniforms = THREE.UniformsUtils.clone(fxaaShader.uniforms);

	fxaaUniforms[ "resolution" ].value.set(resolution[0], resolution[1]);

  this.uniforms = fxaaUniforms;
  this.material = new THREE.ShaderMaterial( {
		uniforms: fxaaUniforms,
		vertexShader: fxaaShader.vertexShader,
		fragmentShader: fxaaShader.fragmentShader
	} );

  // begin default
	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );
  // end default
};

FXAAPass.prototype = {

	render: function( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

};

module.exports = FXAAPass;
