const ModelBase = require('./ModelBase');

const NAME = 'rabbit';

class ModelRabbit extends ModelBase {
  static NAME = NAME;

  constructor([], [s1 = Math.PI * 3 / 4, s2 = 1, s3 = 0, s4 = 0, s5 = 0, s6 = 0] = []) {
    super();

    const headRotationX = s5 * 0.017453292;
    const headRotationY = s4 * 0.017453292;
    const footRotationX = Math.sin(s1);

    this.textures = 'entity/rabbit/brown';
    this.meshes = [
      {
        name: 'rabbitLeftFoot',
        uv: [
          [8, 31, 15, 32],
          [17, 31, 24, 32],
          [17, 24, 19, 31],
          [15, 24, 17, 31],
          [24, 31, 26, 32],
          [15, 31, 17, 32],
        ],
        position: [-1, 5.5, -3.7],
        dimensions: [2, 1, 7],
        rotationPoint: [3, 17.5, 3.7],
        rotation: [footRotationX * 50 * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitRightFoot',
        uv: [
          [26, 31, 33, 32],
          [35, 31, 42, 32],
          [35, 24, 37, 31],
          [33, 24, 35, 31],
          [42, 31, 44, 32],
          [33, 31, 35, 32],
        ],
        position: [-1, 5.5, -3.7],
        dimensions: [2, 1, 7],
        rotationPoint: [-3, 17.5, 3.7],
        rotation: [footRotationX * 50 * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitLeftThigh',
        uv: [
          [16, 20, 21, 24],
          [25, 20, 30, 24],
          [21, 15, 25, 20],
          [21, 15, 25, 20],
          [21, 20, 25, 24],
          [21, 20, 25, 24],
        ],
        position: [-1, 0, 0],
        dimensions: [2, 4, 5],
        rotationPoint: [3, 17.5, 3.7],
        rotation: [(footRotationX * 50 - 21) * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitRightThigh',
        uv: [
          [30, 20, 35, 24],
          [39, 20, 44, 24],
          [35, 15, 39, 20],
          [35, 15, 39, 20],
          [35, 20, 39, 24],
          [35, 20, 39, 24],
        ],
        position: [-1, 0, 0],
        dimensions: [2, 4, 5],
        rotationPoint: [-3, 17.5, 3.7],
        rotation: [(footRotationX * 50 - 21) * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitBody',
        uv: [
          [0, 10, 10, 15],
          [16, 10, 26, 15],
          [16, 0, 22, 10],
          [10, 0, 16, 10],
          [26, 10, 32, 15],
          [10, 10, 16, 15],
        ],
        position: [-3, -2, -10],
        dimensions: [6, 5, 10],
        rotationPoint: [0, 19, 8],
      },
      {
        name: 'rabbitLeftArm',
        uv: [
          [0, 17, 2, 24],
          [4, 17, 6, 24],
          [4, 15, 6, 17],
          [0, 15, 2, 17],
          [6, 17, 8, 24],
          [2, 17, 4, 24],
        ],
        position: [-1, 0, -1],
        dimensions: [2, 7, 2],
        rotationPoint: [3, 17, -1],
        rotation: [(footRotationX * -40 - 11) * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitRightArm',
        uv: [
          [8, 17, 10, 24],
          [12, 17, 14, 24],
          [12, 15, 14, 17],
          [8, 15, 10, 17],
          [14, 17, 16, 24],
          [10, 17, 12, 24],
        ],
        position: [-1, 0, -1],
        dimensions: [2, 7, 2],
        rotationPoint: [-3, 17, -1],
        rotation: [(footRotationX * -40 - 11) * 0.017453292, 0, 0]
      },
      {
        name: 'rabbitHead',
        uv: [
          [32, 5, 37, 9],
          [42, 5, 47, 9],
          [42, 0, 47, 5],
          [37, 0, 42, 5],
          [47, 5, 52, 9],
          [37, 5, 42, 9],
        ],
        position: [-2.5, -4, -5],
        dimensions: [5, 4, 5],
        rotationPoint: [0, 16, -1],
        rotation: [headRotationX, headRotationY, 0]
      },
      {
        name: 'rabbitRightEar',
        uv: [
          [58, 1, 59, 6],
          [61, 1, 62, 6],
          [62, 1, 64, 6],
          [59, 1, 61, 6],
          [61, 0, 63, 1],
          [59, 0, 61, 1],
        ],
        position: [-2.5, -9, -1],
        dimensions: [2, 5, 1],
        rotationPoint: [0, 16, -1],
        rotation: [headRotationX, headRotationY - 0.2617994, 0]
      },
      {
        name: 'rabbitLeftEar',
        uv: [
          [52, 1, 53, 6],
          [55, 1, 56, 6],
          [56, 1, 58, 6],
          [53, 1, 55, 6],
          [55, 0, 57, 1],
          [53, 0, 55, 1],
        ],
        position: [0.5, -9, -1],
        dimensions: [2, 5, 1],
        rotationPoint: [0, 16, -1],
        rotation: [headRotationX, headRotationY + 0.2617994, 0]
      },
      {
        name: 'rabbitTail',
        uv: [
          [52, 8, 54, 11],
          [57, 8, 59, 11],
          [57, 6, 60, 8],
          [54, 9, 57, 10],
          [59, 8, 62, 11],
          [54, 8, 57, 11],
        ],
        position: [-1.5, -1.5, 0],
        dimensions: [3, 3, 2],
        rotationPoint: [0, 20, 7],
      },
      {
        name: 'rabbitNose',
        uv: [
          [32, 10, 33, 11],
          [35, 10, 36, 11],
          [34, 9, 35, 10],
          [33, 9, 34, 10],
          [34, 10, 35, 11],
          [33, 10, 34, 11],
        ],
        position: [-0.5, -2.5, -5.5],
        dimensions: [1, 1, 1],
        rotationPoint: [0, 16, -1],
        rotation: [headRotationX, headRotationY, 0]
      },
    ];
  }
}

module.exports = ModelRabbit;

/* package net.minecraft.client.model;

import net.minecraft.client.renderer.GlStateManager;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.entity.passive.EntityRabbit;
import net.minecraft.util.MathHelper;

public class ModelRabbit extends ModelBase
{
    /** The Rabbit's Left Foot
    ModelRenderer rabbitLeftFoot;

    /** The Rabbit's Right Foot
    ModelRenderer rabbitRightFoot;

    /** The Rabbit's Left Thigh
    ModelRenderer rabbitLeftThigh;

    /** The Rabbit's Right Thigh
    ModelRenderer rabbitRightThigh;

    /** The Rabbit's Body
    ModelRenderer rabbitBody;

    /** The Rabbit's Left Arm
    ModelRenderer rabbitLeftArm;

    /** The Rabbit's Right Arm
    ModelRenderer rabbitRightArm;

    /** The Rabbit's Head
    ModelRenderer rabbitHead;

    /** The Rabbit's Right Ear
    ModelRenderer rabbitRightEar;

    /** The Rabbit's Left Ear
    ModelRenderer rabbitLeftEar;

    /** The Rabbit's Tail
    ModelRenderer rabbitTail;

    /** The Rabbit's Nose
    ModelRenderer rabbitNose;
    private float field_178701_m = 0.0F;
    private float field_178699_n = 0.0F;

    public ModelRabbit()
    {
        this.setTextureOffset("head.main", 0, 0);
        this.setTextureOffset("head.nose", 0, 24);
        this.setTextureOffset("head.ear1", 0, 10);
        this.setTextureOffset("head.ear2", 6, 10);
        this.rabbitLeftFoot = new ModelRenderer(this, 26, 24);
        this.rabbitLeftFoot.addBox(-1.0F, 5.5F, -3.7F, 2, 1, 7);
        this.rabbitLeftFoot.setRotationPoint(3.0F, 17.5F, 3.7F);
        this.rabbitLeftFoot.mirror = true;
        this.setRotationOffset(this.rabbitLeftFoot, 0.0F, 0.0F, 0.0F);
        this.rabbitRightFoot = new ModelRenderer(this, 8, 24);
        this.rabbitRightFoot.addBox(-1.0F, 5.5F, -3.7F, 2, 1, 7);
        this.rabbitRightFoot.setRotationPoint(-3.0F, 17.5F, 3.7F);
        this.rabbitRightFoot.mirror = true;
        this.setRotationOffset(this.rabbitRightFoot, 0.0F, 0.0F, 0.0F);
        this.rabbitLeftThigh = new ModelRenderer(this, 30, 15);
        this.rabbitLeftThigh.addBox(-1.0F, 0.0F, 0.0F, 2, 4, 5);
        this.rabbitLeftThigh.setRotationPoint(3.0F, 17.5F, 3.7F);
        this.rabbitLeftThigh.mirror = true;
        this.setRotationOffset(this.rabbitLeftThigh, -0.34906584F, 0.0F, 0.0F);
        this.rabbitRightThigh = new ModelRenderer(this, 16, 15);
        this.rabbitRightThigh.addBox(-1.0F, 0.0F, 0.0F, 2, 4, 5);
        this.rabbitRightThigh.setRotationPoint(-3.0F, 17.5F, 3.7F);
        this.rabbitRightThigh.mirror = true;
        this.setRotationOffset(this.rabbitRightThigh, -0.34906584F, 0.0F, 0.0F);
        this.rabbitBody = new ModelRenderer(this, 0, 0);
        this.rabbitBody.addBox(-3.0F, -2.0F, -10.0F, 6, 5, 10);
        this.rabbitBody.setRotationPoint(0.0F, 19.0F, 8.0F);
        this.rabbitBody.mirror = true;
        this.setRotationOffset(this.rabbitBody, -0.34906584F, 0.0F, 0.0F);
        this.rabbitLeftArm = new ModelRenderer(this, 8, 15);
        this.rabbitLeftArm.addBox(-1.0F, 0.0F, -1.0F, 2, 7, 2);
        this.rabbitLeftArm.setRotationPoint(3.0F, 17.0F, -1.0F);
        this.rabbitLeftArm.mirror = true;
        this.setRotationOffset(this.rabbitLeftArm, -0.17453292F, 0.0F, 0.0F);
        this.rabbitRightArm = new ModelRenderer(this, 0, 15);
        this.rabbitRightArm.addBox(-1.0F, 0.0F, -1.0F, 2, 7, 2);
        this.rabbitRightArm.setRotationPoint(-3.0F, 17.0F, -1.0F);
        this.rabbitRightArm.mirror = true;
        this.setRotationOffset(this.rabbitRightArm, -0.17453292F, 0.0F, 0.0F);
        this.rabbitHead = new ModelRenderer(this, 32, 0);
        this.rabbitHead.addBox(-2.5F, -4.0F, -5.0F, 5, 4, 5);
        this.rabbitHead.setRotationPoint(0.0F, 16.0F, -1.0F);
        this.rabbitHead.mirror = true;
        this.setRotationOffset(this.rabbitHead, 0.0F, 0.0F, 0.0F);
        this.rabbitRightEar = new ModelRenderer(this, 52, 0);
        this.rabbitRightEar.addBox(-2.5F, -9.0F, -1.0F, 2, 5, 1);
        this.rabbitRightEar.setRotationPoint(0.0F, 16.0F, -1.0F);
        this.rabbitRightEar.mirror = true;
        this.setRotationOffset(this.rabbitRightEar, 0.0F, -0.2617994F, 0.0F);
        this.rabbitLeftEar = new ModelRenderer(this, 58, 0);
        this.rabbitLeftEar.addBox(0.5F, -9.0F, -1.0F, 2, 5, 1);
        this.rabbitLeftEar.setRotationPoint(0.0F, 16.0F, -1.0F);
        this.rabbitLeftEar.mirror = true;
        this.setRotationOffset(this.rabbitLeftEar, 0.0F, 0.2617994F, 0.0F);
        this.rabbitTail = new ModelRenderer(this, 52, 6);
        this.rabbitTail.addBox(-1.5F, -1.5F, 0.0F, 3, 3, 2);
        this.rabbitTail.setRotationPoint(0.0F, 20.0F, 7.0F);
        this.rabbitTail.mirror = true;
        this.setRotationOffset(this.rabbitTail, -0.3490659F, 0.0F, 0.0F);
        this.rabbitNose = new ModelRenderer(this, 32, 9);
        this.rabbitNose.addBox(-0.5F, -2.5F, -5.5F, 1, 1, 1);
        this.rabbitNose.setRotationPoint(0.0F, 16.0F, -1.0F);
        this.rabbitNose.mirror = true;
        this.setRotationOffset(this.rabbitNose, 0.0F, 0.0F, 0.0F);
    }

    private void setRotationOffset(ModelRenderer p_178691_1_, float p_178691_2_, float p_178691_3_, float p_178691_4_)
    {
        p_178691_1_.rotateAngleX = p_178691_2_;
        p_178691_1_.rotateAngleY = p_178691_3_;
        p_178691_1_.rotateAngleZ = p_178691_4_;
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity entityIn, float p_78088_2_, float p_78088_3_, float p_78088_4_, float p_78088_5_, float p_78088_6_, float scale)
    {
        this.setRotationAngles(p_78088_2_, p_78088_3_, p_78088_4_, p_78088_5_, p_78088_6_, scale, entityIn);

        if (this.isChild)
        {
            float f = 2.0F;
            GlStateManager.pushMatrix();
            GlStateManager.translate(0.0F, 5.0F * scale, 2.0F * scale);
            this.rabbitHead.render(scale);
            this.rabbitLeftEar.render(scale);
            this.rabbitRightEar.render(scale);
            this.rabbitNose.render(scale);
            GlStateManager.popMatrix();
            GlStateManager.pushMatrix();
            GlStateManager.scale(1.0F / f, 1.0F / f, 1.0F / f);
            GlStateManager.translate(0.0F, 24.0F * scale, 0.0F);
            this.rabbitLeftFoot.render(scale);
            this.rabbitRightFoot.render(scale);
            this.rabbitLeftThigh.render(scale);
            this.rabbitRightThigh.render(scale);
            this.rabbitBody.render(scale);
            this.rabbitLeftArm.render(scale);
            this.rabbitRightArm.render(scale);
            this.rabbitTail.render(scale);
            GlStateManager.popMatrix();
        }
        else
        {
            this.rabbitLeftFoot.render(scale);
            this.rabbitRightFoot.render(scale);
            this.rabbitLeftThigh.render(scale);
            this.rabbitRightThigh.render(scale);
            this.rabbitBody.render(scale);
            this.rabbitLeftArm.render(scale);
            this.rabbitRightArm.render(scale);
            this.rabbitHead.render(scale);
            this.rabbitRightEar.render(scale);
            this.rabbitLeftEar.render(scale);
            this.rabbitTail.render(scale);
            this.rabbitNose.render(scale);
        }
    }

    /**
     * Sets the model's various rotation angles. For bipeds, par1 and par2 are used for animating the movement of arms
     * and legs, where par1 represents the time(so that arms and legs swing back and forth) and par2 represents how
     * "far" arms and legs can swing at most.
    public void setRotationAngles(float p_78087_1_, float p_78087_2_, float p_78087_3_, float p_78087_4_, float p_78087_5_, float p_78087_6_, Entity entityIn)
    {
        float f = p_78087_3_ - (float)entityIn.ticksExisted;
        EntityRabbit entityrabbit = (EntityRabbit)entityIn;
        this.rabbitNose.rotateAngleX = this.rabbitHead.rotateAngleX = this.rabbitRightEar.rotateAngleX = this.rabbitLeftEar.rotateAngleX = p_78087_5_ * 0.017453292F;
        this.rabbitNose.rotateAngleY = this.rabbitHead.rotateAngleY = p_78087_4_ * 0.017453292F;
        this.rabbitRightEar.rotateAngleY = this.rabbitNose.rotateAngleY - 0.2617994F;
        this.rabbitLeftEar.rotateAngleY = this.rabbitNose.rotateAngleY + 0.2617994F;
        this.field_178701_m = MathHelper.sin(entityrabbit.func_175521_o(f) * (float)Math.PI);
        this.rabbitLeftThigh.rotateAngleX = this.rabbitRightThigh.rotateAngleX = (this.field_178701_m * 50.0F - 21.0F) * 0.017453292F;
        this.rabbitLeftFoot.rotateAngleX = this.rabbitRightFoot.rotateAngleX = this.field_178701_m * 50.0F * 0.017453292F;
        this.rabbitLeftArm.rotateAngleX = this.rabbitRightArm.rotateAngleX = (this.field_178701_m * -40.0F - 11.0F) * 0.017453292F;
    }

    /**
     * Used for easily adding entity-dependent animations. The second and third float params here are the same second
     * and third as in the setRotationAngles method.
    public void setLivingAnimations(EntityLivingBase entitylivingbaseIn, float p_78086_2_, float p_78086_3_, float partialTickTime)
    {
    }
} */
