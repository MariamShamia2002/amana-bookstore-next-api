import reviewsData from "@/app/data/reviews.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/reviews/[bookId] [GET]";
  const { bookId } = params;

  logger.info("request start", { requestId, route, bookId });

  try {
    const reviews = reviewsData.reviews.filter((r) => r.bookId === bookId);

    if (reviews.length === 0) {
      logger.warn("not found", { requestId, route, bookId });
      return Response.json({ message: "No reviews for this book" }, { status: 404 });
    }

    const res = Response.json(reviews);
    logger.info("request success", {
      requestId,
      route,
      status: 200,
      count: reviews.length,
    });
    return res;
  } catch (error) {
    logger.error("request error", {
      requestId,
      route,
      error: String(error),
      bookId,
    });
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

