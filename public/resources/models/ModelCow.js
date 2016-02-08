import ModelQuadruped from './ModelQuadruped';

export default class ModelCow extends ModelQuadruped {
  constructor() {
    super();

    this.texture = 'entity/cow/cow';
    this.meshes = this.meshes.map(mesh => {
      if (mesh.name === 'head') {
        return {
          name: 'head',
          children: [
            {
              name: 'main',
              uv: mesh.uv,
              position: mesh.position
            },
            {
              name: 'misc1',
              uv: [22, 0],
              position: [[-5, -5, -4], [1, 3, 1]]
            },
            {
              name: 'misc2',
              uv: [22, 0],
              position: [[4, -5, -4], [1, 3, 1]]
            },
          ]
        };
      } else if (mesh.name === 'body') {
        return {
          name: 'body',
          children: [
            {
              name: 'main',
              uv: mesh.uv,
              position: mesh.position
            },
            {
              name: 'misc1',
              uv: [18, 4],
              position: [[-6, -10, -7], [12, 18, 10]]
            },
            {
              name: 'misc2',
              uv: [52, 0],
              position: [[-2, 2.0, -8], [4, 6, 1]]
            },
          ]
        };
      } else {
        return mesh;
      }
    });
  }
}

/* package net.minecraft.src;

public class ModelCow extends ModelQuadruped
{
    public ModelCow()
    {
        super(12, 0.0F);
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-4F, -4F, -6F, 8, 8, 6, 0.0F);
        head.setRotationPoint(0.0F, 4F, -8F);
        head.setTextureOffset(22, 0).addBox(-5F, -5F, -4F, 1, 3, 1, 0.0F);
        head.setTextureOffset(22, 0).addBox(4F, -5F, -4F, 1, 3, 1, 0.0F);
        body = new ModelRenderer(this, 18, 4);
        body.addBox(-6F, -10F, -7F, 12, 18, 10, 0.0F);
        body.setRotationPoint(0.0F, 5F, 2.0F);
        body.setTextureOffset(52, 0).addBox(-2F, 2.0F, -8F, 4, 6, 1);
        leg1.rotationPointX--;
        leg2.rotationPointX++;
        leg1.rotationPointZ += 0.0F;
        leg2.rotationPointZ += 0.0F;
        leg3.rotationPointX--;
        leg4.rotationPointX++;
        leg3.rotationPointZ--;
        leg4.rotationPointZ--;
        field_40332_n += 2.0F;
    }
} */
