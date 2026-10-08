import { createSocialImage } from "../social-image";

export function GET(request: Request) {
  const markUrl = new URL("/branding/tech-world-mark.svg", request.url).toString();
  const earthDayUrl = new URL("/textures/earth/earth-day.jpg", request.url).toString();
  const earthLightsUrl = new URL("/textures/earth/earth-lights.png", request.url).toString();
  return createSocialImage({ markUrl, earthDayUrl, earthLightsUrl });
}
