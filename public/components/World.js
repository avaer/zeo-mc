import React from 'react';
import ReactDom from 'react-dom';

function makeThreeRenderer({width, height}) {
  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight( 0x000000 );
  scene.add(ambientLight);

  const lights = [];
  lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[0].position.set( 0, 200, 0 );
  lights[1].position.set( 100, 200, 100 );
  lights[2].position.set( -100, -200, -100 );
  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );

  const mesh = new THREE.Object3D()
  mesh.add( new THREE.LineSegments(
    new THREE.Geometry(),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    })
  ));
  mesh.add( new THREE.Mesh(
    new THREE.Geometry(),
    new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    })
  ));
  scene.add(mesh);

  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 50);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height)

  return {
    render: () => {
      renderer.render(scene, camera);
    },
    getCanvas: () => {
      return renderer.domElement;
	}
  };
}

export default class World extends React.Component {
  componentDidMount() {
    const {width, height} = this.props;
    this.renderer = makeThreeRenderer({width, height});

    const domNode = ReactDom.findDomNode(this);
    const canvas = this.renderer.getCanvas();
    $(domNode).append(canvas);

    this.renderer.render();
  }

  render() {
    return (
      <div/>
    );
  }
}
