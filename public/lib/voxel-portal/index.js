const SIZE = 1;
const BORDER_SIZE = 0.1;

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = TEXTURE_WIDTH * 2;

const PORTAL_NAMES = ['red', 'blue'];
const PORTAL_POLYGON_OFFSET = -0.5;

const PORTAL_FRAME_RATE = 50;

const portalShader = {

  uniforms: {

    textureMap: {
      type: "t",
      value: null
    }

  },

  vertexShader: [

    "varying vec4 texCoord;",

    "void main() {",

    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "vec4 position = projectionMatrix * mvPosition;",

    "texCoord = position;",
    "texCoord.xy = 0.5*texCoord.xy + 0.5*texCoord.w;",
    "gl_Position = position;",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D textureMap;",
    "varying vec4 texCoord;",

    "void main() {",
    
    "gl_FragColor = texture2DProj(textureMap, texCoord);",

    "}"

  ].join("\n")

};

const {min, max, abs} = Math;

function VoxelPortal(game) {
  const {scene, camera, THREE} = game;
  const {width, height} = game;

  const targets = {
    red: _makeRenderTarget(THREE),
    blue: _makeRenderTarget(THREE),
  };

  const redPortalMesh = _makePortalMesh({texture: targets.red, portalColor: 0xFDA232}, game);
  scene.add(redPortalMesh);
  const bluePortalMesh = _makePortalMesh({texture: targets.blue, portalColor: 0x188EFA}, game);
  scene.add(bluePortalMesh);
  const portalMeshes = {
    red: redPortalMesh,
    blue: bluePortalMesh
  };

  const portalRenderers = [
    _makePortalRenderer(redPortalMesh, bluePortalMesh, targets.blue, this, game, true),
    _makePortalRenderer(bluePortalMesh, redPortalMesh, targets.red, this, game, false),
  ];
  const portalTickers = _makePortalTickers(redPortalMesh, bluePortalMesh, this, game);

  this._game = game;
  this._portalMeshes = portalMeshes;
  this._portalRenderers = portalRenderers;
  this._portalTickers = portalTickers;

  this.listen();
}
VoxelPortal.prototype = {
  render: function() {
    const {_portalRenderers: portalRenderers} = this;

    const bothPortalsEnabled = this.bothPortalsEnabled();
    const numPortalsInFrustum = this.numPortalsInFrustum();
    const now = new Date();
    const opts = {bothPortalsEnabled, numPortalsInFrustum, now};
    portalRenderers[0](opts);
    portalRenderers[1](opts);
  },
  tick: function() {
    const {_portalTickers: portalTickers} = this;
    portalTickers();
  },
  bothPortalsEnabled: function() {
    const {_portalMeshes: portalMeshes} = this;
    return PORTAL_NAMES.every(portalName => portalMeshes[portalName].visible);
  },
  numPortalsInFrustum: function() {
    const {_portalMeshes: portalMeshes, _game: game} = this;
    const {camera, THREE} = game;

    const redPortalInView = _objectInFrustum(portalMeshes.red.inner, camera, THREE);
    const bluePortalInView = _objectInFrustum(portalMeshes.blue.inner, camera, THREE);
    return (+redPortalInView) + (+bluePortalInView);
  },
  setPortal: function(side, position, normal) {
    const {_portalMeshes: portalMeshes, _game: game} = this;
    const {THREE} = game;

    const portalMesh = portalMeshes[side];

    const [positionX, positionY, positionZ] = position;
    const direction = (() => {
      const [normalX, normalY, normalZ] = normal;
      if (normalZ === 1) {
        return 0;
      } else if (normalX === 1) {
        return 1;
      } else if (normalZ === -1) {
        return 2;
      } else if (normalX === -1) {
        return 3;
      } else {
        return 0;
      }
    })();
    switch (direction) {
      case 0:
        portalMesh.position.set(positionX + 0.5, positionY + 1, positionZ);
        portalMesh.rotation.set(0, (Math.PI / 2) * 0, 0);
        break;
      case 1:
        portalMesh.position.set(positionX, positionY + 1, positionZ + 0.5);
        portalMesh.rotation.set(0, (Math.PI / 2) * 1, 0);
        break;
      case 2:
        portalMesh.position.set(positionX + 0.5, positionY + 1, positionZ + 1);
        portalMesh.rotation.set(0, (Math.PI / 2) * 2, 0);
        break;
      case 3:
        portalMesh.position.set(positionX + 1, positionY + 1, positionZ + 0.5);
        portalMesh.rotation.set(0, (Math.PI / 2) * 3, 0);
        break;
    }
    const bases = (() => {
      const positionVector = (() => {
        const result = new THREE.Vector3().fromArray(position);
        switch (direction) {
          case 0:
            result.add(new THREE.Vector3(0, 0, -2));
            break;
          case 1:
            result.add(new THREE.Vector3(-2, 0, 0));
            break;
          case 2:
            result.add(new THREE.Vector3(0, 0, 2));
            break;
          case 3:
            result.add(new THREE.Vector3(2, 0, 0));
            break;
        }
        return result;
      })();
      const normalVector = new THREE.Vector3().fromArray(normal);
      const bottomBase = new THREE.Vector3().addVectors(positionVector, normalVector);
      const topBase = new THREE.Vector3().addVectors(bottomBase, new THREE.Vector3(0, 1, 0));
      bottomBase.normal = normalVector;
      topBase.normal = normalVector;
      const bases = [bottomBase, topBase];
      return bases;
    })();
    portalMesh.bases = bases;
    portalMesh.visible = true;

    const bothPortalsEnabled = this.bothPortalsEnabled();
    PORTAL_NAMES.forEach(portalName => {
      portalMeshes[portalName].inner.visible = bothPortalsEnabled;
    });
  },
  listen: function() {
    const {_portalMeshes: portalMeshes, _game: game} = this;
    const {THREE} = game;

    game.addCollisionTest((position, axis, direction) => {
      function passesThroughBase(positionVector, normalVector, base) {
        return positionVector.equals(base) && normalVector.equals(base.normal);
      }

      if (this.bothPortalsEnabled()) {
        const normalVector = (() => {
          if (axis === 2 && direction === -1) {
            return new THREE.Vector3(0, 0, 1);
          } else if (axis === 0 && direction === -1) {
            return new THREE.Vector3(1, 0, 0);
          } else if (axis === 2 && direction === 1) {
            return new THREE.Vector3(0, 0, -1);
          } else if (axis === 0 && direction === 1) {
            return new THREE.Vector3(-1, 0, 0);
          } else {
            return null;
          }
        })();
        if (normalVector !== null) {
          const positionVector = new THREE.Vector3().fromArray(position);
          const passesThroughSomeBase =
            passesThroughBase(positionVector, normalVector, portalMeshes.red.bases[0]) ||
            passesThroughBase(positionVector, normalVector, portalMeshes.red.bases[1]) ||
            passesThroughBase(positionVector, normalVector, portalMeshes.blue.bases[0]) ||
            passesThroughBase(positionVector, normalVector, portalMeshes.blue.bases[1]);
          return !passesThroughSomeBase;
        } else {
          return true;
        }
      } else {
        return true;
      }
    });
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

function _makePortalRenderer(sourcePortalMesh, targetPortalMesh, target, voxelPortal, game, first) {
  const {width, height, scene, camera, view, THREE} = game;

  const widthHalf = width / 2;
  const heightHalf = height / 2;

  let portalCamera = null;
  let oldPosition;
  let oldRotation;
  let lastRenderTime = new Date(0);

  function _getRotationDelta() {
    return targetPortalMesh.rotation.toVector3().sub(sourcePortalMesh.rotation.toVector3());
  }

  function getObjectWorldBoundingBox(object) {
    return new THREE.Box3().setFromObject(object);
  }

  function getScreenProjection(worldPosition, camera) {
    const vector = new THREE.Vector3().copy(worldPosition);
    vector.project(camera);
    vector.x = clip((vector.x * 0.5) + 0.5);
    vector.y = clip(-(vector.y * 0.5) + 0.5);
    return [vector.x, vector.y];
  }

  function clip(v) {
    return min(max(v, 0), 1);
  }

  function getScissorFromScreenProjection(screenProjection) {
    const clipWidth = abs(screenProjection[2] - screenProjection[0]) * TEXTURE_WIDTH;
    const clipHeight = abs(screenProjection[3] - screenProjection[1]) * TEXTURE_HEIGHT;

    const x = max((min(screenProjection[0], screenProjection[2]) * TEXTURE_WIDTH) - (clipWidth / 2), 0);
    const y = max((1 - max(screenProjection[1], screenProjection[3])) * TEXTURE_HEIGHT - (clipHeight / 2), 0);
    const width = min(clipWidth * 2, TEXTURE_WIDTH);
    const height = min(clipHeight * 2, TEXTURE_HEIGHT);
    
    return new THREE.Vector4(x, y, width, height);
  }

  /* function getUvProjectionFromScreenProjection(screenProjection) {
    return new Float32Array([screenProjection[0], 1 - screenProjection[1], screenProjection[2], 1 - screenProjection[3]]);
  } */

  function hidePortals() {
    sourcePortalMesh.inner.visible = false;
    targetPortalMesh.inner.visible = false;
    sourcePortalMesh.outer.visible = false;
    sourcePortalMesh.back.visible = false;
  }

  function showPortals() {
    sourcePortalMesh.inner.visible = true;
    targetPortalMesh.inner.visible = true;
    sourcePortalMesh.outer.visible = true;
    sourcePortalMesh.back.visible = true;
  }

  function updatePortalCamera() {
    if (!portalCamera) {
      portalCamera = new THREE.PerspectiveCamera();
      portalCamera.yaw = camera.parent.parent.parent.parent.parent.parent;
      camera.add(portalCamera);
    }
    portalCamera.fov = view.fov;
    portalCamera.aspect = view.aspectRatio;
    portalCamera.near = view.nearPlane;
    portalCamera.far = view.farPlane;

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

    // const rotationMatrix = new THREE.Matrix4().extractRotation(targetPortalMesh.matrix);
    // .applyMatrix4(rotationMatrix);

    // update sourcePortalMesh matrices
    // sourcePortalMesh.updateMatrix();
    // sourcePortalMesh.updateMatrixWorld();
    // targetPortalMesh.updateMatrix();
    // targetPortalMesh.updateMatrixWorld();

    /* const N = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), sourcePortalMesh.rotation.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), sourcePortalMesh.rotation.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), sourcePortalMesh.rotation.z);

    const clipPlane = new THREE.Plane();
    clipPlane.setFromNormalAndCoplanarPoint(N, vectorToTarget);
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
    projectionMatrix.elements[14] = c.w; */
  }

  function renderPortal() {
    // view.renderer.setViewport(0, 0, 10, 10);
    // view.renderer.setScissor(0, 0, 10, 10);
    // view.renderer.setScissorTest(true);

    // target.viewport = new THREE.Vector4(0, 0, 10, 10);

    const {inner: targetPortalInner} = targetPortalMesh;
    if (_objectInFrustum(targetPortalInner, portalCamera, THREE)) {
      view.renderer.alpha = false;
      view.renderer.precision = 'lowp';
      view.renderer.antialias = false;
      // view.renderer.autoClear = false;
      view.renderer.autoClearColor = false;
      // view.renderer.autoClearDepth = false;
      view.renderer.autoClearStencil = false;
      view.renderer.sortObjects = false;
      view.renderer.stencil = false;

      view.renderer.render(scene, portalCamera, target, false);

      view.renderer.alpha = true;
      view.renderer.precision = 'highp';
      view.renderer.antialias = true;
      // view.renderer.autoClear = true;
      view.renderer.autoClearColor = true;
      // view.renderer.autoClearDepth = true;
      view.renderer.autoClearStencil = true;
      view.renderer.sortObjects = true;
      view.renderer.stencil = true;

      // view.renderer.setViewport(0, 0, width, height);
      // view.renderer.setScissorTest(false);
    }
  }

  function resetPortalCamera() {
    portalCamera.yaw.position.copy(oldPosition);
    portalCamera.yaw.rotation.copy(oldRotation);
  }

  return function(opts) {
    const {bothPortalsEnabled, numPortalsInFrustum, now} = opts;
    if (
      bothPortalsEnabled &&
      numPortalsInFrustum > 0 &&
      (+now - +lastRenderTime) > (PORTAL_FRAME_RATE * numPortalsInFrustum)
    ) {
      hidePortals();
      updatePortalCamera();
      renderPortal();
      resetPortalCamera();
      showPortals();

      lastRenderTime = now;
    }
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

function _objectInFrustum(object, camera, THREE) {
  const frustum = new THREE.Frustum();
  frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
  return frustum.intersectsObject(object);
}

function voxelPortal(game) {
  return new VoxelPortal(game);
}

module.exports = voxelPortal;
