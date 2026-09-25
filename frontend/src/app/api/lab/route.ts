import type { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/backend-proxy";

const allowedEndpoints = new Set(["/api/profile", "/api/projects", "/api/skills"]);

export async function GET(request: NextRequest) {
  const endpoint = request.nextUrl.searchParams.get("endpoint");

  if (!endpoint || !allowedEndpoints.has(endpoint)) {
    return Response.json({ message: "Endpoint não permitido no Developer Lab." }, { status: 400 });
  }

  return proxyBackend(endpoint);
}
