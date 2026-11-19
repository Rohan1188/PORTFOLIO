
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");
// Centralized API configuration.
// Empty API_BASE_URL preserves Vite proxy behavior during local development.

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

let csrf = "";

export const setCsrf = (token: string) => {
  csrf = token;
};

export async function api<T = any>(
  path: string,
  opts: {
    method?: string;
    body?: any;
    raw?: boolean;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };

  if (!opts.raw && opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (method !== "GET" && csrf) {
    headers["x-csrf-token"] = csrf;
  }

const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: opts.raw
      ? opts.body
      : opts.body !== undefined
        ? JSON.stringify(opts.body)
        : undefined,
  });

  const data = res.headers.get("content-type")?.includes("json")
    ? await res.json().catch(() => ({}))
    : {};

  if (!res.ok) {
    throw new ApiError(
      data.error || `Request failed (${res.status})`,
      res.status,
      data.fields
    );
  }

  return data as T;
}

export const pub = <T = any>(path: string) =>
  api<T>(`/api/public${path}`);

export const admin = <T = any>(
  path: string,
  opts?: Parameters<typeof api>[1]
) => api<T>(`/api/admin${path}`);
