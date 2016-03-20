const SIZE = 1;
const BORDER_SIZE = 0.1;

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = TEXTURE_WIDTH * 2;

const PORTAL_NAMES = ['red', 'blue'];
const PORTAL_POLYGON_OFFSET = -0.25;

const portalShader = {

  uniforms: {

    textureMap: {
      type: "t",
      value: null
    }

  },

  vertexShader: [

    "varying vec4 vUv;",

    "void main() {",

    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "vec4 position = projectionMatrix * mvPosition;",

    "vUv = position;",
    "vUv.xy = 0.5*vUv.xy + 0.5*vUv.w;",

    "gl_Position = position;",
    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D textureMap;",

    "varying vec4 vUv;",

    "void main() {",

    "vec4 color = texture2DProj(textureMap, vUv);",

    "gl_FragColor = color;",
    "}"

  ].join("\n")

};

function VoxelPortal(game) {
  const {scene, camera, THREE} = game;
  const {width, height} = game;

  const targets = {
    red: _makeRenderTarget(THREE),
    blue: _makeRenderTarget(THREE),
  };

  const redPortalMesh = _makePortalMesh({texture: targets.blue, portalColor: 0xFDA232}, game);
  scene.add(redPortalMesh);
  const bluePortalMesh = _makePortalMesh({texture: targets.red, portalColor: 0x188EFA}, game);
  scene.add(bluePortalMesh);
  const portalMeshes = {
    red: redPortalMesh,
    blue: bluePortalMesh
  };

  const portalRenderers = [
    _makePortalRenderer(redPortalMesh, bluePortalMesh, targets.red, this, game),
    _makePortalRenderer(bluePortalMesh, redPortalMesh, targets.blue, this, game),
  ];
  const portalTickers = _makePortalTickers(redPortalMesh, bluePortalMesh, this, game);

  this._portalMeshes = portalMeshes;
  this._portalRenderers = portalRenderers;
  this._portalTickers = portalTickers;

  this.listen();
}
VoxelPortal.prototype = {
  render: function() {
    const {_portalRenderers: portalRenderers} = this;

    portalRenderers.forEach(portalRenderer => {
      portalRenderer();
    });
  },
  tick: function() {
    const {_portalTickers: portalTickers} = this;
    portalTickers();
  },
  bothPortalsEnabled: function() {
    const {_portalMeshes: portalMeshes} = this;
    return PORTAL_NAMES.every(portalName => portalMeshes[portalName].visible);
  },
  setPortal: function(side, position, normal) {
    const {_portalMeshes: portalMeshes} = this;
    const portalMesh = portalMeshes[side];

    console.log('set portal', side, position, normal, portalMesh); // XXX

    const [positionX, positionY, positionZ] = position;
    const [normalX, normalY, normalZ] = normal;
    if (normalZ === 1) {
      portalMesh.position.set(positionX + 0.5, positionY + 1, positionZ);
      portalMesh.rotation.set(0, (Math.PI / 2) * 0, 0);
    } else if (normalX === 1) {
      portalMesh.position.set(positionX, positionY + 1, positionZ + 0.5);
      portalMesh.rotation.set(0, (Math.PI / 2) * 1, 0);
    } else if (normalZ === -1) {
      portalMesh.position.set(positionX + 0.5, positionY + 1, positionZ + 1);
      portalMesh.rotation.set(0, (Math.PI / 2) * 2, 0);
    } else if (normalX === -1) {
      portalMesh.position.set(positionX + 1, positionY + 1, positionZ + 0.5);
      portalMesh.rotation.set(0, (Math.PI / 2) * 3, 0);
    }
    portalMesh.visible = true;

    const bothPortalsEnabled = this.bothPortalsEnabled();
    PORTAL_NAMES.forEach(portalName => {
      portalMeshes[portalName].inner.visible = bothPortalsEnabled;
    });
  },
  listen: function() {
    game.on('prerender', () => {
      this.render();
    });
    game.on('tick', () => {
      this.tick();
    });
  },
};

