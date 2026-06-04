import {
  getCategoryImageUrl,
  getProductImageUrl,
  isUnusableImageUrl,
} from './mediaUrl';

describe('mediaUrl', () => {
  it('flags pravatar and placehold as unusable', () => {
    expect(isUnusableImageUrl('https://pravatar.cc/')).toBe(true);
    expect(isUnusableImageUrl('https://placehold.co/600x400')).toBe(true);
    expect(
      isUnusableImageUrl(
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'
      )
    ).toBe(false);
  });

  it('returns unsplash fallback for string category and products', () => {
    expect(getCategoryImageUrl(6, 'https://pravatar.cc/')).toMatch(/unsplash/);
    expect(getProductImageUrl(56, ['https://pravatar.cc/'])).toMatch(/unsplash/);
    expect(getProductImageUrl(57, ['https://placehold.co/600x400'])).toMatch(
      /unsplash/
    );
  });
});
