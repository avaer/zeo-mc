"use strict";

const ModelBase = require('./ModelBase');

class ModelBiped extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;
    const p2 = typeof p[1] !== 'undefined' ? p[1] : 0;
    const p3 = typeof p[2] !== 'undefined' ? p[2] : 0;
    const p4 = typeof p[3] !== 'undefined' ? p[3] : 0;
    const p5 = typeof p[4] !== 'undefined' ? p[4] : 0;
    const p6 = typeof p[5] !== 'undefined' ? p[5] : 0;

    super();

    const headRotation = [p5 / (180 / Math.PI), p4 / (180 / Math.PI), 0];

    const onGround = 0;
    const f = onGround;
    let f0 = 1.0 - onGround;
    f0 *= f0;
    f0 *= f0;
    f0 = 1.0 - f0;
    const f2 = Math.sin(f0 * Math.PI);
    const f4 = Math.sin(onGround * Math.PI) * -(headRotation[0] - 0.7) * 0.75;

    const bodyRotation = [0, Math.sin(Math.sqrt(f) * Math.PI * 2.0) * 0.2, 0];

    this.meshes = [
      /* {
        name: 'cloak',
        uv: [[0, 0, 8, 8]],
        position: [-5, 0, -1],
        dimensions: [10, 16, 1],
        rotationPoint: [0, 18 - p1, -6],
      }, */
      /* {
        name: 'ears',
        uv: [[0, 0, 8, 8]],
        position: [-3, -6, -1],
        dimensions: [6, 6, 1],
        // rotationPoint: [0, 18 - p1, -6],
      }, */
      {
        name: 'head',
        uv: [[0, 0, 8, 8]],
        position: [-4, -8, -4],
        dimensions: [8, 8, 8],
        rotationPoint: [0, p2, 0],
        rotation: headRotation
      },
      /* {
        name: 'headwear',
        uv: [[0, 0, 8, 8]],
        position: [-4, -8, -4],
        dimensions: [8, 8, 8],
        rotationPoint: [0, p2, 0],
        rotation: headRotation
      }, */
      {
        name: 'body',
        uv: [
          [16, 20, 20, 32],
          [28, 20, 32, 32],
          [28, 16, 36, 20],
          [20, 16, 28, 20],
          [32, 20, 40, 32],
          [20, 20, 28, 32],
        ],
        position: [-4, 0, -2],
        dimensions: [8, 12, 4],
        rotationPoint: [0, p2, 0],
        rotation: bodyRotation
      },
      {
        name: 'rightArm',
        uv: [
          [40, 20, 44, 32],
          [48, 20, 52, 32],
          [48, 16, 52, 20],
          [44, 16, 48, 20],
          [52, 20, 56, 32],
          [44, 20, 48, 32],
        ],
        position: [-3, -2, -2],
        dimensions: [4, 12, 4],
        rotationPoint: [-Math.cos(bodyRotation[1]) * 5, 2 + p2, Math.sin(bodyRotation[1]) * 5],
        rotation: [(Math.cos(p1 * 0.6662 + Math.PI) * 2 * p2 * 0.5) + (Math.sin(p3 * 0.067) * 0.05) - (f2 * 1.2 + f4), bodyRotation[1] + bodyRotation[1] * 2, Math.sin(onGround * Math.PI) * -0.4]
      },
      {
        name: 'leftArm',
        uv: [
          [40, 20, 44, 32],
          [48, 20, 52, 32],
          [48, 16, 52, 20],
          [44, 16, 48, 20],
          [52, 20, 56, 32],
          [44, 20, 48, 32],
        ],
        position: [-1, -2, -2],
        dimensions: [4, 12, 4],
        rotationPoint: [Math.cos(bodyRotation[1]) * 5, 2 + p2, -Math.sin(bodyRotation[1]) * 5],
        rotation: [(Math.cos(p1 * 0.6662) * 2 * p2 * 0.5) - (Math.sin(p3 * 0.067) * 0.05) + bodyRotation[1], bodyRotation[1], -Math.cos(p3 * 0.09) * 0.05 + 0.05]
      },
      {
        name: 'rightLeg',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 12, 4],
        rotationPoint: [-2, 12 + p2, 0],
        rotation: [Math.cos(p1 * 0.6662) * 1.4 * p2, 0, 0]
      },
      {
        name: 'leftLeg',
        uv: [
          [0, 20, 4, 32],
          [8, 20, 12, 32],
          [8, 16, 12, 20],
          [4, 16, 8, 20],
          [12, 20, 16, 32],
          [4, 20, 8, 32],
        ],
        position: [-2, 0, -2],
        dimensions: [4, 12, 4],
        rotationPoint: [2, 12 + p2, 0],
        rotation: [Math.cos(p1 * 0.6662 + Math.PI) * 1.4 * p2, 0, 0]
      },
    ];
  }
}

module.exports = ModelBiped;

