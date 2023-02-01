import { prismaOrm } from '../lib/prisma';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     <!--We manually set the two URLs we know already-->
     <url>
      <loc>${process.env.BASE_URL}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
     </url>
     <url>
      <loc>${process.env.BASE_URL}/pages/about</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
     </url>
     <url>
      <loc>${process.env.BASE_URL}/pages/contact</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
     </url>
     <url>
      <loc>${process.env.BASE_URL}/pages/privacy-policy</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
     </url>
     <url>
      <loc>${process.env.BASE_URL}/pages/terms-and-conditions</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
     </url>
     ${posts
       .map((a) => {
         return `
       <url>
            <loc>${`${process.env.BASE_URL}/${a.slug}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site

  const posts = await prismaOrm.post.findMany({
    select: {
      title: true,
      slug: true,
      publishedAt: true,
    },
    where: {
      isPublished: true,
    },
  });
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