function _makePortalMesh(spec, game) {
  const {texture, portalColor} = spec;
  const {THREE, THREECSG} = game;

  const object = new THREE.Object3D();
  const inner = (() => {
    const geometry = (() => {
      const planeGeometry = new THREE.PlaneGeometry(SIZE, SIZE * 2);
      // planeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, BORDER_SIZE/2));
      const bufferGeometry = new THREE.BufferGeometry().fromGeometry(planeGeometry);
      return bufferGeometry;
    })();
    const material = (() => {
      const shaderUniforms = THREE.UniformsUtils.clone(portalShader.uniforms);
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: portalShader.vertexShader,
        fragmentShader: portalShader.fragmentShader
      });
      shaderMaterial.uniforms.textureMap.value = texture;
      shaderMaterial.polygonOffset = true;
      shaderMaterial.polygonOffsetFactor = PORTAL_POLYGON_OFFSET;
      return shaderMaterial;
    })();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    return mesh;
  })();
  object.add(inner);
  object.inner = inner;
  const outer = (() => {
    const geometry = (() => {
      const outerGeometry = new THREE.BoxGeometry(SIZE + BORDER_SIZE * 2, SIZE * 2 + BORDER_SIZE * 2, BORDER_SIZE);
      const outerCSG = new THREECSG(outerGeometry);

      const innerGeometry = new THREE.BoxGeometry(SIZE, SIZE * 2, BORDER_SIZE);
      const innerCSG = new THREECSG(innerGeometry);

      const holeCSG = outerCSG.subtract(innerCSG);
      const holeGeometry = holeCSG.toGeometry();

      const bufferGeometry = new THREE.BufferGeometry().fromGeometry(holeGeometry);
      return bufferGeometry;
    })();
    const material = new THREE.MeshBasicMaterial({color: portalColor});
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  })();
  object.add(outer);
  object.outer = outer;
  const back = (() => {
    const geometry = (() => {
      const {geometry: innerGeometry} = inner;
      const bufferGeometry = innerGeometry.clone();
      bufferGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
      return bufferGeometry;
    })();
    const material = (() => {
      const basicMaterial = new THREE.MeshBasicMaterial({color: portalColor});
      basicMaterial.side = THREE.DoubleSide;
      return basicMaterial;
    })();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    return mesh;
  })();
  object.add(back);
  object.back = back;

  object.visible = false;

  return object;
}

function _makeRenderTarget(THREE) {
  return new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  });
}

function _sgn(a) {
  if (a > 0.0) return (1.0);
  if (a < 0.0) return (-1.0);
  return (0.0);
}

