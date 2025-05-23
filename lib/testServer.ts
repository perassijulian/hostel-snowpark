import { createServer } from "http";
import { Readable } from "stream";
import { handleAvailability } from "./handlers/accommodation";

export const app = createServer(async (req, res) => {
  const { method, headers, url } = req;

  // Build full URL for Request object
  const fullUrl = `http://localhost${url}`;
  const body = await getRawBody(req);

  // Convert Node.js headers to HeadersInit (array of [string, string] pairs)
  const headersInit: [string, string][] = Object.entries(headers).map(
    ([key, value]) => [
      key,
      Array.isArray(value) ? value.join(", ") : value ?? "",
    ]
  );

  const request = new Request(fullUrl, {
    method,
    headers: headersInit,
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });

  const response = await handleAvailability(request);

  // Pipe response to native http.ServerResponse
  res.writeHead(
    response.status,
    Object.fromEntries(response.headers.entries())
  );
  const responseBody = await response.text();
  res.end(responseBody);
});

async function getRawBody(
  stream: Readable
): Promise<ReadableStream | undefined> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.length > 0
    ? new ReadableStream({
        start(controller) {
          controller.enqueue(buffer);
          controller.close();
        },
      })
    : undefined;
}
