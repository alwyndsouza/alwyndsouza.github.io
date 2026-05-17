export const dynamic = "force-static";

const SITE_URL = "https://alwyndsouza.github.io";

export async function GET() {
  const text = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
