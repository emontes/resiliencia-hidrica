import { createServer } from "node:http";

const requests = [];

createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:4318");
  if (request.method === "GET") {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(url.pathname === "/requests"
      ? requests.filter(entry => entry.body.email === url.searchParams.get("email"))
      : { status: "ok" }));
    return;
  }

  let raw = "";
  for await (const chunk of request) raw += chunk;
  const body = JSON.parse(raw);
  requests.push({ path: url.pathname, body, contentType: request.headers["content-type"] });

  if (url.pathname === "/webhook" && body.email.startsWith("redirect-")) {
    response.writeHead(307, { Location: "/leaked" });
    response.end();
    return;
  }
  if (body.email.startsWith("timeout-")) return;
  if (body.email.startsWith("failure-")) {
    response.writeHead(500);
    response.end("Private upstream error: secret-webhook-token");
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ status: "ok" }));
}).listen(4318, "127.0.0.1");
