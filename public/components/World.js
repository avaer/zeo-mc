import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';

import * as inputUtils from '../utils/input/index';
import Vector from '../records/vector/index';

import {WORLD_SIZE, CAMERA_HEIGHT} from '../constants/index';

const AXIS_SIZE = 6;
const RAYTRACE_EPSILON = 10e-14;

const GEOMETRIES = (() => {
  return {
    NODE_MESH: (() => {
      const material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        emissive: 0x606060,
        side: THREE.DoubleSide
      });
      return {material};
    })(),
    PREVIEW_BOX: (() => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0xCCCCCC,
        emissive: 0x808080
      });
      material.transparent = true;
      material.opacity = 0.5;
      return {geometry, material};
    })(),
    PREVIEW_END_BOX: (() => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        emissive: 0x808080
      });
      material.transparent = true;
      material.opacity = 0.5;
      return {geometry, material};
    })(),
    PREVIEW_AXES: (() => {
      const geometry = new THREE.PlaneGeometry(AXIS_SIZE, AXIS_SIZE);
      return {geometry};
    })()
  };
})();

function makeThreeRenderer({width, height, pixelRatio}) {
  const scene = new THREE.Scene(); 

  const ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);

  const lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);
  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  const meshes = [];

  const makeNodeMesh = ({position, box}) => {
    const {x: x1, y: y1, z: z1} = position;
    const {x: x2, y: y2, z: z2} = box;

    const geometry = new THREE.BoxGeometry(x2 + 1, y2 + 1, z2 + 1);
    const {material} = GEOMETRIES.NODE_MESH;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x1 + ((x2 + 1) / 2);
    mesh.position.y = y1 + ((y2 + 1) / 2);
    mesh.position.z = -(z1 + (z2 + 1) / 2);

    const edges = new THREE.EdgesHelper(mesh, 0xCCCCCC);

    const result = new THREE.Object3D();
    result.add(mesh);
    result.add(edges);
    return result;
  };

  const sphereMesh = (() => {
    const result = new THREE.Object3D();
    const geometry = new THREE.SphereGeometry(5, 8, 8);
    result.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      })
    ));
    result.add(new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
      })
    ));
    result.position.z = -(WORLD_SIZE / 2);
    result.position.x = (WORLD_SIZE / 2);
    return result;
  })();
  meshes.push(sphereMesh); 

  const grid = makeNodeMesh({
    position: new Vector(0, -1, 0),
    box: new Vector(WORLD_SIZE, 0, WORLD_SIZE)
  });
  meshes.push(grid);

  const previewBox = (() => {
    const {geometry, material} = GEOMETRIES.PREVIEW_BOX;
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0.5;
    cube.position.y = 0.5;
    cube.position.z = -0.5;

    const object = new THREE.Object3D();
    object.add(cube);
    object.material = material;
    return object;
  })();

  const previewEndBox = (() => {
    const {geometry, material} = GEOMETRIES.PREVIEW_END_BOX;
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0.5;
    cube.position.y = 0.5;
    cube.position.z = -0.5;

    const object = new THREE.Object3D();
    object.add(cube);
    object.material = material;
    return object;
  })();

  const previewGrid = (() => {
    const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE);
    const material = (() => {
      const material = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
      });
      material.transparent = true;
      material.opacity = 0;
      return material;
    })();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.x = WORLD_SIZE / 2;
    mesh.position.z = -(WORLD_SIZE / 2);
    return mesh;
  })();
  meshes.push(previewGrid);

  const previewAxes = (() => {
    const result = new THREE.Object3D();
    const xyAxis = (() => {
      const {geometry} = GEOMETRIES.PREVIEW_AXES;
      const material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        emissive: 0x808080
      });
      material.transparent = true;
      material.opacity = 0.5;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.axis = 'xy';
      return mesh;
    })();
    result.add(xyAxis);
    const yzAxis = (() => {
      const {geometry} = GEOMETRIES.PREVIEW_AXES;
      const material = new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        emissive: 0x808080
      });
      material.transparent = true;
      material.opacity = 0.5;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = Math.PI / 2;
      mesh.axis = 'yz';
      return mesh;
    })();
    result.add(yzAxis);
    const xzAxis = (() => {
      const {geometry} = GEOMETRIES.PREVIEW_AXES;
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000FF,
        emissive: 0x808080
      });
      material.transparent = true;
      material.opacity = 0.5;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -(Math.PI / 2);
      mesh.axis = 'xz';
      return mesh;
    })();
    result.add(xzAxis);

    result.axes = [xyAxis, yzAxis, xzAxis];

    return result;
  })();

  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i];
    scene.add(mesh);
  }

  const aspectRatio = width / height;
  const camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 100);
  camera.zoom = 2;
  camera.rotation.order = 'YXZ';

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width * pixelRatio, height * pixelRatio);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xFFFFFF, 1);

  const canvas = renderer.domElement;
  canvas.style.width = width;
  canvas.style.height = height;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const getIntersect = ({x, y, intersectMeshes}) => {
    mouse.x = (x / width) * 2 - 1;
    mouse.y = -(y / height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(intersectMeshes, false);
    if (intersects.length > 0) {
      return intersects[0];
    } else {
      return null;
    }
  };

  const nodeMap = new Map();
  const nodeMeshMap = new Map();

  return {
    getCanvas: () => {
      return canvas;
	},
    render: () => {
      renderer.render(scene, camera);
    },
    resize: ({width: newWidth, height: newHeight, pixelRatio}) => {
      width = newWidth;
      height = newHeight;

      const aspectRatio = width / height;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();

      renderer.setSize(width * pixelRatio, height * pixelRatio);
      renderer.setPixelRatio(pixelRatio);
      canvas.style.width = width;
      canvas.style.height = height;
    },
    updateCamera: ({position, rotation}) => {
      camera.position.set(position.x, CAMERA_HEIGHT + position.y, position.z);
      camera.rotation.x = -rotation.y;
      camera.rotation.y = -rotation.x;
	},
    updateHover: ({hoverCoords, hoverEndCoords}) => {
      if (hoverCoords) {
        const {x: x1, y: y1, z: z1} = hoverCoords;

        previewBox.position.x = x1;
        previewBox.position.y = y1;
        previewBox.position.z = -z1;
        scene.add(previewBox);

        previewAxes.position.x = x1;
        previewAxes.position.y = y1;
        previewAxes.position.z = -z1;
        scene.add(previewAxes);

        if (hoverEndCoords) {
          const {x: x2, y: y2, z: z2} = hoverEndCoords;

          previewEndBox.position.x = x2;
          previewEndBox.position.y = y2;
          previewEndBox.position.z = -z2;
          scene.add(previewEndBox);
        }
      } else {
        scene.remove(previewBox);
        scene.remove(previewAxes);
      }

      if (!hoverCoords || !hoverEndCoords) {
        scene.remove(previewEndBox);
      }
	},
    getHoverCoords({x, y}) {
      const intersectMeshes = [previewGrid];
      const intersect = getIntersect({x, y, intersectMeshes});
      if (intersect) {
        const {point: {x, y, z}} = intersect;
        return new Vector(x, y, z);
      } else {
        return null;
      }
    },
    getHoverEndCoords({x, y}) {
      const intersectMeshes = previewAxes.axes;
      const intersect = getIntersect({x, y, intersectMeshes});
      if (intersect) {
        const {point: {x, y, z}, object: {axis}} = intersect;
        const result = new Vector(x, y, z);
        result.axis = axis;
        return result;
      } else {
        return null;
      }
    },
    updateNodes({nodes}) {
      nodes.forEach(node => {
        const {id, position, box} = node;

        const removeOldNode = () => {
          const oldNodeMesh = nodeMeshMap.get(id);
          scene.remove(oldNodeMesh);

          nodeMap.set(id, null);
          nodeMeshMap.set(id, null);
        };
        const addNewNode = () => {
          const newNodeMesh = makeNodeMesh({position, box});
          scene.add(newNodeMesh);

          nodeMap.set(id, node);
          nodeMeshMap.set(id, newNodeMesh);
        };

        const oldNode = nodeMap.get(id);
        if (oldNode) {
          if (!is(node, oldNode)) {
            removeOldNode();
            addNewNode();
          }
        } else {
          addNewNode();
        }
      });
    }
  };
}

