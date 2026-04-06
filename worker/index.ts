export interface Env {
  DB: D1Database;
  ADMIN_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    if (pathname === "/api/health" && request.method === "GET") {
      return new Response(
        JSON.stringify({ status: "ok", service: "client-portal-api", ts: Date.now() }),
        { status: 200, headers }
      );
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers,
    });
  },
};