function _makePortalRenderer(sourcePortalMesh, targetPortalMesh, target, voxelPortal, game) {
  const {width, height, scene, camera, view, THREE} = game;

  const portalCamera = new THREE.PerspectiveCamera(view.fov, view.aspectRatio, view.nearPlane, view.farPlane);

  function _getRotationDelta() {
    return targetPortalMesh.rotation.toVector3().sub(sourcePortalMesh.rotation.toVector3());
  }

  let oldPosition;
  let oldRotation;

  function hidePortals() {
    sourcePortalMesh.inner.visible = false;
    targetPortalMesh.inner.visible = false;
    sourcePortalMesh.back.visible = false;
  }

  function showPortals() {
    const bothPortalsEnabled = voxelPortal.bothPortalsEnabled();
    sourcePortalMesh.inner.visible = bothPortalsEnabled;
    targetPortalMesh.inner.visible = bothPortalsEnabled;
    sourcePortalMesh.back.visible = bothPortalsEnabled;
  }

  function updatePortalCamera() {
    if (!portalCamera.parent) {
      camera.add(portalCamera);
      portalCamera.yaw = portalCamera.parent.parent.parent.parent.parent.parent.parent;
    }

    oldPosition = portalCamera.yaw.position.clone();
    oldRotation = portalCamera.yaw.rotation.clone();

    const vectorToTarget = targetPortalMesh.position.clone().sub(portalCamera.yaw.position);
    const rotationDelta = _getRotationDelta();
    const rotatedVectorToTarget = vectorToTarget.clone()
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationDelta.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationDelta.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), rotationDelta.z);
    const targetViewPosition = sourcePortalMesh.position.clone().sub(rotatedVectorToTarget);

    portalCamera.yaw.position.copy(targetViewPosition);
    portalCamera.yaw.rotation.setFromVector3(portalCamera.yaw.rotation.toVector3().add(rotationDelta));

    // update portalCamera matrices
    portalCamera.updateProjectionMatrix();
    portalCamera.updateMatrixWorld();
    portalCamera.matrixWorldInverse.getInverse(portalCamera.matrixWorld);

    // reflecting a vector:
    // http://www.3dkingdoms.com/weekly/weekly.php?a=2

    // now update projection matrix with new clip plane
    // implementing code from: http://www.terathon.com/code/oblique.html
    // paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf

    /* // update sourcePortalMesh matrices
    sourcePortalMesh.updateMatrix();
    sourcePortalMesh.updateMatrixWorld();
    targetPortalMesh.updateMatrix();
    targetPortalMesh.updateMatrixWorld(); */

    // const rotationMatrix = new THREE.Matrix4().extractRotation(targetPortalMesh.matrix);
    // .applyMatrix4(rotationMatrix);

    const N = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), sourcePortalMesh.rotation.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), sourcePortalMesh.rotation.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), sourcePortalMesh.rotation.z);

    const clipPlane = new THREE.Plane();
    clipPlane.setFromNormalAndCoplanarPoint(N, vectorToTarget/*.clone().add(new THREE.Vector3(0, 0, -10))*/);
    clipPlane.applyMatrix4(portalCamera.matrixWorldInverse);

    const clipPlane2 = new THREE.Vector4(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, -Math.abs(vectorToTarget.x));

    const {projectionMatrix} = portalCamera;

    const q = new THREE.Vector4();
    q.x = (_sgn(clipPlane2.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    q.y = (_sgn(clipPlane2.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    q.z = -1.0;
    q.w = (1.0 + projectionMatrix.elements[10]) / portalCamera.projectionMatrix.elements[14];

    // Calculate the scaled plane vector
    const c = clipPlane2.multiplyScalar(2.0 / clipPlane2.dot(q));

    // Replace the third row of the projection matrix
    projectionMatrix.elements[2] = c.x;
    projectionMatrix.elements[6] = c.y;
    projectionMatrix.elements[10] = c.z + 1.0;
    projectionMatrix.elements[14] = c.w;

  }

  function renderPortal() {
    view.renderer.render(scene, portalCamera, target, true);
  }

  function resetPortalCamera() {
    portalCamera.yaw.position.copy(oldPosition);
    portalCamera.yaw.rotation.copy(oldRotation);
  }

  return function() {
    hidePortals();
    updatePortalCamera();
    renderPortal();
    resetPortalCamera();
    showPortals();
  };
}

function _makePortalTickers(sourcePortalMesh, targetPortalMesh, voxelPortal, game) {
  let epoch = 0;
  let lastPassThroughEpoch = 0;
  let prevPlayerPosition = null;

  function _getPlayerPosition() {
    const yaw = game.controls.target().avatar;
    const position = yaw.position.clone();
    return position;
  }

  const tickers = [
    _makePortalTicker(sourcePortalMesh, targetPortalMesh, game),
    _makePortalTicker(targetPortalMesh, sourcePortalMesh, game),
  ];

  return function() {
    if (voxelPortal.bothPortalsEnabled()) {
      const nextPlayerPosition = _getPlayerPosition();
      tickers.forEach(ticker => {
        const epochDiff = epoch - lastPassThroughEpoch;
        if (epochDiff >= 2) {
          const passedThrough = ticker(prevPlayerPosition, nextPlayerPosition);
          if (passedThrough) {
            lastPassThroughEpoch = epoch;
          }
        }
      });
      prevPlayerPosition = nextPlayerPosition;
      epoch++;
    }
  };
}

function _makePortalTicker(sourcePortalMesh, targetPortalMesh, game) {
  const {inner: sourcePortalInner} = sourcePortalMesh;
  const {THREE} = game;

  const plane = (() => {
    const normal = new THREE.Vector3(0, 0, -1);
    normal
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), sourcePortalMesh.rotation.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), sourcePortalMesh.rotation.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), sourcePortalMesh.rotation.z);
    const point = sourcePortalMesh.position;
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, point);
    return plane;
  })();
  const raycaster = new THREE.Raycaster();

  function _getPositionDelta() {
    return new THREE.Vector3().subVectors(targetPortalMesh.position, sourcePortalMesh.position);
  }

  function _getRotationDelta() {
    return sourcePortalMesh.rotation.toVector3().sub(targetPortalMesh.rotation.toVector3());
  }

  function _passesThroughPortal(start, end) {
    const ray = new THREE.Vector3().subVectors(end, start);
    const direction = ray.clone().normalize();
    raycaster.set(start, direction);
    const intersections = raycaster.intersectObject(sourcePortalInner);
    if (intersections.length > 0) {
      const rayLength = ray.length();
      return intersections.some(intersection => {
        return intersection.distance < rayLength;
      });
    } else {
      return false;
    }
  }

  function _movePlayerPosition(positionDelta, rotationDelta) {
    const yaw = game.controls.target().avatar;
    yaw.position.add(positionDelta);
    yaw.rotation.setFromVector3(yaw.rotation.toVector3().add(rotationDelta));
  }

  return function(prevPlayerPosition, nextPlayerPosition) {
    if (prevPlayerPosition !== null) {
      if (_passesThroughPortal(prevPlayerPosition, nextPlayerPosition)) {
        const positionDelta = _getPositionDelta();
        const rotationDelta = _getRotationDelta();
        _movePlayerPosition(positionDelta, rotationDelta);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
}

function voxelPortal(game) {
  return new VoxelPortal(game);
}

module.exports = voxelPortal;
