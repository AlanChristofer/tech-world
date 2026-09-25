export function GET(request: Request) {
  return Response.redirect(new URL("/swagger-ui/index.html", request.url), 307);
}
