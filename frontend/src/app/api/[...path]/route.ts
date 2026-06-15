import { NextRequest } from "next/server";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const url = new URL(request.url);
  const target = `${API_INTERNAL_URL}/${path.join("/")}${url.search}`;
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  let response: Response | undefined;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      response = await fetch(target, {
        method: request.method,
        headers: {
          "Content-Type":
            request.headers.get("Content-Type") ?? "application/json",
        },
        body,
      });
      break;
    } catch (error) {
      lastError = error;
      await wait(300 * attempt);
    }
  }

  if (!response) {
    console.error("API proxy failed", lastError);
    return Response.json(
      {
        message:
          "Nao foi possivel conectar na API. Confira se o container stackstore-api esta rodando.",
      },
      { status: 503 },
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
