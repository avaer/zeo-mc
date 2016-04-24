"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'bat';

class ModelBat extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;
    const p2 = typeof p[1] !== 'undefined' ? p[1] : 0;
    const p3 = typeof p[2] !== 'undefined' ? p[2] : 0;
    const p4 = typeof p[3] !== 'undefined' ? p[3] : 0;
    const p5 = typeof p[4] !== 'undefined' ? p[4] : 0;
    const p6 = typeof p[5] !== 'undefined' ? p[5] : 0;
    const s1 = typeof s[0] !== 'undefined' ? s[0] : Math.PI * 3 / 4;
    const s2 = typeof s[1] !== 'undefined' ? s[1] : 1;
    const s3 = typeof s[2] !== 'undefined' ? s[2] : 0;
    const s4 = typeof s[3] !== 'undefined' ? s[3] : 0;
    const s5 = typeof s[4] !== 'undefined' ? s[4] : 0;
    const s6 = typeof s[5] !== 'undefined' ? s[5] : 0;

    super();

    const bodyRotation = [(Math.PI / 4) + Math.cos(p4 * 0.1) * 0.15, 0, 0];
    const rightWingRotation = [0, Math.cos(p4 * 1.3) * Math.PI * 0.25, 0];
    const leftWingRotation = [0, -rightWingRotation[1], 0];

    // XXX mirror support

    this.meshes = [
      {
        name: 'head',
        uv: [[0, 0, 6, 6]],
        position: [-3, -3, -3],
        dimensions: [6, 6, 6],
        rotationPoint: [0, 0, 0],
        rotation: [p6 / (180 / Math.PI), p5 / (180 / Math.PI), 0],
        children: [
          {
            name: 'ear1',
            uv: [
              [24, 1, 25, 5],
              [31, 1, 32, 5],
              [28, 0, 31, 1],
              [25, 0, 28, 1],
              [28, 1, 31, 5],
              [25, 1, 28, 5],
            ],
            position: [-4, -6, -2],
            dimensions: [3, 4, 1]
          },
          {
            name: 'ear2',
            uv: [
              [24, 1, 25, 5],
              [31, 1, 32, 5],
              [28, 0, 31, 1],
              [25, 0, 28, 1],
              [28, 1, 31, 5],
              [25, 1, 28, 5],
            ],
            position: [1, -6, -2],
            dimensions: [3, 4, 1],
            mirror: true
          },
        ]
      },
      {
        name: 'body',
        uv: [
          [0, 22, 6, 34],
          [12, 22, 18, 34],
          [12, 16, 18, 22],
          [6, 16, 12, 22],
          [18, 22, 24, 34],
          [6, 22, 12, 34]
        ],
        position: [-3, 4, -3],
        dimensions: [6, 12, 6],
        rotationPoint: [0, 0, 0],
        rotation: bodyRotation,
        children: [
          {
            name: 'rightWing',
            uv: [
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [43, 1, 53, 17],
            ],
            position: [-12, 1, 1.5],
            dimensions: [10, 16, 1],
            rotationPoint: [0, 0, 0],
            rotation: rightWingRotation,
            // rotation: [bodyRotation[0], 0, 0],
            children: [
              {
                name: 'rightWingOuter',
                uv: [
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [25, 17, 33, 28],
                ],
                position: [-8, 1, 0],
                dimensions: [8, 12, 1],
                rotationPoint: [-12, 1, 1.5],
                rotation: [0, rightWingRotation[1] * 0.5, 0]
              }
            ]
          },
          {
            name: 'leftWing',
            uv: [
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [42, 0, 43, 17],
              [43, 1, 53, 17],
            ],
            position: [2, 1, 1.5],
            dimensions: [10, 16, 1],
            rotationPoint: [0, 0, 0],
            rotation: leftWingRotation,
            // rotation: [bodyRotation[0], 0, 0],
            mirror: true,
            children: [
              {
                name: 'leftWingOuter',
                uv: [
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [24, 17, 25, 28],
                  [25, 17, 33, 28],
                ],
                position: [0, 1, 0],
                dimensions: [8, 12, 1],
                rotationPoint: [12, 1, 1.5],
                rotation: [0, -rightWingRotation[1] * 0.5, 0],
                mirror: true
              }
            ]
          },
          {
            name: 'feet',
            uv: [
              [0, 37, 3, 41],
              [0, 37, 3, 41],
              [0, 37, 3, 41],
              [0, 37, 3, 41],
              [3, 35, 9, 41],
              [0, 37, 3, 41],
            ],
            position: [-5, 16, 0],
            dimensions: [10, 6, 1],
          },
        ]
      },
    ]
  }
}
ModelBat.NAME = NAME;
ModelBat.TEXTURE = 'bat';

module.exports = ModelBat;

