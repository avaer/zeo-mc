import ModelBase from './ModelBase';

const SIZE = 10;

export default class ModelTallgrass extends ModelBase {
  constructor([], []) {
    super([], []);

    const offset = [0, 0, 16, 16];
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.texture = 'blocks/tallgrass';
    this.meshes = [
      {
        name: 'grass1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'grass2',
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
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.tallgrass(game, [], [i, 1]); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += (1 / 50))}, 50);