export default class World extends React.Component {
  componentDidMount() {
    const {width, height, pixelRatio} = this.props;
    this.renderer = makeThreeRenderer({width, height, pixelRatio});

    const domNode = ReactDom.findDOMNode(this);
    const canvas = this.renderer.getCanvas();
    $(domNode).append(canvas);

    this.resize();
    this.updateCamera();
    this.updateHover();
    this.updateNodes();
    this.rerender();
  }

  componentWillReceiveProps(nextProps) {
    const {width: oldWidth, height: oldHeight, pixelRatio: oldPixelRatio} = this.props;
    const {width, height, pixelRatio} = nextProps;
    if (!is(width, oldWidth) || !is(height, oldHeight) || !is(pixelRatio, oldPixelRatio)) {
      this.resize(nextProps);
	}

    const {position: oldPosition, rotation: oldRotation} = this.props;
    const {position, rotation} = nextProps;
    if (!is(position, oldPosition) || !is(rotation, oldRotation)) {
      this.updateCamera(nextProps);
    }

    const {mousePosition: oldMousePosition, mouseButtons: oldMouseButtons} = this.props;
    const {mousePosition, mouseButtons} = nextProps;
    if (!is(position, oldPosition) || !is(rotation, oldRotation) || !is(mousePosition, oldMousePosition) || !is(mouseButtons, oldMouseButtons)) {
      this.detectHover(nextProps);
    }

    const {hoverCoords: oldHoverCoords, hoverEndCoords: oldHoverEndCoords} = this.props;
    const {hoverCoords, hoverEndCoords} = nextProps;
    if (!is(hoverCoords, oldHoverCoords) || !is(hoverEndCoords, oldHoverEndCoords)) {
      this.updateHover(nextProps);
    }

    const {nodes: oldNodes} = this.props;
    const {nodes} = nextProps;
    if (!is(nodes, oldNodes)) {
      this.updateNodes(nextProps);
    }
  }

