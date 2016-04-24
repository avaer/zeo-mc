"use strict";

const ModelBiped = require('./ModelBiped');

const NAME = 'zombie';

class ModelZombie extends ModelBiped {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;
    const p2 = typeof p[1] !== 'undefined' ? p[1] : 0;
    const p3 = typeof p[2] !== 'undefined' ? p[2] : 0;
    const p4 = typeof p[3] !== 'undefined' ? p[3] : 0;
    const p5 = typeof p[4] !== 'undefined' ? p[4] : 0;
    const p6 = typeof p[5] !== 'undefined' ? p[5] : 0;

    super([p1, p2, p3, p4, p5, p6], []);

    const onGround = 0;
    const f = Math.sin(onGround * Math.PI);
    const f1 = Math.sin((1 - (1 - onGround) * (1 - onGround)) * Math.PI);

    this.meshes = this.meshes.map(mesh => {
      if (mesh.name === 'rightArm') {
        return {
          name: mesh.name,
          uv: mesh.uv,
          position: mesh.position,
          dimensions: mesh.dimensions,
          rotationPoint: mesh.rotationPoint,
          rotation: [-(Math.PI / 2) - (f * 1.2 - f1 * 0.4), -(0.1 - f * 0.6) + Math.sin(p3 * 0.067) * 0.05, Math.cos(p3 * 0.09) * 0.05 + 0.05],
        };
      } else if (mesh.name === 'leftArm') {
        return {
          name: mesh.name,
          uv: mesh.uv,
          position: mesh.position,
          dimensions: mesh.dimensions,
          rotationPoint: mesh.rotationPoint,
          rotation: [-(Math.PI / 2) - (f * 1.2 - f1 * 0.4) - (Math.sin(p3 * 0.067) * 0.05), 0.1 - f * 0.6, -(Math.cos(p3 * 0.09) * 0.05 + 0.05)],
        };
      } else {
        return mesh;
      }
    });
  }
}

ModelZombie.NAME = NAME;
ModelZombie.TEXTURE = 'zombie/zombie';

module.exports = ModelZombie;

/* package net.minecraft.src;

public class ModelZombie extends ModelBiped
{
    public ModelZombie()
    {
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        super.setRotationAngles(par1, par2, par3, par4, par5, par6);
        float f = MathHelper.sin(onGround * (float)Math.PI);
        float f1 = MathHelper.sin((1.0F - (1.0F - onGround) * (1.0F - onGround)) * (float)Math.PI);
        bipedRightArm.rotateAngleZ = 0.0F;
        bipedLeftArm.rotateAngleZ = 0.0F;
        bipedRightArm.rotateAngleY = -(0.1F - f * 0.6F);
        bipedLeftArm.rotateAngleY = 0.1F - f * 0.6F;
        bipedRightArm.rotateAngleX = -((float)Math.PI / 2F);
        bipedLeftArm.rotateAngleX = -((float)Math.PI / 2F);
        bipedRightArm.rotateAngleX -= f * 1.2F - f1 * 0.4F;
        bipedLeftArm.rotateAngleX -= f * 1.2F - f1 * 0.4F;
        bipedRightArm.rotateAngleZ += MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
        bipedLeftArm.rotateAngleZ -= MathHelper.cos(par3 * 0.09F) * 0.05F + 0.05F;
        bipedRightArm.rotateAngleX += MathHelper.sin(par3 * 0.067F) * 0.05F;
        bipedLeftArm.rotateAngleX -= MathHelper.sin(par3 * 0.067F) * 0.05F;
    }
} */
