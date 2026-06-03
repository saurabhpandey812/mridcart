export function getCategoryPath(categoryId: number): string {
  return `/category/${categoryId}`;
}

export function parseCategoryRouteId(pathname: string): number | null {
  const match = pathname.match(/^\/category\/(\d+)$/);
  if (!match) return null;
  const id = parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
}
