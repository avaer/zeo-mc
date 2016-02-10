import ModelBase from './ModelBase';
import {BIOME_TEXTURES} from '../../constants/index';

function _stages(name, stages) {
  const result = [];
  for (let i = 0; i <= stages; i++) {
    result.push(name + '_stage_' + i);
  }
  return result;
}

function _biomes(name) {
  const result = [];
  BIOME_TEXTURES.forEach(biomeTexture => {
    result.push(name + '_' + biomeTexture);
  });
  return result;
}

const TEXTURES = [].concat(
  _stages('carrots', 3)
).concat([
  'deadbush'
]).concat(
  _biomes('fern')
).concat([
  'flower_allium',
  'flower_blue_orchid',
  'flower_dandelion',
  'flower_houstonia',
  'flower_oxeye_daisy',
  'flower_paeonia',
  'flower_rose',
  'flower_tulip_orange',
  'flower_tulip_pink',
  'flower_tulip_red',
  'flower_tulip_white'
]).concat(
  _biomes('melon_stem_connected'),
  _biomes('melon_stem_disconnected')
).concat([
  'mushroom_brown',
  'mushroom_red',
]).concat(
  _biomes('pumpkin_stem_connected'),
  _biomes('pumpkin_stem_disconnected')
).concat([
  'sapling_acacia',
  'sapling_birch',
  'sapling_jungle',
  'sapling_oak',
  'sapling_roofed_oak',
  'sapling_spruce'
]);

const SIZE = 10;

export default class ModelCross extends ModelBase {
  constructor([p1 = Math.random()] = [], []) {
    super([], []);

    const textureIndex = Math.floor(p1 * TEXTURES.length);
    this.texture = TEXTURES[textureIndex];

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
// var m; function go() {game.scene.remove(m); m = MODELS.cross(game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
