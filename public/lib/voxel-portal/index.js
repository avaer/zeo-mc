const SIZE = 1;
const BORDER_SIZE = 0.1;

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = TEXTURE_WIDTH * 2;

const portalShader = {

  uniforms: {
    /* diffuseColor: {
      type: "c",
      value: new THREE.Color(0xffdea2)
    }, */
    diffuseSampler: {
      type: "t",
      value: null
    }

  },

  vertexShader: [

    "varying vec4 texCoord;",

    "void main() {",

    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "texCoord = projectionMatrix * mvPosition;",
    // "texCoord.x *= -1.0;",
    "texCoord.xy = 0.5*texCoord.xy + 0.5*texCoord.w;",

    "gl_Position = projectionMatrix * mvPosition;",
    "}"

  ].join("\n"),

  fragmentShader: [

    // "uniform vec3 diffuseColor;",
    "uniform sampler2D diffuseSampler;",

    "varying vec4 texCoord;",

    "void main() {",

    "vec4 uv = texCoord;",
    /* "vec4 color = vec4(diffuseColor, 1.0);",
    "color = texture2DProj(diffuseSampler, uv);",
    "color = color * vec4(diffuseColor, 1.0) + vec4(diffuseColor, 1.0) * 0.1;", */

    "vec4 color = texture2DProj(diffuseSampler, uv);",

    "gl_FragColor = color;",
    "}"

  ].join("\n")

};

function VoxelPortal(game) {
  const {scene, camera, THREE} = game;
  const {width, height} = game;

  const targets = {
    red1: _makeRenderTarget(THREE),
    red2: _makeRenderTarget(THREE),
    blue1: _makeRenderTarget(THREE),
    blue2: _makeRenderTarget(THREE),
  };

  const redPortalMesh = _makePortalMesh({texture: targets.blue2, portalColor: 0xFDA232}, game);
  redPortalMesh.position.set(0 + SIZE / 2, 14, -4);
  scene.add(redPortalMesh);
  const bluePortalMesh = _makePortalMesh({texture: targets.red2, portalColor: 0x188EFA}, game);
  bluePortalMesh.position.set(-3, 14, -3 + SIZE / 2);
  bluePortalMesh.rotation.set(0, Math.PI / 2, 0);
  scene.add(bluePortalMesh);

  const portalRenderers = [
    _makePortalRenderer(redPortalMesh, bluePortalMesh, targets.red1, targets.red2, game, true),
    _makePortalRenderer(bluePortalMesh, redPortalMesh, targets.blue1, targets.blue2, game, false),
  ];
  const portalTickers = [
    _makePortalTicker(redPortalMesh, bluePortalMesh, game),
    _makePortalTicker(bluePortalMesh, redPortalMesh, game),
  ];

  this._portalRenderers = portalRenderers;
  this._portalTickers = portalTickers;
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

    portalTickers.forEach(portalTicker => {
      portalTicker();
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
      shaderMaterial.uniforms.diffuseSampler.value = texture;
      return shaderMaterial;
    })();
    const mesh = new THREE.Mesh(geometry, material);
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

function _makePortalRenderer(sourcePortalMesh, targetPortalMesh, target1, target2, game, first) {
  const {width, height, scene, camera, view, THREE} = game;

  const portalCamera = new THREE.PerspectiveCamera(view.fov, view.aspectRatio, view.nearPlane, view.farPlane);

  const screenScene = (() => {
    const screenScene = new THREE.Scene();

    const screenGeometry = new THREE.PlaneGeometry(width, height);
    const screenMaterial = new THREE.MeshBasicMaterial({map: target1});
    const quad = new THREE.Mesh(screenGeometry, screenMaterial);
    screenScene.add(quad);

    return screenScene;
  })();

  const screenCamera = (() => {
    const screenCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10000, 10000);
    screenCamera.position.z = 1;
    return screenCamera;
  })();
  screenScene.add(screenCamera);

  const rotationDelta = targetPortalMesh.rotation.toVector3().sub(sourcePortalMesh.rotation.toVector3());

  let oldPosition;
  let oldRotation;

  function updatePortalCamera() {
    if (!portalCamera.parent) {
      camera.add(portalCamera);
      portalCamera.yaw = portalCamera.parent.parent.parent.parent.parent.parent.parent;
    }

    oldPosition = portalCamera.yaw.position.clone();
    oldRotation = portalCamera.yaw.rotation.clone();

    const vectorToTarget = targetPortalMesh.position.clone().sub(portalCamera.yaw.position);
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

    const N = new THREE.Vector3(-1, 0, 0)
      /* .applyAxisAngle(new THREE.Vector3(1, 0, 0), sourcePortalMesh.rotation.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), sourcePortalMesh.rotation.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), sourcePortalMesh.rotation.z); */

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

  function renderTargets() {
    view.renderer.render(scene, portalCamera, target1, true);
    view.renderer.render(screenScene, screenCamera, target2, true);
  }

  function resetPortalCamera() {
    portalCamera.yaw.position.copy(oldPosition);
    portalCamera.yaw.rotation.copy(oldRotation);
  }

  return function() {
    updatePortalCamera();
    renderTargets();
    resetPortalCamera();
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
  const positionDelta = new THREE.Vector3().subVectors(targetPortalMesh.position, sourcePortalMesh.position);
  const rotationDelta = sourcePortalMesh.rotation.toVector3().sub(targetPortalMesh.rotation.toVector3());

  function _getPlayerPosition() {
    const yaw = game.controls.target().avatar;
    const position = yaw.position.clone();
    return position;
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

    /* const prevSide = getSide(prevPlayerPosition);
    const nextSide = getSide(nextPlayerPosition);

    if (prevSide && !nextSide) {
      const diffLine = new THREE.Line(start, end);
      const intersectionPoint = plane.intersectLine(diffLine);
      if (intersectionPoint) {
        const portalBoundingBox = _getPortalBoundingBox();
        return _isPointInBoundingBox(intersectionPoint, portalBoundingBox);
      } else {
        return false;
      }
    } else {
      return false;
    } */
  }

  function _movePlayerPosition(positionDelta, rotationDelta) {
    const target = game.controls.target();
    const {avatar: yaw, velocity, acceleration} = target;

    yaw.position.add(positionDelta);
    yaw.rotation.setFromVector3(yaw.rotation.toVector3().add(rotationDelta));

    velocity
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationDelta.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationDelta.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), rotationDelta.z);

    acceleration
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationDelta.x)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationDelta.y)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), rotationDelta.z);
  }

  let prevPlayerPosition = null;

  return function() {
    const nextPlayerPosition = _getPlayerPosition();

    if (prevPlayerPosition !== null) {
      if (_passesThroughPortal(prevPlayerPosition, nextPlayerPosition)) {
        console.log('passed through', prevPlayerPosition.x, prevPlayerPosition.y, prevPlayerPosition.z, nextPlayerPosition.x, nextPlayerPosition.y, nextPlayerPosition.z);
        _movePlayerPosition(positionDelta, rotationDelta);
      }
    }

    prevPlayerPosition = nextPlayerPosition;
  };
}

function voxelPortal(game) {
  return new VoxelPortal(game);
}

module.exports = voxelPortal;
