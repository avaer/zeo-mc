"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'spider';

class ModelSpider extends ModelBase {
  constructor(p, s) {
    p = p || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;
    const p2 = typeof p[1] !== 'undefined' ? p[1] : 0;
    s = s || [];

    super();

    const i = 15;
    const f = Math.PI / 4;
    const f1 = 0;
    const f2 = 0.3926991;
    const f3 = -(Math.cos(p1 * 0.6662 * 2) * 0.4) * p2;
    const f4 = -(Math.cos(p1 * 0.6662 * 2 + Math.PI) * 0.4) * p2;
    const f5 = -(Math.cos(p1 * 0.6662 * 2 + (Math.PI / 2)) * 0.4) * p2;
    const f6 = -(Math.cos(p1 * 0.6662 * 2 + (Math.PI * 3 / 2)) * 0.4) * p2;
    const f7 = Math.abs(Math.sin(p1 * 0.6662 + 0) * 0.4) * p2;
    const f8 = Math.abs(Math.sin(p1 * 0.6662 + Math.PI) * 0.4) * p2;
    const f9 = Math.abs(Math.sin(p1 * 0.6662 + (Math.PI / 2)) * 0.4) * p2;
    const f10 = Math.abs(Math.sin(p1 * 0.6662 + (Math.PI * 3 / 2)) * 0.4) * p2;

    // const headRotation = [0, 0, 0];

    this.meshes = [
      {
        name: 'head',
        uv: [
          [32, 12, 40, 20],
          [56, 12, 64, 20],
          [48, 4, 56, 12],
          [40, 4, 48, 12],
          [48, 12, 56, 20],
          [40, 12, 48, 20],
        ],
        position: [-4, -4, -8],
        dimensions: [8, 8, 8],
        rotationPoint: [0, 0 + i, -3],
        rotation: [0, 0, 0]
      },
      {
        name: 'neck',
        uv: [
          [0, 6, 6, 12],
          [18, 16, 24, 12],
          [12, 0, 18, 6],
          [6, 0, 12, 6],
          [12, 6, 18, 12],
          [6, 6, 12, 12]
        ],
        position: [-3, -3, -3],
        dimensions: [6, 6, 6],
        rotationPoint: [0, i, 0],
        rotation: [0, 0, 0]
      },
      {
        name: 'body',
        uv: [
          [0, 20, 12, 32],
          [34, 20, 46, 32],
          [23, 12, 34, 20],
          [12, 12, 23, 20],
          [23, 20, 34, 32],
          [12, 20, 23, 32],
        ],
        position: [-5, -4, -6],
        dimensions: [10, 8, 12],
        rotationPoint: [0, i, 9],
        rotation: [0, 0, 0]
      },
      {
        name: 'leg1',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-15, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [-4, 0 + i, 2],
        rotation: [0, f2 * 2 + f1 + f3, -f + f7]
      },
      {
        name: 'leg2',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-1, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [4, 0 + i, 2.0],
        rotation: [0, -f2 * 2 - f1 - f3, f - f7]
      },
      {
        name: 'leg3',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-15, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [-4, 0 + i, 1],
        rotation: [0, f2 * 1 + f1 + f4, -f * 0.74 + f8]
      },
      {
        name: 'leg4',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-1, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [4, 0 + i, 1],
        rotation: [0, -f2 * 1 - f1 - f4, f * 0.74 - f8]
      },
      {
        name: 'leg5',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-15, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [-4, 0 + i, 0],
        rotation: [0, -f2 * 1 + f1 + f5, -f * 0.74 + f9]
      },
      {
        name: 'leg6',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-1, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [4, 0 + i, 0],
        rotation: [0, f2 * 1 - f1 - f5, f * 0.74 - f9]
      },
      {
        name: 'leg7',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-15, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [-4, 0 + i, -1],
        rotation: [0, -f2 * 2 + f1 + f6, -f + f10]
      },
      {
        name: 'leg8',
        uv: [
          [36, 2, 38, 4],
          [18, 2, 20, 4],
          [36, 0, 52, 2],
          [20, 0, 36, 2],
          [20, 2, 36, 4],
          [38, 2, 54, 4],
        ],
        position: [-1, -1, -1],
        dimensions: [16, 2, 2],
        rotationPoint: [4, 0 + i, -1],
        rotation: [0, f2 * 2 - f1 - f6, f - f10]
      },
    ];
  }
}
ModelSpider.NAME = NAME;
ModelSpider.TEXTURE = 'spider/spider';

