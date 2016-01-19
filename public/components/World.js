import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';

import * as inputUtils from '../utils/input/index';
import Vector from '../records/vector/index';

import {WORLD_SIZE, CAMERA_HEIGHT} from '../constants/index';

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

  const grid = new THREE.GridHelper(WORLD_SIZE / 2, 1);
  grid.position.x = WORLD_SIZE / 2;
  grid.position.z = -(WORLD_SIZE / 2);
  grid.setColors(0xCCCCCC, 0xCCCCCC);
  meshes.push(grid);

  const previewBox = (() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xCCCCCC,
      emissive: 0x808080
    });
    material.transparent = true;
    material._opacity = 0.5;
    material.opacity = 0;
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0.5;
    cube.position.y = 0.5;
    cube.position.z = -0.5;

    const object = new THREE.Object3D();
    object.add(cube);
    object.material = material;
    return object;
  })();
  meshes.push(previewBox);

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
      const geometry = new THREE.PlaneGeometry(6, 6);
      const material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        emissive: 0x808080
      });
      material.transparent = true;
      material._opacity = 0.5;
      material.opacity = 0;
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    })();
    result.add(xyAxis);
    const yzAxis = (() => {
      const geometry = new THREE.PlaneGeometry(6, 6);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        emissive: 0x808080
      });
      material.transparent = true;
      material._opacity = 0.5;
      material.opacity = 0;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = Math.PI / 2;
      return mesh;
    })();
    result.add(yzAxis);
    const xzAxis = (() => {
      const geometry = new THREE.PlaneGeometry(6, 6);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000FF,
        emissive: 0x808080
      });
      material.transparent = true;
      material._opacity = 0.5;
      material.opacity = 0;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -(Math.PI / 2);
      return mesh;
    })();
    result.add(xzAxis);

    result.axes = [xyAxis, yzAxis, xzAxis];
    result.materials = result.children.map(child => child.material);

    return result;
  })();
  meshes.push(previewAxes);

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

  const getCoords = ({x, y, intersectMeshes}) => {
    mouse.x = (x / width) * 2 - 1;
    mouse.y = -(y / height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(intersectMeshes, false);
    if (intersects.length > 0) {
      const {x, y, z} = intersects[0].point;
      return new Vector(x, y, z);
    } else {
      return null;
    }
  };

  return {
    getCanvas: () => {
      return canvas;
	},
    render: () => {
      renderer.render(scene, camera);
    },
    resize: ({width, height, pixelRatio}) => {
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
        const {x, y, z} = hoverCoords;

        previewBox.position.x = x;
        previewBox.position.z = -z;
        previewBox.material.opacity = previewBox.material._opacity;

        previewAxes.position.x = x;
        previewAxes.position.z = -z;
        for (let i = 0; i < previewAxes.materials.length; i++) {
          const material = previewAxes.materials[i];
          material.opacity = material._opacity;
        }
      } else {
        previewBox.material.opacity = 0;
        for (let i = 0; i < previewAxes.materials.length; i++) {
          const material = previewAxes.materials[i];
          material.opacity = 0;
        }
      }
	},
    getHoverCoords({x, y}) {
      const intersectMeshes = [previewGrid];
      return getCoords({x, y, intersectMeshes});
    },
    getHoverEndCoords({x, y}) {
      const intersectMeshes = previewAxes.axes;
      return getCoords({x, y, intersectMeshes});
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

    const {mousePosition: oldMousePosition} = this.props;
    const {mousePosition} = nextProps;
    if (!is(position, oldPosition) || !is(rotation, oldRotation) || !is(mousePosition, oldMousePosition)) {
      this.detectHover(nextProps);
    }

    const {hoverCoords: oldHoverCoords, hoverEndCoords: oldHoverEndCoords} = this.props;
    const {hoverCoords, hoverEndCoords} = nextProps;
    if (!is(hoverCoords, oldHoverCoords) || !is(hoverEndCoords, oldHoverEndCoords)) {
      this.updateHover(nextProps);
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

  rerender() {
    this.renderer.render();
  }

  detectHover(props) {
    props === undefined && ({props} = this);

    const normalizeCoords = coords => {
      if (coords) {
        const {x, y, z} = coords;
        return new Vector(Math.floor(x), Math.floor(y), Math.floor(-z));
      } else {
        return null;
      }
    };

    const {mousePosition} = props;
    const hoverCoords = normalizeCoords(this.renderer.getHoverCoords(mousePosition));

    const {mouseButtons} = props;
    const downMouseButtons = inputUtils.getDownMouseButtons(mouseButtons);

    const {engines} = props;
    if (!downMouseButtons.left) {
      engines.hoverCoords(hoverCoords);

      const last = (() => {
        const {hoverEndCoords} = props;
        return hoverEndCoords !== null;
      })();
      if (last) {
        engines.hoverEndCoords(null);
      }
    } else {
      const first = (() => {
        const {hoverEndCoords} = props;
        return hoverEndCoords === null;
      })();
      if (first) {
        engines.hoverCoords(hoverCoords);
        engines.hoverEndCoords(hoverCoords);
      }

      const hoverEndCoords = normalizeCoords(this.renderer.getHoverEndCoords(mousePosition));
console.log('hover end coords', hoverEndCoords && hoverEndCoords.toJS());
      if (hoverEndCoords !== null) {
        engines.hoverEndCoords(hoverEndCoords);
      }
    }
  }

  render() {
    return (
      <div/>
    );
  }
}
