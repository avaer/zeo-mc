import PlaneBase from './PlaneBase';

const SIZE = 1;

const MAX_POSITION = -20;
const MIN_POSITION = 20;
const FALL_FREQUENCY = 0.5;

const NAME = 'rain';
const MATERIALS = [
  [
    'rain1',
    'rain2',
    'rain3',
    'rain4'
  ]
];

export default class PlaneRain extends PlaneBase {
  static NAME = NAME;
  static MATERIALS = MATERIALS;

  constructor([], [s1 = 0, s2 = 1] = []) {
    super([], [s1, s2]);

    // const positionOffset = MAX_POSITION + (((s1 % FALL_FREQUENCY) / FALL_FREQUENCY) * (MIN_POSITION - MAX_POSITION));
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE];

    const materialIndex = 0;
    this.materials = MATERIALS[0];
    this.meshes = [
      {
        name: 'rain1',
        // offset: [0, 0 + 64 * 0, 64, 0 + 64 * 1],
        position: position,
        dimensions: dimensions,
        // rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 0, 0],
        materialIndex: 0
      },
      /* {
        name: 'rain2',
        offset: [0, 0 + 64 * 1, 64, 0 + 64 * 2],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 1, 0],
        materialIndex: 1
      }, */
      {
        name: 'rain3',
        // offset: [0, 0 + 64 * 2, 64, 0 + 64 * 3],
        position: position,
        dimensions: dimensions,
        // rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 2, 0],
        materialIndex: 2
      },
      /* {
        name: 'rain4',
        offset: [0, 0 + 64 * 3, 64, 0 + 64 * 4],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 3, 0],
        materialIndex: 3
      }, */
    ]
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('rain', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += (1 / 50))}, 50);
