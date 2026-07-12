import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL || 'http://localhost:3050/api';

const AUTH_ENDPOINTS = new Set([
  '/auth/login',
  '/auth/login/2fa',
  '/auth/signup',
  '/auth/refresh',
]);

const LOGOUT_ENDPOINT = '/auth/logout';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

function buildUrl(req: NextRequest, path: string): string {
  const url = new URL(`${BACKEND_URL}/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

function buildHeaders(req: NextRequest, accessToken?: string): Headers {
  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const accept = req.headers.get('accept');
  if (accept) headers.set('accept', accept);
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  return headers;
}

async function proxyFetch(
  req: NextRequest,
  path: string,
  accessToken?: string
): Promise<Response> {
  const headers = buildHeaders(req, accessToken);
  const init: RequestInit = {
    method: req.method,
    headers,
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
    // @ts-expect-error duplex is required for streaming request bodies
    init.duplex = 'half';
  }
  return fetch(buildUrl(req, path), init);
}

async function tryRefresh(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  res.cookies.set('access_token', accessToken, COOKIE_OPTIONS);
  res.cookies.set('refresh_token', refreshToken, COOKIE_OPTIONS);
}

function clearAuthCookies(res: NextResponse): void {
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
}

function passthroughResponse(response: Response): NextResponse {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'transfer-encoding') {
      headers.set(key, value);
    }
  });
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handleRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path: segments } = await params;
  const path = segments.join('/');
  const fullPath = `/${path}`;

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  let response = await proxyFetch(req, path, accessToken);
  let refreshedTokens: { accessToken: string; refreshToken: string } | null = null;

  if (
    response.status === 401 &&
    refreshToken &&
    !AUTH_ENDPOINTS.has(fullPath)
  ) {
    refreshedTokens = await tryRefresh(refreshToken);
    if (refreshedTokens) {
      response = await proxyFetch(req, path, refreshedTokens.accessToken);
    }
  }

  if (AUTH_ENDPOINTS.has(fullPath)) {
    const body = await response.text();
    const res = new NextResponse(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
    if (response.ok) {
      try {
        const json = JSON.parse(body);
        if (json?.data?.accessToken && json?.data?.refreshToken) {
          setAuthCookies(res, json.data.accessToken, json.data.refreshToken);
        }
      } catch {
        // response wasn't JSON — pass through as-is
      }
    }
    return res;
  }

  if (fullPath === LOGOUT_ENDPOINT) {
    const body = await response.text();
    const res = new NextResponse(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
    clearAuthCookies(res);
    return res;
  }

  if (refreshedTokens) {
    const body = await response.text();
    const res = new NextResponse(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
    setAuthCookies(res, refreshedTokens.accessToken, refreshedTokens.refreshToken);
    return res;
  }

  return passthroughResponse(response);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, ctx.params);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, ctx.params);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, ctx.params);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, ctx.params);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, ctx.params);
}