/* package net.minecraft.src;

public class ModelBat extends ModelBase
{
    private ModelRenderer batHead;

    /** The body box of the bat model.
    private ModelRenderer batBody;

    /** The inner right wing box of the bat model.
    private ModelRenderer batRightWing;

    /** The inner left wing box of the bat model.
    private ModelRenderer batLeftWing;

    /** The outer right wing box of the bat model.
    private ModelRenderer batOuterRightWing;

    /** The outer left wing box of the bat model.
    private ModelRenderer batOuterLeftWing;

    public ModelBat()
    {
        this.textureWidth = 64;
        this.textureHeight = 64;
        this.batHead = new ModelRenderer(this, 0, 0);
        this.batHead.addBox(-3.0F, -3.0F, -3.0F, 6, 6, 6);
        ModelRenderer var1 = new ModelRenderer(this, 24, 0);
        var1.addBox(-4.0F, -6.0F, -2.0F, 3, 4, 1);
        this.batHead.addChild(var1);
        ModelRenderer var2 = new ModelRenderer(this, 24, 0);
        var2.mirror = true;
        var2.addBox(1.0F, -6.0F, -2.0F, 3, 4, 1);
        this.batHead.addChild(var2);
        this.batBody = new ModelRenderer(this, 0, 16);
        this.batBody.addBox(-3.0F, 4.0F, -3.0F, 6, 12, 6);
        this.batBody.setTextureOffset(0, 34).addBox(-5.0F, 16.0F, 0.0F, 10, 6, 1);
        this.batRightWing = new ModelRenderer(this, 42, 0);
        this.batRightWing.addBox(-12.0F, 1.0F, 1.5F, 10, 16, 1);
        this.batOuterRightWing = new ModelRenderer(this, 24, 16);
        this.batOuterRightWing.setRotationPoint(-12.0F, 1.0F, 1.5F);
        this.batOuterRightWing.addBox(-8.0F, 1.0F, 0.0F, 8, 12, 1);
        this.batLeftWing = new ModelRenderer(this, 42, 0);
        this.batLeftWing.mirror = true;
        this.batLeftWing.addBox(2.0F, 1.0F, 1.5F, 10, 16, 1);
        this.batOuterLeftWing = new ModelRenderer(this, 24, 16);
        this.batOuterLeftWing.mirror = true;
        this.batOuterLeftWing.setRotationPoint(12.0F, 1.0F, 1.5F);
        this.batOuterLeftWing.addBox(0.0F, 1.0F, 0.0F, 8, 12, 1);
        this.batBody.addChild(this.batRightWing);
        this.batBody.addChild(this.batLeftWing);
        this.batRightWing.addChild(this.batOuterRightWing);
        this.batLeftWing.addChild(this.batOuterLeftWing);
    }

    /**
     * not actually sure this is size, is not used as of now, but the model would be recreated if the value changed and
     * it seems a good match for a bats size
    public int getBatSize()
    {
        return 36;
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        EntityBat var8 = (EntityBat)par1Entity;

        if (var8.getIsBatHanging())
        {
            this.batHead.rotateAngleX = par6 / (180F / (float)Math.PI);
            this.batHead.rotateAngleY = (float)Math.PI - par5 / (180F / (float)Math.PI);
            this.batHead.rotateAngleZ = (float)Math.PI;
            this.batHead.setRotationPoint(0.0F, -2.0F, 0.0F);
            this.batRightWing.setRotationPoint(-3.0F, 0.0F, 3.0F);
            this.batLeftWing.setRotationPoint(3.0F, 0.0F, 3.0F);
            this.batBody.rotateAngleX = (float)Math.PI;
            this.batRightWing.rotateAngleX = -0.15707964F;
            this.batRightWing.rotateAngleY = -((float)Math.PI * 2F / 5F);
            this.batOuterRightWing.rotateAngleY = -1.7278761F;
            this.batLeftWing.rotateAngleX = this.batRightWing.rotateAngleX;
            this.batLeftWing.rotateAngleY = -this.batRightWing.rotateAngleY;
            this.batOuterLeftWing.rotateAngleY = -this.batOuterRightWing.rotateAngleY;
        }
        else
        {
            this.batHead.rotateAngleX = par6 / (180F / (float)Math.PI);
            this.batHead.rotateAngleY = par5 / (180F / (float)Math.PI);
            this.batHead.rotateAngleZ = 0.0F;
            this.batHead.setRotationPoint(0.0F, 0.0F, 0.0F);
            this.batRightWing.setRotationPoint(0.0F, 0.0F, 0.0F);
            this.batLeftWing.setRotationPoint(0.0F, 0.0F, 0.0F);
            this.batBody.rotateAngleX = ((float)Math.PI / 4F) + MathHelper.cos(par4 * 0.1F) * 0.15F;
            this.batBody.rotateAngleY = 0.0F;
            this.batRightWing.rotateAngleY = MathHelper.cos(par4 * 1.3F) * (float)Math.PI * 0.25F;
            this.batLeftWing.rotateAngleY = -this.batRightWing.rotateAngleY;
            this.batOuterRightWing.rotateAngleY = this.batRightWing.rotateAngleY * 0.5F;
            this.batOuterLeftWing.rotateAngleY = -this.batRightWing.rotateAngleY * 0.5F;
        }

        this.batHead.render(par7);
        this.batBody.render(par7);
    }
} */
