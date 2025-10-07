import reviewsData from "@/app/data/reviews.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function PUT(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/reviews/[id] [PUT]";
  logger.info("request start", { requestId, route, id: params.id });
  try {
    const idx = reviewsData.reviews.findIndex(r => r.id === params.id);
    if (idx === -1) {
      logger.warn("not found", { requestId, route, id: params.id });
      return Response.json({ message: "Review not found" }, { status: 404 });
    }
    const update = await request.json();
    const existing = reviewsData.reviews[idx];
    const updated = { ...existing, ...update, id: existing.id };
    reviewsData.reviews[idx] = updated;
    logger.info("request success", { requestId, route, status: 200, id: params.id });
    return Response.json(updated);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error), id: params.id });
    return Response.json({ message: "Bad Request" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/reviews/[id] [DELETE]";
  logger.info("request start", { requestId, route, id: params.id });
  try {
    const idx = reviewsData.reviews.findIndex(r => r.id === params.id);
    if (idx === -1) {
      logger.warn("not found", { requestId, route, id: params.id });
      return Response.json({ message: "Review not found" }, { status: 404 });
    }
    const [removed] = reviewsData.reviews.splice(idx, 1);
    logger.info("request success", { requestId, route, status: 200, id: params.id });
    return Response.json(removed);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error), id: params.id });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


