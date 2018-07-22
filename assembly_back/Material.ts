import { Vector3 } from "./Vector3";

export class Material {
  constructor(
    public surfaceColor: Vector3,
    public reflection: f64,
    public transparency: f64,
    public emissionColor: Vector3,
  ) {}
}
