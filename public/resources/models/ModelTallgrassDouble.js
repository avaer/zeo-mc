import ModelBase from './ModelBase';
import {BIOME_TEXTURES} from '../../constants/index';

const TEXTURES = [].concat([
  'reeds'
]).concat([
  'fern',
  'grass',
  'paoneia',
  'rose',
  'syringa',
].map(plantName => ['double_plant_' + plantName + '_bottom', 'double_plant_' + plantName + '_top'])).map(textures => {
  if (!Array.isArray(textures)) {
    textures = [textures];
  }
  textures = textures.map(textureName => 'blocks/' + textureName);
  return textures;
});

const SIZE = 10;

export default class ModelTallgrassDouble extends ModelBase {
  constructor([p1 = Math.random()] = [], []) {
    super([], []);

    const textureIndex = Math.floor(p1 * TEXTURES.length);
    this.textures = TEXTURES[textureIndex];

    const offset = [0, 0, 16, 16];
    const bottomPosition = [0, 0, 0];
    const topPosition = [0, 16, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrassDoubleBottom1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'tallgrassDoubleBottom2',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0]
      },
      {
        name: 'tallgrassDoubleTop1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'tallgrassDoubleTop2',
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
// var m; function go() {game.scene.remove(m); m = MODELS.tallgrassDouble(game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
