#!/usr/bin/env node

/**
 * SEO Files Generator
 * Generates robots.txt and sitemap.xml with dynamic base URL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base URL from environment or use default
const getBaseUrl = () => {
  if (process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NETLIFY) {
    return process.env.URL || (process.env.DEPLOY_PRIME_URL ? `https://${process.env.DEPLOY_PRIME_URL}` : 'https://tushar-deomare-portfolio.vercel.app/');
  }
  return 'https://tushar-deomare-portfolio.vercel.app/';
};

const baseUrl = getBaseUrl();
const currentDate = new Date().toISOString().split('T')[0];
const publicDir = path.resolve(__dirname, '../public');

// Routes configuration
const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/marketjd', priority: 0.8, changefreq: 'monthly' },
  { path: '/portfolio', priority: 0.8, changefreq: 'monthly' }
];

// Generate robots.txt
const robotsContent = `# robots.txt
# Auto-generated at build time for ${baseUrl}
# Last updated: ${currentDate}

# Allow all search engines
User-agent: *
Allow: /

# Disallow admin/private areas (if any)
# Disallow: /admin/
# Disallow: /api/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (be respectful to server resources)
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`;

// Generate sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map((route) => {
  const routePath = route.path === '/' ? '' : route.path;
  const priority = route.priority || 0.8;
  const changefreq = route.changefreq || 'monthly';
  const lastmod = route.lastmod || currentDate;
  
  const formattedPriority = typeof priority === 'number' ? priority.toFixed(1) : priority;
  return `  <url>
    <loc>${baseUrl}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${formattedPriority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

// Write files
try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  
  console.log('\n✅ SEO Files Generated Successfully');
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Routes: ${routes.length}`);
  console.log(`   Date: ${currentDate}\n`);
} catch (error) {
  console.error('❌ Error generating SEO files:', error);
  process.exit(1);
}

