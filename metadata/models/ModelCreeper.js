"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'creeper';

class ModelCreeper extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const s1 = typeof s[0] !== 'undefined' ? s[0] : Math.PI * 3 / 4;
    const s2 = typeof s[1] !== 'undefined' ? s[1] : 1;
    const s3 = typeof s[2] !== 'undefined' ? s[2] : 0;
    const s4 = typeof s[3] !== 'undefined' ? s[3] : 0;
    const s5 = typeof s[4] !== 'undefined' ? s[4] : 0;
    const s6 = typeof s[5] !== 'undefined' ? s[5] : 0;

    super();

    const i = 4;

    this.textures = 'entity/creeper/creeper';
    this.meshes = [
      {
        name: 'head',
        uv: [[0, 0, 8, 8]],
        position: [-4, -8, -4],
        dimensions: [8, 8, 8],
        rotationPoint: [0, i, 0],
        rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
      /* {
        name: 'field_1270_b',
        uv: [32, 0],
        position: [-4, -8, -4],
        dimensions: [8, 8, 8]
      }, */
      {
        name: 'body',
        uv: [
          [16, 20, 20, 32],
          [36, 20, 40, 32],
          [20, 16, 28, 20],
          [28, 16, 36, 20],
          [20, 16, 26, 32],
          [26, 20, 32, 32],
        ],
        position: [-4, 0, -2],
        dimensions: [8, 12, 4],
        rotationPoint: [0, i, 0]
      },
      {
        name: 'leg1',
        uv: [
          [0, 20, 4, 26],
          [12, 20, 16, 26],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [8, 20, 12, 26],
          [4, 20, 8, 26],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [-2, 12 + i, 4],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg2',
        uv: [
          [0, 20, 4, 26],
          [12, 20, 16, 26],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [8, 20, 12, 26],
          [4, 20, 8, 26],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [2, 12 + i, 4],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg3',
        uv: [
          [0, 20, 4, 26],
          [12, 20, 16, 26],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [8, 20, 12, 26],
          [4, 20, 8, 26],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [-2, 12 + i, -4],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg4',
        uv: [
          [0, 20, 4, 26],
          [12, 20, 16, 26],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [8, 20, 12, 26],
          [4, 20, 8, 26],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [2, 12 + i, -4],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
    ];
  }
}
ModelCreeper.NAME = NAME;

module.exports = ModelCreeper;

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('creeper', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 11, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

public class ModelCreeper extends ModelBase
{
    public ModelRenderer head;
    public ModelRenderer field_1270_b;
    public ModelRenderer body;
    public ModelRenderer leg1;
    public ModelRenderer leg2;
    public ModelRenderer leg3;
    public ModelRenderer leg4;

    public ModelCreeper()
    {
        this(0.0F);
    }

    public ModelCreeper(float par1)
    {
        int i = 4;
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-4F, -8F, -4F, 8, 8, 8, par1);
        head.setRotationPoint(0.0F, i, 0.0F);
        field_1270_b = new ModelRenderer(this, 32, 0);
        field_1270_b.addBox(-4F, -8F, -4F, 8, 8, 8, par1 + 0.5F);
        field_1270_b.setRotationPoint(0.0F, i, 0.0F);
        body = new ModelRenderer(this, 16, 16);
        body.addBox(-4F, 0.0F, -2F, 8, 12, 4, par1);
        body.setRotationPoint(0.0F, i, 0.0F);
        leg1 = new ModelRenderer(this, 0, 16);
        leg1.addBox(-2F, 0.0F, -2F, 4, 6, 4, par1);
        leg1.setRotationPoint(-2F, 12 + i, 4F);
        leg2 = new ModelRenderer(this, 0, 16);
        leg2.addBox(-2F, 0.0F, -2F, 4, 6, 4, par1);
        leg2.setRotationPoint(2.0F, 12 + i, 4F);
        leg3 = new ModelRenderer(this, 0, 16);
        leg3.addBox(-2F, 0.0F, -2F, 4, 6, 4, par1);
        leg3.setRotationPoint(-2F, 12 + i, -4F);
        leg4 = new ModelRenderer(this, 0, 16);
        leg4.addBox(-2F, 0.0F, -2F, 4, 6, 4, par1);
        leg4.setRotationPoint(2.0F, 12 + i, -4F);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);
        head.render(par7);
        body.render(par7);
        leg1.render(par7);
        leg2.render(par7);
        leg3.render(par7);
        leg4.render(par7);
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        head.rotateAngleY = par4 / (180F / (float)Math.PI);
        head.rotateAngleX = par5 / (180F / (float)Math.PI);
        leg1.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
        leg2.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        leg3.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        leg4.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
    }
} */
