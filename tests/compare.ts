import fs from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export interface DiffResult {
  ratio: number;
  diffPixels: number;
  /** Largest square of solid difference found on a 24px grid (rough region check). */
  worstCell: number;
  heights: { local: number; figma: number };
}

/** Compares two PNGs over their common area; writes a diff image. */
export function compare(localPath: string, figmaPath: string, diffPath: string): DiffResult {
  const a = PNG.sync.read(fs.readFileSync(localPath));
  const b = PNG.sync.read(fs.readFileSync(figmaPath));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const crop = (img: PNG) => {
    const out = new PNG({ width, height });
    PNG.bitblt(img, out, 0, 0, width, height, 0, 0);
    return out;
  };
  const ca = crop(a);
  const cb = crop(b);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(ca.data, cb.data, diff.data, width, height, { threshold: 0.1, includeAA: false });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  // Count differing pixels per 24x24 cell; report the fullest cell's fill ratio.
  let worstCell = 0;
  for (let y = 0; y + 24 <= height; y += 24) {
    for (let x = 0; x + 24 <= width; x += 24) {
      let n = 0;
      for (let yy = y; yy < y + 24; yy++) {
        for (let xx = x; xx < x + 24; xx++) {
          const i = (yy * width + xx) * 4;
          if (diff.data[i] === 255 && diff.data[i + 1] === 0) n++;
        }
      }
      worstCell = Math.max(worstCell, n / 576);
    }
  }
  return { ratio: diffPixels / (width * height), diffPixels, worstCell, heights: { local: a.height, figma: b.height } };
}
