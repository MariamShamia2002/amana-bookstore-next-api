import booksData from "@/app/data/books.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/books/[id] [GET]";
  logger.info("request start", { requestId, route, id: params.id });
  try {
    const book = booksData.books.find(b => b.id === params.id);
    if (!book) {
      logger.warn("not found", { requestId, route, id: params.id });
      return Response.json({ message: "Book not found" }, { status: 404 });
    }
    const res = Response.json(book);
    logger.info("request success", { requestId, route, status: 200, id: params.id });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error), id: params.id });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/books/[id] [PUT]";
  logger.info("request start", { requestId, route, id: params.id });
  try {
    const idx = booksData.books.findIndex(b => b.id === params.id);
    if (idx === -1) {
      logger.warn("not found", { requestId, route, id: params.id });
      return Response.json({ message: "Book not found" }, { status: 404 });
    }
    const update = await request.json();
    const existing = booksData.books[idx];
    const updated = { ...existing, ...update, id: existing.id };
    booksData.books[idx] = updated;
    logger.info("request success", { requestId, route, status: 200, id: params.id });
    return Response.json(updated);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error), id: params.id });
    return Response.json({ message: "Bad Request" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const requestId = getRequestId(request);
  const route = "/api/books/[id] [DELETE]";
  logger.info("request start", { requestId, route, id: params.id });
  try {
    const idx = booksData.books.findIndex(b => b.id === params.id);
    if (idx === -1) {
      logger.warn("not found", { requestId, route, id: params.id });
      return Response.json({ message: "Book not found" }, { status: 404 });
    }
    const [removed] = booksData.books.splice(idx, 1);
    logger.info("request success", { requestId, route, status: 200, id: params.id });
    return Response.json(removed);
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error), id: params.id });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
