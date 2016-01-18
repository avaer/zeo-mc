import React from 'react';
import ReactDom from 'react-dom';

const WORLD_SIZE = 32;

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
  scene.add(sphereMesh);

  const grid = new THREE.GridHelper(WORLD_SIZE, 1);
  grid.position.x = WORLD_SIZE;
  grid.position.z = -WORLD_SIZE;
  grid.setColors(0xCCCCCC, 0xCCCCCC);
  scene.add(grid);

  const aspectRatio = width / height;
  const camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 100);
  camera.position.y = 1;
  camera.position.x = WORLD_SIZE / 2;
  camera.position.z = 0;
  camera.rotation.order = 'YXZ';

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width * pixelRatio, height * pixelRatio);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xFFFFFF, 1);

  const canvas = renderer.domElement;
  canvas.style.width = width;
  canvas.style.height = height;

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

    this.renderer.render();
  }

  componentWillReceiveProps(nextProps) {
    const {width: oldWidth, height: oldHeight, pixelRatio: oldPixelRatio} = this.props;
    const {width, height, pixelRatio} = nextProps;

    if (width !== oldWidth || height !== oldHeight || pixelRatio !== oldPixelRatio) {
      this.renderer.resize({width, height, pixelRatio});
	}
  }

  componentDidUpdate() {
    this.renderer.render();
  }

  render() {
    return (
      <div/>
    );
  }
}
