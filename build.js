#!/usr/bin/env node
import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin to handle SCSS compilation
const scssPlugin = {
  name: 'scss',
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, async (args) => {
      const sass = await import('sass');
      const result = sass.compile(args.path, {
        style: 'compressed',
        sourceMap: false
      });

      // Return CSS as a string that gets injected into JS
      const cssContent = result.css.toString();
      const js = `
        const css = ${JSON.stringify(cssContent)};
        if (typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style);
        }
        export default css;
      `;

      return {
        contents: js,
        loader: 'js'
      };
    });
  }
};

async function build() {
  try {
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // Build configuration
    const buildConfig = {
      entryPoints: ['src/index.ts'],
      bundle: true,
      outdir: 'dist',
      format: 'esm',
      target: 'es2020',
      sourcemap: true,
      minify: true,
      external: ['jsondiffpatch', 'fast-safe-stringify'],
      plugins: [scssPlugin],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };

    // ESM
    await esbuild.build({
      ...buildConfig,
      outExtension: { '.js': '.esm.js' }
    });

    // CJS
    await esbuild.build({
      ...buildConfig,
      format: 'cjs',
      outExtension: { '.js': '.cjs.js' }
    });

    console.log('Build completed.');
    console.log('  - dist/index.esm.js (ES modules)');
    console.log('  - dist/index.cjs.js (CommonJS)');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build(); 