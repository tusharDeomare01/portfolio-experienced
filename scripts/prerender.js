#!/usr/bin/env node

/**
 * Pre-render script for SEO
 * This script can be used to pre-render critical pages for better SEO
 * Note: This requires puppeteer to be installed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Check if puppeteer is available
let puppeteer;
try {
  puppeteer = await import('puppeteer');
} catch (error) {
  console.log('⚠️  Puppeteer not installed. Skipping pre-rendering.');
  console.log('   Install with: npm install --save-dev puppeteer');
  console.log('   This is optional but recommended for better SEO.\n');
  process.exit(0);
}

async function prerender() {
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist directory. Run build first.');
    process.exit(1);
  }

  console.log('🚀 Starting pre-rendering...\n');

  const browser = await puppeteer.default.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const routes = ['/', '/marketjd', '/portfolio'];
  
  for (const route of routes) {
    try {
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to the route
      const filePath = route === '/' 
        ? `file://${indexPath}`
        : `file://${indexPath}`;
      
      await page.goto(filePath, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for content to render (adjust selector based on your app)
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Wait a bit more for lazy-loaded content
      await page.waitForTimeout(2000);

      // Get the rendered HTML
      const html = await page.content();

      // Save the pre-rendered HTML
      if (route === '/') {
        fs.writeFileSync(indexPath, html, 'utf-8');
        console.log(`✅ Pre-rendered: ${route}`);
      } else {
        const routeDir = path.join(distDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
        console.log(`✅ Pre-rendered: ${route}`);
      }

      await page.close();
    } catch (error) {
      console.error(`❌ Error pre-rendering ${route}:`, error.message);
    }
  }

  await browser.close();
  console.log('\n✨ Pre-rendering complete!\n');
}

prerender().catch((error) => {
  console.error('❌ Pre-rendering failed:', error);
  process.exit(1);
});
