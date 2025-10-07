import booksData from "@/app/data/books.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/search [GET]";
  logger.info("request start", { requestId, route });

  try {
    const { searchParams } = new URL(request.url);
    const queryRaw = searchParams.get("q") || "";
    const query = queryRaw.trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10) || 0) : undefined;

    if (!query) {
      logger.warn("missing query", { requestId, route });
      return Response.json({ message: "Query parameter 'q' is required" }, { status: 400 });
    }

    const resultsAll = booksData.books.filter((book) => {
      const title = book.title?.toLowerCase?.() || "";
      const author = book.author?.toLowerCase?.() || "";
      const genres = Array.isArray(book.genre) ? book.genre.map(g => (g || "").toLowerCase()) : [];
      const tags = Array.isArray(book.tags) ? book.tags.map(t => (t || "").toLowerCase()) : [];
      if (!title && !author && genres.length === 0 && tags.length === 0) return false;
      if (title.includes(query)) return true;
      if (author.includes(query)) return true;
      if (genres.some(g => g.includes(query))) return true;
      if (tags.some(t => t.includes(query))) return true;
      return false;
    });

    const results = typeof limit === "number" ? resultsAll.slice(0, limit) : resultsAll;

    logger.info("request success", { requestId, route, count: results.length });
    // Always return 200 with an array (possibly empty) for consistency
    return Response.json(results);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