module.exports = ModelSpider;

/* package net.minecraft.src;

public class ModelSpider extends ModelBase
{
    /** The spider's head box
    public ModelRenderer spiderHead;

    /** The spider's neck box
    public ModelRenderer spiderNeck;

    /** The spider's body box 
    public ModelRenderer spiderBody;

    /** Spider's first leg
    public ModelRenderer spiderLeg1;

    /** Spider's second leg
    public ModelRenderer spiderLeg2;

    /** Spider's third leg
    public ModelRenderer spiderLeg3;

    /** Spider's fourth leg
    public ModelRenderer spiderLeg4;

    /** Spider's fifth leg
    public ModelRenderer spiderLeg5;

    /** Spider's sixth leg
    public ModelRenderer spiderLeg6;

    /** Spider's seventh leg
    public ModelRenderer spiderLeg7;

    /** Spider's eight leg
    public ModelRenderer spiderLeg8;

    public ModelSpider()
    {
        float f = 0.0F;
        int i = 15;
        spiderHead = new ModelRenderer(this, 32, 4);
        spiderHead.addBox(-4F, -4F, -8F, 8, 8, 8, f);
        spiderHead.setRotationPoint(0.0F, 0 + i, -3F);
        spiderNeck = new ModelRenderer(this, 0, 0);
        spiderNeck.addBox(-3F, -3F, -3F, 6, 6, 6, f);
        spiderNeck.setRotationPoint(0.0F, i, 0.0F);
        spiderBody = new ModelRenderer(this, 0, 12);
        spiderBody.addBox(-5F, -4F, -6F, 10, 8, 12, f);
        spiderBody.setRotationPoint(0.0F, 0 + i, 9F);
        spiderLeg1 = new ModelRenderer(this, 18, 0);
        spiderLeg1.addBox(-15F, -1F, -1F, 16, 2, 2, f);
        spiderLeg1.setRotationPoint(-4F, 0 + i, 2.0F);
        spiderLeg2 = new ModelRenderer(this, 18, 0);
        spiderLeg2.addBox(-1F, -1F, -1F, 16, 2, 2, f);
        spiderLeg2.setRotationPoint(4F, 0 + i, 2.0F);
        spiderLeg3 = new ModelRenderer(this, 18, 0);
        spiderLeg3.addBox(-15F, -1F, -1F, 16, 2, 2, f);
        spiderLeg3.setRotationPoint(-4F, 0 + i, 1.0F);
        spiderLeg4 = new ModelRenderer(this, 18, 0);
        spiderLeg4.addBox(-1F, -1F, -1F, 16, 2, 2, f);
        spiderLeg4.setRotationPoint(4F, 0 + i, 1.0F);
        spiderLeg5 = new ModelRenderer(this, 18, 0);
        spiderLeg5.addBox(-15F, -1F, -1F, 16, 2, 2, f);
        spiderLeg5.setRotationPoint(-4F, 0 + i, 0.0F);
        spiderLeg6 = new ModelRenderer(this, 18, 0);
        spiderLeg6.addBox(-1F, -1F, -1F, 16, 2, 2, f);
        spiderLeg6.setRotationPoint(4F, 0 + i, 0.0F);
        spiderLeg7 = new ModelRenderer(this, 18, 0);
        spiderLeg7.addBox(-15F, -1F, -1F, 16, 2, 2, f);
        spiderLeg7.setRotationPoint(-4F, 0 + i, -1F);
        spiderLeg8 = new ModelRenderer(this, 18, 0);
        spiderLeg8.addBox(-1F, -1F, -1F, 16, 2, 2, f);
        spiderLeg8.setRotationPoint(4F, 0 + i, -1F);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);
        spiderHead.render(par7);
        spiderNeck.render(par7);
        spiderBody.render(par7);
        spiderLeg1.render(par7);
        spiderLeg2.render(par7);
        spiderLeg3.render(par7);
        spiderLeg4.render(par7);
        spiderLeg5.render(par7);
        spiderLeg6.render(par7);
        spiderLeg7.render(par7);
        spiderLeg8.render(par7);
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        spiderHead.rotateAngleY = par4 / (180F / (float)Math.PI);
        spiderHead.rotateAngleX = par5 / (180F / (float)Math.PI);
        float f = ((float)Math.PI / 4F);
        spiderLeg1.rotateAngleZ = -f;
        spiderLeg2.rotateAngleZ = f;
        spiderLeg3.rotateAngleZ = -f * 0.74F;
        spiderLeg4.rotateAngleZ = f * 0.74F;
        spiderLeg5.rotateAngleZ = -f * 0.74F;
        spiderLeg6.rotateAngleZ = f * 0.74F;
        spiderLeg7.rotateAngleZ = -f;
        spiderLeg8.rotateAngleZ = f;
        float f1 = -0F;
        float f2 = 0.3926991F;
        spiderLeg1.rotateAngleY = f2 * 2.0F + f1;
        spiderLeg2.rotateAngleY = -f2 * 2.0F - f1;
        spiderLeg3.rotateAngleY = f2 * 1.0F + f1;
        spiderLeg4.rotateAngleY = -f2 * 1.0F - f1;
        spiderLeg5.rotateAngleY = -f2 * 1.0F + f1;
        spiderLeg6.rotateAngleY = f2 * 1.0F - f1;
        spiderLeg7.rotateAngleY = -f2 * 2.0F + f1;
        spiderLeg8.rotateAngleY = f2 * 2.0F - f1;
        float f3 = -(MathHelper.cos(par1 * 0.6662F * 2.0F + 0.0F) * 0.4F) * par2;
        float f4 = -(MathHelper.cos(par1 * 0.6662F * 2.0F + (float)Math.PI) * 0.4F) * par2;
        float f5 = -(MathHelper.cos(par1 * 0.6662F * 2.0F + ((float)Math.PI / 2F)) * 0.4F) * par2;
        float f6 = -(MathHelper.cos(par1 * 0.6662F * 2.0F + ((float)Math.PI * 3F / 2F)) * 0.4F) * par2;
        float f7 = Math.abs(MathHelper.sin(par1 * 0.6662F + 0.0F) * 0.4F) * par2;
        float f8 = Math.abs(MathHelper.sin(par1 * 0.6662F + (float)Math.PI) * 0.4F) * par2;
        float f9 = Math.abs(MathHelper.sin(par1 * 0.6662F + ((float)Math.PI / 2F)) * 0.4F) * par2;
        float f10 = Math.abs(MathHelper.sin(par1 * 0.6662F + ((float)Math.PI * 3F / 2F)) * 0.4F) * par2;
        spiderLeg1.rotateAngleY += f3;
        spiderLeg2.rotateAngleY += -f3;
        spiderLeg3.rotateAngleY += f4;
        spiderLeg4.rotateAngleY += -f4;
        spiderLeg5.rotateAngleY += f5;
        spiderLeg6.rotateAngleY += -f5;
        spiderLeg7.rotateAngleY += f6;
        spiderLeg8.rotateAngleY += -f6;
        spiderLeg1.rotateAngleZ += f7;
        spiderLeg2.rotateAngleZ += -f7;
        spiderLeg3.rotateAngleZ += f8;
        spiderLeg4.rotateAngleZ += -f8;
        spiderLeg5.rotateAngleZ += f9;
        spiderLeg6.rotateAngleZ += -f9;
        spiderLeg7.rotateAngleZ += f10;
        spiderLeg8.rotateAngleZ += -f10;
    }
} */
