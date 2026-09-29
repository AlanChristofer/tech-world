const fallbackBackendUrls = process.env.NODE_ENV === "production" ? [] : ["http://localhost:8081", "http://localhost:8080"];

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function backendUrls() {
  return Array.from(new Set([
    process.env.API_URL,
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_API_URL,
    ...fallbackBackendUrls,
  ].filter((value): value is string => Boolean(value)).map(normalizeBaseUrl)));
}

export async function fetchBackend(path: string, init: RequestInit = {}) {
  let lastError: unknown;

  for (const baseUrl of backendUrls()) {
    try {
      const headers = new Headers(init.headers);
      if (!headers.has("Accept")) headers.set("Accept", "*/*");
      return await fetch(`${baseUrl}${path}`, {
        ...init,
        cache: "no-store",
        headers,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Backend unavailable");
}

export async function proxyBackend(path: string, init: RequestInit = {}) {
  try {
    const response = await fetchBackend(path, init);
    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    const cacheControl = response.headers.get("cache-control");
    const traceId = response.headers.get("x-trace-id");

    if (contentType) headers.set("content-type", contentType);
    if (cacheControl) headers.set("cache-control", cacheControl);
    if (traceId) headers.set("x-trace-id", traceId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return Response.json(
      { message: "API indisponível. Inicie o backend Spring Boot e tente novamente." },
      { status: 503 },
    );
  }
}
