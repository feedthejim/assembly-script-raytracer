import { RayTracer } from './RayTracer';

declare namespace console {
  function debug(val: number): void;
}

@unmanaged
export class Pixel {
  r: u8;
  g: u8;
  b: u8;
  a: u8;
}

export function getPixel(x: i32, y: i32): Pixel {
  return changetype<Pixel>(getPixelOffset(x, y));
}

export function getPixelOffset(x: i32, y: i32): i32 {
  return (
    (RayTracer.renderBufferWidth * y + x) * sizeof<i32>() +
    RayTracer.renderBufferStartOffset
  );
}

export function setPixel(
  x: i32,
  y: i32,
  r: u8,
  g: u8,
  b: u8,
  a: u8 = 255,
): void {
  // store<i32>(getPixelOffset(x, y), (255 << 24) | (b << 16) | (g << 8) | r);
  let pixel = getPixel(x, y);
  pixel.r = r;
  pixel.g = g;
  pixel.b = b;
  pixel.a = 255;
}
