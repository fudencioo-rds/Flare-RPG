export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        application: "Flare RPG",
        status: "ok"
      });
    }

    return new Response("Not Found", {
      status: 404
    });
  }
};
