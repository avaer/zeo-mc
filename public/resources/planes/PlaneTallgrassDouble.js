import PlaneBase from './PlaneBase';
import {BIOME_TEXTURES} from '../../constants/index';

const NAME = 'tallgrassDouble';

function _doubleTexture(texture) {
  return [texture, texture];
}

function _doublePlantName(plantName) {
  return ['double_plant_' + plantName + '_bottom', 'double_plant_' + plantName + '_top'];
}

function _expandBiomes(plantNames) {
  const result = [];
  plantNames.forEach(plantNames => {
    BIOME_TEXTURES.forEach(biomeTexture => {
      const biomedPlantNames = plantNames.map(plantName => plantName + '_' + biomeTexture);
      result.push(biomedPlantNames);
    });
  });
  return result;
}

const MATERIALS = [].concat([
  'reeds'
].map(_doubleTexture)).concat([
  'paeonia',
  'rose',
  'syringa',
].map(_doublePlantName)).concat(_expandBiomes([
  'fern',
  'grass',
].map(_doublePlantName)));

const SIZE = 10;

export default class PlaneTallgrassDouble extends PlaneBase {
  static NAME = NAME;
  static MATERIALS = MATERIALS;

  constructor([p1 = Math.random()] = [], []) {
    super([], []);

    const materialIndex = Math.floor(p1 * MATERIALS.length);
    this.materials = MATERIALS[materialIndex];

    const offset = [0, 0, 16, 16];
    const bottomPosition = [0, 0, 0];
    const topPosition = [0, -SIZE, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrassDoubleBottom1',
        offset: offset,
        position: bottomPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        textureIndex: 0
      },
      {
        name: 'tallgrassDoubleBottom2',
        offset: offset,
        position: bottomPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        textureIndex: 0
      },
      {
        name: 'tallgrassDoubleTop1',
        offset: offset,
        position: topPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        textureIndex: 1
      },
      {
        name: 'tallgrassDoubleTop2',
        offset: offset,
        position: topPosition,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        textureIndex: 1
      },
    ]
  }
}

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('tallgrassDouble', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
