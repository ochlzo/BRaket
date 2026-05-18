export function getServiceMediaCollageLayout(totalImages: number) {
  const safeTotal = Math.max(0, totalImages);

  if (safeTotal >= 5) {
    return {
      hiddenCount: safeTotal - 2,
      visibleImageCount: 2,
    };
  }

  return {
    hiddenCount: 0,
    visibleImageCount: Math.min(safeTotal, 4),
  };
}
