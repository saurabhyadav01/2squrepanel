/**
 * Get the correct image URL for products
 * If the image URL is relative (starts with /), prepend the main website URL
 * Otherwise, use the URL as-is
 */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "/placeholder.svg";
  }

  // If it's already a full URL (http/https), use it as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative path, prepend the main website URL
  if (imageUrl.startsWith("/")) {
    const mainWebsiteUrl = process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL || "http://localhost:3000";
    return `${mainWebsiteUrl}${imageUrl}`;
  }

  // Otherwise, return as-is (might be a data URL or other format)
  return imageUrl;
}

