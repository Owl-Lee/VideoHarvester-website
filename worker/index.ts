/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { OLD_SITE_HOST } from "../app/site-data";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === OLD_SITE_HOST) {
      url.protocol = "https:";
      url.hostname = "videoharvester.app";
      url.port = "";
      return Response.redirect(url, 308);
    }

    // Keep shareable document URLs deterministic. Next/Vinext serializes the
    // incoming URL into its RSC bootstrap data, so unknown query parameters
    // would otherwise be reflected into the rendered HTML. RSC/data requests
    // are deliberately excluded because their private query keys are part of
    // the framework protocol.
    const acceptsHtml = request.headers.get("accept")?.includes("text/html") ?? false;
    const isDocumentRequest =
      (request.method === "GET" || request.method === "HEAD") &&
      url.pathname === "/" &&
      (request.headers.get("sec-fetch-dest") === "document" || acceptsHtml);

    if (isDocumentRequest && url.searchParams.size > 0) {
      const languageValues = url.searchParams.getAll("lang");
      const hasSingleValidLanguage =
        languageValues.length === 1 && (languageValues[0] === "en" || languageValues[0] === "zh");
      const hasUnknownParameters = [...url.searchParams.keys()].some((key) => key !== "lang");

      if (!hasSingleValidLanguage || hasUnknownParameters) {
        const preservedLanguage = hasSingleValidLanguage ? languageValues[0] : null;
        url.search = "";
        if (preservedLanguage) {
          url.searchParams.set("lang", preservedLanguage);
        }
        return Response.redirect(url, 308);
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-videoharvester-language", url.searchParams.get("lang") === "zh" ? "zh" : "en");
    const appRequest = new Request(request, { headers: requestHeaders });

    return handler.fetch(appRequest, env, ctx);
  },
};

export default worker;
