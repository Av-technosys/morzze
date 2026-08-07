export function getImageURL(image: string | null | undefined) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL!;

  if (!image) return "";

  if (
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const imagePath = image
    .replace(/^\/+/, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${baseUrl}/${imagePath}?tr=f-auto,q-auto`;
}
