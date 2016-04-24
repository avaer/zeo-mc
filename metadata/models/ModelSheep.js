"use strict";

const ModelQuadruped = require('./ModelQuadruped');

const NAME = 'sheep';

class ModelSheep extends ModelQuadruped {
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

    const f = 0.5;

    this.meshes = [
      {
        name: 'head',
        uv: [
          [0, 8, 8, 14],
          [14, 8, 22, 14],
          [14, 0, 20, 8],
          [8, 0, 14, 8],
          [22, 8, 28, 14],
          [8, 8, 14, 14],
        ],
        position: [-3, -4, -4],
        dimensions: [6, 6, 6],
        rotationPoint: [0, 6, -8],
        // rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
      {
        name: 'body',
        uv: [
          [28, 14, 34, 30],
          [43, 14, 49, 30],
          [43, 8, 52, 14],
          [34, 8, 43, 14],
          [49, 14, 56, 30],
          [34, 14, 43, 40],
        ],
        position: [-4, -10, -7],
        dimensions: [8, 16, 6],
        rotationPoint: [0, 5, 2],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        name: 'leg1',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [-3, 12, 7],
        // rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
      {
        name: 'leg2',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [3, 12, 7],
        // rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
      {
        name: 'leg3',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [-3, 12, -5],
        // rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
      {
        name: 'leg4',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 6, 4],
        rotationPoint: [3, 12, -5],
        // rotation: [s4 / (180 / Math.PI), s5 / (180 / Math.PI), 0]
      },
    ]
  }
}
ModelSheep.NAME = NAME;
ModelSheep.TEXTURE = 'sheep/sheep';

module.exports = ModelSheep;

/* package net.minecraft.src;

public class ModelSheep1 extends ModelQuadruped
{
    private float field_44016_o;

    public ModelSheep1()
    {
        super(12, 0.0F);
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-3F, -4F, -4F, 6, 6, 6, 0.6F);
        head.setRotationPoint(0.0F, 6F, -8F);
        body = new ModelRenderer(this, 28, 8);
        body.addBox(-4F, -10F, -7F, 8, 16, 6, 1.75F);
        body.setRotationPoint(0.0F, 5F, 2.0F);
        float f = 0.5F;
        leg1 = new ModelRenderer(this, 0, 16);
        leg1.addBox(-2F, 0.0F, -2F, 4, 6, 4, f);
        leg1.setRotationPoint(-3F, 12F, 7F);
        leg2 = new ModelRenderer(this, 0, 16);
        leg2.addBox(-2F, 0.0F, -2F, 4, 6, 4, f);
        leg2.setRotationPoint(3F, 12F, 7F);
        leg3 = new ModelRenderer(this, 0, 16);
        leg3.addBox(-2F, 0.0F, -2F, 4, 6, 4, f);
        leg3.setRotationPoint(-3F, 12F, -5F);
        leg4 = new ModelRenderer(this, 0, 16);
        leg4.addBox(-2F, 0.0F, -2F, 4, 6, 4, f);
        leg4.setRotationPoint(3F, 12F, -5F);
    }

    /**
     * Used for easily adding entity-dependent animations. The second and third float params here are the same second
     * and third as in the setRotationAngles method.
    public void setLivingAnimations(EntityLiving par1EntityLiving, float par2, float par3, float par4)
    {
        super.setLivingAnimations(par1EntityLiving, par2, par3, par4);
        head.rotationPointY = 6F + ((EntitySheep)par1EntityLiving).func_44003_c(par4) * 9F;
        field_44016_o = ((EntitySheep)par1EntityLiving).func_44002_d(par4);
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        super.setRotationAngles(par1, par2, par3, par4, par5, par6);
        head.rotateAngleX = field_44016_o;
    }
} */
