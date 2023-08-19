import * as esbuild from 'esbuild';
import { GasPlugin } from 'esbuild-gas-plugin';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/main.js',
  plugins: [GasPlugin],
});
