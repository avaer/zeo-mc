const ModelBase = require('./ModelBase');

const NAME = 'chest';

const OFFSET = 8;

class ModelChest extends ModelBase {
  static NAME = NAME;

  constructor([], [s1 = Math.PI * (2 + 1/4), s2 = 1] = []) {
    super([], [s1, s2]);

    const chestLidRotation = [(Math.PI * 1.75) - Math.sin(s1 * 0.6662) * (s2 * (Math.PI / 4)), 0, 0];

    this.textures = 'entity/chest/normal';
    this.meshes = [
      {
        name: 'chestLid',
        uv: [
          [0, 14, 14, 19],
          [28, 14, 42, 19],
          [14, 0, 28, 14],
          [28, 0, 42, 14],
          [28, 14, 42, 19],
          [14, 14, 28, 19],
        ],
        position: [0 - OFFSET, -5, -14 - OFFSET],
        dimensions: [14, 5, 14],
        rotationPoint: [1, 7, 15],
        rotation: chestLidRotation
      },
      {
        name: 'chestKnob',
        uv: [
          [0, 1, 1, 5],
          [6, 1, 6, 5],
          [3, 1, 5, 5],
          [1, 1, 3, 5],
          [3, 0, 5, 1],
          [1, 0, 3, 1],
        ],
        position: [-1 - OFFSET, -2, -15 - OFFSET],
        dimensions: [2, 4, 1],
        rotationPoint: [8, 7, 15],
        rotation: chestLidRotation
      },
      {
        name: 'chestBelow',
        uv: [
          [0, 33, 14, 43],
          [28, 33, 42, 43],
          [28, 19, 42, 33],
          [14, 19, 28, 33],
          [42, 33, 56, 43],
          [14, 33, 28, 43],
        ],
        position: [0 - OFFSET, 0, 0 - OFFSET],
        dimensions: [14, 10, 14],
        rotationPoint: [1, 6, 1]
      },
    ]
  }
}

module.exports = ModelChest;

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('chest', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

public class ModelChest extends ModelBase
{
    /** The chest lid in the chest's model.
    public ModelRenderer chestLid;

    /** The model of the bottom of the chest.
    public ModelRenderer chestBelow;

    /** The chest's knob in the chest model.
    public ModelRenderer chestKnob;

    public ModelChest()
    {
        chestLid = (new ModelRenderer(this, 0, 0)).setTextureSize(64, 64);
        chestLid.addBox(0.0F, -5F, -14F, 14, 5, 14, 0.0F);
        chestLid.rotationPointX = 1.0F;
        chestLid.rotationPointY = 7F;
        chestLid.rotationPointZ = 15F;
        chestKnob = (new ModelRenderer(this, 0, 0)).setTextureSize(64, 64);
        chestKnob.addBox(-1F, -2F, -15F, 2, 4, 1, 0.0F);
        chestKnob.rotationPointX = 8F;
        chestKnob.rotationPointY = 7F;
        chestKnob.rotationPointZ = 15F;
        chestBelow = (new ModelRenderer(this, 0, 19)).setTextureSize(64, 64);
        chestBelow.addBox(0.0F, 0.0F, 0.0F, 14, 10, 14, 0.0F);
        chestBelow.rotationPointX = 1.0F;
        chestBelow.rotationPointY = 6F;
        chestBelow.rotationPointZ = 1.0F;
    }

    /**
     * This method renders out all parts of the chest model.
    public void renderAll()
    {
        chestKnob.rotateAngleX = chestLid.rotateAngleX;
        chestLid.render(0.0625F);
        chestKnob.render(0.0625F);
        chestBelow.render(0.0625F);
    }
} */
