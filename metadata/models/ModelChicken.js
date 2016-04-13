"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'chicken';

class ModelChicken extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const s1 = typeof s[0] !== 'undefined' ? s[0] : Math.PI * 3 / 4;
    const s2 = typeof s[1] !== 'undefined' ? s[1] : 1;
    const s3 = typeof s[2] !== 'undefined' ? s[2] : 0;
    const s4 = typeof s[3] !== 'undefined' ? s[3] : 0;
    const s5 = typeof s[4] !== 'undefined' ? s[4] : 0;

    super();

    const headRotation = [0, 0, 0];//[-(s5 / (180 / Math.PI)), s4 / (180 / Math.PI), 0];

    this.meshes = [
      {
        name: 'head',
        uv: [
          [0, 3, 3, 9],
          [7, 3, 10, 9],
          [3, 0, 7, 3],
          [3, 0, 7, 3],
          [10, 3, 14, 9],
          [3, 3, 7, 9],
        ],
        position: [-2, -6, -2],
        dimensions: [4, 6, 3],
        rotationPoint: [0, -1, -4],
        rotation: headRotation
      },
      {
        name: 'bill',
        uv: [
          [14, 2, 16, 4],
          [20, 2, 22, 4],
          [20, 0, 24, 2],
          [16, 0, 20, 2],
          [22, 2, 26, 4],
          [16, 2, 20, 4],
        ],
        position: [-2, -4, -4],
        dimensions: [4, 2, 2],
        rotationPoint: [0, -1, -4],
        rotation: headRotation
      },
      {
        name: 'chin',
        uv: [
          [14, 6, 16, 8],
          [20, 6, 22, 8],
          [16, 4, 20, 6],
          [16, 4, 20, 6],
          [16, 6, 20, 8],
          [16, 6, 20, 8],
        ],
        position: [-1, -2, -3],
        dimensions: [2, 2, 2],
        rotationPoint: [0, -1, -4],
        rotation: headRotation
      },
      {
        name: 'body',
        uv: [
          [0, 15, 6, 23],
          [18, 15, 24, 23],
          [6, 9, 12, 15],
          [12, 9, 18, 15],
          [6, 15, 12, 23],
          [12, 15, 18, 23],
        ],
        position: [-3, -4, -3],
        dimensions: [6, 8, 6],
        rotationPoint: [0, 0, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        name: 'rightLeg',
        uv: [
          [32, 0, 33, 1],
          [32, 0, 33, 1],
          [32, 0, 35, 3],
          [32, 0, 33, 1],
          [35, 3, 38, 8],
          [32, 0, 33, 1],
        ],
        position: [-1, 0.0, -3],
        dimensions: [3, 5, 3],
        rotationPoint: [-2, 3, 1],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leftLeg',
        uv: [
          [32, 0, 33, 1],
          [32, 0, 33, 1],
          [32, 0, 35, 3],
          [32, 0, 33, 1],
          [35, 3, 38, 8],
          [32, 0, 33, 1],
        ],
        position: [-1, 0, -3],
        dimensions: [3, 5, 3],
        rotationPoint: [1, 3, 1],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'rightWing',
        uv: [
          [24, 19, 31, 23],
          [24, 19, 31, 23],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
        ],
        position: [0, 0, -3],
        dimensions: [1, 4, 6],
        rotationPoint: [-4, -3, 0],
        rotation: [s3, 0, 0]
      },
      {
        name: 'leftWing',
        uv: [
          [24, 19, 31, 23],
          [24, 19, 31, 23],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
          [30, 13, 32, 19],
        ],
        position: [-1, 0, -3],
        dimensions: [1, 4, 6],
        rotationPoint: [4, -3, 0],
        rotation: [s3, 0, 0]
      },
    ]
  }
}
ModelChicken.NAME = NAME;
ModelChicken.TEXTURE = 'chicken';

module.exports = ModelChicken;

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('chicken', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 11, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

import org.lwjgl.opengl.GL11;

public class ModelChicken extends ModelBase
{
    public ModelRenderer head;
    public ModelRenderer body;
    public ModelRenderer rightLeg;
    public ModelRenderer leftLeg;
    public ModelRenderer rightWing;
    public ModelRenderer leftWing;
    public ModelRenderer bill;
    public ModelRenderer chin;

    public ModelChicken()
    {
        byte byte0 = 16;
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-2F, -6F, -2F, 4, 6, 3, 0.0F);
        head.setRotationPoint(0.0F, -1 + byte0, -4F);
        bill = new ModelRenderer(this, 14, 0);
        bill.addBox(-2F, -4F, -4F, 4, 2, 2, 0.0F);
        bill.setRotationPoint(0.0F, -1 + byte0, -4F);
        chin = new ModelRenderer(this, 14, 4);
        chin.addBox(-1F, -2F, -3F, 2, 2, 2, 0.0F);
        chin.setRotationPoint(0.0F, -1 + byte0, -4F);
        body = new ModelRenderer(this, 0, 9);
        body.addBox(-3F, -4F, -3F, 6, 8, 6, 0.0F);
        body.setRotationPoint(0.0F, 0 + byte0, 0.0F);
        rightLeg = new ModelRenderer(this, 26, 0);
        rightLeg.addBox(-1F, 0.0F, -3F, 3, 5, 3);
        rightLeg.setRotationPoint(-2F, 3 + byte0, 1.0F);
        leftLeg = new ModelRenderer(this, 26, 0);
        leftLeg.addBox(-1F, 0.0F, -3F, 3, 5, 3);
        leftLeg.setRotationPoint(1.0F, 3 + byte0, 1.0F);
        rightWing = new ModelRenderer(this, 24, 13);
        rightWing.addBox(0.0F, 0.0F, -3F, 1, 4, 6);
        rightWing.setRotationPoint(-4F, -3 + byte0, 0.0F);
        leftWing = new ModelRenderer(this, 24, 13);
        leftWing.addBox(-1F, 0.0F, -3F, 1, 4, 6);
        leftWing.setRotationPoint(4F, -3 + byte0, 0.0F);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);

        if (isChild)
        {
            float f = 2.0F;
            GL11.glPushMatrix();
            GL11.glTranslatef(0.0F, 5F * par7, 2.0F * par7);
            head.render(par7);
            bill.render(par7);
            chin.render(par7);
            GL11.glPopMatrix();
            GL11.glPushMatrix();
            GL11.glScalef(1.0F / f, 1.0F / f, 1.0F / f);
            GL11.glTranslatef(0.0F, 24F * par7, 0.0F);
            body.render(par7);
            rightLeg.render(par7);
            leftLeg.render(par7);
            rightWing.render(par7);
            leftWing.render(par7);
            GL11.glPopMatrix();
        }
        else
        {
            head.render(par7);
            bill.render(par7);
            chin.render(par7);
            body.render(par7);
            rightLeg.render(par7);
            leftLeg.render(par7);
            rightWing.render(par7);
            leftWing.render(par7);
        }
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        head.rotateAngleX = -(par5 / (180F / (float)Math.PI));
        head.rotateAngleY = par4 / (180F / (float)Math.PI);
        bill.rotateAngleX = head.rotateAngleX;
        bill.rotateAngleY = head.rotateAngleY;
        chin.rotateAngleX = head.rotateAngleX;
        chin.rotateAngleY = head.rotateAngleY;
        body.rotateAngleX = ((float)Math.PI / 2F);
        rightLeg.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
        leftLeg.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        rightWing.rotateAngleZ = par3;
        leftWing.rotateAngleZ = -par3;
    }
} */
