import { createSocialImage } from "../social-image";

export function GET(request: Request) {
  const markUrl = new URL("/branding/tech-world-mark.svg", request.url).toString();
  return createSocialImage(markUrl);
}
