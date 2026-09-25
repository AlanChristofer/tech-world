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
  return proxyBackend(backendPath(path), {
    method: "POST",
    body: await request.text(),
    headers: { "Content-Type": request.headers.get("content-type") ?? "application/json" },
  });
}