/* package net.minecraft.src;

public class ModelBiped extends ModelBase
{
    public ModelRenderer bipedHead;
    public ModelRenderer bipedHeadwear;
    public ModelRenderer bipedBody;
    public ModelRenderer bipedRightArm;
    public ModelRenderer bipedLeftArm;
    public ModelRenderer bipedRightLeg;
    public ModelRenderer bipedLeftLeg;
    public ModelRenderer bipedEars;
    public ModelRenderer bipedCloak;

    /**
     * Records whether the model should be rendered holding an item in the left hand, and if that item is a block.
    public int heldItemLeft;

    /**
     * Records whether the model should be rendered holding an item in the right hand, and if that item is a block.
    public int heldItemRight;
    public boolean isSneak;

    /** Records whether the model should be rendered aiming a bow.
    public boolean aimedBow;

    public ModelBiped()
    {
        this(0.0F);
    }

    public ModelBiped(float par1)
    {
        this(par1, 0.0F);
    }

    public ModelBiped(float par1, float par2)
    {
        heldItemLeft = 0;
        heldItemRight = 0;
        isSneak = false;
        aimedBow = false;
        bipedCloak = new ModelRenderer(this, 0, 0);
        bipedCloak.addBox(-5F, 0.0F, -1F, 10, 16, 1, par1);
        bipedEars = new ModelRenderer(this, 24, 0);
        bipedEars.addBox(-3F, -6F, -1F, 6, 6, 1, par1);
        bipedHead = new ModelRenderer(this, 0, 0);
        bipedHead.addBox(-4F, -8F, -4F, 8, 8, 8, par1);
        bipedHead.setRotationPoint(0.0F, 0.0F + par2, 0.0F);
        bipedHeadwear = new ModelRenderer(this, 32, 0);
        bipedHeadwear.addBox(-4F, -8F, -4F, 8, 8, 8, par1 + 0.5F);
        bipedHeadwear.setRotationPoint(0.0F, 0.0F + par2, 0.0F);
        bipedBody = new ModelRenderer(this, 16, 16);
        bipedBody.addBox(-4F, 0.0F, -2F, 8, 12, 4, par1);
        bipedBody.setRotationPoint(0.0F, 0.0F + par2, 0.0F);
        bipedRightArm = new ModelRenderer(this, 40, 16);
        bipedRightArm.addBox(-3F, -2F, -2F, 4, 12, 4, par1);
        bipedRightArm.setRotationPoint(-5F, 2.0F + par2, 0.0F);
        bipedLeftArm = new ModelRenderer(this, 40, 16);
        bipedLeftArm.mirror = true;
        bipedLeftArm.addBox(-1F, -2F, -2F, 4, 12, 4, par1);
        bipedLeftArm.setRotationPoint(5F, 2.0F + par2, 0.0F);
        bipedRightLeg = new ModelRenderer(this, 0, 16);
        bipedRightLeg.addBox(-2F, 0.0F, -2F, 4, 12, 4, par1);
        bipedRightLeg.setRotationPoint(-2F, 12F + par2, 0.0F);
        bipedLeftLeg = new ModelRenderer(this, 0, 16);
        bipedLeftLeg.mirror = true;
        bipedLeftLeg.addBox(-2F, 0.0F, -2F, 4, 12, 4, par1);
        bipedLeftLeg.setRotationPoint(2.0F, 12F + par2, 0.0F);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);
        bipedHead.render(par7);
        bipedBody.render(par7);
        bipedRightArm.render(par7);
        bipedLeftArm.render(par7);
        bipedRightLeg.render(par7);
        bipedLeftLeg.render(par7);
        bipedHeadwear.render(par7);
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        bipedHead.rotateAngleY = par4 / (180F / (float)Math.PI);
        bipedHead.rotateAngleX = par5 / (180F / (float)Math.PI);
        bipedHeadwear.rotateAngleY = bipedHead.rotateAngleY;
        bipedHeadwear.rotateAngleX = bipedHead.rotateAngleX;
        bipedRightArm.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 2.0F * par2 * 0.5F;
        bipedLeftArm.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 2.0F * par2 * 0.5F;
        bipedRightArm.rotateAngleZ = 0.0F;
        bipedLeftArm.rotateAngleZ = 0.0F;
        bipedRightLeg.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
        bipedLeftLeg.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        bipedRightLeg.rotateAngleY = 0.0F;
        bipedLeftLeg.rotateAngleY = 0.0F;

        if (isRiding)
        {
            bipedRightArm.rotateAngleX += -((float)Math.PI / 5F);
            bipedLeftArm.rotateAngleX += -((float)Math.PI / 5F);
            bipedRightLeg.rotateAngleX = -((float)Math.PI * 2F / 5F);
            bipedLeftLeg.rotateAngleX = -((float)Math.PI * 2F / 5F);
            bipedRightLeg.rotateAngleY = ((float)Math.PI / 10F);
            bipedLeftLeg.rotateAngleY = -((float)Math.PI / 10F);
        }

        if (heldItemLeft != 0)
        {
            bipedLeftArm.rotateAngleX = bipedLeftArm.rotateAngleX * 0.5F - ((float)Math.PI / 10F) * (float)heldItemLeft;
        }

        if (heldItemRight != 0)
        {
            bipedRightArm.rotateAngleX = bipedRightArm.rotateAngleX * 0.5F - ((float)Math.PI / 10F) * (float)heldItemRight;
        }

        bipedRightArm.rotateAngleY = 0.0F;
        bipedLeftArm.rotateAngleY = 0.0F;

        if (onGround > -9990F)
        {
            float f = onGround;
            bipedBody.rotateAngleY = MathHelper.sin(MathHelper.sqrt_float(f) * (float)Math.PI * 2.0F) * 0.2F;
            bipedRightArm.rotationPointZ = MathHelper.sin(bipedBody.rotateAngleY) * 5F;
            bipedRightArm.rotationPointX = -MathHelper.cos(bipedBody.rotateAngleY) * 5F;
            bipedLeftArm.rotationPointZ = -MathHelper.sin(bipedBody.rotateAngleY) * 5F;
            bipedLeftArm.rotationPointX = MathHelper.cos(bipedBody.rotateAngleY) * 5F;
            bipedRightArm.rotateAngleY += bipedBody.rotateAngleY;
            bipedLeftArm.rotateAngleY += bipedBody.rotateAngleY;
            bipedLeftArm.rotateAngleX += bipedBody.rotateAngleY;
            f = 1.0F - onGround;
            f *= f;
            f *= f;
            f = 1.0F - f;
            float f2 = MathHelper.sin(f * (float)Math.PI);
            float f4 = MathHelper.sin(onGround * (float)Math.PI) * -(bipedHead.rotateAngleX - 0.7F) * 0.75F;
            bipedRightArm.rotateAngleX -= (double)f2 * 1.2D + (double)f4;
            bipedRightArm.rotateAngleY += bipedBody.rotateAngleY * 2.0F;
            bipedRightArm.rotateAngleZ = MathHelper.sin(onGround * (float)Math.PI) * -0.4F;
        }

        if (isSneak)
        {
            bipedBody.rotateAngleX = 0.5F;
            bipedRightLeg.rotateAngleX -= 0.0F;
            bipedLeftLeg.rotateAngleX -= 0.0F;
            bipedRightArm.rotateAngleX += 0.4F;
            bipedLeftArm.rotateAngleX += 0.4F;
            bipedRightLeg.rotationPointZ = 4F;
            bipedLeftLeg.rotationPointZ = 4F;
            bipedRightLeg.rotationPointY = 9F;
            bipedLeftLeg.rotationPointY = 9F;
            bipedHead.rotationPointY = 1.0F;
        }
        else
        {
            bipedBody.rotateAngleX = 0.0F;
            bipedRightLeg.rotationPointZ = 0.0F;
            bipedLeftLeg.rotationPointZ = 0.0F;
            bipedRightLeg.rotationPointY = 12F;
            bipedLeftLeg.rotationPointY = 12F;
            bipedHead.rotationPointY = 0.0F;
        }

        bipedRightArm.rotateAngleZ += MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
        bipedLeftArm.rotateAngleZ -= MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
        bipedRightArm.rotateAngleX += MathHelper.sin(par3 * 0.067F) * 0.05F;
        bipedLeftArm.rotateAngleX -= MathHelper.sin(par3 * 0.067F) * 0.05F;

        if (aimedBow)
        {
            float f1 = 0.0F;
            float f3 = 0.0F;
            bipedRightArm.rotateAngleZ = 0.0F;
            bipedLeftArm.rotateAngleZ = 0.0F;
            bipedRightArm.rotateAngleY = -(0.1F - f1 * 0.6F) + bipedHead.rotateAngleY;
            bipedLeftArm.rotateAngleY = (0.1F - f1 * 0.6F) + bipedHead.rotateAngleY + 0.4F;
            bipedRightArm.rotateAngleX = -((float)Math.PI / 2F) + bipedHead.rotateAngleX;
            bipedLeftArm.rotateAngleX = -((float)Math.PI / 2F) + bipedHead.rotateAngleX;
            bipedRightArm.rotateAngleX -= f1 * 1.2F - f3 * 0.4F;
            bipedLeftArm.rotateAngleX -= f1 * 1.2F - f3 * 0.4F;
            bipedRightArm.rotateAngleZ += MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
            bipedLeftArm.rotateAngleZ -= MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
            bipedRightArm.rotateAngleX += MathHelper.sin(par3 * 0.067F) * 0.05F;
            bipedLeftArm.rotateAngleX -= MathHelper.sin(par3 * 0.067F) * 0.05F;
        }
    }

    /**
     * renders the ears (specifically, deadmau5's)
    public void renderEars(float par1)
    {
        bipedEars.rotateAngleY = bipedHead.rotateAngleY;
        bipedEars.rotateAngleX = bipedHead.rotateAngleX;
        bipedEars.rotationPointX = 0.0F;
        bipedEars.rotationPointY = 0.0F;
        bipedEars.render(par1);
    }

    /**
     * Renders the cloak of the current biped (in most cases, it's a player)
    public void renderCloak(float par1)
    {
        bipedCloak.render(par1);
    }
} */