  componentDidUpdate() {
    this.rerender();
  }

  resize(props) {
    props === undefined && ({props} = this);

    const {width, height, pixelRatio} = props;
    this.renderer.resize({width, height, pixelRatio});
  }

  updateCamera(props) {
    props === undefined && ({props} = this);

    const {position, rotation} = props;
    this.renderer.updateCamera({position, rotation});
  }

  updateHover(props) {
    props === undefined && ({props} = this);

    const {hoverCoords, hoverEndCoords} = props;
    this.renderer.updateHover({hoverCoords, hoverEndCoords});
  }

  updateNodes(props) {
    props === undefined && ({props} = this);

    const {nodes} = props;
    this.renderer.updateNodes({nodes});
  }

  rerender() {
    this.renderer.render();
  }

  detectHover(props) {
    props === undefined && ({props} = this);

    const normalizeHoverCoord = coord => Math.floor(coord + RAYTRACE_EPSILON);
    const normalizeHoverCoords = ({hoverCoords}) => {
      if (hoverCoords) {
        let {x, y, z} = hoverCoords;

        x = normalizeHoverCoord(x);
        y = normalizeHoverCoord(y);
        z = normalizeHoverCoord(-z);

        return new Vector(x, y, z);
      } else {
        return null;
      }
    };
    const normalizeHoverEndCoords = ({hoverStartCoords, hoverEndCoords}) => {
      if (hoverStartCoords && hoverEndCoords) {
        let {x, y, z, axis} = hoverEndCoords;

        x = normalizeHoverCoord(x);
        y = normalizeHoverCoord(y);
        z = normalizeHoverCoord(-z);

        switch (axis) {
          case 'xy':
            z = hoverStartCoords.z;
            break;
          case 'yz':
            x = hoverStartCoords.x;
            break;
          case 'xz':
            y = hoverStartCoords.y;
            break;
        }

        return new Vector(x, y, z);
      } else {
        return null;
      }
    };

    const {mousePosition} = props;
    const hoverCoords = this.renderer.getHoverCoords(mousePosition);
    const hoverCoordsNormalized = normalizeHoverCoords({hoverCoords});

    const {mouseButtons} = props;
    const downMouseButtons = inputUtils.getDownMouseButtons(mouseButtons);

    const {engines} = props;
    if (!downMouseButtons.left) {
      engines.hoverCoords(hoverCoordsNormalized);

      const last = (() => {
        const {hoverEndCoords} = props;
        return hoverEndCoords !== null;
      })();
      if (last) {
        const {hoverCoords: startCoords, hoverEndCoords: endCoords} = props;
        engines.hoverCommit({startCoords, endCoords});
        engines.hoverEndCoords(null);
      }
    } else {
      const first = (() => {
        const {hoverEndCoords} = props;
        return hoverEndCoords === null;
      })();
      if (first) {
        engines.hoverCoords(hoverCoordsNormalized);
        engines.hoverEndCoords(hoverCoordsNormalized);
      }

      const {hoverCoords: hoverStartCoords} = props;
      const hoverEndCoords = this.renderer.getHoverEndCoords(mousePosition);
      const hoverEndCoordsNormalized = normalizeHoverEndCoords({hoverStartCoords, hoverEndCoords});
      if (hoverEndCoordsNormalized !== null) {
        engines.hoverEndCoords(hoverEndCoordsNormalized);
      }
    }
  }

  render() {
    return (
      <div/>
    );
  }
}
