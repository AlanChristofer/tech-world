const fallbackBackendUrls = ["http://localhost:8081", "http://localhost:8080"];

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

export async function fetchBackend(path: string) {
  let lastError: unknown;

  for (const baseUrl of backendUrls()) {
    try {
      return await fetch(`${baseUrl}${path}`, {
        cache: "no-store",
        headers: { Accept: "*/*" },
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Backend unavailable");
}

export async function proxyBackend(path: string) {
  try {
    const response = await fetchBackend(path);
    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    const cacheControl = response.headers.get("cache-control");

    if (contentType) headers.set("content-type", contentType);
    if (cacheControl) headers.set("cache-control", cacheControl);

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
