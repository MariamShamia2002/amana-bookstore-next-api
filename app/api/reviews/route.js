import reviewsData from "@/app/data/reviews.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/reviews [GET]";
  logger.info("request start", { requestId, route });

  try {
    const res = Response.json(reviewsData.reviews);
    logger.info("request success", {
      requestId,
      route,
      status: 200,
      count: reviewsData.reviews.length,
    });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const requestId = getRequestId(request);
  const route = "/api/reviews [POST]";
  logger.info("request start", { requestId, route });

  try {
    const newReview = await request.json();
    newReview.id = `review-${reviewsData.reviews.length + 1}`;
    newReview.timestamp = new Date().toISOString();
    reviewsData.reviews.push(newReview);

    const res = Response.json(newReview, { status: 201 });
    logger.info("request success", {
      requestId,
      route,
      status: 201,
      id: newReview.id,
    });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Bad Request" }, { status: 400 });
  }
}

