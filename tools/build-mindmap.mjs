import { cp, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'themes/butterfly/source/vendor/mindmap');
const legacyOutputDirectory = resolve(projectRoot, 'source/vendor/mindmap');
const katexDirectory = dirname(require.resolve('katex/package.json'));

await rm(legacyOutputDirectory, { recursive: true, force: true });
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all([
  build({
    entryPoints: [resolve(projectRoot, 'assets/mindmap/client.js')],
    outfile: resolve(outputDirectory, 'mindmap.min.js'),
    bundle: true,
    format: 'iife',
    minify: true,
    target: ['es2018'],
    legalComments: 'none'
  }),
  cp(resolve(katexDirectory, 'dist/katex.min.css'), resolve(outputDirectory, 'katex.min.css')),
  cp(resolve(katexDirectory, 'dist/fonts'), resolve(outputDirectory, 'fonts'), { recursive: true })
]);

console.log('Built local Markmap and KaTeX assets.');
