"use strict";

const ModelZombie = require('./ModelZombie');

const NAME = 'skeleton';

class ModelSkeleton extends ModelZombie {
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

    const f = 0;

    this.meshes = this.meshes.map(mesh => {
      if (mesh.name === 'rightArm') {
        return {
          name: mesh.name,
          uv: [
            [40, 18, 42, 30],
            [44, 18, 48, 30],
            [44, 16, 46, 18],
            [42, 16, 44, 18],
            [46, 18, 48, 30],
            [42, 18, 44, 30],
          ],
          position: [-1, -2, -1],
          dimensions: [2, 12, 2],
          rotationPoint: [-5, 2, 0],
          rotation: mesh.rotation,
        };
      } else if (mesh.name === 'leftArm') {
        return {
          name: mesh.name,
          uv: [
            [40, 18, 42, 30],
            [44, 18, 48, 30],
            [44, 16, 46, 18],
            [42, 16, 44, 18],
            [46, 18, 48, 30],
            [42, 18, 44, 30],
          ],
          position: [-1, -2, -1],
          dimensions: [2, 12, 2],
          rotationPoint: [5, 2, 0],
          rotation: mesh.rotation,
        };
      } else if (mesh.name === 'rightLeg') {
        return {
          name: mesh.name,
          uv: [
            [0, 18, 2, 30],
            [4, 18, 6, 30],
            [4, 16, 6, 18],
            [2, 16, 4, 18],
            [6, 18, 8, 30],
            [2, 18, 4, 30],
          ],
          position: [-1, 0, -1],
          dimensions: [2, 12, 2],
          rotationPoint: [-2, 12, 0],
          rotation: mesh.rotation,
        };
      } else if (mesh.name === 'leftLeg') {
        return {
          name: mesh.name,
          uv: [
            [0, 18, 2, 30],
            [4, 18, 6, 30],
            [4, 16, 6, 18],
            [2, 16, 4, 18],
            [6, 18, 8, 30],
            [2, 18, 4, 30],
          ],
          position: [-1, 0, -1],
          dimensions: [2, 12, 2],
          rotationPoint: [2, 12, 0],
          rotation: mesh.rotation,
        };
      } else {
        return mesh;
      }
    });
  }
}

ModelSkeleton.NAME = NAME;
ModelSkeleton.TEXTURE = 'skeleton/skeleton';

module.exports = ModelSkeleton;

/* package net.minecraft.src;

public class ModelSkeleton extends ModelZombie
{
    public ModelSkeleton()
    {
        float f = 0.0F;
        bipedRightArm = new ModelRenderer(this, 40, 16);
        bipedRightArm.addBox(-1F, -2F, -1F, 2, 12, 2, f);
        bipedRightArm.setRotationPoint(-5F, 2.0F, 0.0F);
        bipedLeftArm = new ModelRenderer(this, 40, 16);
        bipedLeftArm.mirror = true;
        bipedLeftArm.addBox(-1F, -2F, -1F, 2, 12, 2, f);
        bipedLeftArm.setRotationPoint(5F, 2.0F, 0.0F);
        bipedRightLeg = new ModelRenderer(this, 0, 16);
        bipedRightLeg.addBox(-1F, 0.0F, -1F, 2, 12, 2, f);
        bipedRightLeg.setRotationPoint(-2F, 12F, 0.0F);
        bipedLeftLeg = new ModelRenderer(this, 0, 16);
        bipedLeftLeg.mirror = true;
        bipedLeftLeg.addBox(-1F, 0.0F, -1F, 2, 12, 2, f);
        bipedLeftLeg.setRotationPoint(2.0F, 12F, 0.0F);
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        aimedBow = true;
        super.setRotationAngles(par1, par2, par3, par4, par5, par6);
    }
} */
