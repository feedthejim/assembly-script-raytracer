declare namespace console {
  function debug(val: number): void;
}
export class Vector3 {
  constructor(public x: f64 = 0, public y: f64 = 0, public z: f64 = 0) {
  }

  product(v2: Vector3): Vector3 {
    this.x *= v2.x;
    this.y *= v2.y;
    this.z *= v2.z;
    return this;
  }

  multiply(scalar: f64): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  length2(): f64 {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): f64 {
    return sqrt(this.length2());
  }

  normalize(): Vector3 {
    let len2 = this.length2();
    let len2Sqrt = sqrt(len2);

    if (len2 > 0) {
      this.x /= len2Sqrt;
      this.y /= len2Sqrt;
      this.z /= len2Sqrt;
    }
    return this;
  }

  dotProduct(v2: Vector3): f64 {
    return this.x * v2.x + this.y * v2.y + this.z * v2.z;
  }

  add(v2: Vector3): Vector3 {
    this.x += v2.x;
    this.y += v2.y;
    this.z += v2.z;
    return this;
  }

  subtract(v2: Vector3): Vector3 {
    this.x -= v2.x;
    this.y -= v2.y;
    this.z -= v2.z;
    return this;
  }

  reverse(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
}
