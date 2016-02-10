import ModelBase from './ModelBase';

const NAME = 'ocelot';

export default class ModelOcelot extends ModelBase {
  static NAME = NAME;

  constructor([], [s1 = 0, s2 = 1, s3 = 0, s4 = 0, s5 = 0, s6 = 0] = []) {
    super();

    this.textures = 'entity/cat/ocelot';
    this.meshes = [
      {
        name: 'head',
        rotationPoint: [0, 15, -9],
        rotation: [s5 / (180 / Math.PI), s4 / (180 / Math.PI), 0],
        children: [
          {
            name: 'main',
            uv: [[0, 0, 5, 5]],
            position: [-2.5, -2, -3],
            dimensions: [5, 4, 5]
          },
          {
            name: 'nose',
            uv: [
              [0, 26, 2, 28],
              [5, 26, 7, 28],
              [5, 24, 8, 26],
              [2, 24, 5, 26],
              [2, 26, 5, 28],
              [2, 26, 5, 28],
            ],
            position: [-1.5, 0, -4],
            dimensions: [3, 2, 2]
          },
          {
            name: 'ear1',
            uv: [
              [0, 12, 2, 13],
              [4, 12, 6, 13],
              [2, 12, 3, 13],
              [3, 12, 4, 13],
              [2, 10, 3, 12],
              [3, 10, 4, 12],
            ],
            position: [-2, -3, 0],
            dimensions: [1, 1, 2]
          },
          {
            name: 'ear2',
            uv: [
              [6, 12, 8, 13],
              [10, 12, 12, 13],
              [8, 12, 9, 13],
              [9, 12, 10, 13],
              [8, 10, 9, 12],
              [9, 10, 10, 12],
            ],
            position: [1, -3, 0],
            dimensions: [1, 1, 2]
          }
        ]
      },
      {
        name: 'body',
        uv: [
          [20, 6, 26, 22],
          [34, 6, 40, 22],
          [26, 0, 30, 6], // back
          [30, 6, 34, 22],
          [30, 0, 34, 6], // top
          [26, 6, 30, 22], // bottom
        ],
        position: [-2, 3, -8],
        dimensions: [4, 16, 6, 0],
        rotationPoint: [0, 12, -10],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        name: 'leg1',
        uv: [
          [8, 15, 10, 21],
          [14, 15, 16, 21],
          [10, 13, 12, 15],
          [12, 14, 14, 15],
          [10, 15, 12, 21],
          [12, 15, 14, 21],
        ],
        position: [-1, 0, 1],
        dimensions: [2, 6, 2],
        rotationPoint: [1.1, 18, 5],
        rotation: [Math.cos(s1 * 0.6662) * 1 * s2, 0, 0]
      },
      {
        name: 'leg2',
        uv: [
          [8, 15, 10, 21],
          [14, 15, 16, 21],
          [10, 13, 12, 15],
          [12, 14, 14, 15],
          [10, 15, 12, 21],
          [12, 15, 14, 21],
        ],
        position: [-1, 0, 1],
        dimensions: [2, 6, 2],
        rotationPoint: [-1, 18, 5],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1 * s2, 0, 0]
      },
      {
        name: 'leg3',
        uv: [
          [40, 2, 42, 12],
          [46, 2, 48, 12],
          [42, 2, 44, 2],
          [44, 2, 46, 2],
          [42, 2, 44, 12],
          [44, 2, 46, 12],
        ],
        position: [-1, 0, 0],
        dimensions: [2, 10, 2],
        rotationPoint: [1.2, 13.8, -5],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1 * s2, 0, 0]
      },
      {
        name: 'leg4',
        uv: [
          [40, 2, 42, 12],
          [46, 2, 48, 12],
          [42, 2, 44, 2],
          [44, 2, 46, 2],
          [42, 2, 44, 12],
          [44, 2, 46, 12],
        ],
        position: [-1, 0, 0],
        dimensions: [2, 10, 2],
        rotationPoint: [-1.2, 13.8, -5],
        rotation: [ Math.cos(s1 * 0.6662) * 1 * s2, 0, 0]
      },
      {
        name: 'tail1',
        uv: [
          [0, 16, 1, 24],
          [3, 16, 4, 24],
          [1, 16, 2, 24],
          [2, 16, 3, 24],
          [1, 15, 2, 16],
          [2, 16, 3, 16],
        ],
        position: [-0.5, 0, 0],
        dimensions: [1, 8, 1],
        rotationPoint: [0, 15, 8]
      },
      {
        name: 'tail2',
        uv: [
          [4, 16, 5, 24],
          [7, 16, 8, 24],
          [5, 16, 6, 24],
          [6, 16, 7, 24],
          [5, 15, 6, 16],
          [6, 16, 7, 16],
        ],
        position: [0.5, 0.0, 0.0],
        dimensions: [1, 8, 1],
        rotationPoint: [0, 20, 14],
        rotation: 1.727876 + (Math.PI / 4) * Math.cos(s1) * s2
      },
    ]
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.ocelot(game, [], [i, 1]); game.scene.add(m); m.position.set(-20, 11, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

import org.lwjgl.opengl.GL11;

public class ModelOcelot extends ModelBase
{
    ModelRenderer field_48225_a;
    ModelRenderer field_48223_b;
    ModelRenderer field_48224_c;
    ModelRenderer field_48221_d;
    ModelRenderer field_48222_e;
    ModelRenderer field_48219_f;
    ModelRenderer field_48220_g;
    ModelRenderer field_48226_n;
    int field_48227_o;

    public ModelOcelot()
    {
        field_48227_o = 1;
        setTextureOffset("head.main", 0, 0);
        setTextureOffset("head.nose", 0, 24);
        setTextureOffset("head.ear1", 0, 10);
        setTextureOffset("head.ear2", 6, 10);
        field_48220_g = new ModelRenderer(this, "head");
        field_48220_g.addBox("main", -2.5F, -2F, -3F, 5, 4, 5);
        field_48220_g.addBox("nose", -1.5F, 0.0F, -4F, 3, 2, 2);
        field_48220_g.addBox("ear1", -2F, -3F, 0.0F, 1, 1, 2);
        field_48220_g.addBox("ear2", 1.0F, -3F, 0.0F, 1, 1, 2);
        field_48220_g.setRotationPoint(0.0F, 15F, -9F);
        field_48226_n = new ModelRenderer(this, 20, 0);
        field_48226_n.addBox(-2F, 3F, -8F, 4, 16, 6, 0.0F);
        field_48226_n.setRotationPoint(0.0F, 12F, -10F);
        field_48222_e = new ModelRenderer(this, 0, 15);
        field_48222_e.addBox(-0.5F, 0.0F, 0.0F, 1, 8, 1);
        field_48222_e.rotateAngleX = 0.9F;
        field_48222_e.setRotationPoint(0.0F, 15F, 8F);
        field_48219_f = new ModelRenderer(this, 4, 15);
        field_48219_f.addBox(-0.5F, 0.0F, 0.0F, 1, 8, 1);
        field_48219_f.setRotationPoint(0.0F, 20F, 14F);
        field_48225_a = new ModelRenderer(this, 8, 13);
        field_48225_a.addBox(-1F, 0.0F, 1.0F, 2, 6, 2);
        field_48225_a.setRotationPoint(1.1F, 18F, 5F);
        field_48223_b = new ModelRenderer(this, 8, 13);
        field_48223_b.addBox(-1F, 0.0F, 1.0F, 2, 6, 2);
        field_48223_b.setRotationPoint(-1.1F, 18F, 5F);
        field_48224_c = new ModelRenderer(this, 40, 0);
        field_48224_c.addBox(-1F, 0.0F, 0.0F, 2, 10, 2);
        field_48224_c.setRotationPoint(1.2F, 13.8F, -5F);
        field_48221_d = new ModelRenderer(this, 40, 0);
        field_48221_d.addBox(-1F, 0.0F, 0.0F, 2, 10, 2);
        field_48221_d.setRotationPoint(-1.2F, 13.8F, -5F);
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
            GL11.glScalef(1.5F / f, 1.5F / f, 1.5F / f);
            GL11.glTranslatef(0.0F, 10F * par7, 4F * par7);
            field_48220_g.render(par7);
            GL11.glPopMatrix();
            GL11.glPushMatrix();
            GL11.glScalef(1.0F / f, 1.0F / f, 1.0F / f);
            GL11.glTranslatef(0.0F, 24F * par7, 0.0F);
            field_48226_n.render(par7);
            field_48225_a.render(par7);
            field_48223_b.render(par7);
            field_48224_c.render(par7);
            field_48221_d.render(par7);
            field_48222_e.render(par7);
            field_48219_f.render(par7);
            GL11.glPopMatrix();
        }
        else
        {
            field_48220_g.render(par7);
            field_48226_n.render(par7);
            field_48222_e.render(par7);
            field_48219_f.render(par7);
            field_48225_a.render(par7);
            field_48223_b.render(par7);
            field_48224_c.render(par7);
            field_48221_d.render(par7);
        }
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        field_48220_g.rotateAngleX = par5 / (180F / (float)Math.PI);
        field_48220_g.rotateAngleY = par4 / (180F / (float)Math.PI);


            field_48226_n.rotateAngleX = ((float)Math.PI / 2F);

                field_48225_a.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.0F * par2;
                field_48223_b.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.0F * par2;
                field_48224_c.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.0F * par2;
                field_48221_d.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.0F * par2;

                    field_48219_f.rotateAngleX = 1.727876F + ((float)Math.PI / 4F) * MathHelper.cos(par1) * par2;
    }

    /**
     * Used for easily adding entity-dependent animations. The second and third float params here are the same second
     * and third as in the setRotationAngles method.
    public void setLivingAnimations(EntityLiving par1EntityLiving, float par2, float par3, float par4)
    {
        EntityOcelot entityocelot = (EntityOcelot)par1EntityLiving;
        field_48226_n.rotationPointY = 12F;
        field_48226_n.rotationPointZ = -10F;
        field_48220_g.rotationPointY = 15F;
        field_48220_g.rotationPointZ = -9F;
        field_48222_e.rotationPointY = 15F;
        field_48222_e.rotationPointZ = 8F;
        field_48219_f.rotationPointY = 20F;
        field_48219_f.rotationPointZ = 14F;
        field_48224_c.rotationPointY = field_48221_d.rotationPointY = 13.8F;
        field_48224_c.rotationPointZ = field_48221_d.rotationPointZ = -5F;
        field_48225_a.rotationPointY = field_48223_b.rotationPointY = 18F;
        field_48225_a.rotationPointZ = field_48223_b.rotationPointZ = 5F;
        field_48222_e.rotateAngleX = 0.9F;

        if (entityocelot.isSneaking())
        {
            field_48226_n.rotationPointY++;
            field_48220_g.rotationPointY += 2.0F;
            field_48222_e.rotationPointY++;
            field_48219_f.rotationPointY += -4F;
            field_48219_f.rotationPointZ += 2.0F;
            field_48222_e.rotateAngleX = ((float)Math.PI / 2F);
            field_48219_f.rotateAngleX = ((float)Math.PI / 2F);
            field_48227_o = 0;
        }
        else if (entityocelot.isSprinting())
        {
            field_48219_f.rotationPointY = field_48222_e.rotationPointY;
            field_48219_f.rotationPointZ += 2.0F;
            field_48222_e.rotateAngleX = ((float)Math.PI / 2F);
            field_48219_f.rotateAngleX = ((float)Math.PI / 2F);
            field_48227_o = 2;
        }
        else if (entityocelot.func_48141_af())
        {
            field_48226_n.rotateAngleX = ((float)Math.PI / 4F);
            field_48226_n.rotationPointY += -4F;
            field_48226_n.rotationPointZ += 5F;
            field_48220_g.rotationPointY += -3.3F;
            field_48220_g.rotationPointZ++;
            field_48222_e.rotationPointY += 8F;
            field_48222_e.rotationPointZ += -2F;
            field_48219_f.rotationPointY += 2.0F;
            field_48219_f.rotationPointZ += -0.8F;
            field_48222_e.rotateAngleX = 1.727876F;
            field_48219_f.rotateAngleX = 2.670354F;
            field_48224_c.rotateAngleX = field_48221_d.rotateAngleX = -0.1570796F;
            field_48224_c.rotationPointY = field_48221_d.rotationPointY = 15.8F;
            field_48224_c.rotationPointZ = field_48221_d.rotationPointZ = -7F;
            field_48225_a.rotateAngleX = field_48223_b.rotateAngleX = -((float)Math.PI / 2F);
            field_48225_a.rotationPointY = field_48223_b.rotationPointY = 21F;
            field_48225_a.rotationPointZ = field_48223_b.rotationPointZ = 1.0F;
            field_48227_o = 3;
        }
        else
        {
            field_48227_o = 1;
        }
    }
} */
