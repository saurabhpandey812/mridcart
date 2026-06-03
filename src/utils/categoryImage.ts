const BROKEN_IMAGE_HOSTS = ['placeimg.com'];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3525f0cc79?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988350-763728e3685b?w=800&q=80',
  'https://images.unsplash.com/photo-1529139574469-a303027c1d8b?w=800&q=80',
];

function isBrokenImageUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return BROKEN_IMAGE_HOSTS.some((broken) => host.includes(broken));
  } catch {
    return true;
  }
}

export function getCategoryImageUrl(
  categoryId: number,
  image?: string | null,
  variant: 'card' | 'hero' = 'card'
): string {
  if (!isBrokenImageUrl(image)) return image!.trim();

  const index = Math.abs(categoryId) % FALLBACK_IMAGES.length;
  const base = FALLBACK_IMAGES[index];
  if (variant === 'hero') {
    return base.replace('w=800', 'w=1600');
  }
  return base;
}
