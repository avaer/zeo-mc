const PlaneTallgrassDouble = require('./PlaneTallgrassDouble');

const NAME ='tallgrassDoubleSunflower';

const MATERIALS = [
  [
    'double_plant_sunflower_bottom',
    'double_plant_sunflower_top',
    'double_plant_sunflower_back',
    'double_plant_sunflower_front',
  ]
];

const SIZE = 1;

class PlaneTallgrassDoubleSunflower extends PlaneTallgrassDouble {
  static NAME = NAME;
  static MATERIALS = MATERIALS;

  constructor([], []) {
    super([], []);

    const materialIndex = 0;
    this.materials = MATERIALS[materialIndex];

    const bottomOffset = [0, 0, 16, 16];
    const topOffset = [0, 6, 16, 16];
    const flowerOffset = [4, 4, 12, 12];
    const bottomPosition = [0, 0, 0];
    const topPosition = [0, SIZE * ((16 - 6) / 16), 0];
    const flowerBackPosition = [0, SIZE - 3.7, 0];
    const flowerFrontPosition = [0, SIZE - 3.7, 0];
    const bottomDimensions = [SIZE, SIZE, 0];
    const topDimensions = [SIZE, SIZE * ((16 - 6) / 16), 0];
    const flowerDimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrassDoubleSunflowerBottom1',
        offset: bottomOffset,
        position: bottomPosition,
        dimensions: bottomDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        materialIndex: 0
      },
      {
        name: 'tallgrassDoubleSunflowerBottom2',
        offset: bottomOffset,
        position: bottomPosition,
        dimensions: bottomDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        materialIndex: 0
      },
      {
        name: 'tallgrassDoubleSunflowerTop1',
        offset: topOffset,
        position: topPosition,
        dimensions: topDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0],
        materialIndex: 1
      },
      {
        name: 'tallgrassDoubleSunflowerTop2',
        offset: topOffset,
        position: topPosition,
        dimensions: topDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0],
        materialIndex: 1
      },
      {
        name: 'tallgrassDoubleSunflowerTopBack',
        // offset: flowerOffset,
        offset: bottomOffset,
        position: flowerBackPosition,
        dimensions: flowerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI, 0],
        materialIndex: 2,
        oneSided: true
      },
      {
        name: 'tallgrassDoubleSunflowerTopFront',
        // offset: flowerOffset,
        offset: bottomOffset,
        position: flowerFrontPosition,
        dimensions: flowerDimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, 0, 0],
        materialIndex: 3,
        oneSided: true
      },
    ]
  }
}

module.exports = PlaneTallgrassDoubleSunflower;

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('tallgrassDoubleSunflower', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
