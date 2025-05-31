import { defineConfig } from 'rolldown';

export default defineConfig({
  input: './src/index.ts',
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
});
