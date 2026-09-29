import { proxyBackend } from "@/lib/backend-proxy";

type LabRouteContext = { params: Promise<{ path: string[] }> };

function backendPath(path: string[]) {
  return `/api/lab/${path.join("/")}`;
}

export async function GET(_request: Request, { params }: LabRouteContext) {
  const { path } = await params;
  return proxyBackend(backendPath(path));
}

export async function POST(request: Request, { params }: LabRouteContext) {
  const { path } = await params;
  const headers = new Headers({ "Content-Type": request.headers.get("content-type") ?? "application/json" });
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) headers.set("X-Forwarded-For", forwardedFor);
  return proxyBackend(backendPath(path), {
    method: "POST",
    body: await request.text(),
    headers,
  });
}
