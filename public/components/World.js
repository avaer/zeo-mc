import React from 'react';
import ReactDom from 'react-dom';

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

  const mesh = (() => {
    const mesh = new THREE.Object3D();
    const sphereGeometry = new THREE.SphereGeometry(5, 8, 8);
    mesh.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(sphereGeometry),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      })
    ));
    mesh.add(new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
      })
    ));
    return mesh;
  })();
  scene.add(mesh);

  const aspectRatio = width / height;
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 50);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width * pixelRatio, height * pixelRatio);
  renderer.setPixelRatio(pixelRatio);

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
  onResize = this.onResize();

  componentDidMount() {
    const {width, height, pixelRatio} = this.props;
    this.renderer = makeThreeRenderer({width, height, pixelRatio});

    const domNode = ReactDom.findDOMNode(this);
    const canvas = this.renderer.getCanvas();
    $(domNode).append(canvas);

    this.renderer.render();

    $(window).on('resize', this.onResize);
  }

  componentWillUnmount() {
    $(window).off('resize', this.onResize);
  }

  onResize() {
    return () => {
      const $window = $(window);

      const width = $window.width();
      const height = $window.height();
      const pixelRatio = window.devicePixelRatio;

      this.renderer.resize({width, height, pixelRatio});
      this.renderer.render();
    };
  }

  render() {
    return (
      <div/>
    );
  }
}
