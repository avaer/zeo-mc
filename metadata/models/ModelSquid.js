"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'squid';

class ModelSquid extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];

    super();

    const byte0 = -16;

    this.meshes = [
      {
        name: 'body',
        uv: [
          [0, 12, 12, 28],
          [36, 12, 48, 28],
          [24, 0, 36, 12],
          [12, 0, 24, 12],
          [24, 12, 36, 28],
          [12, 12, 24, 28],
        ],
        position: [-6, -8, -6],
        dimensions: [12, 16, 12],
        rotationPoint: [0, 0 + i, -3],
        rotation: [0, 24 + byte0, 0]
      },
    ].concat((() => {
      const tentacles = Array(8);
      for (let i = 0; i < tentacles.length; i++) {
        const d = (i * Math.PI * 2) / tentacles.length;
        const f = Math.cos(d) * 5;
        const f1 = Math.sin(d) * 5;
        const d2 = (i * Math.PI * -2) / tentacles.length + (Math.PI / 2);

        tentacles[i] = {
          name: 'body',
          uv: [
            [48, 2, 50, 20],
            [54, 2, 56, 20],
            [52, 0, 54, 2],
            [50, 0, 52, 2],
            [52, 2, 54, 20],
            [50, 2, 52, 20],
          ],
          position: [-1, 0, -1],
          dimensions: [2, 18, 2],
          rotationPoint: [f, 31 + byte0, f1],
          rotation: [0, d2, 0]
        };
      }
      return tentacles;
    })());
  }
}
ModelSquid.NAME = NAME;
ModelSquid.TEXTURE = 'squid';

module.exports = ModelSquid;

/* package net.minecraft.src;

public class ModelSquid extends ModelBase
{
    /** The squid's body
    ModelRenderer squidBody;
    ModelRenderer squidTentacles[];

    public ModelSquid()
    {
        squidTentacles = new ModelRenderer[8];
        byte byte0 = -16;
        squidBody = new ModelRenderer(this, 0, 0);
        squidBody.addBox(-6F, -8F, -6F, 12, 16, 12);
        squidBody.rotationPointY += 24 + byte0;

        for (int i = 0; i < squidTentacles.length; i++)
        {
            squidTentacles[i] = new ModelRenderer(this, 48, 0);
            double d = ((double)i * Math.PI * 2D) / (double)squidTentacles.length;
            float f = (float)Math.cos(d) * 5F;
            float f1 = (float)Math.sin(d) * 5F;
            squidTentacles[i].addBox(-1F, 0.0F, -1F, 2, 18, 2);
            squidTentacles[i].rotationPointX = f;
            squidTentacles[i].rotationPointZ = f1;
            squidTentacles[i].rotationPointY = 31 + byte0;
            d = ((double)i * Math.PI * -2D) / (double)squidTentacles.length + (Math.PI / 2D);
            squidTentacles[i].rotateAngleY = (float)d;
        }
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        for (int i = 0; i < squidTentacles.length; i++)
        {
            squidTentacles[i].rotateAngleX = par3;
        }
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);
        squidBody.render(par7);

        for (int i = 0; i < squidTentacles.length; i++)
        {
            squidTentacles[i].render(par7);
        }
    }
} */
