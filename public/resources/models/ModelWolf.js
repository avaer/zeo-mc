import ModelBase from './ModelBase';

export default class ModelWolf extends ModelBase {
  constructor([], [s1 = 0, s2 = 1] = []) {
    super([], [s1, s2]);

    const f = 0;
    const f1 = 13.5;
    const wolfBodyRotation = [Math.PI / 2, 0, 0];

    this.texture = 'entity/wolf/wolf';
    this.meshes = [
      {
        name: 'wolfHeadMain',
        rotationPoint: [-1, f1, -7],
        children: [
          {
            name: 'main',
            uv: [16, 16], // XXX
            position: [-3, -3, -2],
            dimensions: [6, 6, 4]
          },
          {
            name: 'ear1',
            uv: [16, 14],
            position: [-3, -5, 0],
            dimensions: [2, 2, 1]
          },
          {
            name: 'ear2',
            uv: [16, 14],
            position: [1, -5, 0],
            dimensions: [2, 2, 1]
          },
          {
            name: 'snout',
            uv: [0, 10],
            position: [-1.5, 0, -5],
            dimensions: [3, 3, 4]
          },
        ]
      },
      {
        name: 'wolfBody',
        uv: [18, 14],
        position: [-4, -2, -3],
        dimensions: [6, 9, 6],
        rotationPoint: [0, 14, 2],
        rotation: wolfBodyRotation
      },
      {
        name: 'wolfMane',
        uv: [21, 0],
        position: [-4, -3, -3],
        dimensions: [8, 6, 7],
        // rotationPoint: [-1, 14, 2]
        rotationPoint: [-1, 14, -3],
        rotation: wolfBodyRotation
      },
      {
        name: 'wolfLeg1',
        uv: [0, 18],
        position: [-1, 0, -1],
        dimensions: [2, 8, 2],
        rotationPoint: [-2.5, 16, 7],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
      {
        name: 'wolfLeg2',
        uv: [0, 18],
        position: [-1, 0, -1],
        dimensions: [2, 8, 2],
        rotationPoint: [0.5, 16, 7],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2]
      },
      {
        name: 'wolfLeg3',
        uv: [0, 18],
        position: [-1, 0, -1],
        dimensions: [2, 8, 2],
        rotationPoint: [-2.5, 16, -4],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'wolfLeg4',
        uv: [0, 18],
        position: [-1, 0, -1],
        dimensions: [2, 8, 2],
        rotationPoint: [0.5, 16, -4],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
      {
        name: 'wolfTail',
        uv: [9, 18],
        position: [-1, 0, -1],
        dimensions: [2, 8, 2],
        rotationPoint: [-1, 12, 8],
        rotation: [0, Math.cos(s1 * 0.6662) * 1.4 * s2, 0]
      },
    ];
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.wolf(game, [], [i, 1]); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

import org.lwjgl.opengl.GL11;

public class ModelWolf extends ModelBase
{
    /** main box for the wolf head
    public ModelRenderer wolfHeadMain;

    /** The wolf's body
    public ModelRenderer wolfBody;

    /** Wolf'se first leg
    public ModelRenderer wolfLeg1;

    /** Wolf's second leg
    public ModelRenderer wolfLeg2;

    /** Wolf's third leg
    public ModelRenderer wolfLeg3;

    /** Wolf's fourth leg
    public ModelRenderer wolfLeg4;

    /** The wolf's tail
    ModelRenderer wolfTail;

    /** The wolf's mane
    ModelRenderer wolfMane;

    public ModelWolf()
    {
        float f = 0.0F;
        float f1 = 13.5F;
        wolfHeadMain = new ModelRenderer(this, 0, 0);
        wolfHeadMain.addBox(-3F, -3F, -2F, 6, 6, 4, f);
        wolfHeadMain.setRotationPoint(-1F, f1, -7F);
        wolfBody = new ModelRenderer(this, 18, 14);
        wolfBody.addBox(-4F, -2F, -3F, 6, 9, 6, f);
        wolfBody.setRotationPoint(0.0F, 14F, 2.0F);
        wolfMane = new ModelRenderer(this, 21, 0);
        wolfMane.addBox(-4F, -3F, -3F, 8, 6, 7, f);
        wolfMane.setRotationPoint(-1F, 14F, 2.0F);
        wolfLeg1 = new ModelRenderer(this, 0, 18);
        wolfLeg1.addBox(-1F, 0.0F, -1F, 2, 8, 2, f);
        wolfLeg1.setRotationPoint(-2.5F, 16F, 7F);
        wolfLeg2 = new ModelRenderer(this, 0, 18);
        wolfLeg2.addBox(-1F, 0.0F, -1F, 2, 8, 2, f);
        wolfLeg2.setRotationPoint(0.5F, 16F, 7F);
        wolfLeg3 = new ModelRenderer(this, 0, 18);
        wolfLeg3.addBox(-1F, 0.0F, -1F, 2, 8, 2, f);
        wolfLeg3.setRotationPoint(-2.5F, 16F, -4F);
        wolfLeg4 = new ModelRenderer(this, 0, 18);
        wolfLeg4.addBox(-1F, 0.0F, -1F, 2, 8, 2, f);
        wolfLeg4.setRotationPoint(0.5F, 16F, -4F);
        wolfTail = new ModelRenderer(this, 9, 18);
        wolfTail.addBox(-1F, 0.0F, -1F, 2, 8, 2, f);
        wolfTail.setRotationPoint(-1F, 12F, 8F);
        wolfHeadMain.setTextureOffset(16, 14).addBox(-3F, -5F, 0.0F, 2, 2, 1, f);
        wolfHeadMain.setTextureOffset(16, 14).addBox(1.0F, -5F, 0.0F, 2, 2, 1, f);
        wolfHeadMain.setTextureOffset(0, 10).addBox(-1.5F, 0.0F, -5F, 3, 3, 4, f);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        super.render(par1Entity, par2, par3, par4, par5, par6, par7);
        setRotationAngles(par2, par3, par4, par5, par6, par7);

        if (isChild)
        {
            float f = 2.0F;
            GL11.glPushMatrix();
            GL11.glTranslatef(0.0F, 5F * par7, 2.0F * par7);
            wolfHeadMain.renderWithRotation(par7);
            GL11.glPopMatrix();
            GL11.glPushMatrix();
            GL11.glScalef(1.0F / f, 1.0F / f, 1.0F / f);
            GL11.glTranslatef(0.0F, 24F * par7, 0.0F);
            wolfBody.render(par7);
            wolfLeg1.render(par7);
            wolfLeg2.render(par7);
            wolfLeg3.render(par7);
            wolfLeg4.render(par7);
            wolfTail.renderWithRotation(par7);
            wolfMane.render(par7);
            GL11.glPopMatrix();
        }
        else
        {
            wolfHeadMain.renderWithRotation(par7);
            wolfBody.render(par7);
            wolfLeg1.render(par7);
            wolfLeg2.render(par7);
            wolfLeg3.render(par7);
            wolfLeg4.render(par7);
            wolfTail.renderWithRotation(par7);
            wolfMane.render(par7);
        }
    }

    /**
     * Used for easily adding entity-dependent animations. The second and third float params here are the same second
     * and third as in the setRotationAngles method.
    public void setLivingAnimations(EntityLiving par1EntityLiving, float par2, float par3, float par4)
    {
        EntityWolf entitywolf = (EntityWolf)par1EntityLiving;


            wolfBody.rotateAngleX = ((float)Math.PI / 2F);
            wolfMane.setRotationPoint(-1F, 14F, -3F);
            wolfMane.rotateAngleX = wolfBody.rotateAngleX;
            wolfTail.setRotationPoint(-1F, 12F, 8F);
            wolfLeg1.rotateAngleX = MathHelper.cos(par2 * 0.6662F) * 1.4F * par3;
            wolfLeg2.rotateAngleX = MathHelper.cos(par2 * 0.6662F + (float)Math.PI) * 1.4F * par3;
            wolfLeg3.rotateAngleX = MathHelper.cos(par2 * 0.6662F + (float)Math.PI) * 1.4F * par3;
            wolfLeg4.rotateAngleX = MathHelper.cos(par2 * 0.6662F) * 1.4F * par3;

        wolfTail.rotateAngleY = MathHelper.cos(par2 * 0.6662F) * 1.4F * par3;
        wolfTail.rotateAngleZ = entitywolf.getShakeAngle(par4, -0.2F);

    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        super.setRotationAngles(par1, par2, par3, par4, par5, par6);
        wolfHeadMain.rotateAngleX = par5 / (180F / (float)Math.PI);
        wolfHeadMain.rotateAngleY = par4 / (180F / (float)Math.PI);
        wolfTail.rotateAngleX = par3;
    }
} */
