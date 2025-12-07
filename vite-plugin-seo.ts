import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface SEOPluginOptions {
  baseUrl?: string;
  routes?: Array<{ path: string; priority?: number; changefreq?: string; lastmod?: string }>;
}

export function seoPlugin(options: SEOPluginOptions = {}): Plugin {
  // Determine base URL from environment variables or options
  const getBaseUrl = (): string => {
    if (options.baseUrl) {
      return options.baseUrl;
    }
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
  const routes = options.routes || [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/marketjd', priority: 0.8, changefreq: 'monthly' },
    { path: '/portfolio', priority: 0.8, changefreq: 'monthly' }
  ];

  return {
    name: 'vite-plugin-seo',
    apply: 'build',
    buildStart() {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Generate professional robots.txt
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

      // Generate professional sitemap.xml
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
  
  return `  <url>
    <loc>${baseUrl}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

      // Write files to public directory (will be copied to dist during build)
      const publicDir = path.resolve(process.cwd(), 'public');
      
      try {
        // Ensure public directory exists
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(
          path.join(publicDir, 'robots.txt'),
          robotsContent,
          'utf-8'
        );
        
        fs.writeFileSync(
          path.join(publicDir, 'sitemap.xml'),
          sitemapContent,
          'utf-8'
        );

        console.log(`\n✅ SEO Plugin: Generated robots.txt and sitemap.xml`);
        console.log(`   Base URL: ${baseUrl}`);
        console.log(`   Routes: ${routes.length}\n`);
      } catch (error) {
        console.error('❌ SEO Plugin Error:', error);
      }
    }
  };
}

