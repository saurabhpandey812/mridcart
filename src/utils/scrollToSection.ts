export function scrollToSection(id: string, delayMs = 150): void {
  const run = () => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (delayMs > 0) {
    requestAnimationFrame(() => setTimeout(run, delayMs));
  } else {
    run();
  }
}

export function categorySectionId(categoryId: number): string {
  return `category-${categoryId}`;
}
