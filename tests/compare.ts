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

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Compares two PNGs over their common area; masked boxes (artwork) are blanked in both first. Writes a diff image. */
export function compare(localPath: string, figmaPath: string, diffPath: string, masks: Box[] = []): DiffResult {
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
  for (const m of masks) {
    for (let y = Math.max(0, Math.floor(m.y)); y < Math.min(height, Math.ceil(m.y + m.height)); y++) {
      for (let x = Math.max(0, Math.floor(m.x)); x < Math.min(width, Math.ceil(m.x + m.width)); x++) {
        const i = (y * width + x) * 4;
        for (const img of [ca, cb]) {
          img.data[i] = 128;
          img.data[i + 1] = 128;
          img.data[i + 2] = 128;
          img.data[i + 3] = 255;
        }
      }
    }
  }
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
