const MOCK_API_URL = (
  process.env.MOCK_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

export async function fetchMockApi(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${MOCK_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}