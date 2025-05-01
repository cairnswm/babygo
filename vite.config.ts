import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-landing-html-and-spinner',
      apply: 'build',
      enforce: 'post',
      async generateBundle(_, bundle) {
        const indexFile = Object.keys(bundle).find((f) => f.endsWith('index.html'));
        if (!indexFile) return;
        const indexAsset = bundle[indexFile];
        let html = indexAsset.source;
        let landingHtml = '';
        try {
          landingHtml = fs.readFileSync(path.resolve(__dirname, 'public/landing.html'), 'utf-8');
        } catch {
          landingHtml = '<div>Landing content not found</div>';
        }
        const spinner = `<div id=\"ssr-spinner\" style=\"position:fixed;z-index:9999;inset:0;display:flex;align-items:center;justify-content:center;background:white;\"><div class=\"animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500\"></div></div>`;
        html = html.replace('<body>', `<body><div id="root">${landingHtml}${spinner}</div>`);
        indexAsset.source = html;
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
