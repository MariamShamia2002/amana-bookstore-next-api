import booksData from "@/app/data/books.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/booksByDate [GET]";
  logger.info("request start", { requestId, route, url: request.url });

  try {
    const { searchParams } = new URL(request.url);
    const startRaw = searchParams.get("start");
    const endRaw = searchParams.get("end");

    if (!startRaw || !endRaw) {
      logger.warn("missing params", { requestId, route, startRaw, endRaw });
      return Response.json({ message: "Missing start or end query params" }, { status: 400 });
    }

    // Parse as UTC midnight if format is YYYY-MM-DD to avoid TZ issues
    const start = new Date(/^\d{4}-\d{2}-\d{2}$/.test(startRaw) ? `${startRaw}T00:00:00Z` : startRaw);
    const end = new Date(/^\d{4}-\d{2}-\d{2}$/.test(endRaw) ? `${endRaw}T23:59:59Z` : endRaw);

    if (isNaN(start) || isNaN(end)) {
      logger.warn("invalid date", { requestId, route, startRaw, endRaw });
      return Response.json({ message: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }

    if (start > end) {
      logger.warn("start after end", { requestId, route, start: startRaw, end: endRaw });
      return Response.json({ message: "'start' must be before or equal to 'end'" }, { status: 400 });
    }

    if (!booksData?.books || !Array.isArray(booksData.books)) {
      logger.error("invalid data structure", { requestId, route });
      return Response.json({ message: "No books found" }, { status: 404 });
    }

    const results = booksData.books.filter((b) => {
      const published = new Date(b.datePublished);
      return !isNaN(published) && published >= start && published <= end;
    });

    logger.info("request success", { requestId, route, count: results.length });
    // Return 200 with possibly empty list for consistency with other endpoints
    return Response.json(results);
  } catch (err) {
    logger.error("request error", { requestId, route, error: String(err) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
