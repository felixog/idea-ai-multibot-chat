// Fails on raw colours or literal font sizes anywhere in src outside the two token files.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const ALLOWED = new Set(['styles/tokens.css', 'styles/typography.css']);
const RULES = [
  { name: 'hex colour', re: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb()', re: /\brgba?\(/g },
  { name: 'hsl()', re: /\bhsla?\(/g },
  { name: 'literal font-size', re: /font-size\s*:\s*(?!var\()[^;]+/g },
  { name: 'literal line-height', re: /line-height\s*:\s*(?!var\(|normal|inherit)[^;]+/g },
  { name: 'inline fontSize', re: /fontSize\s*:/g },
  { name: 'inline lineHeight', re: /lineHeight\s*:/g },
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let failures = 0;
for (const file of walk(ROOT)) {
  if (!/\.(ts|tsx|css)$/.test(file)) continue;
  const rel = relative(ROOT, file);
  if (ALLOWED.has(rel)) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // Ignore the id fragment in JSX/CSS selectors like `#root` only when followed by non-hex letters.
    for (const { name, re } of RULES) {
      for (const m of line.matchAll(re)) {
        failures++;
        console.log(`src/${rel}:${i + 1}  ${name}  ${m[0].trim()}`);
      }
    }
  });
}

if (failures) {
  console.error(`\ncheck:tokens failed with ${failures} match(es).`);
  process.exit(1);
}
console.log('check:tokens passed: no raw colours or literal type sizes outside tokens.css and typography.css.');
