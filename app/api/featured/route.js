import booksData from "@/app/data/books.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/featured [GET]";
  logger.info("request start", { requestId, route });
  try {
    if (!booksData?.books || !Array.isArray(booksData.books)) {
      logger.warn("invalid data structure", { requestId, route });
      return Response.json([]);
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10) || 0) : undefined;

    const featuredAll = booksData.books.filter(b => Boolean(b.featured));
    const featured = typeof limit === "number" ? featuredAll.slice(0, limit) : featuredAll;

    const res = Response.json(featured);
    logger.info("request success", { requestId, route, status: 200, count: featured.length });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
