import ModelBase from './ModelBase';
import {BIOME_TEXTURES} from '../../constants/index';

const TEXTURES = BIOME_TEXTURES.map(biomeTexture => 'tallgrass_' + biomeTexture);
const SIZE = 10;

export default class ModelTallgrass extends ModelBase {
  constructor([p1 = Math.random()] = [], []) {
    super([], []);

    const textureIndex = Math.floor(p1 * TEXTURES.length);
    this.texture = TEXTURES[textureIndex];

    const offset = [0, 0, 16, 16];
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrass1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'tallgrass2',
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
// var m; function go() {game.scene.remove(m); m = MODELS.tallgrass(game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
