import booksData from "../../data/books.json";
import { logger, getRequestId } from "../../lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/top-rated [GET]";
  logger.info("request start", { requestId, route });

  try {
    if (!booksData?.books || !Array.isArray(booksData.books)) {
      logger.warn("booksData missing or invalid", { requestId, route });
      return Response.json({ message: "No books found" }, { status: 404 });
    }

    const top = [...booksData.books]
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 10);

    logger.info("request success", { requestId, route, status: 200, count: top.length });
    return Response.json(top);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


