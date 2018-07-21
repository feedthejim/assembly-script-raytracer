export class RayTracer {
  static renderBufferStartOffset: i32 = 0;
  static renderBufferWidth: i32 = 1000;
  static renderBufferHeight: i32 = 1000;
  static renderBufferLength: i32 =
    RayTracer.renderBufferHeight * RayTracer.renderBufferWidth * sizeof<i32>();

  // // defautl length
  // static spheresBufferStartOffset: i32 =
  //   RayTracer.renderBufferLength + RayTracer.renderBufferStartOffset;
  // static spheresBufferLength: i32 =
  //   RayTracer.spheresBufferStartOffset + 100 * offsetof<any>();
}

export function getPixel(x: i32, y: i32): Pixel {
  return changetype<Pixel>(
    (RayTracer.renderBufferWidth * y + x) * sizeof<i32>() +
      RayTracer.renderBufferStartOffset,
  );
}

export function setPixel(x: i32, y: i32): void {
  store<Pixel>(0, 16777215);
}

@unmanaged
export class Pixel {
  r: u8;
  g: u8;
  b: u8;
}
