import THREE from 'three';
import EffectComposer from 'three-effectcomposer';
import BokehPass from './lib/BokehPass';
import FXAAPass from './lib/FXAAPass';

const ThreeEffectComposer = EffectComposer(THREE);

function voxelPostProcess(renderer, scene, camera, width, height, devicePixelRatio, passes) {
  const composer = new ThreeEffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(width * devicePixelRatio, height * devicePixelRatio, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: false
    })
  );

  const renderPass = new ThreeEffectComposer.RenderPass(scene, camera);
  composer.addPass(renderPass);

  if (passes.length > 0) {
    for (let i = 0; i < passes.length; i++) {
      const pass = passes[i];
      composer.addPass(pass);

      if (i === passes.length - 1) {
        pass.renderToScreen = true;
      }
    }
  } else {
    renderPass.renderToScreen = true;
  }

  composer.setSize = (function(setSize) {
    return function(width, height, devicePixelRatio) {
      setSize.call(this, width * devicePixelRatio, height * devicePixelRatio);

      for (let i = 0; i < passes.length; i++) {
        const pass = passes[i];
        pass.setSize(width, height, devicePixelRatio);
      }
    };
  })(composer.setSize);

  return composer;
};

voxelPostProcess.PASSES = {
  Bokeh: BokehPass,
  FXAA: FXAAPass,
};

module.exports = voxelPostProcess;
