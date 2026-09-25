import { proxyBackend } from "@/lib/backend-proxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const suffix = path.length ? `/${path.join("/")}` : "";
  return proxyBackend(`/v3/api-docs${suffix}`);
}
