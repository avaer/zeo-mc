import ModelQuadruped from './ModelQuadruped';

export default class ModelPig extends ModelQuadruped {
  constructor() {
    super();

    this.texture = 'pig';
    this.meshes = this.meshes.concat([
      {
        name: 'nose',
        uv: [16, 16],
        position: [[-2, 0, -9], [4, 3, 1]]
      }
    ]);
  }
}

/* package net.minecraft.src;

public class ModelPig extends ModelQuadruped
{
    public ModelPig()
    {
        this(0.0F);
    }

    public ModelPig(float par1)
    {
        super(6, par1);
        head.setTextureOffset(16, 16).addBox(-2F, 0.0F, -9F, 4, 3, 1, par1);
        field_40331_g = 4F;
    }
} */
