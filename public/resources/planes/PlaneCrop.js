import PlaneBase from './PlaneBase';
import {BIOME_TEXTURES} from '../../constants/index';

const NAME = 'crop';

function _stages(name, stages) {
  const result = [];
  for (let i = 0; i <= stages; i++) {
    result.push(name + '_stage_' + i);
  }
  return result;
}

const TEXTURES = [].concat(
  _stages('carrots', 3)
).concat(
  _stages('nether_wart', 2)
).concat(
  _stages('potatoes', 3)
).concat(
  _stages('wheat', 7)
).map(textureName => 'blocks/' + textureName);

const SIZE = 10;

export default class PlaneCrop extends PlaneBase {
  static NAME = NAME;
  static TEXTURES = TEXTURES;

  constructor([p1 = Math.random()] = [], []) {
    super([], []);

    const textureIndex = Math.floor(p1 * TEXTURES.length);
    this.textures = TEXTURES[textureIndex];

    const offset = [0, 0, 16, 16];
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'cross1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'cross2',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0]
      },
    ]
  }
}

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('crop', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
