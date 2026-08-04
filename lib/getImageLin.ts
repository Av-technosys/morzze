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

  return `${baseUrl}/${image.replace(/^\/+/, "")}?tr=f-auto,q-auto`;
}
