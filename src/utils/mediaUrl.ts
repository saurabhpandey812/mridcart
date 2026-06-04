/** Unreliable or non-product image hosts from the demo API */
const UNUSABLE_HOSTS = ['placeimg.com', 'pravatar.cc', 'placehold.co'];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3525f0cc79?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988350-763728e3685b?w=800&q=80',
  'https://images.unsplash.com/photo-1529139574469-a303027c1d8b?w=800&q=80',
];

export function isUnusableImageUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return true;
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    return UNUSABLE_HOSTS.some((blocked) => host.includes(blocked));
  } catch {
    return true;
  }
}

function fallbackById(id: number, variant: 'card' | 'hero' | 'thumb' = 'card'): string {
  const index = Math.abs(id) % FALLBACK_IMAGES.length;
  const base = FALLBACK_IMAGES[index];
  if (variant === 'hero') return base.replace('w=800', 'w=1600');
  if (variant === 'thumb') return base.replace('w=800', 'w=200');
  return base;
}

export function getCategoryImageUrl(
  categoryId: number,
  image?: string | null,
  variant: 'card' | 'hero' = 'card'
): string {
  if (!isUnusableImageUrl(image)) return image!.trim();
  return fallbackById(categoryId, variant);
}

export function getProductImageUrl(
  productId: number,
  images?: string[] | null,
  variant: 'card' | 'hero' | 'thumb' = 'card'
): string {
  for (const img of images ?? []) {
    if (!isUnusableImageUrl(img)) return img.trim();
  }
  return fallbackById(productId, variant);
}
