export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://srap.vercel.app'; // Update this once deployed

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/owner-portal/dashboard/'], // Keep dashboards private from bots
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
